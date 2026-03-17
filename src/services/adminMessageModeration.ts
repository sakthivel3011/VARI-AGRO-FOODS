import {
  deleteMessageById,
  getMessagesForModeration,
  updateMessageModerationStatus,
  type MessageRecord,
} from "@/services/chat";

export type MessageModerationAction = "approve" | "reject" | "delete";

export const loadModerationMessages = async (): Promise<MessageRecord[]> => {
  return getMessagesForModeration(250);
};

export const applyMessageModeration = async (
  messageId: string,
  action: MessageModerationAction,
): Promise<void> => {
  if (action === "approve") {
    await updateMessageModerationStatus(messageId, "approved");
    return;
  }

  if (action === "reject") {
    await updateMessageModerationStatus(messageId, "rejected");
    return;
  }

  await deleteMessageById(messageId);
};
