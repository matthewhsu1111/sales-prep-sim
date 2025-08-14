import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/select-persona`
        }
      });
      
      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign up with Google",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignup = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password: 'temporary-password-123', // In production, you'd want a proper password flow
        options: {
          emailRedirectTo: `${window.location.origin}/select-persona`
        }
      });

      if (error) {
        toast({
          title: "Signup Error", 
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Check Your Email",
          description: "We've sent you a confirmation link to complete your signup",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const trustLogos = [
    "Tailopez.com",
    "Samcart", 
    "Infinite Living"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex flex-col">
      {/* Header */}
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex h-16 items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <Mic className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">InterviewAce</span>
          </div>
          
          <div className="w-16"></div> {/* Spacer for center alignment */}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="container mx-auto px-4 max-w-2xl mt-8 mb-12">
        <div className="flex items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="rounded-full">1</Badge>
            <span className="text-primary font-medium">Register</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-full">2</Badge>
            <span className="text-muted-foreground">Confirm</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-full">3</Badge>
            <span className="text-muted-foreground">Start Training</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="inline-flex h-16 w-16 bg-primary rounded-2xl items-center justify-center mb-8">
              <Mic className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>

          {/* Headline */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Train Smarter, Not Harder with AI
            </h1>
            <p className="text-lg text-muted-foreground">
              Join elite sales teams using InterviewAce AI to train against perfect AI prospects, get 
              real-time feedback, and save hours per day managing sales teams.
            </p>
          </div>

          {/* Signup Form */}
          <Card className="bg-gradient-card border-border/50 shadow-large">
            <CardContent className="pt-6 space-y-6">
              <Button 
                variant="outline" 
                size="lg"
                className="w-full text-lg py-6"
                onClick={handleGoogleSignup}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-4 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your business email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-lg py-6"
                />
                
                <Button 
                  variant="hero" 
                  size="lg"
                  className="w-full text-lg py-6"
                  onClick={handleEmailSignup}
                  disabled={isLoading}
                >
                  Start Free Demo
                </Button>
              </div>

              <div className="text-center">
                <span className="text-muted-foreground">Already using InterviewAce? </span>
                <button 
                  onClick={() => navigate('/signin')}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trust Section */}
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <div className="text-center">
          <p className="text-muted-foreground mb-6">Trusted by leading sales teams</p>
          <div className="flex items-center justify-center gap-8 opacity-60">
            {trustLogos.map((logo, index) => (
              <div key={index} className="text-muted-foreground font-medium">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;