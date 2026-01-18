import { createFileRoute, Link } from "@tanstack/react-router";
import { Info, Heart, Shield, BookOpen, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <section className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-mint">
          <Info className="w-6 h-6 text-sage" />
        </div>
        <h1 className="text-2xl">About Gentle Disagree</h1>
      </section>

      {/* What is Soft Startup */}
      <section className="card space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-sage" />
          <h2 className="text-lg font-semibold">What is "Soft Startup"?</h2>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed">
          The "Soft Startup" technique was developed by Drs. John and Julie
          Gottman, who have studied over 30,000 couples. Their research shows
          that the first three minutes of a difficult conversation are crucial –
          how you begin determines whether you'll resolve the issue or make it
          worse.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          A soft startup sets a positive tone by expressing feelings without
          blame, using "I" statements, and making respectful requests. This
          helps both partners focus on the problem rather than attacking each
          other.
        </p>
      </section>

      {/* The 5 Steps */}
      <section className="card space-y-3">
        <h2 className="text-lg font-semibold">The 5 Steps</h2>
        <ol className="space-y-3 text-sm text-text-secondary">
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-sage text-white text-xs flex items-center justify-center flex-shrink-0">
              1
            </span>
            <div>
              <strong className="text-text-primary">Readiness Check</strong>
              <p>Make sure both partners are calm and ready to talk.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-sage text-white text-xs flex items-center justify-center flex-shrink-0">
              2
            </span>
            <div>
              <strong className="text-text-primary">Gentle Approach</strong>
              <p>Set a teamwork mindset with calm, respectful communication.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-sage text-white text-xs flex items-center justify-center flex-shrink-0">
              3
            </span>
            <div>
              <strong className="text-text-primary">I-Statement</strong>
              <p>
                Express feelings without blame: "I feel [emotion] when
                [situation]."
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-sage text-white text-xs flex items-center justify-center flex-shrink-0">
              4
            </span>
            <div>
              <strong className="text-text-primary">Problem Description</strong>
              <p>Focus on one specific issue with facts, not accusations.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-sage text-white text-xs flex items-center justify-center flex-shrink-0">
              5
            </span>
            <div>
              <strong className="text-text-primary">Respectful Request</strong>
              <p>Ask for what you need in a gentle, constructive way.</p>
            </div>
          </li>
        </ol>
      </section>

      {/* Privacy */}
      <section className="card space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-sage" />
          <h2 className="text-lg font-semibold">Your Privacy</h2>
        </div>
        <ul className="space-y-2 text-sm text-text-secondary">
          <li className="flex items-start gap-2">
            <span className="text-sage">✓</span>
            <span>All conversations stay on your device only</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage">✓</span>
            <span>No accounts or sign-ups required</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage">✓</span>
            <span>No data is ever sent to any server</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage">✓</span>
            <span>Delete your data anytime</span>
          </li>
        </ul>
      </section>

      {/* Credits */}
      <section className="card space-y-3">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-sage" />
          <h2 className="text-lg font-semibold">Resources & Credits</h2>
        </div>
        <div className="text-sm text-text-secondary space-y-2">
          <p>
            The techniques in this app are based on research by The Gottman
            Institute and Therapist Aid.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="https://www.gottman.com"
              target="_blank"
              rel="noopener noreferrer"
              className="phrase-chip flex items-center gap-1"
            >
              The Gottman Institute
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://www.therapistaid.com"
              target="_blank"
              rel="noopener noreferrer"
              className="phrase-chip flex items-center gap-1"
            >
              Therapist Aid
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <Link
          to="/session/new"
          className="btn-primary inline-flex items-center gap-2"
        >
          <Heart className="w-5 h-5" />
          Start a Conversation
        </Link>
      </section>
    </div>
  );
}
