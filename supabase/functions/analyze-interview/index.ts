import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Anthropic from "npm:@anthropic-ai/sdk@^0.29.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const anthropic = new Anthropic({
  apiKey: Deno.env.get('ANTHROPIC_API_KEY'),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcript, interviewType, jobPosting } = await req.json();

    console.log('🎯 Analyzing interview:', { interviewType, jobPostingExists: !!jobPosting });

    const systemPrompt = `You are an expert sales interview coach analyzing an interview performance. 

INTERVIEW CONTEXT:
- Interview Type: ${interviewType}
- Job Role: ${jobPosting?.title || 'Sales Development Representative'}
- Company: ${jobPosting?.company || 'Tech Company'}

ANALYSIS INSTRUCTIONS:
1. Analyze the candidate's responses for key competencies based on the interview type:

For "Initial Screen":
- Communication skills and clarity
- Background alignment with role
- Motivation and enthusiasm
- Basic sales understanding
- Cultural fit indicators

For "Hiring Manager":
- Sales methodology knowledge
- Specific examples and metrics
- Problem-solving approach
- Objection handling capability
- Strategic thinking

For "Executive Interview":
- Business acumen
- Leadership potential
- Industry knowledge
- Vision and strategic thinking
- Executive presence

2. Provide specific, actionable feedback based on their actual responses
3. Be constructive but honest about areas needing improvement
4. Give a realistic score out of 100

RESPONSE FORMAT:
Return a JSON object with exactly this structure:
{
  "strengths": ["Specific strength 1", "Specific strength 2", "Specific strength 3"],
  "weaknesses": ["Specific weakness 1", "Specific weakness 2"],
  "improvements": ["Actionable improvement 1", "Actionable improvement 2", "Actionable improvement 3"],
  "overallScore": 75,
  "overallFeedback": "Comprehensive paragraph summarizing performance and potential"
}

Make sure all feedback is:
- Specific to their actual responses
- Actionable and constructive
- Appropriate for the interview type
- Professional but encouraging

IMPORTANT: Respond ONLY with valid JSON, no additional text.`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 1000,
      temperature: 0.3,
      system: systemPrompt,
      messages: [{
        role: "user",
        content: `Please analyze this interview transcript:\n\n${transcript}`
      }]
    });

    const aiResponse = response.content[0]?.type === 'text' 
      ? response.content[0].text 
      : '{}';

    console.log('✅ Analysis generated, length:', aiResponse.length);

    // Parse the JSON response
    let analysisData;
    try {
      analysisData = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      // Fallback analysis
      analysisData = {
        strengths: [
          "Completed the interview successfully",
          "Engaged throughout the conversation",
          "Showed interest in the role"
        ],
        weaknesses: [
          "Could provide more specific examples",
          "Need to quantify achievements better"
        ],
        improvements: [
          "Practice the STAR method for behavioral questions",
          "Research company and industry more thoroughly",
          "Prepare specific metrics and examples from past experience"
        ],
        overallScore: 70,
        overallFeedback: "You demonstrated good communication skills and engagement during the interview. To improve your performance, focus on providing more specific examples with quantifiable results and research the company more thoroughly to show deeper interest and preparation."
      };
    }

    return new Response(JSON.stringify(analysisData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Analysis error:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Analysis failed',
      details: error.stack 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});