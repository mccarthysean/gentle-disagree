import { useState, useCallback } from "react";
import {
  getSession,
  updateSession,
  updatePartnerAData,
  updatePartnerBResponses,
  updatePartnerBData,
  advanceStep,
  getRouteForCurrentState,
  getCurrentPartner,
  getOtherPartnerName,
  type LocalSession,
  type PartnerAData,
  type PartnerBResponses,
  type PartnerBData,
} from "@/lib/storage";

/**
 * Hook for managing a local session.
 * Automatically syncs with localStorage.
 */
export function useLocalSession(sessionId: string) {
  // Use lazy initialization to avoid useEffect setState issues
  const [session, setSession] = useState<LocalSession | null>(() =>
    getSession(sessionId)
  );
  // Loading is always false since we use synchronous localStorage
  const loading = false;

  // Refresh session from storage
  const refresh = useCallback(() => {
    const loaded = getSession(sessionId);
    setSession(loaded);
  }, [sessionId]);

  // Update session and refresh
  const update = useCallback(
    (updates: Partial<LocalSession>) => {
      const updated = updateSession(sessionId, updates);
      if (updated) setSession(updated);
      return updated;
    },
    [sessionId]
  );

  // Update Partner A's data
  const updatePartnerA = useCallback(
    (updates: Partial<PartnerAData>) => {
      const updated = updatePartnerAData(sessionId, updates);
      if (updated) setSession(updated);
      return updated;
    },
    [sessionId]
  );

  // Update Partner B's responses
  const updateBResponses = useCallback(
    (updates: Partial<PartnerBResponses>) => {
      const updated = updatePartnerBResponses(sessionId, updates);
      if (updated) setSession(updated);
      return updated;
    },
    [sessionId]
  );

  // Update Partner B's own data
  const updatePartnerB = useCallback(
    (updates: Partial<PartnerBData>) => {
      const updated = updatePartnerBData(sessionId, updates);
      if (updated) setSession(updated);
      return updated;
    },
    [sessionId]
  );

  // Advance to next step and get the next route
  const nextStep = useCallback(() => {
    const updated = advanceStep(sessionId);
    if (updated) {
      setSession(updated);
      return {
        session: updated,
        nextRoute: getRouteForCurrentState(updated),
      };
    }
    return null;
  }, [sessionId]);

  // Get current partner info
  const currentPartner = session ? getCurrentPartner(session) : null;
  const currentPartnerName = currentPartner?.name || "";
  const currentPartnerLetter = currentPartner?.letter || "A";
  const isSharing = currentPartner?.isSharing ?? true;

  // Get other partner name
  const otherPartnerName = session ? getOtherPartnerName(session) : "";

  // Get step info based on phase
  const getStepInfo = useCallback(() => {
    if (!session) return { totalSteps: 6, stepTitle: "", nextHint: "" };

    const { currentPhase, currentStep } = session;

    if (currentPhase === "partner_a") {
      const steps = [
        { title: "Readiness Check", next: "Set a gentle approach" },
        { title: "Gentle Approach", next: "Acknowledge their intentions" },
        { title: "Acknowledge Intent", next: "Share your I-statement" },
        { title: "I-Statement", next: "Describe the problem" },
        { title: "Problem Description", next: "Make your request" },
        { title: "Respectful Request", next: null },
      ];
      const info = steps[currentStep - 1] || steps[0];
      return { totalSteps: 6, stepTitle: info.title, nextHint: info.next };
    }

    if (currentPhase === "partner_b_respond") {
      const steps = [
        { title: "Reflect on Feelings", next: "Respond to the request" },
        { title: "Respond to Request", next: "Share your feelings" },
      ];
      const info = steps[currentStep - 1] || steps[0];
      return { totalSteps: 4, stepTitle: info.title, nextHint: info.next };
    }

    if (currentPhase === "partner_b_share") {
      const adjustedStep = currentStep + 2; // Steps 3-4 in Partner B's total flow
      const steps = [
        { title: "Your I-Statement", next: "Make your request (optional)" },
        { title: "Your Request", next: null },
      ];
      const info = steps[currentStep - 1] || steps[0];
      return { totalSteps: 4, stepTitle: info.title, nextHint: info.next, displayStep: adjustedStep };
    }

    return { totalSteps: 6, stepTitle: "Complete", nextHint: null };
  }, [session]);

  // Legacy: Update current partner's data (for backward compatibility)
  const updateCurrentPartner = useCallback(
    (updates: Partial<PartnerAData | PartnerBData>) => {
      if (!session) return null;

      if (session.currentPhase === "partner_a") {
        return updatePartnerA(updates as Partial<PartnerAData>);
      } else {
        return updatePartnerB(updates as Partial<PartnerBData>);
      }
    },
    [session, updatePartnerA, updatePartnerB]
  );

  return {
    session,
    loading,
    refresh,
    update,
    updatePartnerA,
    updateBResponses,
    updatePartnerB,
    updateCurrentPartner,
    nextStep,
    currentPartnerName,
    currentPartnerLetter,
    otherPartnerName,
    isSharing,
    getStepInfo,
  };
}
