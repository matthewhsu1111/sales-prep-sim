import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, TrendingDown, Minus, Medal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { Skeleton } from '@/components/ui/skeleton';

interface LeaderboardEntry {
  user_id: string;
  first_name: string | null;
  name: string | null;
  weekly_xp: number;
  current_level: number;
  current_streak: number;
  rank: number;
}

export default function Leaderboards() {
  const { user } = useAuth();
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  async function fetchLeaderboards() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('weekly_leaderboard')
        .select('*')
        .limit(50);

      if (error) throw error;

      setWeeklyLeaderboard(data || []);
      
      // Find current user's rank
      const currentUserEntry = data?.find(entry => entry.user_id === user?.id);
      setUserRank(currentUserEntry?.rank || null);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }

  function getRankIcon(rank: number) {
    switch (rank) {
      case 1:
        return <Medal className="w-6 h-6 text-yellow-500 fill-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400 fill-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600 fill-amber-600" />;
      default:
        return <span className="text-muted-foreground font-semibold">#{rank}</span>;
    }
  }

  function getDisplayName(entry: LeaderboardEntry) {
    return entry.first_name || entry.name || 'Anonymous User';
  }

  function getInitials(entry: LeaderboardEntry) {
    const name = getDisplayName(entry);
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Trophy className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Leaderboards</h1>
        </div>
        <p className="text-muted-foreground">
          Compete with other interview masters and climb the ranks!
        </p>
      </div>

      {userRank && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-primary">#{userRank}</div>
                <div>
                  <p className="font-semibold">Your Current Rank</p>
                  <p className="text-sm text-muted-foreground">This Week</p>
                </div>
              </div>
              <Badge variant="secondary">
                Keep practicing to climb higher!
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="all-time" disabled>All-Time (Coming Soon)</TabsTrigger>
          <TabsTrigger value="friends" disabled>Friends (Coming Soon)</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Leaderboard</CardTitle>
              <CardDescription>
                Top performers this week • Resets every Monday
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {weeklyLeaderboard.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No rankings yet this week. Be the first to practice!</p>
                </div>
              ) : (
                weeklyLeaderboard.map((entry) => (
                  <div
                    key={entry.user_id}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                      entry.user_id === user?.id
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="w-12 flex justify-center">
                      {getRankIcon(entry.rank)}
                    </div>

                    <Avatar>
                      <AvatarFallback>{getInitials(entry)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <p className="font-semibold">
                        {getDisplayName(entry)}
                        {entry.user_id === user?.id && (
                          <Badge variant="secondary" className="ml-2 text-xs">You</Badge>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Level {entry.current_level} • {entry.current_streak} day streak
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg">{entry.weekly_xp.toLocaleString()} XP</p>
                      <p className="text-sm text-muted-foreground">this week</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
