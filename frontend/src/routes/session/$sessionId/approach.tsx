import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Heart, ArrowRight, Check } from "lucide-react";
import { useLocalSession } from "@/hooks/useLocalSession";

export const Route = createFileRoute("/session/$sessionId/approach")({
  component: ApproachPage,
});

const REMINDERS = [
  {
    title: "Use a calm, gentle voice",
    description: "Speak softly, even if you feel frustrated",
  },
  {
    title: "Avoid hurtful body language",
    description: "No eye rolling, scowling, or mocking",
  },
  {
    title: "Think teamwork, not arguing",
    description: "You're working together to solve this",
  },
  {
    title: "Listen with curiosity",
    description: "Try to understand, not just respond",
  },
];

function ApproachPage() {
  const { sessionId } = Route.useParams();
  const navigate = useNavigate();
  const { session, loading, currentPartnerName, otherPartnerName } =
    useLocalSession(sessionId);

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

  const handleContinue = () => {
    navigate({
      to: "/session/$sessionId/i-statement",
      params: { sessionId },
    });
  };

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in">
      {/* Progress */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`progress-step ${
              step === 2
                ? "progress-step-active"
                : step < 2
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
        <h1 className="text-2xl">Step 2: Gentle Approach</h1>
        <p className="text-text-secondary">
          Remember these guidelines as you share your feelings with{" "}
          {otherPartnerName}.
        </p>
      </section>

      {/* Reminders */}
      <section className="card space-y-4">
        {REMINDERS.map((reminder, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-mint flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-sage" />
            </div>
            <div>
              <p className="font-medium text-text-primary">{reminder.title}</p>
              <p className="text-sm text-text-muted">{reminder.description}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Helpful phrases */}
      <section className="space-y-2">
        <p className="text-sm text-text-muted text-center">
          Helpful phrases to set the tone:
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <button className="phrase-chip">
            "I appreciate you having this conversation"
          </button>
          <button className="phrase-chip">
            "Let's try to keep a calm tone"
          </button>
        </div>
      </section>

      {/* Affirmation */}
      <div className="affirmation">
        <Heart className="w-4 h-4" />
        <span>Kindness is the foundation of understanding.</span>
      </div>

      {/* Continue */}
      <section>
        <button
          onClick={handleContinue}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          I Understand – Continue
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>
    </div>
  );
}
