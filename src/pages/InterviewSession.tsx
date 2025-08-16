import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Bot, User, Mic, MicOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { getQuestionsForInterview } from "@/data/interviewQuestions";

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
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isProcessingRef = useRef(false);

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

  // Initialize camera with better error handling
  const initializeCamera = async () => {
    console.log('🎥 Initializing camera...');
    try {
      console.log('📱 Requesting camera permissions...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 }, 
          facingMode: 'user' 
        },
        audio: false
      });
      
      console.log('✅ Camera stream acquired, track count:', stream.getVideoTracks().length);
      setCameraStream(stream);
      setCameraError(null);
      
      // Wait for video element to be ready
      if (videoRef.current) {
        console.log('📺 Assigning stream to video element...');
        videoRef.current.srcObject = stream;
        
        // Ensure video loads and plays
        videoRef.current.onloadedmetadata = () => {
          console.log('📹 Video metadata loaded, dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
          videoRef.current?.play()
            .then(() => console.log('✅ Video playing'))
            .catch(e => console.error('❌ Video play error:', e));
        };
        
        videoRef.current.onerror = (e) => {
          console.error('❌ Video element error:', e);
          setCameraError('Video display error');
        };
      } else {
        console.error('❌ Video ref is null!');
      }
    } catch (error) {
      console.error('❌ Camera error:', error);
      setCameraError('Camera access denied or not available');
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  // Initialize everything when component mounts
  useEffect(() => {
    console.log('🔍 Component mounted, state:', state);
    console.log('🔍 interviewDetails:', interviewDetails);
    
    if (interviewDetails) {
      console.log('🚀 Starting interview session...');
      setIsLoading(true);
      
      const initializeInterview = async () => {
        try {
          console.log('🎥 About to initialize camera...');
          await initializeCamera();
          console.log('✅ Camera initialization complete');
          
          console.log('📚 About to get questions...');
          console.log('📚 Interview type:', interviewDetails.interviewType);
          console.log('📚 Number of questions:', interviewDetails.numberOfQuestions);
          
          const questions = getQuestionsForInterview(
            interviewDetails.interviewType, 
            interviewDetails.numberOfQuestions
          );
          
          console.log('📝 Questions loaded:', questions.length);
          if (questions[0]) {
            console.log('📝 First question preview:', questions[0].substring(0, 50));
          }
          
          if (questions.length > 0) {
            console.log('🎤 About to start continuous listening...');
            await startContinuousListening();
            console.log('✅ Continuous listening started');
            
            console.log('🎭 About to start interview...');
            await startInterview(questions[0]);
            console.log('✅ Interview started');
          } else {
            console.error('❌ No questions found!');
          }
        } catch (error) {
          console.error('❌ Interview initialization error:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      initializeInterview();
    } else {
      console.error('❌ No interview details found in state!');
      console.log('🔍 Current location state:', state);
    }
  }, [interviewDetails, state]);

  const startInterview = async (firstQuestion: string) => {
    console.log('🎭 Starting interview with first question:', firstQuestion.substring(0, 50) + '...');
    
    const welcomeMessage = `Hello! I'm your AI interviewer for today's ${interviewDetails?.interviewType} interview. Let's get started with our first question.`;
    
    console.log('💬 Welcome message:', welcomeMessage);
    
    // Add AI welcome message
    const aiMessage: Message = {
      id: Date.now().toString(),
      content: welcomeMessage,
      sender: 'ai',
      timestamp: new Date()
    };
    
    setMessages([aiMessage]);
    console.log('✅ Welcome message added to chat');
    
    // Convert to speech and play
    console.log('🔊 About to speak welcome message...');
    await speakMessage(welcomeMessage);
    console.log('✅ Welcome message spoken');
    
    // Immediately ask first question after welcome
    const questionMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: firstQuestion,
      sender: 'ai',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, questionMessage]);
    console.log('✅ First question added to chat');
    
    console.log('🔊 About to speak first question...');
    await speakMessage(firstQuestion);
    console.log('✅ First question spoken');
  };

  const speakMessage = async (text: string) => {
    console.log('🗣️ Speaking message:', text.substring(0, 50) + '...');
    setIsAiSpeaking(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice: 'alloy' }
      });
      
      if (error) {
        console.error('🚨 TTS API error:', error);
        throw error;
      }
      
      if (data?.audioContent) {
        console.log('🎵 Playing audio...');
        await playAudioUsingHtmlAudio(data.audioContent);
        console.log('✅ Audio playback complete');
      } else {
        console.error('🚨 No audio content received');
      }
    } catch (error) {
      console.error('❌ Text-to-speech error:', error);
      toast({
        title: "Audio Error",
        description: "Could not play AI voice. Check your audio settings.",
        variant: "destructive",
      });
    } finally {
      setIsAiSpeaking(false);
    }
  };

  // Simplified audio playback using HTML Audio API
  const playAudioUsingHtmlAudio = async (base64Audio: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        // Clean up previous audio element
        if (audioElementRef.current) {
          audioElementRef.current.pause();
          audioElementRef.current.src = '';
        }
        
        // Create new audio element
        const audio = new Audio();
        audioElementRef.current = audio;
        
        // Set up audio data
        const audioBlob = new Blob([Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0))], { 
          type: 'audio/mp3' 
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        audio.src = audioUrl;
        
        audio.onended = () => {
          console.log('🎵 Audio ended');
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        
        audio.onerror = (error) => {
          console.error('🚨 Audio playback error:', error);
          URL.revokeObjectURL(audioUrl);
          reject(error);
        };
        
        audio.oncanplaythrough = () => {
          console.log('🎵 Audio ready to play');
          audio.play().catch(e => {
            console.error('🚨 Play failed:', e);
            reject(e);
          });
        };
        
        audio.load();
      } catch (error) {
        console.error('🚨 Audio setup error:', error);
        reject(error);
      }
    });
  };

  // Simplified continuous speech recognition
  const startContinuousListening = async () => {
    console.log('🎤 Starting continuous listening...');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          sampleRate: 44100, 
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      setIsListening(true);
      console.log('✅ Microphone access granted');
      
      // Create a simplified recording loop
      const createNewRecording = () => {
        if (isProcessingRef.current || isAiSpeaking) {
          setTimeout(createNewRecording, 1000);
          return;
        }
        
        audioChunksRef.current = [];
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus'
        });
        mediaRecorderRef.current = mediaRecorder;
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        
        mediaRecorder.onstop = async () => {
          if (isProcessingRef.current || audioChunksRef.current.length === 0) {
            setTimeout(createNewRecording, 500);
            return;
          }
          
          isProcessingRef.current = true;
          
          try {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const base64Audio = await blobToBase64(audioBlob);
            
            console.log('🎤 Processing speech...');
            const { data, error } = await supabase.functions.invoke('speech-to-text', {
              body: { audio: base64Audio.split(',')[1] }
            });
            
            if (error) {
              console.error('🚨 STT error:', error);
            } else if (data?.text && data.text.trim().length > 5) {
              console.log('✅ Transcribed:', data.text);
              
              const userMessage: Message = {
                id: Date.now().toString(),
                content: data.text,
                sender: 'user',
                timestamp: new Date()
              };
              
              setMessages(prev => [...prev, userMessage]);
              await getAIResponse(data.text);
            }
          } catch (error) {
            console.error('❌ Speech processing error:', error);
          } finally {
            isProcessingRef.current = false;
            setTimeout(createNewRecording, 1000);
          }
        };
        
        mediaRecorder.start();
        
        // Record for 4 seconds then process
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, 4000);
      };
      
      // Start the first recording
      setTimeout(createNewRecording, 1000);
      
    } catch (error) {
      console.error('❌ Microphone error:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const getAIResponse = async (userMessage: string) => {
    console.log('🤖 Getting AI response for:', userMessage.substring(0, 50) + '...');
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-interviewer', {
        body: {
          message: userMessage,
          jobPosting: interviewDetails?.jobPosting,
          interviewType: interviewDetails?.interviewType,
          questionContext: `This is question ${currentQuestionIndex + 1} of ${interviewDetails?.numberOfQuestions}`
        }
      });
      
      if (error) {
        console.error('🚨 AI response error:', error);
        return;
      }
      
      if (data?.response) {
        console.log('✅ AI responded:', data.response.substring(0, 50) + '...');
        
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
      console.error('❌ AI response error:', error);
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
    console.log('🔄 Cleaning up and returning to dashboard...');
    
    // Clean up all media before navigating
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.src = '';
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
              {cameraError ? (
                <div className="w-full h-full flex items-center justify-center text-white text-sm">
                  <div className="text-center">
                    <div className="mb-2">📷</div>
                    <div>{cameraError}</div>
                    <Button 
                      onClick={initializeCamera} 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                    >
                      Retry Camera
                    </Button>
                  </div>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                  onLoadedMetadata={() => console.log('📹 Video metadata loaded')}
                  onError={(e) => {
                    console.error('📹 Video error:', e);
                    setCameraError('Video display error');
                  }}
                />
              )}
              
              {/* Status indicators */}
              <div className="absolute top-2 right-2 flex gap-1">
                <div className={`h-2 w-2 rounded-full ${isListening && !isAiSpeaking ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                {isLoading && <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}