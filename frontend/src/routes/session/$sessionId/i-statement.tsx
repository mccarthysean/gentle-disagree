import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  MessageCircle,
  ArrowRight,
  Sparkles,
  Lightbulb,
  Loader2,
} from "lucide-react";
import { useLocalSession } from "@/hooks/useLocalSession";
import { reframeStatement } from "@/lib/ai";

export const Route = createFileRoute("/session/$sessionId/i-statement")({
  component: IStatementPage,
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

function IStatementPage() {
  const { sessionId } = Route.useParams();
  const navigate = useNavigate();
  const {
    session,
    loading,
    currentPartnerName,
    otherPartnerName,
    updateCurrentPartner,
  } = useLocalSession(sessionId);

  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [situation, setSituation] = useState("");

  // AI assistance state
  const [rawStatement, setRawStatement] = useState("");
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiError, setAIError] = useState<string | null>(null);
  const [showAIHelper, setShowAIHelper] = useState(false);

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
    updateCurrentPartner({
      iStatement: {
        emotion: selectedEmotion,
        situation: situation.trim(),
      },
    });
    navigate({
      to: "/session/$sessionId/problem",
      params: { sessionId },
    });
  };

  const handleAIReframe = async () => {
    if (!rawStatement.trim()) return;

    setIsAILoading(true);
    setAIError(null);

    try {
      const result = await reframeStatement(rawStatement);

      // Apply the AI suggestions
      setSelectedEmotion(result.emotion);
      setSituation(result.situation);
      setShowAIHelper(false);
      setRawStatement("");
    } catch (error) {
      setAIError(
        "Couldn't connect to AI assistant. You can still build your statement manually below."
      );
    } finally {
      setIsAILoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in">
      {/* Progress */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`progress-step ${
              step === 3
                ? "progress-step-active"
                : step < 3
                  ? "progress-step-completed"
                  : ""
            }`}
          />
        ))}
      </div>

      {/* Partner Badge */}
      <div className="text-center">
        <span
          className={`partner-badge ${
            session.currentPartner === "A" ? "partner-badge-a" : "partner-badge-b"
          }`}
        >
          {session.currentPartner}
        </span>
        <p className="mt-2 text-text-secondary">
          <strong>{currentPartnerName}</strong>'s turn
        </p>
      </div>

      {/* Header */}
      <section className="text-center space-y-2">
        <h1 className="text-2xl">Step 3: I-Statement</h1>
        <p className="text-text-secondary">
          Share how you feel without blame. Focus on the impact, not fault.
        </p>
      </section>

      {/* Example transformation */}
      <div className="card-soft text-sm space-y-2">
        <div className="flex items-center gap-2 text-error">
          <span className="font-medium">✕</span>
          <span>"You're so closed off. We never talk."</span>
        </div>
        <div className="flex items-center gap-2 text-success">
          <span className="font-medium">✓</span>
          <span>"I feel lonely when we don't have time to talk."</span>
        </div>
      </div>

      {/* AI Helper Toggle */}
      {!showAIHelper ? (
        <button
          onClick={() => setShowAIHelper(true)}
          className="w-full btn-secondary flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Help me phrase this
        </button>
      ) : (
        <section className="card border-sage/30 space-y-4">
          <div className="flex items-center gap-2 text-sage">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">AI Assistant</span>
          </div>
          <p className="text-sm text-text-secondary">
            Type what you're feeling in your own words, and I'll help turn it
            into a constructive I-statement.
          </p>
          <textarea
            value={rawStatement}
            onChange={(e) => setRawStatement(e.target.value)}
            placeholder="e.g., You never listen to me, you're always on your phone..."
            className="textarea"
            rows={3}
          />
          {aiError && (
            <p className="text-sm text-error">{aiError}</p>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowAIHelper(false);
                setRawStatement("");
                setAIError(null);
              }}
              className="btn-ghost flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleAIReframe}
              disabled={!rawStatement.trim() || isAILoading}
              className={`btn-primary flex-1 flex items-center justify-center gap-2 ${
                !rawStatement.trim() || isAILoading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isAILoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Reframe
                </>
              )}
            </button>
          </div>
        </section>
      )}

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
          placeholder="e.g., we don't have time to talk in the evenings"
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

      {/* Gottman phrases */}
      <section className="space-y-2">
        <p className="text-sm text-text-muted text-center flex items-center justify-center gap-1">
          <Lightbulb className="w-4 h-4" />
          Other ways to express yourself:
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <button className="phrase-chip text-xs">
            "I'm getting scared"
          </button>
          <button className="phrase-chip text-xs">
            "That hurt my feelings"
          </button>
          <button className="phrase-chip text-xs">
            "I feel like you don't understand me"
          </button>
        </div>
      </section>

      {/* Affirmation */}
      <div className="affirmation">
        <MessageCircle className="w-4 h-4" />
        <span>Expressing feelings takes courage. You're doing great.</span>
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

      {/* Listener phrase */}
      <div className="text-center">
        <p className="text-sm text-text-muted mb-2">
          For {otherPartnerName} (the listener):
        </p>
        <button className="phrase-chip">
          "I'm curious why you feel that way"
        </button>
      </div>
    </div>
  );
}
