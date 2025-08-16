import { supabase } from "@/integrations/supabase/client";

interface ScrapeResult {
  success: boolean;
  content?: string;
  error?: string;
  originalUrl?: string;
}

export class WebScrapingService {
  static async scrapeJobUrl(url: string): Promise<ScrapeResult> {
    try {
      console.log('Scraping job URL:', url);

      const { data, error } = await supabase.functions.invoke('scrape-job-url', {
        body: { url }
      });

      if (error) {
        console.error('Error calling scrape function:', error);
        return {
          success: false,
          error: 'Failed to scrape job posting. Please try copying the text manually.'
        };
      }

      if (!data.success) {
        return {
          success: false,
          error: data.error || 'Failed to extract job content from URL'
        };
      }

      return {
        success: true,
        content: data.content,
        originalUrl: data.originalUrl
      };

    } catch (error) {
      console.error('Error in WebScrapingService:', error);
      return {
        success: false,
        error: 'Failed to scrape job posting'
      };
    }
  }

  static isValidJobUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      
      // Check for common job posting domains
      const jobDomains = [
        'linkedin.com',
        'indeed.com',
        'glassdoor.com',
        'monster.com',
        'ziprecruiter.com',
        'dice.com',
        'stackoverflow.com',
        'angel.co',
        'wellfound.com'
      ];

      const domain = urlObj.hostname.toLowerCase();
      const isJobSite = jobDomains.some(jobDomain => 
        domain.includes(jobDomain)
      );

      // Also allow any URL that contains job-related keywords in path
      const jobKeywords = ['job', 'career', 'position', 'role', 'hiring'];
      const hasJobKeywords = jobKeywords.some(keyword => 
        urlObj.pathname.toLowerCase().includes(keyword)
      );

      return isJobSite || hasJobKeywords;
    } catch {
      return false;
    }
  }

  static getUrlDisplayName(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  }
}