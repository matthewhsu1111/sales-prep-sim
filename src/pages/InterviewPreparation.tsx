import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Mic, Video, Volume2, CheckCircle, AlertTriangle, Info, Play, Pause, Settings } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface InterviewDetails {
  jobPosting: any;
  interviewType: string;
  numberOfQuestions: number;
}

export default function InterviewPreparation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [interviewDetails, setInterviewDetails] = useState<InterviewDetails | null>(null);
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [testCountdown, setTestCountdown] = useState(0);
  const [showCameraPreview, setShowCameraPreview] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioLevelFeedback, setAudioLevelFeedback] = useState<string>('');
  const [avgAudioLevel, setAvgAudioLevel] = useState(0);
  const [availableDevices, setAvailableDevices] = useState<{ audioInputs: MediaDeviceInfo[]; videoInputs: MediaDeviceInfo[] }>({
    audioInputs: [],
    videoInputs: []
  });
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>('');
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlaybackRef = useRef<HTMLAudioElement | null>(null);
  const audioLevelsRef = useRef<number[]>([]);

  useEffect(() => {
    // Check if interview details were passed from previous page
    const state = location.state as { interviewDetails?: InterviewDetails };
    if (state?.interviewDetails) {
      setInterviewDetails(state.interviewDetails);
    } else {
      // No interview details found, redirect to dashboard
      toast({
        title: "Setup Error",
        description: "Interview details not found. Redirecting to dashboard...",
        variant: "destructive"
      });
      navigate('/dashboard');
      return;
    }

    // Reset permissions to prompt state on every page load
    setMicPermission('prompt');
    setCameraPermission('prompt');
    
    // Get available devices
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(device => device.kind === 'audioinput');
        const videoInputs = devices.filter(device => device.kind === 'videoinput');
        
        setAvailableDevices({ audioInputs, videoInputs });
        
        // Set default devices
        if (audioInputs.length > 0) setSelectedAudioDevice(audioInputs[0].deviceId);
        if (videoInputs.length > 0) setSelectedVideoDevice(videoInputs[0].deviceId);
      } catch (error) {
        console.error('Error getting devices:', error);
      }
    };
    
    getDevices();
    
    return () => {
      // Cleanup streams on unmount
      if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
      }
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioPlaybackRef.current) {
        audioPlaybackRef.current.pause();
      }
    };
  }, []);

  // Fix camera preview with useEffect
  useEffect(() => {
    if (showCameraPreview && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [showCameraPreview, cameraStream]);

  const analyzeAudioLevel = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    const normalizedLevel = Math.min(100, (average / 255) * 100);
    setAudioLevel(normalizedLevel);
    
    // Store audio levels for average calculation
    audioLevelsRef.current.push(normalizedLevel);
    
    // Provide real-time feedback
    if (normalizedLevel < 20) {
      setAudioLevelFeedback('Too quiet - speak louder');
    } else if (normalizedLevel >= 20 && normalizedLevel <= 70) {
      setAudioLevelFeedback('Perfect audio level!');
    } else if (normalizedLevel > 70 && normalizedLevel <= 85) {
      setAudioLevelFeedback('Good - slightly loud');
    } else {
      setAudioLevelFeedback('Too loud - speak softer');
    }
    
    animationFrameRef.current = requestAnimationFrame(analyzeAudioLevel);
  };

  const getAudioLevelColor = (level: number) => {
    if (level < 20) return 'bg-red-500';
    if (level >= 20 && level <= 70) return 'bg-green-500';
    if (level > 70 && level <= 85) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const playRecordedAudio = () => {
    if (!recordedAudio) return;
    
    if (isPlayingAudio) {
      // Stop current playback
      if (audioPlaybackRef.current) {
        audioPlaybackRef.current.pause();
        audioPlaybackRef.current.currentTime = 0;
      }
      setIsPlayingAudio(false);
    } else {
      // Start playback
      const audioUrl = URL.createObjectURL(recordedAudio);
      audioPlaybackRef.current = new Audio(audioUrl);
      audioPlaybackRef.current.play();
      setIsPlayingAudio(true);
      
      audioPlaybackRef.current.onended = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(audioUrl);
      };
    }
  };

  const resetTests = () => {
    setMicPermission('prompt');
    setCameraPermission('prompt');
    setShowCameraPreview(false);
    
    // Stop any active streams
    if (micStream) {
      micStream.getTracks().forEach(track => track.stop());
      setMicStream(null);
    }
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const testMicrophone = async () => {
    setIsTestingMic(true);
    setTestCountdown(5);
    setRecordedAudio(null);
    audioLevelsRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: selectedAudioDevice ? { deviceId: { exact: selectedAudioDevice } } : true
      });
      setMicStream(stream);
      
      // Set up audio recording
      audioChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecordedAudio(audioBlob);
      };
      
      // Set up audio analysis
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      
      // Start audio level analysis
      analyzeAudioLevel();
      
      // Countdown timer
      const countdownInterval = setInterval(() => {
        setTestCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            
            // Calculate average audio level
            const avgLevel = audioLevelsRef.current.length > 0 
              ? audioLevelsRef.current.reduce((sum, level) => sum + level, 0) / audioLevelsRef.current.length 
              : 0;
            setAvgAudioLevel(avgLevel);
            
            // Stop recording
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
              mediaRecorderRef.current.stop();
            }
            
            // Stop analysis and cleanup
            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
            }
            if (audioContextRef.current) {
              audioContextRef.current.close();
            }
            
            stream.getTracks().forEach(track => track.stop());
            setMicStream(null);
            setIsTestingMic(false);
            setMicPermission('granted');
            setAudioLevel(0);
            setAudioLevelFeedback('');
            
            // Provide feedback based on average audio level
            let feedbackMessage = "Microphone test completed!";
            if (avgLevel < 20) {
              feedbackMessage = "Audio level was too quiet. Consider speaking louder during the interview.";
            } else if (avgLevel > 85) {
              feedbackMessage = "Audio level was too loud. Consider speaking softer during the interview.";
            } else {
              feedbackMessage = "Perfect audio level! Your microphone is ready.";
            }
            
            toast({
              title: "Microphone Test Successful",
              description: feedbackMessage,
            });
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      setMicPermission('denied');
      setIsTestingMic(false);
      setTestCountdown(0);
      toast({
        title: "Microphone Access Denied",
        description: "Please enable microphone access to continue with the interview.",
        variant: "destructive"
      });
    }
  };

  const enableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: selectedVideoDevice ? 
          { deviceId: { exact: selectedVideoDevice }, width: 640, height: 480 } :
          { width: 640, height: 480, facingMode: 'user' }
      });
      setCameraStream(stream);
      setCameraPermission('granted');
      setShowCameraPreview(true);
      
      // Set up video preview
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      toast({
        title: "Camera Access Granted",
        description: "Your camera is ready for the interview!",
      });
    } catch (error) {
      setCameraPermission('denied');
      toast({
        title: "Camera Access Denied",
        description: "Please enable camera access to continue with the interview.",
        variant: "destructive"
      });
    }
  };

  const stopCameraPreview = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCameraPreview(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const canStartInterview = micPermission === 'granted' && cameraPermission === 'granted';

  const handleStartInterview = () => {
    if (canStartInterview && interviewDetails) {
      navigate('/dashboard/interview-session', {
        state: { interviewDetails }
      });
    }
  };

  const getPermissionIcon = (permission: 'granted' | 'denied' | 'prompt') => {
    switch (permission) {
      case 'granted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'denied':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Start Interview</h1>
          <p className="text-muted-foreground">
            Make sure you are in a quiet environment and your background is neat and professional. 
            Ensure good lighting on your face and minimize distractions in your workspace.
          </p>
        </div>

        <div className="grid gap-4">
          {/* Microphone Test */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mic className="h-5 w-5" />
                Test Your Microphone
                {getPermissionIcon(micPermission)}
              </CardTitle>
              <CardDescription>
                Click "Test Mic" to verify your microphone is working
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableDevices.audioInputs.length > 1 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Microphone:</label>
                  <Select value={selectedAudioDevice} onValueChange={setSelectedAudioDevice}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose microphone" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDevices.audioInputs.map((device) => (
                        <SelectItem key={device.deviceId} value={device.deviceId}>
                          {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  onClick={testMicrophone}
                  disabled={isTestingMic}
                  className="flex-1"
                  variant={micPermission === 'granted' ? 'secondary' : 'default'}
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  {isTestingMic ? `Testing... ${testCountdown}` : micPermission === 'granted' ? 'Microphone Ready' : 'Test Mic'}
                </Button>
                {micPermission === 'granted' && (
                  <Button 
                    onClick={() => {
                      setMicPermission('prompt');
                      setRecordedAudio(null);
                      setAvgAudioLevel(0);
                      setIsPlayingAudio(false);
                      if (micStream) {
                        micStream.getTracks().forEach(track => track.stop());
                        setMicStream(null);
                      }
                      if (audioPlaybackRef.current) {
                        audioPlaybackRef.current.pause();
                      }
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Test Again
                  </Button>
                )}
              </div>
              
              {isTestingMic && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Audio Level</span>
                    <span>{Math.round(audioLevel)}%</span>
                  </div>
                  <div className="relative">
                    <Progress value={audioLevel} className="h-3" />
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-150 ${getAudioLevelColor(audioLevel)}`}
                        style={{ width: `${audioLevel}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-center">
                      {audioLevelFeedback}
                    </p>
                    <p className="text-xs text-muted-foreground text-center">
                      Speak normally to test your microphone level
                    </p>
                    <div className="flex justify-center space-x-4 text-xs">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Too Quiet (&lt;20%)
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Perfect (20-70%)
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        Good (70-85%)
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Too Loud (&gt;85%)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {micPermission === 'granted' && recordedAudio && (
                <div className="space-y-3 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Audio Playback</span>
                    <span className="text-xs text-muted-foreground">
                      Avg Level: {Math.round(avgAudioLevel)}%
                    </span>
                  </div>
                  <Button
                    onClick={playRecordedAudio}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    {isPlayingAudio ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Stop Playback
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Play Test Recording
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Listen to how you sound during the test
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Camera Test */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Video className="h-5 w-5" />
                Enable Camera
                {getPermissionIcon(cameraPermission)}
              </CardTitle>
              <CardDescription>
                Allow camera access for the video interview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableDevices.videoInputs.length > 1 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Camera:</label>
                  <Select value={selectedVideoDevice} onValueChange={setSelectedVideoDevice}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose camera" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDevices.videoInputs.map((device) => (
                        <SelectItem key={device.deviceId} value={device.deviceId}>
                          {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  onClick={enableCamera}
                  disabled={cameraPermission === 'granted'}
                  className="flex-1"
                  variant={cameraPermission === 'granted' ? 'secondary' : 'default'}
                >
                  <Video className="h-4 w-4 mr-2" />
                  {cameraPermission === 'granted' ? 'Camera Ready' : 'Enable Camera'}
                </Button>
                {cameraPermission === 'granted' && (
                  <Button 
                    onClick={() => {
                      setCameraPermission('prompt');
                      stopCameraPreview();
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Test Again
                  </Button>
                )}
              </div>
              
              {showCameraPreview && (
                <div className="space-y-3">
                  <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-48 object-cover rounded-lg bg-muted scale-x-[-1]"
                  />
                    <div className="absolute top-2 right-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={stopCameraPreview}
                        className="text-xs"
                      >
                        Stop Preview
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Camera preview - Make sure you're clearly visible with good lighting
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Interview Tips:</strong> Find a quiet space with good lighting, sit up straight, 
            maintain eye contact with the camera, and speak clearly. Your background should be clean and professional.
          </AlertDescription>
        </Alert>

        {/* Start Button */}
        <div className="pt-4">
          <Button 
            onClick={handleStartInterview}
            disabled={!canStartInterview}
            className="w-full bg-foreground hover:bg-foreground/90 text-background text-lg py-6"
            size="lg"
          >
            {canStartInterview ? 'Start Interview' : 'Complete Setup to Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}