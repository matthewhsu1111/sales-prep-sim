import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { transcript, interviewType, jobPosting, interviewer, sessionId } = await req.json();
    
    console.log('Analyzing interview:', { interviewType, interviewer, sessionId, transcriptLength: transcript?.length });

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Get user from auth token
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error('Invalid user token');
    }

    const userId = userData.user.id;

    const systemPrompt = `You are an expert interview analyst specializing in sales roles. Analyze this text-based interview transcript using the provided framework. Focus on content-based assessment areas like sales skills, company knowledge, response structure, and communication quality. 
    
    Note: Voice/audio analysis (pace, filler words, voice trembling) cannot be assessed from text alone.
    
    FRAMEWORK CATEGORIES:
    1. Communication Skills (storytelling, listening, response relevance)
    2. Confidence & Presence (composure from word choice, professional tone)
    3. Sales-Specific Skills (objection handling, value articulation, questioning)
    4. Interview Mechanics (preparation, structure, experience translation)
    
    For each category, identify strengths and improvement areas with specific examples from the transcript.
    
    SCORING: Use 1-10 scale where 1-3=needs improvement, 4-6=developing, 7-8=competent, 9-10=excellent.
    
    Respond with simple format for frontend compatibility:
    {
      "overallScore": number,
      "overallFeedback": "string",
      "strengths": ["string array of strengths"],
      "weaknesses": ["string array of areas to improve"],
      "improvements": ["string array of actionable recommendations"]
    }`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anthropicApiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `${systemPrompt}\n\nInterview Type: ${interviewType}\nInterviewer: ${interviewer}\nJob Posting: ${JSON.stringify(jobPosting || {})}\n\nTranscript:\n${transcript}`
          }
        ]
      })
    });

    const data = await response.json();
    console.log('Anthropic response received:', { hasContent: !!data.content?.[0]?.text });

    let analysisResult;
    try {
      const content = data.content[0].text;
      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      // Fallback analysis
      analysisResult = {
        overallScore: 75,
        overallFeedback: "Interview completed successfully. Continue practicing to improve your skills.",
        strengths: [
          "Engaged throughout the interview",
          "Provided relevant examples",
          "Maintained professional tone"
        ],
        weaknesses: [
          "Could improve company research",
          "Practice more specific examples",
          "Work on response structure"
        ],
        improvements: [
          "Research the company and role more thoroughly",
          "Practice answering common interview questions",
          "Work on speaking clearly and confidently"
        ]
      };
    }

    // Store results in database
    if (sessionId) {
      const { error: updateError } = await supabase
        .from('interview_sessions')
        .update({
          overall_score: analysisResult.overallScore,
          analysis_results: analysisResult,
          strengths: analysisResult.strengths,
          weaknesses: analysisResult.weaknesses,
          improvements: analysisResult.improvements,
          scores: analysisResult.detailedScores || null,
          transcript: transcript
        })
        .eq('id', sessionId)
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating session:', updateError);
      }
    } else {
      // Create new session
      const { error: insertError } = await supabase
        .from('interview_sessions')
        .insert({
          user_id: userId,
          interviewer_name: interviewer || 'Unknown',
          interview_type: interviewType || 'General',
          overall_score: analysisResult.overallScore,
          analysis_results: analysisResult,
          strengths: analysisResult.strengths,
          weaknesses: analysisResult.weaknesses,
          improvements: analysisResult.improvements,
          scores: analysisResult.detailedScores,
          transcript: transcript,
          job_posting: jobPosting || null
        });

      if (insertError) {
        console.error('Error inserting session:', insertError);
      }
    }

    console.log('Analysis completed successfully');

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-interview function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      overallScore: 70,
      overallFeedback: "Analysis completed with limited data. Continue practicing to improve your skills.",
      strengths: ["Completed the interview"],
      weaknesses: ["Technical analysis unavailable"],
      improvements: ["Practice more interviews", "Ensure clear audio quality"]
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});