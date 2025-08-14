import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Trophy, 
  Clock, 
  MessageSquare, 
  TrendingUp, 
  Download,
  RefreshCw
} from 'lucide-react';

interface InterviewResults {
  personaId: string;
  persona: any;
  questions: any[];
  answers: any[];
  startTime: string;
  endTime: string;
  duration: number;
}

export default function Results() {
  const navigate = useNavigate();
  const [results, setResults] = useState<InterviewResults | null>(null);
  const [scores, setScores] = useState({
    overall: 0,
    clarity: 0,
    confidence: 0,
    relevance: 0,
    completeness: 0
  });

  useEffect(() => {
    const storedResults = sessionStorage.getItem('interviewResults');
    if (storedResults) {
      const parsedResults = JSON.parse(storedResults);
      setResults(parsedResults);
      
      // Generate mock scores (in real app, this would come from AI analysis)
      generateMockScores(parsedResults);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const generateMockScores = (interviewData: InterviewResults) => {
    // Mock scoring based on transcript length and other factors
    const avgTranscriptLength = interviewData.answers.reduce((acc, answer) => 
      acc + (answer.transcript?.length || 0), 0) / interviewData.answers.length;
    
    const baseScore = Math.min(85, Math.max(45, avgTranscriptLength / 5));
    
    setScores({
      overall: Math.round(baseScore + Math.random() * 10),
      clarity: Math.round(baseScore + Math.random() * 15 - 5),
      confidence: Math.round(baseScore + Math.random() * 20 - 10),
      relevance: Math.round(baseScore + Math.random() * 12 - 6),
      completeness: Math.round(baseScore + Math.random() * 8)
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'default';
    return 'destructive';
  };

  const getFeedbackMessage = (score: number) => {
    if (score >= 80) return "Excellent performance! You're well-prepared for this type of interview.";
    if (score >= 60) return "Good job! With some practice, you'll be even more confident.";
    return "Keep practicing! Focus on providing more detailed and specific examples.";
  };

  const improvements = [
    {
      area: "Clarity",
      score: scores.clarity,
      suggestion: "Speak more slowly and articulate key points clearly. Practice your elevator pitch."
    },
    {
      area: "Confidence", 
      score: scores.confidence,
      suggestion: "Use more assertive language. Practice power poses before interviews."
    },
    {
      area: "Relevance",
      score: scores.relevance, 
      suggestion: "Better align your examples with the specific role requirements."
    },
    {
      area: "Completeness",
      score: scores.completeness,
      suggestion: "Use the STAR method to structure your responses more completely."
    }
  ];

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">
                Interview Complete!
              </h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Here's your performance analysis for the {results.persona.name} interview
            </p>
          </div>
        </div>

        {/* Overall Score */}
        <Card className="mb-8 bg-gradient-card border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Overall Performance</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className={`text-6xl font-bold ${getScoreColor(scores.overall)}`}>
              {scores.overall}%
            </div>
            <Badge variant={getScoreBadge(scores.overall) as any} className="text-lg px-4 py-2">
              {scores.overall >= 80 ? 'Excellent' : scores.overall >= 60 ? 'Good' : 'Needs Improvement'}
            </Badge>
            <p className="text-muted-foreground max-w-md mx-auto">
              {getFeedbackMessage(scores.overall)}
            </p>
          </CardContent>
        </Card>

        {/* Interview Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <MessageSquare className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold">{results.answers.length}</div>
              <p className="text-sm text-muted-foreground">Questions Answered</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold">{results.duration}</div>
              <p className="text-sm text-muted-foreground">Minutes</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold">
                {Math.round(results.answers.reduce((acc, a) => acc + (a.transcript?.length || 0), 0) / results.answers.length)}
              </div>
              <p className="text-sm text-muted-foreground">Avg Response Length</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <Badge variant="outline" className="mb-2">
                {results.persona.name}
              </Badge>
              <div className="text-sm text-muted-foreground">Interview Style</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Scores */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Performance Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {improvements.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.area}</span>
                    <Badge variant={getScoreBadge(item.score) as any}>
                      {item.score}%
                    </Badge>
                  </div>
                  <Progress value={item.score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Improvement Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {improvements
                  .sort((a, b) => a.score - b.score)
                  .slice(0, 3)
                  .map((item, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <div className="font-medium text-sm mb-1">{item.area}</div>
                    <p className="text-sm text-muted-foreground">{item.suggestion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="default" 
            size="lg"
            onClick={() => navigate('/select-persona')}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Practice Again
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => {
              // Mock download functionality
              const dataStr = JSON.stringify(results, null, 2);
              const dataBlob = new Blob([dataStr], { type: 'application/json' });
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `interview-results-${new Date().toISOString().split('T')[0]}.json`;
              link.click();
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Results
          </Button>
        </div>
      </div>
    </div>
  );
}