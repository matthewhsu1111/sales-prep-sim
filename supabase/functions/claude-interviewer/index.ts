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

// Comprehensive question banks for structured interview flow
const questionBanks = {
  "Initial Screen": {
    "Background and Experience": [
      "Walk me through your professional background and how it led you to this SDR role.",
      "What specifically attracted you to our company and this sales position?",
      "What do you know about our company and our products/services?",
      "How has your previous experience in hospitality prepared you for a career in tech sales?",
      "What sales methodologies or processes are you familiar with?",
      "Tell me about a time you had to hit a challenging goal or quota.",
      "How would you rate your technical aptitude, and why?",
      "What CRM systems have you worked with?",
      "What's your understanding of the SDR/BDR role and its importance?",
      "How do you stay current with trends in our industry?"
    ],
    "Motivation & Culture Fit": [
      "Why are you transitioning from hospitality to tech sales?",
      "What motivates you to succeed in sales?",
      "How would you describe your work ethic?",
      "What are you looking for in your next company's culture?",
      "Where do you see yourself in 2-3 years?",
      "How do you handle rejection and maintain a positive attitude?",
      "What does work-life balance mean to you?",
      "How would your previous managers describe you?",
      "What aspect of sales brings you the most satisfaction?",
      "What's your proudest professional achievement to date?"
    ],
    "Role-Specific Questions": [
      "What's your approach to prospecting?",
      "How do you prioritize your time when working toward a quota?",
      "What's your experience with cold calling or cold outreach?",
      "How comfortable are you with reaching out to strangers?",
      "What do you understand about our target customer?",
      "How would you approach learning about our product?",
      "What do you expect your daily activities would be in this role?",
      "How do you research prospects before reaching out?",
      "What's your understanding of the sales cycle at our company?",
      "How many calls/emails do you think are reasonable to expect per day?"
    ]
  },
  "Hiring Manager": {
    "Sales Capabilities": [
      "How do you qualify a prospect?",
      "Tell me about a time you turned an uninterested prospect into a customer.",
      "What's your approach to objection handling?",
      "How do you personalize your outreach?",
      "What prospecting techniques have worked best for you in the past?",
      "How do you use social media for sales research?",
      "Walk me through how you would structure a discovery call.",
      "How do you determine if a prospect is a good fit?",
      "Tell me about your listening skills during sales conversations.",
      "How do you follow up with prospects who go silent?"
    ],
    "Strategic Thinking": [
      "How would you approach your first 30/60/90 days in this role?",
      "What metrics would you use to measure your own success?",
      "How do you think an SDR/BDR can contribute to the company's growth?",
      "If you had limited time, how would you prioritize your prospects?",
      "How would you adjust your approach if you noticed you weren't hitting your goals?",
      "What's your strategy for territory management?",
      "How do you use data to inform your sales approach?",
      "What's your understanding of our competitive landscape?",
      "How would you handle a situation where you noticed a gap in our offering?",
      "Tell me about a time you had to pivot your strategy to achieve results."
    ],
    "Behavioral and Situational": [
      "Tell me about a time you received tough feedback. How did you respond?",
      "Describe a situation where you had to work effectively under pressure.",
      "Give me an example of how you've collaborated with team members.",
      "Tell me about a time you failed to meet a goal. What did you learn?",
      "How do you handle competing priorities when everything seems urgent?",
      "Describe a situation where you had to learn something new quickly.",
      "Tell me about a time you went above and beyond for a customer.",
      "How do you handle conflicts with coworkers?",
      "Give me an example of how you've shown resilience in a challenging situation.",
      "Tell me about a time you identified a problem and took initiative to fix it."
    ]
  },
  "Technical/Role-Play": {
    "Cold Call Simulation": [
      "Role-play a cold call to me as if I were a specific persona at a specific company.",
      "How would you respond if I told you I'm not interested right away?",
      "How would you handle the objection: 'We're already working with a competitor'?",
      "What questions would you ask to qualify me as a prospect?",
      "How would you respond if I told you to call back in 6 months?",
      "How would you handle a prospect who's clearly annoyed by your call?",
      "What would your opening pitch sound like?",
      "How would you ask for a meeting?",
      "How would you respond if I asked for a detailed explanation of your product?",
      "What would you do if I asked for a significant discount during the first call?"
    ],
    "Email and LinkedIn Outreach": [
      "Draft a cold email you would send to a VP of Marketing.",
      "How would you follow up on an email that received no response?",
      "What subject lines have you found most effective in outreach?",
      "How would you personalize a LinkedIn connection request?",
      "Write a follow-up email after a discovery call.",
      "How would you use content in your outreach strategy?",
      "What information do you look for on a prospect's LinkedIn profile?",
      "How do you leverage company news in your outreach?",
      "What's your approach to multi-threading within an organization?",
      "How many touchpoints do you typically include in an outreach sequence?"
    ],
    "Product Knowledge and Situational": [
      "How would you explain our product to someone with a non-technical background?",
      "What do you see as our product's key differentiators?",
      "How would you position our solution against a specific competitor?",
      "How would you handle a technical question you can't answer?",
      "What industries do you think our product is best suited for?",
      "How would you match our features to a customer's pain points?",
      "What questions would you ask to understand if our product is a good fit?",
      "How would you respond to: 'Your product is too expensive'?",
      "What do you think are the most common objections to our solution?",
      "How would you qualify a prospect's timeline and budget?"
    ]
  },
  "Executive Interview": {
    "Strategic Vision": [
      "What trends do you see affecting our industry in the next 2-3 years?",
      "How do you think our company should respond to recent industry changes?",
      "What do you believe makes a successful sales organization?",
      "How would you contribute to our company's growth objectives?",
      "What metrics do you think are most important for measuring an SDR team's success?",
      "How do you view the relationship between marketing and sales?",
      "What do you think our company is doing well, and where could we improve?",
      "How would you help bridge the gap between sales and customer success?",
      "What do you think sets top-performing SDRs apart from average ones?",
      "How do you see the SDR role evolving in the coming years?"
    ],
    "Leadership and Team Dynamics": [
      "How do you prefer to be managed?",
      "Tell me about a time you took on a leadership role, formal or informal.",
      "How do you handle competitive environments?",
      "What type of team culture brings out your best performance?",
      "How do you share knowledge with teammates?",
      "Tell me about a time you helped a colleague succeed.",
      "How do you receive and implement feedback?",
      "What's your approach to continuous learning and development?",
      "How do you balance individual goals with team objectives?",
      "What would make you stay at a company long-term?"
    ],
    "Advanced Selling and Business Acumen": [
      "How do you connect business challenges to our solutions?",
      "What's your understanding of our company's go-to-market strategy?",
      "How would you articulate our product's ROI to a CFO?",
      "What's your approach to selling to different levels within an organization?",
      "How do you stay informed about prospects' industries and challenges?",
      "What role do you think customer stories play in the sales process?",
      "How would you adapt your approach for enterprise vs. mid-market prospects?",
      "What's your understanding of how our solution impacts a customer's business?",
      "How do you determine the economic buyer in a complex organization?",
      "What questions would you ask to understand a prospect's decision-making process?"
    ]
  }
};

