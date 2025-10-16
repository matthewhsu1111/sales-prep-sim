import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, MessageSquare, Clock, Award } from "lucide-react";

interface SpeechMetrics {
  fillerWords: { word: string; count: number }[];
  totalFillers: number;
  wordsPerMinute: number;
  confidenceScore: number;
  professionalismScore: number;
  hesitationCount: number;
  paceRating: 'too slow' | 'ideal' | 'too fast';
}

interface SpeechMetricsDisplayProps {
  metrics: SpeechMetrics | null;
  isCompact?: boolean;
}

export default function SpeechMetricsDisplay({ metrics, isCompact = false }: SpeechMetricsDisplayProps) {
  if (!metrics) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Speech Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Start speaking to see metrics
          </p>
        </CardContent>
      </Card>
    );
  }

  const getPaceColor = () => {
    switch (metrics.paceRating) {
      case 'ideal': return 'text-green-600';
      case 'too slow': return 'text-yellow-600';
      case 'too fast': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getPaceIcon = () => {
    switch (metrics.paceRating) {
      case 'ideal': return <TrendingUp className="h-4 w-4" />;
      case 'too slow': return <TrendingDown className="h-4 w-4" />;
      case 'too fast': return <TrendingUp className="h-4 w-4" />;
      default: return <Minus className="h-4 w-4" />;
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isCompact) {
    return (
      <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">WPM</span>
          </div>
          <span className={`text-sm font-bold ${getPaceColor()}`}>
            {metrics.wordsPerMinute}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Fillers</span>
          </div>
          <Badge variant={metrics.totalFillers > 5 ? 'destructive' : 'secondary'}>
            {metrics.totalFillers}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Confidence</span>
          </div>
          <span className={`text-sm font-bold ${getConfidenceColor(metrics.confidenceScore)}`}>
            {metrics.confidenceScore}%
          </span>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Live Speech Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Words Per Minute */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Speaking Pace</span>
            </div>
            <span className={`text-sm font-bold ${getPaceColor()}`}>
              {metrics.wordsPerMinute} WPM
            </span>
          </div>
          <div className="flex items-center gap-2">
            {getPaceIcon()}
            <span className="text-xs capitalize text-muted-foreground">
              {metrics.paceRating.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Confidence</span>
            </div>
            <span className={`text-sm font-bold ${getConfidenceColor(metrics.confidenceScore)}`}>
              {metrics.confidenceScore}%
            </span>
          </div>
          <Progress value={metrics.confidenceScore} className="h-2" />
        </div>

        {/* Professionalism Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Professionalism</span>
            <span className={`text-sm font-bold ${getConfidenceColor(metrics.professionalismScore)}`}>
              {metrics.professionalismScore}%
            </span>
          </div>
          <Progress value={metrics.professionalismScore} className="h-2" />
        </div>

        {/* Filler Words */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Filler Words</span>
            <Badge variant={metrics.totalFillers > 5 ? 'destructive' : 'secondary'}>
              {metrics.totalFillers} total
            </Badge>
          </div>
          {metrics.fillerWords.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {metrics.fillerWords.map((filler, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {filler.word} ({filler.count})
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Ideal Ranges */}
        <div className="pt-2 border-t text-xs text-muted-foreground space-y-1">
          <p>💡 Ideal WPM: 120-150</p>
          <p>💡 Confidence: 75+</p>
          <p>💡 Fillers: &lt;5 per minute</p>
        </div>
      </CardContent>
    </Card>
  );
}
