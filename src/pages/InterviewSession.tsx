import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Bot, User, Send, Download } from "lucide-react";
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
}

interface LocationState {
  interviewDetails?: InterviewDetails;
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

  const [messages, setMessages] = useState<Message[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
  }, [interviewDetails, navigate, toast]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startInterview = async () => {
    if (!interviewDetails) return;

    setIsLoading(true);
    setIsInterviewStarted(true);
    setElapsedTime(0);

    // Start the timer
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    try {
      // Get AI greeting and first question
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
        // Add AI message with typing animation
        const aiMessage: Message = {
          id: Date.now().toString(),
          content: "",
          sender: "ai",
          timestamp: new Date(),
          isTyping: true,
        };

        setMessages([aiMessage]);
        setIsAiTyping(true);

        // Simulate typing effect
        await typeMessage(data.response, aiMessage.id);
        setIsAiTyping(false);
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

      // Wait between words (faster than original audio timing)
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim() || !interviewDetails || isAiTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: userInput.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsAiTyping(true);

    try {
      // Check if we just answered the last question
      const isAnsweringLastQuestion = currentQuestionNumber >= interviewDetails.numberOfQuestions;

      const { data, error } = await supabase.functions.invoke("claude-interviewer", {
        body: {
          message: userInput.trim(),
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

      if (error) {
        console.error("❌ AI response error:", error);
        throw error;
      }

      if (data?.response) {
        // Add AI message with typing animation
        const aiMessage: Message = {
          id: Date.now().toString(),
          content: "",
          sender: "ai",
          timestamp: new Date(),
          isTyping: true,
        };

        setMessages((prev) => [...prev, aiMessage]);

        // Simulate typing effect
        await typeMessage(data.response, aiMessage.id);

        // Update question number or mark interview complete
        if (isAnsweringLastQuestion) {
          setIsInterviewComplete(true);
          // Stop the timer
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          // Save interview session to database
          await saveInterviewSession();
        } else {
          setCurrentQuestionNumber(currentQuestionNumber + 1);
        }
      }
    } catch (error) {
      console.error("❌ AI response error:", error);
      toast({
        title: "AI Error",
        description: "Could not get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
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
    console.log("🔍 Interview completion started");
    console.log("📝 Current transcript length:", messages.length);
    console.log("👤 Interviewer:", interviewDetails?.interviewer);
    console.log("📋 Interview type:", interviewDetails?.interviewType);

    // Create transcript from messages
    const transcript = messages
      .map((msg) => `${msg.sender === "ai" ? "Interviewer" : "You"}: ${msg.content}`)
      .join("\n\n");

    console.log("📝 Generated transcript:", transcript.substring(0, 200) + "...");

    if (!interviewDetails) {
      console.error("❌ No interview details available");
      toast({
        title: "Error",
        description: "Interview details not available. Cannot show results.",
        variant: "destructive",
      });
      return;
    }

    // Navigate to results with data
    const navigationData = {
      interviewer: interviewDetails.interviewer || "Unknown",
      interviewType: interviewDetails.interviewType || "General",
      transcript: transcript || "No transcript available",
      jobPosting: interviewDetails.jobPosting || null,
    };

    console.log("🚀 Navigating to results with data:", navigationData);

    navigate("/dashboard/interview-results", {
      state: { interviewData: navigationData },
    });
  };

  const saveInterviewSession = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("No authenticated user found");
        return;
      }

      const transcript = messages
        .map((msg) => `${msg.sender === "ai" ? "Interviewer" : "You"}: ${msg.content}`)
        .join("\n\n");

      const { error } = await supabase.from("interview_sessions").insert({
        user_id: user.id,
        interviewer_name: interviewDetails.interviewer,
        interview_type: interviewDetails.interviewType,
        transcript: transcript,
        overall_score: Math.floor(Math.random() * 40) + 60, // Random score 60-100 for now
        job_posting: interviewDetails.jobPosting,
        analysis_results: {},
        strengths: [],
        weaknesses: [],
        improvements: [],
        scores: {},
      });

      if (error) {
        console.error("Error saving interview session:", error);
        toast({
          title: "Save Error",
          description: "Could not save interview results. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Interview Saved",
          description: "Your interview results have been saved successfully.",
        });
      }
    } catch (error) {
      console.error("Error saving interview session:", error);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  if (!interviewDetails) {
    return null;
  }

  const currentInterviewer = interviewerData[interviewDetails.interviewer as keyof typeof interviewerData];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen overflow-hidden bg-background">
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center p-4 m-4 bg-background rounded-lg shadow-sm border">
        <div className="text-xl font-bold text-foreground">~ Cadence</div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="font-mono text-sm font-medium">{formatTime(elapsedTime)}</span>
          </div>
          <Button variant="outline" onClick={handleBackToDashboard} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
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
                  <h3 className="text-lg font-medium">Ready to begin?</h3>
                  <p className="text-sm text-muted-foreground">
                    Your interview with <strong>{interviewDetails.interviewer}</strong> is ready to start. This will be
                    a {interviewDetails.numberOfQuestions}-question text-based interview for the{" "}
                    {interviewDetails.interviewType} position.
                  </p>

                  <Button onClick={startInterview} disabled={isLoading} size="lg" className="px-8">
                    {isLoading ? "Starting..." : "Start Interview"}
                  </Button>
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

          {/* Input Area */}
          {isInterviewStarted && !isInterviewComplete && (
            <div className="border-t p-4">
              <div className="flex space-x-2 items-end">
                <div className="flex-1">
                  <Textarea
                    ref={inputRef}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder={
                      isAiTyping
                        ? "AI is typing..."
                        : "Type your response... (Press Enter to send, Shift+Enter for new line)"
                    }
                    disabled={isAiTyping}
                    className="min-h-[60px] max-h-[200px] resize-none"
                    rows={3}
                  />
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={!userInput.trim() || isAiTyping}
                  size="icon"
                  className="flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {isAiTyping && (
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span>{interviewDetails.interviewer} is typing...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel - Split Sections */}
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
                  {/* Pulsing ring */}
                  {isAiTyping && <div className="absolute inset-0 rounded-full ring-4 ring-primary animate-ping" />}

                  {/* Static outer ring */}
                  <div className="absolute inset-0 rounded-full ring-2 ring-muted" />

                  {/* Actual image */}
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

          {/* User Section */}
          <div className="flex-1 bg-background border rounded-lg shadow-sm flex flex-col">
            <div className="border-b p-4">
              <h3 className="text-lg font-semibold">Your Space</h3>
              <div className="text-sm text-muted-foreground">Take notes, prepare responses</div>
            </div>
            <div className="flex-1 flex items-center justify-center bg-muted/10">
              <div className="text-center text-muted-foreground">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                  <User className="w-12 h-12" />
                </div>
                <p className="text-sm">Your preparation space</p>
                <p className="text-xs text-muted-foreground/70">Use this area for notes or preparation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
