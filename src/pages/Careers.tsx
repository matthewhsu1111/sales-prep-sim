import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Flame, Calendar, Target, TrendingUp, CheckCircle, Clock } from "lucide-react";

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
  { id: "applications", type: "applications", description: "5 new applications per day" }
];

export default function Careers() {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const getCurrentDayTasks = () => {
    const dayOfWeek = currentDate.getDay();
    // Monday-Thursday = interview focus, Friday-Sunday = application marathon
    const isApplicationDay = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6; // Sunday, Friday, Saturday
    return isApplicationDay ? WEEKEND_TASKS : WEEKDAY_TASKS;
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
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Cadence Careers!</h1>
        <p className="text-muted-foreground">
          Follow our proven week-by-week system to land sales interviews faster than ever before
        </p>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Week {userProgress?.current_week || 1}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProgress?.current_streak || 0} days</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProgress?.longest_streak || 0} days</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Complete</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProgress?.total_days_completed || 0} days</div>
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
                Each week builds momentum. Each day moves you closer to your ideal sales role.
              </p>
            </div>
            {allTasksCompleted && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                <CheckCircle className="w-4 h-4 mr-1" />
                Day Complete!
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Date and Progress */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {dayOfWeek} • {currentTime}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Day {userProgress?.current_day || 1} Progress</span>
                <span>{Math.round(completionPercentage)}% Complete</span>
              </div>
              <Progress value={completionPercentage} className="w-full" />
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-4">
            {dailyTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start space-x-3 p-4 rounded-lg border transition-colors hover:bg-muted/50"
              >
                <Checkbox
                  id={task.id}
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id, task.type, task.description)}
                />
                <label
                  htmlFor={task.id}
                  className={`flex-1 text-sm cursor-pointer ${
                    task.completed ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {task.description}
                </label>
              </div>
            ))}
          </div>

          {allTasksCompleted && (
            <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-1">
                Excellent Work!
              </h3>
              <p className="text-green-700 dark:text-green-300 text-sm">
                You've completed all tasks for today. Your streak continues!
              </p>
            </div>
          )}

          {!allTasksCompleted && (
            <div className="text-center p-4 bg-muted/50 rounded-lg">
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