import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, ArrowRight, MessageCircle } from "lucide-react";
import { useLocalSession } from "@/hooks/useLocalSession";
import { TurnIndicator } from "@/components/wizard";

export const Route = createFileRoute("/session/$sessionId/reflect")({
  component: ReflectPage,
});

const REFLECTION_STARTERS = [
  "What I hear you saying is...",
  "I understand that you feel...",
  "It sounds like you're feeling...",
  "I can see that...",
];

function ReflectPage() {
  const { sessionId } = Route.useParams();
  const navigate = useNavigate();
  const {
    session,
    loading,
    currentPartnerName,
    currentPartnerLetter,
    otherPartnerName,
    updateBResponses,
    nextStep,
    getStepInfo,
  } = useLocalSession(sessionId);

  const [reflection, setReflection] = useState(
    session?.partnerBResponses?.reflection || "",
  );

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

  const { partnerAData } = session;
  const iStatement = partnerAData.iStatement;
  const intentAck = partnerAData.intentAcknowledgment;

  const canContinue = reflection.trim().length > 0;

  const handleContinue = () => {
    updateBResponses({
      reflection: reflection.trim(),
    });
    const result = nextStep();
    if (result?.nextRoute) {
      navigate({ to: result.nextRoute });
    }
  };

  const addStarter = (starter: string) => {
    setReflection(starter + " ");
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
        phase="responding"
      />

      {/* Header */}
      <section className="text-center space-y-2">
        <h1 className="text-2xl">Reflect on What You Heard</h1>
        <p className="text-text-secondary">
          Show {otherPartnerName} that you understood their feelings.
        </p>
      </section>

      {/* What Partner A shared */}
      <section className="card bg-mint/20 border-sage/20 space-y-4">
        <p className="text-sm text-text-muted font-medium">
          {otherPartnerName} shared:
        </p>

        {intentAck && (
          <div className="text-sm text-text-secondary italic border-l-2 border-sage/30 pl-3">
            "{intentAck}"
          </div>
        )}

        {iStatement.emotion && iStatement.situation && (
          <div className="bg-white rounded-lg p-3">
            <p className="text-lg text-sage-dark">
              "I feel <strong>{iStatement.emotion}</strong> when{" "}
              <strong>{iStatement.situation.toLowerCase()}</strong>"
            </p>
          </div>
        )}

        {partnerAData.problemDescription && (
          <div className="text-sm text-text-secondary">
            <span className="font-medium">About: </span>
            {partnerAData.problemDescription}
          </div>
        )}
      </section>

      {/* Acknowledgment reminder */}
      {intentAck && (
        <div className="affirmation">
          <Heart className="w-4 h-4" />
          <span>{otherPartnerName} acknowledged your good intentions.</span>
        </div>
      )}

      {/* Reflection starters */}
      <section className="space-y-2">
        <p className="text-sm text-text-muted text-center">
          Start with one of these:
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {REFLECTION_STARTERS.map((starter) => (
            <button
              key={starter}
              onClick={() => addStarter(starter)}
              className="phrase-chip"
            >
              {starter}
            </button>
          ))}
        </div>
      </section>

      {/* Input */}
      <section className="card space-y-4">
        <label
          htmlFor="reflection"
          className="block text-sm font-medium text-text-secondary"
        >
          Your reflection:
        </label>
        <textarea
          id="reflection"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder={`e.g., "What I hear you saying is that you feel ${iStatement.emotion || "hurt"} when I ${iStatement.situation || "..."}. I can understand why that would be difficult."`}
          className="textarea"
          rows={4}
        />
      </section>

      {/* Affirmation */}
      <div className="affirmation">
        <MessageCircle className="w-4 h-4" />
        <span>Listening with empathy is a gift.</span>
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
