import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Play, Pause, Square, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InterviewRecorderProps {
  currentQuestion: string;
  questionNumber: number;
  totalQuestions: number;
  onAnswerComplete: (transcript: string, audioBlob: Blob) => void;
  onNextQuestion: () => void;
  isInterviewComplete: boolean;
}

export function InterviewRecorder({ 
  currentQuestion, 
  questionNumber, 
  totalQuestions, 
  onAnswerComplete, 
  onNextQuestion,
  isInterviewComplete 
}: InterviewRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcript, setTranscript] = useState('');
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
        }
      };
      
      recognitionRef.current = recognition;
    }

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      setTranscript('');
      
      // Start duration timer
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      toast({
        title: "Recording started",
        description: "Speak your answer clearly. Click stop when finished.",
      });
    } catch (error) {
      toast({
        title: "Error accessing microphone",
        description: "Please ensure microphone permissions are granted.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      toast({
        title: "Recording complete",
        description: "You can now review your answer or move to the next question.",
      });
    }
  };

  const playRecording = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsPlaying(false);
      };
      
      audio.play();
      setIsPlaying(true);
    }
  };

  const pausePlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const submitAnswer = () => {
    if (audioBlob) {
      onAnswerComplete(transcript, audioBlob);
      setAudioBlob(null);
      setTranscript('');
      setRecordingDuration(0);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Interview Progress</span>
          <Badge variant="outline">{questionNumber} of {totalQuestions}</Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Current Question */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Question {questionNumber}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground font-medium leading-relaxed">{currentQuestion}</p>
        </CardContent>
      </Card>

      {/* Recording Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Record Your Answer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Recording Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isRecording && (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Recording...</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDuration(recordingDuration)}
                  </span>
                </>
              )}
              {audioBlob && !isRecording && (
                <Badge variant="success">Answer Recorded</Badge>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            {!isRecording ? (
              <Button 
                onClick={startRecording} 
                variant="default"
                size="lg"
                className="flex-1"
              >
                <Mic className="h-4 w-4 mr-2" />
                Start Recording
              </Button>
            ) : (
              <Button 
                onClick={stopRecording} 
                variant="destructive"
                size="lg"
                className="flex-1"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop Recording
              </Button>
            )}

            {audioBlob && (
              <>
                <Button
                  onClick={isPlaying ? pausePlayback : playRecording}
                  variant="outline"
                  size="lg"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </>
            )}
          </div>

          {/* Transcript */}
          {transcript && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-2">Live Transcript:</h4>
              <p className="text-sm text-muted-foreground">{transcript}</p>
            </div>
          )}

          {/* Next Question Button */}
          {audioBlob && (
            <div className="pt-4 border-t">
              {isInterviewComplete ? (
                <Button 
                  onClick={submitAnswer}
                  variant="success"
                  size="lg"
                  className="w-full"
                >
                  Complete Interview
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    onClick={submitAnswer}
                    variant="secondary"
                    size="lg"
                    className="flex-1"
                  >
                    Save & Continue
                  </Button>
                  <Button 
                    onClick={onNextQuestion}
                    variant="default"
                    size="lg"
                    className="flex-1"
                  >
                    Next Question
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}