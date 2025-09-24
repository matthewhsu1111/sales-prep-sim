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

    // Pre-analysis: Check for quality indicators
    const transcriptWords = transcript?.split(/\s+/).length || 0;
    const unprofessionalPatterns = /\b(idk|bruh|whatever|dunno|uhh|umm|like\s+like|yo\b|dude)\b/gi;
    const unprofessionalMatches = transcript?.match(unprofessionalPatterns) || [];
    const hasSubstantialContent = transcriptWords > 100;
    const unprofessionalRatio = unprofessionalMatches.length / Math.max(transcriptWords, 1);

    console.log('Quality check:', { 
      transcriptWords, 
      unprofessionalMatches: unprofessionalMatches.length, 
      unprofessionalRatio,
      hasSubstantialContent 
    });

    // CRITICAL ANALYSIS PROMPT - Much more strict
    const systemPrompt = `You are a TOUGH, CRITICAL sales interview analyst. You have 20+ years of experience hiring sales professionals and you DO NOT give participation trophies.

CRITICAL SCORING STANDARDS:
- 1-3: Completely unprepared, unprofessional, or nonsensical responses
- 4-5: Poor performance with major gaps in sales knowledge/professionalism  
- 6-7: Acceptable but needs significant improvement
- 8-9: Strong performance with minor areas to improve
- 10: Exceptional, hire-ready performance

RED FLAGS (automatic score reduction):
- Unprofessional language (slang, "idk", "bruh", "whatever")
- Generic answers without specific examples
- Cannot articulate value propositions
- Poor grammar or communication skills
- Admits to not knowing basic sales concepts
- Gives up easily or shows lack of preparation

TRANSCRIPT ANALYSIS REQUIREMENTS:
1. Count specific examples given (score lower if none)
2. Evaluate communication clarity and professionalism
3. Assess sales methodology knowledge
4. Check for company/role research evidence
5. Rate confidence and composure

If transcript shows:
- Unprofessional language: Max score 4/10
- No specific examples: Max score 5/10  
- Generic responses only: Max score 6/10
- Poor preparation evident: Max score 5/10

STRICT GRADING: Most candidates should score 4-6. Only exceptional performances deserve 7+.

Return ONLY valid JSON in this exact format:
{
  "overallScore": number,
  "overallFeedback": "string",
  "detailedScores": {
    "communication": number,
    "confidence": number,
    "salesSkills": number,
    "interviewMechanics": number
  },
  "strengths": [
    {
      "skill": "string",
      "category": "string", 
      "evidence": "string",
      "score": number
    }
  ],
  "weaknesses": [
    {
      "skill": "string",
      "category": "string",
      "issue": "string", 
      "improvementActions": ["string"],
      "score": number
    }
  ],
  "improvements": ["specific actionable recommendations"]
}`;

    // Force lower scores for poor quality transcripts
    let maxAllowedScore = 10;
    if (!hasSubstantialContent) maxAllowedScore = 3;
    if (unprofessionalRatio > 0.05) maxAllowedScore = Math.min(maxAllowedScore, 4);
    if (unprofessionalRatio > 0.1) maxAllowedScore = Math.min(maxAllowedScore, 2);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anthropicApiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `${systemPrompt}\n\nINTERVIEW DATA:\nType: ${interviewType}\nInterviewer: ${interviewer}\nTranscript word count: ${transcriptWords}\nUnprofessional language detected: ${unprofessionalMatches.length} instances\n\nTRANSCRIPT:\n${transcript}`
          }
        ]
      })
    });

    const data = await response.json();
    console.log('Anthropic response received:', { hasContent: !!data.content?.[0]?.text });

    let analysisResult: any;
    try {
      const content = data.content[0].text;
      console.log('Raw AI response:', content.substring(0, 200) + '...');
      
      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
        
        // Enforce maximum score based on quality check
        if (analysisResult.overallScore > maxAllowedScore) {
          console.log(`Enforcing max score: ${analysisResult.overallScore} -> ${maxAllowedScore}`);
          analysisResult.overallScore = maxAllowedScore;
          
          // Adjust detailed scores proportionally
          const ratio = maxAllowedScore / Math.max(analysisResult.overallScore, 1);
          if (analysisResult.detailedScores) {
            Object.keys(analysisResult.detailedScores).forEach(key => {
              analysisResult.detailedScores[key] = Math.min(analysisResult.detailedScores[key] * ratio, maxAllowedScore);
            });
          }
        }
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.log('Full response content:', data.content?.[0]?.text);
      
      // Critical fallback - much lower scores
      const fallbackScore = Math.max(Math.min(maxAllowedScore, 3), 1);
      analysisResult = {
        overallScore: fallbackScore,
        overallFeedback: hasSubstantialContent 
          ? "Analysis could not be completed properly. Performance appears below expectations based on available data."
          : "Interview appears incomplete or contains insufficient content for proper evaluation.",
        detailedScores: {
          communication: fallbackScore,
          confidence: Math.max(fallbackScore - 1, 1),
          salesSkills: Math.max(fallbackScore - 1, 1),
          interviewMechanics: fallbackScore
        },
        strengths: [
          {
            skill: "Interview Participation",
            category: "engagement",
            evidence: "Participated in the interview process",
            score: Math.min(fallbackScore + 1, 5)
          }
        ],
        weaknesses: [
          {
            skill: "Overall Performance",
            category: "general",
            issue: hasSubstantialContent ? "Performance did not meet professional interview standards" : "Insufficient or incomplete responses",
            improvementActions: [
              "Practice structured interview responses", 
              "Research common sales interview questions",
              "Prepare specific examples from experience",
              "Focus on professional communication"
            ],
            score: fallbackScore
          }
        ],
        improvements: [
          "Practice answering questions with specific, detailed examples",
          "Research the company and role thoroughly before interviews", 
          "Improve professional communication and eliminate casual language",
          "Prepare responses using the STAR method (Situation, Task, Action, Result)"
        ]
      };
    }

    // Additional quality control
    if (unprofessionalMatches.length > 5) {
      analysisResult.improvements.unshift("Eliminate unprofessional language and slang from interview responses");
      analysisResult.weaknesses.unshift({
        skill: "Professional Communication",
        category: "communication", 
        issue: `Used unprofessional language ${unprofessionalMatches.length} times`,
        improvementActions: ["Practice formal interview language", "Record yourself practicing to identify casual speech patterns"],
        score: 2
      });
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
          scores: analysisResult.detailedScores,
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

    console.log('Analysis completed successfully with score:', analysisResult.overallScore);

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-interview function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      overallScore: 2,
      overallFeedback: "Interview analysis failed. This indicates significant issues with the interview process or responses.",
      detailedScores: {
        communication: 2,
        confidence: 1,
        salesSkills: 1,
        interviewMechanics: 2
      },
      strengths: [{
        skill: "Basic Participation",
        category: "engagement", 
        evidence: "Attempted to complete interview",
        score: 3
      }],
      weaknesses: [{
        skill: "Technical Issues",
        category: "system",
        issue: "Interview could not be properly analyzed",
        improvementActions: ["Ensure stable internet connection", "Speak clearly", "Complete full interview"],
        score: 1
      }],
      improvements: [
        "Complete the full interview without technical issues",
        "Prepare thoroughly before starting your next interview",
        "Practice speaking clearly and professionally"
      ]
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});