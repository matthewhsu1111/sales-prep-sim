import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Anthropic from "npm:@anthropic-ai/sdk@^0.60.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const anthropic = new Anthropic({
  apiKey: Deno.env.get('ANTHROPIC_API_KEY'),
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobDescription } = await req.json();

    if (!jobDescription || typeof jobDescription !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Job description is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'Anthropic API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const systemPrompt = `You are an expert job description parser. Analyze the provided job description and extract the following information. Return ONLY a valid JSON object with these exact field names:

REQUIRED FIELDS:
- jobTitle: Extract the exact job title from the posting
- level: Classify as one of: "entry-level", "mid-level", "senior", "principal", "executive"
- companyName: Extract company name, or "Not specified" if not found
- companySize: Classify as one of: "startup", "small", "mid-size", "large enterprise", or "Not specified"
- industry: Classify as one of: "tech", "finance", "healthcare", "retail", "education", "government", "consulting", "manufacturing", "media", "nonprofit", or "other"
- description: Create a clean, professional 2-3 sentence summary of the role
- keyRequirements: Array of 3-6 most important must-have requirements
- niceToHaves: Array of 2-4 preferred qualifications or nice-to-have skills

CLASSIFICATION GUIDELINES:
- Level: entry-level (0-2 years), mid-level (2-5 years), senior (5+ years), principal (8+ years, architect/staff), executive (leadership/director)
- Company Size: startup (early stage, seed), small (10-100 employees), mid-size (100-1000), large enterprise (1000+)
- Make reasonable inferences based on context when information isn't explicit
- If a field cannot be determined, use "Not specified" for strings or provide reasonable defaults for arrays

Example output format:
{
  "jobTitle": "Senior Frontend Developer",
  "level": "senior",
  "companyName": "TechCorp Inc",
  "companySize": "mid-size",
  "industry": "tech",
  "description": "We are seeking a senior frontend developer to build and maintain our customer-facing web applications. You will work with a cross-functional team to deliver high-quality user experiences. This role requires expertise in modern JavaScript frameworks and a passion for clean, maintainable code.",
  "keyRequirements": [
    "5+ years of frontend development experience",
    "Expert-level React and TypeScript skills",
    "Experience with modern build tools and CI/CD",
    "Strong understanding of web performance optimization"
  ],
  "niceToHaves": [
    "Experience with GraphQL",
    "Previous startup experience",
    "Open source contributions"
  ]
}

Analyze this job description and return the extracted information:`;

    console.log('Sending request to Claude...');
    
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      temperature: 0.1,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: jobDescription
        }
      ]
    });

    console.log('Claude response received');

    if (!response.content || !response.content[0] || response.content[0].type !== 'text') {
      console.error('Invalid Claude response structure:', response);
      return new Response(
        JSON.stringify({ error: 'Invalid response from AI service' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const aiResponse = response.content[0].text;
    console.log('AI response content:', aiResponse);

    try {
      // Parse the AI response as JSON
      const parsedData = JSON.parse(aiResponse);
      
      // Validate required fields
      const requiredFields = ['jobTitle', 'level', 'companyName', 'companySize', 'industry', 'description', 'keyRequirements', 'niceToHaves'];
      const missingFields = requiredFields.filter(field => !parsedData.hasOwnProperty(field));
      
      if (missingFields.length > 0) {
        console.error('Missing fields in AI response:', missingFields);
        return new Response(
          JSON.stringify({ error: 'Invalid AI response format' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Ensure arrays are properly formatted
      if (!Array.isArray(parsedData.keyRequirements)) {
        parsedData.keyRequirements = [];
      }
      if (!Array.isArray(parsedData.niceToHaves)) {
        parsedData.niceToHaves = [];
      }

      console.log('Successfully parsed job description');
      return new Response(JSON.stringify(parsedData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.error('AI response was:', aiResponse);
      
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('Error in parse-job-description function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});