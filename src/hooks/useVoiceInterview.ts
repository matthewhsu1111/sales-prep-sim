import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'ai' | 'user';
  timestamp: Date;
  isTyping?: boolean;
}

interface SpeechMetrics {
  fillerWords: { word: string; count: number }[];
  totalFillers: number;
  wordsPerMinute: number;
  confidenceScore: number;
  professionalismScore: number;
  hesitationCount: number;
  paceRating: 'too slow' | 'ideal' | 'too fast';
}

interface UseVoiceInterviewProps {
  interviewer: string;
  interviewType: string;
  autoStart?: boolean;
  defaultMuted?: boolean;
}

export const useVoiceInterview = ({ interviewer, interviewType, autoStart = false, defaultMuted = false }: UseVoiceInterviewProps) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [currentSpeechMetrics, setCurrentSpeechMetrics] = useState<SpeechMetrics | null>(null);
  const [candidateTranscript, setCandidateTranscript] = useState('');
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(defaultMuted);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const vadIntervalRef = useRef<number | null>(null);

  // Voice Activity Detection
  const detectVoiceActivity = useCallback(() => {
    if (!analyserRef.current) return false;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    const threshold = 30;
    
    return average > threshold;
  }, []);

  // Speech-to-text for candidate
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      streamRef.current = stream;
      audioChunksRef.current = [];

      // Set up MediaRecorder for audio capture
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Setup Voice Activity Detection
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      // Start VAD monitoring
      vadIntervalRef.current = window.setInterval(() => {
        setIsUserSpeaking(detectVoiceActivity());
      }, 100);

      // Set up Web Speech API for real-time transcription
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          setCandidateTranscript(prev => prev + finalTranscript + interimTranscript);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
        };

        recognitionRef.current = recognition;
        recognition.start();
      }

      mediaRecorder.start(1000); // Capture in 1-second chunks
      setIsRecording(true);

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Microphone Error',
        description: 'Failed to access microphone. Please check permissions.',
        variant: 'destructive'
      });
    }
  }, [toast, detectVoiceActivity]);

  const stopRecording = useCallback(async (): Promise<{ transcript: string; audioBlob: Blob }> => {
    // Stop VAD monitoring
    if (vadIntervalRef.current) {
      clearInterval(vadIntervalRef.current);
      vadIntervalRef.current = null;
    }
    setIsUserSpeaking(false);

    // Cleanup audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;

    return new Promise((resolve) => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Stop speech recognition
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }

          // Stop stream
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
          }

          setIsRecording(false);

          // Convert audio to base64 for fallback STT via API
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Audio = reader.result?.toString().split(',')[1] || '';
            
            // Call speech-to-text function as backup
            try {
              const { data, error } = await supabase.functions.invoke('speech-to-text', {
                body: { audio: base64Audio }
              });

              if (error) throw error;

              const finalTranscript = data?.text || candidateTranscript;
              setCandidateTranscript(finalTranscript);

              resolve({ transcript: finalTranscript, audioBlob });
            } catch (error) {
              console.error('STT error:', error);
              resolve({ transcript: candidateTranscript, audioBlob });
            }
          };
        };

        mediaRecorderRef.current.stop();
      } else {
        resolve({ transcript: candidateTranscript, audioBlob: new Blob() });
      }
    });
  }, [candidateTranscript]);

  // Text-to-speech for AI interviewer with synchronized text display
  const speakAIResponse = useCallback(async (text: string, voiceName: string, onWordUpdate?: (word: string, isComplete: boolean) => void) => {
    setIsAISpeaking(true);

    try {
      // Map interviewer to ElevenLabs voice
      const voiceMap: { [key: string]: string } = {
        'Rebecca Martinez': '21m00Tcm4TlvDq8ikWAM', // Rachel
        'Jake Thompson': 'pNInz6obpgDQGcFmaJgB', // Adam
        'Michael Chen': 'iP95p4xoKVk53GoZ742B', // Chris
      };

      const voice = voiceMap[voiceName] || 'pNInz6obpgDQGcFmaJgB';

      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice }
      });

      if (error) throw error;

      // Play audio and sync text display
      if (data?.audioContent) {
        const audioContext = new AudioContext();
        const binaryString = atob(data.audioContent);
        const bytes = new Uint8Array(binaryString.length);
        
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const audioBuffer = await audioContext.decodeAudioData(bytes.buffer);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        
        // Sync text with audio playback using actual audio time
        if (onWordUpdate) {
          const words = text.split(' ');
          const audioDuration = audioBuffer.duration;
          const startTime = audioContext.currentTime;
          let wordIntervalId: number | null = null;
          
          // Update text in sync with audio time
          const updateText = () => {
            const currentTime = audioContext.currentTime - startTime;
            const progress = currentTime / audioDuration;
            const wordsToShow = Math.min(Math.ceil(progress * words.length), words.length);
            
            if (wordsToShow > 0 && wordsToShow <= words.length) {
              onWordUpdate(words.slice(0, wordsToShow).join(' '), false);
            }
            
            if (currentTime < audioDuration) {
              wordIntervalId = requestAnimationFrame(updateText);
            } else {
              onWordUpdate(text, true);
              setIsAISpeaking(false);
            }
          };
          
          source.onended = () => {
            if (wordIntervalId) {
              cancelAnimationFrame(wordIntervalId);
            }
            onWordUpdate(text, true);
            setIsAISpeaking(false);
          };
          
          source.start(0);
          updateText();
        } else {
          source.onended = () => {
            setIsAISpeaking(false);
          };
          source.start(0);
        }
      } else {
        setIsAISpeaking(false);
      }

    } catch (error) {
      console.error('TTS error:', error);
      setIsAISpeaking(false);
      toast({
        title: 'Audio Error',
        description: 'Failed to generate speech. Continuing with text only.',
        variant: 'default'
      });
    }
  }, [toast]);

  // Analyze speech patterns
  const analyzeSpeech = useCallback(async (transcript: string, duration: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('speech-analysis', {
        body: { transcript, duration }
      });

      if (error) throw error;

      if (data) {
        setCurrentSpeechMetrics(data);
      }
    } catch (error) {
      console.error('Speech analysis error:', error);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setCandidateTranscript('');
  }, []);

  // Mute control
  const setMuted = useCallback((muted: boolean) => {
    setIsMuted(muted);
  }, []);

  return {
    isRecording,
    isAISpeaking,
    currentSpeechMetrics,
    candidateTranscript,
    isUserSpeaking,
    isMuted,
    startRecording,
    stopRecording,
    speakAIResponse,
    analyzeSpeech,
    resetTranscript,
    setMuted,
  };
};
