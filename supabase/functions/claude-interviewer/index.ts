import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};



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

TECHNICAL/ROLE-PLAY CATEGORY - IMMEDIATE ROLE-PLAY MODE:
For Technical/Role-Play interviews, you MUST immediately switch to role-play mode. Do NOT ask background questions. Instead:
- First message: "I'm going to play a [prospect title] at [company from job posting]. You're cold calling me. Ready? [Ring ring] Hello?"
- Then respond AS THE PROSPECT with realistic objections, skepticism, and pushback
- Be difficult, busy, skeptical - like a real prospect would be
- Challenge their pitch, ask tough questions, give common objections
- Make them work for every response and test their sales skills in real-time

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
    greeting: "I'm Rebecca Martinez, Senior Sales Director. I appreciate you taking the time today. Let's dive right in - I'm looking for someone who can deliver real results, not just talk about them.",
    closingMessage: "That wraps up my questions. You've given me what I needed to assess your capabilities. You'll receive detailed feedback on your performance shortly. Thanks for your time."
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

TECHNICAL/ROLE-PLAY CATEGORY - IMMEDIATE ROLE-PLAY MODE:
For Technical/Role-Play interviews, you MUST immediately switch to role-play mode with your warm but challenging style:
- First message: "Alright! So I'm going to play a [prospect title] at [company from job posting]. This'll be fun - you get to cold call me! Ready? Here we go... [Ring ring] Hello, this is Jake speaking."
- Then respond AS THE PROSPECT but maintain your naturally friendly yet skeptical tone
- Be busy but not rude, give realistic objections with your conversational style
- Make them prove their value while staying true to your warm personality

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
    greeting: "Hey there! I'm Jake Thompson, really great to meet you. I hope your day's been going well so far. I'm honestly excited about our conversation today. I love getting to know the person behind the resume, you know?",
    closingMessage: "That's awesome! Well, that covers everything I wanted to discuss today. I really enjoyed getting to know you and hearing about your experience. You should get your feedback results soon. Thanks so much for taking the time!"
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

TECHNICAL/ROLE-PLAY CATEGORY - IMMEDIATE ROLE-PLAY MODE:
For Technical/Role-Play interviews, you MUST immediately switch to role-play mode with your analytical approach:
- First message: "Alright, let's run a simulation. I'm going to play a [prospect title] at [company from job posting]. I want to see your methodology in action. Ready? [Ring ring] Hello?"
- Then respond AS THE PROSPECT but maintain your analytical, process-focused personality
- Be methodical in your objections, ask detailed questions about their approach
- Test their process thinking with systematic pushback and detailed challenges

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
    greeting: "Hello, I'm Michael Chen, Sales Operations Manager. Thank you for your time today. I'm looking forward to understanding your approach to sales and how you think about the processes behind successful outcomes.",
    closingMessage: "That completes our structured interview process. I appreciate the thoughtful responses you've provided throughout our conversation. You'll receive a comprehensive analysis of your performance shortly. Thank you for your time today."
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { 
      message, 
      interviewer, 
      jobPosting, 
      conversationHistory = [], 
      isFirstMessage = false,
      numberOfQuestions = 10,
      currentQuestionNumber = 1,
      interviewType = "Initial Screen"
    } = await req.json();

    console.log(`🤖 Claude interviewer request: {
  interviewer: "${interviewer}",
  isFirstMessage: ${isFirstMessage},
  currentQuestionNumber: ${currentQuestionNumber},
  interviewType: "${interviewType}"
}
`);

    const selectedPersonality = personalities[interviewer as keyof typeof personalities];
    if (!selectedPersonality) {
      throw new Error(`Unknown interviewer: ${interviewer}`);
    }

    const isLastQuestion = currentQuestionNumber >= numberOfQuestions;
    const shouldProvideClosing = !isFirstMessage && isLastQuestion && message; // User just responded to final question

    console.log(`🎯 Interview status: isLastQuestion=${isLastQuestion}, shouldProvideClosing=${shouldProvideClosing}`);

    // Get relevant questions for the interview type
    const availableQuestions = questionBanks[interviewType as keyof typeof questionBanks];
    if (!availableQuestions) {
      throw new Error(`Unknown interview type: ${interviewType}`);
    }

    // Extract comprehensive job details for dynamic integration
    const companyName = jobPosting?.company_name || jobPosting?.company || "the company";
    const jobTitle = jobPosting?.job_title || jobPosting?.title || "this role";
    const productInfo = jobPosting?.description || "";
    const requirements = jobPosting?.requirements || "";
    const fullJobContent = `${productInfo} ${requirements}`;
    
    // Extract detailed job information
    const crmTools = extractCRMTools(fullJobContent);
    const industry = extractIndustry(fullJobContent);
    const targetCustomers = extractTargetCustomers(fullJobContent);
    const competitors = extractCompetitors(fullJobContent);
    const keyProducts = extractKeyProducts(fullJobContent);

    console.log(`🎯 Sending to Claude with ${conversationHistory.length + (message ? 1 : 0)} messages for ${interviewType} interview
`);

    // Special handling for Technical/Role-Play category
    const isRolePlayCategory = interviewType === "Technical/Role-Play";
    
    // Create comprehensive system prompt with enhanced job integration
    const systemPrompt = `${selectedPersonality.systemPrompt}

INTERVIEW CONTEXT:
- Interview Type: ${interviewType}
- Company: ${companyName}
- Role: ${jobTitle}
- Current Question: ${currentQuestionNumber}/${numberOfQuestions}
- Industry: ${industry}
- Target Customers: ${targetCustomers}
- Key Products/Services: ${keyProducts}
- CRM/Tools mentioned: ${crmTools}
- Competitors: ${competitors}

${shouldProvideClosing ? `
🚨 CRITICAL: FINAL MESSAGE INSTRUCTIONS 🚨
The interview is complete. The candidate just answered the final question. You MUST provide a closing statement now.

