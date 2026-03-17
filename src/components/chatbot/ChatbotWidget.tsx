import { useMemo, useState } from "react";
import { Bot, MessageCircleQuestion, Send, X } from "lucide-react";
import { getStaticCatalogProducts } from "@/data/catalogProducts";
import { answerChatbotQuestionAsync } from "@/services/chatbot";

type ChatMessage = {
  role: "user" | "bot";
  text: string;
};

const initialBotMessage =
  "Hi! I can help with rice types, prices, delivery timelines, subscriptions, order status, and payment options.";

export const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "bot", text: initialBotMessage }]);
  const products = useMemo(() => getStaticCatalogProducts(), []);

  const askBot = async (question: string) => {
    const answer = await answerChatbotQuestionAsync(question, { products });

    setMessages((previous) => {
      const next: ChatMessage[] = [
        ...previous,
        { role: "user", text: question },
        { role: "bot", text: answer.text },
      ];

      if (answer.suggestions && answer.suggestions.length > 0) {
        next.push({
          role: "bot",
          text: `You can also ask: ${answer.suggestions.join(" | ")}`,
        });
      }

      return next;
    });
  };

  const submit = () => {
    const question = draft.trim();
    if (!question) {
      return;
    }

    setDraft("");
    void askBot(question);
  };

  return (
    <div className="fixed bottom-20 right-5 z-50">
      {open ? (
        <div className="w-[92vw] max-w-sm overflow-hidden rounded-2xl border border-[#e8dfd1] bg-white shadow-xl">
          <div className="flex items-center justify-between bg-[#2b1f14] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot size={18} className="text-[#f8e0a3]" />
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-[#f8e0a3]">AI Assistant</p>
                <p className="text-sm font-semibold">Vari Agro Help Bot</p>
              </div>
            </div>
            <button
              className="rounded-full p-1 hover:bg-white/20"
              onClick={() => setOpen(false)}
              aria-label="Close chatbot"
            >
              <X size={18} />
            </button>
          </div>

          <div className="max-h-80 space-y-2 overflow-y-auto bg-[#fffaf2] p-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${
                  message.role === "user"
                    ? "ml-auto bg-brand-red text-white"
                    : "bg-white text-[#2b1f14] border border-[#efe4d6]"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-[#f1e6d8] bg-white p-3">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  submit();
                }
              }}
              placeholder="Ask about products, pricing, delivery..."
              className="h-10 flex-1 rounded-xl border border-[#e8dfd1] px-3 text-sm outline-none focus:border-brand-red"
            />
            <button
              type="button"
              onClick={submit}
              className="grid h-10 w-10 place-items-center rounded-xl bg-brand-red text-white"
              aria-label="Send chatbot message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : null}

      <button
        className="mt-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#2b1f14] text-white shadow-lg transition hover:scale-105"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open chatbot"
      >
        <MessageCircleQuestion size={20} />
      </button>
    </div>
  );
};
