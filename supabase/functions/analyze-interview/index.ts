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

    // Interview type-specific evaluation criteria
    const getTypeSpecificCriteria = (type: string) => {
      switch(type) {
        case 'Initial Screen':
          return {
            focus: 'Background Articulation, Company Research, Role Understanding, Career Motivation, Cultural Alignment, Professional Communication, Self-Awareness',
            strengths: `
- Background Articulation: Clear professional journey and transition reasoning (+10-15)
- Company Research: Deep knowledge of company, products, market position (+10-15)
- Role Understanding: Comprehension of SDR/BDR responsibilities (+5-10)
- Career Motivation: Clear, compelling reasons for role/transition (+10-15)
- Cultural Alignment: Demonstrated fit with company values (+5-10)
- Professional Communication: Polished delivery without excessive fillers (+5-10)
- Self-Awareness: Honest assessment of strengths/weaknesses/learning needs (+5-10)`,
            weaknesses: `
- Vague Career Goals: Unclear direction or poorly articulated story (-10 to -20)
- Poor Company Knowledge: Insufficient research or generic understanding (-10 to -15)
- Weak Motivation: Unconvincing reasons for role/company choice (-10 to -15)
- Unprofessional Communication: Casual language, poor structure (-15 to -30)
- Limited Technical Aptitude: Concerns about learning technical products (-5 to -10)
- Unrealistic Expectations: Misunderstanding of role demands (-5 to -10)`
          };
        case 'Hiring Manager':
          return {
            focus: 'Qualification Technique, Objection Handling, Strategic Planning, Prospecting Methodology, Active Listening, Metrics Orientation, Adaptability, Collaboration',
            strengths: `
- Qualification Technique: Effective methods for determining prospect fit (+10-15)
- Objection Handling: Graceful, confident responses to pushback (+10-15)
- Strategic Planning: Thoughtful 30/60/90 day plans and goal-setting (+10-15)
- Prospecting Methodology: Structured approach to outreach and research (+5-10)
- Active Listening: Consultative vs. pushy approach demonstrated (+5-10)
- Metrics Orientation: Understanding KPIs and data usage (+5-10)
- Adaptability: Flexibility when strategies aren't working (+5-10)
- Collaboration Skills: Working with teams and cross-functional partners (+5-10)`,
            weaknesses: `
- Poor Qualification: Can't determine fit or ask discovery questions (-15 to -25)
- Weak Objection Responses: Defensive, avoiding tough questions, giving up (-10 to -20)
- Lack of Strategy: No clear plan or prioritization understanding (-10 to -20)
- Limited Sales Acumen: Unfamiliar with methodologies, frameworks, best practices (-10 to -15)
- Talking vs. Listening: Overly focused on pitching vs. understanding needs (-10 to -15)
- No Data Orientation: Failure to use metrics or track performance (-5 to -10)
- Rigid Approach: Can't adapt when strategy isn't working (-5 to -10)`
          };
        case 'Technical/Role-Play':
          return {
            focus: 'Cold Call Execution, Objection Management, Personalization, Product Knowledge, Qualifying Questions, Email/LinkedIn Craft, Discovery Structure, Competitive Positioning',
            strengths: `
- Cold Call Execution: Confident opening, clear value prop, effective questioning (+15-20)
- Objection Management: Handling "not interested" or competitor mentions smoothly (+10-15)
- Personalization: Tailoring outreach based on prospect research (+10-15)
- Product Knowledge: Explaining solutions clearly to different audiences (+10-15)
- Qualifying Questions: Strategic questions to uncover fit and timing (+10-15)
- Email/LinkedIn Craft: Compelling, personalized messages (+5-10)
- Discovery Structure: Logical flow to uncover needs (+10-15)
- Competitive Positioning: Differentiating against alternatives (+5-10)`,
            weaknesses: `
- Poor Call Execution: Weak opening, no value prop, talking too much (-15 to -25)
- Objection Avoidance: Failing to address concerns or backing down (-10 to -20)
- Generic Outreach: Templated messages without personalization (-10 to -15)
- Limited Product Understanding: Can't explain solutions or match to pain points (-15 to -25)
- Weak Qualifying: Not asking about budget, timeline, decision process (-10 to -20)
- Poor Email Skills: Boring subject lines, no clear CTA, grammar issues (-5 to -15)
- Disorganized Discovery: Jumping topics, missing key qualification areas (-10 to -15)
- Can't Handle Pressure: Freezing up during roleplay or live scenarios (-10 to -20)`
          };
        case 'Executive Interview':
          return {
            focus: 'Industry Knowledge, Strategic Thinking, Business Acumen, Leadership Potential, Executive Communication, Company Alignment, Growth Mindset, Multi-Level Selling',
            strengths: `
- Industry Knowledge: Understanding market trends, competitive landscape, challenges (+15-20)
- Strategic Thinking: Connecting business problems to solutions at high level (+15-20)
- Business Acumen: Speaking to ROI, economic buyers, decision-making processes (+15-20)
- Leadership Potential: Demonstrating initiative, mentorship, team contribution (+10-15)
- Executive Communication: Confident, concise delivery for C-level (+10-15)
- Company Alignment: Personal goals align with company objectives (+5-10)
- Growth Mindset: Commitment to continuous learning and development (+5-10)
- Multi-Level Selling: Adapting approach for different stakeholders (+10-15)`,
            weaknesses: `
- Shallow Industry Knowledge: Surface-level understanding without depth (-15 to -25)
- Tactical Focus Only: Can't think strategically or connect to business outcomes (-15 to -25)
- Poor Business Acumen: Not understanding ROI, budgets, decision processes (-15 to -20)
- Individual Contributor Mindset: No interest in team success or knowledge sharing (-10 to -15)
- Weak Executive Presence: Overly casual or unable to engage at C-level (-10 to -20)
- Short-Term Thinking: Only immediate goals without long-term vision (-10 to -15)
- Resistance to Feedback: Defensive about development areas or coaching (-10 to -15)
- Single-Threaded Approach: Only targeting one person vs. navigating buying committees (-5 to -10)`
          };
        default:
          return {
            focus: 'Overall professional interview performance',
            strengths: `
- Quantified business results and specific metrics (+10-20)
- Specific, detailed examples with context (+5-15)
- Strategic business thinking and industry insights (+5-15)
- Advanced preparation/research evident (+5-10)
- Sophisticated, professional communication (+5-10)
- Problem-solving approach with clear methodology (+5-10)`,
            weaknesses: `
- Vague/generic responses without specifics (-5 to -15)
- Poor preparation or no research (-5 to -15)
- Inability to provide concrete examples (-10 to -20)
- Evasive or incomplete answers (-5 to -15)`
          };
      }
    };

    const criteria = getTypeSpecificCriteria(interviewType);

    // Updated scoring system with 1-100 scale and type-specific evaluation
    const systemPrompt = `You are an experienced interview analyst with expertise in evaluating sales and professional interview performance.

INTERVIEW TYPE: ${interviewType}

CRITICAL: Evaluate this ${interviewType} interview based ONLY on type-specific competencies relevant to this stage. Do not evaluate competencies that belong to other interview types.

TYPE-SPECIFIC EVALUATION FOCUS:
${criteria.focus}

SCORING SYSTEM (1-100 SCALE):
Start with base score of 50 for completing interview professionally.

TYPE-SPECIFIC STRENGTHS TO EVALUATE:
${criteria.strengths}

TYPE-SPECIFIC WEAKNESSES TO LOOK FOR:
${criteria.weaknesses}

UNIVERSAL DEDUCTIONS (Apply to all types):
- Unprofessional language (idk, bruh, whatever, etc): -20 to -40
- Excessive filler words (um, uh, like): -2 to -5 per instance (minor penalty, max -15 total)

SCORING RANGES:
- 1-20: Unprofessional, unprepared, nonsensical
- 21-40: Poor performance, major gaps
- 41-60: Adequate but unremarkable
- 61-70: Good performance with solid fundamentals
- 71-80: Strong performance with quantified results and strategic thinking
- 81-90: Excellent with sophisticated insights
- 91-100: Exceptional (rare)

CRITICAL: Base the score on ACTUAL CONTENT demonstrated in the transcript. If the candidate provides strong evidence of the type-specific competencies above, they should score in the 70-85 range. Normal filler words (um, uh, like) are common in spoken interviews and should only result in minor deductions (-2 to -5 points total), not failing scores.

When identifying strengths and weaknesses in your response, ONLY reference competencies relevant to ${interviewType}. For example:
- Initial Screen should NOT evaluate "objection handling" or "cold call execution"
- Technical/Role-Play should NOT evaluate "strategic vision" or "career motivation"
- Executive Interview should NOT focus on "email craft" or "call opening"

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

    console.log("🔑 Calling Claude API with key:", anthropicApiKey ? `${anthropicApiKey.substring(0, 10)}...` : "MISSING");
    
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": anthropicApiKey!,
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

    console.log("📡 Claude API response status:", response.status);
    const data = await response.json();
    console.log("📦 Claude response structure:", { 
      hasContent: !!data.content?.[0]?.text,
      isError: !!data.error,
      errorType: data.error?.type,
      errorMessage: data.error?.message 
    });

    let analysisResult: any;
    
    // Check for API errors first
    if (data.error) {
      console.error("❌ Claude API error:", data.error);
      throw new Error(`Claude API error: ${data.error.type} - ${data.error.message}`);
    }
    
    try {
      if (!data.content || !data.content[0] || !data.content[0].text) {
        console.error("❌ No content in Claude response:", JSON.stringify(data));
        throw new Error("No content in API response");
      }

      const content = data.content[0].text;
      console.log("✅ Received content from Claude, length:", content.length);
      console.log("📄 First 500 chars:", content.substring(0, 500));

      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error("❌ No JSON found in response. Full content:", content);
        throw new Error("No JSON found in response");
      }
      
      console.log("🔍 Attempting to parse JSON...");
      analysisResult = JSON.parse(jsonMatch[0]);
      console.log("✅ Successfully parsed analysis:", {
        score: analysisResult.overallScore,
        hasStrengths: !!analysisResult.strengths?.length,
        hasWeaknesses: !!analysisResult.weaknesses?.length
      });


      // Enforce maximum score based on quality check (only for serious issues)
      if (analysisResult.overallScore > maxAllowedScore) {
        console.log(
          `⚠️ Enforcing max score due to quality issues: ${analysisResult.overallScore} -> ${maxAllowedScore}`,
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
          `⚠️ Applying filler word penalty: ${analysisResult.overallScore} -> ${penalizedScore} (${fillerMatches.length} fillers, -${fillerPenalty} points)`,
        );
        analysisResult.overallScore = penalizedScore;
      }
    } catch (parseError) {
      console.error("❌ Failed to parse AI response:", parseError);
      console.error("❌ Parse error details:", parseError instanceof Error ? parseError.message : String(parseError));
      
      // Fallback scoring based on transcript quality - ONLY used when API/parsing completely fails
      console.log("⚠️ Using fallback analysis due to parsing failure");
      const fallbackScore = !hasSubstantialContent ? 25 : Math.min(maxAllowedScore, 50);
      analysisResult = {
        overallScore: fallbackScore,
        overallFeedback: hasSubstantialContent
          ? "Analysis could not be completed properly due to API issues. Based on transcript quality, performance appears to need improvement."
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
