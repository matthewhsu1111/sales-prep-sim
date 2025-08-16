import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Scraping URL:', url);

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid URL format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) {
      console.error('FIRECRAWL_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'Firecrawl API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Scrape the job posting URL
    const scrapeResponse = await fetch('https://api.firecrawl.dev/v0/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        formats: ['markdown'],
        onlyMainContent: true,
        includeTags: ['h1', 'h2', 'h3', 'p', 'ul', 'li', 'div'],
        excludeTags: ['nav', 'footer', 'header', 'aside', 'script', 'style'],
        waitFor: 2000
      })
    });

    if (!scrapeResponse.ok) {
      const errorText = await scrapeResponse.text();
      console.error('Firecrawl API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to scrape job posting. Please try copying the text manually.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const scrapeData = await scrapeResponse.json();
    console.log('Scrape successful, content length:', scrapeData.data?.markdown?.length || 0);

    if (!scrapeData.success || !scrapeData.data?.markdown) {
      console.error('No content extracted from URL');
      return new Response(
        JSON.stringify({ error: 'No job description content found on this page' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const scrapedContent = scrapeData.data.markdown;
    
    // Clean up the content to focus on job description
    const cleanedContent = cleanJobContent(scrapedContent);

    return new Response(
      JSON.stringify({ 
        success: true,
        content: cleanedContent,
        originalUrl: url 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in scrape-job-url function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to scrape job posting' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function cleanJobContent(content: string): string {
  // Remove common website elements that aren't part of job description
  let cleaned = content
    // Remove navigation-like content
    .replace(/^.*?(Home|About|Careers|Jobs|Contact|Login|Sign up).*$/gmi, '')
    // Remove footer-like content
    .replace(/^.*?(Copyright|Privacy Policy|Terms|Cookies).*$/gmi, '')
    // Remove social media links
    .replace(/^.*?(Follow us|Social|LinkedIn|Twitter|Facebook).*$/gmi, '')
    // Remove excessive whitespace
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();

  // If content is too short, return original
  if (cleaned.length < 200) {
    return content;
  }

  return cleaned;
}