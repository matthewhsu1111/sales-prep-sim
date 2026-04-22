import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, Clock, Users, Check, X, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type FAQItem = { q: string; a: string };

type ToolReview = {
  name: string;
  verdict: string;
  verdictTone: 'skip' | 'mid' | 'good' | 'winner';
  price: string;
  paragraphs: string[];
  tags: string[];
  featured?: boolean;
};

type EvalItem = { title: string; body: string };
type StepItem = { title: string; body: string };
type CompareRow = {
  feature: string;
  cells: (string | boolean)[];
};

type Block =
  | { type: 'p'; text: string }
  | { type: 'p-jsx'; node: React.ReactNode }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'callout'; title: string; text: string }
  | { type: 'levels' }
  | { type: 'background-table' }
  | { type: 'tool-reviews'; tools: ToolReview[] }
  | { type: 'evaluation-list'; items: EvalItem[] }
  | { type: 'numbered-steps'; items: StepItem[] }
  | { type: 'comparison-table'; headers: string[]; rows: CompareRow[] }
  | { type: 'faq'; items: FAQItem[] }
  | { type: 'cta'; title?: string; subtitle?: string; ctaLabel?: string };

type Post = {
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  date: string;
  readTime: string;
  audience?: string;
  body: Block[];
};

const posts: Record<string, Post> = {
  '5-mistakes-sdr-interviews': {
    slug: '5-mistakes-sdr-interviews',
    title: '5 Mistakes That Tank SDR Interviews (And How to Fix Them)',
    date: 'April 21, 2026',
    readTime: '6 min read',
    body: [
      { type: 'p', text: "Most aspiring SDRs don't lose interviews because they aren't smart or driven enough — they lose them in small, fixable ways. Here are the five we see most often." },
      { type: 'h3', text: '1. Treating "Why sales?" like a throwaway' },
      { type: 'p', text: 'Hiring managers ask this in every single interview. A vague "I like talking to people" answer signals that you haven\'t thought about the job seriously. Have a sharp, two-sentence story.' },
      { type: 'h3', text: '2. No real research on the company' },
      { type: 'p', text: "Naming the product is not research. Know who they sell to, the typical deal size, and one recent piece of news. It takes 15 minutes and separates you from 80% of candidates." },
      { type: 'h3', text: '3. Freezing on the role-play' },
      { type: 'p', text: "The cold-call role-play is where most candidates collapse. The fix isn't a clever script — it's reps. Practice until the structure feels boring." },
      { type: 'h3', text: '4. Asking weak questions at the end' },
      { type: 'p', text: '"What\'s the culture like?" is not a question. Ask about ramp expectations, how reps hit quota, and what separates the top performer from the median.' },
      { type: 'h3', text: '5. Not following up' },
      { type: 'p', text: 'A short, specific follow-up email referencing something you actually discussed will keep you top of mind. Send it within 24 hours.' },
      { type: 'p', text: "None of this is hard. It just requires reps under pressure — which is exactly what CadenceAI is built for." },
      { type: 'cta' },
    ],
  },
  'how-to-get-sdr-job-no-experience-2026': {
    slug: 'how-to-get-sdr-job-no-experience-2026',
    title: 'How to Get an SDR Job With No Sales Experience (2026 Guide)',
    subtitle: "Interview prep for a sales job with no experience isn't about memorizing scripts — it's about understanding what the interview actually is and getting enough reps before you walk in the door.",
    description: "Interview prep for a sales job with no experience: a 2026 guide to landing an SDR role with zero sales background — including roleplay practice, frameworks, and FAQs.",
    date: 'April 2026',
    readTime: '14 min read',
    audience: 'For career changers & new grads',
    body: [
      { type: 'p', text: "Let's be honest about what's happening when you start interview prep for a sales job with no experience. You see the $65,000 base, the uncapped commission, the \"no cold calling experience required.\" You apply. Maybe you get a first-round interview. And then they ask you to do a roleplay — sell them something, handle an objection, cold call the interviewer right now — and your mind goes completely blank." },
      { type: 'p', text: "You freeze. You stumble. You leave thinking you're just not cut out for this. This guide is going to fix that — whether you're trying to break into tech sales from teaching, retail, the military, hospitality, or you're a fresh grad with no work history at all." },
      { type: 'p', text: "Here's what nobody tells you: that freeze has nothing to do with whether you can do the job. It has everything to do with the fact that you've never done that specific thing under pressure before. And the only way to fix that is reps — not reading, not watching YouTube videos, not memorizing scripts. Reps." },
      { type: 'p', text: "But before we get to practice, let's fix the biggest mindset mistake career changers make walking into these interviews." },
      { type: 'h2', text: 'Stop Thinking of It as an Interview' },
      { type: 'p', text: "The single most powerful reframe you can make — and this applies whether you're coming from teaching, retail, the military, or hospitality — is to stop treating the SDR interview like a job interview and start treating it like a sales call where the product is you." },
      { type: 'p', text: "Think about what an SDR actually does every day: they call strangers, create interest in something, handle objections, and try to move the conversation forward to the next step. A hiring manager is watching you do exactly that during your interview. They're not evaluating your resume. They're evaluating whether you'd buy from you." },
      { type: 'quote', text: "You are a salesperson and the product that you're selling is yourself — and you're going to close this deal." },
      { type: 'p', text: "This means every answer you give, every question you ask, every moment of energy or hesitation — it all signals how you'll perform on the phones. A confident, curious, well-prepared candidate who closes the interviewer at the end of the call will almost always beat the candidate with more experience who shows up passive and waits to be evaluated." },
      { type: 'p', text: "The good news for anyone making a career change into sales: you actually have something experienced SDR candidates often lack. You have a story. And story is what wins interviews." },
      { type: 'h2', text: 'Why Your Non-Sales Background Is Actually an Asset' },
      { type: 'p', text: "Hiring managers at tech companies aren't looking for people who've already done the job. If they were, SDR roles would require 3 years of SDR experience. They don't — because almost every SDR is hired green and trained from scratch." },
      { type: 'p', text: "What they're actually looking for is evidence you can learn fast, handle rejection, talk to strangers, and stay coachable. When you map your real background against those needs, an SDR interview with no sales background starts to look pretty different:" },
      { type: 'background-table' },
      { type: 'p', text: "The mistake most career changers make is describing their background in the language of their old industry. A teacher says \"I managed a classroom of 32 students.\" That lands flat. Instead say: \"I was responsible for getting 32 skeptical people to buy into something they didn't initially want, every single day, and I measured my success by outcomes.\" Same job. Completely different signal." },
      { type: 'h2', text: 'The One Story That Decides Your Interview' },
      { type: 'p', text: "Before any other prep, you need to nail one thing: \"Tell me about yourself.\"" },
      { type: 'p', text: "This question opens almost every round — recruiter screen, hiring manager, director, final panel. Most candidates treat it as a chance to recite their resume. That's a mistake. This is your only real opportunity to get the interviewer emotionally bought in on you before the technical questions start." },
      { type: 'p', text: "The framework that works: Hook → Aha moment → Hero's journey." },
      { type: 'p', text: "Start with a pattern interrupt — something unexpected that makes a busy hiring manager lean forward. Then give them the contrast moment where something changed for you. Then tell the story of what you did next, chronologically, building to why you're sitting in this interview right now." },
      { type: 'callout', title: 'Why this works', text: "Humans don't make decisions with the logical part of their brain — they make them emotionally and justify logically afterward. A story that creates contrast and tension gets an emotional buy-in that follows you through every other question in the interview. Even if you stumble on something technical later, they're already rooting for you. A flat resume recitation gets you nothing." },
      { type: 'p', text: "Your hook doesn't have to be dramatic. Coming from teaching? \"I spent five years getting 14-year-olds excited about things they didn't want to learn. That's when I realized I'd been doing sales the whole time.\" Coming from retail? \"I closed more deals at a car dealership by 22 than most people see in a decade — I just didn't know what to call it.\"" },
      { type: 'p', text: "Make them feel something. That's the whole job." },
      { type: 'h2', text: 'What the SDR Interview Actually Looks Like' },
      { type: 'p', text: "Most SDR interview processes have three to four rounds. Here's what to expect at each stage:" },
      { type: 'h3', text: 'Round 1 — Recruiter Screen (30 min, phone or video)' },
      { type: 'p', text: "This is mostly to check you're a real person, verify your interest, and make sure you're not a complete mismatch. Have your \"tell me about yourself\" ready. Ask smart questions about the team and role. Don't ask about salary here unless they bring it up. If they ask your salary expectations, say you're looking for fair market value and ask what the range is — don't name a number first." },
      { type: 'h3', text: 'Round 2 — Hiring Manager Interview (45–60 min)' },
      { type: 'p', text: "This is where you get evaluated on whether you think like a salesperson. Expect behavioral questions: tell me about a time you handled rejection, tell me about a goal you set and hit, why do you want to be in sales. Have specific stories ready for each. This is also where they'll probe your company research — know their product, their ideal customer, and one or two recent company news items well enough to ask about them." },
      { type: 'h3', text: 'Round 3 — The Roleplay' },
      { type: 'p', text: "This is the round that eliminates most candidates. The interviewer will typically say something like: \"Okay, I'm going to be a VP of Sales at a mid-market company. You're calling me cold. Go.\"" },
      { type: 'p', text: "They're not looking for perfection. They're looking for whether you can stay composed under pressure, whether you can handle a \"not interested\" without falling apart, and whether you have the instincts to ask questions instead of just pitching." },
      { type: 'p', text: "The candidates who freeze here — and there are many — haven't done it enough times before the real thing. It's not a talent problem. It's a reps problem." },
      { type: 'h3', text: 'Round 4 — Final / Panel' },
      { type: 'p', text: "You may meet additional team members or go through a second roleplay at higher difficulty. This is also where a 30/60/90 day plan — a short document outlining how you'd approach your first three months — can be a powerful differentiator. Most candidates don't bring one. The ones who do signal something different: they're already thinking like someone who has the job." },
      { type: 'h2', text: 'How to Pass the SDR Interview Roleplay' },
      { type: 'p', text: "Here's a framework for understanding exactly where you are in your prep — and what you should be focused on:" },
      { type: 'levels' },
      { type: 'p', text: "Most candidates walk into a final-round interview still solving Level 1 problems — trying to figure out what to say while they're saying it. That is what the freeze is. When you're at Level 3, the freeze doesn't happen because the answer is already there. You're just performing it." },
      { type: 'p', text: "The only way to get from Level 1 to Level 3 — the only way to actually pass an SDR interview roleplay — is to do it over and over, out loud, with something pushing back." },
      { type: 'h2', text: 'How to Actually Practice (Not Just Prepare)' },
      { type: 'p', text: "There's a difference between preparing and practicing. Preparing is reading interview tips, memorizing answers, watching YouTube videos. Practicing is doing the thing until you can do it without thinking." },
      { type: 'p', text: "Think about it this way: a pilot doesn't read about landing a plane and then land a plane. They do it hundreds of times in a simulator where the conditions are real and things go wrong, before a single passenger is on board." },
      { type: 'p', text: "The SDR interview is your landing. The roleplay is your most turbulent moment. You need a simulator, not a study guide." },
      { type: 'callout', title: 'The thing nobody tells you', text: "The hiring manager is the first persona you'll ever sell to in this career. Before you ever call a VP of Sales at a real prospect company, you're calling a VP of Sales in that interview room. CadenceAI puts that hiring manager in front of you — with realistic pushback, realistic objections, and realistic personalities — before it counts. So by the time you're in the real room, you've already done it fifty times." },
      {
        type: 'p-jsx',
        node: (
          <>
            If you're comparing practice tools, we wrote an honest breakdown of how CadenceAI stacks up against the most common alternative — see{' '}
            <Link to="/compare/yoodli" className="underline text-foreground hover:opacity-80">
              CadenceAI vs Yoodli
            </Link>
            . Yoodli coaches how you speak. CadenceAI coaches what you say.
          </>
        ),
      },
      { type: 'p', text: "Specifically, here's what your practice should include:" },
      { type: 'p', text: "Practice your \"tell me about yourself\" out loud until you can do it without notes, in under two minutes, with energy. Record yourself. Listen back. You'll immediately hear what interviewers hear — and it'll motivate you to fix it." },
      { type: 'p', text: "Practice the cold call roleplay until it's boring. The fear of it comes from novelty. Do it enough times that the adrenaline stops showing up. Practice with different personalities — the skeptical CFO, the friendly but busy VP, the dismissive gatekeeper. Each one teaches you something different." },
      { type: 'p', text: "Practice objection handling specifically. \"Send me an email.\" \"We already use something.\" \"I'm not interested.\" \"Now isn't a good time.\" These four objections will come up in almost every roleplay. Have a response to each that feels natural — not scripted. Natural comes from reps." },
      { type: 'p', text: "Practice asking questions — not answering them. The questions you ask at the end of an interview signal how your brain works. Ask about the company's strategy, the team's challenges, what separates the top SDRs from the average ones, and what success looks like in the first 90 days. These questions do more work than almost any answer you give." },
      { type: 'h2', text: 'Closing the Interview Like a Salesperson' },
      { type: 'p', text: "Most candidates end the interview passively. The interviewer says \"do you have any questions?\" they ask two polite things, and then they go home and wait. That is not what a salesperson does." },
      { type: 'p', text: "At the end of your interview, you close. Not aggressively — professionally. Ask a trial close question: \"Based on what we've discussed today, is there anything that would prevent me from moving to the next round?\" Then ask a next-steps question: \"What does the rest of the process look like, and when can I expect to hear back?\"" },
      { type: 'p', text: "These questions do two things: they give you information you actually need, and they demonstrate exactly the behavior the hiring manager wants to see from an SDR. You're closing. In an interview for a closing role. They notice." },
      { type: 'p', text: "Send a follow-up email the same day. Keep it short. Reaffirm your interest, reference one specific thing from the conversation, and express confidence in your fit. It takes five minutes and almost nobody does it well." },
      { type: 'h2', text: 'The Honest Truth About Breaking Into Tech Sales' },
      { type: 'p', text: "People break into tech sales from every possible background — teaching, military, retail, hospitality, corporate ops, zero experience. The ones who make it aren't necessarily the most talented or the most credentialed. They're the ones who showed up to the interview already knowing what it felt like to be in that chair — because they'd been there before, in practice." },
      { type: 'p', text: "The interview is a performance. Performances improve with rehearsal. The question is whether you rehearse enough before the show — or whether you try to figure it out live, with a real hiring manager watching, and everything on the line." },
      { type: 'p', text: "You already have more going for you than you think. You just need the reps." },
      {
        type: 'faq',
        items: [
          { q: 'Can I get an SDR job with no experience?', a: "Yes. Most SDR roles are entry-level by design — companies expect to train you from scratch. What hiring managers want to see is coachability, work ethic, and the ability to stay composed under pressure. If you can prove those three things in the interview (especially in the roleplay), your background matters far less than you think." },
          { q: 'What do SDR interviewers look for?', a: "They're evaluating whether you'd be effective on the phones: clear communication, energy, the ability to handle rejection without falling apart, curiosity about the prospect, and basic discipline around process. The roleplay tests all of these at once, which is why it carries so much weight in the final decision." },
          { q: 'How do I prepare for an SDR roleplay interview?', a: "Practice it out loud, repeatedly, with someone or something pushing back. Reading scripts won't help — your nerves come from novelty, and the only cure is reps. Run cold-call simulations until the structure feels boring, and rehearse the four most common objections (\"send me an email,\" \"we already use something,\" \"not interested,\" \"now's not a good time\") until your responses feel natural." },
          { q: 'How long does it take to get an SDR job?', a: "For motivated candidates with focused prep, the search typically takes 4–10 weeks from first application to signed offer. Speed depends mostly on how many quality applications you send per week, how dialed your story is, and how much you've practiced the roleplay before your first real one." },
          { q: "What's the difference between an SDR and an AE?", a: "An SDR (Sales Development Rep) generates and qualifies new pipeline — mostly through cold outbound — and books meetings for the closing team. An AE (Account Executive) takes those qualified meetings and runs the full sales cycle to close. SDR is the entry-level seat; most AEs were SDRs first." },
        ],
      },
      { type: 'cta' },
    ],
  },
  'best-app-practice-sales-interview': {
    slug: 'best-app-practice-sales-interview',
    title: 'The Best App to Practice Your Sales Interview in 2026',
    subtitle: "A ranked breakdown of every AI SDR interview practice tool — who each one was built for, where each one falls short, and which one will actually get you through the roleplay round.",
    description: "The best app to practice your sales interview in 2026: an honest, ranked comparison of every AI SDR interview practice tool — Cluely, Yoodli, Google Interview Warmup, LinkedIn Learning, Hyperbound, and CadenceAI.",
    date: 'April 21, 2026',
    readTime: '14 min read',
    audience: 'Updated monthly',
    body: [
      { type: 'p', text: "If you're searching for the best app to practice your sales interview — specifically the SDR or AE roleplay round that eliminates most candidates — this guide gives you the honest answer. Not a sponsored listicle. A real breakdown of every serious AI SDR interview practice tool available in 2026, who each one was actually built for, and which one will put you in the best position when the hiring manager says \"okay, let's do a quick cold call.\"" },
      { type: 'p', text: "That moment — the mock sales roleplay interview — is where most job seekers lose. Not because they're bad at sales. Because they've never been in that exact seat before, with a stranger pushing back in real time, and their nervous system treating it like a genuine threat. The freeze isn't a talent problem. It's a reps problem." },
      { type: 'p', text: "Let's fix that. Here's every tool worth considering, ranked honestly." },

      { type: 'h2', text: 'The thing most candidates get wrong about interview prep' },
      { type: 'p', text: "There's a difference between preparing and practicing. Preparing is reading tips, memorizing answers, watching YouTube. Practicing is doing the thing — out loud, under pressure, with something pushing back — until your nervous system stops treating it as a threat. Only one of those builds the skill. Only one type of tool delivers it." },

      { type: 'h2', text: 'The Best App to Practice Sales Interviews — Ranked Honestly' },
      {
        type: 'tool-reviews',
        tools: [
          {
            name: 'Cluely',
            verdict: 'Skip it',
            verdictTone: 'skip',
            price: 'Free · $20/mo Pro · $75/mo "Undetectability"',
            paragraphs: [
              "Cluely is a real-time AI overlay that whispers suggested answers during live interviews — invisible to the other person on screen. It listens, transcribes, and feeds you responses as the conversation happens.",
              "It works. And that's exactly the problem. If you use Cluely to pass your SDR interview, you'll get the job. Then on day one you'll pick up the phone with a real prospect, and Cluely won't be there. No overlay. No whisper. Just you and a skill you never built.",
              "Cluely doesn't prepare you for sales interviews — it helps you appear prepared for 45 minutes. The entire SDR job exists on the other side of that 45 minutes. There's also a $75/month tier specifically marketed for its \"undetectability,\" which tells you exactly what this product is designed to help you do.",
            ],
            tags: ['Real-time cheat', 'Zero skill building', 'Detection risk'],
          },
          {
            name: 'Yoodli',
            verdict: 'Useful — wrong problem',
            verdictTone: 'mid',
            price: 'Free (5 lifetime sessions) · $8/mo · $20/mo',
            paragraphs: [
              "Yoodli is a speech coach. It analyzes how you talk — filler words, pace, eye contact on camera, vocal clarity — and gives you a score. It's genuinely good at that specific thing.",
              "The problem for SDR candidates: it coaches delivery, not content. You can fumble every objection with perfect pacing and get a great Yoodli score. You can have zero ability to handle \"send me an email\" and Yoodli will never flag it. The free tier is also stingy — any session over 30 seconds burns one of your five lifetime free sessions, so even a warm-up costs you one.",
              "If your issue is \"I say um constantly,\" Yoodli solves it. If your issue is \"I freeze when the interviewer pushes back\" — which is almost everyone's actual problem — Yoodli doesn't touch it.",
            ],
            tags: ['Great delivery coaching', 'No objection handling', 'Generic scenarios'],
          },
          {
            name: 'Google Interview Warmup',
            verdict: 'Too basic',
            verdictTone: 'mid',
            price: 'Free',
            paragraphs: [
              "Google's free tool asks standard interview questions and transcribes your spoken responses. Good for getting comfortable talking out loud. Gives basic keyword-matching feedback.",
              "It's not interactive — it can't push back, can't simulate a skeptical VP, and has no sales-specific scenarios whatsoever. A good starting point if you've never practiced speaking in an interview context. Not remotely sufficient for an SDR or AE roleplay round.",
            ],
            tags: ['Free', 'No interaction', 'Not sales-specific'],
          },
          {
            name: 'LinkedIn Learning / Coursera / Udemy',
            verdict: 'Prep, not practice',
            verdictTone: 'mid',
            price: '$20–40/mo',
            paragraphs: [
              "These platforms are excellent for learning what SDRs do, building sales vocabulary, and understanding the theory behind objection handling. Completely useless for the roleplay round itself.",
              "Watching someone else do a mock cold call is like watching someone else work out. Informative. Does nothing for your fitness. Use these to get informed. Use something else to get ready.",
            ],
            tags: ['Good theory', 'No live practice', 'Not interactive'],
          },
          {
            name: 'Hyperbound / Second Nature',
            verdict: 'Wrong customer',
            verdictTone: 'mid',
            price: '$50+/user/mo · Team plans only',
            paragraphs: [
              "Both are genuinely excellent AI sales roleplay simulators. The problem: they're enterprise tools sold to companies to train reps they've already hired. You can't buy a personal seat as a job seeker, pricing reflects team budgets, and the scenarios are built for active SDRs practicing live prospect calls — not candidates practicing for a job interview.",
              "The hiring manager persona, the career narrative framing, the \"here's why your non-sales background qualifies you\" coaching — none of that exists in either tool. If you somehow got access they'd help your roleplay skills. But you won't.",
            ],
            tags: ['Enterprise only', 'Not for job seekers', 'Expensive'],
          },
          {
            name: 'CadenceAI',
            verdict: 'Built specifically for this problem',
            verdictTone: 'winner',
            price: 'Free + affordable paid tiers',
            featured: true,
            paragraphs: [
              "The only AI SDR interview practice platform built for candidates trying to get hired — not companies training people they already hired. Realistic hiring manager personas, sales-specific roleplay scenarios, objection handling feedback, and career changer pathways. At a price that makes sense when you don't have a job yet.",
            ],
            tags: ['Built for candidates', 'Realistic personas', 'Objection handling'],
          },
        ],
      },

      { type: 'h2', text: 'What SDR Hiring Managers Are Actually Evaluating' },
      { type: 'p', text: "Most candidates prepare for the wrong things. They rehearse perfect answers to behavioral questions. They memorize company facts. They practice a polished \"tell me about yourself.\" All useful — but none of it is what separates the hires from the rejections in competitive SDR processes." },
      { type: 'p', text: "Here's what hiring managers are actually watching for during the interview — and specifically during the roleplay round:" },
      {
        type: 'evaluation-list',
        items: [
          { title: 'Composure under pressure', body: "Do you stay calm when they push back? Or does your energy collapse the moment they say \"not interested\"? This is the single biggest signal for SDR potential." },
          { title: 'Questions over pitching', body: "Bad SDR candidates pitch. Good ones ask questions. If you're delivering a monologue in your roleplay, you've already lost — regardless of how good your words are." },
          { title: 'Recovery speed', body: "Everyone stumbles. What matters is how fast you recover. A one-second pause followed by a pivot signals experience. A five-second silence signals panic." },
          { title: 'Coachability signals', body: "Hiring managers are looking for someone they can develop. How you respond to redirection — in the interview itself — tells them everything about what you'll be like to manage." },
          { title: 'Energy and drive', body: "Sales managers aren't looking for perfect. They're looking for hungry. High energy, genuine interest in the role, and visible ambition matter more than polished delivery." },
          { title: 'Closing instinct', body: "The best SDR candidates treat the interview like a sales call and close the hiring manager at the end. Trial close questions, hard close questions, follow-up plan. Most candidates never do this." },
        ],
      },
      { type: 'p', text: "Notice that none of those things can be developed by reading. Composure under pressure comes from being under pressure. Recovery speed comes from having stumbled and recovered before. Closing instinct comes from closing — even in practice. This is why the right AI SDR interview practice tool isn't the one with the most features. It's the one that puts you in that exact pressure situation and makes you handle it repeatedly." },
      { type: 'quote', text: "The only difference between the candidate who freezes and the one who doesn't is reps. One of them has been in that chair before." },

      { type: 'h2', text: 'How to Use an AI Sales Interview Practice Tool Effectively' },
      { type: 'p', text: "Signing up for a mock SDR interview tool and doing one session is like going to the gym once. You feel good about it and nothing changes. The candidates who pass competitive SDR roleplays aren't the ones who practiced once — they're the ones who practiced until the pressure felt normal." },
      { type: 'p', text: "Here's how to structure your AI roleplay practice for sales interviews so it actually builds the skill:" },
      {
        type: 'numbered-steps',
        items: [
          { title: 'Start with your "tell me about yourself" — every single session', body: "This question opens every round of every SDR interview. It's also your only real opportunity to get emotional buy-in from the interviewer before the technical questions start. Practice your hook, your aha moment, and your narrative arc until it sounds completely natural — not recited. Record yourself. Listen back. The gap between how you think you sound and how you actually sound will motivate you to keep going." },
          { title: 'Practice the four core objections until your responses are automatic', body: "Almost every SDR roleplay throws the same four objections: \"not interested,\" \"send me an email,\" \"we already use something,\" and \"now isn't a good time.\" You need a response to each one that doesn't require thinking. Practice each one individually in isolation before combining them into full scenarios. Once you can handle all four without pausing, you're ready for variations." },
          { title: 'Practice with different persona types, not just one', body: "Interviewers play different characters — the skeptical CFO, the friendly-but-busy VP, the dismissive gatekeeper. Each requires a different energy and approach. Practicing only against one personality type leaves you exposed when the interviewer switches it up. Mix the personas deliberately." },
          { title: 'Do minimum 15–20 sessions before your interview', body: "The first five sessions you're figuring out what to say. Sessions 6–10 you're getting the words right. Sessions 11–20 you're optimizing delivery — energy, pacing, tone. The interview performance you want happens in that last phase. Most candidates stop at session two and wonder why they still feel nervous." },
          { title: 'Practice closing the interviewer — not just the roleplay', body: "At the end of the real interview, ask a trial close question: \"Based on what we've discussed, is there anything that would prevent me from moving to the next round?\" Then a hard close: \"What does the process look like from here, and when can I expect to hear back?\" Most candidates never do this. It signals exactly what a hiring manager wants to see from an SDR. Practice it so it doesn't feel aggressive when you do it live." },
        ],
      },

      { type: 'h2', text: 'What Actually Separates Hired Candidates From Rejected Ones' },
      { type: 'p', text: "After going through every tool above, a pattern becomes clear. The candidates who pass competitive SDR and AE interviews in 2026 aren't necessarily the most talented or the most experienced. They're the ones who have done the specific thing enough times that their nervous system treats it as routine." },
      { type: 'p', text: "Think of it in three levels of interview readiness. Most candidates walk into a final-round interview still at Level 1 — figuring out what to say while they're saying it. That is the freeze. The candidates who win are at Level 3: they know exactly what they're going to say, so all their mental energy goes into how they deliver it — energy, conviction, tone." },
      {
        type: 'p-jsx',
        node: (
          <>
            The right tool for this isn't one that coaches you on filler words. It's not one that whispers answers in your ear. It's one that puts you in the chair, gives you a realistic persona across the table, and makes you handle it until it stops feeling scary. If you want the full breakdown on breaking into an SDR role, read our{' '}
            <Link to="/blog/how-to-get-sdr-job-no-experience-2026" className="underline text-foreground hover:opacity-80">
              guide to getting an SDR job with no experience
            </Link>
            . And for a full comparison of CadenceAI versus Cluely specifically, see our{' '}
            <Link to="/compare/cadenceai-vs-cluely" className="underline text-foreground hover:opacity-80">
              CadenceAI vs Cluely breakdown
            </Link>
            .
          </>
        ),
      },

      { type: 'h2', text: 'Quick Comparison: Every Sales Interview Practice Tool in 2026' },
      {
        type: 'comparison-table',
        headers: ['Tool', 'For job seekers', 'Sales roleplay', 'Objection handling', 'Builds real skill', 'Price'],
        rows: [
          { feature: 'CadenceAI', cells: [true, 'Core feature', true, true, 'Free + paid'] },
          { feature: 'Cluely', cells: ['Sort of', 'Live cheat', 'Whispers only', false, '$20–75/mo'] },
          { feature: 'Yoodli', cells: ['Broadly', 'Generic', false, 'Delivery only', '$8–20/mo'] },
          { feature: 'Google Warmup', cells: [true, false, false, 'Basic', 'Free'] },
          { feature: 'LinkedIn Learning', cells: [true, false, false, 'Theory only', '$40/mo'] },
          { feature: 'Hyperbound', cells: ['Teams only', true, true, true, '$50+/user'] },
        ],
      },

      {
        type: 'faq',
        items: [
          { q: 'What is the best app to practice for a sales interview in 2026?', a: "For SDR and AE candidates specifically, CadenceAI is the only tool built specifically for the sales interview — not general interview prep. It simulates realistic hiring manager personas, sales roleplay scenarios, and objection handling practice calibrated for job seekers, not enterprise sales teams. Generic tools like Yoodli or Google Interview Warmup don't address the roleplay round where most SDR candidates are eliminated." },
          { q: 'What is an AI SDR interview practice tool?', a: "An AI SDR interview practice tool simulates the SDR or AE job interview — including the sales roleplay round — using AI personas that respond dynamically to what you say. Unlike static prep tools that just ask questions, these tools push back, raise objections, and force you to handle real sales scenarios in real time. The goal is to make the pressure of the real interview feel familiar before you're in it. CadenceAI is built specifically for this use case." },
          { q: 'How many times should I practice before my SDR interview?', a: "A minimum of 15–20 full sessions before your interview. The first five sessions you're figuring out what to say. Sessions 6–10 you're getting responses locked in. Sessions 11–20 you're focused purely on delivery — energy, tone, conviction. That's the phase where you actually start sounding like someone who belongs in the role. Most candidates do one or two practice sessions and wonder why they still feel nervous. The answer is reps." },
          { q: 'What is the hardest part of the SDR roleplay interview?', a: "The hardest part isn't the opening or even handling standard objections — it's recovering when something unexpected happens. The interviewer goes off-script, throws an objection you haven't heard, or stays completely silent after you speak. Candidates who have only practiced \"clean\" roleplays fall apart in these moments. Candidates who have practiced with varied personas and random objections treat it as normal. That's the specific thing to train for." },
          { q: 'Is AI interview practice actually effective?', a: "Yes — with the right tool and the right volume. AI roleplay practice for sales interviews works because it solves the core problem: candidates need reps in a high-pressure, interactive situation, and human practice partners are hard to find and inconsistent. AI personas are available 24/7, never get tired, and can simulate dozens of different personalities and objection styles. The research on sales training consistently shows that repetition in realistic conditions is what builds the skill — and AI delivers that at scale." },
          { q: 'Is Cluely worth using for a sales job interview?', a: "Cluely can help you get through the interview — but it won't help you do the actual job. An SDR who passes their interview using real-time AI prompts will struggle the moment they pick up the phone on day one, where no such tool exists. More importantly, Cluely builds zero skill. The whole point of preparing for a sales interview is to develop the instincts and confidence you'll need on the job for years — Cluely skips all of that and leaves you exposed." },
          { q: 'Can I get an SDR job with no sales experience?', a: "Yes — and it happens constantly. Most SDR hiring managers care far more about coachability, energy, and how you handle pressure than whether you've done the job before. The roleplay round is actually your biggest opportunity if you've prepared properly: it's a live demonstration that immediately separates candidates who practiced from those who just read about it. Career changers from teaching, retail, military, and hospitality land SDR roles every month by translating their backgrounds effectively and arriving at the roleplay ready." },
          { q: "What's the difference between an SDR interview prep platform and a general interview app?", a: "General interview apps prepare you for behavioral questions — tell me about yourself, greatest weakness, why this company. An SDR interview prep platform goes further: it simulates cold calls, runs you through objection handling, coaches you on sales-specific instincts like asking questions instead of pitching, and helps you close the interviewer at the end of the conversation. The roleplay round in an SDR interview is unlike any other interview format, and you need to practice the specific thing to pass the specific thing." },
        ],
      },

      {
        type: 'cta',
        title: 'Stop reading about it. Start doing it.',
        subtitle: 'Practice with a realistic AI hiring manager before the real one. SDR and AE scenarios built for job seekers — not enterprise sales teams.',
        ctaLabel: 'Practice Free — No Credit Card →',
      },
    ],
  },
};

