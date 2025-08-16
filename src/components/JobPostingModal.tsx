import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

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
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);

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
    
    // Enhanced AI parsing simulation - analyze the actual job description text
    setTimeout(() => {
      const text = jobDescription.toLowerCase();
      
      // Extract job title
      let extractedTitle = "Software Engineer";
      if (text.includes("frontend") || text.includes("front-end")) {
        extractedTitle = "Frontend Developer";
      } else if (text.includes("backend") || text.includes("back-end")) {
        extractedTitle = "Backend Developer";
      } else if (text.includes("fullstack") || text.includes("full-stack")) {
        extractedTitle = "Full Stack Developer";
      } else if (text.includes("data scientist")) {
        extractedTitle = "Data Scientist";
      } else if (text.includes("product manager")) {
        extractedTitle = "Product Manager";
      } else if (text.includes("designer") || text.includes("ui/ux")) {
        extractedTitle = "UI/UX Designer";
      } else if (text.includes("devops")) {
        extractedTitle = "DevOps Engineer";
      }

      // Extract level
      let extractedLevel = "Mid-level";
      if (text.includes("junior") || text.includes("entry") || text.includes("0-2 years")) {
        extractedLevel = "Junior";
      } else if (text.includes("senior") || text.includes("5+ years") || text.includes("lead")) {
        extractedLevel = "Senior";
      } else if (text.includes("principal") || text.includes("staff") || text.includes("architect")) {
        extractedLevel = "Principal";
      }

      // Extract programming languages
      const detectedLanguages: string[] = [];
      const languages = ["JavaScript", "TypeScript", "Python", "Java", "Scala", "Go", "Rust", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin"];
      languages.forEach(lang => {
        if (text.includes(lang.toLowerCase())) {
          detectedLanguages.push(lang);
        }
      });

      // Extract skills and technologies
      const detectedSkills: string[] = [];
      const skillKeywords = ["React", "Vue", "Angular", "Node.js", "Express", "Django", "Flask", "Spring", "AWS", "Docker", "Kubernetes", "MongoDB", "PostgreSQL", "Redis", "GraphQL", "REST API", "Microservices", "Machine Learning", "AI"];
      skillKeywords.forEach(skill => {
        if (text.includes(skill.toLowerCase())) {
          detectedSkills.push(skill);
        }
      });

      // Extract requirements
      const extractedRequirements: string[] = [];
      if (text.includes("experience") || text.includes("years")) {
        extractedRequirements.push("Relevant professional experience in software development");
      }
      if (text.includes("degree") || text.includes("bachelor") || text.includes("computer science")) {
        extractedRequirements.push("Bachelor's degree in Computer Science or related field");
      }
      if (text.includes("team") || text.includes("collaboration")) {
        extractedRequirements.push("Strong collaboration and teamwork skills");
      }
      if (text.includes("problem solving") || text.includes("analytical")) {
        extractedRequirements.push("Excellent problem-solving and analytical abilities");
      }
      if (text.includes("communication")) {
        extractedRequirements.push("Strong verbal and written communication skills");
      }

      // Set extracted data
      setJobTitle(extractedTitle);
      setLevel(extractedLevel);
      setDescription(jobDescription.slice(0, 500) + (jobDescription.length > 500 ? "..." : ""));
      setRequirements(extractedRequirements.length > 0 ? extractedRequirements : ["Professional experience in relevant technologies", "Strong problem-solving abilities", "Team collaboration skills"]);
      setSkills(detectedSkills.length > 0 ? detectedSkills : ["Software Development", "Problem Solving"]);
      setLanguages(detectedLanguages.length > 0 ? detectedLanguages : ["JavaScript"]);
      setIsLoading(false);
      
      toast({
        title: "Success",
        description: "Job description parsed and analyzed successfully!",
      });
    }, 2000);
  };

  const handleSave = () => {
    const jobData = {
      jobDescription,
      jobTitle,
      level,
      description,
      requirements,
      skills,
      languages
    };
    onSave(jobData);
    onClose();
  };

  const handleClose = () => {
    // Reset form
    setJobDescription("");
    setJobTitle("");
    setLevel("");
    setDescription("");
    setRequirements([]);
    setSkills([]);
    setLanguages([]);
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
                 <Label htmlFor="description">Description</Label>
                 <Textarea
                   id="description"
                   value={description}
                   onChange={(e) => setDescription(e.target.value)}
                   className="min-h-[120px] bg-muted/30 border-border"
                 />
               </div>

              <div className="space-y-2">
                <Label>Requirements</Label>
                <div className="space-y-2">
                  {requirements.map((req, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 shrink-0"></div>
                      <p className="text-sm">{req}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Languages</Label>
                <div className="flex flex-wrap gap-2">
                  {languages.map((language, index) => (
                    <Badge key={index} variant="secondary">
                      {language}
                    </Badge>
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