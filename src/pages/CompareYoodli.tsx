import { useNavigate } from 'react-router-dom';
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

  return (
    <div className="min-h-screen bg-background">
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
              Both tools are useful. They just solve different problems.
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

        <section className="mb-16 border border-border rounded-xl p-8 bg-muted/20">
          <p className="text-lg text-foreground italic leading-relaxed mb-4">
            "I tried a couple of speech tools before my SDR interviews. They told me I said 'um' too
            much. CadenceAI told me my discovery questions were weak — and gave me a hiring manager
            to practice them on. That's what actually got me the offer."
          </p>
          <p className="text-sm text-muted-foreground">— CadenceAI user</p>
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
