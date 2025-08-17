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
    // Navigate to preparation page first
    navigate('/dashboard/interview-preparation', { 
      state: { 
        interviewDetails: {
          jobPosting: details.jobPosting, // Pass full job posting object
          interviewType: details.interviewType,
          numberOfQuestions: details.numberOfQuestions
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
          return (
            <Card key={template.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                  <img 
                    src={template.image} 
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-xl">{template.name}</CardTitle>
                <Badge variant="secondary" className="mb-2">{template.title}</Badge>
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