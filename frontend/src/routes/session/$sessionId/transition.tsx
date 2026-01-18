import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Heart, ArrowRight, RefreshCw, MessageCircle, HandHeart } from "lucide-react";
import { useLocalSession } from "@/hooks/useLocalSession";

export const Route = createFileRoute("/session/$sessionId/transition")({
  component: TransitionPage,
});

function TransitionPage() {
  const { sessionId } = Route.useParams();
  const navigate = useNavigate();
  const { session, loading, nextStep } = useLocalSession(sessionId);

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
    const result = nextStep();
    if (result?.nextRoute) {
      navigate({ to: result.nextRoute });
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in text-center">
      {/* Icon */}
      <div className="py-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-mint animate-breathe">
          <RefreshCw className="w-10 h-10 text-sage" />
        </div>
      </div>

      {/* Message */}
      <section className="space-y-3">
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

      {/* Pass device instruction */}
      <section className="card bg-sage/10 border-sage/20">
        <p className="text-lg font-medium text-sage-dark mb-2">
          Please pass the device to {nextPartner}
        </p>
        <p className="text-sm text-text-muted">
          {nextPartner}, when you're ready, tap the button below.
        </p>
      </section>

      {/* What Partner B will do */}
      <section className="card space-y-4 text-left">
        <p className="text-sm font-medium text-text-primary text-center">
          {nextPartner}, here's what you'll do:
        </p>

        <div className="space-y-3">
          {/* Phase 1: Respond */}
          <div className="flex items-start gap-3 p-3 bg-sand/50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-sage text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
              1
            </div>
            <div>
              <p className="font-medium text-text-primary flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-sage" />
                Respond
              </p>
              <p className="text-sm text-text-muted">
                Reflect on what {finishedPartner} shared and respond to their request
              </p>
            </div>
          </div>

          {/* Phase 2: Share */}
          <div className="flex items-start gap-3 p-3 bg-sand/50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-sage text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
              2
            </div>
            <div>
              <p className="font-medium text-text-primary flex items-center gap-2">
                <HandHeart className="w-4 h-4 text-sage" />
                Share
              </p>
              <p className="text-sm text-text-muted">
                Share your own feelings and make a request (optional)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Continue Button */}
      <section>
        <button
          onClick={handleContinue}
          className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4"
        >
          I'm {nextPartner} – I'm Ready
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      {/* Reminder */}
      <p className="text-sm text-text-muted">
        Remember: Both perspectives matter in finding resolution.
      </p>
    </div>
  );
}
