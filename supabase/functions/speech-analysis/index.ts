import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisInput {
  transcript: string;
  duration: number; // seconds
}

function detectRepeatedWords(text: string): number {
  const words = text.toLowerCase().split(/\s+/);
  let repeatedCount = 0;
  
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i] === words[i + 1] && words[i].length > 2) {
      repeatedCount++;
    }
  }
  
  return repeatedCount;
}

function detectProfessionalLanguage(text: string): number {
  const professionalTerms = /\b(therefore|however|furthermore|consequently|additionally|specifically|particularly|demonstrate|analyze|implement|facilitate|optimize)\b/gi;
  const matches = text.match(professionalTerms) || [];
  return Math.min(matches.length * 3, 40); // Max +40 points
}

function calculateCompletionRate(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const completeSentences = sentences.filter(s => {
    const words = s.trim().split(/\s+/);
    return words.length >= 4; // Complete sentences have at least 4 words
  });
  
  return sentences.length > 0 
    ? Math.round((completeSentences.length / sentences.length) * 100)
    : 100;
}

function getPaceRating(wpm: number): 'too slow' | 'ideal' | 'too fast' {
  if (wpm < 120) return 'too slow';
  if (wpm > 150) return 'too fast';
  return 'ideal';
}

function analyzeSpeech(input: AnalysisInput) {
  const words = input.transcript.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  // 1. Detect filler words
  const fillerPatterns: { [key: string]: RegExp } = {
    'um': /\bum+\b/gi,
    'uh': /\buh+\b/gi,
    'like': /\blike\b/gi,
    'you know': /\byou know\b/gi,
    'so': /^so\b/gim, // At sentence start
    'basically': /\bbasically\b/gi,
    'actually': /\bactually\b/gi,
  };
  
  const fillerWords = Object.entries(fillerPatterns).map(([word, pattern]) => ({
    word,
    count: (input.transcript.match(pattern) || []).length,
  })).filter(f => f.count > 0);
  
  const totalFillers = fillerWords.reduce((sum, f) => sum + f.count, 0);
  
  // 2. Calculate words per minute
  const wordsPerMinute = input.duration > 0 
    ? Math.round((wordCount / input.duration) * 60)
    : 0;
  
  // 3. Confidence indicators
  const uncertainPhrases = /\b(i think|maybe|probably|kind of|sort of|perhaps|i guess)\b/gi;
  const definitePhrases = /\b(i will|i can|definitely|certainly|absolutely|exactly|clearly)\b/gi;
  
  const uncertainCount = (input.transcript.match(uncertainPhrases) || []).length;
  const definiteCount = (input.transcript.match(definitePhrases) || []).length;
  
  // 4. Hesitation detection
  const repeatedWords = detectRepeatedWords(input.transcript);
  
  // 5. Calculate confidence score (0-100)
  const fillerPenalty = Math.min(totalFillers * 5, 30); // Max -30
  const uncertaintyPenalty = Math.min(uncertainCount * 3, 20); // Max -20
  const hesitationPenalty = Math.min(repeatedWords * 4, 15); // Max -15
  const definiteBonus = Math.min(definiteCount * 3, 15); // Max +15
  
  const confidenceScore = Math.max(0, Math.min(100, 
    70 + definiteBonus - fillerPenalty - uncertaintyPenalty - hesitationPenalty
  ));
  
  // 6. Professionalism score
  const professionalVocab = detectProfessionalLanguage(input.transcript);
  const casualLanguage = /\b(yeah|gonna|wanna|kinda|sorta|dunno|ain't)\b/gi;
  const casualCount = (input.transcript.match(casualLanguage) || []).length;
  
  const professionalismScore = Math.max(0, Math.min(100,
    60 + professionalVocab - (casualCount * 5)
  ));
  
  console.log('Speech Analysis:', {
    wordCount,
    wordsPerMinute,
    totalFillers,
    confidenceScore,
    professionalismScore,
  });
  
  return {
    fillerWords,
    totalFillers,
    wordsPerMinute,
    confidenceScore,
    professionalismScore,
    hesitationCount: repeatedWords,
    sentenceCompletionRate: calculateCompletionRate(input.transcript),
    paceRating: getPaceRating(wordsPerMinute),
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcript, duration } = await req.json();
    
    if (!transcript || typeof duration !== 'number') {
      throw new Error('Missing required fields: transcript and duration');
    }

    const analysis = analyzeSpeech({ transcript, duration });

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in speech-analysis:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
