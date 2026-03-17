import { useMemo, useState } from "react";
import { Mic, MicOff, X } from "lucide-react";
import { getStaticCatalogProducts } from "@/data/catalogProducts";
import {
  describeVoiceSupport,
  parseVoiceOrderIntent,
  startVoiceCapture,
} from "@/services/voiceOrdering";
import { useCart } from "@/hooks/useCart";

const chooseWeightByQuantity = (quantityKg: number, options: string[]): string => {
  if (options.length === 0) {
    return "1kg";
  }

  const preferred = `${quantityKg}kg`;
  const found = options.find((item) => item.toLowerCase() === preferred.toLowerCase());
  return found ?? options[0];
};

export const VoiceOrderWidget = () => {
  const products = useMemo(() => getStaticCatalogProducts(), []);
  const { addToCart } = useCart();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const supportHint = describeVoiceSupport();

  const startListening = () => {
    if (listening) {
      return;
    }

    setFeedback("");
    setListening(true);

    const controller = startVoiceCapture(
      (spokenText) => {
        setListening(false);
        setTranscript(spokenText);

        const intent = parseVoiceOrderIntent(spokenText, products);
        if (!intent.matchedProduct) {
          setFeedback("I could not match a rice product. Please try again with product name.");
          return;
        }

        const weight = chooseWeightByQuantity(intent.quantity, intent.matchedProduct.weightOptions);
        addToCart({
          product: intent.matchedProduct,
          weight,
          quantity: 1,
        });

        setFeedback(
          `Added ${intent.matchedProduct.name} (${weight}) to cart from voice command: "${spokenText}"`,
        );
      },
      (error) => {
        setListening(false);
        setFeedback(error);
      },
    );

    if (!controller) {
      setListening(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-5 left-5 z-40 w-[92vw] max-w-sm rounded-2xl border border-[#e8dfd1] bg-white p-4 shadow-xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-green">Voice Ordering</p>
              <h3 className="mt-1 font-heading text-xl font-bold text-[#2b1f14]">Quick Voice Cart Add</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="ml-2 text-[#7a6d5f] hover:text-[#2b1f14] transition-colors"
              aria-label="Close voice ordering widget"
            >
              <X size={20} />
            </button>
          </div>
          <p className="mt-2 text-sm text-[#5d554c]">Try: "Order 10 kg Basmati Rice"</p>
          <p className="mt-1 text-xs text-[#7a6d5f]">{supportHint}</p>

          <button
            type="button"
            onClick={startListening}
            disabled={listening}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {listening ? <MicOff size={16} /> : <Mic size={16} />}
            {listening ? "Listening..." : "Start Voice Order"}
          </button>

          {transcript ? <p className="mt-3 text-xs text-[#7a6d5f]">Heard: {transcript}</p> : null}
          {feedback ? <p className="mt-2 text-sm text-[#2b1f14]">{feedback}</p> : null}
        </div>
      )}
    </>
  );
};
