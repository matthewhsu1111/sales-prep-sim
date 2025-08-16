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

  // Initialize camera and audio only when component mounts
  useEffect(() => {
    let mounted = true;
    
    const initializeMedia = async () => {
      try {
        // Only initialize camera for this session
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: 'user' },
          audio: false
        });
        
        if (mounted) {
          setCameraStream(stream);
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else {
          // Clean up if component unmounted during async operation
          stream.getTracks().forEach(track => track.stop());
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

    initializeMedia();

    return () => {
      mounted = false;
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
  }, []);

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  // Start interview with first question
  useEffect(() => {
    if (interviewDetails) {
      const { getQuestionsForInterview } = require('@/data/interviewQuestions');
      const questions = getQuestionsForInterview(
        interviewDetails.interviewType, 
        interviewDetails.numberOfQuestions
      );
      
      if (questions.length > 0) {
        startInterview(questions[0]);
      }
    }
  }, [interviewDetails]);

  const startInterview = async (firstQuestion: string) => {
    const welcomeMessage = `Hello! I'm your AI interviewer for today's ${interviewDetails?.interviewType} interview. Let's get started.`;
    
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
    
    // After welcome, ask first question
    setTimeout(async () => {
      const questionMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: firstQuestion,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, questionMessage]);
      await speakMessage(firstQuestion);
    }, 2000);
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
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar - matches wireframe */}
      <div className="h-12 border-b bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-medium text-foreground">Interview Session</h1>
        </div>
        <Button
          onClick={handleBackToDashboard}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Dashboard
        </Button>
      </div>

      <div className="flex h-[calc(100vh-3rem)]">
        {/* Left Side - Transcript (smaller width to match wireframe) */}
        <div className="w-5/12 border-r bg-background">
          <div className="p-3 border-b bg-card">
            <h2 className="text-sm font-medium text-foreground">Transcript</h2>
          </div>
          <ScrollArea className="h-[calc(100vh-6rem)] p-3">
            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm mt-8">
                  Interview will begin shortly...
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg p-2.5 ${
                        message.sender === 'ai'
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        {message.sender === 'ai' ? (
                          <Bot className="h-3 w-3" />
                        ) : (
                          <User className="h-3 w-3" />
                        )}
                        <span className="text-xs opacity-70">
                          {message.sender === 'ai' ? 'AI Interviewer' : 'You'}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Side - AI & Camera (larger width to match wireframe) */}
        <div className="w-7/12 flex flex-col">
          {/* AI Interviewer Section */}
          <div className="h-1/2 border-b bg-card flex flex-col items-center justify-center p-4">
            <div className="text-center">
              <Avatar 
                className={`h-20 w-20 mx-auto mb-3 ${
                  isAiSpeaking ? 'animate-pulse ring-4 ring-primary/30' : ''
                } transition-all duration-300`}
              >
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <h3 className="font-medium text-foreground mb-1">AI Interviewer</h3>
              <p className="text-sm text-muted-foreground">
                {isAiSpeaking ? 'Speaking...' : isListening ? 'Listening...' : 'Ready'}
              </p>
            </div>
          </div>

          {/* User's Camera Section */}
          <div className="h-1/2 bg-muted flex flex-col items-center justify-center p-4">
            <div className="text-center mb-3">
              <h3 className="font-medium text-foreground">Your Camera</h3>
            </div>
            <div className="relative bg-black rounded-lg overflow-hidden w-full max-w-xs aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            </div>
            
            {/* Microphone Control */}
            <div className="mt-4">
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "default"}
                size="sm"
                className="flex items-center gap-2"
                disabled={isAiSpeaking}
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-4 w-4" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    Start Recording
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}