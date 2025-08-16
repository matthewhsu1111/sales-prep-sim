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

  // Start interview automatically with first question and voice recognition
  useEffect(() => {
    if (interviewDetails) {
      // Initialize camera and start continuous listening
      initializeCamera();
      startContinuousListening();
      
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

  // Continuous speech recognition
  const startContinuousListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { sampleRate: 16000, channelCount: 1 } 
      });
      
      setIsListening(true);
      
      // Create a continuous recording loop
      const startNewRecording = () => {
        if (!isAiSpeaking && isListening) {
          audioChunksRef.current = [];
          mediaRecorderRef.current = new MediaRecorder(stream);
          
          mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };
          
          mediaRecorderRef.current.onstop = async () => {
            if (audioChunksRef.current.length > 0) {
              const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
              const base64Audio = await blobToBase64(audioBlob);
              
              try {
                const { data } = await supabase.functions.invoke('speech-to-text', {
                  body: { audio: base64Audio.split(',')[1] }
                });
                
                if (data?.text && data.text.trim().length > 3) {
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
              }
            }
            
            // Continue listening if not speaking
            setTimeout(() => {
              if (!isAiSpeaking && isListening) {
                startNewRecording();
              }
            }, 500);
          };
          
          mediaRecorderRef.current.start();
          
          // Record for 3 seconds then process
          setTimeout(() => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
              mediaRecorderRef.current.stop();
            }
          }, 3000);
        }
      };
      
      startNewRecording();
    } catch (error) {
      console.error('Error starting continuous listening:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
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
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Top Navigation Bar - Floating */}
      <div className="m-4 mb-2">
        <div className="h-12 bg-card rounded-lg border flex items-center justify-between px-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">I</span>
            </div>
            <h1 className="text-base font-semibold text-foreground">InterviewAI</h1>
          </div>
          <Button
            onClick={handleBackToDashboard}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-3 w-3" />
            Back
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 px-4 pb-4 min-h-0">
        {/* Left Side - Transcript */}
        <div className="w-1/3 bg-card rounded-lg border flex flex-col min-h-0">
          <div className="p-3 border-b flex-shrink-0">
            <h2 className="text-sm font-medium text-foreground">Transcript</h2>
          </div>
          <ScrollArea className="flex-1 p-3 min-h-0">
            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground text-xs mt-4">
                  Starting interview...
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-3 py-2 ${
                        message.sender === 'ai'
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        {message.sender === 'ai' ? (
                          <Bot className="h-3 w-3" />
                        ) : (
                          <User className="h-3 w-3" />
                        )}
                        <span className="text-xs opacity-70 font-medium">
                          {message.sender === 'ai' ? 'AI' : 'You'}
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

        {/* Right Side - AI & Camera */}
        <div className="w-2/3 flex flex-col gap-4 min-h-0">
          {/* AI Interviewer Section */}
          <div className="flex-1 bg-card rounded-lg border flex flex-col items-center justify-center p-4 min-h-0">
            <div className="text-center">
              <Avatar 
                className={`h-16 w-16 mx-auto mb-3 ${
                  isAiSpeaking ? 'animate-pulse ring-4 ring-primary/30' : ''
                } transition-all duration-300`}
              >
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-medium text-foreground mb-1">AI Interviewer</h3>
              <p className="text-xs text-muted-foreground">
                {isAiSpeaking ? 'Speaking...' : isListening ? 'Listening...' : 'Ready'}
              </p>
            </div>
          </div>

          {/* User's Camera Section */}
          <div className="flex-1 bg-card rounded-lg border flex flex-col items-center justify-center p-4 min-h-0">
            <div className="text-center mb-3">
              <h3 className="text-lg font-medium text-foreground">Your Camera</h3>
            </div>
            <div className="relative bg-black rounded-lg overflow-hidden w-full max-w-sm aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
              {/* Always listening indicator */}
              <div className="absolute top-2 right-2">
                <div className={`h-2 w-2 rounded-full ${isListening && !isAiSpeaking ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}