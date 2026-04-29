import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WebScrapingService } from "@/utils/WebScrapingService";
import { Globe, FileText } from "lucide-react";

const DEFAULT_JOB_DESCRIPTION = `Sales Development Representative, Outbound (IT)
About Rippling

Rippling is the first way for businesses to manage all of their HR & IT—payroll, benefits, computers, apps, and more—in one unified workforce platform.

By connecting every business system to one source of truth for employee data, businesses can automate all of the manual work they normally need to do to make employee changes. Take onboarding, for example. With Rippling, you can just click a button and set up a new employees' payroll, health insurance, work computer, and third-party apps—like Slack, Zoom, and Office 365—all within 90 seconds.

Based in San Francisco, CA, Rippling has raised $1.2B from the world's top investors—including Kleiner Perkins, Founders Fund, Sequoia, Greenoaks, and Bedrock—and was named one of America's best startup employers by Forbes.

About the role
This role is hybrid 3x a week in our NYC Office

The SDR role at Rippling provides a unique opportunity - we're looking for talented, ambitious SDR's who can manage high velocity top-of-funnel sales qualification, while also navigating a very strategic sales process.

As a SDR, you will be responsible for prospecting and qualifying new customers for Rippling. We're building a team that will require a "winning" attitude, a high sense of urgency, and a passion for sales. As an SDR at Rippling, you will have the opportunity to help shape processes and build pipelines to support your Account Executive counterparts immediately. We believe in promotion from within and transparency on career paths that allow you to grow in your sales profession.

What you'll do
- Become a product expert across our IT platform and understand our competitor landscape
- Manage outbound leads using specific qualifying criteria
- Outbound with strategic and thoughtful messaging to upmarket prospects
- Partner with marketing to manage outbound campaigns to increase lead volume
- Prospect into new accounts using proven sales methodology
- Maintain and update accurate records in CRM

Qualifications
- BA/BS degree, or equivalent work experience
- Ability to thrive in a fast paced environment
- Ability to collaborate with others and work cross functionally among different teams at Rippling
- Desire to join competitive team based environment
- Sales experience preferred but not required for role

Location: New York, NY
Compensation: $105,000 OTE (70/30 split)`;

interface JobPostingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (jobData: any) => void;
}

export default function JobPostingModal({ isOpen, onClose, onSave }: JobPostingModalProps) {
  const { toast } = useToast();
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

      const parsed = data;
      
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

  const handleJobSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('job_postings')
        .insert({
          user_id: user.id,
          company_name: companyName,
          job_title: jobTitle,
          level: jobLevel || null,
          description: description || null,
          requirements: keyRequirements.length > 0 ? keyRequirements : null,
          skills: niceToHaves.length > 0 ? niceToHaves : null,
          languages: null, // Will extract from requirements if needed
        })
        .select()
        .single();

      if (error) throw error;

      console.log("Job posting saved:", data);
      onSave(data);
      handleClose();
    } catch (error) {
      console.error('Error saving job posting:', error);
      toast({
        title: "Error",
        description: "Failed to save job posting. Please try again.",
        variant: "destructive",
      });
    }
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
                          <p className="text-sm text-blue-700 dark:text-blue-300">Paste the job posting link of your dream job or the role you're currently applying for. X Careers, LinkedIn and Greenhouse links work best.</p>
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
                      <Button
                        variant="outline"
                        className="px-3"
                        onClick={() => {
                          setJobDescription(DEFAULT_JOB_DESCRIPTION);
                          setInputMode("text");
                        }}
                      >
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
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Parsed Information</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsParsed(false)}
                  className="text-sm"
                >
                  Try Again
                </Button>
              </div>
              
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="font-medium"
                />
              </div>

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
                onClick={handleJobSave}
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