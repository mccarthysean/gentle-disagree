/**
 * AI API client for Gentle Disagree
 *
 * Calls the backend API which uses Ollama for statement reframing.
 * All requests are ephemeral - nothing is stored on the server.
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface ReframeRequest {
  statement: string;
}

export interface ReframeResponse {
  emotion: string;
  situation: string;
  refined: string;
}

export interface SuggestEmotionsRequest {
  context: string;
}

export interface SuggestEmotionsResponse {
  emotions: string[];
}

/**
 * Reframe a statement into a constructive I-statement.
 *
 * Takes a potentially negative or blaming statement and transforms it
 * into the format: "I feel [emotion] when [situation]"
 */
export async function reframeStatement(
  statement: string
): Promise<ReframeResponse> {
  const response = await fetch(`${API_URL}/ai/reframe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ statement }),
  });

  if (!response.ok) {
    throw new Error(`AI request failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Suggest emotion words based on context.
 *
 * Helps users find the right words to express their feelings.
 */
export async function suggestEmotions(
  context: string
): Promise<SuggestEmotionsResponse> {
  const response = await fetch(`${API_URL}/ai/suggest-emotions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ context }),
  });

  if (!response.ok) {
    throw new Error(`AI request failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Check if the AI backend is available.
 */
export async function checkAIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: "GET",
    });
    return response.ok;
  } catch {
    return false;
  }
}
