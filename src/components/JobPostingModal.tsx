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
    
    // Enhanced AI parsing simulation - analyze the actual job description text
    setTimeout(() => {
      const text = jobDescription.toLowerCase();
      const originalText = jobDescription;
      
      // Extract job title
      let extractedTitle = "Software Engineer";
      if (text.includes("frontend") || text.includes("front-end") || text.includes("front end")) {
        extractedTitle = "Frontend Developer";
      } else if (text.includes("backend") || text.includes("back-end") || text.includes("back end")) {
        extractedTitle = "Backend Developer";
      } else if (text.includes("fullstack") || text.includes("full-stack") || text.includes("full stack")) {
        extractedTitle = "Full Stack Developer";
      } else if (text.includes("data scientist") || text.includes("data science")) {
        extractedTitle = "Data Scientist";
      } else if (text.includes("product manager") || text.includes("pm ")) {
        extractedTitle = "Product Manager";
      } else if (text.includes("designer") || text.includes("ui/ux") || text.includes("ux/ui")) {
        extractedTitle = "UI/UX Designer";
      } else if (text.includes("devops") || text.includes("dev ops")) {
        extractedTitle = "DevOps Engineer";
      } else if (text.includes("software engineer") || text.includes("swe")) {
        extractedTitle = "Software Engineer";
      }

      // Extract level with more accurate mapping
      let extractedLevel = "mid-level";
      if (text.includes("junior") || text.includes("entry") || text.includes("0-2 years") || text.includes("entry-level")) {
        extractedLevel = "entry-level";
      } else if (text.includes("senior") || text.includes("sr.") || text.includes("5+ years") || text.includes("lead")) {
        extractedLevel = "senior";
      } else if (text.includes("principal") || text.includes("staff") || text.includes("architect")) {
        extractedLevel = "principal";
      } else if (text.includes("executive") || text.includes("director") || text.includes("vp") || text.includes("chief")) {
        extractedLevel = "executive";
      }

      // Extract company name (look for common patterns)
      let extractedCompanyName = "Not specified";
      const companyPatterns = [
        /(?:at|@|for|with)\s+([A-Z][a-zA-Z\s&.,]+?)(?:\s|,|\.|$)/g,
        /([A-Z][a-zA-Z\s&.,]+?)\s+(?:is|seeks|looking|hiring)/g
      ];
      for (const pattern of companyPatterns) {
        const match = originalText.match(pattern);
        if (match && match[1] && match[1].length > 2 && match[1].length < 50) {
          extractedCompanyName = match[1].trim();
          break;
        }
      }

      // Extract company size
      let extractedCompanySize = "Not specified";
      if (text.includes("startup") || text.includes("early stage") || text.includes("seed")) {
        extractedCompanySize = "startup";
      } else if (text.includes("small") || text.includes("boutique") || text.includes("10-50") || text.includes("under 100")) {
        extractedCompanySize = "small";
      } else if (text.includes("mid-size") || text.includes("100-1000") || text.includes("medium")) {
        extractedCompanySize = "mid-size";
      } else if (text.includes("enterprise") || text.includes("fortune") || text.includes("1000+") || text.includes("large")) {
        extractedCompanySize = "large enterprise";
      }

      // Extract industry
      let extractedIndustry = "tech";
      if (text.includes("finance") || text.includes("banking") || text.includes("fintech")) {
        extractedIndustry = "finance";
      } else if (text.includes("healthcare") || text.includes("medical") || text.includes("pharma")) {
        extractedIndustry = "healthcare";
      } else if (text.includes("retail") || text.includes("e-commerce") || text.includes("ecommerce")) {
        extractedIndustry = "retail";
      } else if (text.includes("education") || text.includes("edtech")) {
        extractedIndustry = "education";
      } else if (text.includes("government") || text.includes("public sector")) {
        extractedIndustry = "government";
      }

      // Create clean job description (2-3 sentences)
      const sentences = originalText.split(/[.!?]+/).filter(s => s.trim().length > 10);
      const cleanDescription = sentences.slice(0, 3).join('. ').trim() + '.';

      // Extract key requirements
      const extractedKeyRequirements: string[] = [];
      if (text.includes("bachelor") || text.includes("degree") || text.includes("bs ") || text.includes("ba ")) {
        extractedKeyRequirements.push("Bachelor's degree in Computer Science or related field");
      }
      if (text.includes("experience") || text.includes("years")) {
        const yearsMatch = text.match(/(\d+)[\s+-]*years?/);
        if (yearsMatch) {
          extractedKeyRequirements.push(`${yearsMatch[1]}+ years of professional experience`);
        } else {
          extractedKeyRequirements.push("Professional experience in software development");
        }
      }
      if (text.includes("react") || text.includes("angular") || text.includes("vue")) {
        extractedKeyRequirements.push("Experience with modern frontend frameworks");
      }
      if (text.includes("python") || text.includes("java") || text.includes("javascript") || text.includes("typescript")) {
        extractedKeyRequirements.push("Proficiency in programming languages");
      }
      if (text.includes("aws") || text.includes("cloud") || text.includes("azure") || text.includes("gcp")) {
        extractedKeyRequirements.push("Cloud platform experience");
      }

      // Extract nice-to-haves
      const extractedNiceToHaves: string[] = [];
      if (text.includes("master") || text.includes("ms ") || text.includes("phd")) {
        extractedNiceToHaves.push("Advanced degree preferred");
      }
      if (text.includes("startup") || text.includes("fast-paced")) {
        extractedNiceToHaves.push("Startup or fast-paced environment experience");
      }
      if (text.includes("open source") || text.includes("github")) {
        extractedNiceToHaves.push("Open source contributions");
      }
      if (text.includes("leadership") || text.includes("mentoring")) {
        extractedNiceToHaves.push("Leadership or mentoring experience");
      }

      // Set extracted data
      setJobTitle(extractedTitle);
      setLevel(extractedLevel);
      setCompanyName(extractedCompanyName);
      setCompanySize(extractedCompanySize);
      setIndustry(extractedIndustry);
      setDescription(cleanDescription);
      setKeyRequirements(extractedKeyRequirements.length > 0 ? extractedKeyRequirements : ["Professional experience in relevant technologies", "Strong problem-solving abilities"]);
      setNiceToHaves(extractedNiceToHaves.length > 0 ? extractedNiceToHaves : ["Team collaboration skills", "Continuous learning mindset"]);
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