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
                    <Label htmlFor="jobUrl">URL</Label>
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg mb-3">
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-white text-xs font-medium">i</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Tip</p>
                          <p className="text-sm text-blue-700 dark:text-blue-300">X Careers, LinkedIn and Greenhouse links work best.</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id="jobUrl"
                        type="url"
                        placeholder="https://x.com/i/jobs/1727449632538562998"
                        value={jobUrl}
                        onChange={(e) => setJobUrl(e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="outline" className="px-3">
                        Use default
                      </Button>
                    </div>
                  </div>
                  <Button 
                    onClick={handleScrapeUrl} 
                    disabled={isScrapingUrl || !jobUrl.trim()}
                    className="w-full bg-black hover:bg-black/90 text-white"
                  >
                    {isScrapingUrl ? "Parsing..." : "Parse"}
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
                    className="w-full bg-black hover:bg-black/90 text-white"
                  >
                    {isLoading ? "Parsing..." : "Parse Job Description"}
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="text-lg font-medium"
                />
              </div>

              <div>
                <Label htmlFor="jobLevel">Level</Label>
                <Input
                  id="jobLevel"
                  value={jobLevel}
                  onChange={(e) => setJobLevel(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px] resize-none"
                  readOnly
                />
              </div>

              {keyRequirements.length > 0 && (
                <div>
                  <Label className="text-base font-medium">Requirements</Label>
                  <div className="mt-3 space-y-2">
                    {keyRequirements.map((req, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 shrink-0"></div>
                        <p className="text-sm leading-relaxed">{req}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {niceToHaves.length > 0 && (
                <div>
                  <Label className="text-base font-medium">Skills</Label>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {niceToHaves.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Extract languages from keyRequirements for now */}
              {keyRequirements.some(req => req.toLowerCase().includes('scala') || req.toLowerCase().includes('java') || req.toLowerCase().includes('python') || req.toLowerCase().includes('javascript')) && (
                <div>
                  <Label className="text-base font-medium">Languages</Label>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {keyRequirements
                      .filter(req => req.toLowerCase().includes('scala') || req.toLowerCase().includes('java') || req.toLowerCase().includes('python') || req.toLowerCase().includes('javascript'))
                      .map((req, index) => {
                        const languages = [];
                        if (req.toLowerCase().includes('scala')) languages.push('Scala');
                        if (req.toLowerCase().includes('java') && !req.toLowerCase().includes('javascript')) languages.push('Java');
                        if (req.toLowerCase().includes('python')) languages.push('Python');
                        if (req.toLowerCase().includes('javascript')) languages.push('JavaScript');
                        return languages.map((lang, langIndex) => (
                          <Badge key={`${index}-${langIndex}`} variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                            {lang}
                          </Badge>
                        ));
                      })}
                  </div>
                </div>
              )}

              <Button 
                onClick={handleSave}
                className="w-full bg-black hover:bg-black/90 text-white py-3 text-base"
              >
                Save
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}