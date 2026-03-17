const parseAdminEmails = (raw: string): string[] => {
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
};

export const adminEmailAllowlist = parseAdminEmails(import.meta.env.VITE_ADMIN_EMAILS ?? "");

export const isAdminEmail = (email: string | null | undefined): boolean => {
  if (!email) {
    return false;
  }

  return adminEmailAllowlist.includes(email.toLowerCase());
};
