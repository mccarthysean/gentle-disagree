/**
 * TurnIndicator - Shows whose turn it is, step progress, and what's next.
 *
 * Displayed at the top of every wizard page for clear navigation context.
 */

interface TurnIndicatorProps {
  partnerName: string;
  partnerLetter: "A" | "B";
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  nextStepHint?: string;
  phase?: "sharing" | "responding";
}

export function TurnIndicator({
  partnerName,
  partnerLetter,
  currentStep,
  totalSteps,
  stepTitle,
  nextStepHint,
  phase = "sharing",
}: TurnIndicatorProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;
  const phaseLabel = phase === "sharing" ? "IS SHARING" : "IS RESPONDING";

  return (
    <div className="bg-white rounded-[16px] p-4 shadow-soft border border-sage/10 space-y-3">
      {/* Partner info and step counter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`partner-badge text-lg ${
              partnerLetter === "A" ? "partner-badge-a" : "partner-badge-b"
            }`}
          >
            {partnerLetter}
          </span>
          <div>
            <div className="font-semibold text-text-primary">
              {partnerName.toUpperCase()} {phaseLabel}
            </div>
            <div className="text-sm text-text-muted">{stepTitle}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-sage">
            {currentStep} <span className="text-text-muted font-normal">of</span> {totalSteps}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-sand rounded-full overflow-hidden">
        <div
          className="h-full bg-sage transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Next step hint */}
      {nextStepHint && (
        <div className="text-sm text-text-muted text-center">
          Next: {nextStepHint}
        </div>
      )}
    </div>
  );
}

/**
 * Step configuration for Partner A's flow (6 steps)
 */
export const PARTNER_A_STEPS = [
  { step: 1, title: "Readiness Check", next: "Set a gentle approach" },
  { step: 2, title: "Gentle Approach", next: "Acknowledge their intentions" },
  { step: 3, title: "Acknowledge Intent", next: "Share your I-statement" },
  { step: 4, title: "I-Statement", next: "Describe the problem" },
  { step: 5, title: "Problem Description", next: "Make your request" },
  { step: 6, title: "Respectful Request", next: null },
];

/**
 * Step configuration for Partner B's flow (4 steps)
 */
export const PARTNER_B_STEPS = [
  { step: 1, title: "Reflect on Feelings", next: "Respond to the request" },
  { step: 2, title: "Respond to Request", next: "Share your feelings" },
  { step: 3, title: "Your I-Statement", next: "Make your request (optional)" },
  { step: 4, title: "Your Request", next: null },
];

/**
 * Get step info for a partner
 */
export function getStepInfo(
  partner: "A" | "B",
  step: number
): { title: string; next: string | null } {
  const steps = partner === "A" ? PARTNER_A_STEPS : PARTNER_B_STEPS;
  const stepInfo = steps.find((s) => s.step === step);
  return stepInfo || { title: "Unknown Step", next: null };
}
