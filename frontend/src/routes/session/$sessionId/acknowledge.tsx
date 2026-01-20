import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { HandHeart, ArrowRight, Check } from "lucide-react";
import { useLocalSession } from "@/hooks/useLocalSession";
import { TurnIndicator } from "@/components/wizard";

export const Route = createFileRoute("/session/$sessionId/acknowledge")({
  component: AcknowledgePage,
});

type AcknowledgmentType = "accept" | "discuss" | "counter" | "";

const RESPONSE_OPTIONS = [
  {
    type: "accept" as const,
    label: "I can do that",
    description: "I'm willing to try what you're asking",
    color: "bg-mint text-sage-dark",
  },
  {
    type: "discuss" as const,
    label: "Let's talk about it",
    description: "I'd like to discuss this more",
    color: "bg-sand text-text-primary",
  },
  {
    type: "counter" as const,
    label: "Can we find a middle ground?",
    description: "I have some thoughts on a compromise",
    color: "bg-cream text-text-primary",
  },
];

function AcknowledgePage() {
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

  const [acknowledgmentType, setAcknowledgmentType] = useState<AcknowledgmentType>(
    session?.partnerBResponses?.acknowledgmentType || ""
  );
  const [acknowledgment, setAcknowledgment] = useState(
    session?.partnerBResponses?.acknowledgment || ""
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
  const request = partnerAData.request;

  const canContinue = acknowledgmentType !== "" && acknowledgment.trim().length > 0;

  const handleContinue = () => {
    updateBResponses({
      acknowledgmentType,
      acknowledgment: acknowledgment.trim(),
    });
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
        phase="responding"
      />

      {/* Header */}
      <section className="text-center space-y-2">
        <h1 className="text-2xl">Respond to the Request</h1>
        <p className="text-text-secondary">
          How would you like to respond to {otherPartnerName}'s request?
        </p>
      </section>

      {/* What Partner A requested */}
      <section className="card bg-mint/20 border-sage/20 space-y-3">
        <p className="text-sm text-text-muted font-medium">
          {otherPartnerName} asked:
        </p>
        <div className="bg-white rounded-lg p-3">
          <p className="text-lg text-sage-dark">"{request}"</p>
        </div>
      </section>

      {/* Response type selection */}
      <section className="space-y-3">
        {RESPONSE_OPTIONS.map((option) => (
          <button
            key={option.type}
            onClick={() => setAcknowledgmentType(option.type)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              acknowledgmentType === option.type
                ? "border-sage " + option.color
                : "border-transparent bg-sand hover:border-sage/30"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  acknowledgmentType === option.type
                    ? "bg-sage text-white"
                    : "bg-stone/20"
                }`}
              >
                {acknowledgmentType === option.type && (
                  <Check className="w-4 h-4" />
                )}
              </div>
              <div>
                <p className="font-medium">{option.label}</p>
                <p className="text-sm text-text-muted">{option.description}</p>
              </div>
            </div>
          </button>
        ))}
      </section>

      {/* Response input */}
      <section className="card space-y-4">
        <label
          htmlFor="acknowledgment"
          className="block text-sm font-medium text-text-secondary"
        >
          Your response:
        </label>
        <textarea
          id="acknowledgment"
          value={acknowledgment}
          onChange={(e) => setAcknowledgment(e.target.value)}
          placeholder={
            acknowledgmentType === "accept"
              ? "e.g., I can definitely do that. I'll make sure to..."
              : acknowledgmentType === "discuss"
                ? "e.g., I'd like to understand more about what would help. Could we talk about..."
                : acknowledgmentType === "counter"
                  ? "e.g., I hear what you're asking. Would it work if we tried..."
                  : "Select a response type above, then write your response..."
          }
          className="textarea"
          rows={4}
        />
      </section>

      {/* Helpful repair phrases */}
      <section className="space-y-2">
        <p className="text-sm text-text-muted text-center">
          Repair phrases that can help:
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            className="phrase-chip text-xs"
            onClick={() =>
              setAcknowledgment((prev) => prev + " Let me try again.")
            }
          >
            "Let me try again"
          </button>
          <button
            className="phrase-chip text-xs"
            onClick={() =>
              setAcknowledgment((prev) => prev + " I can see my part in this.")
            }
          >
            "I can see my part in this"
          </button>
          <button
            className="phrase-chip text-xs"
            onClick={() =>
              setAcknowledgment((prev) => prev + " How can I make things better?")
            }
          >
            "How can I make things better?"
          </button>
        </div>
      </section>

      {/* Affirmation */}
      <div className="affirmation">
        <HandHeart className="w-4 h-4" />
        <span>Your willingness to engage shows care.</span>
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
