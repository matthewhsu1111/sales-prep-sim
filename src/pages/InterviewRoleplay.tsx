import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Users, BarChart3, Plus } from "lucide-react";
import rebeccaMartinez from "@/assets/rebecca-martinez.jpg";
import jakeThompson from "@/assets/jake-thompson.jpg";
import michaelChen from "@/assets/michael-chen.jpg";
import JobPostingModal from "@/components/JobPostingModal";
import InterviewDetailsModal from "@/components/InterviewDetailsModal";
import UpgradeModal from "@/components/UpgradeModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const interviewerTemplates = [
  {
    id: "strict_no_bs",
    name: "Rebecca Martinez",
    title: "Senior Sales Director",
    description: "Direct and results-focused interviewer who values efficiency above all else",
    testingFocus: "Tests resilience, confidence, and results-focus under pressure",
    personality: "15+ years in sales leadership, no-nonsense approach, tough but fair",
    traits: [
      "Cuts straight to business metrics",
      "Challenges claims aggressively", 
      "Focuses heavily on quotas and numbers",
      "Uses phrases like 'Bottom line is...'",
      "Tests objection handling with pushback"
    ],
    image: rebeccaMartinez,
    color: "bg-red-500"
  },
  {
    id: "casual_conversational", 
    name: "Jake Thompson",
    title: "Sales Team Lead",
    description: "Friendly team leader who values culture fit and relationship-building",
    testingFocus: "Tests interpersonal skills, teamwork, and cultural alignment",
    personality: "Believes great salespeople are naturally social and relationship-builders",
    traits: [
      "Starts with genuine small talk",
      "Asks about motivations and goals",
      "Shares personal experiences naturally",
      "Uses humor and casual language",
      "Focuses on collaboration and teamwork"
    ],
    image: jakeThompson,
    color: "bg-green-500"
  },
  {
    id: "analytical_detail_oriented",
    name: "Michael Chen",
    title: "Sales Operations Manager", 
    description: "Process-driven analyst who believes success comes from systematic approaches",
    testingFocus: "Tests analytical thinking, process knowledge, and data-driven decision making",
    personality: "Finance/analytics background, methodical questioning, precise communication",
    traits: [
      "Asks detailed follow-up questions",
      "Requests specific metrics and conversions",
      "Breaks down processes step-by-step",
      "Focuses on CRM usage and systems",
      "Values systematic approaches"
    ],
    image: michaelChen,
    color: "bg-blue-500"
  }
];

export default function InterviewRoleplay() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isInterviewDetailsModalOpen, setIsInterviewDetailsModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [hasJobPostings, setHasJobPostings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedInterviewer, setSelectedInterviewer] = useState<string | null>(null);
  const [userTier, setUserTier] = useState<'free' | 'pro'>('free');
  const [interviewCount, setInterviewCount] = useState(0);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);

  useEffect(() => {
    checkExistingJobPostings();
    checkUserSubscription();
  }, []);

  const checkExistingJobPostings = async () => {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select('id')
        .limit(1);

      if (error) throw error;
      setHasJobPostings(data && data.length > 0);
    } catch (error) {
      console.error('Error checking job postings:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user profile with subscription tier and status
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier, subscription_status')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setUserTier((profile.subscription_tier as 'free' | 'pro') || 'free');
        setSubscriptionStatus(profile.subscription_status);
      }

      // Get interview count
      const { data: countData } = await supabase
        .from('user_interview_counts')
        .select('total_interviews')
        .eq('user_id', user.id)
        .maybeSingle();

      setInterviewCount(countData?.total_interviews || 0);
    } catch (error) {
      console.error('Error checking user subscription:', error);
    }
  };

  const handleStartTraining = (templateId: string) => {
    // Check if user has reached interview limit (free users OR users without active subscription)
    if ((userTier === 'free' || subscriptionStatus !== 'active') && interviewCount >= 3) {
      setIsUpgradeModalOpen(true);
      return;
    }

    // Find the interviewer template to get the name
    const template = interviewerTemplates.find(t => t.id === templateId);
    setSelectedInterviewer(template?.name || null);
    
    if (hasJobPostings) {
      setIsInterviewDetailsModalOpen(true);
    } else {
      setIsJobModalOpen(true);
    }
  };

  const handleJobSave = (jobData: any) => {
    console.log("Job data saved:", jobData);
    setHasJobPostings(true);
    toast({
      title: "Success",
      description: "Job posting saved! Now select interview details...",
    });
    setIsInterviewDetailsModalOpen(true);
  };

  const handleStartInterview = async (details: any) => {
    console.log("Starting interview with details:", details, "Selected interviewer:", selectedInterviewer);
    
    // Increment interview count
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: existing } = await supabase
          .from('user_interview_counts')
          .select('total_interviews')
          .eq('user_id', user.id)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('user_interview_counts')
            .update({ total_interviews: existing.total_interviews + 1 })
            .eq('user_id', user.id);
        } else {
          await supabase
            .from('user_interview_counts')
            .insert({ user_id: user.id, total_interviews: 1 });
        }
      }
    } catch (error) {
      console.error('Error updating interview count:', error);
    }

    toast({
      title: "Starting Interview",
      description: "Interview training session is beginning...",
    });
    setIsInterviewDetailsModalOpen(false);
    // Navigate directly to interview session (skip preparation page)
    navigate('/dashboard/interview-session', { 
      state: { 
        interviewDetails: {
          jobPosting: details.jobPosting, // Pass full job posting object
          interviewType: details.interviewType,
          numberOfQuestions: details.numberOfQuestions,
          interviewer: selectedInterviewer // Add the interviewer name
        }
      } 
    });
  };
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interview Training</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Create custom interviewers or use pre-built templates to practice and refine your answers in realistic scenarios.
          </p>
          {(userTier === 'free' || subscriptionStatus !== 'active') && (
            <p className="text-sm text-muted-foreground mt-1">
              Free plan: {interviewCount}/3 interviews used
            </p>
          )}
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Interviewer
        </Button>
      </div>

      {/* Interviewer Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviewerTemplates.map((template) => {
          return (
            <Card key={template.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <img 
                      src={template.image} 
                      alt={template.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold">{template.name}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">{template.title}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">What they'll test:</h4>
                  <p className="text-xs text-muted-foreground">{template.testingFocus}</p>
                </div>
                
                <Button 
                  className="w-full mt-4"
                  onClick={() => handleStartTraining(template.id)}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Start Training"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <JobPostingModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        onSave={handleJobSave}
      />
      
      <InterviewDetailsModal
        isOpen={isInterviewDetailsModalOpen}
        onClose={() => setIsInterviewDetailsModalOpen(false)}
        onStartInterview={handleStartInterview}
      />

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </div>
  );
}