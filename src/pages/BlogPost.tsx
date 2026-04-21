import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Post = {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  body: { heading?: string; text: string }[];
};

const posts: Record<string, Post> = {
  '5-mistakes-sdr-interviews': {
    slug: '5-mistakes-sdr-interviews',
    title: '5 Mistakes That Tank SDR Interviews (And How to Fix Them)',
    date: 'April 21, 2026',
    readTime: '6 min read',
    body: [
      {
        text: "Most aspiring SDRs don't lose interviews because they aren't smart or driven enough — they lose them in small, fixable ways. Here are the five we see most often.",
      },
      {
        heading: '1. Treating "Why sales?" like a throwaway',
        text: 'Hiring managers ask this in every single interview. A vague "I like talking to people" answer signals that you haven\'t thought about the job seriously. Have a sharp, two-sentence story.',
      },
      {
        heading: '2. No real research on the company',
        text: "Naming the product is not research. Know who they sell to, the typical deal size, and one recent piece of news. It takes 15 minutes and separates you from 80% of candidates.",
      },
      {
        heading: '3. Freezing on the role-play',
        text: "The cold-call role-play is where most candidates collapse. The fix isn't a clever script — it's reps. Practice until the structure feels boring.",
      },
      {
        heading: '4. Asking weak questions at the end',
        text: '"What\'s the culture like?" is not a question. Ask about ramp expectations, how reps hit quota, and what separates the top performer from the median.',
      },
      {
        heading: '5. Not following up',
        text: 'A short, specific follow-up email referencing something you actually discussed will keep you top of mind. Send it within 24 hours.',
      },
      {
        text: "None of this is hard. It just requires reps under pressure — which is exactly what Cadence is built for.",
      },
    ],
  },
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
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <Calendar className="h-3.5 w-3.5" />
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            {post.title}
          </h1>
        </header>

        <article className="space-y-6">
          {post.body.map((block, i) => (
            <div key={i}>
              {block.heading && (
                <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">
                  {block.heading}
                </h2>
              )}
              <p className="text-base text-muted-foreground leading-relaxed">{block.text}</p>
            </div>
          ))}
        </article>

        <div className="mt-16 p-6 border border-border rounded-xl bg-muted/30 text-center">
          <p className="text-foreground font-medium mb-3">
            Practice these in a real interview simulation.
          </p>
          <Button onClick={() => navigate('/signup')}>Try CadenceAI free</Button>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
