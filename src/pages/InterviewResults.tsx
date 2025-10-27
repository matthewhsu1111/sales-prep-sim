import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, AlertTriangle, Target, Download, Mic, Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useGamification } from "@/hooks/useGamification";
import { XPRewardPopup } from "@/components/XPRewardPopup";
import { getInterviewTypeXP, XP_REWARDS } from "@/utils/gamification";

interface InterviewResultsData {
  interviewer: string;
  interviewType: string;
  transcript: string;
  jobPosting?: any;
  duration?: number;
}

interface StrengthItem {
  skill: string;
  category: string;
  evidence: string;
  score: number;
}

interface WeaknessItem {
  skill: string;
  category: string;
  issue: string;
  improvementActions: string[];
  score: number;
}

interface FeedbackData {
  strengths: StrengthItem[] | string[];
  weaknesses: WeaknessItem[] | string[];
  improvements: string[];
  overallScore: number;
  overallFeedback: string;
  detailedScores?: {
    communication: number;
    confidence: number;
    salesSkills: number;
    interviewMechanics: number;
  };
}

export default function InterviewResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { awardXP, progress } = useGamification();
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [streakSaved, setStreakSaved] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [xpReward, setXpReward] = useState<any>(null);

  const interviewData = location.state?.interviewData as InterviewResultsData;
  const savedFeedback = location.state?.savedFeedback as FeedbackData | undefined;

  console.log("InterviewResults mounted, location.state:", location.state);

  useEffect(() => {
    if (!interviewData) {
      toast({
        title: "Missing Data",
        description: "Interview results not found. Redirecting to dashboard.",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }

    if (savedFeedback) {
      console.log("Using saved feedback:", savedFeedback);
      setFeedback(savedFeedback);
      setIsLoading(false);
    } else {
      generateFeedback();
    }
  }, [interviewData, savedFeedback, navigate, toast]);

  const generateFeedback = async () => {
    if (!interviewData) return;

    setIsLoading(true);
    try {
      console.log("🚀 Calling analyze-interview with:", {
        interviewType: interviewData.interviewType,
        interviewer: interviewData.interviewer,
        transcriptLength: interviewData.transcript?.length,
        sessionId: (interviewData as any).sessionId,
      });

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("No active session found");
      }

      const { data, error } = await supabase.functions.invoke("analyze-interview", {
        body: {
          transcript: interviewData.transcript,
          interviewType: interviewData.interviewType,
          jobPosting: interviewData.jobPosting,
          interviewer: interviewData.interviewer,
          sessionId: (interviewData as any).sessionId, // Pass session ID to analysis
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      console.log("📦 analyze-interview response:", { data, error });

      if (error) {
        console.error("❌ Feedback generation error:", error);
        throw error;
      }

      if (!data) {
        throw new Error("No data returned from analyze-interview");
      }

      console.log("✅ Setting feedback:", {
        score: data.overallScore,
        hasStrengths: !!data.strengths?.length,
        hasWeaknesses: !!data.weaknesses?.length,
      });

      setFeedback(data);

      // Update streak after successful analysis
      await updateStreak();
    } catch (error) {
      console.error("💥 Error generating feedback:", error);
      toast({
        title: "Analysis Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });

      setFeedback({
        strengths: [],
        weaknesses: [],
        improvements: [
          "Check Supabase logs for detailed error",
          "Verify API key is set",
          "Ensure transcript is not empty",
        ],
        overallScore: 0,
        overallFeedback: `Error: ${error instanceof Error ? error.message : "Unknown error"}. Check browser console and Supabase Edge Function logs for details.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStreak = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Award XP for completing the interview
      const interviewXP = getInterviewTypeXP(interviewData.interviewType);
      const today = new Date().toISOString().split('T')[0];
      const lastPracticeDate = progress?.lastPracticeDate 
        ? new Date(progress.lastPracticeDate).toISOString().split('T')[0] 
        : null;
      
      // Add first practice bonus if this is the first practice today
      let totalXP = interviewXP;
      const isFirstToday = lastPracticeDate !== today;
      if (isFirstToday) {
        totalXP += XP_REWARDS.FIRST_PRACTICE_TODAY;
      }

      // Award the XP
      const xpResult = await awardXP(totalXP, `Completed ${interviewData.interviewType} interview`);
      
      if (xpResult) {
        setXpReward(xpResult);
        setStreakSaved(true);
        setCurrentStreak(progress?.currentStreak || 0);
      }

      // Check for perfect week bonus (7 days in a row)
      if (progress && progress.practicesThisWeek === 7) {
        await awardXP(XP_REWARDS.PERFECT_WEEK, 'Perfect week bonus!');
      }
    } catch (error) {
      console.error('Error updating streak and XP:', error);
    }
  };

  const renderStrength = (strength: StrengthItem | string, index: number) => {
    if (typeof strength === "string") {
      return (
        <li key={index} className="flex items-start gap-2">
          <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
          <span>{strength}</span>
        </li>
      );
    }

    return (
      <li key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
        <div className="flex-1">
          <div className="font-medium text-green-800">{strength.skill}</div>
          <div className="text-sm text-green-700 mt-1">{strength.evidence}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {strength.category}
            </Badge>
            <span className="text-xs font-medium text-green-600">Score: {(strength.score / 10).toFixed(1)}/10</span>
          </div>
        </div>
      </li>
    );
  };

  const renderWeakness = (weakness: WeaknessItem | string, index: number) => {
    if (typeof weakness === "string") {
      return (
        <li key={index} className="flex items-start gap-2">
          <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
          <span>{weakness}</span>
        </li>
      );
    }

    return (
      <li key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
        <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
        <div className="flex-1">
          <div className="font-medium text-yellow-800">{weakness.skill}</div>
          <div className="text-sm text-yellow-700 mt-1">{weakness.issue}</div>
          {weakness.improvementActions && weakness.improvementActions.length > 0 && (
            <div className="mt-2">
              <div className="text-xs font-medium text-yellow-600 mb-1">Actions:</div>
              <ul className="text-xs text-yellow-700 list-disc list-inside">
                {weakness.improvementActions.map((action, actionIndex) => (
                  <li key={actionIndex}>{action}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {weakness.category}
            </Badge>
            <span className="text-xs font-medium text-yellow-600">Score: {(weakness.score / 10).toFixed(1)}/10</span>
          </div>
        </div>
      </li>
    );
  };

  const downloadResults = () => {
    if (!feedback || !interviewData) return;

    const formatStrengthsForDownload = () => {
      return feedback.strengths
        .map((s) => {
          if (typeof s === "string") return `• ${s}`;
          return `• ${s.skill}: ${s.evidence} (Score: ${(s.score / 10).toFixed(1)}/10)`;
        })
        .join("\n");
    };

    const formatWeaknessesForDownload = () => {
      return feedback.weaknesses
        .map((w) => {
          if (typeof w === "string") return `• ${w}`;
          return `• ${w.skill}: ${w.issue} (Score: ${(w.score / 10).toFixed(1)}/10)`;
        })
        .join("\n");
    };

    const results = `
INTERVIEW RESULTS REPORT
========================

Interview Type: ${interviewData.interviewType}
Interviewer: ${interviewData.interviewer}
${interviewData.duration !== undefined ? `Duration: ${Math.floor(interviewData.duration / 60)}m ${interviewData.duration % 60}s` : ''}
Overall Score: ${feedback.overallScore}/100

STRENGTHS:
${formatStrengthsForDownload()}

AREAS FOR IMPROVEMENT:
${formatWeaknessesForDownload()}

RECOMMENDED ACTIONS:
${feedback.improvements.map((i) => `• ${i}`).join("\n")}

OVERALL FEEDBACK:
${feedback.overallFeedback}

FULL TRANSCRIPT:
================
${interviewData.transcript}
`;

    const blob = new Blob([results], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interview-results-${new Date().toISOString().split("T")[0]}.txt`;
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
      <div className="flex justify-between items-center p-4 m-4 bg-background rounded-lg shadow-sm border">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <Mic className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">Cadence</span>
        </div>
        <div className="flex gap-2">
          {feedback && (
            <Button variant="outline" onClick={downloadResults} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Results
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate("/dashboard")} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Interview Results</CardTitle>
                <p className="text-muted-foreground mt-1">
                  {interviewData.interviewType} • Interviewed by {interviewData.interviewer}
                </p>
                {interviewData.duration !== undefined && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Duration: {Math.floor(interviewData.duration / 60)}m {interviewData.duration % 60}s
                  </p>
                )}
              </div>
              {feedback && (
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(feedback.overallScore)}`}>
                    {feedback.overallScore}/100
                  </div>
                  <Badge variant={getScoreBadgeVariant(feedback.overallScore)}>Overall Score</Badge>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {streakSaved && currentStreak > 0 && (
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-center gap-3">
                <Flame className="w-8 h-8 text-orange-500" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    Streak saved! Don't break it tomorrow.
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    You're on a {currentStreak} day streak 🔥
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {feedback && (
          <>
            {feedback.detailedScores && (
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(feedback.detailedScores.communication)}`}>
                        {(feedback.detailedScores.communication / 10).toFixed(1)}/10
                      </div>
                      <div className="text-sm text-muted-foreground">Communication</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(feedback.detailedScores.confidence)}`}>
                        {(feedback.detailedScores.confidence / 10).toFixed(1)}/10
                      </div>
                      <div className="text-sm text-muted-foreground">Confidence</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(feedback.detailedScores.salesSkills)}`}>
                        {(feedback.detailedScores.salesSkills / 10).toFixed(1)}/10
                      </div>
                      <div className="text-sm text-muted-foreground">Sales Skills</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-2xl font-bold ${getScoreColor(feedback.detailedScores.interviewMechanics)}`}
                      >
                        {(feedback.detailedScores.interviewMechanics / 10).toFixed(1)}/10
                      </div>
                      <div className="text-sm text-muted-foreground">Interview Mechanics</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="w-5 h-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {feedback.strengths.map((strength, index) => renderStrength(strength, index))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-600">
                  <AlertTriangle className="w-5 h-5" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {feedback.weaknesses.map((weakness, index) => renderWeakness(weakness, index))}
                </ul>
              </CardContent>
            </Card>

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

        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate("/interview-preparation")} size="lg">
            Practice Another Interview
          </Button>
          <Button variant="outline" onClick={() => navigate("/dashboard")} size="lg">
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* XP Reward Popup */}
      {xpReward && (
        <XPRewardPopup
          xpAwarded={xpReward.xpAwarded}
          oldTotalXP={xpReward.oldTotalXP}
          newTotalXP={xpReward.newTotalXP}
          leveledUp={xpReward.leveledUp}
          newLevel={xpReward.newLevel}
          oldLevel={xpReward.oldLevel}
          streakSaved={streakSaved}
          onClose={() => setXpReward(null)}
        />
      )}
    </div>
  );
}
