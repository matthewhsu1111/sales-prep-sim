import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Award,
  Target,
  BarChart3,
  Plus,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Import interviewer images
import rebeccaImage from "@/assets/rebecca-martinez.jpg";
import jakeImage from "@/assets/jake-thompson.jpg";
import michaelImage from "@/assets/michael-chen.jpg";

interface InterviewSession {
  id: string;
  created_at: string;
  interviewer_name: string;
  interview_type: string;
  overall_score: number;
  strengths: string[];
  weaknesses: string[];
}

interface SkillFrequency {
  skill: string;
  count: number;
  averageScore: number;
}

const interviewerImages = {
  "Rebecca Martinez": rebeccaImage,
  "Jake Thompson": jakeImage,
  "Michael Chen": michaelImage,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userName, setUserName] = useState("");
  const [recentInterviews, setRecentInterviews] = useState<InterviewSession[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [topStrengths, setTopStrengths] = useState<SkillFrequency[]>([]);
  const [topWeaknesses, setTopWeaknesses] = useState<SkillFrequency[]>([]);
  const [averageScore, setAverageScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/signin");
        return;
      }

      // Get user profile
      const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();

      if (profile) {
        setUserName(profile.full_name || "User");
      }

      // Get all interview sessions ordered by date (chronological for chart)
      const { data: sessions, error } = await supabase
        .from("interview_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching sessions:", error);
        throw error;
      }

      if (sessions && sessions.length > 0) {
        // Set recent interviews (last 5, most recent first)
        setRecentInterviews(sessions.slice(-5).reverse());

        // Calculate average score
        const avg = sessions.reduce((sum, session) => sum + (session.overall_score || 0), 0) / sessions.length;
        setAverageScore(Math.round(avg));

        // Prepare progress chart data (chronological order)
        const chartData = sessions.map((session) => ({
          date: new Date(session.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          score: session.overall_score || 0,
        }));
        setProgressData(chartData);

        // Aggregate strengths across ALL interviews
        const strengthsMap = new Map<string, { count: number; totalScore: number }>();
        const weaknessesMap = new Map<string, { count: number; totalScore: number }>();

        sessions.forEach((session) => {
          // Process strengths
          if (session.strengths && Array.isArray(session.strengths)) {
            session.strengths.forEach((strength: string) => {
              const existing = strengthsMap.get(strength) || { count: 0, totalScore: 0 };
              strengthsMap.set(strength, {
                count: existing.count + 1,
                totalScore: existing.totalScore + (session.overall_score || 0),
              });
            });
          }

          // Process weaknesses
          if (session.weaknesses && Array.isArray(session.weaknesses)) {
            session.weaknesses.forEach((weakness: string) => {
              const existing = weaknessesMap.get(weakness) || { count: 0, totalScore: 0 };
              weaknessesMap.set(weakness, {
                count: existing.count + 1,
                totalScore: existing.totalScore + (session.overall_score || 0),
              });
            });
          }
        });

        // Convert to arrays and calculate averages
        const strengthsArray: SkillFrequency[] = Array.from(strengthsMap.entries())
          .map(([skill, data]) => ({
            skill,
            count: data.count,
            averageScore: Math.round(data.totalScore / data.count),
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        const weaknessesArray: SkillFrequency[] = Array.from(weaknessesMap.entries())
          .map(([skill, data]) => ({
            skill,
            count: data.count,
            averageScore: Math.round(data.totalScore / data.count),
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setTopStrengths(strengthsArray);
        setTopWeaknesses(weaknessesArray);
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartInterview = () => {
    navigate("/dashboard/interview-setup");
  };

  const handleViewHistory = () => {
    navigate("/dashboard/interview-history");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">~ Cadence</div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Welcome back, {userName}</span>
              <Avatar>
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentInterviews.length}</div>
              <p className="text-xs text-muted-foreground">Across all types</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore}/100</div>
              <Progress value={averageScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  recentInterviews.filter((i) => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(i.created_at) > weekAgo;
                  }).length
                }
              </div>
              <p className="text-xs text-muted-foreground">Interviews completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Progress Chart & Strengths/Weaknesses */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                {progressData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Complete your first interview to see progress</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Strengths and Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Strengths */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <TrendingUp className="h-5 w-5" />
                    Top Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {topStrengths.length > 0 ? (
                    <div className="space-y-3">
                      {topStrengths.map((strength, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">{strength.skill}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {strength.count}x
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Complete an interview to see your strengths</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Areas to Improve */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600">
                    <TrendingDown className="h-5 w-5" />
                    Areas to Improve
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {topWeaknesses.length > 0 ? (
                    <div className="space-y-3">
                      {topWeaknesses.map((weakness, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium">{weakness.skill}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {weakness.count}x
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <XCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Complete an interview to see improvement areas</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Recent Interviews & CTA */}
          <div className="space-y-6">
            {/* Start New Interview */}
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle>Ready to Practice?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4 opacity-90">
                  Start a new interview session and improve your skills with AI-powered feedback.
                </p>
                <Button onClick={handleStartInterview} variant="secondary" className="w-full" size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Start New Interview
                </Button>
              </CardContent>
            </Card>

            {/* Recent Interviews */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Interviews</CardTitle>
                  <Button variant="ghost" size="sm" onClick={handleViewHistory}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentInterviews.length > 0 ? (
                  <div className="space-y-4">
                    {recentInterviews.map((interview) => (
                      <div key={interview.id} className="flex items-center gap-3 p-3 rounded-lg border">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={interviewerImages[interview.interviewer_name as keyof typeof interviewerImages]}
                          />
                          <AvatarFallback>{interview.interviewer_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{interview.interviewer_name}</p>
                          <p className="text-xs text-muted-foreground">{interview.interview_type}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">{interview.overall_score}/100</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(interview.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No interviews yet</p>
                    <p className="text-xs">Start your first interview to see it here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
