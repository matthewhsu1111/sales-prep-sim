import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Bot, User, Mic, MicOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  sender: 'ai' | 'user';
  timestamp: Date;
}

interface InterviewDetails {
  jobPosting: any;
  interviewType: string;
  numberOfQuestions: number;
}

interface LocationState {
  interviewDetails?: InterviewDetails;
}

export default function InterviewSession() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const state = location.state as LocationState;
  const interviewDetails = state?.interviewDetails;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Clean up function for media
  useEffect(() => {
    return () => {
      // Clean up all media when component unmounts
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [cameraStream]);

  // Initialize camera when needed
  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false
      });
      
      setCameraStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  // Start interview automatically with first question
  useEffect(() => {
    if (interviewDetails) {
      // Initialize camera first
      initializeCamera();
      
      const { getQuestionsForInterview } = require('@/data/interviewQuestions');
      const questions = getQuestionsForInterview(
        interviewDetails.interviewType, 
        interviewDetails.numberOfQuestions
      );
      
      if (questions.length > 0) {
        // Start immediately, no delay
        startInterview(questions[0]);
      }
    }
  }, [interviewDetails]);

  const startInterview = async (firstQuestion: string) => {
    const welcomeMessage = `Hello! I'm your AI interviewer for today's ${interviewDetails?.interviewType} interview. Let's get started with our first question.`;
    
    // Add AI welcome message
    const aiMessage: Message = {
      id: Date.now().toString(),
      content: welcomeMessage,
      sender: 'ai',
      timestamp: new Date()
    };
    
    setMessages([aiMessage]);
    
    // Convert to speech and play
    await speakMessage(welcomeMessage);
    
    // Immediately ask first question after welcome
    const questionMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: firstQuestion,
      sender: 'ai',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, questionMessage]);
    await speakMessage(firstQuestion);
  };

  const speakMessage = async (text: string) => {
    setIsAiSpeaking(true);
    try {
      const { data } = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice: 'alloy' }
      });
      
      if (data?.audioContent) {
        await playAudioFromBase64(data.audioContent);
      }
    } catch (error) {
      console.error('Error with text-to-speech:', error);
    } finally {
      setIsAiSpeaking(false);
    }
  };

  const playAudioFromBase64 = async (base64Audio: string): Promise<void> => {
    try {
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(bytes.buffer);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0);
      
      return new Promise((resolve) => {
        source.onended = () => resolve();
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      throw error;
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { sampleRate: 16000, channelCount: 1 } 
      });
      
      audioChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const base64Audio = await blobToBase64(audioBlob);
        
        try {
          const { data } = await supabase.functions.invoke('speech-to-text', {
            body: { audio: base64Audio.split(',')[1] }
          });
          
          if (data?.text) {
            const userMessage: Message = {
              id: Date.now().toString(),
              content: data.text,
              sender: 'user',
              timestamp: new Date()
            };
            
            setMessages(prev => [...prev, userMessage]);
            
            // Get AI response
            await getAIResponse(data.text);
          }
        } catch (error) {
          console.error('Error with speech-to-text:', error);
          toast({
            title: "Speech Recognition Error",
            description: "Could not process your speech. Please try again.",
            variant: "destructive",
          });
        }
        
        // Stop microphone stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsListening(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsListening(false);
    }
  };

  const getAIResponse = async (userMessage: string) => {
    try {
      const { data } = await supabase.functions.invoke('ai-interviewer', {
        body: {
          message: userMessage,
          jobPosting: interviewDetails?.jobPosting,
          interviewType: interviewDetails?.interviewType,
          questionContext: `This is question ${currentQuestionIndex + 1} of ${interviewDetails?.numberOfQuestions}`
        }
      });
      
      if (data?.response) {
        const aiMessage: Message = {
          id: Date.now().toString(),
          content: data.response,
          sender: 'ai',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        await speakMessage(data.response);
        setCurrentQuestionIndex(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleBackToDashboard = () => {
    // Clean up all media before navigating
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation Bar */}
      <div className="h-14 border-b bg-card flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">I</span>
          </div>
          <h1 className="text-lg font-semibold text-foreground">InterviewAI</h1>
        </div>
        <Button
          onClick={handleBackToDashboard}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4">
        {/* Left Side - Transcript */}
        <div className="w-2/5 bg-card rounded-lg border flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium text-foreground">Transcript</h2>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm mt-8">
                  Starting interview...
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.sender === 'ai'
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {message.sender === 'ai' ? (
                          <Bot className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                        <span className="text-xs opacity-70 font-medium">
                          {message.sender === 'ai' ? 'AI Interviewer' : 'You'}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Side - AI & Camera */}
        <div className="w-3/5 flex flex-col gap-4">
          {/* AI Interviewer Section */}
          <div className="flex-1 bg-card rounded-lg border flex flex-col items-center justify-center p-6">
            <div className="text-center">
              <Avatar 
                className={`h-24 w-24 mx-auto mb-4 ${
                  isAiSpeaking ? 'animate-pulse ring-4 ring-primary/30' : ''
                } transition-all duration-300`}
              >
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-medium text-foreground mb-2">AI Interviewer</h3>
              <p className="text-sm text-muted-foreground">
                {isAiSpeaking ? 'Speaking...' : isListening ? 'Listening...' : 'Ready'}
              </p>
            </div>
          </div>

          {/* User's Camera Section */}
          <div className="flex-1 bg-card rounded-lg border flex flex-col items-center justify-center p-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-medium text-foreground">Your Camera</h3>
            </div>
            <div className="relative bg-black rounded-lg overflow-hidden w-full max-w-md aspect-video mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            </div>
            
            {/* Microphone Control */}
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
              size="lg"
              className="flex items-center gap-2"
              disabled={isAiSpeaking}
            >
              {isRecording ? (
                <>
                  <MicOff className="h-5 w-5" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="h-5 w-5" />
                  Start Recording
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}