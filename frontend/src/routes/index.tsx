import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Shield, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="max-w-md mx-auto space-y-8 animate-fade-in">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-mint animate-breathe">
          <Heart className="w-10 h-10 text-sage" />
        </div>

        <h1 className="text-3xl">Navigate Conflict Together</h1>

        <p className="text-text-secondary text-lg leading-relaxed">
          A gentle guide to help you and your partner work through disagreements
          with understanding and respect.
        </p>
      </section>

      {/* Start Button */}
      <section className="text-center">
        <Link to="/session/new" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
          Start a Conversation
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Features */}
      <section className="space-y-4">
        <div className="card-soft flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-sage" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary mb-1">
              Completely Private
            </h3>
            <p className="text-text-secondary text-sm">
              Your conversations stay on this device only. Nothing is stored on
              any server.
            </p>
          </div>
        </div>

        <div className="card-soft flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-sage" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary mb-1">
              Guided Steps
            </h3>
            <p className="text-text-secondary text-sm">
              Follow the "Soft Startups" technique, backed by decades of
              relationship research.
            </p>
          </div>
        </div>

        <div className="card-soft flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center flex-shrink-0">
            <Heart className="w-5 h-5 text-sage" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary mb-1">
              Share One Device
            </h3>
            <p className="text-text-secondary text-sm">
              Take turns speaking and listening, passing the device like a
              talking stick.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="card">
        <h2 className="text-xl mb-4 text-center">How It Works</h2>
        <ol className="space-y-3 text-text-secondary">
          <li className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-sage text-white text-sm flex items-center justify-center flex-shrink-0">
              1
            </span>
            <span>Check if you're both ready to talk</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-sage text-white text-sm flex items-center justify-center flex-shrink-0">
              2
            </span>
            <span>Express feelings with "I feel..." statements</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-sage text-white text-sm flex items-center justify-center flex-shrink-0">
              3
            </span>
            <span>Describe one specific issue</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-sage text-white text-sm flex items-center justify-center flex-shrink-0">
              4
            </span>
            <span>Make a respectful request</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-sage text-white text-sm flex items-center justify-center flex-shrink-0">
              5
            </span>
            <span>Switch roles and listen</span>
          </li>
        </ol>
      </section>

      {/* Affirmation */}
      <div className="affirmation">
        <Sparkles className="w-4 h-4" />
        <span>Every conversation is a chance to grow closer.</span>
      </div>
    </div>
  );
}
