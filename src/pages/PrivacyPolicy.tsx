import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Button>

        <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: April 19, 2026</p>

        <div className="space-y-6 text-foreground/90 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Overview</h2>
            <p>
              Cadence AI ("we", "us") provides AI-powered sales interview practice. This policy
              explains what data we collect, how we use it, and the choices you have.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Information we collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account info:</strong> name, email, and authentication identifiers.</li>
              <li><strong>Practice data:</strong> interview transcripts, audio recordings, scores, and feedback.</li>
              <li><strong>Usage data:</strong> session activity, streaks, XP, and device information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">How we use it</h2>
            <p>
              To deliver the service (run AI interviews, generate feedback), improve product quality,
              maintain security, and — only if you opt in — display your first name on the leaderboard.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Sharing</h2>
            <p>
              We do not sell your personal data. We share limited data with processors that power the
              product (e.g. hosting, speech-to-text, AI evaluation) under standard data-processing terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Your choices</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Toggle leaderboard visibility in Settings.</li>
              <li>Request deletion of your account and associated data by contacting us.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Contact</h2>
            <p>
              Questions? Reach out via{' '}
              <a
                href="https://www.linkedin.com/in/matthewhsu6/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-4 hover:underline"
              >
                LinkedIn
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
