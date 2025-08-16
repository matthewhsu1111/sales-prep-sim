import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Users, BarChart3, Plus } from "lucide-react";
import JobPostingModal from "@/components/JobPostingModal";
import InterviewDetailsModal from "@/components/InterviewDetailsModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const interviewerTemplates = [
  {
    id: "strict-no-bs",
    name: "Strict, No BS",
    description: "Direct and to-the-point interviewer",
    testingFocus: "Tests resilience, confidence, and results-focus",
    personality: "Direct and to-the-point",
    traits: [
      "Minimal small talk",
      "Focuses on results and competency", 
      "No-nonsense approach"
    ],
    icon: User,
    color: "bg-red-500"
  },
  {
    id: "casual-conversational", 
    name: "Casual, Conversational",
    description: "Friendly and relaxed interviewer",
    testingFocus: "Tests interpersonal skills and culture fit",
    personality: "Treats it like a friendly chat",
    traits: [
      "Asks personal questions to build rapport",
      "Relaxed, informal approach",
      "Conversational style"
    ],
    icon: Users,
    color: "bg-green-500"
  },
  {
    id: "analytical-detailed",
    name: "Analytical, Detail-Oriented", 
    description: "Deep-dive technical interviewer",
    testingFocus: "Tests process knowledge and systematic thinking",
    personality: "Digs deep into specifics and metrics",
    traits: [
      "Asks lots of follow-up questions",
      "Wants concrete examples and data",
      "Technical precision focus"
    ],
    icon: BarChart3,
    color: "bg-blue-500"
  }
];

export default function InterviewRoleplay() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isInterviewDetailsModalOpen, setIsInterviewDetailsModalOpen] = useState(false);
  const [hasJobPostings, setHasJobPostings] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkExistingJobPostings();
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

  const handleStartTraining = (templateId: string) => {
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

  const handleStartInterview = (details: any) => {
    console.log("Starting interview with details:", details);
    toast({
      title: "Starting Interview",
      description: "Interview training session is beginning...",
    });
    setIsInterviewDetailsModalOpen(false);
    navigate('/dashboard/interview-preparation');
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
          <p className="text-sm text-muted-foreground mt-1">
            Each training session costs 1 credit
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Interviewer
        </Button>
      </div>

      {/* Interviewer Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviewerTemplates.map((template) => {
          const IconComponent = template.icon;
          return (
            <Card key={template.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className={`mx-auto rounded-full ${template.color} text-white mb-4 w-20 h-20 flex items-center justify-center`}>
                  <IconComponent className="h-10 w-10" />
                </div>
                <CardTitle className="text-xl">{template.name}</CardTitle>
                <CardDescription className="text-muted-foreground">{template.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2 text-primary">Personality:</h4>
                  <p className="text-sm text-muted-foreground">{template.personality}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2 text-primary">Key Traits:</h4>
                  <div className="space-y-1">
                    {template.traits.map((trait, index) => (
                      <div key={index} className="text-xs text-primary bg-primary/10 px-2 py-1 rounded inline-block mr-1 mb-1">
                        {trait}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground italic">{template.testingFocus}</p>
                </div>
                
                <Button 
                  className="w-full mt-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg"
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
    </div>
  );
}