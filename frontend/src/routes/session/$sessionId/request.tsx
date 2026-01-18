import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { HandHeart, ArrowRight, Lightbulb, Users } from "lucide-react";
import { useLocalSession } from "@/hooks/useLocalSession";

export const Route = createFileRoute("/session/$sessionId/request")({
  component: RequestPage,
});

const STARTERS = [
  "Could you please...",
  "I would appreciate if...",
  "It would help me if...",
  "Would you be willing to...",
];

function RequestPage() {
  const { sessionId } = Route.useParams();
  const navigate = useNavigate();
  const {
    session,
    loading,
    currentPartnerName,
    otherPartnerName,
    updateCurrentPartner,
    nextStep,
  } = useLocalSession(sessionId);

  const [request, setRequest] = useState("");

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

  const canContinue = request.trim().length > 0;

  const handleComplete = () => {
    updateCurrentPartner({
      request: request.trim(),
    });

    const updated = nextStep();

    // If partner A just finished, go to transition screen
    if (updated && updated.currentPartner === "B" && updated.currentStep === 1) {
      navigate({
        to: "/session/$sessionId/transition",
        params: { sessionId },
      });
    } else if (updated && updated.status === "completed") {
      // Both partners are done
      navigate({
        to: "/session/$sessionId/summary",
        params: { sessionId },
      });
    }
  };

  const addStarter = (starter: string) => {
    setRequest(starter + " ");
  };

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in">
      {/* Progress */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`progress-step ${
              step === 5
                ? "progress-step-active"
                : step < 5
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
        <h1 className="text-2xl">Step 5: Respectful Request</h1>
        <p className="text-text-secondary">
          What would help you feel better? Make a gentle request to{" "}
          {otherPartnerName}.
        </p>
      </section>

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
          placeholder="e.g., Could you please let me know when you'll be home late so I don't worry?"
          className="textarea"
          rows={4}
        />
      </section>

      {/* Listening rule */}
      <section className="space-y-2">
        <p className="text-sm text-text-muted text-center flex items-center justify-center gap-1">
          <Lightbulb className="w-4 h-4" />
          Set the expectation:
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <button className="phrase-chip">
            "I'm here to listen to you, then I'd like you to listen to me"
          </button>
        </div>
      </section>

      {/* Apology phrases for listener */}
      <section className="card-soft">
        <p className="text-sm text-text-muted mb-2 flex items-center gap-1">
          <Users className="w-4 h-4" />
          {otherPartnerName} might respond with:
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="phrase-chip text-xs">"Let me try again"</span>
          <span className="phrase-chip text-xs">"I can see my part in this"</span>
          <span className="phrase-chip text-xs">
            "How can I make things better?"
          </span>
        </div>
      </section>

      {/* Affirmation */}
      <div className="affirmation">
        <HandHeart className="w-4 h-4" />
        <span>Asking for what you need is an act of trust.</span>
      </div>

      {/* Complete */}
      <section>
        <button
          onClick={handleComplete}
          disabled={!canContinue}
          className={`btn-primary w-full flex items-center justify-center gap-2 ${
            !canContinue ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Complete My Turn
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      {/* Need time */}
      <div className="text-center">
        <p className="text-sm text-text-muted mb-2">
          If you need more time to think:
        </p>
        <button className="phrase-chip">
          "I need some time to think this over"
        </button>
      </div>
    </div>
  );
}
