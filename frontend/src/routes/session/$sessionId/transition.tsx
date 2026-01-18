import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Heart, ArrowRight, RefreshCw } from "lucide-react";
import { useLocalSession } from "@/hooks/useLocalSession";

export const Route = createFileRoute("/session/$sessionId/transition")({
  component: TransitionPage,
});

function TransitionPage() {
  const { sessionId } = Route.useParams();
  const navigate = useNavigate();
  const { session, loading } = useLocalSession(sessionId);

  if (loading) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="animate-pulse text-text-muted">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <p className="text-text-muted mb-4">Session not found.</p>
        <Link to="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    );
  }

  // Partner A just finished, now it's Partner B's turn
  const finishedPartner = session.partnerA;
  const nextPartner = session.partnerB;

  const handleContinue = () => {
    navigate({
      to: "/session/$sessionId/readiness",
      params: { sessionId },
    });
  };

  return (
    <div className="max-w-md mx-auto space-y-8 animate-fade-in text-center">
      {/* Icon */}
      <div className="py-8">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-mint animate-breathe">
          <RefreshCw className="w-12 h-12 text-sage" />
        </div>
      </div>

      {/* Message */}
      <section className="space-y-4">
        <h1 className="text-2xl">Time to Switch</h1>
        <p className="text-text-secondary text-lg">
          <strong>{finishedPartner}</strong> has finished sharing.
        </p>
      </section>

      {/* Gratitude */}
      <div className="affirmation">
        <Heart className="w-4 h-4" />
        <span>Thank you for listening with an open heart.</span>
      </div>

      {/* Instructions */}
      <section className="card">
        <p className="text-text-secondary mb-4">
          Please pass the device to <strong>{nextPartner}</strong>.
        </p>
        <p className="text-sm text-text-muted">
          {nextPartner} will now have a chance to share their perspective using
          the same guided steps.
        </p>
      </section>

      {/* Continue Button */}
      <section>
        <button
          onClick={handleContinue}
          className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
        >
          {nextPartner} is Ready
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      {/* Reminder */}
      <p className="text-sm text-text-muted">
        Remember: Listen with curiosity, not judgment.
      </p>
    </div>
  );
}
