import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Users, ArrowRight, Sparkles } from "lucide-react";
import { createSession } from "@/lib/storage";

export const Route = createFileRoute("/session/new")({
  component: NewSessionPage,
});

function NewSessionPage() {
  const navigate = useNavigate();
  const [partnerA, setPartnerA] = useState("");
  const [partnerB, setPartnerB] = useState("");
  const [topic, setTopic] = useState("");

  const handleStart = () => {
    const session = createSession({
      partnerA: partnerA.trim() || "Partner A",
      partnerB: partnerB.trim() || "Partner B",
      topic: topic.trim() || undefined,
    });

    navigate({
      to: "/session/$sessionId/readiness",
      params: { sessionId: session.id },
    });
  };

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <section className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-mint">
          <Users className="w-8 h-8 text-sage" />
        </div>
        <h1 className="text-2xl">Let's Get Started</h1>
        <p className="text-text-secondary">
          Enter your names so we can personalize this conversation.
        </p>
      </section>

      {/* Form */}
      <section className="card space-y-5">
        <div>
          <label
            htmlFor="partnerA"
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            First partner's name (who will speak first)
          </label>
          <input
            type="text"
            id="partnerA"
            value={partnerA}
            onChange={(e) => setPartnerA(e.target.value)}
            placeholder="e.g., Alex"
            className="input"
            autoComplete="off"
          />
        </div>

        <div>
          <label
            htmlFor="partnerB"
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            Second partner's name (who will listen first)
          </label>
          <input
            type="text"
            id="partnerB"
            value={partnerB}
            onChange={(e) => setPartnerB(e.target.value)}
            placeholder="e.g., Jordan"
            className="input"
            autoComplete="off"
          />
        </div>

        <div>
          <label
            htmlFor="topic"
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            What would you like to discuss? (optional)
          </label>
          <textarea
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., How we divide household chores"
            className="textarea"
            rows={3}
          />
        </div>
      </section>

      {/* Affirmation */}
      <div className="affirmation">
        <Sparkles className="w-4 h-4" />
        <span>You're taking a positive step by having this conversation.</span>
      </div>

      {/* Start Button */}
      <section className="text-center">
        <button
          onClick={handleStart}
          className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4 w-full justify-center"
        >
          Begin Conversation
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      {/* Privacy note */}
      <p className="text-text-muted text-sm text-center">
        Names are stored only on this device and can be deleted anytime.
      </p>
    </div>
  );
}
