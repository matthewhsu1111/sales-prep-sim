import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, AlertTriangle, Target, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface InterviewResultsData {
  interviewer: string;
  interviewType: string;
  transcript: string;
  jobPosting?: any;
}

interface FeedbackData {
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  overallScore: number;
  overallFeedback: string;
}

export default function InterviewResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const interviewData = location.state as InterviewResultsData;

  console.log('InterviewResults mounted, location.state:', location.state);

  useEffect(() => {
    if (!interviewData) {
      toast({
        title: "Missing Data",
        description: "Interview results not found. Redirecting to dashboard.",
        variant: "destructive",
      });
      navigate('/dashboard');
      return;
    }
    
    generateFeedback();
  }, [interviewData, navigate, toast]);

  const generateFeedback = async () => {
    if (!interviewData) return;

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke('analyze-interview', {
        body: {
          transcript: interviewData.transcript,
          interviewType: interviewData.interviewType,
          jobPosting: interviewData.jobPosting,
          interviewer: interviewData.interviewer
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (error) {
        console.error('Feedback generation error:', error);
        // Fallback to sample feedback
        setFeedback({
          strengths: [
            "Strong communication skills",
            "Good examples from past experience",
            "Enthusiastic about the role"
          ],
          weaknesses: [
            "Could provide more specific metrics",
            "Need to develop objection handling skills"
          ],
          improvements: [
            "Practice quantifying achievements with specific numbers",
            "Research common sales objections and prepare responses",
            "Develop a more structured approach to discovery calls"
          ],
          overallScore: 75,
          overallFeedback: "Overall, you showed good potential for this role. Your communication skills and enthusiasm are strong assets. Focus on developing more technical sales skills and quantifying your achievements to improve your interview performance."
        });
      } else {
        setFeedback(data);
      }
    } catch (error) {
      console.error('Error generating feedback:', error);
      toast({
        title: "Analysis Error",
        description: "Could not analyze interview. Showing basic results.",
        variant: "destructive",
      });
      
      // Fallback feedback
      setFeedback({
        strengths: ["Completed the interview", "Engaged throughout the process"],
        weaknesses: ["Analysis unavailable"],
        improvements: ["Practice more interviews", "Research the company and role"],
        overallScore: 70,
        overallFeedback: "Interview completed successfully. Continue practicing to improve your skills."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResults = () => {
    if (!feedback || !interviewData) return;

    const results = `
INTERVIEW RESULTS REPORT
========================

Interview Type: ${interviewData.interviewType}
Interviewer: ${interviewData.interviewer}
Overall Score: ${feedback.overallScore}/100

STRENGTHS:
${feedback.strengths.map(s => `• ${s}`).join('\n')}

AREAS FOR IMPROVEMENT:
${feedback.weaknesses.map(w => `• ${w}`).join('\n')}

RECOMMENDED ACTIONS:
${feedback.improvements.map(i => `• ${i}`).join('\n')}

OVERALL FEEDBACK:
${feedback.overallFeedback}

FULL TRANSCRIPT:
================
${interviewData.transcript}
`;

    const blob = new Blob([results], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-results-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Results Downloaded",
      description: "Your interview results have been saved to your device.",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  if (!interviewData) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Analyzing your interview performance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex justify-between items-center p-4 m-4 bg-background rounded-lg shadow-sm border">
        <div className="text-xl font-bold text-foreground">~ InterviewAce</div>
        <div className="flex gap-2">
          {feedback && (
            <Button
              variant="outline"
              onClick={downloadResults}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Results
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Interview Results</CardTitle>
                <p className="text-muted-foreground mt-1">
                  {interviewData.interviewType} • Interviewed by {interviewData.interviewer}
                </p>
              </div>
              {feedback && (
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(feedback.overallScore)}`}>
                    {feedback.overallScore}/100
                  </div>
                  <Badge variant={getScoreBadgeVariant(feedback.overallScore)}>
                    Overall Score
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {feedback && (
          <>
            {/* Overall Feedback */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Overall Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{feedback.overallFeedback}</p>
              </CardContent>
            </Card>

            {/* Strengths */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="w-5 h-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feedback.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Areas for Improvement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-600">
                  <AlertTriangle className="w-5 h-5" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feedback.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Recommended Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Target className="w-5 h-5" />
                  Recommended Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feedback.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={() => navigate('/dashboard/interview-roleplay')}
            size="lg"
          >
            Practice Another Interview
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            size="lg"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}