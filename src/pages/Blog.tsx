import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const posts = [
  {
    slug: 'how-to-get-sdr-job-no-experience-2026',
    title: 'How to Get an SDR Job With No Sales Experience (2026 Guide)',
    excerpt:
      "You don't need a sales background to break into tech sales. You need to understand what the interview actually is — and get enough reps before you walk in the door.",
    date: 'April 2026',
    readTime: '12 min read',
  },
  {
    slug: '5-mistakes-sdr-interviews',
    title: '5 Mistakes That Tank SDR Interviews (And How to Fix Them)',
    excerpt:
      'The most common reasons aspiring SDRs get rejected — and the small adjustments that turn a "no" into an offer.',
    date: 'April 21, 2026',
    readTime: '6 min read',
  },
];

const Blog = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 max-w-3xl py-16">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to home
        </button>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">Blog</h1>
          <p className="text-lg text-muted-foreground">
            Practical advice on landing your next sales role.
          </p>
        </header>

        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="border border-border rounded-xl p-6 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <Calendar className="h-3.5 w-3.5" />
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">{post.title}</h2>
              <p className="text-muted-foreground mb-4">{post.excerpt}</p>
              <Button variant="outline" size="sm" onClick={() => navigate(`/blog/${post.slug}`)}>
                Read post <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
