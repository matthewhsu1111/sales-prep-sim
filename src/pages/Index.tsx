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
  Trophy,
  Play,
  Star,
  TrendingUp,
  Clock,
  Shield,
  Brain,
  ChevronDown
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import heroImage from '@/assets/hero-interview.jpg';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Mic className="h-8 w-8" />,
      title: "AI Voice Interviews",
      description: "Train against human-like AI to perfect your process, work on objection handling, or anything else"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Real-Time Data & Scoring",
      description: "Get real insights into your interview skills, training data, and AI analysis so you know exactly what to work on"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "All Your Interview Data in One Place",
      description: "AI tracks, records, and flags interviews for review when needed"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Create Any Interview Scenario in Seconds",
      description: "Any company, any role, any persona can be created so you can train against realistic AI interviewers"
    }
  ];

  const testimonials = [
    {
      quote: "A week after we started using InterviewAce our interview success rate doubled. Can't recommend them enough",
      name: "Sarah Chen",
      role: "VP of Sales",
      avatar: "/placeholder.svg"
    },
    {
      quote: "Not only has my team's interview confidence increased but they are becoming more confident in calls and getting quicker at overcoming objections",
      name: "Mike Rodriguez", 
      role: "Sales Director",
      avatar: "/placeholder.svg"
    }
  ];

  const trustLogos = [
    { name: "TechCorp", logo: "/placeholder.svg" },
    { name: "SalesForce", logo: "/placeholder.svg" },
    { name: "StartupX", logo: "/placeholder.svg" },
    { name: "Enterprise Co", logo: "/placeholder.svg" },
    { name: "Growth Labs", logo: "/placeholder.svg" }
  ];

  const faqItems = [
    {
      question: "What is InterviewAce?",
      answer: "InterviewAce is an AI-powered interview simulation platform that helps sales professionals practice and improve their interview skills through realistic scenarios and instant feedback."
    },
    {
      question: "Does InterviewAce work for my specific use case?",
      answer: "Yes! Our platform supports various company types (startups, enterprises, tech giants) and can be customized for different sales roles and interview scenarios."
    },
    {
      question: "How does pricing work?",
      answer: "We offer flexible pricing plans starting with a free tier for basic practice sessions, and premium plans for advanced features and analytics."
    },
    {
      question: "Does AI interview training actually work?",
      answer: "Absolutely! Our data shows that users who practice 30 minutes daily see a 40-60% improvement in interview confidence and performance within the first week."
    },
    {
      question: "Why InterviewAce over other tools?",
      answer: "Our platform combines advanced AI voice technology with sales-specific training scenarios, real-time feedback, and comprehensive analytics - all designed specifically for sales professionals."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Mic className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">InterviewAce</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
              <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                Book a Demo
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => navigate('/select-persona')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-8">
            <Badge variant="outline" className="mx-auto w-fit">
              <Zap className="h-4 w-4 mr-2" />
              NEW! InterviewAce v2 released
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight max-w-4xl mx-auto">
              The All In One Sales Interview 
              <span className="bg-gradient-hero bg-clip-text text-transparent"> Training & Practice Platform</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Effortlessly practice your sales interviews, roleplay with AI, and track 
              performance with our intelligent interview scoring
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => navigate('/signup')}
                className="text-lg px-8 py-6"
              >
                Try For Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-6"
              >
                Get Started
              </Button>
            </div>

            <div className="relative max-w-4xl mx-auto mt-16">
              <div className="relative z-10 bg-gradient-card rounded-2xl p-8 shadow-large">
                <img 
                  src={heroImage} 
                  alt="InterviewAce platform demo"
                  className="rounded-xl shadow-medium w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button size="lg" variant="default" className="rounded-full h-16 w-16 p-0">
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-hero opacity-10 rounded-2xl blur-3xl transform scale-110"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <p className="text-center text-muted-foreground mb-8">
            Trusted by the sales teams of
          </p>
          <div className="flex items-center justify-center gap-8 md:gap-12 opacity-60">
            {trustLogos.map((logo, index) => (
              <div key={index} className="h-8 bg-muted-foreground/20 rounded px-6 flex items-center">
                <span className="text-sm font-medium">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <blockquote className="text-2xl md:text-3xl font-medium text-foreground mb-8">
            "{testimonials[0].quote}"
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="h-12 w-12 bg-muted rounded-full"></div>
            <div className="text-left">
              <div className="font-semibold">{testimonials[0].name}</div>
              <div className="text-muted-foreground">{testimonials[0].role}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Train Smarter. Close More Deals. Ramp Faster.
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              InterviewAce is designed to be the highest ROI tool in your sales career. 
              You'll interview better, save hours per week in preparation, and ramp faster than ever
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {features.map((feature, index) => (
              <div key={index} className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Feature highlights */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div className="font-medium text-foreground">Call scoring</div>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="font-medium text-foreground">Human-like AI</div>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div className="font-medium text-foreground">Faster ramp time</div>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div className="font-medium text-foreground">Custom scenarios</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <blockquote className="text-2xl md:text-3xl font-medium text-foreground mb-8">
            "{testimonials[1].quote}"
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="h-12 w-12 bg-muted rounded-full"></div>
            <div className="text-left">
              <div className="font-semibold">{testimonials[1].name}</div>
              <div className="text-muted-foreground">{testimonials[1].role}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              How Much Growth Could You Be Missing Out On?
            </h2>
            <p className="text-xl text-muted-foreground">
              One hour per day of training with our AI shows real improvement in overall interview performance
            </p>
          </div>

          <Card className="bg-gradient-card border-border/50 shadow-large">
            <CardContent className="pt-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground mb-4">Your Current Metrics</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-foreground">Interview Success Rate</label>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-bold text-primary">25%</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-2xl font-bold text-success">40%</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Average Prep Time</label>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-bold text-primary">4 hours</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-2xl font-bold text-success">1 hour</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground mb-4">Your Potential Results</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Success Rate Increase</div>
                      <div className="text-2xl font-bold text-success">+60% improvement</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Time Saved Per Week</div>
                      <div className="text-2xl font-bold text-success">12+ hours</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-4">
                  All calculations based on users practicing one hour per day with InterviewAce for 22 days each month. 
                  Our data suggests that training with InterviewAce an hour per day can raise performance by 40-60% minimum.
                </p>
                <Button 
                  variant="hero" 
                  size="lg"
                  onClick={() => navigate('/signup')}
                >
                  Start Training Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Questions? Answers!
            </h2>
            <p className="text-xl text-muted-foreground">
              Find quick answers to the most common questions about our platform
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-2">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Have an inquiry?</p>
            <a href="mailto:hello@interviewace.ai" className="text-primary hover:underline font-medium">
              hello@interviewace.ai
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/10">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Ready to Level Up Your Interview Skills? Try InterviewAce Today
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the most successful sales professionals in the world and train smarter, not harder with InterviewAce AI
          </p>
          <Button 
            variant="hero" 
            size="lg"
            onClick={() => navigate('/signup')}
            className="text-lg px-8 py-6"
          >
            Try For Free
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
