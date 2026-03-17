import type { CatalogProduct } from "@/types/product";

export type VoiceOrderIntent = {
  quantity: number;
  matchedProduct: CatalogProduct | null;
  rawText: string;
};

const detectQuantityKg = (text: string): number => {
  const normalized = text.toLowerCase();
  const kgMatch = normalized.match(/(\d+)\s*(kg|kilogram|kilo)/);
  if (kgMatch) {
    return Number(kgMatch[1]);
  }

  const numberOnly = normalized.match(/order\s+(\d+)/);
  if (numberOnly) {
    return Number(numberOnly[1]);
  }

  return 1;
};

const scoreProductMatch = (text: string, product: CatalogProduct): number => {
  const normalized = text.toLowerCase();
  const name = product.name.toLowerCase();
  const type = product.type.toLowerCase();

  let score = 0;

  if (normalized.includes(name)) {
    score += 5;
  }

  if (normalized.includes(type)) {
    score += 3;
  }

  const tokens = [...name.split(" "), ...type.split(" ")].filter((token) => token.length > 2);
  for (const token of tokens) {
    if (normalized.includes(token)) {
      score += 1;
    }
  }

  return score;
};

export const parseVoiceOrderIntent = (
  speechText: string,
  products: CatalogProduct[],
): VoiceOrderIntent => {
  const quantity = detectQuantityKg(speechText);

  let bestProduct: CatalogProduct | null = null;
  let bestScore = 0;

  products.forEach((product) => {
    const score = scoreProductMatch(speechText, product);
    if (score > bestScore) {
      bestScore = score;
      bestProduct = product;
    }
  });

  return {
    quantity,
    matchedProduct: bestScore > 0 ? bestProduct : null,
    rawText: speechText,
  };
};

type SpeechRecognitionConstructor = new () => {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionEventLike = {
  results: ArrayLike<{ 0: { transcript: string } }>;
};

const getSpeechRecognition = (): SpeechRecognitionConstructor | null => {
  const win = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

  return win.SpeechRecognition ?? win.webkitSpeechRecognition ?? null;
};

export const isVoiceOrderingSupported = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(getSpeechRecognition());
};

export const describeVoiceSupport = (): string => {
  return isVoiceOrderingSupported()
    ? "Voice ordering is available on this browser."
    : "Voice ordering needs a browser with SpeechRecognition support (Chrome/Edge).";
};

export const startVoiceCapture = (
  onTranscript: (text: string) => void,
  onError: (message: string) => void,
): { stop: () => void } | null => {
  const Recognition = getSpeechRecognition();
  if (!Recognition) {
    onError("Voice ordering is not supported on this browser.");
    return null;
  }

  const recognition = new Recognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-IN";

  recognition.onresult = (event) => {
    const transcript = event.results[0]?.[0]?.transcript ?? "";
    onTranscript(transcript);
  };

  recognition.onerror = (event) => {
    onError(event.error || "Voice recognition failed.");
  };

  recognition.start();

  return {
    stop: () => recognition.stop(),
  };
};
