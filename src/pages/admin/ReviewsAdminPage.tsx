import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ReviewModerationBadge } from "@/components/reviews/ReviewModerationBadge";
import {
  applyReviewModeration,
  loadModerationReviews,
  type ReviewModerationAction,
} from "@/services/adminReviewModeration";
import { loadModerationMessages, applyMessageModeration } from "@/services/adminMessageModeration";
import type { ReviewRecord } from "@/services/reviews";
import type { MessageRecord } from "@/services/chat";
import { useSeo } from "@/hooks/useSeo";
import { demoMessages, demoReviews } from "@/data/adminDemoData";

const ReviewsAdminPage = () => {
  useSeo({
    title: "Admin Moderation | Vari Agro Foods",
    description: "Moderate customer reviews and anonymous community chat messages.",
    canonicalPath: "/admin/reviews",
  });

  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  const loadAll = async () => {
    try {
      setLoading(true);
      const [reviewItems, messageItems] = await Promise.all([
        loadModerationReviews(),
        loadModerationMessages(),
      ]);
      const useDemo = reviewItems.length === 0 && messageItems.length === 0;
      setReviews(useDemo ? demoReviews : reviewItems);
      setMessages(useDemo ? demoMessages : messageItems);
      setStatusMessage(useDemo ? "Showing sample moderation queue for review." : "");
    } catch (error) {
      console.error("Failed to load moderation data", error);
      setReviews(demoReviews);
      setMessages(demoMessages);
      setStatusMessage("Live moderation data unavailable. Showing sample data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
  }, []);

  const moderateReview = async (id: string, action: ReviewModerationAction) => {
    try {
      await applyReviewModeration(id, action);
      await loadAll();
    } catch (error) {
      console.error("Failed to moderate review", error);
    }
  };

  const moderateMessage = async (id: string, action: "approve" | "reject" | "delete") => {
    try {
      await applyMessageModeration(id, action);
      await loadAll();
    } catch (error) {
      console.error("Failed to moderate message", error);
    }
  };

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-green">Review Moderation</p>
      <h2 className="mt-2 font-heading text-3xl font-bold text-[#2b1f14]">Reviews</h2>

      {loading ? <p className="mt-4 text-sm text-[#5d554c]">Loading moderation queue...</p> : null}
      {statusMessage ? <p className="mt-3 text-sm text-[#5d554c]">{statusMessage}</p> : null}

      <article className="mt-5 rounded-2xl border border-[#efe4d6] bg-white p-4 shadow-soft">
        <h3 className="font-heading text-xl font-bold text-[#2b1f14]">Customer Review Queue</h3>
        <div className="mt-3 space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl border border-[#f1e6d8] bg-[#fffdf9] p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-[#2b1f14]">{review.data.userName}</p>
                <ReviewModerationBadge status={review.data.moderationStatus} />
              </div>
              <p className="mt-2 text-sm text-[#5d554c]">{review.data.text}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="secondary" className="h-8 px-3" onClick={() => void moderateReview(review.id, "approve")}>
                  Approve
                </Button>
                <Button variant="outline" className="h-8 px-3" onClick={() => void moderateReview(review.id, "reject")}>
                  Reject
                </Button>
                <Button className="h-8 px-3" onClick={() => void moderateReview(review.id, "delete")}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
          {reviews.length === 0 ? <p className="text-sm text-[#5d554c]">No reviews in moderation queue.</p> : null}
        </div>
      </article>

      <article className="mt-6 rounded-2xl border border-[#efe4d6] bg-white p-4 shadow-soft">
        <h3 className="font-heading text-xl font-bold text-[#2b1f14]">Anonymous Chat Moderation</h3>
        <div className="mt-3 space-y-3">
          {messages.map((message) => (
            <div key={message.id} className="rounded-xl border border-[#f1e6d8] bg-[#fffdf9] p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-[#2b1f14]">{message.data.anonymousName}</p>
                <ReviewModerationBadge status={message.data.moderationStatus} />
              </div>
              <p className="mt-2 text-sm text-[#5d554c]">{message.data.text}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  className="h-8 px-3"
                  onClick={() => void moderateMessage(message.id, "approve")}
                >
                  Approve
                </Button>
                <Button
                  variant="outline"
                  className="h-8 px-3"
                  onClick={() => void moderateMessage(message.id, "reject")}
                >
                  Reject
                </Button>
                <Button className="h-8 px-3" onClick={() => void moderateMessage(message.id, "delete")}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
          {messages.length === 0 ? <p className="text-sm text-[#5d554c]">No chat messages in moderation queue.</p> : null}
        </div>
      </article>
    </div>
  );
};

export default ReviewsAdminPage;
