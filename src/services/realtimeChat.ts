import { subscribeApprovedMessages, postMessage } from "@/services/chat";

const randomName = (): string => {
  const number = Math.floor(Math.random() * 9000) + 1000;
  return `RiceFan-${number}`;
};

const CHAT_NAME_KEY = "vari-chat-anon-name";

export const getAnonymousName = (): string => {
  const fromStorage = localStorage.getItem(CHAT_NAME_KEY);
  if (fromStorage && fromStorage.trim().length > 0) {
    return fromStorage;
  }

  const name = randomName();
  localStorage.setItem(CHAT_NAME_KEY, name);
  return name;
};

export const setAnonymousName = (name: string): void => {
  const trimmed = name.trim();
  if (!trimmed) {
    return;
  }

  localStorage.setItem(CHAT_NAME_KEY, trimmed);
};

export const subscribeCommunityChat = subscribeApprovedMessages;
export const sendCommunityMessage = postMessage;

export const getCommunityChatModerationHint = (): string => {
  return "Chat is moderated by admin for spam and abusive content.";
};
