import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Mic } from "lucide-react";

const Register = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set target date: September 24, 2025 7 PM EST
    const targetDate = new Date("2025-09-24T19:00:00-05:00");

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Logo Header */}
      <div className="relative z-10 p-4 text-center">
        <Link to="/" className="inline-block">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <Mic className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">Cadence</span>
          </div>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-muted/50 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-base font-medium">📹 Free Live Webinar Reveals:</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            Everything You Need To Land Your First{" "}
            <span className="text-primary">
              $10k+/Month AI Operating Client
            </span>{" "}
            in the Next 90 Days
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12">
            (Even If You're Starting From Zero)
          </p>

          {/* Webinar Details */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 mb-8">
            <div className="text-lg font-semibold text-primary mb-2">Free Live Webinar:</div>
            <div className="text-xl mb-6">September 24, 2025 7 PM EST</div>
            
            {/* Countdown Timer */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </div>
                <div className="text-sm uppercase tracking-wider text-muted-foreground">Hour</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </div>
                <div className="text-sm uppercase tracking-wider text-muted-foreground">Minute</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-sm uppercase tracking-wider text-muted-foreground">Second</div>
              </div>
            </div>
            
            <Button size="lg" className="text-lg px-8 py-6 font-semibold">
              Save My Spot!
            </Button>
          </div>
        </div>
      </section>

      {/* Authority Bypass System */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Introducing The{" "}
            <span className="italic text-primary">
              "Authority Bypass"
            </span>{" "}
            System
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-16">
            The Ultimate Way To Land High-Paying AI Operating Clients Without Spamming Outbound Or Facing Constant Rejection
          </p>

          {/* Reasons */}
          <div className="space-y-12 text-left">
            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-8">
              <h3 className="text-xl font-bold text-primary mb-4">
                Reason #1: Skip The "Prove Yourself" Phase By Demonstrating Competency Upfront
              </h3>
              <p className="text-lg leading-relaxed text-muted-foreground">
                While other marketers spend months trying to build credibility through content and testimonials, The Authority Bypass system allows you to show your expertise through samples and audits. When prospects see your work before your resume, experience becomes irrelevant.
              </p>
            </div>

            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-8">
              <h3 className="text-xl font-bold text-primary mb-4">
                Reason #2: Bypass Traditional Gatekeepers By Going Straight To Decision Makers
              </h3>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Instead of competing with dozens of other pitches that get filtered out by assistants or ignored in crowded inboxes, you cut through the noise by delivering immediate value. Decision makers pay attention when you solve their problems before asking for anything.
              </p>
            </div>

            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-8">
              <h3 className="text-xl font-bold text-primary mb-4">
                Reason #3: Transform From "Another Service Provider" To "The Expert They Need" In One Interaction
              </h3>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Why spend years building authority when you can demonstrate it instantly? The Authority Bypass System positions you as the obvious choice by showing prospects exactly how you'll improve their business through free samples and strategic insights.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <Button size="lg" className="text-lg px-8 py-6 font-semibold">
              Save My Spot!
            </Button>
          </div>
        </div>
      </section>

      {/* What's Covered */}
      <section className="py-20 px-6 bg-gradient-to-br from-card/20 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-16">
            What Are We Covering On This Free Webinar To Help You Get Your First{" "}
            <span className="text-primary">
              $10k/Mo Client ASAP?
            </span>
          </h2>

          <div className="space-y-8 text-left">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2">
                Introduction: How AI Operating Works And Why It's Replacing Traditional Agencies
              </h3>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2">
                Secret #1: The $10K Client Blueprint
              </h3>
              <p className="text-muted-foreground">
                How To Identify Personal Brands With Million-Dollar Potential And Broken Systems (The 3 Client Situations That Pay The Most)
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2">
                Secret #2: The AI-Powered Authority Engine
              </h3>
              <p className="text-muted-foreground">
                How To Use AI To Research Any Prospect In 15 Minutes And Create Samples That Position You As The Obvious Expert Choice
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2">
                Secret #3: The Partnership Revenue Formula
              </h3>
              <p className="text-muted-foreground">
                How To Structure 20-30% Revenue Share Deals That Make Clients Eager To Pay You Like A Business Partner (Not A Service Provider)
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2">
                Live Q+A With Ben, Guest Speakers (Students Landing $10k+ Clients), And Special Bonuses For Attendees
              </h3>
            </div>
          </div>

          <div className="mt-12">
            <Button size="lg" className="text-lg px-8 py-6 font-semibold">
              Save My Spot!
            </Button>
          </div>
        </div>
      </section>


      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">
            Ready To Get Started?
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12">
            For A Limited Time Only, This Webinar Is 100% FREE! Register Today.
          </p>
          
          <Button size="lg" className="text-lg px-8 py-6 font-semibold mb-8">
            Save My Spot!
          </Button>
          
          <div className="text-lg font-semibold">
            Wednesday, September 24, 2025 7PM EST
          </div>
        </div>
      </section>

      {/* Legal Disclaimers */}
      <section className="py-12 px-6 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-bold mb-4">IMPORTANT: Earnings and Legal Disclaimers</h3>
          <div className="text-sm text-muted-foreground space-y-4 leading-relaxed">
            <p>
              We don't believe in get-rich-quick programs. We believe in hard work, adding value and serving others. And that's what my programs are designed to help you do. As stated by law, we can not and do not make any guarantees about your own ability to get results or earn any money with our ideas, information, programs or strategies. We don't know you and, besides, your results in life are up to you. Any financial numbers referenced here, or on any of our sites or emails, are simply estimates or projections or past results, and should not be considered exact, actual or as a promise of potential earnings.
            </p>
            <p>
              NOT FACEBOOK™: This site is not a part of the Facebook™ website or Facebook Inc. Additionally, This site is NOT endorsed by Facebook™ in any way. FACEBOOK™ is a trademark of FACEBOOK™, Inc.
            </p>
            <p>
              We use cookies, including third-party cookies, on this website to help operate our site and for analytics and advertising purposes. For more on how we use cookies and your cookie choices, go here for our cookie policy!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;