import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Clock, Play, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [allSessions, setAllSessions] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [strengths, setStrengths] = useState<any[]>([]);
  const [improvements, setImprovements] = useState<any[]>([]);
  const [recentInterviews, setRecentInterviews] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month" | "all">("all");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data: sessions, error } = await supabase
        .from("interview_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching sessions:", error);
        setIsLoading(false);
        return;
      }

      if (!sessions || sessions.length === 0) {
        setAllSessions([]);
        setProgressData([]);
        setStrengths([]);
        setImprovements([]);
        setRecentInterviews([]);
        setIsLoading(false);
        return;
      }

      setAllSessions(sessions);

      const progressDataFormatted = buildProgressData(sessions, "all");
      setProgressData(progressDataFormatted);

      const completedSessions = sessions.filter((s) => s.analysis_results !== null && s.analysis_results !== undefined);

      if (completedSessions.length < 1) {
        setStrengths([]);
        setImprovements([]);
      } else {
        const strengthsCount: any = {};
        const weaknessesCount: any = {};

        completedSessions.forEach((session) => {
          let strengthsArray: any[] = [];
          if (session.strengths) {
            if (Array.isArray(session.strengths)) {
              strengthsArray = session.strengths;
            } else if (typeof session.strengths === "string") {
              try {
                strengthsArray = JSON.parse(session.strengths);
              } catch (e) {
                console.error("Error parsing strengths:", e);
              }
            }
          }

          strengthsArray.forEach((strength: any) => {
            const skillName = typeof strength === "string" ? strength : strength.skill || strength.name || "Unknown";
            const skillScore = typeof strength === "object" ? strength.score || 75 : 75;

            if (!strengthsCount[skillName]) {
              strengthsCount[skillName] = {
                skill: skillName,
                count: 0,
                scores: [],
                category: typeof strength === "object" ? strength.category || "General" : "General",
              };
            }
            strengthsCount[skillName].count++;
            strengthsCount[skillName].scores.push(skillScore);
          });

          let weaknessesArray: any[] = [];
          if (session.weaknesses) {
            if (Array.isArray(session.weaknesses)) {
              weaknessesArray = session.weaknesses;
            } else if (typeof session.weaknesses === "string") {
              try {
                weaknessesArray = JSON.parse(session.weaknesses);
              } catch (e) {
                console.error("Error parsing weaknesses:", e);
              }
            }
          }

          weaknessesArray.forEach((weakness: any) => {
            const skillName = typeof weakness === "string" ? weakness : weakness.skill || weakness.name || "Unknown";
            const skillScore = typeof weakness === "object" ? weakness.score || 50 : 50;

            if (!weaknessesCount[skillName]) {
              weaknessesCount[skillName] = {
                skill: skillName,
                count: 0,
                scores: [],
                category: typeof weakness === "object" ? weakness.category || "General" : "General",
              };
            }
            weaknessesCount[skillName].count++;
            weaknessesCount[skillName].scores.push(skillScore);
          });
        });

        const strengthsFormatted = Object.values(strengthsCount)
          .map((item: any) => {
            const avgScore = item.scores.reduce((sum: number, score: number) => sum + score, 0) / item.scores.length;
            return {
              skill: item.skill,
              count: item.count,
              score: avgScore.toFixed(0),
              trend: "up",
              category: item.category,
            };
          })
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        const improvementsFormatted = Object.values(weaknessesCount)
          .map((item: any) => {
            const avgScore = item.scores.reduce((sum: number, score: number) => sum + score, 0) / item.scores.length;
            return {
              skill: item.skill,
              count: item.count,
              score: avgScore.toFixed(0),
              trend: "down",
              category: item.category,
            };
          })
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setStrengths(strengthsFormatted);
        setImprovements(improvementsFormatted);
      }

      const completedForRecent = sessions.filter((s) => s.analysis_results !== null);
      const recentSessions = [...completedForRecent].reverse().slice(0, 5);
      const recentFormatted = recentSessions.map((session) => ({
        id: session.id,
        interviewer_name: session.interviewer_name,
        interview_type: session.interview_type,
        overall_score: session.overall_score,
        created_at: session.created_at,
        transcript: session.transcript,
        job_posting: session.job_posting,
        strengths: session.strengths,
        weaknesses: session.weaknesses,
        improvements: session.improvements,
        scores: session.scores,
        analysis_results: session.analysis_results,
        title: `${session.interview_type} - ${session.interviewer_name}`,
        time: getTimeAgo(session.created_at),
        score: session.overall_score,
      }));

      setRecentInterviews(recentFormatted);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading dashboard:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const buildProgressData = (sessions: any[], range: "today" | "week" | "month" | "all") => {
    if (sessions.length === 0) return [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let filteredSessions = sessions;

    if (range === "today") {
      filteredSessions = sessions.filter((s) => {
        const sessionDate = new Date(s.created_at);
        return sessionDate >= today;
      });
    } else if (range === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filteredSessions = sessions.filter((s) => new Date(s.created_at) >= weekAgo);
    } else if (range === "month") {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filteredSessions = sessions.filter((s) => new Date(s.created_at) >= monthAgo);
    }

    if (filteredSessions.length === 0) return [];

    if (range === "today") {
      return filteredSessions.map((session) => {
        const date = new Date(session.created_at);
        const timeLabel = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
        return {
          date: timeLabel,
          score: session.overall_score,
          fullDate: session.created_at,
        };
      });
    }

    const groupedByDate: { [key: string]: { scores: number[]; date: Date } } = {};

    filteredSessions.forEach((session) => {
      const sessionDate = new Date(session.created_at);
      const dateKey = sessionDate.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" });

      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = { scores: [], date: sessionDate };
      }
      groupedByDate[dateKey].scores.push(session.overall_score);
    });

    return Object.entries(groupedByDate)
      .map(([dateKey, data]) => {
        const avgScore = Math.round(data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length);
        const dateLabel = data.date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        return {
          date: dateLabel,
          score: avgScore,
          fullDate: data.date.toISOString(),
        };
      })
      .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
  };

  const handleTimeRangeChange = (range: "today" | "week" | "month" | "all") => {
    setTimeRange(range);
    const newData = buildProgressData(allSessions, range);
    setProgressData(newData);
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const handleInterviewClick = (interview: any) => {
    console.log("📊 Navigating to interview results:", interview);
    navigate("/dashboard/interview-results", {
      state: {
        interviewData: {
          interviewer: interview.interviewer_name,
          interviewType: interview.interview_type,
          transcript: interview.transcript,
          jobPosting: interview.job_posting,
        },
        savedFeedback: {
          overallScore: interview.overall_score,
          strengths: interview.strengths,
          weaknesses: interview.weaknesses,
          improvements: interview.improvements,
          detailedScores: interview.scores,
          overallFeedback: `Interview completed with a score of ${interview.overall_score}/100`,
        },
      },
    });
  };

  const chartConfig = {
    score: {
      label: "Interview Score",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Track your interview progress and identify areas for improvement</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Progress Over Time</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={timeRange === "today" ? "default" : "outline"}
                size="sm"
                onClick={() => handleTimeRangeChange("today")}
              >
                Today
              </Button>
              <Button
                variant={timeRange === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => handleTimeRangeChange("week")}
              >
                This Week
              </Button>
              <Button
                variant={timeRange === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => handleTimeRangeChange("month")}
              >
                This Month
              </Button>
              <Button
                variant={timeRange === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => handleTimeRangeChange("all")}
              >
                All Time
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : progressData.length === 0 ? (
            <div className="h-[400px] flex items-center justify-center text-center">
              <div>
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {timeRange === "today" && "No interviews completed today"}
                  {timeRange === "week" && "No interviews completed this week"}
                  {timeRange === "month" && "No interviews completed this month"}
                  {timeRange === "all" && "Complete your first interview to track progress"}
                </p>
              </div>
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    angle={progressData.length > 10 ? -45 : 0}
                    textAnchor={progressData.length > 10 ? "end" : "middle"}
                    height={progressData.length > 10 ? 60 : 30}
                  />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Top Strengths</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-green-50 rounded-lg animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <div className="w-24 h-4 bg-green-300 rounded"></div>
                  </div>
                  <div className="w-12 h-4 bg-green-300 rounded"></div>
                </div>
              ))
            ) : strengths.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">Complete an interview to see your top strengths</p>
              </div>
            ) : (
              strengths.map((strength) => (
                <div key={strength.skill} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">{strength.skill}</span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-5">
                      Appeared in {strength.count} {strength.count === 1 ? "interview" : "interviews"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{strength.score}/100</span>
                    {strength.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-lg animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-300 rounded-full"></div>
                    <div className="w-32 h-4 bg-red-300 rounded"></div>
                  </div>
                  <div className="w-12 h-4 bg-red-300 rounded"></div>
                </div>
              ))
            ) : improvements.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">Complete an interview to see areas for improvement</p>
              </div>
            ) : (
              improvements.map((improvement) => (
                <div key={improvement.skill} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="font-medium">{improvement.skill}</span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-5">
                      Appeared in {improvement.count} {improvement.count === 1 ? "interview" : "interviews"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{improvement.score}/100</span>
                    {improvement.trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Interviews</CardTitle>
          {recentInterviews.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/interview-history")}>
              View All
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-muted rounded"></div>
                      <div className="w-20 h-3 bg-muted rounded"></div>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          ) : recentInterviews.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">No interviews yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start practicing with our AI interviewer to see your progress here.
                </p>
                <Button onClick={() => navigate("/dashboard/interview-setup")} className="gap-2">
                  <Play className="h-4 w-4" />
                  Start Interview Practice
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {recentInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleInterviewClick(interview)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <div className="w-4 h-4 bg-primary rounded"></div>
                    </div>
                    <div>
                      <h4 className="font-medium">{interview.title}</h4>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{interview.time}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={interview.score >= 80 ? "default" : "secondary"}>{interview.score}%</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
