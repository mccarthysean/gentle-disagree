/**
 * AIHelper - Reusable AI assistance component for any wizard step.
 *
 * Provides a collapsible AI input that helps users phrase their thoughts
 * constructively for different contexts.
 */

import { useState } from "react";
import { Sparkles, Loader2, X } from "lucide-react";

export type AIHelperType =
  | "reschedule"      // Readiness: "Help me express that I need more time"
  | "calm_tone"       // Approach: "Help me set a calm tone"
  | "good_intentions" // Intent: "Help me acknowledge their good intentions"
  | "i_statement"     // I-Statement: "Help me phrase this constructively"
  | "problem"         // Problem: "Help me describe this without blame"
  | "request"         // Request: "Help me ask gently"
  | "reflect"         // Reflect: "Help me respond thoughtfully"
  | "acknowledge";    // Acknowledge: "Help me phrase my response"

interface AIHelperProps {
  type: AIHelperType;
  onResult: (result: string) => void;
  partnerName?: string;
  context?: string;  // Additional context like "their request was..."
}

const AI_CONFIG: Record<AIHelperType, {
  buttonText: string;
  placeholder: string;
  prompt: string;
}> = {
  reschedule: {
    buttonText: "Help me express that I need more time",
    placeholder: "e.g., I'm feeling stressed and need a moment...",
    prompt: "Help me gently express that I need to postpone this conversation",
  },
  calm_tone: {
    buttonText: "Help me set a calm tone",
    placeholder: "e.g., I want to start this conversation positively...",
    prompt: "Help me set a calm, collaborative tone for this conversation",
  },
  good_intentions: {
    buttonText: "Help me acknowledge their intentions",
    placeholder: "e.g., I know they didn't mean to upset me...",
    prompt: "Help me acknowledge that my partner had good intentions and didn't mean to cause hurt",
  },
  i_statement: {
    buttonText: "Help me phrase this constructively",
    placeholder: "e.g., You never listen to me, you're always on your phone...",
    prompt: "Transform this into a constructive 'I feel [emotion] when [situation]' statement",
  },
  problem: {
    buttonText: "Help me describe without blame",
    placeholder: "e.g., The house is always a mess because you never clean...",
    prompt: "Help me describe this problem factually without blame or accusation",
  },
  request: {
    buttonText: "Help me ask gently",
    placeholder: "e.g., I want them to stop leaving dishes in the sink...",
    prompt: "Help me phrase this as a gentle, respectful request",
  },
  reflect: {
    buttonText: "Help me respond thoughtfully",
    placeholder: "e.g., I understand they feel hurt, but I don't know what to say...",
    prompt: "Help me reflect back what my partner shared in a validating way",
  },
  acknowledge: {
    buttonText: "Help me phrase my response",
    placeholder: "e.g., I want to agree but also explain my side...",
    prompt: "Help me respond to this request in a constructive way",
  },
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8002";

export function AIHelper({ type, onResult, partnerName, context }: AIHelperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const config = AI_CONFIG[type];

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Build the full prompt with context
      let fullPrompt = config.prompt;
      if (partnerName) {
        fullPrompt += ` (partner's name: ${partnerName})`;
      }
      if (context) {
        fullPrompt += ` Context: ${context}`;
      }

      const response = await fetch(`${API_URL}/ai/reframe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          statement: input,
          prompt_type: type,
          full_prompt: fullPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error("AI service unavailable");
      }

      const data = await response.json();

      // The refined field contains the AI's suggestion
      const result = data.refined || data.suggestion || input;
      onResult(result);

      // Close and reset
      setIsOpen(false);
      setInput("");
    } catch {
      setError("Couldn't connect to AI. You can still write it yourself below.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full btn-secondary flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        {config.buttonText}
      </button>
    );
  }

  return (
    <div className="card border-sage/30 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sage">
          <Sparkles className="w-5 h-5" />
          <span className="font-medium">AI Assistant</span>
        </div>
        <button
          onClick={() => {
            setIsOpen(false);
            setInput("");
            setError(null);
          }}
          className="text-text-muted hover:text-text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <p className="text-sm text-text-secondary">
        Type what you're thinking in your own words, and I'll help you phrase it constructively.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={config.placeholder}
        className="textarea"
        rows={3}
      />

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="flex gap-2">
        <button
          onClick={() => {
            setIsOpen(false);
            setInput("");
            setError(null);
          }}
          className="btn-ghost flex-1"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading}
          className={`btn-primary flex-1 flex items-center justify-center gap-2 ${
            !input.trim() || isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Thinking...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Suggest
            </>
          )}
        </button>
      </div>
    </div>
  );
}
