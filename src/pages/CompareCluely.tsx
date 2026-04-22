import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Check, X, AlertTriangle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Row = { feature: string; cluely: string | boolean; cadence: string | boolean };

const rows: Row[] = [
  { feature: 'Works during the live interview', cluely: 'Yes (invisible overlay)', cadence: 'Practice only — before the interview' },
  { feature: 'Builds actual sales skill', cluely: false, cadence: "Yes — that's the entire product" },
  { feature: 'Realistic hiring manager simulation', cluely: "Reacts to what's said, doesn't simulate", cadence: 'Multiple personas, personalities, difficulty levels' },
  { feature: 'Objection handling practice', cluely: false, cadence: 'Core feature' },
  { feature: 'Built for SDR/AE job seekers', cluely: 'Generic use cases', cadence: 'Specifically and only' },
  { feature: 'Helps on the actual job after hiring', cluely: false, cadence: 'Skills transfer directly' },
  { feature: 'Risk of detection / consequences', cluely: 'High — has a $75/mo "undetectability" tier', cadence: "None — it's just practice" },
  { feature: 'Free tier', cluely: '5 responses/day', cadence: 'Generous — practice as much as you need' },
  { feature: 'Price', cluely: '$20–$75/mo', cadence: 'Free + affordable paid tiers' },
];

const renderCell = (v: string | boolean, primary?: boolean) => {
  if (v === true) {
    return <Check className={`h-5 w-5 mx-auto ${primary ? 'text-primary' : 'text-foreground'}`} />;
  }
  if (v === false) {
    return <X className="h-5 w-5 text-muted-foreground/40 mx-auto" />;
  }
  return (
    <span className={`text-xs leading-snug ${primary ? 'text-foreground' : 'text-muted-foreground'}`}>
      {v}
    </span>
  );
};

const faqs = [
  {
    q: 'Does Cluely actually work for sales interviews?',
    a: "Technically yes — it can feed you suggested responses during a live interview that only you can see. Whether interviewers can detect it is a separate question that Cluely's own $75/month \"undetectability\" tier implicitly answers. The more important question is what happens after: a candidate who passes a sales interview with AI prompts still has to do the sales job without them.",
  },
  {
    q: 'Is using Cluely in a job interview cheating?',
    a: "It depends on the company's policies, but most employers would consider receiving undisclosed real-time AI assistance during an interview to be misrepresentation. Some companies now explicitly prohibit AI assistance during interviews. Beyond the policy question, the practical risk is getting a role you're not prepared for — which typically ends poorly for both sides.",
  },
  {
    q: "What does CadenceAI do that Cluely doesn't?",
    a: "CadenceAI builds the skill before the interview so you don't need assistance during it. It simulates realistic hiring manager personas, puts you through sales roleplay scenarios, coaches your objection handling, and gives you feedback after each session. The goal is that by the time you're in the real interview, you've already done it dozens of times and the freeze never happens.",
  },
  {
    q: 'CadenceAI vs Cluely — which should I use for SDR interview prep?',
    a: "Use CadenceAI if you want to build real skills before the interview through AI roleplay practice — objection handling, cold call simulations, hiring manager personas. Use Cluely if you want real-time prompts during the live interview itself. But understand that Cluely builds no underlying skill and carries detection risk. For anyone serious about a sales career rather than just getting a single offer, CadenceAI is the clear choice.",
  },
];

