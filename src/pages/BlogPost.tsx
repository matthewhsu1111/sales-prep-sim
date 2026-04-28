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
  'how-to-pass-sdr-interview-no-experience': {
    slug: 'how-to-pass-sdr-interview-no-experience',
    title: 'How to Pass an SDR Interview With No Sales Experience',
    subtitle: "No sales background doesn't mean no shot. Here's what hiring managers actually look for, how to translate whatever you've done before, and how to stop freezing in the roleplay round.",
    description: "How to pass an SDR interview with no sales experience: what hiring managers actually look for, how to translate any background into sales language, and how to handle the roleplay round without freezing.",
    date: 'April 26, 2026',
    readTime: '15 min read',
    audience: 'Updated monthly',
    body: [
      { type: 'p', text: "If you want to pass an SDR interview with no sales experience, the first thing to understand is what hiring managers are actually thinking when they look at your resume. They are not thinking \"this person can't do it.\" They are thinking \"this person is a risk — help me feel confident taking it.\" Everything in this guide is designed to make that risk feel smaller, from how you tell your story to how you handle the roleplay round that eliminates most candidates." },
      { type: 'p', text: "This is not a generic tips list. It is a specific framework for candidates who have never held a sales title — career changers from teaching, retail, logistics, military, hospitality, or any other background — who have an SDR interview coming up and need to be ready for the real thing." },
      { type: 'callout', title: 'Quick Answer', text: "To pass an SDR interview with no sales experience: translate your background into sales language before you walk in, prepare a story that explains your pivot with confidence not apology, and practice the roleplay round out loud at least 15 to 20 times before your interview. Hiring managers are not looking for polished sellers. They are looking for coachable, resilient people who show up with energy and handle pressure without falling apart. Those things come from any background." },

      { type: 'h2', text: 'What SDR hiring managers actually look for in candidates with no experience' },
      { type: 'p', text: "The single most useful mindset shift before your interview: SDR hiring managers expect to train you. They have a whole onboarding process, a sales playbook, scripts, call coaching, and a ramp period for exactly this reason. They are not hiring a finished product. They are hiring raw material that shows the right signals." },
      { type: 'p', text: "Here is what those signals actually are:" },
      {
        type: 'numbered-steps',
        items: [
          { title: 'Coachability above everything else', body: "An SDR manager will correct you multiple times a day. If you get defensive, the whole relationship breaks down fast. They are watching whether you welcome feedback or resist it. The candidates who land offers are the ones who say \"tell me what I'm doing wrong\" and actually mean it." },
          { title: 'Resilience to rejection — and proof of it', body: "SDR work is 80% rejection. Hiring managers need to know you won't quit after a rough Tuesday. They are looking for evidence from your life that you have been knocked down and kept going — not necessarily in sales, but anywhere. Sports, a hard job search, a difficult job, a failed project you pushed through." },
          { title: 'Energy and genuine motivation', body: "Not fake enthusiasm. Real engagement. They are hiring someone they will talk to every day in team meetings, on call reviews, in pipeline discussions. If you sound checked out or like you're going through motions in the interview, the assumption is that's what showing up to work looks like too." },
          { title: 'Initiative — are you already acting like an SDR?', body: "This is the differentiator most candidates miss. The ones who get hired without experience are almost always the ones who have already started. Practicing cold calls. Reading about sales methodology. Reaching out to SDRs at target companies. Doing something before being asked to. That line — \"I didn't want to wait until I got hired to start\" — does more work in an SDR interview than almost anything else." },
          { title: 'Clear communication under pressure', body: "Not eloquence. Not charm. Just the ability to say a clear thing clearly without rambling or trailing off when someone is watching. This is specifically tested in the roleplay round. Slow down, pause before answering, be deliberate. The candidates who sound most confident are almost always the ones who talk the least and say the most." },
        ],
      },
      { type: 'callout', title: "What they're NOT looking for", text: "A perfect answer to every question. Sales experience. A polished cold call in the roleplay. They know you've never done this. What they can't train is composure, coachability, and hunger. Those have to already be there — and they need to show up clearly in the room." },

      { type: 'h2', text: 'How to translate your non-sales background into SDR interview language' },
      { type: 'p', text: "The most common mistake career changers make is describing their old job in the language of their old industry. A teacher says \"I managed a classroom.\" A logistics supervisor says \"I oversaw operations.\" A retail worker says \"I helped customers.\" All of those sound exactly like what they are — not sales experience." },
      { type: 'p', text: "The reframe is not lying. It is describing the same job in terms of what it actually proves about you. Here is how several common backgrounds translate:" },
      { type: 'background-table' },
      { type: 'p', text: "The principle across all of them: don't describe what you did, describe what it proves. Hiring managers are connecting your past to their future hire. Make that connection explicit so they don't have to do it themselves." },

      { type: 'h2', text: 'How to tell your story — the "tell me about yourself" answer that actually works' },
      { type: 'p', text: "This is the question that opens every SDR interview and the one most candidates answer worst. Most people recite their resume. The hiring manager has already read it. What they want to understand is why you are sitting in that chair and whether you are going to be committed or gone in three months." },
      { type: 'h3', text: 'The structure that works' },
      { type: 'quote', text: "\"I've been working in [background], where I spent [time] doing [relevant translation]. Over time I realized the parts I was best at and most energised by were [communication / persuasion / problem solving under pressure]. That led me to sales — specifically the SDR role — because it's the one environment where those skills are tested every single day and results are completely transparent. Since I made that decision I've been [practicing cold calls / studying sales methodology / reaching out to SDRs to understand the role better]. I'm not walking in blind and I'm not walking in hoping it works out. I've done the work to know this is what I want and I'm ready to prove it.\"" },
      { type: 'p', text: "The last two sentences are the most important part. \"I'm not walking in blind\" and \"I've done the work\" address the two biggest fears a hiring manager has about an inexperienced candidate: that they don't know what they're getting into and that they'll quit when it gets hard. Say them clearly and mean them." },

      { type: 'h2', text: 'How to handle the SDR interview roleplay with no sales background' },
      { type: 'p', text: "This is where most candidates with no experience get eliminated — not because they're bad at sales, but because they've never done that specific thing under pressure before. The freeze is not a talent problem. It's a novelty problem. Their nervous system has no map for it." },
      { type: 'p', text: "The good news: the map is simple. You don't need to be a great salesperson to pass an SDR roleplay. You need to demonstrate three things: you stay calm when they push back, you ask questions instead of pitching, and you recover quickly when something unexpected happens." },
      { type: 'p', text: "Here's the structure for the cold call simulation that appears in almost every SDR interview:" },
      { type: 'callout', title: 'Cold call opener — use this framework', text: "\"Hey [Name] — I know I caught you out of the blue. I'll be quick. I work with [company type] who are dealing with [specific problem]. I don't know if that's relevant for you right now, but if it is it might be worth two minutes. Is [problem] something that's actually on your radar?\"" },
      { type: 'p', text: "Then stop talking. The question at the end is everything. Hiring managers are specifically watching whether you pitch or ask. Every strong SDR candidate asks. Most weak ones pitch." },

      { type: 'h3', text: 'The four objections you will face and what to say' },
      { type: 'p', text: "\"Not interested.\" — Don't give up. Get curious. \"Totally fair — usually when I hear that it's either bad timing or it's just not a priority right now. Which one is it for you?\"" },
      { type: 'p', text: "\"Send me an email.\" — Agree. Then redirect. \"Happy to — so I don't send something useless, what would actually make it worth opening? Is it the ROI data or how we compare to what you're using now?\"" },
      { type: 'p', text: "\"We already use something.\" — Validate. Get underneath it. \"Good to know. When you say it's working — is it fully covering everything or more that it's good enough for now?\"" },
      { type: 'p', text: "\"Now isn't a good time.\" — Respect it. Keep the door open. \"Completely understand. Would it be better to circle back in a couple of months, or is it just today that's bad and this week could still work?\"" },
      { type: 'p', text: "The pattern across all four: acknowledge, stay calm, ask one question. Never argue, never pitch harder, never collapse. Interviewers are not watching whether you close the call. They're watching whether you stay curious when things get uncomfortable." },

      { type: 'h2', text: 'How to close the interview like a salesperson' },
      { type: 'p', text: "This is the part almost nobody does and the part that signals most clearly whether someone thinks like an SDR. At the end of the interview when they ask if you have any questions, do not just ask about culture and career paths. Trial close them." },
      { type: 'callout', title: 'Trial close — say this at the end', text: "\"Before I let you go — based on what we've covered today, is there anything about my background or how I handled the roleplay that gives you pause? I'd rather know now and address it than wonder about it after.\"" },
      { type: 'p', text: "This question does two things. It surfaces any objections while you're still in the room to handle them. And it demonstrates the exact instinct they want to see from someone who will be doing this with prospects every single day. The hiring manager will notice. Very few candidates ask it." },
      { type: 'p', text: "Follow it with: \"What does the rest of the process look like from here, and when can I expect to hear back?\" That's your hard close. Professional, confident, completely normal for a sales interview." },

      { type: 'h2', text: 'The practice plan — how to be ready before your interview' },
      { type: 'p', text: "Reading this guide will help you know what to do. Practicing out loud will make you able to do it without thinking. Those are different things and only the second one removes the freeze." },
      {
        type: 'comparison-table',
        headers: ['When', 'What to practice', 'Reps'],
        rows: [
          { feature: '5+ days before', cells: ['"Tell me about yourself" — record, watch back, fix one thing per session', '10 minimum'] },
          { feature: '4 days before', cells: ['Cold call opener out loud — no objections yet, just the first 30 seconds', '15 reps'] },
          { feature: '3 days before', cells: ['"Not interested" and "send me an email" in isolation until automatic', '10 each'] },
          { feature: '2 days before', cells: ['Full cold call sequence with all four objections in random order', '5 full sessions'] },
          { feature: '1 day before', cells: ['Full mock interview including the close — camera on, dressed for it', '2 full runs'] },
        ],
      },
      { type: 'quote', text: "The candidates who pass aren't the ones who knew the most. They're the ones who had done it enough times that nothing felt like the first time." },
      {
        type: 'p-jsx',
        node: (
          <>
            If you want to practice with a realistic AI hiring manager that actually pushes back, adapts mid-conversation, and gives you feedback on what to fix —{' '}
            <Link to="/signup" className="underline text-foreground hover:opacity-80">CadenceAI</Link>{' '}
            is built specifically for this. Not for enterprise sales teams. For individual candidates preparing for their first SDR interview. You can practice at midnight the night before your interview and the AI won't get tired or go easy on you. See also our full guide on{' '}
            <Link to="/blog/9-sdr-interview-roleplay-scenarios" className="underline text-foreground hover:opacity-80">SDR interview roleplay scenarios with scripts</Link>{' '}
            and our breakdown of{' '}
            <Link to="/blog/how-to-stop-freezing-sales-interview" className="underline text-foreground hover:opacity-80">how to stop freezing in sales interviews</Link>.
          </>
        ),
      },

      {
        type: 'faq',
        items: [
          { q: 'How do I pass an SDR interview with no sales experience?', a: "Translate your background into sales language before you walk in, prepare a clear story about why you're making this transition that sounds deliberate not desperate, and practice the roleplay round out loud at least 15 to 20 times before your interview. Hiring managers are not looking for polished sellers. They are looking for coachable, resilient candidates who show up with genuine energy and handle pressure without falling apart. Those things come from any background." },
          { q: 'What do SDR hiring managers look for in candidates with no experience?', a: "Coachability, resilience to rejection, genuine energy, and evidence that you have already started acting like an SDR before being asked to. The candidates who land offers without experience are almost always the ones who say \"I didn't want to wait until I got the job to start learning\" — and can back that up with something concrete they've actually done." },
          { q: 'How do I answer SDR interview questions with no sales experience?', a: "Use a three part structure for every answer: here's what I did, here's what it proves about me, here's how that translates to this role. Don't describe your old job in its own language — describe it in terms of what SDR hiring managers care about. Rejection handling, communication under pressure, volume and consistency, coachability. Every background has evidence for all of those things if you reframe it deliberately." },
          { q: 'How do I prepare for an SDR interview roleplay with no sales background?', a: "Practice the cold call simulation out loud, repeatedly, with something that pushes back. Not in your head — out loud. Record yourself and watch it back. Practice the four core objections in isolation until each response is automatic. The freeze in a roleplay is almost always caused by the novelty of the situation, not by an inability to do the job. Enough reps before the real interview and nothing feels novel anymore." },
          { q: 'Can I get an SDR job with no experience as a career changer?', a: "Yes, and it happens constantly. Career changers from teaching, retail, military, logistics, hospitality, and corporate operations land SDR roles every month. The key is framing your background correctly so hiring managers can connect your past to their future hire — and showing up to the roleplay round already knowing how to handle the scenarios, which requires practice not natural talent." },
          { q: 'What should I say in an SDR interview if I have no sales stories?', a: "Pull from wherever in your life you have handled rejection, persuaded someone, stayed consistent under pressure, or recovered from failure. Sports, a difficult job search, managing a hard situation at work, pushing through something that was tempting to quit. These are sales stories. They just happened outside of a sales context. Frame them using the same structure: here was the situation, here is what I did, here is what happened, here is what it proves about how I will perform." },
          { q: 'How many times should I practice before my first SDR interview?', a: "A minimum of 15 to 20 full practice sessions. Sessions one through five you figure out what to say. Six through ten you get the responses clean. Eleven through twenty the words are automatic and you focus entirely on delivery. Most first-time candidates do two or three sessions. That's why most first-time candidates freeze. The reps are the whole answer." },
          { q: 'Is CadenceAI good for SDR interview practice with no experience?', a: "CadenceAI is built specifically for SDR and AE candidates preparing for job interviews — not for enterprise sales teams training existing reps. It provides realistic hiring manager personas, sales-specific roleplay scenarios calibrated to the interview context, objection handling practice, and feedback after each session. It is available any time without needing a practice partner, which matters when you need 20 reps before next Tuesday." },
        ],
      },
      { type: 'cta', title: 'Your background is not the problem. The reps are.', subtitle: 'Practice with a realistic AI hiring manager before the real one. SDR scenarios built for candidates with no sales experience.', ctaLabel: 'Start Free — No Credit Card →' },
    ],
  },
  'how-to-stop-freezing-sales-interview': {
    slug: 'how-to-stop-freezing-sales-interview',
    title: 'How to Stop Freezing in Your Sales Interview And Actually Practice the Roleplay',
    subtitle: "Freezing in your SDR interview isn't a talent problem. It's a reps problem. Here's the difference — and how to fix it before your next interview.",
    description: "How to stop freezing in your SDR sales interview: a practical 2026 guide to practicing the roleplay out loud, handling the four core objections, and building automatic responses through reps.",
    date: 'April 25, 2026',
    readTime: '13 min read',
    audience: 'Updated monthly',
    body: [
      { type: 'p', text: "If you want to stop freezing in your sales interview, the answer is not more preparation. It is more practice. Those are different things. Preparation means reading about what to say. Practice means doing the thing out loud, under pressure, until your nervous system stops treating it as a threat. This guide covers exactly how to practice your SDR interview roleplay so that the freeze never happens when it counts." },
      { type: 'p', text: "The freeze happens for one reason: your brain is trying to create an answer in real time while simultaneously judging how it sounds and predicting what the interviewer thinks. That's three cognitive tasks running at once. The overload shuts you down. The fix is not being smarter or calmer. It's removing the cognitive load entirely by having done it so many times that nothing has to be created in the moment." },
      { type: 'callout', title: 'Quick Answer', text: "The best way to practice for an SDR interview roleplay is to do it out loud, repeatedly, against something that pushes back. Not in your head. Not by reading scripts. Out loud, with a realistic persona throwing real objections at you, until your responses become automatic. Most candidates need 15 to 20 full sessions before the freeze goes away. The first five sessions you figure out what to say. Sessions 6 through 10 you get it clean. Sessions 11 through 20 you stop thinking about the words entirely and just perform." },

      { type: 'h2', text: "Why You Freeze — And Why Reading This Won't Fix It" },
      { type: 'p', text: "Most people treat interview prep like studying for an exam. They read tips, watch YouTube videos, write out answers, and feel ready. Then the hiring manager says \"okay, I'm going to be a VP of Sales at a 200 person company, you're calling me cold, go\" and everything disappears." },
      { type: 'p', text: "Reading about swimming does not teach you to swim. You can read every technique guide ever written and still drown the first time you get in the water. The SDR interview roleplay is the same. It is a performance skill. Performance skills are built through repetition in realistic conditions, not through studying." },
      { type: 'p', text: "There are three levels of interview readiness and most candidates walk into a final round interview at level one:" },
      { type: 'levels' },
      { type: 'p', text: "Level three is the target. Getting there requires reps, not knowledge. Specifically it requires reps that feel like the real thing — with pressure, with pushback, with unexpected moments you have to recover from. That's what separates interview practice from interview preparation." },

      { type: 'h2', text: 'How to Practice Your SDR Interview Roleplay the Right Way' },
      { type: 'p', text: "Here is the exact practice structure that builds level three readiness before your interview:" },
      {
        type: 'numbered-steps',
        items: [
          { title: 'Practice out loud every single time', body: "This sounds obvious. Almost nobody does it. Thinking through your answer in your head and saying it out loud are completely different experiences. Your mouth, your breathing, your pacing, your vocal tone — none of that exists in your head. If you haven't said it out loud at least 20 times, you haven't practiced it." },
          { title: 'Record yourself and watch it back', body: "This is the most uncomfortable and most effective thing you can do. You will immediately hear filler words, notice your energy dropping, catch where you lose structure. Fix one thing per session. The gap between how you think you sound and how you actually sound closes fast once you start watching." },
          { title: "Practice the four core objections until they're automatic", body: "Almost every SDR interview roleplay uses the same four objections. Not interested. Send me an email. We already have something. Now isn't a good time. Practice each one in isolation until your response comes out clean without a pause. Then practice them in combination. Then practice handling them when they come earlier than expected." },
          { title: 'Practice against something unpredictable', body: "Solo practice builds the words. Pressure practice builds the actual skill. The freeze happens specifically because something unexpected occurs and your brain doesn't have a map for it. Practice with different personas, different personalities, different timing. The more variability you experience in practice, the less anything in the real interview feels like a genuine threat." },
          { title: 'Practice recovering, not just performing perfectly', body: "Most people only practice clean runs. You need to practice the stumble and the recovery. Lose your train of thought deliberately, then keep going. The recovery itself is a skill and hiring managers are specifically watching for it. An SDR who stumbles and recovers calmly signals more than one who never stumbles at all." },
          { title: 'Do 15 to 20 sessions minimum before your interview', body: "Sessions one through five: figuring out the words. Six through ten: getting them clean. Eleven through twenty: delivery only. Most candidates stop at two or three sessions and wonder why they still freeze. You are not ready until the words are completely automatic and your only focus is the energy behind them." },
        ],
      },

      { type: 'h2', text: 'The Four Objections You Need to Stop Freezing On' },
      { type: 'p', text: "These four objections appear in the vast majority of SDR interview roleplays. Hiring managers use them specifically because they reveal instinct under pressure. Here's the structure of a strong response to each:" },
      { type: 'h3', text: '"Not interested." — Don\'t give up. Don\'t push back.' },
      { type: 'p', text: "\"Fair enough, most people say that at first. One quick question before I let you go — is the timing just off right now, or is this genuinely not something you're looking at?\"" },
      { type: 'h3', text: '"Send me an email." — Agree, then redirect.' },
      { type: 'p', text: "\"Happy to. So I send something actually useful rather than a generic overview — what would make it worth 60 seconds of your time? Is it the ROI data or how we compare to what you're using?\"" },
      { type: 'h3', text: '"We already have something." — Validate, then get curious.' },
      { type: 'p', text: "\"Good to know, that's a solid tool. When you say it's working — is it fully meeting everything or more that it's good enough for now?\"" },
      { type: 'h3', text: '"Now isn\'t a good time." — Respect it, keep the door open.' },
      { type: 'p', text: "\"Totally get it. Would it make more sense to circle back in a couple months, or is the timing just off today and a quick 15 minutes this week would still work?\"" },
      { type: 'p', text: "The pattern across all four responses: stay calm, acknowledge what they said, and ask one question. Never argue. Never pitch harder. Interviewers are not watching whether you close — they're watching whether you stay curious under pressure. That single instinct is what all four responses demonstrate." },

      { type: 'h2', text: 'What Interviewers Are Actually Watching For' },
      { type: 'p', text: "Knowing this changes what you practice. Most candidates prepare for the wrong thing." },
      { type: 'callout', title: "What they're NOT watching for", text: "A perfect answer. A smooth pitch. Whether you close the roleplay call. They expect it to be imperfect. They hire for an entry level role. Nobody expects a polished cold caller in the interview room." },
      {
        type: 'comparison-table',
        headers: ["What they're actually watching", 'What it looks like'],
        rows: [
          { feature: 'Composure under pressure', cells: ['You don\'t visibly panic when they say "not interested"'] },
          { feature: 'Questions before pitching', cells: ['Your first instinct is to ask, not to sell'] },
          { feature: 'Recovery speed', cells: ['You stumble and keep going without a 5 second silence'] },
          { feature: 'Energy', cells: ['You sound like you want to be there'] },
          { feature: 'Closing instinct', cells: ['You trial close the interviewer at the end of the conversation'] },
        ],
      },
      { type: 'p', text: "None of those things come from knowing what to say. All of them come from having been in that seat enough times that none of it feels unfamiliar. This is why reps are the whole answer." },

      { type: 'h2', text: 'The Five Day Practice Plan Before Your SDR Interview' },
      { type: 'p', text: "If your interview is next week, here is exactly how to spend the time:" },
      {
        type: 'comparison-table',
        headers: ['Day', 'Morning (30 min)', 'Evening (30 min)'],
        rows: [
          { feature: 'Day 1', cells: ['Record your "tell me about yourself" 5 times. Watch them back. Fix one thing.', 'Practice the cold call opener out loud 10 times. No objections yet.'] },
          { feature: 'Day 2', cells: ['Practice "not interested" and "send me an email" in isolation. 10 reps each.', 'Full cold call sequence with both objections combined. Record it.'] },
          { feature: 'Day 3', cells: ['"We already have something" and "now isn\'t a good time" isolation reps.', 'Full scenario with all four objections in random order.'] },
          { feature: 'Day 4', cells: ['Practice the stumble and recovery deliberately. Lose your thread mid-answer and keep going.', 'Full mock interview. Camera on, dressed for the interview. Treat it like the real thing.'] },
          { feature: 'Day 5', cells: ['Practice closing the interviewer with trial close questions at the end.', 'One final full mock. Focus only on energy. Words are done. Just perform.'] },
        ],
      },
      { type: 'p', text: "Five days of this and you will have done the thing more times than the vast majority of candidates you are competing against. That is the entire competitive advantage." },
      { type: 'quote', text: "You don't rise to the level of your preparation. You fall to the level of your training." },

      { type: 'h2', text: 'The One Thing That Accelerates This Faster Than Anything Else' },
      { type: 'p', text: "Practicing alone helps. Practicing against something that actually pushes back helps dramatically more. The freeze happens specifically in response to unpredictability — something unexpected happens and your brain has no map for it. Solo practice can't replicate that because you always know what's coming next." },
      {
        type: 'p-jsx',
        node: (
          <>
            What you need is a realistic persona that adapts mid-conversation, throws objections at unexpected moments, and gives you feedback after each session on what to fix. That's exactly what{' '}
            <Link to="/signup" className="underline text-foreground hover:opacity-80">CadenceAI</Link>{' '}
            is built for — not for enterprise sales teams training people they already hired, but for individual candidates preparing for the interview itself. SDR-specific scenarios, hiring manager personas, objection handling calibrated to the job interview context. You can practice at midnight the day before your interview and the AI doesn't get tired or break character.
          </>
        ),
      },
      {
        type: 'p-jsx',
        node: (
          <>
            For a full breakdown of every tool available, see our guide to the{' '}
            <Link to="/blog/best-app-practice-sales-interview" className="underline text-foreground hover:opacity-80">
              best apps to practice sales interviews in 2026
            </Link>.
          </>
        ),
      },

      {
        type: 'faq',
        items: [
          { q: 'How do I stop freezing in a sales interview?', a: "The freeze is almost always caused by trying to create answers in real time while under pressure. The fix is removing that cognitive load through repetition — practicing the scenarios out loud until the responses are automatic, so your only focus during the real interview is energy and delivery, not content. Most people need 15 to 20 full practice sessions before the freeze stops happening." },
          { q: 'What is the best way to practice for an SDR interview roleplay?', a: "Practice out loud against something that pushes back — not in your head, not by reading scripts. Record yourself and watch it back to identify specific things to fix. Practice the four core objections in isolation until each response is automatic, then practice them in combination with unpredictable timing. Aim for a minimum of 15 full sessions across five days before your interview. AI roleplay tools like CadenceAI let you do this any time without needing a practice partner." },
          { q: 'Why do I freeze in interviews even when I feel prepared?', a: "Because preparation and practice are different things. Preparation means you know what to say. Practice means you've said it out loud enough times under pressure that it no longer requires thinking. If you've only read about your answers or thought through them in your head, your brain is still creating them in real time during the interview. The freeze is the gap between knowing and doing." },
          { q: 'How many times should I practice before an SDR interview?', a: "A minimum of 15 to 20 full practice sessions. Sessions one through five you figure out the words. Sessions six through ten you get the structure clean. Sessions eleven through twenty you stop thinking about content entirely and focus only on delivery. Most candidates do two or three sessions and consider themselves ready. That's why most candidates freeze." },
          { q: 'What do SDR interviewers look for in the roleplay round?', a: "Composure under pressure, the instinct to ask questions instead of pitching, recovery speed when something unexpected happens, energy, and whether you close the interviewer at the end. They are not looking for a perfect cold call. They expect imperfection. What they can't train for is composure and instinct — those have to already be there." },
          { q: 'Can I get an SDR job with no sales experience if I freeze in roleplays?', a: "The freeze is the main thing standing between you and the offer — not the lack of experience. Hiring managers expect career changers to not know the product or the industry. What they're watching for is whether you handle pressure with composure. Fix the freeze through practice and the lack of experience becomes much less of a barrier than most people assume." },
          { q: 'What should I say when I blank during a sales interview?', a: "Buy yourself three seconds with a natural bridge: \"Let me think about the best example for this\" or \"The first thing that comes to mind is...\" Then start talking, even imperfectly. Motion beats silence. Interviewers remember how you recovered from the blank far more than they remember the blank itself. An SDR who stumbles and keeps going calmly signals more about their real-world capability than one who gives a polished answer with no visible resilience." },
          { q: 'Is AI interview practice actually effective for SDR candidates?', a: "Yes, specifically because it solves the core problem: candidates need reps in a high-pressure, interactive situation but don't have access to a realistic practice partner on demand. AI roleplay tools that are built for sales interview prep — like CadenceAI — provide SDR-specific personas, real objections, and feedback after each session. The key is volume. One or two sessions with any tool won't fix the freeze. Fifteen to twenty sessions will." },
        ],
      },
      { type: 'cta', title: 'The freeze goes away with reps. Start getting them.', subtitle: 'Realistic SDR interview scenarios. Hiring manager personas. Objection handling practice. Available whenever you need it.', ctaLabel: 'Start Free — No Credit Card →' },
    ],
  },
  '9-sdr-interview-roleplay-scenarios': {
    slug: '9-sdr-interview-roleplay-scenarios',
    title: '9 SDR Interview Roleplay Scenarios With Scripts — Practice These Before Your Interview',
    subtitle: "The exact roleplay scenarios hiring managers use to screen SDR candidates — with real dialogue, objection responses, and the PASS Framework for practicing until the freeze never happens.",
    description: "9 SDR interview roleplay scenarios with full scripts, objection responses, and a step-by-step practice framework. The exact scenarios hiring managers use to screen candidates in 2026.",
    date: 'April 23, 2026',
    readTime: '16 min read',
    audience: 'Updated monthly',
    body: [
      { type: 'p', text: "If you're preparing for an SDR interview, the roleplay round is the scenario that separates hires from rejections — and it's the one almost nobody actually practices. This guide gives you the 9 most common SDR interview roleplay scenarios hiring managers use in 2026, complete with sample scripts, the specific objections they throw, and exactly why each response works." },
      { type: 'p', text: "These aren't generic sales training scenarios. Every scenario below is calibrated specifically to the job interview context — because practicing a real sales call and practicing for a hiring manager who is evaluating whether you can do a real sales call are two completely different things." },
      { type: 'callout', title: 'What the freeze actually is', text: "When candidates freeze in the SDR roleplay round, it's almost never a talent problem. It's a reps problem. They've never been in that specific seat — with a stranger, under pressure, being evaluated — and their nervous system treats it as a genuine threat. The scripts below don't just give you words. They give you enough reps that the situation stops feeling novel. That's when the freeze disappears." },

      { type: 'h2', text: 'Why SDR Interview Roleplay Scenarios Are Different From Regular Sales Practice' },
      { type: 'p', text: "There's a crucial difference between practicing sales calls for a job you already have and practicing for an interview where you're trying to demonstrate you can do the job. In a real sales call, you've been trained on the product, you know the ICP, and your goal is booking a meeting. In a job interview roleplay, you know almost nothing — and that's the point." },
      { type: 'p', text: "Hiring managers aren't testing whether you can close deals. They're testing three specific things: whether you stay composed under pressure, whether you instinctively ask questions instead of pitching, and whether you can recover when something unexpected happens. The scripts below are designed to train exactly those instincts." },
      { type: 'p', text: "One more thing before the scenarios: every script here is a starting point, not a rigid template. The best responses are the ones that feel natural coming out of your mouth — not recited. Use these to understand the structure, then make them yours." },

      { type: 'h2', text: 'The PASS Framework' },
      { type: 'p', text: "Four principles that separate candidates who pass from candidates who freeze." },
      {
        type: 'numbered-steps',
        items: [
          { title: 'P — Pressure Inoculation', body: "Practice under simulated pressure — time constraints, difficult personas, unexpected objections — until your nervous system treats it as routine, not threat." },
          { title: 'A — Ask Before You Pitch', body: "The single most common mistake in SDR roleplays: pitching before qualifying. Great SDR candidates ask questions first. Every time. Without exception." },
          { title: 'S — Stay in the Conversation', body: "A \"not interested\" is not a rejection — it's the beginning of the real conversation. Staying calm and curious after pushback is what hiring managers are watching for." },
          { title: 'S — Specific Reps', body: "Don't practice randomly. Identify the 3 scenarios most likely in your interview and practice each one 15–20 times. Depth beats breadth every time." },
        ],
      },

      { type: 'h2', text: 'How to Use These SDR Interview Roleplay Scenarios' },
      { type: 'p', text: "Before you run through each scenario, understand what you're practicing. Each one has a setup that describes the exact situation, a sample dialogue showing one strong response, and a \"why it works\" breakdown explaining the instincts being demonstrated. Read the dialogue once. Then close it and practice the scenario out loud from memory — adapting the words to feel natural for you. Repeat until your response to the opening situation feels automatic, not deliberate." },
      {
        type: 'p-jsx',
        node: (
          <>
            If you want to practice with an AI hiring manager that actually pushes back and adapts mid-conversation,{' '}
            <Link to="/signup" className="underline text-foreground hover:opacity-80">CadenceAI</Link>{' '}
            gives you all 9 of these scenarios with live feedback — so you're not just rehearsing lines but building real muscle memory under pressure.
          </>
        ),
      },

      { type: 'h2', text: '01 — The Cold Call Opening' },
      { type: 'callout', title: 'What they say', text: "\"Okay, I'm going to be a VP of Sales at a 200-person SaaS company. You're calling me cold. Go.\" — Testing: pattern interrupt, composure in silence, permission-based opening." },
      { type: 'p', text: "Hiring Mgr: \"Yeah, who's this?\"" },
      { type: 'p', text: "You: \"Hi Sarah — this is [Your Name] calling from [Company]. I'll be honest, you weren't expecting my call. I've got a reason for reaching out, but before I get into it — is now an okay moment, or should I call back at a better time?\"" },
      { type: 'p', text: "Hiring Mgr: \"I've got two minutes.\"" },
      { type: 'p', text: "You: \"I'll be quick. We work with VP-level sales leaders at SaaS companies in the 150 to 500 person range who are frustrated with SDR ramp time. Typically they're waiting 3 to 4 months before a new hire is productive. I don't know if that's something on your radar, but if it is, it might be worth a 15-minute conversation. Is SDR ramp a problem you're actively looking at right now?\"" },
      { type: 'p', text: "Hiring Mgr: \"We actually just hired four SDRs. It's definitely on my mind.\"" },
      { type: 'p', text: "You: \"Perfect timing then. What does your current onboarding process look like for those new hires?\"" },
      { type: 'callout', title: 'Why this works', text: "The opener gives them an out immediately — which is counterintuitive but builds instant trust. The two-sentence value proposition is specific to their role and company size, not generic. Most importantly, the rep ends with a question, not a pitch. Hiring managers are watching for that pivot from speaking to listening." },

      { type: 'h2', text: '02 — The Immediate "Not Interested"' },
      { type: 'callout', title: 'What they say', text: "\"We're not interested\" — immediately after you finish your opener. Testing: recovery speed, staying curious instead of defensive, not collapsing." },
      { type: 'p', text: "Hiring Mgr: \"Not interested.\"" },
      { type: 'p', text: "You: \"That's fair — most people I call say that initially. Can I ask just one quick question before I let you go?\"" },
      { type: 'p', text: "Hiring Mgr: \"Fine, one question.\"" },
      { type: 'p', text: "You: \"When you say not interested — is it that the timing isn't right, or is this just not a priority at all for your team right now?\"" },
      { type: 'p', text: "Hiring Mgr: \"Timing isn't great — we just went through a reorg.\"" },
      { type: 'p', text: "You: \"That makes complete sense. I won't waste your time now — would it be worth me following up in a couple months once things settle, or would that still be too soon?\"" },
      { type: 'callout', title: 'Why this works', text: "This is the scenario that eliminates the most candidates — because most people either give up immediately or push back defensively. The \"one quick question\" technique is respectful and almost always granted. Separating \"bad timing\" from \"not a priority\" is a real qualification question dressed up as a soft follow-up. Asking them to tell you when to follow up makes the prospect do the closing work." },

      { type: 'h2', text: '03 — "Send Me an Email"' },
      { type: 'callout', title: 'What they say', text: "\"Just send me an email\" — mid-conversation, as a way to end the call. Testing: whether you recognize this as a brush-off, confidence to stay on the call." },
      { type: 'p', text: "Hiring Mgr: \"Yeah, why don't you just send me an email with the details.\"" },
      { type: 'p', text: "You: \"Absolutely — happy to do that. I just want to make sure I send you something actually useful and not just a generic overview. What would make an email worth 60 seconds of your time? Is it the ROI data, the implementation timeline, or how we compare to what you're using now?\"" },
      { type: 'p', text: "Hiring Mgr: \"Just send me the overview.\"" },
      { type: 'p', text: "You: \"Will do. And so the email has some context — when you look at it, what's the main thing you're trying to solve right now? Even a rough answer helps me make sure I'm not wasting your inbox.\"" },
      { type: 'callout', title: 'Why this works', text: "\"Send me an email\" is almost always a polite way to end the call — not genuine interest. The response agrees to the email (no confrontation) but pivots immediately into a qualification question before committing. Getting any answer to \"what are you trying to solve\" turns a brush-off into a warm lead. Hiring managers love seeing this pivot because it shows commercial instinct." },

      { type: 'h2', text: '04 — "We Already Use a Competitor"' },
      { type: 'callout', title: 'What they say', text: "\"We actually already use [Competitor]. We're happy with it.\" Testing: competitive awareness, not badmouthing, genuine curiosity about their current setup." },
      { type: 'p', text: "Hiring Mgr: \"We're actually already using Outreach. Been with them for two years.\"" },
      { type: 'p', text: "You: \"Good to know — Outreach is solid for a lot of teams. I'm curious: when you say you're happy with it, is it meeting everything you need, or are there areas where it's just good enough for now?\"" },
      { type: 'p', text: "Hiring Mgr: \"It does what we need.\"" },
      { type: 'p', text: "You: \"Totally fair. The companies we tend to talk to usually have it working — but they're hitting friction in one or two specific areas. For your team, is it more around the reporting side, the sequencing, or something else? I'm asking because if we're genuinely not solving a problem you have, I'd rather know now.\"" },
      { type: 'callout', title: 'Why this works', text: "Never badmouth a competitor — hiring managers see it as a red flag immediately. Validating their current tool (\"Outreach is solid\") builds credibility. The question about \"good enough for now\" vs \"meeting everything\" is a surgical qualification technique that identifies dissatisfaction without being pushy. The closing line — \"I'd rather know now if we're not solving a problem you have\" — signals confidence, not desperation." },

      { type: 'h2', text: '05 — The Gatekeeper Block' },
      { type: 'callout', title: 'What they say', text: "Hiring manager plays an executive assistant: \"I'll take a message, but she's not available for cold calls.\" Testing: respect for gatekeepers, creative navigation without being pushy." },
      { type: 'p', text: "Hiring Mgr: \"This is Karen, I handle Sarah's calendar. She's not taking cold calls.\"" },
      { type: 'p', text: "You: \"Hi Karen — completely understand. I actually have a quick question for you, if you don't mind. We work with a few companies similar to yours who've been dealing with [specific problem]. Is that something Sarah would even be thinking about, or would that fall under someone else's remit?\"" },
      { type: 'p', text: "Hiring Mgr: \"That would be Sarah's area, but she's genuinely not available.\"" },
      { type: 'p', text: "You: \"That helps — thank you. Rather than clog her inbox, what's the best way to reach her? Is email better, or is there a time she typically takes calls?\"" },
      { type: 'p', text: "Hiring Mgr: \"Email is best. Try sarah@company.com.\"" },
      { type: 'p', text: "You: \"Perfect — I'll be brief. Thanks for your help, Karen. I really appreciate it.\"" },
      { type: 'callout', title: 'Why this works', text: "Gatekeepers are almost never bypassed by persistence — they're navigated by respect and intelligence. Asking the gatekeeper a qualification question treats them as knowledgeable (which they are) and often surfaces useful information. Getting the preferred contact method from the gatekeeper instead of guessing is a professional move most candidates don't think to make." },

      { type: 'h2', text: '06 — "I Don\'t Have Budget"' },
      { type: 'callout', title: 'What they say', text: "\"We don't have budget for this right now.\" Testing: whether you know \"no budget\" often means \"no priority yet\" — and how you respond." },
      { type: 'p', text: "Hiring Mgr: \"Look, we're in a budget freeze right now. Nothing's getting approved.\"" },
      { type: 'p', text: "You: \"That's fair — I hear that a lot. Quick question: is the budget freeze a company-wide thing, or is it more that this particular problem isn't high enough on the priority list to fight for budget right now?\"" },
      { type: 'p', text: "Hiring Mgr: \"Honestly, a bit of both.\"" },
      { type: 'p', text: "You: \"I appreciate the honesty. If the problem got worse — say your Q3 miss was partly because of this — would it become priority enough to unlock budget? I'm asking because I'd rather understand the real situation than try to sell to someone who genuinely can't move right now.\"" },
      { type: 'callout', title: 'Why this works', text: "Budget objections are almost always priority objections in disguise. Separating \"company freeze\" from \"not our priority\" is a real distinction with different follow-up strategies. The hypothetical question about Q3 is a gentle pain amplifier — it gets them to think about consequences without being pushy. The last sentence signals maturity and confidence, not desperation." },

      { type: 'h2', text: '07 — The Discovery Call Opening (AE Track)' },
      { type: 'callout', title: 'What they say', text: "\"Okay, this prospect agreed to a 30-minute discovery call. They're guarded and give short answers. Go.\" Testing: open-ended questioning, following up on vague answers, not pitching in discovery." },
      { type: 'p', text: "You: \"Thanks for making time today. Before I tell you anything about us, I'd love to understand what made you agree to this call. Was it the email I sent, something you're actively looking at, or just curiosity?\"" },
      { type: 'p', text: "Hiring Mgr: \"We've had some challenges recently.\"" },
      { type: 'p', text: "You: \"I'd love to understand that. When you say challenges — walk me through what a bad week has looked like for your team. What breaks first?\"" },
      { type: 'p', text: "Hiring Mgr: \"Mostly around pipeline. We're not generating enough meetings.\"" },
      { type: 'p', text: "You: \"Got it. Is that a volume problem — not enough activity — or is it that activity's happening but it's not converting into actual meetings?\"" },
      { type: 'callout', title: 'Why this works', text: "Opening a discovery call by asking why they agreed to the call immediately demonstrates curiosity and respect for their time. \"What breaks first\" is a vivid, specific question that gets real answers from guarded prospects. The final question between \"volume problem\" vs \"conversion problem\" shows strategic thinking and narrows the pain without leading the witness." },

      { type: 'h2', text: '08 — "Why Should I Hire You Over Someone With Experience?"' },
      { type: 'callout', title: 'What they say', text: "\"You don't have direct sales experience. Why should we take a risk on you over someone who has?\" Testing: confidence without defensiveness, narrative framing, translating past experience." },
      { type: 'p', text: "Hiring Mgr: \"Your background is in teaching. Why are you the right hire over someone who's already done this role?\"" },
      { type: 'p', text: "You: \"That's a fair challenge — I'd push back on myself with the same question. Here's how I'd frame it: I spent five years getting skeptical people interested in things they didn't come in wanting to hear. Every class, different audience, different energy, different resistance. That's a cold call structure. The difference is I haven't applied it to a sales context yet — which is exactly why I'm willing to outwork anyone in your pipeline to prove it translates.\"" },
      { type: 'p', text: "Hiring Mgr: \"That's a nice answer. But experience is experience.\"" },
      { type: 'p', text: "You: \"You're right that experience matters. But I'd ask — what's the conversion rate on your experienced hires? Because your best SDRs were all inexperienced once. The thing that made them great wasn't what they knew when they started. It was how fast they learned and how hard they worked. I can demonstrate both.\"" },
      { type: 'callout', title: 'Why this works', text: "This scenario is specific to career changers and it requires real confidence to execute. The first response accepts the frame (\"fair challenge\") before reframing it — never defensive. Translating teaching into sales language makes the abstract concrete. The pushback on \"experience is experience\" is a genuine counter-argument, not just deflection. Ending with \"I can demonstrate both\" is a soft close on the conversation itself." },

      { type: 'h2', text: '09 — Closing the Interview Like a Salesperson' },
      { type: 'callout', title: 'What they say', text: "\"Okay, we're wrapping up. Do you have any questions for me?\" Testing: whether you treat the close like a salesperson — or passively wait to be evaluated." },
      { type: 'p', text: "Hiring Mgr: \"Do you have any questions for me before we wrap up?\"" },
      { type: 'p', text: "You: \"I do — a few. First: what does success look like in the first 90 days for the person you hire? And the second question might be more direct than you're used to — based on what we've discussed today, is there anything about my background or how I performed in the roleplay that gives you pause? I'd rather know now and address it.\"" },
      { type: 'p', text: "Hiring Mgr: \"Honestly, I'm a little concerned that you've never done a real sales call.\"" },
      { type: 'p', text: "You: \"I appreciate you saying that directly. That's the right concern to have. What would it take for you to feel comfortable enough to move me forward — is it more evidence of the instinct you just saw, or is it something else I haven't addressed?\"" },
      { type: 'p', text: "Hiring Mgr: \"If the rest of the process goes well, I think we can move forward.\"" },
      { type: 'p', text: "You: \"That's great to hear. What does the rest of the process look like from here, and when can I expect to hear back?\"" },
      { type: 'callout', title: 'Why this works', text: "Most candidates treat the \"any questions?\" moment as a courtesy. Great SDR candidates treat it as the close. Asking directly \"is there anything that gives you pause\" is a trial close — it surfaces objections before you leave the room, when you can still handle them. The follow-up \"what would it take to move forward\" is a hard close. It signals exactly what a hiring manager wants to see from someone who will be doing this with prospects every day." },

      { type: 'h2', text: 'How to Practice These Scenarios Effectively' },
      { type: 'p', text: "Reading these scenarios builds awareness. Practicing them out loud builds skill. There's a significant difference. Here's how to structure your practice sessions to get the maximum benefit from the scenarios above:" },
      {
        type: 'numbered-steps',
        items: [
          { title: 'Sessions 1–5 — Figuring out the words', body: "Read the script. Practice the scenario. Get the basic response structure in your head. Expect to stumble. That's normal." },
          { title: 'Sessions 6–10 — Locking in the structure', body: "You know roughly what to say. Now focus on the specific technique — the pivot, the qualifying question, the recovery move. Get it clean." },
          { title: 'Sessions 11–20 — Owning the delivery', body: "Script is automatic. Now every mental resource goes into energy, tone, and conviction. This is when you start sounding like someone who belongs in the role." },
        ],
      },
      { type: 'p', text: "The most common mistake is stopping at session three or four — right when it starts feeling familiar but before it feels automatic. Familiar is not the same as ready. Automatic is what you're after. When the hiring manager throws \"not interested\" and your response comes out naturally without a pause, without a search, without a decision — that's when you know you're ready." },
      { type: 'quote', text: "Every rep who interviewed with me that I hired had one thing in common: they'd clearly been in this specific chair before. Not in a real interview — in practice. You could feel the difference immediately." },
      { type: 'p', text: "The three scenarios to prioritize above everything else: the cold call opener, the immediate \"not interested,\" and closing the interview like a salesperson. Together they cover the beginning, middle, and end of the most common SDR interview format. Master those three before you focus on the others." },
      {
        type: 'p-jsx',
        node: (
          <>
            If you want to practice all 9 with a realistic AI hiring manager that adapts mid-conversation, gives you feedback after each session, and lets you practice at midnight if you want — see our{' '}
            <Link to="/blog/best-app-practice-sales-interview" className="underline text-foreground hover:opacity-80">
              ranked guide to the best apps for sales interview practice
            </Link>
            . CadenceAI is built specifically for this. Not for enterprise sales teams. For you.
          </>
        ),
      },

      {
        type: 'faq',
        items: [
          { q: 'What is an SDR interview roleplay scenario?', a: "An SDR interview roleplay scenario is a simulated sales conversation that hiring managers use to evaluate candidates during the interview process. The hiring manager typically plays a prospect — a VP of Sales, a skeptical buyer, or a gatekeeper — and asks you to cold call them, handle their objections, and attempt to book a meeting. It's designed to test composure under pressure, questioning instincts, and recovery speed rather than product knowledge." },
          { q: 'How do you prepare for an SDR interview roleplay?', a: "The most effective preparation is repeated practice against realistic personas that push back like a real hiring manager. Start by understanding the structure of each scenario type — cold call openers, objection responses, gatekeeper navigation. Then practice each one out loud, not in your head, until your responses feel automatic rather than deliberate. Aim for 15 to 20 full practice sessions before your interview, focusing on the three most common scenarios: the cold call opener, the immediate \"not interested,\" and closing the interview with trial close questions." },
          { q: 'What do SDR hiring managers look for in a roleplay?', a: "SDR hiring managers are not looking for a perfect performance. They're watching for three specific things: whether you stay composed when they push back, whether you instinctively ask questions instead of pitching, and how quickly you recover when something unexpected happens. A candidate who handles \"not interested\" calmly and pivots to a qualifying question will almost always beat a candidate with more experience who panics or gives up at the first objection." },
          { q: 'Can you get an SDR job with no sales experience?', a: "Yes — and it happens constantly. Most SDR hiring managers care far more about coachability, energy, and how you handle pressure than whether you've done the job before. Career changers from teaching, retail, military, and hospitality land SDR roles every month. The key is translating your past experience into sales language — and showing up to the roleplay round already knowing how to handle the scenarios, which is what practicing these scripts in advance gives you." },
          { q: 'How many times should I practice before my SDR interview?', a: "A minimum of 15 to 20 full practice sessions across your three priority scenarios. The first five sessions you are figuring out what to say. Sessions six through ten you are getting the response structure clean. Sessions eleven through twenty you are focused entirely on delivery — energy, tone, and conviction. Most candidates stop at two or three sessions and wonder why they still feel nervous when it counts. The answer is reps." },
          { q: 'What is the PASS Framework for SDR interview prep?', a: "The PASS Framework is CadenceAI's system for building interview-ready sales instincts. P stands for Pressure Inoculation — practicing under simulated pressure until your nervous system treats it as routine. A stands for Ask Before You Pitch — qualifying with questions before delivering any value proposition. The first S stands for Stay in the Conversation — remaining calm and curious after objections rather than collapsing or pushing back defensively. The second S stands for Specific Reps — practicing your three highest-priority scenarios twenty or more times rather than skimming twenty scenarios once." },
          { q: "What's the hardest SDR interview roleplay scenario?", a: "The immediate \"not interested\" eliminates more candidates than any other scenario — because most people either give up entirely or push back defensively, both of which signal poor sales instincts to the hiring manager. The correct response is to stay curious, ask a single clarifying question, and separate \"bad timing\" from \"not a priority.\" Practicing this specific scenario twenty times before your interview is one of the highest-leverage things you can do." },
          { q: 'Should I use a script in my SDR interview roleplay?', a: "Scripts are starting points, not word-for-word templates. The scripts in this guide show you the structure and instincts behind strong responses — but the best responses are ones that feel natural coming from you, not recited. Use the scripts to understand what to do and why, then practice adapting the language until it sounds like you rather than something you memorized. The goal is internalizing the approach, not performing a script." },
        ],
      },
      { type: 'cta', title: 'Practice these scenarios before it counts.', subtitle: 'Realistic AI hiring manager. All 9 scenarios. Instant feedback after every session. Built for job seekers — not enterprise sales teams.', ctaLabel: 'Start Free — No Credit Card →' },
    ],
  },
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
            <Link to="/compare/cadenceai-vs-yoodli" className="underline text-foreground hover:opacity-80">
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
