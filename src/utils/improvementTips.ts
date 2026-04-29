// Maps common interview skill weakness names to actionable practice tips.
// Falls back to a generic tip if the skill name isn't a known key.

interface ImprovementTip {
  summary: string;
  actions: string[];
}

const TIPS: Record<string, ImprovementTip> = {
  "Active Listening": {
    summary: "You're moving to your next point before fully processing what was said.",
    actions: [
      "Pause for 1 full second after the interviewer finishes speaking",
      "Restate their key point before answering ('So you're asking about...')",
      "Practice taking one note per question before responding",
    ],
  },
  "Objection Handling": {
    summary: "Pushback is throwing you off your message.",
    actions: [
      "Use the Acknowledge → Clarify → Respond framework",
      "Don't try to crush the objection — agree with the underlying concern first",
      "Practice the top 5 SDR objections out loud, 10 reps each",
    ],
  },
  "Discovery Questions": {
    summary: "Your questions are too surface-level or leading.",
    actions: [
      "Ask 'why' and 'how' questions instead of yes/no questions",
      "Layer questions: ask one, then dig deeper on the answer",
      "Aim for 2-3 questions before pitching anything",
    ],
  },
  "Cold Call Opener": {
    summary: "Your opener isn't earning the next 30 seconds.",
    actions: [
      "Lead with a pattern interrupt or permission-based opener",
      "State a clear reason for the call within the first 10 seconds",
      "Practice your opener until it sounds conversational, not scripted",
    ],
  },
  "Closing": {
    summary: "You're not driving toward a clear next step.",
    actions: [
      "Always end with a specific ask (calendar time, demo, intro)",
      "Use assumptive language: 'Does Tuesday or Thursday work better?'",
      "Don't end with 'let me know what you think' — that kills momentum",
    ],
  },
  "Pacing": {
    summary: "You're either rushing or leaving too many gaps.",
    actions: [
      "Aim for 140-160 words per minute (record yourself to check)",
      "Use intentional pauses after key points for emphasis",
      "Slow down on numbers, names, and the value prop",
    ],
  },
  "Filler Words": {
    summary: "Too many 'ums', 'likes', and 'you knows' are leaking into your delivery.",
    actions: [
      "Replace fillers with silent pauses — silence sounds confident",
      "Record yourself and count fillers per minute",
      "Practice the answer 5 times before saying it on a real call",
    ],
  },
  "Confidence": {
    summary: "Your tone is dropping at the end of statements, sounding like questions.",
    actions: [
      "End statements with a downward inflection",
      "Stand up while practicing — it changes your delivery",
      "Speak from the diaphragm, not the throat",
    ],
  },
  "Storytelling": {
    summary: "Your examples lack structure and a clear punchline.",
    actions: [
      "Use STAR format: Situation, Task, Action, Result",
      "Keep stories under 90 seconds",
      "Always end with a quantifiable outcome",
    ],
  },
  "Rapport Building": {
    summary: "You're jumping into business before establishing connection.",
    actions: [
      "Mirror the interviewer's energy and pace",
      "Reference something specific from their background or company",
      "Smile while talking — it changes your voice",
    ],
  },
  "Value Proposition": {
    summary: "Your pitch is feature-heavy instead of outcome-driven.",
    actions: [
      "Lead with the business outcome, not the feature",
      "Tie every feature to a specific pain point",
      "Practice the 30-second elevator version until it's automatic",
    ],
  },
  "Qualification": {
    summary: "You're not uncovering enough about budget, authority, need, or timeline.",
    actions: [
      "Use BANT or MEDDIC as a mental checklist",
      "Ask about the decision-making process early",
      "Don't qualify in or out too quickly — ask follow-ups",
    ],
  },
};

const GENERIC_TIP: ImprovementTip = {
  summary: "This skill is showing up repeatedly as an area to work on.",
  actions: [
    "Run 5 focused practice sessions targeting this specific skill",
    "Review your transcripts to spot the exact moment it breaks down",
    "Try a different interviewer persona to stress-test the skill",
  ],
};

export function getImprovementTip(skill: string): ImprovementTip {
  // Exact match first
  if (TIPS[skill]) return TIPS[skill];
  // Case-insensitive fuzzy match
  const lower = skill.toLowerCase();
  for (const key of Object.keys(TIPS)) {
    if (key.toLowerCase() === lower || lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return TIPS[key];
    }
  }
  return GENERIC_TIP;
}
