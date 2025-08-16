import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WebScrapingService } from "@/utils/WebScrapingService";
import { Globe, FileText } from "lucide-react";

interface JobPostingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (jobData: any) => void;
}

export default function JobPostingModal({ isOpen, onClose, onSave }: JobPostingModalProps) {
  // Form state
  const [jobUrl, setJobUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobLevel, setJobLevel] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyIndustry, setCompanyIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [description, setDescription] = useState("");
  const [keyRequirements, setKeyRequirements] = useState<string[]>([]);
  const [niceToHaves, setNiceToHaves] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isParsed, setIsParsed] = useState(false);
  const [inputMode, setInputMode] = useState<"url" | "text">("url");
  const [isScrapingUrl, setIsScrapingUrl] = useState(false);
  
  const { toast } = useToast();

  const handleScrapeUrl = async () => {
    if (!jobUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a job URL first",
        variant: "destructive",
      });
      return;
    }

    setIsScrapingUrl(true);
    
    try {
      console.log('Scraping job URL...');
      
      const result = await WebScrapingService.scrapeJobUrl(jobUrl);

      if (!result.success) {
        throw new Error(result.error || 'Failed to scrape job posting');
      }

      // Set the scraped content as job description
      setJobDescription(result.content || "");
      
      // Automatically parse the scraped content
      await parseJobContent(result.content || "");

      toast({
        title: "Success",
        description: "Job posting scraped and parsed successfully!",
      });

    } catch (error) {
      console.error('Error scraping job URL:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to scrape job posting",
        variant: "destructive",
      });
    } finally {
      setIsScrapingUrl(false);
    }
  };

  const parseJobContent = async (content: string) => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter a job description first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Calling parse-job-description function...');
      
      const { data, error } = await supabase.functions.invoke('parse-job-description', {
        body: { jobDescription: content }
      });

      if (error) {
        console.error('Error calling function:', error);
        throw new Error(error.message || 'Failed to parse job description');
      }

      console.log('Function response:', data);

      if (!data.success) {
        throw new Error(data.error || 'Failed to parse job description');
      }

      const parsed = data.jobData;
      
      // Update form fields with parsed data
      setJobTitle(parsed.jobTitle || "");
      setJobLevel(parsed.jobLevel || "");
      setCompanyName(parsed.companyName || "");
      setCompanyIndustry(parsed.companyIndustry || "");
      setCompanySize(parsed.companySize || "");
      setDescription(parsed.description || "");
      setKeyRequirements(parsed.keyRequirements || []);
      setNiceToHaves(parsed.niceToHaves || []);
      
      setIsParsed(true);

    } catch (error) {
      console.error('Error parsing job description:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to parse job description",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleParse = () => parseJobContent(jobDescription);

  const handleSave = () => {
    const jobData = {
      jobDescription,
      jobTitle,
      jobLevel,
      companyName,
      companyIndustry,
      companySize,
      description,
      keyRequirements,
      niceToHaves,
      sourceUrl: jobUrl || undefined
    };
    
    onSave(jobData);
    handleClose();

    toast({
      title: "Success",
      description: "Job posting saved successfully!",
    });
  };

  const handleClose = () => {
    // Reset all form fields
    setJobUrl("");
    setJobDescription("");
    setJobTitle("");
    setJobLevel("");
    setCompanyName("");
    setCompanyIndustry("");
    setCompanySize("");
    setDescription("");
    setKeyRequirements([]);
    setNiceToHaves([]);
    setIsParsed(false);
    setInputMode("url");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Job Posting</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {!isParsed ? (
            <div className="space-y-4">
              <Tabs value={inputMode} onValueChange={(value) => setInputMode(value as "url" | "text")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="url" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    From URL
                  </TabsTrigger>
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Paste Text
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="url" className="space-y-4">
                  <div>
                    <Label htmlFor="jobUrl">Job Posting URL</Label>
                    <Input
                      id="jobUrl"
                      type="url"
                      placeholder="https://company.com/jobs/position"
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Paste a link to the job posting from LinkedIn, Indeed, or any company careers page
                    </p>
                  </div>
                  <Button 
                    onClick={handleScrapeUrl} 
                    disabled={isScrapingUrl || !jobUrl.trim()}
                    className="w-full"
                  >
                    {isScrapingUrl ? "Scraping & Parsing..." : "Scrape Job Posting"}
                  </Button>
                </TabsContent>
                
                <TabsContent value="text" className="space-y-4">
                  <div>
                    <Label htmlFor="jobDescription">Job Description</Label>
                    <Textarea
                      id="jobDescription"
                      placeholder="Paste the job description here..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="min-h-[200px]"
                    />
                  </div>
                  <Button 
                    onClick={handleParse} 
                    disabled={isLoading || !jobDescription.trim()}
                    className="w-full"
                  >
                    {isLoading ? "Parsing..." : "Parse Job Description"}
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="jobLevel">Job Level</Label>
                  <Input
                    id="jobLevel"
                    value={jobLevel}
                    onChange={(e) => setJobLevel(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="companySize">Company Size</Label>
                  <Input
                    id="companySize"
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="companyIndustry">Industry</Label>
                <Input
                  id="companyIndustry"
                  value={companyIndustry}
                  onChange={(e) => setCompanyIndustry(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {keyRequirements.length > 0 && (
                <div>
                  <Label>Key Requirements</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {keyRequirements.map((req, index) => (
                      <Badge key={index} variant="default">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {niceToHaves.length > 0 && (
                <div>
                  <Label>Nice to Have</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {niceToHaves.map((item, index) => (
                      <Badge key={index} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={() => setIsParsed(false)} 
                  variant="outline"
                  className="flex-1"
                >
                  Back to Edit
                </Button>
                <Button 
                  onClick={handleSave}
                  className="flex-1"
                >
                  Save Job Posting
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}