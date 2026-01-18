import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, ArrowRight, Sparkles } from "lucide-react";
import { useLocalSession } from "@/hooks/useLocalSession";
import { TurnIndicator, AIHelper } from "@/components/wizard";

export const Route = createFileRoute("/session/$sessionId/intent")({
  component: IntentPage,
});

const SUGGESTED_PHRASES = [
  "I know you didn't mean to upset me...",
  "I believe you had the best intentions...",
  "I don't think you realized this was affecting me...",
  "I know you would never want to hurt me...",
];

function IntentPage() {
  const { sessionId } = Route.useParams();
  const navigate = useNavigate();
  const {
    session,
    loading,
    currentPartnerName,
    currentPartnerLetter,
    otherPartnerName,
    updatePartnerA,
    nextStep,
    getStepInfo,
  } = useLocalSession(sessionId);

  const [acknowledgment, setAcknowledgment] = useState(
    session?.partnerAData?.intentAcknowledgment || ""
  );
  const [confirmed, setConfirmed] = useState(false);

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

  const canContinue = confirmed || acknowledgment.trim().length > 0;

  const handleContinue = () => {
    updatePartnerA({
      intentAcknowledgment: acknowledgment.trim(),
    });

    const result = nextStep();
    if (result?.nextRoute) {
      navigate({ to: result.nextRoute });
    }
  };

  const addPhrase = (phrase: string) => {
    setAcknowledgment(phrase);
  };

  const stepInfo = getStepInfo();

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in">
      {/* Turn Indicator */}
      <TurnIndicator
        partnerName={currentPartnerName}
        partnerLetter={currentPartnerLetter}
        currentStep={session.currentStep}
        totalSteps={stepInfo.totalSteps}
        stepTitle={stepInfo.stepTitle}
        nextStepHint={stepInfo.nextHint || undefined}
        phase="sharing"
      />

      {/* Header */}
      <section className="text-center space-y-2">
        <h1 className="text-2xl">Acknowledge Good Intentions</h1>
        <p className="text-text-secondary">
          Before sharing how you feel, acknowledge that {otherPartnerName}{" "}
          probably didn't mean to cause any hurt.
        </p>
      </section>

      {/* Why this matters */}
      <section className="card-soft border-l-4 border-sage">
        <div className="flex items-start gap-2">
          <Sparkles className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-medium text-text-primary">Why this matters</p>
            <p className="text-sm text-text-secondary">
              When someone feels their intentions are understood, they're more
              open to hearing feedback. This small step can make a big
              difference in how your message is received.
            </p>
          </div>
        </div>
      </section>

      {/* Suggested phrases */}
      <section className="space-y-2">
        <p className="text-sm text-text-muted text-center">
          Choose a phrase or write your own:
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {SUGGESTED_PHRASES.map((phrase) => (
            <button
              key={phrase}
              onClick={() => addPhrase(phrase)}
              className={`phrase-chip ${
                acknowledgment === phrase ? "bg-sage text-white" : ""
              }`}
            >
              {phrase}
            </button>
          ))}
        </div>
      </section>

      {/* AI Helper */}
      <AIHelper
        type="good_intentions"
        onResult={(result) => setAcknowledgment(result)}
        partnerName={otherPartnerName}
      />

      {/* Input */}
      <section className="card space-y-4">
        <label
          htmlFor="acknowledgment"
          className="block text-sm font-medium text-text-secondary"
        >
          Your acknowledgment to {otherPartnerName}:
        </label>
        <textarea
          id="acknowledgment"
          value={acknowledgment}
          onChange={(e) => setAcknowledgment(e.target.value)}
          placeholder={`e.g., "I know you didn't realize this was bothering me, and I believe you would never want to hurt me..."`}
          className="textarea"
          rows={3}
        />
      </section>

      {/* Quick confirmation option */}
      <section className="card-soft">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-sage/30 text-sage focus:ring-sage"
          />
          <div>
            <p className="font-medium text-text-primary">
              I acknowledge {otherPartnerName}'s good intentions
            </p>
            <p className="text-sm text-text-muted">
              Check this if you prefer not to write something custom
            </p>
          </div>
        </label>
      </section>

      {/* Affirmation */}
      <div className="affirmation">
        <Heart className="w-4 h-4" />
        <span>Assuming good intentions opens hearts.</span>
      </div>

      {/* Continue */}
      <section>
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`btn-primary w-full flex items-center justify-center gap-2 ${
            !canContinue ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>
    </div>
  );
}
