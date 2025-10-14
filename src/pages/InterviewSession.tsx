import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, Briefcase, FileText, User, Mic } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { InterviewRecorder } from "@/components/InterviewRecorder";
import { interviewQuestions } from "@/data/interviewQuestions";
import cadenceLogo from "@/assets/cadence-logo.png";

export default function InterviewSession() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ question: string; answer: string; audioBlob: Blob }[]>([]);
  const [interviewStartTime, setInterviewStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const interviewDetails = location.state?.interviewDetails;

  useEffect(() => {
    if (!interviewDetails) {
      toast({
        title: "Missing Interview Details",
        description: "Please start an interview from the roleplay page.",
        variant: "destructive",
      });
      navigate("/dashboard/interview-roleplay");
      return;
    }

    // Start timer
    const startTime = new Date();
    setInterviewStartTime(startTime);
    
    timerIntervalRef.current = setInterval(() => {
      setElapsedTime(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [interviewDetails, navigate, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  };

  const getQuestions = () => {
    const interviewType = interviewDetails?.interviewType || "Initial Screen";
    const questionsForType = interviewQuestions[interviewType as keyof typeof interviewQuestions] || interviewQuestions["Initial Screen"];
    const numberOfQuestions = interviewDetails?.numberOfQuestions || 5;
    return questionsForType.slice(0, numberOfQuestions);
  };

  const questions = getQuestions();
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerComplete = (transcript: string, audioBlob: Blob) => {
    setAnswers(prev => [...prev, {
      question: currentQuestion,
      answer: transcript,
      audioBlob
    }]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const saveInterviewSession = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("No authenticated user");
      }

      // Stop timer
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }

      const fullTranscript = answers.map((a, i) => 
        `Q${i + 1}: ${a.question}\n\nA${i + 1}: ${a.answer}\n\n`
      ).join('');

      const { data, error } = await supabase
        .from('interview_sessions')
        .insert({
          user_id: user.id,
          interview_type: interviewDetails.interviewType,
          interviewer_name: interviewDetails.interviewer || 'Unknown',
          transcript: fullTranscript,
          job_posting: interviewDetails.jobPosting,
          overall_score: 0,
          analysis_results: null,
          duration_seconds: elapsedTime
        })
        .select()
        .single();

      if (error) throw error;

      return data.id;
    } catch (error) {
      console.error('Error saving session:', error);
      toast({
        title: "Error",
        description: "Failed to save interview session",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleViewResults = async () => {
    const sessionId = await saveInterviewSession();
    
    if (!sessionId) return;

    const fullTranscript = answers.map((a, i) => 
      `Q${i + 1}: ${a.question}\n\nA${i + 1}: ${a.answer}\n\n`
    ).join('');

    navigate('/dashboard/interview-results', {
      state: {
        interviewData: {
          interviewer: interviewDetails.interviewer,
          interviewType: interviewDetails.interviewType,
          transcript: fullTranscript,
          jobPosting: interviewDetails.jobPosting
        },
        sessionId,
        duration: elapsedTime
      }
    });
  };

  if (!interviewDetails) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex justify-between items-center p-4 m-4 bg-card rounded-lg shadow-sm border">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <img src={cadenceLogo} alt="Cadence" className="h-8 w-8" />
            <span className="text-xl font-bold">Cadence</span>
          </div>
        </div>
        
        {/* Timer */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
            <Clock className="h-5 w-5 text-primary" />
            <span className="text-lg font-mono font-semibold text-primary">
              {formatTime(elapsedTime)}
            </span>
          </div>
          <Badge variant="secondary" className="text-sm">
            Live Interview
          </Badge>
        </div>
      </div>

      {/* Interview Info */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <CardTitle>Interview Session</CardTitle>
                <Badge variant="outline">{interviewDetails.interviewType}</Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Interviewer: {interviewDetails.interviewer || 'AI Interviewer'}</span>
                </div>
                {interviewDetails.jobPosting && (
                  <>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>{interviewDetails.jobPosting.job_title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>{interviewDetails.jobPosting.company_name}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Interview Recorder */}
        <InterviewRecorder
          currentQuestion={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          onAnswerComplete={handleAnswerComplete}
          onNextQuestion={handleNextQuestion}
          isInterviewComplete={isLastQuestion && answers.length === questions.length}
        />

        {/* Complete Interview Button */}
        {isLastQuestion && answers.length === questions.length && (
          <Card className="border-primary">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Interview Complete!</h3>
                <p className="text-muted-foreground">
                  Great job! You've completed all {questions.length} questions in {formatDuration(elapsedTime)}.
                </p>
                <Button onClick={handleViewResults} size="lg" className="w-full max-w-md">
                  View Your Results
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
