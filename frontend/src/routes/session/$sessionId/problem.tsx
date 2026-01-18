import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Target, ArrowRight, Lightbulb } from "lucide-react";
import { useLocalSession } from "@/hooks/useLocalSession";
import { TurnIndicator, AIHelper } from "@/components/wizard";

export const Route = createFileRoute("/session/$sessionId/problem")({
  component: ProblemPage,
});

function ProblemPage() {
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

  const [problem, setProblem] = useState("");

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

  const canContinue = problem.trim().length > 0;

  const handleContinue = () => {
    updatePartnerA({
      problemDescription: problem.trim(),
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
        phase="sharing"
      />

      {/* Header */}
      <section className="text-center space-y-2">
        <h1 className="text-2xl">Problem Description</h1>
        <p className="text-text-secondary">
          Describe one specific situation. Keep it focused and factual.
        </p>
      </section>

      {/* Guidelines */}
      <section className="card-soft space-y-2 text-sm">
        <div className="flex items-center gap-2 text-sage-dark">
          <span>✓</span>
          <span>One problem at a time</span>
        </div>
        <div className="flex items-center gap-2 text-sage-dark">
          <span>✓</span>
          <span>Be specific, not broad</span>
        </div>
        <div className="flex items-center gap-2 text-sage-dark">
          <span>✓</span>
          <span>Use facts, not accusations</span>
        </div>
      </section>

      {/* AI Helper */}
      <AIHelper
        type="problem"
        onResult={(result) => setProblem(result)}
        partnerName={otherPartnerName}
      />

      {/* Input */}
      <section className="card space-y-4">
        <label
          htmlFor="problem"
          className="block text-sm font-medium text-text-secondary"
        >
          Describe the specific situation:
        </label>
        <textarea
          id="problem"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="e.g., Last Tuesday when I came home, the dishes were still in the sink and I had hoped they'd be done so we could relax together."
          className="textarea"
          rows={4}
        />
        <p className="text-xs text-text-muted">
          Tip: Focus on a specific event or pattern, not personality traits.
        </p>
      </section>

      {/* Reflection phrases */}
      <section className="space-y-2">
        <p className="text-sm text-text-muted text-center flex items-center justify-center gap-1">
          <Lightbulb className="w-4 h-4" />
          {otherPartnerName} can reflect back:
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <button className="phrase-chip">
            "My understanding of what you're saying is..."
          </button>
          <button className="phrase-chip">
            "I think your point of view makes sense"
          </button>
        </div>
      </section>

      {/* Agree to disagree option */}
      <section className="text-center">
        <p className="text-sm text-text-muted mb-2">
          Sometimes you don't need to agree:
        </p>
        <button className="phrase-chip">
          "Is this something we need to agree on?"
        </button>
      </section>

      {/* Affirmation */}
      <div className="affirmation">
        <Target className="w-4 h-4" />
        <span>Clarity helps understanding. One step at a time.</span>
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
