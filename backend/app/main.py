"""
Gentle Disagree API - Minimal AI backend for statement reframing.

This backend is stateless and ephemeral:
- No database, no user storage
- AI requests are processed and immediately discarded
- Complete privacy for users
"""

import os

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="Gentle Disagree AI",
    description="AI-powered statement reframing for constructive conflict resolution",
    version="1.0.0",
)

# CORS configuration - allow frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Ollama configuration
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2:3b")


class ReframeRequest(BaseModel):
    """Request to reframe a statement into an I-statement."""

    statement: str


class ReframeResponse(BaseModel):
    """Response with reframed statement."""

    emotion: str
    situation: str
    refined: str


class SuggestEmotionsRequest(BaseModel):
    """Request for emotion word suggestions."""

    context: str


class SuggestEmotionsResponse(BaseModel):
    """Response with suggested emotion words."""

    emotions: list[str]


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "gentle-disagree-api",
        "ollama_url": OLLAMA_URL,
        "model": OLLAMA_MODEL,
    }


@app.post("/ai/reframe", response_model=ReframeResponse)
async def reframe_statement(request: ReframeRequest):
    """
    Reframe a statement into a constructive I-statement.

    Takes a potentially negative or blaming statement and transforms it
    into the format: "I feel [emotion] when [situation]"
    """
    if not request.statement.strip():
        raise HTTPException(status_code=400, detail="Statement cannot be empty")

    prompt = f"""You are a compassionate couples therapist helping someone express their feelings constructively.

Reframe this statement into a gentle "I feel [emotion] when [situation]" format.
Focus on the speaker's feelings and the impact of the situation, not blame.
Be warm and constructive. Use simple, common emotion words.

Original statement: "{request.statement}"

Respond with ONLY valid JSON in this exact format (no extra text):
{{"emotion": "the emotion word (e.g., hurt, worried, lonely)", "situation": "the situation without blame", "refined": "I feel [emotion] when [situation]..."}}"""

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{OLLAMA_URL}/api/generate",
                json={
                    "model": OLLAMA_MODEL,
                    "prompt": prompt,
                    "format": "json",
                    "stream": False,
                },
                timeout=30.0,
            )
            response.raise_for_status()
            result = response.json()

            # Parse the response
            import json

            ai_response = json.loads(result.get("response", "{}"))

            return ReframeResponse(
                emotion=ai_response.get("emotion", "concerned"),
                situation=ai_response.get("situation", request.statement),
                refined=ai_response.get(
                    "refined", f"I feel concerned when {request.statement}"
                ),
            )
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="AI service timeout") from None
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}") from e
    except Exception:
        # Fallback response if AI fails
        return ReframeResponse(
            emotion="concerned",
            situation=request.statement.lower(),
            refined=f"I feel concerned when {request.statement.lower()}",
        )


@app.post("/ai/suggest-emotions", response_model=SuggestEmotionsResponse)
async def suggest_emotions(request: SuggestEmotionsRequest):
    """
    Suggest emotion words based on context.

    Helps users find the right words to express their feelings.
    """
    if not request.context.strip():
        # Return default emotions if no context
        return SuggestEmotionsResponse(
            emotions=["hurt", "frustrated", "worried", "lonely", "overwhelmed"]
        )

    prompt = f"""You are a compassionate therapist helping someone identify their emotions.

Based on this context, suggest 5 emotion words that the person might be feeling.
Use simple, common words that anyone would understand.
Focus on vulnerable emotions (not just anger).

Context: "{request.context}"

Respond with ONLY a JSON array of 5 emotion words:
["emotion1", "emotion2", "emotion3", "emotion4", "emotion5"]"""

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{OLLAMA_URL}/api/generate",
                json={
                    "model": OLLAMA_MODEL,
                    "prompt": prompt,
                    "format": "json",
                    "stream": False,
                },
                timeout=30.0,
            )
            response.raise_for_status()
            result = response.json()

            import json

            emotions = json.loads(result.get("response", "[]"))

            if isinstance(emotions, list) and len(emotions) > 0:
                return SuggestEmotionsResponse(emotions=emotions[:5])
            else:
                return SuggestEmotionsResponse(
                    emotions=["hurt", "frustrated", "worried", "lonely", "overwhelmed"]
                )
    except Exception:
        # Fallback emotions
        return SuggestEmotionsResponse(
            emotions=["hurt", "frustrated", "worried", "lonely", "overwhelmed"]
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
