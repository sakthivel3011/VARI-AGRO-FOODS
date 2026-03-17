import { useEffect } from "react";
import { applySeoMeta } from "@/services/seo";

export const useSeo = (meta: {
  title: string;
  description: string;
  canonicalPath?: string;
}): void => {
  const { title, description, canonicalPath } = meta;

  useEffect(() => {
    applySeoMeta({ title, description, canonicalPath });
  }, [title, description, canonicalPath]);
};
