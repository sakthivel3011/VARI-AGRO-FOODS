import {
  deleteReviewById,
  getReviewsForModeration,
  updateReviewModerationStatus,
  type ReviewRecord,
} from "@/services/reviews";

export type ReviewModerationAction = "approve" | "reject" | "delete";

export const loadModerationReviews = async (): Promise<ReviewRecord[]> => {
  return getReviewsForModeration(200);
};

export const applyReviewModeration = async (
  reviewId: string,
  action: ReviewModerationAction,
): Promise<void> => {
  if (action === "approve") {
    await updateReviewModerationStatus(reviewId, "approved");
    return;
  }

  if (action === "reject") {
    await updateReviewModerationStatus(reviewId, "rejected");
    return;
  }

  await deleteReviewById(reviewId);
};
