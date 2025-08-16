import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Link, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JobPostingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (jobData: any) => void;
}

export function JobPostingModal({ isOpen, onClose, onSave }: JobPostingModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("url");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Auto-filled fields
  const [jobTitle, setJobTitle] = useState("");
  const [level, setLevel] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);

  const handleParse = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call to parse job posting
    setTimeout(() => {
      // Mock auto-filled data based on the images
      setJobTitle("Software Engineer - Core Services");
      setLevel("Senior");
      setDescription("Core Services is hiring an exceptional engineer to help build a high throughput distributed platform that serves Posts, Users, and social relationships to all product surface areas on X. Are you prepared to join the X team and help build the ultimate real-time information-sharing app, revolutionizing how people connect? At X, we're on a mission to become the trusted global digital public square, committed to protecting freedom of speech and building the future unlimited interactivity. Our goal is to empower every user to freely create and share ideas, fostering open public discourse without barriers. Join us in shaping this thrilling journey where your contribution will be invaluable to our success!");
      setRequirements([
        "Proficient in Scala/Java or similar language; an expert in majority of language constructs, able to apply them fluently to solve fairly complex problems.",
        "Designed a non-trivial distributed system (multi-tier) - storage layers, caching layers, application layers, understanding of failure modes, which are significantly different vs non-dist systems, expertise with caching (memcached and/or redis) at scale.",
        "Microservice Architecture experience, especially with high throughput and low-latency systems.",
        "Experience with performance tuning.",
        "Has done a complex systems migration involving multiple phases with dark reads, dark writes, light reads, light writes."
      ]);
      setSkills(["distributed platform", "high throughput", "real-time information"]);
      setLanguages(["Scala", "Java"]);
      setIsLoading(false);
      
      toast({
        title: "Success",
        description: "Job posting parsed successfully!",
      });
    }, 2000);
  };

  const handleSave = () => {
    const jobData = {
      url,
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
    setUrl("");
    setJobTitle("");
    setLevel("");
    setDescription("");
    setRequirements([]);
    setSkills([]);
    setLanguages([]);
    setActiveTab("url");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">Add New Job Posting</DialogTitle>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* URL/PDF Upload Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">URL</TabsTrigger>
              <TabsTrigger value="pdf">PDF Upload</TabsTrigger>
            </TabsList>
            
            <TabsContent value="url" className="space-y-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <div className="bg-blue-500 rounded-full p-1 mt-0.5">
                      <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Tip</p>
                      <p className="text-sm text-muted-foreground">
                        X Careers, LinkedIn and Greenhouse links work best.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Input
                  placeholder="https://x.com/i/jobs/1727449632538562998"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" className="shrink-0">
                  Use default
                </Button>
                <Button 
                  onClick={handleParse}
                  disabled={isLoading}
                  className="bg-black hover:bg-black/90 text-white shrink-0"
                >
                  <Link className="h-4 w-4 mr-2" />
                  {isLoading ? "Parsing..." : "Parse"}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="pdf" className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Upload a PDF job posting</p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Auto-filled fields */}
          {jobTitle && (
            <>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Input
                  id="level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px]"
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