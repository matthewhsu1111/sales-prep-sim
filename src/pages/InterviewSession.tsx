import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Bot, User } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'ai' | 'user';
  timestamp: Date;
}

export default function InterviewSession() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI interviewer. Let's begin with a simple question. Can you tell me about yourself?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Initialize camera for the interview
    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: 'user' },
          audio: false
        });
        setCameraStream(stream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    initializeCamera();

    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  const handleBackToDashboard = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    navigate('/dashboard');
  };

  // Simulate AI speaking for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAiSpeaking(prev => !prev);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <div className="h-16 border-b bg-card flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-foreground">Interview Session</h1>
        </div>
        <Button
          onClick={handleBackToDashboard}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Side - Transcript */}
        <div className="w-1/2 border-r bg-card">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-foreground">Transcript</h2>
          </div>
          <ScrollArea className="h-[calc(100vh-8rem)] p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'ai'
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-primary text-primary-foreground ml-auto'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.sender === 'ai' ? (
                        <Bot className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      <span className="text-xs opacity-70">
                        {message.sender === 'ai' ? 'AI Interviewer' : 'You'}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right Side - AI & Camera */}
        <div className="w-1/2 flex flex-col">
          {/* AI Interviewer Section */}
          <div className="h-1/2 border-b bg-card p-6 flex flex-col items-center justify-center">
            <Card className="w-full max-w-sm">
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar 
                    className={`h-16 w-16 ${
                      isAiSpeaking ? 'animate-pulse ring-4 ring-primary ring-opacity-50' : ''
                    } transition-all duration-300`}
                  >
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">AI Interviewer</h3>
                    <p className="text-sm text-muted-foreground">
                      {isAiSpeaking ? 'Speaking...' : 'Listening'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User's Camera Section */}
          <div className="h-1/2 bg-muted p-6 flex flex-col items-center justify-center">
            <Card className="w-full max-w-sm">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <h3 className="font-semibold text-foreground">Your Camera</h3>
                </div>
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}