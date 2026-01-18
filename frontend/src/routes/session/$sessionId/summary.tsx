import { createFileRoute, Link } from "@tanstack/react-router";
import { PartyPopper, Heart, MessageCircle, Home, Trash2, ArrowDown } from "lucide-react";
import { useLocalSession } from "@/hooks/useLocalSession";
import { deleteSession } from "@/lib/storage";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/session/$sessionId/summary")({
  component: SummaryPage,
});

function SummaryPage() {
  const { sessionId } = Route.useParams();
  const navigate = useNavigate();
  const { session, loading } = useLocalSession(sessionId);

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

  const handleDelete = () => {
    if (confirm("Delete this conversation? This cannot be undone.")) {
      deleteSession(sessionId);
      navigate({ to: "/" });
    }
  };

  const { partnerAData, partnerBResponses, partnerBData } = session;

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in">
      {/* Celebration */}
      <section className="text-center py-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-mint mb-4">
          <PartyPopper className="w-10 h-10 text-sage" />
        </div>
        <h1 className="text-2xl mb-2">Well Done!</h1>
        <p className="text-text-secondary">
          You've completed a Gentle Disagree conversation together.
        </p>
      </section>

      {/* Partner A shared */}
      <section className="card space-y-3">
        <div className="flex items-center gap-2">
          <span className="partner-badge partner-badge-a">A</span>
          <h2 className="text-lg font-semibold">{session.partnerA} shared</h2>
        </div>

        <div className="space-y-3 text-sm">
          {partnerAData.intentAcknowledgment && (
            <div className="bg-mint/20 rounded-lg p-3">
              <p className="text-text-muted text-xs mb-1">Acknowledged good intentions:</p>
              <p className="text-text-primary italic">
                "{partnerAData.intentAcknowledgment}"
              </p>
            </div>
          )}

          <div>
            <p className="text-text-muted text-xs">Feeling:</p>
            <p className="text-text-primary">
              "I feel <strong>{partnerAData.iStatement.emotion}</strong> when{" "}
              {partnerAData.iStatement.situation}"
            </p>
          </div>

          {partnerAData.problemDescription && (
            <div>
              <p className="text-text-muted text-xs">About:</p>
              <p className="text-text-primary">{partnerAData.problemDescription}</p>
            </div>
          )}

          <div>
            <p className="text-text-muted text-xs">Request:</p>
            <p className="text-text-primary">"{partnerAData.request}"</p>
          </div>
        </div>
      </section>

      {/* Flow arrow */}
      <div className="flex justify-center">
        <ArrowDown className="w-6 h-6 text-sage/50" />
      </div>

      {/* Partner B responded */}
      <section className="card space-y-3">
        <div className="flex items-center gap-2">
          <span className="partner-badge partner-badge-b">B</span>
          <h2 className="text-lg font-semibold">{session.partnerB} responded</h2>
        </div>

        <div className="space-y-3 text-sm">
          {partnerBResponses.reflection && (
            <div>
              <p className="text-text-muted text-xs">Reflection:</p>
              <p className="text-text-primary italic">
                "{partnerBResponses.reflection}"
              </p>
            </div>
          )}

          {partnerBResponses.acknowledgment && (
            <div>
              <p className="text-text-muted text-xs">
                Response to request
                {partnerBResponses.acknowledgmentType && (
                  <span className="ml-1">
                    (
                    {partnerBResponses.acknowledgmentType === "accept"
                      ? "accepted"
                      : partnerBResponses.acknowledgmentType === "discuss"
                        ? "wants to discuss"
                        : "proposed alternative"}
                    )
                  </span>
                )}
                :
              </p>
              <p className="text-text-primary">"{partnerBResponses.acknowledgment}"</p>
            </div>
          )}
        </div>
      </section>

      {/* Flow arrow */}
      <div className="flex justify-center">
        <ArrowDown className="w-6 h-6 text-sage/50" />
      </div>

      {/* Partner B shared */}
      <section className="card space-y-3">
        <div className="flex items-center gap-2">
          <span className="partner-badge partner-badge-b">B</span>
          <h2 className="text-lg font-semibold">{session.partnerB} shared</h2>
        </div>

        <div className="space-y-3 text-sm">
          {partnerBData.iStatement.emotion && partnerBData.iStatement.situation && (
            <div>
              <p className="text-text-muted text-xs">Feeling:</p>
              <p className="text-text-primary">
                "I feel <strong>{partnerBData.iStatement.emotion}</strong> when{" "}
                {partnerBData.iStatement.situation}"
              </p>
            </div>
          )}

          {partnerBData.request ? (
            <div>
              <p className="text-text-muted text-xs">Request:</p>
              <p className="text-text-primary">"{partnerBData.request}"</p>
            </div>
          ) : (
            <p className="text-text-muted text-xs italic">
              No additional request made
            </p>
          )}
        </div>
      </section>

      {/* Repair phrases */}
      <section className="space-y-2">
        <p className="text-sm text-text-muted text-center">
          Helpful phrases for moving forward:
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <button className="phrase-chip text-xs">"I love you"</button>
          <button className="phrase-chip text-xs">
            "This is not your problem, it's our problem"
          </button>
          <button className="phrase-chip text-xs">
            "One thing I admire about you is..."
          </button>
          <button className="phrase-chip text-xs">"Thank you for..."</button>
        </div>
      </section>

      {/* Affirmation */}
      <div className="affirmation">
        <Heart className="w-4 h-4" />
        <span>Every conversation like this strengthens your bond.</span>
      </div>

      {/* Actions */}
      <section className="space-y-3">
        <Link
          to="/session/new"
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Start Another Conversation
        </Link>

        <Link
          to="/"
          className="btn-secondary w-full flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          Return Home
        </Link>
      </section>

      {/* Delete option */}
      <div className="text-center pt-4 border-t border-stone">
        <button
          onClick={handleDelete}
          className="text-sm text-text-muted hover:text-error flex items-center justify-center gap-1 mx-auto"
        >
          <Trash2 className="w-4 h-4" />
          Delete this conversation
        </button>
        <p className="text-xs text-text-muted mt-1">
          This data is only on your device
        </p>
      </div>
    </div>
  );
}
