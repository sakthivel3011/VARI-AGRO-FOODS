import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { createReview } from "@/services/reviews";
import { uploadReviewFeedbackMedia } from "@/services/storage";

type ReviewComposerProps = {
  productId: string;
  productName: string;
  onSubmitted?: () => void;
};

export const ReviewComposer = ({ productId, productName, onSubmitted }: ReviewComposerProps) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const submit = async () => {
    if (!user) {
      setStatus("Please login to post a review.");
      return;
    }

    if (!text.trim()) {
      setStatus("Please write your feedback before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      let mediaUrls: string[] = [];

      if (file) {
        const url = await uploadReviewFeedbackMedia(user.uid, file);
        mediaUrls = [url];
      }

      await createReview({
        productId,
        userId: user.uid,
        userName: user.displayName ?? user.email?.split("@")[0] ?? "Customer",
        rating,
        text: text.trim(),
        mediaUrls,
      });

      setText("");
      setFile(null);
      setStatus(`Thanks! Your review for ${productName} was submitted for moderation.`);
      onSubmitted?.();
    } catch (error) {
      console.error("Failed to submit review", error);
      setStatus("Unable to submit review now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article className="rounded-2xl border border-[#efe4d6] bg-white p-5 shadow-soft">
      <h3 className="font-heading text-2xl font-bold text-[#2b1f14]">Write A Review</h3>
      <p className="mt-1 text-sm text-[#5d554c]">Share your experience with {productName}.</p>

      <div className="mt-4 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => {
          const value = index + 1;
          const active = value <= rating;

          return (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="rounded p-1"
              aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
              aria-pressed={active}
            >
              <Star size={18} className={active ? "fill-brand-gold text-brand-gold" : "text-[#c9bba7]"} />
            </button>
          );
        })}
      </div>

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={4}
        placeholder="How was the rice quality, aroma, and packaging?"
        className="mt-3 w-full rounded-xl border border-[#e8dfd1] p-3 text-sm outline-none focus:border-brand-red"
      />

      <div className="mt-3">
        <label className="text-xs uppercase tracking-[0.1em] text-[#7a6d5f]">Upload feedback image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="mt-1 block text-sm"
        />
        {file ? <p className="mt-1 text-xs text-[#7a6d5f]">Selected: {file.name}</p> : null}
      </div>

      <Button className="mt-3 h-9 px-4" onClick={() => void submit()} disabled={submitting}>
        {submitting ? "Posting..." : "Post Review"}
      </Button>
      {status ? <p className="mt-2 text-sm text-[#5d554c]">{status}</p> : null}
    </article>
  );
};
