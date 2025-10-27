import { Star, TrendingUp, Flame, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useGamification } from '@/hooks/useGamification';
import { Skeleton } from '@/components/ui/skeleton';

export function XPProgressCard() {
  const { progress, levelInfo, loading } = useGamification();

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-4 space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!progress || !levelInfo) return null;

  return (
    <Card className="w-full bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
      <CardContent className="p-4 space-y-4">
        {/* Level Badge */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">Level {levelInfo.level}</p>
            <p className="font-bold text-lg">{levelInfo.name}</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            #{progress.leaderboardRank || '—'}
          </Badge>
        </div>

        {/* XP Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">{progress.totalXP.toLocaleString()} XP</span>
            </div>
            <span className="text-muted-foreground">
              {levelInfo.xpToNextLevel > 0 
                ? `${levelInfo.xpToNextLevel.toLocaleString()} to Level ${levelInfo.level + 1}`
                : 'Max Level!'}
            </span>
          </div>
          <Progress value={levelInfo.progressPercentage} className="h-2" />
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1 text-sm">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="font-semibold">{progress.currentStreak}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Trophy className="w-4 h-4 text-blue-500" />
            <span className="font-semibold">{progress.weeklyXP}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
