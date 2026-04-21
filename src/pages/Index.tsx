import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import realisticRoleplayVideo from '@/assets/realistic-roleplay.mov';
import practiceDetailsVideo from '@/assets/practice-details.mov';
import resultsDemoVideo from '@/assets/results-demo.mov';
import xpDemoVideo from '@/assets/xp-demo.mov';
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
  Menu,
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
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import rebeccaImage from '@/assets/rebecca-martinez.jpg';
import jakeImage from '@/assets/jake-thompson.jpg';
import michaelImage from '@/assets/michael-chen.jpg';
import heroImage from '@/assets/hero-interview.jpg';
import founderImage from '@/assets/founder.png';
import cadenceLogo from '@/assets/cadence-logo.png';

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
        "Practice interviewing under pressure",
        "Unlimited text-based practice sessions to build confidence"
      ],
      icon: <Users className="h-6 w-6" />,
      position: "right",
      demo: realisticRoleplayVideo
    },
    {
      title: "Practice Exactly What YOU Need",
      description: "Personalize every practice session to match your upcoming interviews",
      details: [
        "Adjust difficulty level: Start easy to build confidence, then increase to match real pressure",
        "Pick scenario focus: Initial screen, hiring manager, technical/role-play, executive interview"
      ],
      icon: <Brain className="h-6 w-6" />,
      position: "left",
      demo: practiceDetailsVideo
    },
    {
      title: "Instant Feedback & Improvement",
      description: "Know exactly what to improve before your real interview",
      details: [
        "Concise yet comprehensive feedback",
        "Full interview transcript"
      ],
      icon: <BarChart3 className="h-6 w-6" />,
      position: "right",
      demo: resultsDemoVideo
    },
    {
      title: "Streaks & Progress Tracking",
      description: "Stay motivated with gamified progress and daily streaks",
      details: [
        "Build daily practice streaks to form winning habits",
        "Level up with XP rewards"
      ],
      icon: <Flame className="h-6 w-6" />,
      position: "left",
      demo: xpDemoVideo
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
      <nav className="fixed top-4 left-4 right-4 sm:left-8 sm:right-8 lg:left-32 lg:right-32 xl:left-64 xl:right-64 z-50 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center space-x-2 shrink-0">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Mic className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">Cadence</span>
            </div>
            
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#realistic-section" className="text-gray-600 hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-foreground transition-colors">Pricing</a>
              <a href="#faq" className="text-gray-600 hover:text-foreground transition-colors">FAQ</a>
            </div>
      
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              <Button 
                variant="default" 
                size="sm"
                onClick={() => navigate('/signup')}
              >
                Try For Free
              </Button>
            </div>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-6 mt-8">
                  <SheetClose asChild>
                    <a href="#realistic-section" className="text-lg font-medium text-foreground hover:text-primary transition-colors">Features</a>
                  </SheetClose>
                  <SheetClose asChild>
                    <a href="#pricing" className="text-lg font-medium text-foreground hover:text-primary transition-colors">Pricing</a>
                  </SheetClose>
                  <SheetClose asChild>
                    <a href="#faq" className="text-lg font-medium text-foreground hover:text-primary transition-colors">FAQ</a>
                  </SheetClose>
                  <div className="flex flex-col gap-3 pt-4 border-t">
                    <Button variant="default" onClick={() => navigate('/signup')}>
                      Try For Free
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
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
                  <div className="aspect-video bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden">
                    {feature.demo ? (
                      <video
                        src={feature.demo}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center" style={{color: 'rgb(75 85 99)'}}>
                        <FileText className="h-12 w-12 mx-auto mb-2" />
                        <p>Feature Demo</p>
                      </div>
                    )}
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

      {/* Testimonial */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 lg:p-12 text-center shadow-sm">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-semibold">
                H
              </div>
            </div>
            <div className="flex justify-center gap-1 mb-4" aria-label="5 out of 5 stars">
              {[0, 1, 2, 3, 4].map((i) => (
                <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-xl lg:text-2xl text-foreground font-medium leading-relaxed mb-6">
              "As someone who actually interviews candidates, I'd recommend this to anyone preparing. The questions and structure mirror what real interviews feel like."
            </blockquote>
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-foreground">Haven</span> · Hiring Manager, Hospitality
            </div>
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

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src={cadenceLogo} alt="CadenceAI" className="h-8 w-8 rounded-md" />
                <span className="font-bold text-lg text-foreground">CadenceAI</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                Go into your next interview like it's your 50th.
              </p>
              <a
                href="https://www.linkedin.com/in/matthewhsu6/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
                </svg>
              </a>
            </div>

            {/* Compare */}
            <div>
              <h4 className="text-xs font-semibold tracking-wider text-foreground uppercase mb-4">Compare</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => navigate('/compare/hyperbound')}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    vs Hyperbound
                  </button>
                </li>
              </ul>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-semibold tracking-wider text-foreground uppercase mb-4">Product</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => navigate('/blog')}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Blog
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CadenceAI. All rights reserved.
            </p>
            <button
              onClick={() => navigate('/privacy')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
