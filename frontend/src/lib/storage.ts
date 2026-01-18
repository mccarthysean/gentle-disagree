/**
 * LocalStorage utilities for Gentle Disagree sessions.
 * All conversation data stays on the device - nothing is sent to servers.
 */

// Types for session data
export interface IStatement {
  emotion: string;
  situation: string;
  refined?: string;
}

export interface PartnerAData {
  readinessCheck: boolean;
  intentAcknowledgment: string;  // "I know you didn't mean to..."
  iStatement: IStatement;
  problemDescription: string;
  request: string;
}

export interface PartnerBResponses {
  reflection: string;  // "My understanding is..."
  acknowledgment: string;  // Response to request
  acknowledgmentType: "accept" | "discuss" | "counter" | "";
}

export interface PartnerBData {
  iStatement: IStatement;
  request: string;  // Optional - can be empty
}

export type SessionPhase =
  | "partner_a"       // Partner A is going through steps 1-6
  | "transition"      // Handoff to Partner B
  | "partner_b_respond"  // Partner B is responding (steps 1-2)
  | "partner_b_share"    // Partner B is sharing (steps 3-4)
  | "complete";       // Session finished

export interface LocalSession {
  id: string;
  partnerA: string;
  partnerB: string;
  topic?: string;
  status: "in_progress" | "completed";
  currentPhase: SessionPhase;
  currentStep: number;  // 1-6 for Partner A, 1-4 for Partner B
  createdAt: string;
  completedAt?: string;
  partnerAData: PartnerAData;
  partnerBResponses: PartnerBResponses;
  partnerBData: PartnerBData;
}

// Legacy interface for backward compatibility
export interface PartnerData {
  readinessCheck: boolean;
  iStatement: IStatement;
  problemDescription: string;
  request: string;
}

const STORAGE_KEY = "gentle-disagree-sessions";

// Generate a simple UUID
function generateId(): string {
  return crypto.randomUUID();
}

