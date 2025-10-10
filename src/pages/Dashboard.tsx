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
  const [progressData, setProgressData] = useState<any[]>([]);
  const [strengths, setStrengths] = useState<any[]>([]);
  const [improvements, setImprovements] = useState<any[]>([]);
  const [recentInterviews, setRecentInterviews] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Fetch all sessions for aggregation
      const { data: sessions, error } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true }); // Oldest first for chronological chart

      if (error) {
        console.error('Error fetching sessions:', error);
        setIsLoading(false);
        return;
      }

      if (!sessions || sessions.length === 0) {
        // No interviews yet - set empty state
        setProgressData([]);
        setStrengths([]);
        setImprovements([]);
        setRecentInterviews([]);
        setIsLoading(false);
        return;
      }

      // Build progress data from individual sessions (chronological)
      const progressDataFormatted = sessions.length < 2 ? [] : sessions.map((session) => {
        const date = new Date(session.created_at);
        const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return {
          date: dateLabel,
          score: session.overall_score,
          fullDate: session.created_at
        };
      });

      setProgressData(progressDataFormatted);

      // Aggregate strengths and weaknesses - exclude fallback values
      const fallbackValues = ['Interview Participation', 'Overall Performance', 'General Performance'];
      const strengthsCount: any = {};
      const weaknessesCount: any = {};

      sessions.forEach(session => {
        if (session.strengths && Array.isArray(session.strengths)) {
          session.strengths.forEach((strength: any) => {
            const skill = strength.skill || strength;
            // Skip fallback values
            if (typeof skill === 'string' && !fallbackValues.includes(skill)) {
              if (!strengthsCount[skill]) {
                strengthsCount[skill] = { 
                  skill, 
                  count: 0, 
                  scores: [], 
                  category: strength.category || 'General' 
                };
              }
              strengthsCount[skill].count++;
              strengthsCount[skill].scores.push(strength.score || 8);
            }
          });
        }

        if (session.weaknesses && Array.isArray(session.weaknesses)) {
          session.weaknesses.forEach((weakness: any) => {
            const skill = weakness.skill || weakness;
            // Skip fallback values
            if (typeof skill === 'string' && !fallbackValues.includes(skill)) {
              if (!weaknessesCount[skill]) {
                weaknessesCount[skill] = { 
                  skill, 
                  count: 0, 
                  scores: [], 
                  category: weakness.category || 'General' 
                };
              }
              weaknessesCount[skill].count++;
              weaknessesCount[skill].scores.push(weakness.score || 5);
            }
          });
        }
      });

      // Top 3 most frequent strengths with average score
      const strengthsFormatted = Object.values(strengthsCount)
        .map((item: any) => ({
          skill: item.skill,
          count: item.count,
          score: Math.round(item.scores.reduce((sum: number, score: number) => sum + score, 0) / item.scores.length * 10),
          trend: "up",
          category: item.category
        }))
        .sort((a, b) => b.count - a.count) // Sort by frequency
        .slice(0, 3);

      // Top 3 most frequent weaknesses with average score
      const improvementsFormatted = Object.values(weaknessesCount)
        .map((item: any) => ({
          skill: item.skill,
          count: item.count,
          score: Math.round(item.scores.reduce((sum: number, score: number) => sum + score, 0) / item.scores.length * 10),
          trend: "down",
          category: item.category
        }))
        .sort((a, b) => b.count - a.count) // Sort by frequency
        .slice(0, 3);

      setStrengths(strengthsFormatted);
      setImprovements(improvementsFormatted);

      // Recent interviews with full data for navigation (newest first)
      const recentSessions = [...sessions].reverse().slice(0, 5);
      const recentFormatted = recentSessions.map(session => ({
        id: session.id,
        interviewer_name: session.interviewer_name,
        interview_type: session.interview_type,
        overall_score: session.overall_score,
        created_at: session.created_at,
        transcript: session.transcript,
        strengths: session.strengths,
        weaknesses: session.weaknesses,
        improvements: session.improvements,
        scores: session.scores,
        title: `${session.interview_type} - ${session.interviewer_name}`,
        time: getTimeAgo(session.created_at),
        score: session.overall_score
      }));

      setRecentInterviews(recentFormatted);
      setIsLoading(false);

    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
      setIsLoading(false);
    }
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
    navigate('/dashboard/interview-results', {
      state: {
        interviewData: {
          interviewer: interview.interviewer_name,
          interviewType: interview.interview_type,
          transcript: interview.transcript,
          jobPosting: interview.job_posting
        },
        savedFeedback: {
          overallScore: interview.overall_score,
          strengths: interview.strengths,
          weaknesses: interview.weaknesses,
          improvements: interview.improvements,
          detailedScores: interview.scores,
          overallFeedback: `Interview completed with a score of ${interview.overall_score}/100`
        }
      }
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Track your interview progress and identify areas for improvement
        </p>
      </div>

      {/* Progress Over Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : progressData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-center">
              <div>
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Complete more interviews to track progress
                </p>
              </div>
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                  />
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

      {/* Strengths and Improvements */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Strengths */}
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
                <p className="text-sm text-muted-foreground">
                  Complete interviews to see your top strengths
                </p>
              </div>
            ) : (
              strengths.map((strength) => (
                <div key={strength.skill} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">{strength.skill}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{strength.score}%</span>
                    {strength.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Areas for Improvement */}
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
                <p className="text-sm text-muted-foreground">
                  Complete interviews to see your top weaknesses
                </p>
              </div>
            ) : (
              improvements.map((improvement) => (
                <div key={improvement.skill} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="font-medium">{improvement.skill}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{improvement.score}%</span>
                    {improvement.trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
                    {improvement.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Interviews */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Interviews</CardTitle>
          {recentInterviews.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/interview-history')}>
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
                <Button onClick={() => navigate('/dashboard/interview-roleplay')} className="gap-2">
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
                  <Badge variant={interview.score >= 80 ? "default" : "secondary"}>
                    {interview.score}%
                  </Badge>
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
