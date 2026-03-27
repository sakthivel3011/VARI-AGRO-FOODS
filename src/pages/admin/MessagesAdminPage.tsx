import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { applyMessageModeration, loadModerationMessages } from "@/services/adminMessageModeration";
import type { MessageRecord } from "@/services/chat";
import { useSeo } from "@/hooks/useSeo";
import { demoMessages } from "@/data/adminDemoData";

const MessagesAdminPage = () => {
  useSeo({
    title: "Admin Messages | Vari Agro Foods",
    description: "Moderate anonymous customer chat messages and remove spam.",
    canonicalPath: "/admin/messages",
  });

  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await loadModerationMessages();
      if (data.length === 0) {
        setMessages(demoMessages);
        setStatusMessage("Showing sample messages for review.");
      } else {
        setMessages(data);
        setStatusMessage("");
      }
    } catch (error) {
      console.error("Failed to load message moderation queue", error);
      setMessages(demoMessages);
      setStatusMessage("Live messages unavailable. Showing sample data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMessages();
  }, []);

  const moderate = async (id: string, action: "approve" | "reject" | "delete") => {
    try {
      await applyMessageModeration(id, action);
      await loadMessages();
    } catch (error) {
      console.error("Failed to moderate message", error);
    }
  };

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-green">Message Moderation</p>
      <h2 className="mt-2 font-heading text-3xl font-bold text-[#2b1f14]">Community Messages</h2>

      {loading ? <p className="mt-4 text-sm text-[#5d554c]">Loading messages...</p> : null}
      {statusMessage ? <p className="mt-3 text-sm text-[#5d554c]">{statusMessage}</p> : null}

      <div className="mt-5 space-y-3">
        {messages.map((message) => (
          <article key={message.id} className="rounded-xl border border-[#efe4d6] bg-[#fffcf8] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-[#2b1f14]">{message.data.anonymousName}</p>
              <span className="rounded-full border border-[#e8dfd1] px-2 py-1 text-xs uppercase tracking-[0.1em] text-[#7a6d5f]">
                {message.data.moderationStatus}
              </span>
            </div>
            <p className="mt-2 text-sm text-[#5d554c]">{message.data.text}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="secondary" className="h-8 px-3" onClick={() => void moderate(message.id, "approve")}>
                Approve
              </Button>
              <Button variant="outline" className="h-8 px-3" onClick={() => void moderate(message.id, "reject")}>
                Reject
              </Button>
              <Button className="h-8 px-3" onClick={() => void moderate(message.id, "delete")}>
                Delete
              </Button>
            </div>
          </article>
        ))}
        {messages.length === 0 ? <p className="text-sm text-[#5d554c]">No messages in queue.</p> : null}
      </div>
    </div>
  );
};

export default MessagesAdminPage;