const backgroundRows: { bg: string; proves: string }[] = [
  { bg: 'Teaching', proves: 'You communicate clearly to skeptical audiences, adapt your pitch on the fly, and handle "no" 30 times a day from teenagers' },
  { bg: 'Retail / Hospitality', proves: "You've handled real customer objections under pressure with zero prep, managed high volume, stayed up when things got hard" },
  { bg: 'Military', proves: 'You operate under pressure, follow process, respect structure — and you have discipline most 23-year-olds don\'t' },
  { bg: 'Customer Service', proves: "You've de-escalated angry people, found creative solutions, and turned difficult conversations into outcomes — that's objection handling" },
  { bg: 'No work history / fresh grad', proves: 'You have no bad habits to unlearn. Coaches and managers often prefer training someone fresh over re-training someone who learned it wrong' },
];

const Levels = () => (
  <div className="grid md:grid-cols-3 gap-4 my-6">
    {[
      { tag: 'Level 1', title: 'Figuring out what to say', body: 'Still working on what answers to give, what questions to ask, how to structure responses. Most first-timers start here.' },
      { tag: 'Level 2', title: 'Building your story bank', body: 'You have good answers and specific stories. You know how to handle the main objections. You can get through a roleplay without freezing.' },
      { tag: 'Level 3 ✓', title: 'Optimizing delivery', body: "Your answers are solid. Now you're focused purely on energy, tone, pacing, and presence. This is where you win competitive roles against more experienced candidates." },
    ].map((l, i) => (
      <div
        key={i}
        className={`border rounded-xl p-5 ${
          i === 2 ? 'border-foreground/40 bg-muted/40' : 'border-border'
        }`}
      >
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-2">
          {l.tag}
        </p>
        <h4 className="font-semibold text-foreground mb-2">{l.title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{l.body}</p>
      </div>
    ))}
  </div>
);

const BackgroundTable = () => (
  <div className="border border-border rounded-xl overflow-hidden my-6">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/40 hover:bg-muted/40">
          <TableHead className="text-foreground font-semibold">Your Background</TableHead>
          <TableHead className="text-foreground font-semibold">What it Actually Proves</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {backgroundRows.map((r, i) => (
          <TableRow key={i}>
            <TableCell className="font-medium text-foreground align-top w-1/3">{r.bg}</TableCell>
            <TableCell className="text-muted-foreground align-top">{r.proves}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const verdictStyles: Record<ToolReview['verdictTone'], string> = {
  skip: 'bg-destructive/10 text-destructive border-destructive/20',
  mid: 'bg-muted text-muted-foreground border-border',
  good: 'bg-foreground/10 text-foreground border-foreground/20',
  winner: 'bg-primary/20 text-primary-foreground border-primary/40',
};

const ToolReviews = ({ tools, navigate }: { tools: ToolReview[]; navigate: (p: string) => void }) => (
  <div className="space-y-5 my-6">
    {tools.map((tool, i) =>
      tool.featured ? (
        <div
          key={i}
          className="rounded-2xl p-7 bg-foreground text-background border border-foreground"
        >
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="h-4 w-4" />
            <p className="text-xs font-semibold tracking-wider uppercase opacity-80">
              {tool.verdict}
            </p>
          </div>
          <h3 className="text-2xl font-bold mb-2">{tool.name}</h3>
          <p className="text-xs opacity-70 mb-4">{tool.price}</p>
          {tool.paragraphs.map((p, j) => (
            <p key={j} className="text-sm leading-relaxed opacity-90 mb-3">
              {p}
            </p>
          ))}
          <div className="flex flex-wrap gap-2 mt-4 mb-5">
            {tool.tags.map((t, j) => (
              <span
                key={j}
                className="text-[11px] px-2.5 py-1 rounded-full bg-background/10 border border-background/20"
              >
                {t}
              </span>
            ))}
          </div>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('/signup')}
            className="bg-background text-foreground hover:bg-background/90"
          >
            Start Practicing Free →
          </Button>
        </div>
      ) : (
        <div key={i} className="border border-border rounded-2xl p-6 bg-background">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="text-xl font-bold text-foreground">{tool.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{tool.price}</p>
            </div>
            <span
              className={`text-[11px] font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full border ${verdictStyles[tool.verdictTone]}`}
            >
              {tool.verdict}
            </span>
          </div>
          {tool.paragraphs.map((p, j) => (
            <p key={j} className="text-sm text-muted-foreground leading-relaxed mb-3 last:mb-0">
              {p}
            </p>
          ))}
          <div className="flex flex-wrap gap-2 mt-4">
            {tool.tags.map((t, j) => (
              <span
                key={j}
                className="text-[11px] text-muted-foreground px-2.5 py-1 rounded-full bg-muted border border-border"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )
    )}
  </div>
);

const EvaluationList = ({ items }: { items: EvalItem[] }) => (
  <div className="grid sm:grid-cols-2 gap-4 my-6">
    {items.map((item, i) => (
      <div key={i} className="border border-border rounded-xl p-5 bg-muted/20">
        <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
      </div>
    ))}
  </div>
);

const NumberedSteps = ({ items }: { items: StepItem[] }) => (
  <div className="space-y-4 my-6">
    {items.map((item, i) => (
      <div key={i} className="border border-border rounded-xl p-5 flex gap-4">
        <div className="shrink-0 w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold">
          {String(i + 1).padStart(2, '0')}
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-1.5">{item.title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
        </div>
      </div>
    ))}
  </div>
);

const ComparisonTable = ({ headers, rows }: { headers: string[]; rows: CompareRow[] }) => {
  const renderCell = (v: string | boolean) => {
    if (v === true) return <Check className="h-4 w-4 text-foreground mx-auto" />;
    if (v === false) return <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />;
    return <span className="text-xs text-muted-foreground">{v}</span>;
  };
  return (
    <div className="border border-border rounded-xl overflow-x-auto my-6">
      <table className="w-full text-sm">
        <thead className="bg-muted/40">
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className={`text-xs font-semibold tracking-wider text-foreground uppercase px-4 py-3 ${i === 0 ? 'text-left' : 'text-center'}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-border">
              <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                {row.feature}
              </td>
              {row.cells.map((c, j) => (
                <td key={j} className="px-4 py-3 text-center align-middle">
                  {renderCell(c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const BlogPost = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const post = slug ? posts[slug] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Post not found.</p>
          <Button onClick={() => navigate('/blog')}>Back to blog</Button>
        </div>
      </div>
    );
  }

  const faqBlock = post.body.find((b) => b.type === 'faq') as
    | { type: 'faq'; items: FAQItem[] }
    | undefined;

  const canonicalUrl = `https://cadenceai.app/blog/${post.slug}`;
  const description =
    post.description ?? post.subtitle ?? `${post.title} — CadenceAI blog`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description,
    datePublished: post.date,
    author: { '@type': 'Organization', name: 'CadenceAI' },
    publisher: {
      '@type': 'Organization',
      name: 'CadenceAI',
      logo: { '@type': 'ImageObject', url: 'https://cadenceai.app/favicon.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    image: 'https://cadenceai.app/og-image.png',
    keywords: 'best app to practice sales interview, AI SDR interview practice tool, sales roleplay, SDR interview prep, AE interview practice',
  };

  const faqSchema = faqBlock && {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqBlock.items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${post.title} | CadenceAI`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://cadenceai.app/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        {faqSchema && (
          <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        )}
      </Helmet>

      <div className="container mx-auto px-4 max-w-2xl py-16">
        <button
          onClick={() => navigate('/blog')}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> All posts
        </button>

        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground mb-4">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {post.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
            {post.audience && (
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {post.audience}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            {post.title}
          </h1>
          {post.subtitle && (
            <p className="text-lg text-muted-foreground leading-relaxed italic">{post.subtitle}</p>
          )}
        </header>

        <article className="space-y-5">
          {post.body.map((block, i) => {
            switch (block.type) {
              case 'h2':
                return (
                  <h2
                    key={i}
                    className="text-2xl md:text-3xl font-bold text-foreground mt-12 mb-2"
                  >
                    {block.text}
                  </h2>
                );
              case 'h3':
                return (
                  <h3 key={i} className="text-lg font-semibold text-foreground mt-6 mb-1">
                    {block.text}
                  </h3>
                );
              case 'p':
                return (
                  <p key={i} className="text-base text-muted-foreground leading-relaxed">
                    {block.text}
                  </p>
                );
              case 'p-jsx':
                return (
                  <p key={i} className="text-base text-muted-foreground leading-relaxed">
                    {block.node}
                  </p>
                );
              case 'quote':
                return (
                  <blockquote
                    key={i}
                    className="border-l-2 border-foreground/40 pl-5 my-6 text-lg text-foreground italic leading-relaxed"
                  >
                    "{block.text}"
                  </blockquote>
                );
              case 'callout':
                return (
                  <aside
                    key={i}
                    className="border border-border rounded-xl bg-muted/30 p-5 my-6"
                  >
                    <p className="text-sm font-semibold text-foreground mb-2">{block.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{block.text}</p>
                  </aside>
                );
              case 'levels':
                return <Levels key={i} />;
              case 'background-table':
                return <BackgroundTable key={i} />;
              case 'tool-reviews':
                return <ToolReviews key={i} tools={block.tools} navigate={navigate} />;
              case 'evaluation-list':
                return <EvaluationList key={i} items={block.items} />;
              case 'numbered-steps':
                return <NumberedSteps key={i} items={block.items} />;
              case 'comparison-table':
                return <ComparisonTable key={i} headers={block.headers} rows={block.rows} />;
              case 'faq':
                return (
                  <section key={i} className="mt-14">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                      Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                      {block.items.map((item, j) => (
                        <details
                          key={j}
                          className="group border border-border rounded-xl bg-muted/20 p-5 open:bg-muted/40 transition-colors"
                        >
                          <summary className="cursor-pointer list-none font-semibold text-foreground flex justify-between items-start gap-4">
                            <span>{item.q}</span>
                            <span className="text-muted-foreground transition-transform group-open:rotate-45 text-xl leading-none mt-0.5">
                              +
                            </span>
                          </summary>
                          <p className="mt-3 text-muted-foreground leading-relaxed text-sm">
                            {item.a}
                          </p>
                        </details>
                      ))}
                    </div>
                  </section>
                );
              case 'cta':
                return (
                  <div
                    key={i}
                    className="mt-12 p-8 border border-border rounded-xl bg-muted/30 text-center"
                  >
                    <p className="text-foreground font-semibold text-xl mb-2">
                      {block.title ?? 'Get the reps in before it counts.'}
                    </p>
                    <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
                      {block.subtitle ?? 'Practice with realistic AI hiring managers. Free to start.'}
                    </p>
                    <Button size="lg" onClick={() => navigate('/signup')}>
                      {block.ctaLabel ?? 'Try CadenceAI free'}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">
                      SDR · AE · Career Changer tracks · Instant AI feedback
                    </p>
                  </div>
                );
            }
          })}
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
