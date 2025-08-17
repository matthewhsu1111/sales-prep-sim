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
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  
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

  // Initialize camera with better error handling and retry mechanism
  const initializeCamera = async (retryCount = 0) => {
    console.log('🎥 Initializing camera... (attempt', retryCount + 1, ')');
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
      
      // Add delay to ensure video element is ready
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (videoRef.current) {
        console.log('📺 Assigning stream to video element...');
        videoRef.current.srcObject = stream;
        
        // Set up event handlers before loading
        videoRef.current.onloadedmetadata = () => {
          console.log('📹 Video metadata loaded, dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                console.log('✅ Video playing successfully');
                setCameraError(null);
              })
              .catch(e => {
                console.error('❌ Video play error:', e);
                setCameraError('Video playback failed');
              });
          }
        };
        
        videoRef.current.onerror = (e) => {
          console.error('❌ Video element error:', e);
          setCameraError('Video display error');
        };
        
        // Force video to load
        videoRef.current.load();
      } else {
        console.error('❌ Video ref is null!');
        setCameraError('Video element not ready');
      }
    } catch (error) {
      console.error('❌ Camera error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown camera error';
      
      // Retry up to 3 times with increasing delays
      if (retryCount < 2) {
        console.log('🔄 Retrying camera initialization in', (retryCount + 1) * 1000, 'ms...');
        setTimeout(() => initializeCamera(retryCount + 1), (retryCount + 1) * 1000);
        return;
      }
      
      setCameraError(`Camera access failed: ${errorMessage}`);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions and try refreshing the page.",
        variant: "destructive",
      });
    }
  };

  // Initialize everything when component mounts
  useEffect(() => {
    console.log('🔍 Component mounted, state:', state);
    console.log('🔍 interviewDetails:', interviewDetails);
    
    if (!interviewDetails) {
      console.error('❌ No interview details found in state!');
      toast({
        title: "Setup Error",
        description: "Interview details not found. Redirecting to dashboard.",
        variant: "destructive",
      });
      navigate('/dashboard');
      return;
    }

    const initializeInterview = async () => {
      try {
        console.log('🎥 Initializing camera...');
        await initializeCamera();
        console.log('✅ Camera ready');
        
        setIsLoading(false);
        console.log('✅ Ready for user to start interview');
      } catch (error) {
        console.error('❌ Setup error:', error);
        setIsLoading(false);
      }
    };
    
    initializeInterview();
  }, [interviewDetails, navigate]);

  // Function to start the actual interview (called by user button)
  const startActualInterview = async () => {
    if (!audioEnabled) {
      // Enable audio with user gesture
      try {
        const audioContext = new AudioContext();
        await audioContext.resume();
        setAudioEnabled(true);
        console.log('✅ Audio enabled by user gesture');
      } catch (error) {
        console.error('❌ Audio enable error:', error);
        toast({
          title: "Audio Error",
          description: "Could not enable audio. Interview will continue without AI voice.",
          variant: "destructive",
        });
      }
    }

    setInterviewStarted(true);
    setIsLoading(true);

    try {
      console.log('📚 Getting questions...');
      const questions = getQuestionsForInterview(
        interviewDetails.interviewType, 
        interviewDetails.numberOfQuestions
      );
      
      if (questions.length === 0) {
        throw new Error('No questions available');
      }

      console.log('🎤 Starting continuous listening...');
      await startContinuousListening();
      
      console.log('🎭 Starting interview...');
      await startInterview(questions[0]);
      
    } catch (error) {
      console.error('❌ Interview start error:', error);
      toast({
        title: "Interview Error",
        description: "Failed to start interview. Please try again.",
        variant: "destructive",
      });
      setInterviewStarted(false);
    } finally {
      setIsLoading(false);
    }
  };

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

  // Simplified audio playback with user gesture requirement
  const playAudioUsingHtmlAudio = async (base64Audio: string): Promise<void> => {
    if (!audioEnabled) {
      console.log('⏭️ Audio disabled, skipping playback');
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        // Clean up previous audio
        if (audioElementRef.current) {
          audioElementRef.current.pause();
          audioElementRef.current.remove();
        }
        
        // Create audio element
        const audio = new Audio();
        audioElementRef.current = audio;
        
        // Convert base64 to data URL (simpler approach)
        const audioSrc = `data:audio/mp3;base64,${base64Audio}`;
        audio.src = audioSrc;
        audio.volume = 0.7;
        audio.preload = 'auto';
        
        let resolved = false;
        
        const cleanup = () => {
          if (!resolved) {
            resolved = true;
            audio.remove();
          }
        };
        
        audio.onended = () => {
          console.log('🎵 Audio ended');
          cleanup();
          resolve();
        };
        
        audio.onerror = (e) => {
          console.error('🚨 Audio error:', e);
          cleanup();
          reject(new Error('Audio playback failed'));
        };
        
        // Timeout after 30 seconds
        setTimeout(() => {
          if (!resolved) {
            console.error('🚨 Audio timeout');
            cleanup();
            reject(new Error('Audio timeout'));
          }
        }, 30000);
        
        // Try to play immediately
        console.log('🎵 Starting audio playback...');
        audio.play()
          .then(() => console.log('✅ Audio playing'))
          .catch(e => {
            console.error('🚨 Play failed:', e);
            cleanup();
            reject(e);
          });
          
      } catch (error) {
        console.error('🚨 Audio setup error:', error);
        reject(error);
      }
    });
  };

  // Simplified speech recognition with better filtering
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
      
      // Simplified recording with longer intervals
      const createRecording = () => {
        if (isProcessingRef.current || isAiSpeaking || !streamRef.current) {
          setTimeout(createRecording, 2000);
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
            setTimeout(createRecording, 2000);
            return;
          }
          
          isProcessingRef.current = true;
          console.log('🎤 Processing speech...');
          
          try {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            
            // Only process substantial audio chunks
            if (audioBlob.size < 15000) {
              console.log('⏭️ Skipping small audio chunk:', audioBlob.size, 'bytes');
              isProcessingRef.current = false;
              setTimeout(createRecording, 2000);
              return;
            }
            
            const base64Audio = await blobToBase64(audioBlob);
            const { data, error } = await supabase.functions.invoke('speech-to-text', {
              body: { audio: base64Audio.split(',')[1] }
            });
            
            if (error) {
              console.error('🚨 STT error:', error);
            } else if (data?.text) {
              const text = data.text.trim();
              console.log('📝 Transcribed:', text);
              
              // Enhanced filtering
              const isValid = text.length >= 10 && 
                             /[a-zA-Z]/.test(text) &&
                             !text.toLowerCase().includes('thank you') &&
                             !text.toLowerCase().includes('thanks for watching') &&
                             !text.toLowerCase().includes('music') &&
                             !/^[^\w]*$/.test(text);
              
              if (isValid) {
                console.log('✅ Valid speech accepted');
                const userMessage: Message = {
                  id: Date.now().toString(),
                  content: text,
                  sender: 'user',
                  timestamp: new Date()
                };
                
                setMessages(prev => [...prev, userMessage]);
                await getAIResponse(text);
              } else {
                console.log('🗑️ Filtered out speech:', text);
              }
            }
          } catch (error) {
            console.error('❌ Speech processing error:', error);
          } finally {
            isProcessingRef.current = false;
            setTimeout(createRecording, 3000); // Longer delay between recordings
          }
        };
        
        console.log('🎤 Starting recording...');
        mediaRecorder.start();
        
        // Record for 7 seconds
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, 7000);
      };
      
      // Start after delay
      setTimeout(createRecording, 3000);
      
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Top Navigation */}
      <div className="flex items-center justify-between p-4 bg-card/80 backdrop-blur-sm border-b">
        <Button
          variant="ghost"
          onClick={handleBackToDashboard}
          className="flex items-center gap-2 hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-xl font-semibold">
          AI Interview Session - {interviewDetails?.interviewType}
        </h1>
        <div></div> {/* Spacer */}
      </div>

      <div className="container max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
          {/* Left Column - Interview Transcript */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardContent className="p-0 h-full flex flex-col">
                <div className="p-4 border-b bg-muted/50">
                  <h2 className="font-semibold text-lg">Interview Transcript</h2>
                  <p className="text-sm text-muted-foreground">
                    Question {currentQuestionIndex + 1} of {interviewDetails?.numberOfQuestions}
                  </p>
                </div>
                
                <ScrollArea className="flex-1 p-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                        <p className="text-sm text-muted-foreground">
                          {interviewStarted ? "Starting interview..." : "Setting up camera and microphone..."}
                        </p>
                      </div>
                    </div>
                  ) : !interviewStarted ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                          <Bot className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Ready to Start Your Interview</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Click the button below to begin your {interviewDetails?.interviewType} interview.
                            This will enable audio and start the conversation.
                          </p>
                          <Button onClick={startActualInterview} size="lg" className="px-8">
                            Start Interview
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${
                            message.sender === 'ai' ? 'justify-start' : 'justify-end'
                          }`}
                        >
                          {message.sender === 'ai' && (
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.sender === 'ai'
                                ? 'bg-muted text-foreground'
                                : 'bg-primary text-primary-foreground'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                          
                          {message.sender === 'user' && (
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-secondary">
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - AI Interviewer & Camera */}
          <div className="space-y-6">
            {/* AI Interviewer Status */}
            <Card>
              <CardContent className="p-4">
                <div className="text-center space-y-3">
                  <Avatar className="w-16 h-16 mx-auto">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      <Bot className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">AI Interviewer</h3>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      {isAiSpeaking ? (
                        <>
                          <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-600">Speaking...</span>
                        </>
                      ) : interviewStarted ? (
                        <>
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-blue-600">Listening</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                          <span className="text-sm text-muted-foreground">Ready</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Camera Feed */}
            <Card>
              <CardContent className="p-4">
                <div className="text-center space-y-3">
                  <h3 className="font-semibold">Your Camera</h3>
                  <div className="relative rounded-lg overflow-hidden bg-muted aspect-video">
                    {cameraError ? (
                      <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                        <div className="text-center">
                          <div className="w-12 h-12 rounded-full bg-muted-foreground/20 flex items-center justify-center mx-auto mb-2">
                            <User className="h-6 w-6" />
                          </div>
                          <p>{cameraError}</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => initializeCamera(0)}
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
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  {/* Status Indicators */}
                  <div className="flex justify-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      {isListening ? (
                        <Mic className="h-3 w-3 text-green-500" />
                      ) : (
                        <MicOff className="h-3 w-3 text-muted-foreground" />
                      )}
                      <span className={isListening ? "text-green-600" : "text-muted-foreground"}>
                        {isListening ? "Listening" : "Not listening"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`h-3 w-3 rounded-full ${audioEnabled ? 'bg-blue-500' : 'bg-muted-foreground'}`}></div>
                      <span className={audioEnabled ? "text-blue-600" : "text-muted-foreground"}>
                        {audioEnabled ? "Audio enabled" : "Audio disabled"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}