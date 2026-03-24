import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  FileText,
  Flame
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import rebeccaImage from '@/assets/rebecca-martinez.jpg';
import jakeImage from '@/assets/jake-thompson.jpg';
import michaelImage from '@/assets/michael-chen.jpg';
import heroImage from '@/assets/hero-interview.jpg';
import founderImage from '@/assets/founder.png';

const Index = () => {
  const navigate = useNavigate();
  const [isTriMonthly, setIsTriMonthly] = useState(true);
  const [selectedInterviewer, setSelectedInterviewer] = useState<string | null>(null);
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);
  
  // ROI Calculator state
  const [currentSalary, setCurrentSalary] = useState<string>('40000');
  const [targetRole, setTargetRole] = useState<string>('sdr');

  const roleSalaries: Record<string, { base: number; ote: number; label: string }> = {
    sdr: { base: 50000, ote: 75000, label: 'SDR' },
    bdr: { base: 52000, ote: 78000, label: 'BDR' },
    ae_smb: { base: 60000, ote: 100000, label: 'AE (SMB)' },
    ae_mid: { base: 75000, ote: 140000, label: 'AE (Mid-Market)' },
    ae_enterprise: { base: 95000, ote: 200000, label: 'AE (Enterprise)' },
  };

  const currentSalaryNum = parseInt(currentSalary) || 0;
  const targetInfo = roleSalaries[targetRole];
  const baseDiff = targetInfo.base - currentSalaryNum;
  const oteDiff = targetInfo.ote - currentSalaryNum;
  const cadenceCost = isTriMonthly ? 40 * 3 : 50 * 3;
  const roiMultiple = oteDiff > 0 ? Math.round(oteDiff / cadenceCost) : 0;

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
        "Unlimited text-based practice sessions to build confidence"
      ],
      icon: <Users className="h-6 w-6" />,
      position: "right"
    },
    {
      title: "Real-Time Confidence Coaching", 
      description: "AI detects weak answers and guides you to stronger delivery",
      details: [
        "Response analysis detects hesitation and vague answers",
        "Live coaching prompts during practice sessions"
      ],
      icon: <Brain className="h-6 w-6" />,
      position: "left"
    },
    {
      title: "Instant Feedback & Improvement",
      description: "Know exactly what to improve before your real interview",
      details: [
        "Concise yet comprehensive feedback",
        "Full interview transcript"
      ],
      icon: <BarChart3 className="h-6 w-6" />,
      position: "right"
    },
    {
      title: "Streaks & Progress Tracking",
      description: "Stay motivated with gamified progress and daily streaks",
      details: [
        "Build daily practice streaks to form winning habits",
        "Level up with XP rewards"
      ],
      icon: <Flame className="h-6 w-6" />,
      position: "left"
    }
  ];

  const faqItems = [
    {
      question: "What is Cadence?",
      answer: "Cadence is an AI-powered text-based simulator to help aspiring SDRs/AEs practice realistic sales interview scenarios with real-time coaching and build confidence before real interviews."
    },
    {
      question: "Why tri-monthly billing instead of monthly?",
      answer: "Unlike other SaaS companies, Cadence is designed to get you hired, not keep you subscribed forever. Our tri-monthly billing aligns with realistic job search timelines of 30-90 days. Once you get hired, you won't need us anymore - and that's exactly the goal."
    },
    {
      question: "Will this actually help me get hired?", 
      answer: "Yes, but your success depends entirely on how much time and effort you dedicate to becoming better. While we can't guarantee you'll get hired (that depends on many factors), we can guarantee you'll be better prepared than 90% of other candidates."
    },
    {
      question: "How realistic are the AI interviewers?",
      answer: "Our AI interviewers go beyond basic Q&A. They have distinct personalities, challenge poor answers, ask follow-up questions based on what you say, and even show skepticism when appropriate."
    },
    {
      question: "What if I'm changing careers into sales?",
      answer: "Perfect! Career changers are actually our specialty. Build confidence for scenarios you've never faced before with Rebecca, practice explaining your transition story with Jake, and translate your previous experience into sales terms with Michael - they're here to help!"
    }
  ];

  return (
    <div className="min-h-screen bg-white">{/* Clean white background */}

      {/* Navigation */}
      <nav className="fixed top-4 left-64 right-64 z-50 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Mic className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">Cadence</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#realistic-section" className="text-gray-600 hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-foreground transition-colors">Pricing</a>
              <a href="#faq" className="text-gray-600 hover:text-foreground transition-colors">FAQ</a>
            </div>
      
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/register')}
              >
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
              NEW! Cadence v1 released
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
                  onClick={() => navigate('/register')}
                >
                  Watch Demo
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
                  <p className="text-sm mt-2" style={{color: 'rgb(107 114 128)'}}>Click to watch how Cadence works</p>
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
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img 
                    src={founderImage} 
                    alt="Founder of Cadence"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Founder of Cadence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Value Proposition */}
      <section id="realistic-section" className="py-12 bg-white scroll-mt-24">
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

      
      {/* ROI Calculator */}
      <section className="py-20 bg-white">
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
            <CardContent className="pt-8 space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentSalary" className="text-sm font-medium">Current Annual Salary ($)</Label>
                    <Input
                      id="currentSalary"
                      type="number"
                      value={currentSalary}
                      onChange={(e) => setCurrentSalary(e.target.value)}
                      placeholder="e.g. 40000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Target Sales Role</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {Object.entries(roleSalaries).map(([key, val]) => (
                        <button
                          key={key}
                          onClick={() => setTargetRole(key)}
                          className={`text-left px-4 py-3 rounded-lg border transition-colors text-sm ${
                            targetRole === key 
                              ? 'border-primary bg-primary/5 text-foreground font-medium' 
                              : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          }`}
                        >
                          <span>{val.label}</span>
                          <span className="float-right text-xs text-muted-foreground">
                            ${val.base.toLocaleString()} – ${val.ote.toLocaleString()} OTE
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="flex flex-col justify-center space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                    <h4 className="font-semibold text-foreground text-lg">Your Potential Increase</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{color: 'rgb(75 85 99)'}}>Base salary increase</span>
                        <span className={`font-bold text-lg ${baseDiff > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {baseDiff > 0 ? '+' : ''}${baseDiff.toLocaleString()}/yr
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{color: 'rgb(75 85 99)'}}>With OTE (on-target earnings)</span>
                        <span className={`font-bold text-lg ${oteDiff > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {oteDiff > 0 ? '+' : ''}${oteDiff.toLocaleString()}/yr
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm" style={{color: 'rgb(75 85 99)'}}>Cadence investment (3 months)</span>
                          <span className="font-medium text-foreground">${cadenceCost}</span>
                        </div>
                      </div>
                      {roiMultiple > 0 && (
                        <div className="bg-primary/10 rounded-lg p-4 text-center">
                          <p className="text-sm text-primary font-medium">Potential ROI</p>
                          <p className="text-3xl font-bold text-primary">{roiMultiple}x</p>
                          <p className="text-xs text-muted-foreground mt-1">return on your Cadence investment</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate('/signup')}
                    className="w-full"
                  >
                    Start Practicing Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
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
                  <span>Unlimited practice for $50/month</span>
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
      <section id="pricing" className="py-20 bg-white scroll-mt-12">
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
                  !isTriMonthly ? 'bg-primary text-primary-foreground' : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setIsTriMonthly(false)}
              >
                Monthly
              </button>
              <button 
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  isTriMonthly ? 'bg-primary text-primary-foreground' : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setIsTriMonthly(true)}
              >
                Tri-Monthly (Save 20%)
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-white text-black border border-gray-200 shadow-lg">
              <CardHeader className="text-center pb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Free</CardTitle>
                </div>
                <div className="text-4xl font-bold">
                  $0
                  <span className="text-lg text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mt-4">Get started with interview practice</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/signup')}
                >
                  Start Free →
                </Button>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">3 complete interview sessions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Access to all 3 interviewer personalities</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Full interview transcripts</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Detailed performance feedback</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Performance analytics dashboard</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-white text-black border-2 border-primary shadow-lg">
              <CardHeader className="text-center pb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Pro</CardTitle>
                </div>
                <div className="text-4xl font-bold">
                  ${isTriMonthly ? '40' : '50'}
                  <span className="text-lg text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mt-4">Unlimited interview practice</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => {
                    const checkoutUrl = isTriMonthly
                      ? "https://buy.stripe.com/6oU6oGdfQ5er8s0cZzdZ601"
                      : "https://buy.stripe.com/eVq4gygs2eP18s07FfdZ600";
                    window.open(checkoutUrl, '_blank');
                  }}
                >
                  Get Started →
                </Button>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Unlimited interview sessions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Access to all 3 interviewer personalities</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Full interview transcripts</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Detailed performance feedback</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Performance analytics dashboard</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white scroll-mt-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>
      
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg px-6 bg-white">
                <button
                  className="w-full py-6 flex justify-between items-center text-left font-semibold"
                  onClick={() => setOpenFAQIndex(openFAQIndex === index ? null : index)}
                >
                  <span>{item.question}</span>
                  <ChevronDown 
                    className={`h-5 w-5 transition-transform duration-200 ${
                      openFAQIndex === index ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                {openFAQIndex === index && (
                  <div className="pb-6 pt-2" style={{color: 'rgb(75 85 99)'}}>
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ready to Never Bomb Another Sales Interview?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{color: 'rgb(75 85 99)'}}>
            Build the confidence and skills you need to land that SDR or AE role you've been chasing.
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