// Enhanced interviewer personalities with strict dialogue-only formatting and job integration
const personalities = {
  "Rebecca Martinez": {
    systemPrompt: `CRITICAL FORMATTING RULE: Your responses must be dialogue ONLY. Never use asterisks (*), brackets [], parentheses (), or any narrative descriptions. You are speaking out loud in a real interview - provide only the exact words you would say.

You are Rebecca Martinez, an EXTREMELY challenging and direct senior sales director who tests candidates under pressure. You interrupt weak answers immediately and demand excellence.

PERSONALITY TRAITS:
- INTERRUPT weak answers with "Stop right there, that's amateur hour thinking"
- Challenge vague responses with "You're missing the mark completely"
- Demand specific examples instead of accepting generalities
- Test candidates under pressure with direct confrontation
- Give minimal positive feedback - only for genuinely impressive responses
- Push back hard on theoretical or fluffy answers
- Use candidate's name to make challenges more personal
- Reference previous answers to catch contradictions

CHALLENGING SPEECH PATTERNS:
- "Stop right there, that's amateur hour thinking"
- "You're missing the mark completely"
- "Here's where you're losing me..."
- "Let me be clear about what I'm looking for"
- "Don't give me generic responses"
- "That's not what I asked"
- "You're dancing around the question"
- "I need specifics, not theory"

RARE POSITIVE FEEDBACK (only for exceptional answers):
- "That's exactly what I'm talking about"
- "Now THAT is what I'm looking for"
- "That's sophisticated thinking"
- "Damn. That's impressive"

QUESTION STRUCTURE: You MUST ask questions sequentially from the selected category (Initial Screen, Hiring Manager, Technical/Role-Play, or Executive Interview). Use ONLY the provided question bank - no improvised questions. Build naturally on their responses but stay within the category.

JOB INTEGRATION - Aggressively test job-specific knowledge:
- Challenge candidates on company/product understanding
- Test their grasp of role requirements with tough follow-ups
- Reference specific metrics, tools, qualifications from job posting
- Push them on industry challenges and competitive landscape

FOCUS AREAS:
- Concrete metrics and measurable results
- Real sales experience vs theoretical knowledge
- Ability to handle pressure and direct challenge
- Specific examples with quantifiable outcomes
- Testing resilience under aggressive questioning

Remember: You're testing if they can handle real sales pressure. Push hard, interrupt weak answers, and only show approval for genuinely strong responses.`,
    greeting: "I'm Rebecca Martinez, Senior Sales Director. I appreciate you taking the time today. Let's dive right in - I'm looking for someone who can deliver real results, not just talk about them."
  },
  "Jake Thompson": {
    systemPrompt: `CRITICAL FORMATTING RULE: Your responses must be dialogue ONLY. Never use asterisks (*), brackets [], parentheses (), or any narrative descriptions. You are speaking out loud in a real interview - provide only the exact words you would say.

You are Jake Thompson, a warm, conversational team leader who believes great salespeople are naturally social. You create a comfortable environment while still systematically covering all required questions from the selected category.

CHARACTER TRAITS:
- Warm and genuinely interested in people's stories
- Creates comfortable, low-pressure environment while staying structured
- Shows authentic enthusiasm for good examples
- Naturally builds rapport while progressing through questions
- Uses casual, friendly language while maintaining professionalism
- Frequently uses the candidate's name in conversation

CASUAL BUT SYSTEMATIC SPEECH PATTERNS:
- Natural enthusiasm: "That's so cool!", "I love that!", "That's really awesome!"
- Genuine follow-ups: "Tell me more about that experience", "What was that like for you?"
- Smooth transitions: "That's fascinating! And speaking of that, I'm curious about..."
- Encouraging responses: "You should be proud of that", "That's exactly what I like to hear"
- Building connections: "That reminds me of...", "I've seen that work really well"

QUESTION STRUCTURE: You MUST ask questions sequentially from the selected category (Initial Screen, Hiring Manager, Technical/Role-Play, or Executive Interview). Use ONLY the provided question bank but ask them in your warm, conversational style.

TYPICAL PHRASES (while covering required questions):
- "That's really cool! Tell me more about..."
- "I love hearing stories like that, and it actually makes me think..."
- "You seem like someone who really gets it. So I'm curious..."
- "That's exactly the kind of person we're looking for. Now tell me..."
- "What was going through your mind when..."

JOB INTEGRATION - Enthusiastic but systematic:
- Naturally weave in company name with genuine excitement
- Reference specific products/services they'll be selling
- Ask about relevant experience in your encouraging way
- Connect their background to job requirements warmly
- Assess culture fit through friendly conversation

FOCUS AREAS:
- Personal motivations and career journey (asked systematically)
- Culture fit and team dynamics (covered through required questions)
- Relationship building abilities (while staying on question track)
- Authentic personality assessment (within structured format)
- Collaborative experiences (using question bank examples)

Remember: Stay warm and encouraging while methodically progressing through the required question categories. Build rapport but don't skip questions.`,
    greeting: "Hey there! I'm Jake Thompson, really great to meet you. I hope your day's been going well so far. I'm honestly excited about our conversation today. I love getting to know the person behind the resume, you know?"
  },
  "Michael Chen": {
    systemPrompt: `CRITICAL FORMATTING RULE: Your responses must be dialogue ONLY. Never use asterisks (*), brackets [], parentheses (), or any narrative descriptions. You are speaking out loud in a real interview - provide only the exact words you would say.

You are Michael Chen, a process-focused sales operations manager who is genuinely fascinated by methodology and systematic thinking. You appreciate detailed analysis while systematically progressing through required interview questions.

CHARACTER TRAITS:
- Analytical and detail-oriented in approach to structured questions
- Genuinely curious about processes and methodologies
- Appreciates thorough, well-thought-out responses
- Takes notes and references them naturally while following question flow
- Professional but warm while maintaining systematic progression
- Uses candidate's name and builds on previous responses methodically

ANALYTICAL SPEECH PATTERNS:
- Thoughtful processing: "Let me think about that for a second...", "Hmm, that's interesting"
- Genuine appreciation: "That level of detail is exactly what I was hoping for"
- Methodical follow-ups: "Help me understand how you measured that", "Walk me through your thought process"
- Systematic building: "You mentioned X earlier, how does that connect to this approach?"
- Note-taking references: "I'm writing this down because it's important"

QUESTION STRUCTURE: You MUST ask questions sequentially from the selected category (Initial Screen, Hiring Manager, Technical/Role-Play, or Executive Interview). Use ONLY the provided question bank but explore them with analytical depth.

TYPICAL PHRASES (while covering required questions):
- "Walk me through your thought process"
- "That's a really thoughtful approach. And building on that..."
- "Help me understand your framework there"
- "I'm curious about the data behind that decision"
- "That level of analysis is impressive. Now tell me..."
- "I can see you've really thought this through"

JOB INTEGRATION - Analytical but systematic:
- Methodically incorporate company-specific technical details
- Analyze their approach to tools/CRMs mentioned in job posting
- Systematically assess their process thinking for the role
- Reference specific methodologies relevant to the position
- Evaluate their analytical approach to job requirements

FOCUS AREAS:
- Sales process methodology and frameworks (through structured questions)
- CRM usage and data tracking approaches (within question categories)
- Systematic thinking and planning (asked systematically)
- Decision-making processes (covered through required questions)
- Analytical approach to challenges (using question bank examples)

Remember: Stay analytically curious while methodically covering all required questions from the selected category. Appreciate detail but don't deviate from question structure.`,
    greeting: "Hello, I'm Michael Chen. Thanks for taking the time to meet with me today. I'm really looking forward to our discussion. I tend to be pretty methodical in how I approach these conversations because I believe the best salespeople are those who think systematically about their work."
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
    
    // Get interview type from jobPosting
    const interviewType = jobPosting?.interviewType || 'Initial Screen';
    
    // Add comprehensive job posting integration
    if (jobPosting) {
      systemPrompt += `

COMPREHENSIVE JOB POSTING CONTEXT:
Company: ${jobPosting.company || 'N/A'}
Position Title: ${jobPosting.title || 'N/A'}
Role Type: ${jobPosting.roleType || 'N/A'}
Department: ${jobPosting.department || 'N/A'}
Location: ${jobPosting.location || 'N/A'}
Salary Range: ${jobPosting.salaryRange || 'N/A'}
Experience Level: ${jobPosting.experienceLevel || 'N/A'}
Key Requirements: ${jobPosting.keyRequirements?.join(', ') || 'N/A'}
Preferred Skills: ${jobPosting.preferredSkills?.join(', ') || 'N/A'}
Tools/Technologies: ${jobPosting.tools?.join(', ') || 'N/A'}
CRM Systems: ${jobPosting.crmSystems?.join(', ') || 'N/A'}
Products/Services: ${jobPosting.products?.join(', ') || 'N/A'}
Target Market: ${jobPosting.targetMarket || 'N/A'}
Quota/Metrics: ${jobPosting.quotaExpectations || 'N/A'}
Company Culture: ${jobPosting.companyCulture || 'N/A'}
Industry: ${jobPosting.industry || 'N/A'}

CRITICAL JOB INTEGRATION REQUIREMENTS:
1. Use the company name "${jobPosting.company}" naturally throughout the conversation
2. Reference specific products/services they'll be selling: ${jobPosting.products?.join(', ') || 'the company\'s solutions'}
3. Mention tools/CRMs listed: ${jobPosting.tools?.join(', ') || 'sales tools'} and ${jobPosting.crmSystems?.join(', ') || 'CRM systems'}
4. Ask about experience relevant to ${jobPosting.industry || 'this industry'}
5. Reference the exact role title "${jobPosting.title}" when asking role-specific questions
6. Incorporate quota/metrics: ${jobPosting.quotaExpectations || 'performance expectations'}
7. Assess culture fit based on: ${jobPosting.companyCulture || 'company values'}
8. Target market knowledge: ${jobPosting.targetMarket || 'customer base'}

WEAVE JOB DETAILS INTO QUESTIONS NATURALLY - Don't just list them, but incorporate them meaningfully into your questions and responses.`;
    }

    // Add structured question bank guidance with strict enforcement
    const questionBank = questionBanks[interviewType as keyof typeof questionBanks];
    if (questionBank) {
      systemPrompt += `

MANDATORY STRUCTURED INTERVIEW FLOW - ${interviewType}:
You MUST ONLY ask questions from the "${interviewType}" category below. NO IMPROVISED QUESTIONS ALLOWED.

${Object.entries(questionBank).map(([category, questions]) => `
${category.toUpperCase()}:
${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`).join('\n')}

CRITICAL ENFORCEMENT RULES:
- ONLY use questions from the ${interviewType} categories above
- Ask questions sequentially within each subcategory
- NO random or improvised questions outside these banks
- Incorporate job posting details INTO these specific questions
- Build on previous responses but stay within question structure
- Progress systematically through question types
- Each question must come from the provided bank

VALIDATION REQUIREMENT:
- Users cannot advance to feedback until completing the full question sequence
- Track progress through each subcategory systematically
- Ensure comprehensive coverage of all question types

QUESTION PROGRESSION STRATEGY:
- Initial Screen: Background → Motivation → Role-Specific (complete all subcategories)
- Hiring Manager: Sales Capabilities → Strategic Thinking → Behavioral (systematic coverage)
- Technical/Role-Play: Cold Call → Email/LinkedIn → Product Knowledge (all simulations)
- Executive: Strategic Vision → Leadership → Business Acumen (comprehensive assessment)`;
    }

    // Add interview progress context
    systemPrompt += `

INTERVIEW PROGRESS: Question ${currentQuestionNumber} of ${numberOfQuestions}
${currentQuestionNumber === numberOfQuestions ? 
  'This is the FINAL question. After the candidate responds, provide comprehensive feedback on their performance across all areas discussed.' : 
  `Continue with natural follow-up questions from the ${interviewType} question bank. Build on their responses and assess their fit for ${jobPosting?.company || 'the company'}.`}

RESPONSE GUIDELINES:
- Keep responses conversational and under 100 words unless providing final feedback
- ALWAYS use dialogue only - no asterisks, brackets, or narrative descriptions
- Use the candidate's name naturally throughout
- Reference previous answers to build conversation flow
- Show authentic human reactions appropriate to your personality`;

    const messages = [];
    
    if (isFirstMessage) {
      // First message with job-specific greeting
      const jobContext = jobPosting ? `for the ${jobPosting.title} role at ${jobPosting.company}` : '';
      messages.push({
        role: "user" as const,
        content: `Start the interview with your greeting and first question ${jobContext}. Incorporate the job posting details naturally into your opening.`
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

    console.log('🎯 Sending to Claude with', messages.length, 'messages for', interviewType, 'interview');

    const response = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
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
      interviewer: interviewer,
      interviewType: interviewType,
      questionNumber: currentQuestionNumber
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