/**
 * LocalStorage utilities for Conflict Compass sessions.
 * All conversation data stays on the device - nothing is sent to servers.
 */

// Types for session data
export interface IStatement {
  emotion: string;
  situation: string;
  refined?: string;
}

export interface PartnerData {
  readinessCheck: boolean;
  iStatement: IStatement;
  problemDescription: string;
  request: string;
}

export interface LocalSession {
  id: string;
  partnerA: string;
  partnerB: string;
  topic?: string;
  status: "in_progress" | "completed";
  currentStep: number; // 1-5
  currentPartner: "A" | "B";
  createdAt: string;
  completedAt?: string;
  partnerAData: PartnerData;
  partnerBData: PartnerData;
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
  const emptyPartnerData: PartnerData = {
    readinessCheck: false,
    iStatement: { emotion: "", situation: "" },
    problemDescription: "",
    request: "",
  };

  const session: LocalSession = {
    id: generateId(),
    partnerA: params.partnerA,
    partnerB: params.partnerB,
    topic: params.topic,
    status: "in_progress",
    currentStep: 1,
    currentPartner: "A",
    createdAt: new Date().toISOString(),
    partnerAData: { ...emptyPartnerData },
    partnerBData: { ...emptyPartnerData },
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

// Update partner data specifically
export function updatePartnerData(
  sessionId: string,
  partner: "A" | "B",
  updates: Partial<PartnerData>
): LocalSession | null {
  const session = getSession(sessionId);
  if (!session) return null;

  const dataKey = partner === "A" ? "partnerAData" : "partnerBData";
  const currentData = session[dataKey];

  return updateSession(sessionId, {
    [dataKey]: { ...currentData, ...updates },
  });
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

// Advance to next step
export function advanceStep(sessionId: string): LocalSession | null {
  const session = getSession(sessionId);
  if (!session) return null;

  // If current partner A is done with step 5, switch to partner B at step 1
  if (session.currentStep === 5 && session.currentPartner === "A") {
    return updateSession(sessionId, {
      currentStep: 1,
      currentPartner: "B",
    });
  }

  // If partner B is done with step 5, session is complete
  if (session.currentStep === 5 && session.currentPartner === "B") {
    return updateSession(sessionId, {
      status: "completed",
      completedAt: new Date().toISOString(),
    });
  }

  // Otherwise just advance the step
  return updateSession(sessionId, {
    currentStep: session.currentStep + 1,
  });
}

// Get step name
export function getStepName(step: number): string {
  const steps = [
    "Readiness Check",
    "Gentle Approach",
    "I-Statement",
    "Problem Description",
    "Respectful Request",
  ];
  return steps[step - 1] || "Unknown";
}

// Get current partner name
export function getCurrentPartnerName(session: LocalSession): string {
  return session.currentPartner === "A" ? session.partnerA : session.partnerB;
}

// Get other partner name
export function getOtherPartnerName(session: LocalSession): string {
  return session.currentPartner === "A" ? session.partnerB : session.partnerA;
}
