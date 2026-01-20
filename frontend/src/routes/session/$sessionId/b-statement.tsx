import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, ArrowRight } from "lucide-react";
import { useLocalSession } from "@/hooks/useLocalSession";
import { TurnIndicator } from "@/components/wizard";

export const Route = createFileRoute("/session/$sessionId/b-statement")({
  component: BStatementPage,
});

const EMOTIONS = [
  "hurt",
  "frustrated",
  "worried",
  "lonely",
  "overwhelmed",
  "disappointed",
  "anxious",
  "sad",
  "scared",
  "confused",
  "unheard",
  "stressed",
];

function BStatementPage() {
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

  const [selectedEmotion, setSelectedEmotion] = useState(
    session?.partnerBData?.iStatement?.emotion || "",
  );
  const [situation, setSituation] = useState(
    session?.partnerBData?.iStatement?.situation || "",
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

  const iStatement =
    selectedEmotion && situation
      ? `I feel ${selectedEmotion} when ${situation.toLowerCase()}`
      : "";

  const canContinue = selectedEmotion && situation.trim().length > 0;

  const handleContinue = () => {
    updatePartnerB({
      iStatement: {
        emotion: selectedEmotion,
        situation: situation.trim(),
      },
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
        currentStep={stepInfo.displayStep || session.currentStep + 2}
        totalSteps={stepInfo.totalSteps}
        stepTitle={stepInfo.stepTitle}
        nextStepHint={stepInfo.nextHint || undefined}
        phase="sharing"
      />

      {/* Header */}
      <section className="text-center space-y-2">
        <h1 className="text-2xl">Your Turn to Share</h1>
        <p className="text-text-secondary">
          Now it's your turn, {currentPartnerName}. Share how you feel about
          this situation.
        </p>
      </section>

      {/* Context reminder */}
      <div className="card-soft text-sm">
        <p className="text-text-muted">
          You've reflected on {otherPartnerName}'s feelings and responded to
          their request. Now share your own perspective.
        </p>
      </div>

      {/* Example transformation */}
      <div className="card-soft text-sm space-y-2">
        <div className="flex items-center gap-2 text-error">
          <span className="font-medium">✕</span>
          <span>"You're being unfair about this."</span>
        </div>
        <div className="flex items-center gap-2 text-success">
          <span className="font-medium">✓</span>
          <span>"I feel overwhelmed when there are many changes at once."</span>
        </div>
      </div>

      {/* Emotion picker */}
      <section className="card space-y-4">
        <label className="block text-sm font-medium text-text-secondary">
          I feel...
        </label>
        <div className="emotion-grid">
          {EMOTIONS.map((emotion) => (
            <button
              key={emotion}
              onClick={() => setSelectedEmotion(emotion)}
              className={`emotion-btn ${
                selectedEmotion === emotion ? "emotion-btn-selected" : ""
              }`}
            >
              {emotion}
            </button>
          ))}
        </div>
      </section>

      {/* Situation input */}
      <section className="card space-y-4">
        <label
          htmlFor="situation"
          className="block text-sm font-medium text-text-secondary"
        >
          ...when
        </label>
        <textarea
          id="situation"
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          placeholder="e.g., plans change without much notice"
          className="textarea"
          rows={3}
        />
      </section>

      {/* Preview */}
      {iStatement && (
        <section className="card bg-mint/30 border-sage/20">
          <p className="text-sm text-text-muted mb-2">Your I-statement:</p>
          <p className="text-lg font-medium text-sage-dark">"{iStatement}"</p>
        </section>
      )}

      {/* Affirmation */}
      <div className="affirmation">
        <MessageCircle className="w-4 h-4" />
        <span>Both perspectives matter in finding resolution.</span>
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
