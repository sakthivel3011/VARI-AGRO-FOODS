import { logEvent } from "firebase/analytics";
import { initAnalytics } from "@/config/firebase";

export const trackEvent = async (name: string, params?: Record<string, string | number>): Promise<void> => {
  const analytics = await initAnalytics();

  if (!analytics) {
    return;
  }

  logEvent(analytics, name, params);
};
