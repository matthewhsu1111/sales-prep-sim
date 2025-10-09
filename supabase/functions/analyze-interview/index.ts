import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { transcript, interviewType, jobPosting, interviewer, sessionId } = await req.json();

    console.log("Analyzing interview:", {
      interviewType,
      interviewer,
      sessionId,
      transcriptLength: transcript?.length,
    });

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Get user from auth token
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);

    if (userError || !userData.user) {
      throw new Error("Invalid user token");
    }

    const userId = userData.user.id;

    // Pre-analysis: Check for quality indicators
    const transcriptWords = transcript?.split(/\s+/).length || 0;

    // Separate serious unprofessional language from normal filler words
    const seriouslyUnprofessionalPatterns = /\b(idk|bruh|whatever|dunno|yo\b|dude)\b/gi;
    const fillerWords = /\b(uhh|umm|like\s+like|uh\b)\b/gi;

    const seriousMatches = transcript?.match(seriouslyUnprofessionalPatterns) || [];
    const fillerMatches = transcript?.match(fillerWords) || [];

    const hasSubstantialContent = transcriptWords > 100;
    const seriouslyUnprofessionalRatio = seriousMatches.length / Math.max(transcriptWords, 1);

    console.log("Quality check:", {
      transcriptWords,
      seriousMatches: seriousMatches.length,
      fillerMatches: fillerMatches.length,
      seriouslyUnprofessionalRatio,
      hasSubstantialContent,
    });

    // Updated scoring system with 1-100 scale
    const systemPrompt = `You are an experienced interview analyst with expertise in evaluating sales and professional interview performance.

SCORING SYSTEM (1-100 SCALE):
Start with base score of 50 for completing interview professionally.

ADD POINTS FOR:
- Quantified business results (revenue numbers, conversion rates, specific metrics): +10-20
- Specific, detailed examples with context: +5-15
- Strategic business thinking and industry insights: +5-15
- Advanced preparation/research evident in responses: +5-10
- Sophisticated, professional communication: +5-10
- Industry/role knowledge demonstrated: +5-10
- Problem-solving approach with clear methodology: +5-10
- Leadership/initiative examples: +5-10

SUBTRACT POINTS FOR:
- Unprofessional language (idk, bruh, whatever, etc): -20 to -40
- Vague/generic responses without specifics: -5 to -15
- Poor preparation or no research: -5 to -15
- Inability to provide concrete examples: -10 to -20
- Evasive or incomplete answers: -5 to -15
- Excessive filler words (um, uh, like): -2 to -5 per instance (minor penalty)

SCORING RANGES:
- 1-20: Unprofessional, unprepared, nonsensical
- 21-40: Poor performance, major gaps
- 41-60: Adequate but unremarkable
- 61-70: Good performance with solid fundamentals
- 71-80: Strong performance with quantified results and strategic thinking
- 81-90: Excellent with sophisticated insights
- 91-100: Exceptional (rare)

CRITICAL: Base the score on ACTUAL CONTENT demonstrated in the transcript. If the candidate provides:
- Quantified results ($1.1M revenue, specific conversion rates, etc.)
- Strategic thinking about ICP, research, and sales methodology
- Knowledge of frameworks (MEDDIC, BANT, etc.)
- Professional communication with detailed examples

They should score in the 70-85 range. Normal filler words (um, uh, like) are common in spoken interviews and should only result in minor deductions (-2 to -5 points total), not failing scores.

Return ONLY valid JSON in this exact format:
{
  "overallScore": number (1-100),
  "overallFeedback": "string",
  "detailedScores": {
    "communication": number (1-100),
    "confidence": number (1-100),
    "salesSkills": number (1-100),
    "interviewMechanics": number (1-100)
  },
  "strengths": [
    {
      "skill": "string",
      "category": "string", 
      "evidence": "string",
      "score": number (1-100)
    }
  ],
  "weaknesses": [
    {
      "skill": "string",
      "category": "string",
      "issue": "string", 
      "improvementActions": ["string"],
      "score": number (1-100)
    }
  ],
  "improvements": ["specific actionable recommendations"]
}`;

    // Only cap scores for truly unprofessional content
    let maxAllowedScore = 100;
    if (!hasSubstantialContent) maxAllowedScore = 30;
    if (seriousMatches.length > 5) maxAllowedScore = 40; // Only if multiple serious unprofessional words
    if (seriouslyUnprofessionalRatio > 0.03) maxAllowedScore = 20; // Only if >3% seriously unprofessional

    // Calculate filler penalty (minor deduction, not a hard cap)
    const fillerPenalty = Math.min(fillerMatches.length * 2, 15); // Max -15 points for fillers

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${anthropicApiKey}`,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [
          {
            role: "user",
            content: `${systemPrompt}\n\nINTERVIEW DATA:\nType: ${interviewType}\nInterviewer: ${interviewer}\nTranscript word count: ${transcriptWords}\nSeriously unprofessional language: ${seriousMatches.length} instances\nFiller words: ${fillerMatches.length} instances\n\nTRANSCRIPT:\n${transcript}`,
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("Anthropic response received:", { hasContent: !!data.content?.[0]?.text });

    let analysisResult: any;
    try {
      if (!data.content || !data.content[0] || !data.content[0].text) {
        throw new Error("No content in API response");
      }

      const content = data.content[0].text;
      console.log("Full response content:", content);

      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);

        // Enforce maximum score based on quality check (only for serious issues)
        if (analysisResult.overallScore > maxAllowedScore) {
          console.log(
            `Enforcing max score due to serious issues: ${analysisResult.overallScore} -> ${maxAllowedScore}`,
          );
          analysisResult.overallScore = maxAllowedScore;

          // Adjust detailed scores proportionally
          const ratio = maxAllowedScore / Math.max(analysisResult.overallScore, 1);
          if (analysisResult.detailedScores) {
            Object.keys(analysisResult.detailedScores).forEach((key) => {
              analysisResult.detailedScores[key] = Math.round(
                Math.min(analysisResult.detailedScores[key] * ratio, maxAllowedScore),
              );
            });
          }
        } else if (fillerMatches.length > 3) {
          // Apply filler penalty without hard cap (minor deduction)
          const penalizedScore = Math.max(analysisResult.overallScore - fillerPenalty, 50);
          console.log(
            `Applying filler word penalty: ${analysisResult.overallScore} -> ${penalizedScore} (${fillerMatches.length} fillers, -${fillerPenalty} points)`,
          );
          analysisResult.overallScore = penalizedScore;
        }
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      console.log("Full API response:", JSON.stringify(data));

      // Fallback scoring based on transcript quality
      const fallbackScore = !hasSubstantialContent ? 25 : Math.min(maxAllowedScore, 50);
      analysisResult = {
        overallScore: fallbackScore,
        overallFeedback: hasSubstantialContent
          ? "Analysis could not be completed properly. Based on transcript quality, performance appears to need improvement."
          : "Interview appears incomplete or contains insufficient content for proper evaluation.",
        detailedScores: {
          communication: fallbackScore,
          confidence: Math.max(fallbackScore - 5, 20),
          salesSkills: Math.max(fallbackScore - 10, 15),
          interviewMechanics: fallbackScore,
        },
        strengths: [
          {
            skill: "Interview Participation",
            category: "engagement",
            evidence: "Participated in the interview process",
            score: Math.min(fallbackScore + 10, 60),
          },
        ],
        weaknesses: [
          {
            skill: "Overall Performance",
            category: "general",
            issue: hasSubstantialContent
              ? "Performance did not meet professional interview standards"
              : "Insufficient or incomplete responses",
            improvementActions: [
              "Practice structured interview responses",
              "Research common sales interview questions",
              "Prepare specific examples from experience",
              "Focus on professional communication",
            ],
            score: fallbackScore,
          },
        ],
        improvements: [
          "Practice answering questions with specific, detailed examples",
          "Research the company and role thoroughly before interviews",
          "Improve professional communication and eliminate casual language",
          "Prepare responses using the STAR method (Situation, Task, Action, Result)",
        ],
      };
    }

    // Additional quality control for seriously unprofessional language only
    if (seriousMatches.length > 5) {
      analysisResult.improvements.unshift(
        "Eliminate unprofessional slang (idk, bruh, whatever) from interview responses",
      );
      analysisResult.weaknesses.unshift({
        skill: "Professional Communication",
        category: "communication",
        issue: `Used seriously unprofessional language ${seriousMatches.length} times`,
        improvementActions: [
          "Practice formal interview language",
          "Record yourself practicing to identify unprofessional speech patterns",
        ],
        score: Math.max(analysisResult.overallScore - 30, 20),
      });
    }

    // Store results in database
    if (sessionId) {
      const { error: updateError } = await supabase
        .from("interview_sessions")
        .update({
          overall_score: analysisResult.overallScore,
          analysis_results: analysisResult,
          strengths: analysisResult.strengths,
          weaknesses: analysisResult.weaknesses,
          improvements: analysisResult.improvements,
          scores: analysisResult.detailedScores,
          transcript: transcript,
        })
        .eq("id", sessionId)
        .eq("user_id", userId);

      if (updateError) {
        console.error("Error updating session:", updateError);
      }
    } else {
      // Create new session
      const { error: insertError } = await supabase.from("interview_sessions").insert({
        user_id: userId,
        interviewer_name: interviewer || "Unknown",
        interview_type: interviewType || "General",
        overall_score: analysisResult.overallScore,
        analysis_results: analysisResult,
        strengths: analysisResult.strengths,
        weaknesses: analysisResult.weaknesses,
        improvements: analysisResult.improvements,
        scores: analysisResult.detailedScores,
        transcript: transcript,
        job_posting: jobPosting || null,
      });

      if (insertError) {
        console.error("Error inserting session:", insertError);
      }
    }

    console.log("Analysis completed successfully with score:", analysisResult.overallScore);

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-interview function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        overallScore: 25,
        overallFeedback:
          "Interview analysis failed. This indicates significant issues with the interview process or responses.",
        detailedScores: {
          communication: 25,
          confidence: 20,
          salesSkills: 20,
          interviewMechanics: 25,
        },
        strengths: [
          {
            skill: "Basic Participation",
            category: "engagement",
            evidence: "Attempted to complete interview",
            score: 30,
          },
        ],
        weaknesses: [
          {
            skill: "Technical Issues",
            category: "system",
            issue: "Interview could not be properly analyzed",
            improvementActions: ["Ensure stable internet connection", "Speak clearly", "Complete full interview"],
            score: 25,
          },
        ],
        improvements: [
          "Complete the full interview without technical issues",
          "Prepare thoroughly before starting your next interview",
          "Practice speaking clearly and professionally",
        ],
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
