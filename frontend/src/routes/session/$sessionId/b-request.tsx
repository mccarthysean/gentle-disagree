import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { HandHeart, ArrowRight, Check } from "lucide-react";
import { useLocalSession } from "@/hooks/useLocalSession";
import { TurnIndicator, AIHelper } from "@/components/wizard";

export const Route = createFileRoute("/session/$sessionId/b-request")({
  component: BRequestPage,
});

const STARTERS = [
  "Could you please...",
  "I would appreciate if...",
  "It would help me if...",
  "Would you be willing to...",
];

function BRequestPage() {
  const { sessionId } = Route.useParams();
  const navigate = useNavigate();
  const {
    session,
    loading,
    currentPartnerName,
    currentPartnerLetter,
    otherPartnerName,
    updatePartnerB,
    nextStep,
    getStepInfo,
  } = useLocalSession(sessionId);

  const [request, setRequest] = useState(session?.partnerBData?.request || "");
  const [skipRequest, setSkipRequest] = useState(false);

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

  const canContinue = skipRequest || request.trim().length > 0;

  const handleContinue = () => {
    updatePartnerB({
      request: skipRequest ? "" : request.trim(),
    });
    const result = nextStep();
    if (result?.nextRoute) {
      navigate({ to: result.nextRoute });
    }
  };

  const addStarter = (starter: string) => {
    setRequest(starter + " ");
    setSkipRequest(false);
  };

  const stepInfo = getStepInfo();

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in">
      {/* Turn Indicator */}
      <TurnIndicator
        partnerName={currentPartnerName}
        partnerLetter={currentPartnerLetter}
        currentStep={stepInfo.displayStep || session.currentStep + 2}
        totalSteps={stepInfo.totalSteps}
        stepTitle={stepInfo.stepTitle}
        nextStepHint={stepInfo.nextHint || undefined}
        phase="sharing"
      />

      {/* Header */}
      <section className="text-center space-y-2">
        <h1 className="text-2xl">Your Request (Optional)</h1>
        <p className="text-text-secondary">
          Is there something you'd like to ask {otherPartnerName} for?
        </p>
      </section>

      {/* Skip option */}
      <section className="card-soft">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={skipRequest}
            onChange={(e) => {
              setSkipRequest(e.target.checked);
              if (e.target.checked) setRequest("");
            }}
            className="mt-1 w-5 h-5 rounded border-sage/30 text-sage focus:ring-sage"
          />
          <div>
            <p className="font-medium text-text-primary">
              I don't have a request right now
            </p>
            <p className="text-sm text-text-muted">
              That's okay! Not every conversation needs a specific ask.
            </p>
          </div>
        </label>
      </section>

      {!skipRequest && (
        <>
          {/* Starters */}
          <section className="space-y-2">
            <p className="text-sm text-text-muted text-center">
              Start with one of these:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {STARTERS.map((starter) => (
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

          {/* AI Helper */}
          <AIHelper
            type="request"
            onResult={(result) => setRequest(result)}
            partnerName={otherPartnerName}
          />

          {/* Input */}
          <section className="card space-y-4">
            <label
              htmlFor="request"
              className="block text-sm font-medium text-text-secondary"
            >
              Your request:
            </label>
            <textarea
              id="request"
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              placeholder="e.g., Could you please give me a heads up before making plans that affect our evening?"
              className="textarea"
              rows={4}
            />
          </section>
        </>
      )}

      {/* Affirmation */}
      <div className="affirmation">
        <HandHeart className="w-4 h-4" />
        <span>You've both shown up for this conversation. That takes courage.</span>
      </div>

      {/* Complete */}
      <section>
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`btn-primary w-full flex items-center justify-center gap-2 ${
            !canContinue ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {skipRequest ? "Complete Conversation" : "Complete Conversation"}
          <Check className="w-5 h-5" />
        </button>
      </section>
    </div>
  );
}
