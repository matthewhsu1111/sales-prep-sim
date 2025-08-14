import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InterviewRecorder } from '@/components/InterviewRecorder';
import { companyPersonas, getQuestionsByPersona, type Question } from '@/data/questions';
import { ArrowLeft, Clock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InterviewAnswer {
  questionId: string;
  question: string;
  transcript: string;
  audioBlob: Blob;
  timestamp: Date;
}

export default function Interview() {
  const { personaId } = useParams<{ personaId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<InterviewAnswer[]>([]);
  const [persona, setPersona] = useState<any>(null);
  const [startTime, setStartTime] = useState<Date>(new Date());

  useEffect(() => {
    if (personaId) {
      const selectedPersona = companyPersonas.find(p => p.id === personaId);
      const questionSet = getQuestionsByPersona(personaId);
      
      if (selectedPersona && questionSet.length > 0) {
        setPersona(selectedPersona);
        setQuestions(questionSet);
        setStartTime(new Date());
      } else {
        toast({
          title: "Interview setup failed",
          description: "Could not load interview questions. Please try again.",
          variant: "destructive",
        });
        navigate('/select-persona');
      }
    }
  }, [personaId, navigate, toast]);

  const handleAnswerComplete = (transcript: string, audioBlob: Blob) => {
    const currentQuestion = questions[currentQuestionIndex];
    const answer: InterviewAnswer = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      transcript,
      audioBlob,
      timestamp: new Date()
    };

    setAnswers(prev => [...prev, answer]);
    
    toast({
      title: "Answer saved",
      description: "Your response has been recorded successfully.",
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Interview complete
      completeInterview();
    }
  };

  const completeInterview = () => {
    const interviewData = {
      personaId,
      persona,
      questions,
      answers,
      startTime,
      endTime: new Date(),
      duration: Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60) // minutes
    };

    // Store interview data for results page
    sessionStorage.setItem('interviewResults', JSON.stringify(interviewData));
    navigate('/results');
  };

  if (!persona || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading interview...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isInterviewComplete = currentQuestionIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/select-persona')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Selection
          </Button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {persona.name} Interview
              </h1>
              <p className="text-muted-foreground mt-1">
                {persona.interviewStyle}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {persona.name}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60)} min
              </Badge>
            </div>
          </div>
        </div>

        {/* Interview Interface */}
        <div className="space-y-6">
          <InterviewRecorder
            currentQuestion={currentQuestion.question}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onAnswerComplete={handleAnswerComplete}
            onNextQuestion={handleNextQuestion}
            isInterviewComplete={isInterviewComplete}
          />

          {/* Question Metadata */}
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Category:</span>
                  <p className="text-muted-foreground">{currentQuestion.category}</p>
                </div>
                <div>
                  <span className="font-medium">Subcategory:</span>
                  <p className="text-muted-foreground">{currentQuestion.subcategory}</p>
                </div>
                <div>
                  <span className="font-medium">Difficulty:</span>
                  <Badge 
                    variant={currentQuestion.difficulty === 'advanced' ? 'destructive' : 
                            currentQuestion.difficulty === 'intermediate' ? 'default' : 'secondary'}
                  >
                    {currentQuestion.difficulty}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Interview Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Questions Completed</p>
                  <p className="text-2xl font-bold">{answers.length} / {questions.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time Elapsed</p>
                  <p className="text-2xl font-bold">
                    {Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60)} min
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}