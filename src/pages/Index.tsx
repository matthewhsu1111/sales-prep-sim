import { useState } from 'react';
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
  Target,
  Trophy,
  Play,
  Star,
  TrendingUp,
  Clock,
  Shield,
  Brain,
  ChevronDown,
  X,
  MessageSquare,
  Eye,
  Headphones,
  Calculator,
  DollarSign,
  Timer,
  FileText
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import rebeccaImage from '@/assets/rebecca-martinez.jpg';
import jakeImage from '@/assets/jake-thompson.jpg';
import michaelImage from '@/assets/michael-chen.jpg';
import heroImage from '@/assets/hero-interview.jpg';

const Index = () => {
  const navigate = useNavigate();
  const [isTriMonthly, setIsTriMonthly] = useState(true);
  const [selectedInterviewer, setSelectedInterviewer] = useState<string | null>(null);

  const interviewers = [
    {
      id: "rebecca",
      name: "Rebecca Martinez",
      title: "Senior Sales Director", 
      description: "Direct and results-focused interviewer who values efficiency above all else",
      avatar: rebeccaImage,
      testingStyle: "Tests resilience, confidence, and results-focus under pressure",
      introduction: "I don't have time for fluff. Show me the numbers, prove your value, and let's see if you can handle the pressure of a real sales environment."
    },
    {
      id: "jake", 
      name: "Jake Thompson",
      title: "Sales Team Lead",
      description: "Friendly team leader who values culture fit and relationship-building",
      avatar: jakeImage,
      testingStyle: "Tests interpersonal skills, teamwork, and cultural alignment", 
      introduction: "Hey! I'm really excited to chat with you today. I believe the best salespeople are great people first, so let's get to know each other and see how you'd fit with our team."
    },
    {
      id: "michael",
      name: "Michael Chen", 
      title: "Sales Operations Manager",
      description: "Process-driven analyst who believes success comes from systematic approaches",
      avatar: michaelImage,
      testingStyle: "Tests analytical thinking, process knowledge, and data-driven decision making",
      introduction: "I'm looking for someone who understands that great sales results come from great processes. Let's dive into your methodology and see how you approach the numbers."
    }
  ];

  const features = [
    {
      title: "Realistic Role-Play Practice",
      description: "Master the #1 reason candidates get rejected",
      details: [
        "Practice objection handling under pressure",
        "Unlimited practice sessions to build confidence"
      ],
      icon: <Users className="h-6 w-6" />,
      position: "right"
    },
    {
      title: "Real-Time Confidence Coaching", 
      description: "AI detects anxiety and guides you to stronger delivery",
      details: [
        "Voice analysis detects nervousness and hesitation",
        "Live coaching prompts during practice sessions"
      ],
      icon: <Brain className="h-6 w-6" />,
      position: "left"
    },
    {
      title: "Industry-Specific Scenarios",
      description: "Practice for your exact industry and role", 
      details: [
        "SDR cold calling and lead qualification scenarios",
        "AE deal closing and stakeholder management"
      ],
      icon: <Target className="h-6 w-6" />,
      position: "right"
    },
    {
      title: "Instant Feedback & Improvement",
      description: "Know exactly what to improve before your real interview",
      details: [
        "Concise yet comprehensive feedback",
        "Full interview transcript"
      ],
      icon: <BarChart3 className="h-6 w-6" />,
      position: "left"
    }
  ];

  const faqItems = [
    {
      question: "How is this better than practicing with friends?",
      answer: "Friends won't give you the brutal honesty of a real hiring manager. Our AI interviewers simulate real pressure, ask tough questions, and provide objective feedback without sugar-coating your weaknesses."
    },
    {
      question: "Will this actually help me get hired?", 
      answer: "73% of sales candidates fail at interviews - not because they can't sell, but because they can't interview. Our platform addresses the exact skills needed to pass sales interviews with realistic practice and instant feedback."
    },
    {
      question: "How realistic are the AI interviewers?",
      answer: "Our AI interviewers are trained on thousands of real sales interviews. Each has distinct personalities, testing styles, and will challenge you just like real hiring managers - some are tough, some are friendly, some are analytical."
    },
    {
      question: "What if I'm changing careers into sales?",
      answer: "Perfect! Career changers are our specialty. We'll help you practice explaining your transition story, demonstrate transferable skills, and build confidence for sales-specific scenarios you've never experienced."
    },
    {
      question: "Can I practice for specific companies?",
      answer: "Yes! Upload any job description and we'll create company-specific interview scenarios, including their sales methodology, company culture, and typical interview questions."
    },
    {
      question: "What's your money-back guarantee?",
      answer: "Get hired in 60 days or get your money back. We're confident that consistent practice with our AI interviewers will dramatically improve your interview performance."
    },
    {
      question: "What is InterviewAce?",
      answer: "InterviewAce is an AI-powered sales interview simulator that helps you practice with realistic AI interviewers, get instant feedback, and build confidence before real interviews. Watch our 2-minute demo to see it in action."
    },
    {
      question: "Does InterviewAce work for my specific use case?",
      answer: "Whether you're an SDR, AE, Sales Manager, or changing careers into sales, our AI adapts to your role and experience level. We support all sales verticals including SaaS, insurance, real estate, and more."
    },
    {
      question: "How does pricing work?",
      answer: "Start with 3 free practice sessions, then choose: Starter ($49/month) for 10 credits and 3 interviewers, or Pro ($99/month) for unlimited credits and all features. Save 20% with annual billing."
    },
    {
      question: "Does AI interview training actually work?",
      answer: "Absolutely. Practice makes perfect, and AI lets you practice unlimited interviews in a judgment-free environment. Users report 40-60% improvement in confidence after just one week of daily practice."
    },
    {
      question: "Why InterviewAce over other tools?",
      answer: "We're the only platform built specifically for sales interviews. Generic interview prep doesn't prepare you for role-plays, objection handling, and sales-specific scenarios that make or break sales interviews."
    }
  ];

  return (
    <div className="min-h-screen bg-white">{/* Clean white background */}

      {/* Navigation */}
      <nav className="fixed top-4 left-44 right-44 z-50 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Mic className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">InterviewAce</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-foreground transition-colors">Features</a>
              <a href="#testimonials" className="text-gray-600 hover:text-foreground transition-colors">Testimonials</a>
              <a href="#pricing" className="text-gray-600 hover:text-foreground transition-colors">Pricing</a>
            </div>
      
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                Watch Demo
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => navigate('/signup')}
              >
                Try For Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center space-y-6">
            {/* New Release Bar */}
            <div className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium mb-8">
              <Star className="h-4 w-4 mr-2" />
              NEW! Cadence v0.1 released
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight max-w-5xl mx-auto">
              Stop Failing Sales Interviews
            </h1>
            
            <div className="space-y-4">
              <p className="text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto" style={{color: 'rgb(75 85 99)'}}>
                Practice with AI interviewers, get real-time coaching, and finally break into that SDR or AE role.
              </p>
            </div>

            <div className="pt-4">
              <p className="text-sm mb-6" style={{color: 'rgb(75 85 99)'}}>
                Join 1,200+ Sales Professionals Who Got Hired
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
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
                  Watch 2-Minute Demo
                  <Play className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* VSL Demo Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="relative max-w-4xl mx-auto">
            <div className="relative z-10 bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="aspect-video bg-gray-50 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-16 w-16 mx-auto mb-4" style={{color: 'rgb(75 85 99)'}} />
                  <p className="text-lg font-medium" style={{color: 'rgb(75 85 99)'}}>VSL Demo Placeholder</p>
                  <p className="text-sm mt-2" style={{color: 'rgb(107 114 128)'}}>Click to watch how InterviewAce works</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-gray-50 rounded-2xl p-12">
            <div className="text-center max-w-4xl mx-auto">
              <blockquote className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed mb-8">
                "You can crush quotas, close deals, and be the best salesman in the world, but if you can't sell yourself in the interview, you'll never get the chance. 73% of sales candidates fail at the interview stage - not because they can't sell, but because they can't interview."
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Founder of CadenceAI</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Value Proposition */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
            That's Why We Created The Most Realistic Interview Practice Experience Possible
          </h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{color: 'rgb(75 85 99)'}}>
            Practice with AI interviewers who think, respond, and challenge you just like real hiring managers.
          </p>
        </div>
      </section>

      {/* Meet Your AI Interview Team */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Meet Your AI Interview Team
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{color: 'rgb(75 85 99)'}}>
              Each AI interviewer has unique personalities and testing styles - just like real hiring managers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {interviewers.map((interviewer) => (
              <Card key={interviewer.id} className="hover:shadow-sm transition-shadow cursor-pointer border border-gray-200 hover:border-primary/20 bg-white">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                    <img 
                      src={interviewer.avatar} 
                      alt={interviewer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-xl">{interviewer.name}</CardTitle>
                  <CardDescription className="text-sm font-medium text-primary">
                    {interviewer.title}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-sm" style={{color: 'rgb(75 85 99)'}}>
                    {interviewer.description}
                  </p>
                  <div className="pt-2">
                    <p className="text-sm font-medium text-foreground mb-2">What they'll test:</p>
                    <p className="text-xs" style={{color: 'rgb(75 85 99)'}}>
                      {interviewer.testingStyle}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setSelectedInterviewer(interviewer.id)}
                  >
                    Start Training
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interviewer Introduction Modal */}
      {selectedInterviewer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src={interviewers.find(i => i.id === selectedInterviewer)?.avatar} 
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <CardTitle className="text-lg">
                    {interviewers.find(i => i.id === selectedInterviewer)?.name}
                  </CardTitle>
                  <CardDescription>
                    {interviewers.find(i => i.id === selectedInterviewer)?.title}
                  </CardDescription>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedInterviewer(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                "{interviewers.find(i => i.id === selectedInterviewer)?.introduction}"
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    setSelectedInterviewer(null);
                    navigate('/signup');
                  }}
                  className="flex-1"
                >
                  Start Interview
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setSelectedInterviewer(null)}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="space-y-24">
            {features.map((feature, index) => (
              <div key={index} className={`flex flex-col lg:flex-row items-center gap-12 ${
                feature.position === 'left' ? 'lg:flex-row-reverse' : ''
              }`}>
                {/* Content */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {feature.icon}
                    </div>
                    <h3 className="text-3xl font-bold text-foreground">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-xl" style={{color: 'rgb(75 85 99)'}}>
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-3" style={{color: 'rgb(75 85 99)'}}>
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* GIF Placeholder */}
                <div className="flex-1">
                  <div className="aspect-video bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-center">
                    <div className="text-center" style={{color: 'rgb(75 85 99)'}}>
                      <FileText className="h-12 w-12 mx-auto mb-2" />
                      <p>Feature Demo</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-foreground mb-12">Real People, Real Job Offers</h2>
          <blockquote className="text-2xl md:text-3xl font-medium text-foreground mb-8">
            "I was bombing every role-play for 3 months. After 2 weeks with InterviewAce, I aced my Salesforce interview and got a $75K SDR offer. The confidence coaching was a game-changer."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-semibold">Sarah Chen</div>
              <div style={{color: 'rgb(75 85 99)'}}>SDR at Salesforce</div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              What's Your Potential Salary Increase?
            </h2>
            <p className="text-xl" style={{color: 'rgb(75 85 99)'}}>
              The average career changer entering sales sees a $28,000/year increase. What about you?
            </p>
          </div>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="pt-8 space-y-6">
              <div className="text-center">
                <Calculator className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Interactive ROI Calculator</h3>
                <p className="mb-6" style={{color: 'rgb(75 85 99)'}}>Coming Soon - Calculate your potential income increase</p>
                <div className="space-y-4 text-left max-w-md mx-auto">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span style={{color: 'rgb(75 85 99)'}}>Current role/salary input</span>
                    <span>→</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span style={{color: 'rgb(75 85 99)'}}>Target sales role selector</span>
                    <span>→</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span style={{color: 'rgb(75 85 99)'}}>Location selector</span>
                    <span>→</span>
                  </div>
                  <div className="pt-4 text-center">
                    <p className="font-medium text-primary">Output: Potential income increase & ROI</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Old Way vs New Way */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Old Way */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-red-600">Old Way</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-red-600">
                  <X className="h-5 w-5" />
                  <span>Practice with friends (who go easy on you)</span>
                </div>
                <div className="flex items-center gap-3 text-red-600">
                  <X className="h-5 w-5" />
                  <span>Generic interview prep (not sales-specific)</span>
                </div>
                <div className="flex items-center gap-3 text-red-600">
                  <X className="h-5 w-5" />
                  <span>Expensive 1-on-1 coaching ($300/session)</span>
                </div>
                <div className="flex items-center gap-3 text-red-600">
                  <X className="h-5 w-5" />
                  <span>No feedback on confidence/delivery</span>
                </div>
              </CardContent>
            </Card>

            {/* New Way */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-primary">New Way</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-primary">
                  <CheckCircle className="h-5 w-5" />
                  <span>Practice with realistic AI interviewers</span>
                </div>
                <div className="flex items-center gap-3 text-primary">
                  <CheckCircle className="h-5 w-5" />
                  <span>Sales-specific role-plays and objections</span>
                </div>
                <div className="flex items-center gap-3 text-primary">
                  <CheckCircle className="h-5 w-5" />
                  <span>Unlimited practice for $49/month</span>
                </div>
                <div className="flex items-center gap-3 text-primary">
                  <CheckCircle className="h-5 w-5" />
                  <span>Real-time confidence coaching</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary text-primary-foreground">Plans</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Flexible plans for growth
            </h2>
            <p className="text-xl" style={{color: 'rgb(75 85 99)'}}>Transparent pricing designed to fit your requirements.</p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button 
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  isTriMonthly ? 'bg-primary text-primary-foreground' : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setIsTriMonthly(true)}
              >
                Tri-Monthly (Save 20%)
              </button>
              <button 
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  !isTriMonthly ? 'bg-primary text-primary-foreground' : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setIsTriMonthly(false)}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Pro Plan */}
            <Card className="bg-white text-black border border-gray-200 shadow-lg">
              <CardHeader className="text-center pb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Pro</CardTitle>
                </div>
                <div className="text-4xl font-bold">
                  ${isTriMonthly ? '40' : '50'}
                  <span className="text-lg text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mt-4">Everything you need to ace your sales interviews</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button variant="default" className="w-full">
                  Get Started →
                </Button>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Unlimited AI interview practice</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Real-time feedback & coaching</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Sales-specific scenarios</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Performance analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Email support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-white text-black border border-gray-200 shadow-lg">
              <CardHeader className="text-center pb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Enterprise</CardTitle>
                </div>
                <div className="text-4xl font-bold">Custom</div>
                <p className="text-gray-600 mt-4">Custom solutions for teams and organizations</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button variant="outline" className="w-full">
                  Schedule a call →
                </Button>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Everything in Pro</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Custom interview scenarios</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Team management dashboard</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Priority support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-left font-semibold">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pt-2" style={{color: 'rgb(75 85 99)'}}>
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ready to Turn Interviews Into Job Offers?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{color: 'rgb(75 85 99)'}}>
            Join 1,200+ sales professionals who stopped getting rejected and started getting hired.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/signup')}
            className="text-lg px-8 py-6"
          >
            Start Free Practice Session
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;