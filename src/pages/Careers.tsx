import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Flame, Calendar, Target, TrendingUp } from "lucide-react";

interface UserProgress {
  current_week: number;
  current_day: number;
  current_streak: number;
  longest_streak: number;
  total_days_completed: number;
  last_completion_date: string | null;
}

interface TaskCompletion {
  task_type: string;
  completed_at: string;
}

interface DailyTask {
  id: string;
  type: string;
  description: string;
  completed: boolean;
}

const WEEKDAY_TASKS = [
  { id: "cold_calls", type: "cold_calls", description: "10 cold calls/emails to hiring managers" },
  { id: "follow_ups", type: "follow_ups", description: "5 follow-ups" },
  { id: "interview_practice", type: "interview_practice", description: "20 interview questions OR actual interviews" }
];

const WEEKEND_TASKS = [
  { id: "applications", type: "applications", description: "5 new applications" }
];

export default function Careers() {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const getCurrentDayTasks = () => {
    const dayOfWeek = currentDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6; // Sunday, Friday, Saturday
    return isWeekend ? WEEKEND_TASKS : WEEKDAY_TASKS;
  };

  const initializeUserProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('initialize_user_progress', {
        user_uuid: user.id
      });

      if (error) throw error;
      await loadUserProgress();
    } catch (error) {
      console.error('Error initializing user progress:', error);
      toast.error("Failed to initialize progress tracking");
    }
  };

  const loadUserProgress = async () => {
    if (!user) return;

    try {
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (progressError && progressError.code !== 'PGRST116') throw progressError;

      if (progressData) {
        setUserProgress(progressData);
      }

      const { data: completionsData, error: completionsError } = await supabase
        .from('daily_task_completions')
        .select('task_type, completed_at')
        .eq('user_id', user.id)
        .eq('week_number', progressData?.current_week || 1)
        .eq('day_number', progressData?.current_day || 1)
        .eq('date_completed', currentDate.toISOString().split('T')[0]);

      if (completionsError) throw completionsError;

      const tasks = getCurrentDayTasks().map(task => ({
        ...task,
        completed: completionsData?.some(completion => completion.task_type === task.type) || false
      }));

      setDailyTasks(tasks);
    } catch (error) {
      console.error('Error loading user progress:', error);
      toast.error("Failed to load progress");
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId: string, taskType: string, taskDescription: string) => {
    if (!user || !userProgress) return;

    const task = dailyTasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      if (task.completed) {
        // Remove completion
        const { error } = await supabase
          .from('daily_task_completions')
          .delete()
          .eq('user_id', user.id)
          .eq('week_number', userProgress.current_week)
          .eq('day_number', userProgress.current_day)
          .eq('task_type', taskType);

        if (error) throw error;
      } else {
        // Add completion
        const { error } = await supabase
          .from('daily_task_completions')
          .insert({
            user_id: user.id,
            week_number: userProgress.current_week,
            day_number: userProgress.current_day,
            task_type: taskType,
            task_description: taskDescription,
            date_completed: currentDate.toISOString().split('T')[0]
          });

        if (error) throw error;
      }

      // Update local state
      setDailyTasks(tasks => tasks.map(t => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ));

      // Check if all tasks are completed
      const updatedTasks = dailyTasks.map(t => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      
      const allCompleted = updatedTasks.every(t => t.completed);
      
      if (allCompleted && !task.completed) {
        toast.success("🎉 Day Complete! Amazing work!");
        await completeDay();
      }

    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error("Failed to update task");
    }
  };

  const completeDay = async () => {
    if (!user || !userProgress) return;

    try {
      const today = currentDate.toISOString().split('T')[0];
      const isConsecutive = userProgress.last_completion_date === 
        new Date(currentDate.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const newStreak = isConsecutive ? userProgress.current_streak + 1 : 1;
      
      const { error } = await supabase
        .from('user_progress')
        .update({
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, userProgress.longest_streak),
          total_days_completed: userProgress.total_days_completed + 1,
          last_completion_date: today
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setUserProgress(prev => prev ? {
        ...prev,
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, prev.longest_streak),
        total_days_completed: prev.total_days_completed + 1,
        last_completion_date: today
      } : null);

    } catch (error) {
      console.error('Error completing day:', error);
    }
  };

  useEffect(() => {
    if (user) {
      initializeUserProgress();
    }
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const allTasksCompleted = dailyTasks.every(task => task.completed);
  const completionPercentage = dailyTasks.length > 0 ? (dailyTasks.filter(task => task.completed).length / dailyTasks.length) * 100 : 0;
  const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
  const currentTime = currentDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    timeZoneName: 'short' 
  });

  return (
    <div className="flex-1 space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Cadence Careers!</h1>
        <p className="text-muted-foreground">
          Follow our proven week-by-week system to land sales interviews faster than ever before
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Week {userProgress?.current_week || 1}</p>
                <p className="text-xs text-muted-foreground">Day {userProgress?.current_day || 1}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">{userProgress?.current_streak || 0} Day Streak</p>
                <p className="text-xs text-muted-foreground">Keep it going!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">{userProgress?.total_days_completed || 0} Days</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">{userProgress?.longest_streak || 0} Days</p>
                <p className="text-xs text-muted-foreground">Best Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Action Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Your Daily Action Plan</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {dayOfWeek} • {currentTime}
              </p>
              <p className="text-sm text-muted-foreground">
                Each week builds momentum. Each day moves you closer to your ideal sales role.
              </p>
            </div>
            {allTasksCompleted && (
              <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-200">
                Day Complete! 🎉
              </Badge>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Daily Progress</span>
              <span>{Math.round(completionPercentage)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Day {userProgress?.current_day || 1}</h3>
            {dailyTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={task.id}
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id, task.type, task.description)}
                />
                <label
                  htmlFor={task.id}
                  className={`flex-1 cursor-pointer text-sm ${
                    task.completed ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {task.description}
                </label>
              </div>
            ))}
          </div>

          {!allTasksCompleted && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Complete all tasks to unlock tomorrow's challenges and build your streak! 🔥
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}