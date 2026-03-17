import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import {
  getCommunityChatModerationHint,
  getAnonymousName,
  sendCommunityMessage,
  setAnonymousName,
  subscribeCommunityChat,
} from "@/services/realtimeChat";
import type { MessageRecord } from "@/services/chat";

const formatTime = (raw: unknown): string => {
  if (!raw || typeof raw !== "object") {
    return "now";
  }

  const data = raw as { toDate?: () => Date };
  if (typeof data.toDate !== "function") {
    return "now";
  }

  return data.toDate().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const AnonymousChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [anonymousName, setAnonymousNameState] = useState("RiceFan");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [sending, setSending] = useState(false);
  const moderationHint = getCommunityChatModerationHint();

  useEffect(() => {
    const initialName = getAnonymousName();
    setAnonymousNameState(initialName);

    const unsubscribe = subscribeCommunityChat((next) => {
      setMessages(next);
    });

    return () => unsubscribe();
  }, []);

  const orderedMessages = useMemo(() => [...messages].reverse(), [messages]);

  const submitMessage = async () => {
    const text = draft.trim();
    if (!text) {
      return;
    }

    try {
      setSending(true);
      await sendCommunityMessage({
        anonymousName,
        text,
      });
      setDraft("");
    } catch (error) {
      console.error("Failed to send chat message", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="w-[92vw] max-w-sm overflow-hidden rounded-2xl border border-[#e8dfd1] bg-white shadow-xl">
          <div className="flex items-center justify-between bg-brand-red px-4 py-3 text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-[#ffdca0]">Community Chat</p>
              <p className="font-semibold">Anonymous Rice Talk</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1 hover:bg-white/20"
              aria-label="Close anonymous chat"
            >
              <X size={18} />
            </button>
          </div>

          <div className="border-b border-[#f1e6d8] px-3 py-2">
            <p className="text-[11px] text-[#7a6d5f]">{moderationHint}</p>
            <label className="text-[11px] uppercase tracking-[0.1em] text-[#7a6d5f]">Anonymous Name</label>
            <input
              value={anonymousName}
              onChange={(event) => {
                const value = event.target.value;
                setAnonymousNameState(value);
              }}
              onBlur={() => setAnonymousName(anonymousName)}
              className="mt-1 h-9 w-full rounded-lg border border-[#e8dfd1] px-3 text-sm outline-none focus:border-brand-red"
            />
          </div>

          <div className="max-h-72 space-y-2 overflow-y-auto bg-[#fffaf2] p-3">
            {orderedMessages.length === 0 ? (
              <p className="text-sm text-[#6f6254]">No approved messages yet. Start the conversation.</p>
            ) : (
              orderedMessages.map((message) => (
                <article key={message.id} className="rounded-xl border border-[#efe4d6] bg-white p-3">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.08em] text-[#7a6d5f]">
                    <span>{message.data.anonymousName}</span>
                    <span>{formatTime(message.data.createdAt)}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#2b1f14]">{message.data.text}</p>
                </article>
              ))
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-[#f1e6d8] bg-white p-3">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void submitMessage();
                }
              }}
              placeholder="Share your rice experience..."
              className="h-10 flex-1 rounded-xl border border-[#e8dfd1] px-3 text-sm outline-none focus:border-brand-red"
            />
            <button
              type="button"
              onClick={() => void submitMessage()}
              disabled={sending}
              className="grid h-10 w-10 place-items-center rounded-xl bg-brand-red text-white disabled:opacity-60"
              aria-label="Send anonymous chat message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : null}

      <button
        className="mt-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-red text-white shadow-lg transition hover:scale-105"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open anonymous chat"
      >
        <MessageCircle size={20} />
      </button>
    </div>
  );
};
