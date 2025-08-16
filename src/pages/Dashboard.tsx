import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";

const Dashboard = () => {
  const progressData = [
    { month: "Jan", score: 65 },
    { month: "Feb", score: 70 },
    { month: "Mar", score: 72 },
    { month: "Apr", score: 78 },
    { month: "May", score: 82 },
    { month: "Jun", score: 85 },
  ];

  const strengths = [
    { skill: "Communication", score: 92, trend: "up" },
    { skill: "Problem Solving", score: 88, trend: "up" },
    { skill: "Technical Knowledge", score: 85, trend: "stable" },
    { skill: "Leadership", score: 82, trend: "up" },
  ];

  const improvements = [
    { skill: "Time Management", score: 65, trend: "down" },
    { skill: "Stress Handling", score: 68, trend: "stable" },
    { skill: "Conflict Resolution", score: 70, trend: "up" },
    { skill: "Negotiation", score: 72, trend: "down" },
  ];

  const recentInterviews = [
    { id: 1, title: "Software Engineer - Google", time: "5 min ago", score: 85 },
    { id: 2, title: "Product Manager - Meta", time: "45 min ago", score: 78 },
    { id: 3, title: "Data Scientist - Netflix", time: "Yesterday", score: 92 },
    { id: 4, title: "Frontend Developer - Spotify", time: "2 days ago", score: 76 },
  ];

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
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <XAxis dataKey="month" />
                <YAxis />
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
            {strengths.map((strength) => (
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
            ))}
          </CardContent>
        </Card>

        {/* Areas for Improvement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {improvements.map((improvement) => (
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
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Interviews */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Interviews</CardTitle>
          <Button variant="outline" size="sm">
            All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentInterviews.map((interview) => (
              <div key={interview.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
