import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, jobPosting, interviewType, questionContext } = await req.json();

    const systemPrompt = `You are an AI interviewer conducting a ${interviewType} interview. 
    
    ${jobPosting ? `Job Context: The candidate is interviewing for: ${jobPosting.title} at ${jobPosting.company}. 
    Job Description: ${jobPosting.description}` : ''}
    
    Interview Guidelines:
    - Ask one question at a time and wait for the candidate's response
    - Follow up naturally based on their answers
    - Be professional but conversational
    - Focus on behavioral and situational questions
    - Evaluate communication skills, experience, and fit
    - ${questionContext ? `Current question context: ${questionContext}` : ''}
    
    Keep responses concise and conversational, as if speaking in real-time.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in AI interviewer:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});