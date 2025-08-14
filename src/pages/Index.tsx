import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  BarChart3, 
  Users, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Headphones,
  Target,
  Trophy
} from 'lucide-react';
import heroImage from '@/assets/hero-interview.jpg';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Mic className="h-6 w-6" />,
      title: "AI Voice Interviewer",
      description: "Practice with realistic AI interviewers tailored to different company cultures and styles."
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: "Real-time Recording",
      description: "Record and transcribe your answers with professional-grade audio quality."
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Company-Specific Scenarios",
      description: "Practice with questions designed for Tech Giants, Startups, and Enterprise companies."
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Instant Feedback",
      description: "Get detailed performance analysis and actionable improvement suggestions."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Realistic Personas",
      description: "AI interviewers that match real hiring manager personalities and styles."
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Track Progress",
      description: "Monitor your improvement over time with detailed analytics and scoring."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <Badge variant="outline" className="w-fit">
                  🚀 AI-Powered Interview Practice
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Ace Your Sales
                  <span className="bg-gradient-hero bg-clip-text text-transparent"> Interview</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                  Practice with AI interviewers that simulate real hiring scenarios. 
                  Get instant feedback and improve your confidence before the big day.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="hero" 
                  size="lg"
                  onClick={() => navigate('/select-persona')}
                  className="text-lg px-8 py-6"
                >
                  Start Practicing Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-lg px-8 py-6"
                >
                  Watch Demo
                  <Zap className="h-5 w-5 ml-2" />
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm text-muted-foreground">No signup required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm text-muted-foreground">Instant feedback</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm text-muted-foreground">Real scenarios</span>
                </div>
              </div>
            </div>

            <div className="relative animate-slide-up">
              <div className="relative z-10">
                <img 
                  src={heroImage} 
                  alt="Professional interview practice session"
                  className="rounded-2xl shadow-large w-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-hero opacity-20 rounded-2xl blur-3xl transform scale-110"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform provides comprehensive interview preparation 
              with realistic scenarios and actionable feedback.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gradient-card border-border/50 hover:shadow-medium transition-all duration-300 hover:scale-[1.02] group">
                <CardHeader>
                  <div className="p-3 rounded-full bg-primary/10 text-primary w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Card className="bg-gradient-card border-primary/20 shadow-large">
            <CardContent className="pt-12 pb-12 space-y-6">
              <h3 className="text-3xl lg:text-4xl font-bold text-foreground">
                Ready to Ace Your Next Interview?
              </h3>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of sales professionals who have improved their interview 
                skills with InterviewAce. Start practicing today!
              </p>
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => navigate('/select-persona')}
                className="text-lg px-8 py-6"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