Your closing MUST be: "${selectedPersonality.closingMessage || 'Thank you for your time today. You will receive feedback on your interview performance shortly.'}"

DO NOT ask another question. DO NOT continue the interview. Use EXACTLY the closing message above.
` : `

CRITICAL JOB-SPECIFIC INTEGRATION:
- Always use "${companyName}" instead of generic "our company"
- Reference "${jobTitle}" role specifically
- Customize questions with ${targetCustomers} as target market
- Mention ${keyProducts} when discussing products
- Reference ${crmTools} for tool-related questions
- Use ${industry} context for industry questions
- Reference ${competitors} when discussing competition

${isRolePlayCategory ? `
TECHNICAL/ROLE-PLAY SPECIAL INSTRUCTIONS:
This is a Technical/Role-Play interview. You MUST immediately begin role-play scenarios:

1. If this is the FIRST message, start role-play immediately with:
   - "I'm going to play a [prospect title] at ${companyName}. You're cold calling me. Ready? [Ring ring] Hello?"
   
2. Once role-play begins, you ARE THE PROSPECT, not the interviewer:
   - Respond as a busy ${targetCustomers} professional would
   - Give realistic objections and skepticism
   - Be challenging but realistic
   - Test their sales skills with real prospect behavior
   - Reference ${competitors} as existing solutions
   - Challenge them on ${keyProducts} value proposition

3. Use these role-play scenarios from the question bank:
${Object.entries(availableQuestions).map(([category, questions]) => 
  `${category}:\n${questions.map((q, i) => `${i + 1}. ${q.replace(/\[specific persona\]/g, targetCustomers || "VP of Sales").replace(/\[specific company\]/g, companyName).replace(/\[competitor\]/g, competitors || "your current solution")}`).join('\n')}`
).join('\n\n')}

NO BACKGROUND QUESTIONS - Go straight into role-play mode!
` : `
STRUCTURED QUESTION FLOW FOR ${interviewType}:
${Object.entries(availableQuestions).map(([category, questions]) => 
  `${category}:\n${questions.map((q, i) => `${i + 1}. ${q.replace(/our company/g, companyName).replace(/our products\/services/g, `${companyName}'s ${keyProducts}`).replace(/our target customer/g, targetCustomers || "our target customer")}`).join('\n')}`
).join('\n\n')}

CRITICAL RULES:
1. Ask questions ONLY from the ${interviewType} category
2. Progress systematically through question topics  
3. Build naturally on responses but stay within category
4. Integrate job-specific details into EVERY question
5. Track which areas have been covered
6. Provide follow-ups from same category when needed
`}

${isFirstMessage ? 
  (isRolePlayCategory ? 
    `This is your FIRST message for Technical/Role-Play. START ROLE-PLAY IMMEDIATELY - no background questions!` :
    `This is your FIRST message. Start with your greeting and first question from ${interviewType} category, fully customized with job details.`) : 
  (!shouldProvideClosing && (isRolePlayCategory ?
    `Continue the role-play as the prospect. Stay in character and challenge them with realistic objections.` :
    `Continue the conversation naturally, asking the next appropriate question from ${interviewType} category while building on their previous response.`))
}`;

    const messages = [];

// Add conversation history
if (conversationHistory.length > 0) {
  conversationHistory.forEach((msg: any) => {
    messages.push({
      role: msg.sender === 'ai' ? 'assistant' : 'user',
      content: msg.content
    });
  });
}

// Add current message if provided
if (message) {
  messages.push({ role: "user", content: message });
}

// FIX: Add default message for first interaction
if (messages.length === 0) {
  messages.push({ 
    role: "user", 
    content: "Please start the interview." 
  });
}

    const completion = await anthropic.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 2000,
      system: systemPrompt,
      messages: messages.map(msg => ({
  role: msg.role as "user" | "assistant",
  content: msg.content
}))
    });

    const response = completion.content[0].text;

    console.log(`✅ Claude response generated: ${response.substring(0, 100)}...
`);

    return new Response(JSON.stringify({
        response,
        interviewer,
        currentQuestionNumber: shouldProvideClosing ? numberOfQuestions : currentQuestionNumber,
        isComplete: shouldProvideClosing  // ✅ CORRECT
      }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Claude interviewer error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate interview response',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Enhanced helper functions for comprehensive job parsing
function extractCRMTools(content: string): string {
  const crmKeywords = ['salesforce', 'hubspot', 'pipedrive', 'crm', 'outreach', 'salesloft', 'apollo', 'zoominfo', 'clearbit'];
  const found = crmKeywords.filter(keyword => 
    content.toLowerCase().includes(keyword)
  );
  return found.length > 0 ? found.join(', ') : 'standard CRM systems';
}

function extractIndustry(content: string): string {
  const industryKeywords = {
    'saas': 'SaaS/Technology',
    'software': 'Software',
    'technology': 'Technology',
    'fintech': 'Financial Technology',
    'healthcare': 'Healthcare',
    'finance': 'Finance',
    'retail': 'Retail',
    'manufacturing': 'Manufacturing',
    'real estate': 'Real Estate',
    'ai': 'AI/Machine Learning',
    'artificial intelligence': 'AI/Machine Learning'
  };
  
  for (const [keyword, industry] of Object.entries(industryKeywords)) {
    if (content.toLowerCase().includes(keyword)) {
      return industry;
    }
  }
  return 'Technology';
}

function extractTargetCustomers(content: string): string {
  const customerKeywords = {
    'enterprise': 'Enterprise customers',
    'mid-market': 'Mid-market companies',
    'smb': 'Small and medium businesses',
    'startups': 'Startups',
    'fortune 500': 'Fortune 500 companies',
    'vp of sales': 'VPs of Sales',
    'sales director': 'Sales Directors',
    'sales manager': 'Sales Managers',
    'cro': 'Chief Revenue Officers',
    'sales leaders': 'Sales Leaders'
  };
  
  for (const [keyword, customer] of Object.entries(customerKeywords)) {
    if (content.toLowerCase().includes(keyword)) {
      return customer;
    }
  }
  return 'VP of Sales';
}

function extractCompetitors(content: string): string {
  const competitorKeywords = ['competitor', 'competing', 'versus', 'alternative', 'salesforce', 'hubspot', 'outreach', 'salesloft'];
  const found = competitorKeywords.filter(keyword => 
    content.toLowerCase().includes(keyword)
  );
  return found.length > 0 ? 'your current solution' : 'competing solutions';
}

function extractKeyProducts(content: string): string {
  const productKeywords = ['platform', 'software', 'solution', 'tool', 'app', 'system', 'service'];
  const found = productKeywords.filter(keyword => 
    content.toLowerCase().includes(keyword)
  );
  return found.length > 0 ? 'our platform' : 'our solution';
}