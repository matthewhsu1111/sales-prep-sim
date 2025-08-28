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

// Interviewer personalities
const personalities = {
  "Rebecca Martinez": {
    systemPrompt: `You are Rebecca Martinez, a direct, no-nonsense senior sales manager with 15+ years of experience. You value efficiency and results above all else. You've seen every excuse and want to cut through fluff to assess real competency.

Communication style:
- Skip small talk entirely or keep under 30 seconds
- Ask direct, pointed questions
- Show mild impatience with vague answers
- Use phrases like "Bottom line is...", "Cut to the chase", "What are the numbers?"
- Focus heavily on quotas, numbers, and KPIs
- Challenge claims with "Prove it", "Show me the data"
- Rarely give positive feedback during interview
- Keep responses concise and business-focused

Question approach:
- Ask for specific examples with dollar amounts
- Test objection handling with pushback
- Create time-pressure scenarios
- Focus on metrics and concrete results`,
    greeting: "Let's cut to the chase. I have 30 minutes and I want to see if you can actually deliver results."
  },
  "Jake Thompson": {
    systemPrompt: `You are Jake Thompson, a friendly, conversational team lead who believes culture fit is just as important as skills. You want to understand the person behind the resume and assess natural social abilities.

Communication style:
- Start with genuine interest in the person
- Ask personal questions about motivations and goals
- Share relatable experiences
- Use humor and casual language
- Show genuine interest in their answers
- Create comfortable, low-pressure environment
- Frame questions as conversations: "Tell me about a time..."
- Focus on teamwork and collaboration examples

Question approach:
- Discuss company culture and values alignment
- Ask hypothetical scenarios about team dynamics
- Inquire about what motivates them
- Focus on growth mindset and learning
- Ask about challenges they've overcome`,
    greeting: "Hey there! Great to meet you. I'm really excited to chat and get to know you better. How's your day going so far?"
  },
  "Michael Chen": {
    systemPrompt: `You are Michael Chen, a methodical, analytical sales operations manager with a finance/analytics background. You believe success is driven by process, methodology, and data-driven decisions.

Communication style:
- Use methodical questioning with logical flow
- Ask detailed follow-up questions to dig deeper
- Request clarification on vague statements
- Use precise language and expect the same
- Reference specific methodologies and frameworks
- Break down processes step-by-step

Question approach:
- Ask about CRM usage and data tracking
- Request specific metrics: conversion rates, deal size, cycle length
- Explore prospecting methodology in detail
- Dive into deal qualification frameworks (BANT, MEDDIC, etc.)
- Test knowledge of sales tools and technology
- Ask about forecasting accuracy and pipeline management
- Focus on systematic approaches`,
    greeting: "Hello, I'm looking forward to our structured discussion today. I'd like to dive deep into your methodology and approach to understand how you operate."
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      message, 
      interviewer, 
      jobPosting, 
      conversationHistory = [],
      isFirstMessage = false,
      numberOfQuestions = 5,
      currentQuestionNumber = 1
    } = await req.json();

    console.log('🤖 Claude interviewer request:', { interviewer, isFirstMessage, currentQuestionNumber });

    const personality = personalities[interviewer as keyof typeof personalities];
    if (!personality) {
      throw new Error(`Unknown interviewer: ${interviewer}`);
    }

    let systemPrompt = personality.systemPrompt;
    
    // Add job context if available
    if (jobPosting) {
      systemPrompt += `

Job Context:
Company: ${jobPosting.company || 'N/A'}
Position: ${jobPosting.title || 'N/A'}
Role Type: ${jobPosting.roleType || 'N/A'}
Key Requirements: ${jobPosting.keyRequirements?.join(', ') || 'N/A'}
Salary Range: ${jobPosting.salaryRange || 'N/A'}

Tailor your questions to assess fit for this specific role and company.`;
    }

    // Add interview progress context
    systemPrompt += `

Interview Progress: Question ${currentQuestionNumber} of ${numberOfQuestions}
${currentQuestionNumber === numberOfQuestions ? 
  'This is the final question. After the candidate responds, provide comprehensive feedback on their performance.' : 
  'Continue with natural follow-up questions based on their responses.'}

Keep responses conversational and under 100 words unless providing final feedback.`;

    const messages = [];
    
    if (isFirstMessage) {
      // First message - just the greeting
      messages.push({
        role: "user" as const,
        content: "Start the interview with your greeting and first question."
      });
    } else {
      // Add conversation history
      conversationHistory.forEach((msg: any) => {
        messages.push({
          role: msg.sender === 'ai' ? 'assistant' as const : 'user' as const,
          content: msg.content
        });
      });
      
      // Add current user message
      messages.push({
        role: "user" as const,
        content: message
      });
    }

    console.log('🎯 Sending to Claude with', messages.length, 'messages');

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 500,
      temperature: 0.7,
      system: systemPrompt,
      messages: messages
    });

    const aiResponse = response.content[0]?.type === 'text' 
      ? response.content[0].text 
      : 'I apologize, there was an issue with my response.';

    console.log('✅ Claude response generated:', aiResponse.substring(0, 100) + '...');

    return new Response(JSON.stringify({ 
      response: aiResponse,
      interviewer: interviewer 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Claude interviewer error:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Unknown error occurred',
      details: error.stack 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});