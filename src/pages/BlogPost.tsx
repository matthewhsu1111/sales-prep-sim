import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'callout'; title: string; text: string }
  | { type: 'levels' }
  | { type: 'background-table' }
  | { type: 'cta' };

type Post = {
  slug: string;
  title: string;
  subtitle?: string;
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
      { type: 'p', text: "None of this is hard. It just requires reps under pressure — which is exactly what Cadence is built for." },
      { type: 'cta' },
    ],
  },
  'how-to-get-sdr-job-no-experience-2026': {
    slug: 'how-to-get-sdr-job-no-experience-2026',
    title: 'How to Get an SDR Job With No Sales Experience (2026 Guide)',
    subtitle: "You don't need a sales background to break into tech sales. You need to understand what the interview actually is — and get enough reps before you walk in the door.",
    date: 'April 2026',
    readTime: '12 min read',
    audience: 'For career changers & new grads',
    body: [
      { type: 'p', text: "Let's be honest about what's happening when you apply for an SDR role with no sales experience." },
      { type: 'p', text: "You're scrolling job listings at midnight. You see the $65,000 base, the uncapped commission, the \"no cold calling experience required.\" You apply. Maybe you get a first-round interview. And then they ask you to do a roleplay — sell them something, handle an objection, cold call the interviewer right now — and your mind goes completely blank." },
      { type: 'p', text: "You freeze. You stumble. You leave thinking you're just not cut out for this." },
      { type: 'p', text: "Here's what nobody tells you: that feeling has nothing to do with whether you can do the job. It has everything to do with the fact that you've never done that specific thing under pressure before. And the only way to fix that is reps — not reading, not watching YouTube videos, not memorizing scripts. Reps." },
      { type: 'p', text: "But before we get to practice, let's fix the biggest mindset mistake career changers make walking into these interviews." },

      { type: 'h2', text: 'Stop Thinking of It as an Interview' },
      { type: 'p', text: "The single most powerful reframe you can make — and this applies whether you're coming from teaching, retail, the military, or hospitality — is to stop treating the SDR interview like a job interview and start treating it like a sales call where the product is you." },
      { type: 'p', text: "Think about what an SDR actually does every day: they call strangers, create interest in something, handle objections, and try to move the conversation forward to the next step. A hiring manager is watching you do exactly that during your interview. They're not evaluating your resume. They're evaluating whether you'd buy from you." },
      { type: 'quote', text: "You are a salesperson and the product that you're selling is yourself — and you're going to close this deal." },
      { type: 'p', text: "This means every answer you give, every question you ask, every moment of energy or hesitation — it all signals how you'll perform on the phones. A confident, curious, well-prepared candidate who closes the interviewer at the end of the call will almost always beat the candidate with more experience who shows up passive and waits to be evaluated." },
      { type: 'p', text: "The good news for career changers: you actually have something experienced SDR candidates often lack. You have a story. And story is what wins interviews." },

      { type: 'h2', text: 'Why Your Non-Sales Background Is Actually an Asset' },
      { type: 'p', text: "Hiring managers at tech companies aren't looking for people who've already done the job. If they were, SDR roles would require 3 years of SDR experience. They don't — because almost every SDR is hired green and trained from scratch." },
      { type: 'p', text: "What they're actually looking for is evidence you can learn fast, handle rejection, talk to strangers, and stay coachable. When you map your real background against those needs, it starts to look pretty different:" },
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

      { type: 'h2', text: 'The Three Levels of Interview Readiness' },
      { type: 'p', text: "Here's a framework for understanding exactly where you are in your prep — and what you should be focused on:" },
      { type: 'levels' },
      { type: 'p', text: "Most candidates walk into a final-round interview still solving Level 1 problems — trying to figure out what to say while they're saying it. That is what the freeze is. When you're at Level 3, the freeze doesn't happen because the answer is already there. You're just performing it." },
      { type: 'p', text: "The only way to get from Level 1 to Level 3 is to do the roleplay over and over — not in your head, not on paper, out loud with something pushing back." },

      { type: 'h2', text: 'How to Actually Practice (Not Just Prepare)' },
      { type: 'p', text: "There's a difference between preparing and practicing. Preparing is reading interview tips, memorizing answers, watching YouTube videos. Practicing is doing the thing until you can do it without thinking." },
      { type: 'p', text: "Think about it this way: a pilot doesn't read about landing a plane and then land a plane. They do it hundreds of times in a simulator where the conditions are real and things go wrong, before a single passenger is on board." },
      { type: 'p', text: "The SDR interview is your landing. The roleplay is your most turbulent moment. You need a simulator, not a study guide." },
      { type: 'callout', title: 'The thing nobody tells you', text: "The hiring manager is the first persona you'll ever sell to in this career. Before you ever call a VP of Sales at a real prospect company, you're calling a VP of Sales in that interview room. CadenceAI puts that hiring manager in front of you — with realistic pushback, realistic objections, and realistic personalities — before it counts. So by the time you're in the real room, you've already done it fifty times." },
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

      { type: 'h2', text: 'The Honest Truth About Breaking In' },
      { type: 'p', text: "People break into SDR roles from every possible background — teaching, military, retail, hospitality, corporate ops, zero experience. The ones who make it aren't necessarily the most talented or the most credentialed. They're the ones who showed up to the interview already knowing what it felt like to be in that chair — because they'd been there before, in practice." },
      { type: 'p', text: "The interview is a performance. Performances improve with rehearsal. The question is whether you rehearse enough before the show — or whether you try to figure it out live, with a real hiring manager watching, and everything on the line." },
      { type: 'p', text: "You already have more going for you than you think. You just need the reps." },
      { type: 'cta' },
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

  return (
    <div className="min-h-screen bg-background">
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
            <p className="text-lg text-muted-foreground leading-relaxed">{post.subtitle}</p>
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
              case 'cta':
                return (
                  <div
                    key={i}
                    className="mt-12 p-8 border border-border rounded-xl bg-muted/30 text-center"
                  >
                    <p className="text-foreground font-semibold text-lg mb-2">
                      Get the reps in before it counts.
                    </p>
                    <p className="text-sm text-muted-foreground mb-5">
                      Practice with realistic AI hiring managers. Free to start.
                    </p>
                    <Button size="lg" onClick={() => navigate('/signup')}>
                      Try CadenceAI free
                    </Button>
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
