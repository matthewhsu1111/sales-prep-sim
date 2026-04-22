import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const rows: { feature: string; cadence: string | boolean; competitor: string | boolean }[] = [
  { feature: 'Built for', cadence: 'SDR & AE job seekers', competitor: 'Anyone improving public speaking' },
  { feature: 'What it actually coaches', cadence: 'What you say in a sales conversation', competitor: 'How you say it (filler words, pace, clarity)' },
  { feature: 'Roleplay realism', cadence: 'Hiring managers & prospects with distinct personalities', competitor: 'Generic AI listener' },
  { feature: 'Sales-specific scenarios', cadence: true, competitor: false },
  { feature: 'Objection handling practice', cadence: true, competitor: false },
  { feature: 'Free tier', cadence: 'Full interview reps included', competitor: 'Limited speech analysis' },
  { feature: 'Price', cadence: 'Aligned to a job search', competitor: 'Subscription for ongoing speech coaching' },
];

const faqs = [
  {
    q: 'CadenceAI vs Yoodli — which is better for SDR interview prep?',
    a: "CadenceAI is purpose-built for SDR and AE interview prep — realistic hiring manager personas, sales-specific roleplay scenarios, and objection handling feedback. Yoodli is a general-purpose speech coach that scores how you talk (filler words, pace) but doesn't simulate a sales interview or push back like a real interviewer. If your goal is to pass an SDR roleplay, CadenceAI is the right tool.",
  },
  {
    q: 'Does Yoodli help with sales roleplay interviews?',
    a: "Not directly. Yoodli analyzes delivery — pacing, filler words, eye contact — across any speaking context. It doesn't run sales-specific scenarios, doesn't raise objections like a hiring manager would, and doesn't coach you on what to actually say in a cold call roleplay. It's a useful delivery tool, not an interview simulator.",
  },
  {
    q: 'Is CadenceAI free?',
    a: "Yes. CadenceAI has a generous free tier with full interview reps included — no credit card required. Paid tiers are priced for job seekers, not enterprise sales teams.",
  },
  {
    q: 'Can I use both Yoodli and CadenceAI?',
    a: "Sure. They solve different problems. Use Yoodli to clean up filler words and delivery polish across any speaking context. Use CadenceAI to actually practice the SDR or AE interview itself — hiring manager personas, objections, sales roleplay reps. Most candidates only need CadenceAI for the interview specifically.",
  },
];

const Cell = ({ value, primary }: { value: string | boolean; primary?: boolean }) => {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="h-5 w-5 text-foreground mx-auto" />
    ) : (
      <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
    );
  }
  return <span className={`text-sm ${primary ? 'text-foreground' : 'text-muted-foreground'}`}>{value}</span>;
};

const CompareYoodli = () => {
  const navigate = useNavigate();

  const canonicalUrl = 'https://cadenceai.app/compare/cadenceai-vs-yoodli';
  const title = 'CadenceAI vs Yoodli: Which Is Better for SDR Interview Prep? (2026)';
  const description =
    "CadenceAI vs Yoodli compared. Yoodli coaches how you speak. CadenceAI coaches what you say in a sales interview. Here's which to choose for SDR and AE interview prep in 2026.";

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
    keywords: 'CadenceAI vs Yoodli, Yoodli alternative, SDR interview prep, sales roleplay practice, AI sales interview app',
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
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
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

        <header className="text-center mb-14">
          <p className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-3">
            Comparison
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-5">
            CadenceAI vs Yoodli
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Yoodli coaches <span className="text-foreground font-medium">how</span> you speak.
            CadenceAI coaches <span className="text-foreground font-medium">what</span> you say.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="border border-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-2">CadenceAI</h2>
            <p className="text-sm text-muted-foreground">
              Built for SDR and AE candidates preparing for real interviews. Realistic hiring-manager
              roleplays, objection handling, and sales-specific scenarios.
            </p>
          </div>
          <div className="border border-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-2">Yoodli</h2>
            <p className="text-sm text-muted-foreground">
              An AI speech coach. Helps you reduce filler words, improve pacing, and sharpen general
              communication across any speaking context.
            </p>
          </div>
        </div>

        <div className="border border-border rounded-xl overflow-hidden mb-16">
          <table className="w-full">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left text-xs font-semibold tracking-wider text-foreground uppercase px-6 py-4">
                  Feature
                </th>
                <th className="text-center text-xs font-semibold tracking-wider text-foreground uppercase px-6 py-4">
                  CadenceAI
                </th>
                <th className="text-center text-xs font-semibold tracking-wider text-muted-foreground uppercase px-6 py-4">
                  Yoodli
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-6 py-4 text-sm text-foreground align-top">{row.feature}</td>
                  <td className="px-6 py-4 text-center align-top">
                    <Cell value={row.cadence} primary />
                  </td>
                  <td className="px-6 py-4 text-center align-top">
                    <Cell value={row.competitor} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            The core difference
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Yoodli is a <span className="text-foreground font-medium">speech coach</span>. It
              listens to you talk and tells you when you say "um," when your pace drifts, and when
              your message could be clearer. It's a great tool if your goal is to be a more polished
              speaker in any context — presentations, meetings, public speaking.
            </p>
            <p>
              CadenceAI is a <span className="text-foreground font-medium">sales conversation coach</span>.
              It puts a hiring manager or prospect on the other end of the call, pushes back on you
              the way a real interviewer would, and evaluates whether your answers and roleplay
              actually move the conversation forward. The goal isn't to sound smoother — it's to
              walk into your SDR interview and close it.
            </p>
            <p>
              Both tools are useful. They just solve different problems. For a full breakdown of
              every sales interview practice tool in 2026, see our{' '}
              <Link
                to="/blog/best-app-practice-sales-interview"
                className="underline text-foreground hover:opacity-80"
              >
                ranked guide to the best apps for sales interview practice
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="mb-16 grid md:grid-cols-2 gap-6">
          <div className="border border-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-2">Use Yoodli if…</h3>
            <p className="text-sm text-muted-foreground">
              You want to fix filler words, improve pacing, or become a more confident speaker
              across any setting.
            </p>
          </div>
          <div className="border border-border rounded-xl p-6 bg-muted/30">
            <h3 className="font-semibold text-foreground mb-2">Use CadenceAI if…</h3>
            <p className="text-sm text-muted-foreground">
              You want to pass your SDR or AE interview roleplay — with realistic pushback,
              objections, and feedback on what you actually said.
            </p>
          </div>
        </section>

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

        <div className="text-center p-8 border border-border rounded-xl">
          <h3 className="text-2xl font-semibold text-foreground mb-3">
            Preparing for an SDR or AE interview?
          </h3>
          <p className="text-muted-foreground mb-6">
            Get realistic reps before it counts. Free to start.
          </p>
          <Button size="lg" onClick={() => navigate('/signup')}>
            Try CadenceAI Free
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompareYoodli;