const CompareCluely = () => {
  const navigate = useNavigate();

  const canonicalUrl = 'https://cadenceai.app/compare/cadenceai-vs-cluely';
  const title = 'CadenceAI vs Cluely: Which Is Better for SDR Interview Prep? (2026)';
  const description =
    "CadenceAI vs Cluely compared. One builds real sales skills with AI roleplay before your interview. The other whispers answers during it. Here's which to choose for SDR and AE interview prep.";

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished: 'April 21, 2026',
    author: { '@type': 'Organization', name: 'CadenceAI' },
    publisher: {
      '@type': 'Organization',
      name: 'CadenceAI',
      logo: { '@type': 'ImageObject', url: 'https://cadenceai.app/favicon.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    image: 'https://cadenceai.app/og-image.png',
    keywords: 'CadenceAI vs Cluely, Cluely sales interview, SDR interview prep, AI roleplay practice, sales interview practice app',
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://cadenceai.app/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="container mx-auto px-4 max-w-4xl py-16">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to home
        </button>

        {/* Hero */}
        <header className="text-center mb-14">
          <p className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-3">
            CadenceAI vs Cluely · SDR Interview Prep
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
            CadenceAI vs Cluely:
            <br />
            <span className="text-muted-foreground">One builds skills.</span>{' '}
            <span className="text-foreground">One hides you don't have them.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Comparing CadenceAI vs Cluely for sales interview prep? One simulates the interview
            before you're in it. The other whispers answers while you're in it. Here's exactly what
            that difference costs you.
          </p>
        </header>

        {/* Verdict strip */}
        <div className="grid md:grid-cols-[1fr_auto_1fr] items-stretch gap-4 mb-16">
          <div className="border border-border rounded-2xl p-6 bg-muted/20 opacity-80">
            <h2 className="font-semibold text-muted-foreground mb-2 text-lg">Cluely</h2>
            <p className="text-sm text-muted-foreground/90 mb-4 leading-relaxed">
              Real-time AI overlay. Feeds you answers during live interviews without them knowing.
            </p>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
              <AlertTriangle className="h-3 w-3" /> Builds zero skill
            </span>
          </div>

          <div className="flex md:flex-col items-center justify-center text-muted-foreground">
            <span className="font-bold text-lg tracking-widest px-3 py-1 rounded-full border border-border">
              VS
            </span>
          </div>

          <div className="border-2 border-primary/40 rounded-2xl p-6 bg-primary/5">
            <h2 className="font-semibold text-foreground mb-2 text-lg">CadenceAI</h2>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              AI roleplay practice. Simulates the interview before you're in it so you don't need
              help when it counts.
            </p>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-primary/15 text-foreground border border-primary/30">
              <Sparkles className="h-3 w-3" /> Builds real skill
            </span>
          </div>
        </div>

        {/* Body */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            CadenceAI vs Cluely: What's the actual difference?
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              If you're comparing CadenceAI vs Cluely for SDR or AE interview prep, the answer
              comes down to one question: do you want to{' '}
              <span className="text-foreground font-medium">pass the interview</span>, or do you
              want to <span className="text-foreground font-medium">be ready for the job</span>?
              Both tools use AI. Both touch the sales interview in some way. But they operate at
              completely opposite ends of the process — and choosing the wrong one has real
              consequences.
            </p>
            <p>
              Cluely runs as an invisible overlay on your screen during the live interview. When
              the hiring manager asks you a question, Cluely transcribes it and surfaces a
              suggested answer that only you can see. You read it. You say it. They hire you. Or
              they don't — because interviewers are getting better at spotting the signs. But even
              if they don't: then what?
            </p>
            <p>
              You got the job. Now you have to do the job. And on day one, when you pick up the
              phone and a real prospect says "I'm not interested, don't call me again" — Cluely
              isn't there. There's no overlay. There's no whisper. There's just you, and a skill
              you never actually built.
            </p>
            <p>
              CadenceAI works the other way around. Before the interview, it puts you in the chair
              and gives you a realistic AI hiring manager — with a personality, with pushback, with
              the specific objections your ICP throws — and makes you handle it. Again. And again.
              Until it stops feeling like a threat and starts feeling like routine. Want to
              understand the full SDR interview process? Read our{' '}
              <Link
                to="/blog/best-app-practice-sales-interview"
                className="underline text-foreground hover:opacity-80"
              >
                breakdown of every sales interview prep tool in 2026
              </Link>
              .
            </p>
          </div>
        </section>

        <blockquote className="border-l-2 border-foreground/40 pl-5 my-12 text-lg text-foreground italic leading-relaxed">
          "The only difference between the candidate who freezes and the one who doesn't is reps.
          One of them has been in that situation before. The other is experiencing it for the first
          time — live, with everything on the line."
        </blockquote>

        {/* What happens after */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            What happens after you use each one
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="border border-destructive/30 rounded-2xl p-6 bg-destructive/5">
              <p className="text-xs font-semibold tracking-wider uppercase text-destructive mb-3">
                The Cluely path
              </p>
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  You pass the interview. The AI fed you the right answers, you came across
                  polished and prepared. They extend an offer. You start the SDR role.
                </p>
                <p>
                  Week one. You get on a cold call. A VP of Sales says "I'm slammed, not a good
                  time." You pause. You try to remember what you said in the interview. Nothing
                  comes. You stumble through a half-apology and hang up.
                </p>
                <p>
                  The problem isn't that you're bad at sales. The problem is you've never actually
                  practiced handling that moment — because Cluely handled it for you. You got the
                  job without building the skill the job requires. And now you're building it live,
                  on real prospects, with your ramp time and your manager's patience as the cost.
                </p>
              </div>
            </div>

            <div className="border border-primary/40 rounded-2xl p-6 bg-primary/5">
              <p className="text-xs font-semibold tracking-wider uppercase text-foreground mb-3">
                The CadenceAI path
              </p>
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Three weeks before your interview, you start practicing. First session: you
                  freeze when the AI hiring manager says "we already have something." Second
                  session: you stumble through an answer. Tenth session: you handle it cleanly.
                  Twentieth session: it feels automatic.
                </p>
                <p>
                  Interview day. The hiring manager runs the roleplay. They say "we already have
                  something." You pivot immediately — calm, specific, no hesitation. They notice.
                  You get the offer.
                </p>
                <p>
                  Week one on the job. Real prospect. Same objection. Same calm response. Your
                  manager listens to the recording and asks what training you did before you
                  started.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature comparison */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            Feature comparison
          </h2>
          <div className="border border-border rounded-xl overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left text-xs font-semibold tracking-wider text-foreground uppercase px-4 md:px-6 py-4">
                    Feature
                  </th>
                  <th className="text-center text-xs font-semibold tracking-wider text-muted-foreground uppercase px-4 md:px-6 py-4">
                    Cluely
                  </th>
                  <th className="text-center text-xs font-semibold tracking-wider text-foreground uppercase px-4 md:px-6 py-4">
                    CadenceAI
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-4 md:px-6 py-4 text-sm text-foreground align-top">
                      {row.feature}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-center align-middle">
                      {renderCell(row.cluely)}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-center align-middle">
                      {renderCell(row.cadence, true)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Who should use which */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            Who should use which
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="border border-border rounded-2xl p-6 bg-muted/20">
              <h3 className="font-semibold text-foreground mb-4">Use Cluely if...</h3>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex gap-2"><span className="text-muted-foreground/60">·</span> You want to pass an interview without preparing for it</li>
                <li className="flex gap-2"><span className="text-muted-foreground/60">·</span> You're okay with building skills on the job at your employer's expense</li>
                <li className="flex gap-2"><span className="text-muted-foreground/60">·</span> You're not concerned about detection risk</li>
                <li className="flex gap-2"><span className="text-muted-foreground/60">·</span> You don't plan to stay in sales long-term</li>
              </ul>
            </div>
            <div className="border-2 border-primary/40 rounded-2xl p-6 bg-primary/5">
              <h3 className="font-semibold text-foreground mb-4">Use CadenceAI if...</h3>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex gap-2"><Check className="h-4 w-4 text-foreground shrink-0 mt-0.5" /> You want to walk in confident because you've done it before</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-foreground shrink-0 mt-0.5" /> You're serious about actually being good at the job, not just getting it</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-foreground shrink-0 mt-0.5" /> You're a career changer who needs to build sales instincts fast</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-foreground shrink-0 mt-0.5" /> You want skills that compound over your entire career</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Honest truth */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            The honest truth about Cluely
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Cluely was originally built as a tool to cheat on Amazon software engineering
              interviews. The founder was suspended from Columbia University for it, raised $5.3
              million, rebranded, and launched it as — in his own words — "a cheating tool for
              everything." They even have a $75/month tier specifically marketed for its
              "undetectability."
            </p>
            <p>
              That's not a company trying to help you get better. That's a company trying to help
              you look better than you are. For one conversation. After which you're on your own.
            </p>
            <p>
              The SDR job is not one conversation. It's hundreds of cold calls, discovery calls,
              and objection-handling moments every single week. Getting the job with borrowed
              answers and showing up to the role without the skills is a setup — not a shortcut.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((item, j) => (
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
                <p className="mt-3 text-muted-foreground leading-relaxed text-sm">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center p-8 md:p-10 border border-border rounded-2xl bg-foreground text-background">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">Practice it before it counts.</h3>
          <p className="opacity-80 mb-6 max-w-md mx-auto">
            Realistic SDR and AE interview scenarios. Hiring manager personas. Objection handling.
            Built for job seekers.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('/signup')}
            className="bg-background text-foreground hover:bg-background/90"
          >
            Start Free — No Card Required →
          </Button>
          <p className="text-xs opacity-60 mt-4">
            SDR · AE · Career Changer tracks · Instant AI feedback
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompareCluely;
