import { useState, useEffect } from 'react';
import { Trophy, Medal, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { Skeleton } from '@/components/ui/skeleton';

interface WeeklyEntry {
  user_id: string;
  first_name: string | null;
  name: string | null;
  weekly_stars: number | null;
  weekly_xp: number | null;
  current_level: number | null;
  current_streak: number | null;
  rank: number | null;
  leaderboard_visible: boolean | null;
}

interface AllTimeEntry {
  user_id: string;
  first_name: string | null;
  name: string | null;
  total_stars: number | null;
  current_level: number | null;
  current_streak: number | null;
  rank: number | null;
  leaderboard_visible: boolean | null;
}

export default function Leaderboards() {
  const { user } = useAuth();
  const [weekly, setWeekly] = useState<WeeklyEntry[]>([]);
  const [allTime, setAllTime] = useState<AllTimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeklyRank, setWeeklyRank] = useState<number | null>(null);
  const [allTimeRank, setAllTimeRank] = useState<number | null>(null);

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  async function fetchLeaderboards() {
    try {
      setLoading(true);

      const [weeklyRes, allTimeRes] = await Promise.all([
        supabase.from('weekly_leaderboard').select('*').limit(50),
        supabase.from('all_time_leaderboard').select('*').limit(50),
      ]);

      if (weeklyRes.error) throw weeklyRes.error;
      if (allTimeRes.error) throw allTimeRes.error;

      const w = (weeklyRes.data || []) as WeeklyEntry[];
      const a = (allTimeRes.data || []) as AllTimeEntry[];

      setWeekly(w);
      setAllTime(a);
      setWeeklyRank(w.find((e) => e.user_id === user?.id)?.rank || null);
      setAllTimeRank(a.find((e) => e.user_id === user?.id)?.rank || null);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }

  function getRankIcon(rank: number | null) {
    switch (rank) {
      case 1:
        return <Medal className="w-6 h-6 text-yellow-500 fill-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400 fill-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600 fill-amber-600" />;
      default:
        return <span className="text-muted-foreground font-semibold">#{rank ?? '—'}</span>;
    }
  }

  function getDisplayName(entry: { user_id: string; first_name: string | null; name: string | null; leaderboard_visible: boolean | null }) {
    const isCurrentUser = entry.user_id === user?.id;
    // Always show only first name (or first word of full name) — never last name
    const firstOnly = entry.first_name?.trim() || entry.name?.trim().split(/\s+/)[0] || null;
    if (isCurrentUser) return firstOnly || 'You';
    if (entry.leaderboard_visible === false) return 'Anonymous';
    return firstOnly || 'Anonymous Learner';
  }

  function getInitials(entry: { user_id: string; first_name: string | null; name: string | null; leaderboard_visible: boolean | null }) {
    const name = getDisplayName(entry);
    if (name === 'Anonymous' || name === 'Anonymous Learner') return '?';
    return name.charAt(0).toUpperCase();
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

  const renderRow = (
    entry: { user_id: string; first_name: string | null; name: string | null; current_level: number | null; current_streak: number | null; rank: number | null; leaderboard_visible: boolean | null },
    stars: number,
    suffix: string,
  ) => (
    <div
      key={entry.user_id}
      className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
        entry.user_id === user?.id
          ? 'bg-primary/10 border border-primary/20'
          : 'hover:bg-muted/50'
      }`}
    >
      <div className="w-12 flex justify-center">{getRankIcon(entry.rank)}</div>

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
          Level {entry.current_level ?? 1} • {entry.current_streak ?? 0} day streak
        </p>
      </div>

      <div className="text-right">
        <p className="font-bold text-lg flex items-center justify-end gap-1">
          {stars.toLocaleString()}
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        </p>
        <p className="text-sm text-muted-foreground">{suffix}</p>
      </div>
    </div>
  );

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
        <p className="text-xs text-muted-foreground">
          For privacy, only first names are shown. Manage your visibility in Settings.
        </p>
      </div>

      {(weeklyRank || allTimeRank) && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-6">
                {weeklyRank && (
                  <div>
                    <div className="text-2xl font-bold text-primary">#{weeklyRank}</div>
                    <p className="text-xs text-muted-foreground">This Week</p>
                  </div>
                )}
                {allTimeRank && (
                  <div>
                    <div className="text-2xl font-bold text-primary">#{allTimeRank}</div>
                    <p className="text-xs text-muted-foreground">All-Time</p>
                  </div>
                )}
              </div>
              <Badge variant="secondary">Keep practicing to climb higher!</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="all-time">All-Time</TabsTrigger>
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
              {weekly.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No rankings yet this week. Be the first to practice!</p>
                </div>
              ) : (
                weekly.map((entry) =>
                  renderRow(entry, entry.weekly_stars ?? entry.weekly_xp ?? 0, 'this week'),
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all-time" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All-Time Leaderboard</CardTitle>
              <CardDescription>
                Lifetime stars earned across all your interviews
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {allTime.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No rankings yet. Complete an interview to get on the board!</p>
                </div>
              ) : (
                allTime.map((entry) =>
                  renderRow(entry, entry.total_stars ?? 0, 'all-time'),
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
