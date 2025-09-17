import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface JobPosting {
  id: string;
  company_name: string;
  job_title: string;
  level: string;
}

interface InterviewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartInterview: (details: InterviewDetails) => void;
}

interface InterviewDetails {
  jobPosting: JobPosting;
  interviewType: string;
  numberOfQuestions: number;
}

const interviewTypes = [
  { value: "Initial Screen", label: "Initial Screen" },
  { value: "Hiring Manager", label: "Hiring Manager" },
  { value: "Technical/Role-Play", label: "Technical/Role-Play" },
  { value: "Executive Interview", label: "Executive Interview" }
];

const questionOptions = [5, 10, 25, 50, 100];

export default function InterviewDetailsModal({ isOpen, onClose, onStartInterview }: InterviewDetailsModalProps) {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [selectedJobPosting, setSelectedJobPosting] = useState("");
  const [selectedInterviewType, setSelectedInterviewType] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState("");
  const [usePreviousKnowledge, setUsePreviousKnowledge] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchJobPostings();
    }
  }, [isOpen]);

  const fetchJobPostings = async () => {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select('id, company_name, job_title, level')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobPostings(data || []);
    } catch (error) {
      console.error('Error fetching job postings:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = selectedJobPosting && selectedInterviewType && selectedQuestions;

  const handleStartInterview = () => {
    if (isFormValid) {
      const selectedJob = jobPostings.find(job => job.id === selectedJobPosting);
      if (selectedJob) {
        onStartInterview({
          jobPosting: selectedJob,
          interviewType: selectedInterviewType,
          numberOfQuestions: parseInt(selectedQuestions)
        });
      }
    }
  };

  const handleClose = () => {
    setSelectedJobPosting("");
    setSelectedInterviewType("");
    setSelectedQuestions("");
    setUsePreviousKnowledge(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Select Interview Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Select a job posting</Label>
            <Select value={selectedJobPosting} onValueChange={setSelectedJobPosting}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a job posting" />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                ) : jobPostings.length === 0 ? (
                  <SelectItem value="none" disabled>No job postings found</SelectItem>
                ) : (
                  jobPostings.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.company_name} - {job.job_title} {job.level && `(${job.level})`}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select interview type</Label>
            <Select value={selectedInterviewType} onValueChange={setSelectedInterviewType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select interview type" />
              </SelectTrigger>
              <SelectContent>
                {interviewTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Number of questions</Label>
            <Select value={selectedQuestions} onValueChange={setSelectedQuestions}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Number of questions" />
              </SelectTrigger>
              <SelectContent>
                {questionOptions.map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        </div>

        <div className="pt-4">
          <Button 
            onClick={handleStartInterview}
            disabled={!isFormValid}
            className="w-full bg-foreground hover:bg-foreground/90 text-background disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Interview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}