import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const rows: { feature: string; cadence: string | boolean; competitor: string | boolean }[] = [
  { feature: 'Built for candidates (not enterprise sales teams)', cadence: true, competitor: false },
  { feature: 'Realistic AI interviewers with distinct personalities', cadence: true, competitor: true },
  { feature: 'Instant feedback after every session', cadence: true, competitor: true },
  { feature: 'Pricing aligned to a job search (not annual contracts)', cadence: true, competitor: false },
  { feature: 'Streaks & gamified daily practice', cadence: true, competitor: false },
  { feature: 'Used by sales orgs to onboard reps', cadence: false, competitor: true },
];

const Cell = ({ value }: { value: string | boolean }) => {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="h-5 w-5 text-foreground mx-auto" />
    ) : (
      <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
    );
  }
  return <span className="text-sm text-foreground">{value}</span>;
};

const CompareHyperbound = () => {
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

        <header className="text-center mb-12">
          <p className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-3">
            Comparison
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            CadenceAI vs Hyperbound
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Both use AI to simulate sales conversations. They're built for very different people.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="border border-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-2">CadenceAI</h2>
            <p className="text-sm text-muted-foreground">
              Made for aspiring SDRs and AEs preparing for real interviews. Personal pricing, daily
              practice, gamified progress.
            </p>
          </div>
          <div className="border border-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-2">Hyperbound</h2>
            <p className="text-sm text-muted-foreground">
              Made for sales teams to onboard and coach reps in role-play scenarios at scale.
              Enterprise-focused.
            </p>
          </div>
        </div>

        <div className="border border-border rounded-xl overflow-hidden mb-12">
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
                  Hyperbound
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-6 py-4 text-sm text-foreground">{row.feature}</td>
                  <td className="px-6 py-4 text-center">
                    <Cell value={row.cadence} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Cell value={row.competitor} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center p-8 border border-border rounded-xl bg-muted/30">
          <h3 className="text-2xl font-semibold text-foreground mb-3">
            Preparing for an interview, not onboarding a team?
          </h3>
          <p className="text-muted-foreground mb-6">
            CadenceAI is built for you. Try it free.
          </p>
          <Button size="lg" onClick={() => navigate('/signup')}>
            Try CadenceAI Free
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompareHyperbound;
