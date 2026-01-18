import { createFileRoute, Link } from "@tanstack/react-router";
import { History, Trash2, MessageCircle, Clock } from "lucide-react";
import { getSessions, deleteSession, type LocalSession } from "@/lib/storage";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
});

function HistoryPage() {
  const [sessions, setSessions] = useState<LocalSession[]>([]);

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Delete this conversation?")) {
      deleteSession(id);
      setSessions(getSessions());
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <section className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-mint">
          <History className="w-6 h-6 text-sage" />
        </div>
        <h1 className="text-2xl">Conversation History</h1>
        <p className="text-text-secondary">
          All conversations are stored only on this device.
        </p>
      </section>

      {/* Sessions list */}
      {sessions.length === 0 ? (
        <div className="card text-center py-8">
          <MessageCircle className="w-12 h-12 text-stone mx-auto mb-4" />
          <p className="text-text-muted mb-4">No conversations yet.</p>
          <Link to="/session/new" className="btn-primary inline-flex">
            Start Your First Conversation
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-text-primary truncate">
                      {session.partnerA} & {session.partnerB}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        session.status === "completed"
                          ? "bg-mint text-sage-dark"
                          : "bg-accent-warm/20 text-accent-warm"
                      }`}
                    >
                      {session.status === "completed" ? "Completed" : "In Progress"}
                    </span>
                  </div>

                  {session.topic && (
                    <p className="text-sm text-text-secondary truncate mb-1">
                      {session.topic}
                    </p>
                  )}

                  <p className="text-xs text-text-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(session.createdAt)}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(session.id)}
                  className="text-text-muted hover:text-error p-1"
                  aria-label="Delete conversation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {session.status === "in_progress" && (
                <Link
                  to="/session/$sessionId/readiness"
                  params={{ sessionId: session.id }}
                  className="btn-secondary mt-3 w-full text-center text-sm"
                >
                  Continue Conversation
                </Link>
              )}

              {session.status === "completed" && (
                <Link
                  to="/session/$sessionId/summary"
                  params={{ sessionId: session.id }}
                  className="btn-ghost mt-3 w-full text-center text-sm"
                >
                  View Summary
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Privacy note */}
      <p className="text-xs text-text-muted text-center">
        Conversations are never sent to any server. They stay on this device
        only.
      </p>
    </div>
  );
}
