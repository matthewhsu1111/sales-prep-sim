import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mic, Video, Volume2, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function InterviewPreparation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    checkPermissions();
    return () => {
      // Cleanup streams on unmount
      if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
      }
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const checkPermissions = async () => {
    try {
      const micPermissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      const cameraPermissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
      
      setMicPermission(micPermissionStatus.state);
      setCameraPermission(cameraPermissionStatus.state);
    } catch (error) {
      console.log('Permission check not supported, will request during test');
    }
  };

  const testMicrophone = async () => {
    setIsTestingMic(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStream(stream);
      setMicPermission('granted');
      
      toast({
        title: "Microphone Test Successful",
        description: "Your microphone is working properly!",
      });

      // Stop the stream after a short delay
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        setMicStream(null);
        setIsTestingMic(false);
      }, 2000);
    } catch (error) {
      setMicPermission('denied');
      toast({
        title: "Microphone Access Denied",
        description: "Please enable microphone access to continue with the interview.",
        variant: "destructive"
      });
      setIsTestingMic(false);
    }
  };

  const enableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setCameraPermission('granted');
      
      toast({
        title: "Camera Access Granted",
        description: "Your camera is ready for the interview!",
      });

      // Stop the stream immediately since this is just for permission
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }, 1000);
    } catch (error) {
      setCameraPermission('denied');
      toast({
        title: "Camera Access Denied",
        description: "Please enable camera access to continue with the interview.",
        variant: "destructive"
      });
    }
  };

  const canStartInterview = micPermission === 'granted' && cameraPermission === 'granted';

  const handleStartInterview = () => {
    if (canStartInterview) {
      navigate('/dashboard/interview-session');
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
            <CardContent>
              <Button 
                onClick={testMicrophone}
                disabled={isTestingMic || micPermission === 'granted'}
                className="w-full"
                variant={micPermission === 'granted' ? 'secondary' : 'default'}
              >
                <Volume2 className="h-4 w-4 mr-2" />
                {isTestingMic ? 'Testing...' : micPermission === 'granted' ? 'Microphone Ready' : 'Test Mic'}
              </Button>
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
            <CardContent>
              <Button 
                onClick={enableCamera}
                disabled={cameraPermission === 'granted'}
                className="w-full"
                variant={cameraPermission === 'granted' ? 'secondary' : 'default'}
              >
                <Video className="h-4 w-4 mr-2" />
                {cameraPermission === 'granted' ? 'Camera Ready' : 'Enable Camera'}
              </Button>
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