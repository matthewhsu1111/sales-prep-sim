export interface Question {
  id: string;
  category: string;
  subcategory: string;
  question: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

export interface CompanyPersona {
  id: string;
  name: string;
  description: string;
  culture: string;
  interviewStyle: string;
  color: string;
  focusAreas: string[];
}

export const companyPersonas: CompanyPersona[] = [
  {
    id: 'tech-giant',
    name: 'Tech Giant',
    description: 'Large technology company like Google, Microsoft, Amazon',
    culture: 'Data-driven, innovation-focused, structured processes',
    interviewStyle: 'Methodical, competency-based, technical depth',
    color: 'tech',
    focusAreas: ['Technical aptitude', 'Analytical thinking', 'Scale mindset', 'Process adherence']
  },
  {
    id: 'startup',
    name: 'High-Growth Startup',
    description: 'Fast-paced startup environment with rapid scaling',
    culture: 'Entrepreneurial, agile, culture-fit focused',
    interviewStyle: 'Energy-driven, adaptability-focused, culture assessment',
    color: 'startup',
    focusAreas: ['Adaptability', 'Growth mindset', 'Scrappiness', 'Culture fit']
  },
  {
    id: 'enterprise',
    name: 'Enterprise Corporation',
    description: 'Established enterprise with traditional sales processes',
    culture: 'Professional, relationship-focused, proven methodologies',
    interviewStyle: 'Traditional, methodology-focused, relationship building',
    color: 'enterprise',
    focusAreas: ['Sales methodology', 'Relationship building', 'Process expertise', 'Professionalism']
  }
];

export const questions: Question[] = [
  // Initial Screen - Background and Experience
  {
    id: 'init-bg-001',
    category: 'Initial Screen',
    subcategory: 'Background and Experience',
    question: 'Walk me through your professional background and how it led you to this SDR role.',
    difficulty: 'beginner',
    tags: ['background', 'experience', 'career-transition']
  },
  {
    id: 'init-bg-002',
    category: 'Initial Screen',
    subcategory: 'Background and Experience',
    question: 'What specifically attracted you to our company and this sales position?',
    difficulty: 'beginner',
    tags: ['motivation', 'company-research', 'interest']
  },
  {
    id: 'init-bg-003',
    category: 'Initial Screen',
    subcategory: 'Background and Experience',
    question: 'What do you know about our company and our products/services?',
    difficulty: 'intermediate',
    tags: ['company-knowledge', 'research', 'preparation']
  },
  {
    id: 'init-bg-004',
    category: 'Initial Screen',
    subcategory: 'Background and Experience',
    question: 'How has your previous experience in hospitality prepared you for a career in tech sales?',
    difficulty: 'intermediate',
    tags: ['transferable-skills', 'experience', 'career-change']
  },
  {
    id: 'init-bg-005',
    category: 'Initial Screen',
    subcategory: 'Background and Experience',
    question: 'What sales methodologies or processes are you familiar with?',
    difficulty: 'intermediate',
    tags: ['sales-knowledge', 'methodology', 'process']
  },
  {
    id: 'init-bg-006',
    category: 'Initial Screen',
    subcategory: 'Background and Experience',
    question: 'Tell me about a time you had to hit a challenging goal or quota.',
    difficulty: 'intermediate',
    tags: ['goal-achievement', 'pressure', 'results']
  },
  {
    id: 'init-bg-007',
    category: 'Initial Screen',
    subcategory: 'Background and Experience',
    question: 'How would you rate your technical aptitude, and why?',
    difficulty: 'beginner',
    tags: ['technical-skills', 'self-assessment', 'learning']
  },
  {
    id: 'init-bg-008',
    category: 'Initial Screen',
    subcategory: 'Background and Experience',
    question: 'What CRM systems have you worked with?',
    difficulty: 'beginner',
    tags: ['crm-experience', 'technical-tools', 'sales-tools']
  },
  {
    id: 'init-bg-009',
    category: 'Initial Screen',
    subcategory: 'Background and Experience',
    question: "What's your understanding of the SDR/BDR role and its importance?",
    difficulty: 'beginner',
    tags: ['role-understanding', 'sales-process', 'value-proposition']
  },
  {
    id: 'init-bg-010',
    category: 'Initial Screen',
    subcategory: 'Background and Experience',
    question: 'How do you stay current with trends in our industry?',
    difficulty: 'intermediate',
    tags: ['industry-knowledge', 'learning', 'curiosity']
  },

  // Initial Screen - Motivation & Culture Fit
  {
    id: 'init-mot-001',
    category: 'Initial Screen',
    subcategory: 'Motivation & Culture Fit',
    question: 'Why are you transitioning from hospitality to tech sales?',
    difficulty: 'beginner',
    tags: ['career-change', 'motivation', 'reasoning']
  },
  {
    id: 'init-mot-002',
    category: 'Initial Screen',
    subcategory: 'Motivation & Culture Fit',
    question: 'What motivates you to succeed in sales?',
    difficulty: 'beginner',
    tags: ['motivation', 'drive', 'success-factors']
  },
  {
    id: 'init-mot-003',
    category: 'Initial Screen',
    subcategory: 'Motivation & Culture Fit',
    question: 'How would you describe your work ethic?',
    difficulty: 'beginner',
    tags: ['work-ethic', 'character', 'self-assessment']
  },
  {
    id: 'init-mot-004',
    category: 'Initial Screen',
    subcategory: 'Motivation & Culture Fit',
    question: "What are you looking for in your next company's culture?",
    difficulty: 'beginner',
    tags: ['culture-fit', 'values', 'environment']
  },
  {
    id: 'init-mot-005',
    category: 'Initial Screen',
    subcategory: 'Motivation & Culture Fit',
    question: 'Where do you see yourself in 2-3 years?',
    difficulty: 'beginner',
    tags: ['career-goals', 'ambition', 'planning']
  },
  {
    id: 'init-mot-006',
    category: 'Initial Screen',
    subcategory: 'Motivation & Culture Fit',
    question: 'How do you handle rejection and maintain a positive attitude?',
    difficulty: 'intermediate',
    tags: ['resilience', 'rejection-handling', 'mindset']
  },
  {
    id: 'init-mot-007',
    category: 'Initial Screen',
    subcategory: 'Motivation & Culture Fit',
    question: 'What does work-life balance mean to you?',
    difficulty: 'beginner',
    tags: ['work-life-balance', 'values', 'priorities']
  },
  {
    id: 'init-mot-008',
    category: 'Initial Screen',
    subcategory: 'Motivation & Culture Fit',
    question: 'How would your previous managers describe you?',
    difficulty: 'beginner',
    tags: ['self-awareness', 'feedback', 'perception']
  },
  {
    id: 'init-mot-009',
    category: 'Initial Screen',
    subcategory: 'Motivation & Culture Fit',
    question: 'What aspect of sales brings you the most satisfaction?',
    difficulty: 'beginner',
    tags: ['satisfaction', 'motivation', 'sales-passion']
  },
  {
    id: 'init-mot-010',
    category: 'Initial Screen',
    subcategory: 'Motivation & Culture Fit',
    question: "What's your proudest professional achievement to date?",
    difficulty: 'beginner',
    tags: ['achievements', 'pride', 'accomplishments']
  },

  // Hiring Manager - Sales Capabilities
  {
    id: 'hm-sales-001',
    category: 'Hiring Manager',
    subcategory: 'Sales Capabilities',
    question: 'How do you qualify a prospect?',
    difficulty: 'intermediate',
    tags: ['qualification', 'process', 'methodology']
  },
  {
    id: 'hm-sales-002',
    category: 'Hiring Manager',
    subcategory: 'Sales Capabilities',
    question: 'Tell me about a time you turned an uninterested prospect into a customer.',
    difficulty: 'advanced',
    tags: ['conversion', 'persuasion', 'persistence']
  },
  {
    id: 'hm-sales-003',
    category: 'Hiring Manager',
    subcategory: 'Sales Capabilities',
    question: "What's your approach to objection handling?",
    difficulty: 'intermediate',
    tags: ['objection-handling', 'communication', 'problem-solving']
  },
  {
    id: 'hm-sales-004',
    category: 'Hiring Manager',
    subcategory: 'Sales Capabilities',
    question: 'How do you personalize your outreach?',
    difficulty: 'intermediate',
    tags: ['personalization', 'research', 'communication']
  },
  {
    id: 'hm-sales-005',
    category: 'Hiring Manager',
    subcategory: 'Sales Capabilities',
    question: 'What prospecting techniques have worked best for you in the past?',
    difficulty: 'intermediate',
    tags: ['prospecting', 'techniques', 'experience']
  },

  // Executive Interview - Strategic Vision
  {
    id: 'exec-strat-001',
    category: 'Executive Interview',
    subcategory: 'Strategic Vision',
    question: 'What trends do you see affecting our industry in the next 2-3 years?',
    difficulty: 'advanced',
    tags: ['industry-knowledge', 'trends', 'strategic-thinking']
  },
  {
    id: 'exec-strat-002',
    category: 'Executive Interview',
    subcategory: 'Strategic Vision',
    question: 'How do you think our company should respond to recent industry changes?',
    difficulty: 'advanced',
    tags: ['strategic-thinking', 'adaptability', 'business-acumen']
  },
  {
    id: 'exec-strat-003',
    category: 'Executive Interview',
    subcategory: 'Strategic Vision',
    question: 'What do you believe makes a successful sales organization?',
    difficulty: 'advanced',
    tags: ['sales-leadership', 'organization', 'success-factors']
  }
];

export const getQuestionsByPersona = (personaId: string): Question[] => {
  // For MVP, return a curated set based on persona focus areas
  const persona = companyPersonas.find(p => p.id === personaId);
  if (!persona) return questions.slice(0, 10);

  // Filter questions based on persona characteristics
  if (personaId === 'tech-giant') {
    return questions.filter(q => 
      q.tags.includes('technical-skills') || 
      q.tags.includes('process') || 
      q.tags.includes('methodology') ||
      q.tags.includes('analytical-thinking')
    ).concat(questions.slice(0, 8)).slice(0, 12);
  }
  
  if (personaId === 'startup') {
    return questions.filter(q => 
      q.tags.includes('adaptability') || 
      q.tags.includes('culture-fit') || 
      q.tags.includes('growth-mindset') ||
      q.tags.includes('scrappiness')
    ).concat(questions.slice(0, 8)).slice(0, 12);
  }
  
  if (personaId === 'enterprise') {
    return questions.filter(q => 
      q.tags.includes('methodology') || 
      q.tags.includes('process') || 
      q.tags.includes('professionalism') ||
      q.tags.includes('relationship')
    ).concat(questions.slice(0, 8)).slice(0, 12);
  }

  return questions.slice(0, 12);
};