// Get all sessions from localStorage
export function getSessions(): LocalSession[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Save sessions to localStorage
function saveSessions(sessions: LocalSession[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

// Create a new session
export function createSession(params: {
  partnerA: string;
  partnerB: string;
  topic?: string;
}): LocalSession {
  const emptyPartnerAData: PartnerAData = {
    readinessCheck: false,
    intentAcknowledgment: "",
    iStatement: { emotion: "", situation: "" },
    problemDescription: "",
    request: "",
  };

  const emptyPartnerBResponses: PartnerBResponses = {
    reflection: "",
    acknowledgment: "",
    acknowledgmentType: "",
  };

  const emptyPartnerBData: PartnerBData = {
    iStatement: { emotion: "", situation: "" },
    request: "",
  };

  const session: LocalSession = {
    id: generateId(),
    partnerA: params.partnerA,
    partnerB: params.partnerB,
    topic: params.topic,
    status: "in_progress",
    currentPhase: "partner_a",
    currentStep: 1,
    createdAt: new Date().toISOString(),
    partnerAData: emptyPartnerAData,
    partnerBResponses: emptyPartnerBResponses,
    partnerBData: emptyPartnerBData,
  };

  const sessions = getSessions();
  sessions.unshift(session); // Add to beginning
  saveSessions(sessions);

  return session;
}

// Get a session by ID
export function getSession(id: string): LocalSession | null {
  const sessions = getSessions();
  return sessions.find((s) => s.id === id) ?? null;
}

// Update a session
export function updateSession(
  id: string,
  updates: Partial<LocalSession>
): LocalSession | null {
  const sessions = getSessions();
  const index = sessions.findIndex((s) => s.id === id);

  if (index === -1) return null;

  sessions[index] = { ...sessions[index], ...updates };
  saveSessions(sessions);

  return sessions[index];
}

// Update Partner A's data
export function updatePartnerAData(
  sessionId: string,
  updates: Partial<PartnerAData>
): LocalSession | null {
  const session = getSession(sessionId);
  if (!session) return null;

  return updateSession(sessionId, {
    partnerAData: { ...session.partnerAData, ...updates },
  });
}

// Update Partner B's responses (to Partner A)
export function updatePartnerBResponses(
  sessionId: string,
  updates: Partial<PartnerBResponses>
): LocalSession | null {
  const session = getSession(sessionId);
  if (!session) return null;

  return updateSession(sessionId, {
    partnerBResponses: { ...session.partnerBResponses, ...updates },
  });
}

// Update Partner B's own data
export function updatePartnerBData(
  sessionId: string,
  updates: Partial<PartnerBData>
): LocalSession | null {
  const session = getSession(sessionId);
  if (!session) return null;

  return updateSession(sessionId, {
    partnerBData: { ...session.partnerBData, ...updates },
  });
}

// Legacy: Update current partner's data (for backward compatibility)
export function updatePartnerData(
  sessionId: string,
  partner: "A" | "B",
  updates: Partial<PartnerData>
): LocalSession | null {
  if (partner === "A") {
    return updatePartnerAData(sessionId, updates as Partial<PartnerAData>);
  } else {
    return updatePartnerBData(sessionId, updates as Partial<PartnerBData>);
  }
}

// Delete a session
export function deleteSession(id: string): boolean {
  const sessions = getSessions();
  const filtered = sessions.filter((s) => s.id !== id);

  if (filtered.length === sessions.length) return false;

  saveSessions(filtered);
  return true;
}

// Clear all sessions
export function clearAllSessions(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Get completed sessions
export function getCompletedSessions(): LocalSession[] {
  return getSessions().filter((s) => s.status === "completed");
}

// Get in-progress sessions
export function getInProgressSessions(): LocalSession[] {
  return getSessions().filter((s) => s.status === "in_progress");
}

/**
 * Advance to next step based on current phase and step.
 *
 * Partner A flow: 6 steps
 *   1. Readiness Check
 *   2. Gentle Approach
 *   3. Acknowledge Intent (NEW)
 *   4. I-Statement
 *   5. Problem Description
 *   6. Respectful Request → Transition
 *
 * Partner B flow: 4 steps
 *   1. Reflect on Feelings
 *   2. Respond to Request
 *   3. Partner B's I-Statement
 *   4. Partner B's Request (optional) → Complete
 */
export function advanceStep(sessionId: string): LocalSession | null {
  const session = getSession(sessionId);
  if (!session) return null;

  const { currentPhase, currentStep } = session;

  // Partner A flow (6 steps)
  if (currentPhase === "partner_a") {
    if (currentStep >= 6) {
      // Partner A finished, go to transition
      return updateSession(sessionId, {
        currentPhase: "transition",
        currentStep: 0,
      });
    }
    // Advance to next step
    return updateSession(sessionId, {
      currentStep: currentStep + 1,
    });
  }

  // Transition → Partner B starts responding
  if (currentPhase === "transition") {
    return updateSession(sessionId, {
      currentPhase: "partner_b_respond",
      currentStep: 1,
    });
  }

  // Partner B respond phase (2 steps)
  if (currentPhase === "partner_b_respond") {
    if (currentStep >= 2) {
      // Move to share phase
      return updateSession(sessionId, {
        currentPhase: "partner_b_share",
        currentStep: 1,
      });
    }
    return updateSession(sessionId, {
      currentStep: currentStep + 1,
    });
  }

  // Partner B share phase (2 steps)
  if (currentPhase === "partner_b_share") {
    if (currentStep >= 2) {
      // Session complete
      return updateSession(sessionId, {
        currentPhase: "complete",
        status: "completed",
        completedAt: new Date().toISOString(),
      });
    }
    return updateSession(sessionId, {
      currentStep: currentStep + 1,
    });
  }

  return session;
}

/**
 * Get the route for the current step
 */
export function getRouteForCurrentState(session: LocalSession): string {
  const { currentPhase, currentStep } = session;
  const baseRoute = `/session/${session.id}`;

  if (currentPhase === "partner_a") {
    const routes = [
      "readiness",    // Step 1
      "approach",     // Step 2
      "intent",       // Step 3 (NEW)
      "i-statement",  // Step 4
      "problem",      // Step 5
      "request",      // Step 6
    ];
    return `${baseRoute}/${routes[currentStep - 1] || "readiness"}`;
  }

  if (currentPhase === "transition") {
    return `${baseRoute}/transition`;
  }

  if (currentPhase === "partner_b_respond") {
    const routes = [
      "reflect",      // Step 1
      "acknowledge",  // Step 2
    ];
    return `${baseRoute}/${routes[currentStep - 1] || "reflect"}`;
  }

  if (currentPhase === "partner_b_share") {
    const routes = [
      "b-statement",  // Step 1 (Partner B's I-statement)
      "b-request",    // Step 2 (Partner B's request)
    ];
    return `${baseRoute}/${routes[currentStep - 1] || "b-statement"}`;
  }

  return `${baseRoute}/summary`;
}

// Get step name for Partner A
export function getPartnerAStepName(step: number): string {
  const steps = [
    "Readiness Check",
    "Gentle Approach",
    "Acknowledge Intent",
    "I-Statement",
    "Problem Description",
    "Respectful Request",
  ];
  return steps[step - 1] || "Unknown";
}

// Get step name for Partner B
export function getPartnerBStepName(phase: SessionPhase, step: number): string {
  if (phase === "partner_b_respond") {
    const steps = ["Reflect on Feelings", "Respond to Request"];
    return steps[step - 1] || "Unknown";
  }
  if (phase === "partner_b_share") {
    const steps = ["Your I-Statement", "Your Request"];
    return steps[step - 1] || "Unknown";
  }
  return "Unknown";
}

// Get current partner info
export function getCurrentPartner(session: LocalSession): {
  letter: "A" | "B";
  name: string;
  isSharing: boolean;
} {
  if (session.currentPhase === "partner_a") {
    return {
      letter: "A",
      name: session.partnerA,
      isSharing: true,
    };
  }
  return {
    letter: "B",
    name: session.partnerB,
    isSharing: session.currentPhase === "partner_b_share",
  };
}

// Get other partner name
export function getOtherPartnerName(session: LocalSession): string {
  const current = getCurrentPartner(session);
  return current.letter === "A" ? session.partnerB : session.partnerA;
}

// Legacy helper for backward compatibility
export function getCurrentPartnerName(session: LocalSession): string {
  return getCurrentPartner(session).name;
}
