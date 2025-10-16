import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bot, User, Mic, MicOff, Video, VideoOff, Download, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Import interviewer images
import rebeccaImage from "@/assets/rebecca-martinez.jpg";
import jakeImage from "@/assets/jake-thompson.jpg";
import michaelImage from "@/assets/michael-chen.jpg";

interface Message {
  id: string;
  content: string;
  sender: "ai" | "user";
  timestamp: Date;
  isTyping?: boolean;
}

interface InterviewDetails {
  jobPosting: any;
  interviewType: string;
  numberOfQuestions: number;
  interviewer: string;
  savedPreferences?: any;
}

interface LocationState {
  interviewDetails?: InterviewDetails;
  autoStart?: boolean;
}

const interviewerData = {
  "Rebecca Martinez": {
    image: rebeccaImage,
    title: "Senior Sales Manager",
    style: "Direct & Results-Focused",
  },
  "Jake Thompson": {
    image: jakeImage,
    title: "Team Lead",
    style: "Friendly & Conversational",
  },
  "Michael Chen": {
    image: michaelImage,
    title: "Sales Operations Manager",
    style: "Analytical & Detail-Oriented",
  },
};

export default function InterviewSession() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const state = location.state as LocationState;
  const interviewDetails = state?.interviewDetails;
  const autoStart = state?.autoStart || false;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);

  // Voice/Video state
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [autoMuteEnabled, setAutoMuteEnabled] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const vadIntervalRef = useRef<number | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!interviewDetails) {
      toast({
        title: "Setup Error",
        description: "Interview details not found. Redirecting to dashboard.",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }

    // Auto-start devices if this is a returning user
    if (autoStart) {
      initializeDevices();
    }
  }, [interviewDetails, autoStart, navigate, toast]);

  // Auto-mute when AI is speaking
  useEffect(() => {
    if (!mediaStream || !autoMuteEnabled) return;

    const audioTracks = mediaStream.getAudioTracks();

    if (isAISpeaking) {
      console.log("🔇 Auto-muting: AI is speaking");
      audioTracks.forEach((track) => (track.enabled = false));
      setIsMicEnabled(false);

      // Stop recording if active
      if (isRecording) {
        stopRecording();
      }
    } else if (!isRecording) {
      console.log("🎤 Auto-unmuting: AI finished");
      audioTracks.forEach((track) => (track.enabled = true));
      setIsMicEnabled(true);
    }
  }, [isAISpeaking, mediaStream, autoMuteEnabled]);

  const initializeDevices = async () => {
    try {
      setIsLoading(true);

      // Load saved preferences if available
      const preferences = interviewDetails?.savedPreferences || {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      };

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: preferences.echoCancellation,
          noiseSuppression: preferences.noiseSuppression,
          autoGainControl: preferences.autoGainControl,
        },
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      setMediaStream(stream);
      setIsMicEnabled(true);
      setIsCameraEnabled(true);

      // Connect video stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Setup Voice Activity Detection
      setupVAD(stream);

      toast({
        title: "Devices Ready",
        description: "Microphone and camera are now active",
      });

      // Auto-start interview
      setTimeout(() => {
        startInterview();
      }, 1000);
    } catch (error: any) {
      console.error("❌ Device initialization failed:", error);

      if (error.name === "NotAllowedError") {
        toast({
          title: "Permission Denied",
          description: "Please allow microphone and camera access to continue",
          variant: "destructive",
        });
      } else if (error.name === "NotFoundError") {
        toast({
          title: "No Devices Found",
          description: "Please connect a microphone and camera",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Device Error",
          description: "Unable to access devices. Please check your settings.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const setupVAD = (stream: MediaStream) => {
    try {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 512;
      microphone.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      // Check voice activity every 100ms
      vadIntervalRef.current = window.setInterval(() => {
        if (!analyserRef.current) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
        const SPEECH_THRESHOLD = 20;
        const isSpeaking = average > SPEECH_THRESHOLD;

        setIsUserSpeaking(isSpeaking);

        // Log if user interrupts AI
        if (isSpeaking && isAISpeaking) {
          console.log("🗣️ User interrupting AI");
        }
      }, 100);
    } catch (error) {
      console.error("VAD setup failed:", error);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (vadIntervalRef.current) {
        clearInterval(vadIntervalRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaStream]);

  const startInterview = async () => {
    if (!interviewDetails) return;

    setIsLoading(true);
    setIsInterviewStarted(true);

    try {
      const { data, error } = await supabase.functions.invoke("claude-interviewer", {
        body: {
          interviewer: interviewDetails.interviewer,
          jobPosting: interviewDetails.jobPosting,
          isFirstMessage: true,
          numberOfQuestions: interviewDetails.numberOfQuestions,
          currentQuestionNumber: 1,
          interviewType: interviewDetails.interviewType,
        },
      });

      if (error) {
        console.error("❌ AI interviewer error:", error);
        throw error;
      }

      if (data?.response) {
        const aiMessage: Message = {
          id: Date.now().toString(),
          content: "",
          sender: "ai",
          timestamp: new Date(),
          isTyping: true,
        };

        setMessages([aiMessage]);
        setIsAiTyping(true);

        await typeMessage(data.response, aiMessage.id);
        setIsAiTyping(false);

        // Convert to speech and play
        await convertToSpeechAndPlay(data.response);
      }
    } catch (error) {
      console.error("❌ Interview start error:", error);
      toast({
        title: "Interview Error",
        description: "Failed to start interview. Please try again.",
        variant: "destructive",
      });
      setIsInterviewStarted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const typeMessage = async (fullMessage: string, messageId: string): Promise<void> => {
    const words = fullMessage.split(" ");

    for (let i = 0; i < words.length; i++) {
      const partialMessage = words.slice(0, i + 1).join(" ");

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, content: partialMessage, isTyping: i < words.length - 1 } : msg,
        ),
      );

      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  };

  const convertToSpeechAndPlay = async (text: string) => {
    try {
      setIsAISpeaking(true);

      const { data, error } = await supabase.functions.invoke("text-to-speech", {
        body: {
          text,
          voice: "Rachel", // Map interviewer to voice later
        },
      });

      if (error) throw error;

      if (data?.audio) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);

        audio.onended = () => {
          setIsAISpeaking(false);
          // After AI finishes, start recording user response
          startRecording();
        };

        await audio.play();
      }
    } catch (error) {
      console.error("TTS error:", error);
      setIsAISpeaking(false);
    }
  };

  const startRecording = () => {
    if (!mediaStream || isRecording) return;

    try {
      audioChunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";

      const mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType,
        audioBitsPerSecond: 128000,
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        await processUserResponse(audioBlob);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      console.log("🎤 Recording started");
    } catch (error) {
      console.error("Recording start failed:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log("⏹️ Recording stopped");
    }
  };

  const processUserResponse = async (audioBlob: Blob) => {
    try {
      setIsLoading(true);

      // Convert to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(",")[1];
          resolve(base64);
        };
        reader.readAsDataURL(audioBlob);
      });

      const audioBase64 = await base64Promise;

      // Transcribe with Whisper
      const { data: transcriptData, error: transcriptError } = await supabase.functions.invoke("speech-to-text", {
        body: { audio: audioBase64 },
      });

      if (transcriptError) throw transcriptError;

      const userText = transcriptData?.text || "";

      if (!userText.trim()) {
        toast({
          title: "No Speech Detected",
          description: "Please try speaking again",
          variant: "destructive",
        });
        startRecording(); // Restart recording
        return;
      }

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content: userText,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Check if this was the last question
      const isAnsweringLastQuestion = currentQuestionNumber >= interviewDetails.numberOfQuestions;

      // Get AI response
      const { data: aiData, error: aiError } = await supabase.functions.invoke("claude-interviewer", {
        body: {
          message: userText,
          interviewer: interviewDetails.interviewer,
          jobPosting: interviewDetails.jobPosting,
          conversationHistory: messages,
          isFirstMessage: false,
          numberOfQuestions: interviewDetails.numberOfQuestions,
          currentQuestionNumber: currentQuestionNumber,
          interviewType: interviewDetails.interviewType,
          isLastAnswer: isAnsweringLastQuestion,
        },
      });

      if (aiError) throw aiError;

      if (aiData?.response) {
        const aiMessage: Message = {
          id: Date.now().toString(),
          content: "",
          sender: "ai",
          timestamp: new Date(),
          isTyping: true,
        };

        setMessages((prev) => [...prev, aiMessage]);
        setIsAiTyping(true);

        await typeMessage(aiData.response, aiMessage.id);
        setIsAiTyping(false);

        if (isAnsweringLastQuestion) {
          setIsInterviewComplete(true);
          toast({
            title: "Interview Complete! 🎉",
            description: "Great job! Click 'View Results' to see your performance analysis.",
          });
        } else {
          setCurrentQuestionNumber(currentQuestionNumber + 1);
          // Convert AI response to speech and play
          await convertToSpeechAndPlay(aiData.response);
        }
      }
    } catch (error) {
      console.error("❌ Response processing error:", error);
      toast({
        title: "Processing Error",
        description: "Failed to process your response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMicManually = () => {
    if (!mediaStream) return;

    const audioTracks = mediaStream.getAudioTracks();
    const newState = !isMicEnabled;

    audioTracks.forEach((track) => (track.enabled = newState));
    setIsMicEnabled(newState);

    // Temporarily disable auto-mute
    if (newState) {
      setAutoMuteEnabled(false);
      setTimeout(() => setAutoMuteEnabled(true), 5000);
    }
  };

  const toggleCamera = () => {
    if (!mediaStream) return;

    const videoTracks = mediaStream.getVideoTracks();
    const newState = !isCameraEnabled;

    videoTracks.forEach((track) => (track.enabled = newState));
    setIsCameraEnabled(newState);
  };

  const exportTranscript = () => {
    const transcript = messages
      .map((msg) => `${msg.sender === "ai" ? "Interviewer" : "You"}: ${msg.content}`)
      .join("\n\n");

    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interview-transcript-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Transcript Exported",
      description: "Your interview transcript has been downloaded.",
    });
  };

  const handleViewResults = () => {
    const transcript = messages
      .map((msg) => `${msg.sender === "ai" ? "Interviewer" : "You"}: ${msg.content}`)
      .join("\n\n");

    if (!interviewDetails) {
      toast({
        title: "Error",
        description: "Interview details not available. Cannot show results.",
        variant: "destructive",
      });
      return;
    }

    const navigationData = {
      interviewer: interviewDetails.interviewer || "Unknown",
      interviewType: interviewDetails.interviewType || "General",
      transcript: transcript || "No transcript available",
      jobPosting: interviewDetails.jobPosting || null,
    };

    navigate("/dashboard/interview-results", {
      state: { interviewData: navigationData },
    });
  };

  const handleBackToDashboard = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }
    navigate("/dashboard");
  };

  if (!interviewDetails) {
    return null;
  }

  const currentInterviewer = interviewerData[interviewDetails.interviewer as keyof typeof interviewerData];

  return (
    <div className="h-screen overflow-hidden bg-background">
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center p-4 m-4 bg-background rounded-lg shadow-sm border">
        <div className="text-xl font-bold text-foreground">~ Cadence</div>
        <Button variant="outline" onClick={handleBackToDashboard} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-112px)] p-4 gap-4">
        {/* Left Panel - Transcript */}
        <div className="flex-1 bg-background border rounded-lg shadow-sm flex flex-col">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Interview Transcript</h2>
                <div className="text-sm text-muted-foreground">{interviewDetails.interviewType} Interview</div>
              </div>
              {messages.length > 0 && (
                <Button variant="outline" size="sm" onClick={exportTranscript} className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              )}
            </div>
            {isInterviewStarted && (
              <div className="mt-2 text-sm text-muted-foreground">
                {isInterviewComplete ? (
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-medium">Interview Complete</span>
                    <Button onClick={handleViewResults} size="sm" className="ml-4">
                      View Results
                    </Button>
                  </div>
                ) : (
                  <span>
                    Question {currentQuestionNumber} of {interviewDetails.numberOfQuestions}
                  </span>
                )}
              </div>
            )}
          </div>

          <ScrollArea className="flex-1 p-4">
            {!isInterviewStarted ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md">
                  <h3 className="text-lg font-medium">Initializing devices...</h3>
                  <p className="text-sm text-muted-foreground">
                    Please allow microphone and camera access when prompted
                  </p>
                  {isLoading && (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  )}
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground">Starting conversation...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.sender === "ai" ? "justify-start" : "justify-end"
                    }`}
                  >
                    {message.sender === "ai" && (
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={currentInterviewer?.image} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "ai" ? "bg-muted" : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <p className={`text-sm ${message.isTyping ? "opacity-75" : ""}`}>
                        {message.content}
                        {message.isTyping && <span className="animate-pulse ml-1">...</span>}
                      </p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {message.sender === "user" && (
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="bg-secondary">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Voice Controls */}
          {isInterviewStarted && !isInterviewComplete && (
            <div className="border-t p-4 bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Mic Control */}
                  <Button
                    variant={isMicEnabled ? "default" : "destructive"}
                    size="icon"
                    onClick={toggleMicManually}
                    disabled={isAISpeaking && autoMuteEnabled}
                  >
                    {isMicEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>

                  {/* Camera Control */}
                  <Button variant={isCameraEnabled ? "default" : "outline"} size="icon" onClick={toggleCamera}>
                    {isCameraEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>

                  {/* Status Badges */}
                  {isAISpeaking && (
                    <Badge variant="secondary" className="animate-pulse">
                      🗣️ AI Speaking
                    </Badge>
                  )}
                  {isUserSpeaking && isMicEnabled && !isAISpeaking && (
                    <Badge variant="default" className="animate-pulse">
                      🎤 You're Speaking
                    </Badge>
                  )}
                  {isRecording && (
                    <Badge variant="destructive" className="animate-pulse">
                      ⏺️ Recording
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoMuteEnabled}
                      onChange={(e) => setAutoMuteEnabled(e.target.checked)}
                    />
                    Auto-mute
                  </label>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Video & Interviewer */}
        <div className="flex-1 flex flex-col gap-4">
          {/* AI Interviewer Section */}
          <div className="flex-1 bg-background border rounded-lg shadow-sm flex flex-col">
            <div className="border-b p-4">
              <h3 className="text-lg font-semibold mb-2">AI Interviewer</h3>
              <div className="text-sm text-muted-foreground">
                <div className="font-medium">{interviewDetails.interviewer}</div>
                <div>{currentInterviewer.title}</div>
                <div className="text-xs">{currentInterviewer.style}</div>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center bg-muted/20">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  {isAISpeaking && <div className="absolute inset-0 rounded-full ring-4 ring-primary animate-ping" />}
                  <div className="absolute inset-0 rounded-full ring-2 ring-muted" />
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <img
                      src={currentInterviewer.image}
                      alt={interviewDetails.interviewer}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="text-lg font-medium">{interviewDetails.interviewer}</div>
                <div className="text-sm text-muted-foreground">{currentInterviewer.title}</div>
              </div>
            </div>
          </div>

          {/* User Video Section */}
          <div className="flex-1 bg-background border rounded-lg shadow-sm flex flex-col">
            <div className="border-b p-4">
              <h3 className="text-lg font-semibold">Your Camera</h3>
              <div className="text-sm text-muted-foreground">Live preview</div>
            </div>
            <div className="flex-1 flex items-center justify-center bg-black rounded-b-lg overflow-hidden">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
