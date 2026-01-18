import { useState, useEffect, useCallback } from "react";
import {
  getSession,
  updateSession,
  updatePartnerData,
  advanceStep,
  type LocalSession,
  type PartnerData,
} from "@/lib/storage";

/**
 * Hook for managing a local session.
 * Automatically syncs with localStorage.
 */
export function useLocalSession(sessionId: string) {
  const [session, setSession] = useState<LocalSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Load session on mount
  useEffect(() => {
    const loaded = getSession(sessionId);
    setSession(loaded);
    setLoading(false);
  }, [sessionId]);

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

  // Update current partner's data
  const updateCurrentPartner = useCallback(
    (updates: Partial<PartnerData>) => {
      if (!session) return null;
      const updated = updatePartnerData(
        sessionId,
        session.currentPartner,
        updates
      );
      if (updated) setSession(updated);
      return updated;
    },
    [sessionId, session]
  );

  // Advance to next step
  const nextStep = useCallback(() => {
    const updated = advanceStep(sessionId);
    if (updated) setSession(updated);
    return updated;
  }, [sessionId]);

  // Get current partner's data
  const currentPartnerData = session
    ? session.currentPartner === "A"
      ? session.partnerAData
      : session.partnerBData
    : null;

  // Get current partner's name
  const currentPartnerName = session
    ? session.currentPartner === "A"
      ? session.partnerA
      : session.partnerB
    : "";

  // Get other partner's name
  const otherPartnerName = session
    ? session.currentPartner === "A"
      ? session.partnerB
      : session.partnerA
    : "";

  return {
    session,
    loading,
    refresh,
    update,
    updateCurrentPartner,
    nextStep,
    currentPartnerData,
    currentPartnerName,
    otherPartnerName,
  };
}
