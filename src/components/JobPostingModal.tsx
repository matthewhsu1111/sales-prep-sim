import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface JobPostingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (jobData: any) => void;
}

export function JobPostingModal({ isOpen, onClose, onSave }: JobPostingModalProps) {
  const { toast } = useToast();
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Auto-filled fields
  const [jobTitle, setJobTitle] = useState("");
  const [level, setLevel] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [keyRequirements, setKeyRequirements] = useState<string[]>([]);
  const [niceToHaves, setNiceToHaves] = useState<string[]>([]);

  const handleParse = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Error",
        description: "Please enter a job description",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Calling AI parsing service...');
      
      const { data, error } = await supabase.functions.invoke('parse-job-description', {
        body: { jobDescription: jobDescription.trim() },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to parse job description');
      }

      if (!data) {
        throw new Error('No data received from parsing service');
      }

      console.log('Parsed job data:', data);

      // Set the extracted data to state
      setJobTitle(data.jobTitle || "Not specified");
      setLevel(data.level || "mid-level");
      setCompanyName(data.companyName || "Not specified");
      setCompanySize(data.companySize || "Not specified");
      setIndustry(data.industry || "tech");
      setDescription(data.description || "No description available");
      setKeyRequirements(Array.isArray(data.keyRequirements) ? data.keyRequirements : []);
      setNiceToHaves(Array.isArray(data.niceToHaves) ? data.niceToHaves : []);

      toast({
        title: "Success",
        description: "Job description parsed with AI successfully!",
      });

    } catch (error) {
      console.error('Error parsing job description:', error);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to parse job description. Please try again.",
        variant: "destructive",
      });

      // Don't clear the form data on error, let user try again
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    const jobData = {
      jobDescription,
      jobTitle,
      level,
      companyName,
      companySize,
      industry,
      description,
      keyRequirements,
      niceToHaves
    };
    onSave(jobData);
    onClose();
  };

  const handleClose = () => {
    // Reset form
    setJobDescription("");
    setJobTitle("");
    setLevel("");
    setCompanyName("");
    setCompanySize("");
    setIndustry("");
    setDescription("");
    setKeyRequirements([]);
    setNiceToHaves([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Job Posting</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Description Input */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Find job descriptions on LinkedIn, Indeed, Upwork, AngelList, or company career pages
              </p>
              <Textarea
                id="jobDescription"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[200px] bg-muted/30 border-border"
              />
            </div>
            
            <Button 
              onClick={handleParse}
              disabled={isLoading || !jobDescription.trim()}
              className="bg-black hover:bg-black/90 text-white"
            >
              {isLoading ? "Parsing..." : "Parse Job Description"}
            </Button>
          </div>

          {/* Auto-filled fields */}
          {jobTitle && (
            <>
               <div className="space-y-2">
                 <Label htmlFor="jobTitle">Job Title</Label>
                 <Input
                   id="jobTitle"
                   value={jobTitle}
                   onChange={(e) => setJobTitle(e.target.value)}
                   className="bg-muted/30 border-border"
                 />
               </div>

               <div className="space-y-2">
                 <Label htmlFor="level">Level</Label>
                 <Input
                   id="level"
                   value={level}
                   onChange={(e) => setLevel(e.target.value)}
                   className="bg-muted/30 border-border"
                 />
               </div>

               <div className="space-y-2">
                 <Label htmlFor="companyName">Company Name</Label>
                 <Input
                   id="companyName"
                   value={companyName}
                   onChange={(e) => setCompanyName(e.target.value)}
                   className="bg-muted/30 border-border"
                 />
               </div>

               <div className="space-y-2">
                 <Label htmlFor="companySize">Company Size</Label>
                 <Input
                   id="companySize"
                   value={companySize}
                   onChange={(e) => setCompanySize(e.target.value)}
                   className="bg-muted/30 border-border"
                 />
               </div>

               <div className="space-y-2">
                 <Label htmlFor="industry">Industry</Label>
                 <Input
                   id="industry"
                   value={industry}
                   onChange={(e) => setIndustry(e.target.value)}
                   className="bg-muted/30 border-border"
                 />
               </div>

               <div className="space-y-2">
                 <Label htmlFor="description">Job Description</Label>
                 <Textarea
                   id="description"
                   value={description}
                   onChange={(e) => setDescription(e.target.value)}
                   className="min-h-[120px] bg-muted/30 border-border"
                 />
               </div>

              <div className="space-y-2">
                <Label>Key Requirements</Label>
                <div className="space-y-2">
                  {keyRequirements.map((req, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 shrink-0"></div>
                      <p className="text-sm">{req}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Nice-to-Haves</Label>
                <div className="space-y-2">
                  {niceToHaves.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 shrink-0"></div>
                      <p className="text-sm text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleSave} 
                className="w-full bg-black hover:bg-black/90 text-white py-3"
              >
                Save
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}