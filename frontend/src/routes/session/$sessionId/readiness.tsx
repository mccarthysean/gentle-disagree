import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Circle, Clock, ArrowRight, Pause } from "lucide-react";
import { useLocalSession } from "@/hooks/useLocalSession";
import { TurnIndicator } from "@/components/wizard";

export const Route = createFileRoute("/session/$sessionId/readiness")({
  component: ReadinessPage,
});

function ReadinessPage() {
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

  const [isCalm, setIsCalm] = useState(false);
  const [isRelaxed, setIsRelaxed] = useState(false);

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

  const isReady = isCalm && isRelaxed;

  const handleContinue = () => {
    updatePartnerA({ readinessCheck: true });
    const result = nextStep();
    if (result?.nextRoute) {
      navigate({ to: result.nextRoute });
    }
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
        <h1 className="text-2xl">Readiness Check</h1>
        <p className="text-text-secondary">
          Before we begin, let's make sure this is a good moment for both of you.
        </p>
      </section>

      {/* Checklist */}
      <section className="card space-y-4">
        <button
          onClick={() => setIsCalm(!isCalm)}
          className="w-full flex items-start gap-3 text-left p-3 rounded-lg hover:bg-sand/50 transition-colors"
        >
          {isCalm ? (
            <CheckCircle2 className="w-6 h-6 text-sage flex-shrink-0 mt-0.5" />
          ) : (
            <Circle className="w-6 h-6 text-stone flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-medium text-text-primary">
              Is this a calm moment?
            </p>
            <p className="text-sm text-text-muted">
              No distractions or interruptions nearby
            </p>
          </div>
        </button>

        <button
          onClick={() => setIsRelaxed(!isRelaxed)}
          className="w-full flex items-start gap-3 text-left p-3 rounded-lg hover:bg-sand/50 transition-colors"
        >
          {isRelaxed ? (
            <CheckCircle2 className="w-6 h-6 text-sage flex-shrink-0 mt-0.5" />
          ) : (
            <Circle className="w-6 h-6 text-stone flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-medium text-text-primary">
              Are you feeling relaxed?
            </p>
            <p className="text-sm text-text-muted">
              Not tired, hungry, or stressed right now
            </p>
          </div>
        </button>
      </section>

      {/* Affirmation */}
      <div className="affirmation">
        <Clock className="w-4 h-4" />
        <span>Taking time to prepare shows you care about this conversation.</span>
      </div>

      {/* Actions */}
      <section className="space-y-3">
        <button
          onClick={handleContinue}
          disabled={!isReady}
          className={`btn-primary w-full flex items-center justify-center gap-2 ${
            !isReady ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          I'm Ready
          <ArrowRight className="w-5 h-5" />
        </button>

        <button className="btn-ghost w-full flex items-center justify-center gap-2 text-text-muted">
          <Pause className="w-4 h-4" />
          Not Right Now – Let's Reschedule
        </button>
      </section>

      {/* Pause phrase */}
      <div className="text-center">
        <p className="text-sm text-text-muted mb-2">
          If now isn't the right time, you can say:
        </p>
        <button className="phrase-chip">
          "I would prefer to return to this when we're both less emotional"
        </button>
      </div>
    </div>
  );
}
