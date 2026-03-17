export const applySeoMeta = (input: {
  title: string;
  description: string;
  canonicalPath?: string;
}): void => {
  document.title = input.title;

  const description =
    document.querySelector<HTMLMetaElement>('meta[name="description"]') ??
    document.createElement("meta");
  description.name = "description";
  description.content = input.description;

  if (!description.parentElement) {
    document.head.appendChild(description);
  }

  if (input.canonicalPath) {
    const canonical =
      document.querySelector<HTMLLinkElement>('link[rel="canonical"]') ??
      document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = `${window.location.origin}${input.canonicalPath}`;

    if (!canonical.parentElement) {
      document.head.appendChild(canonical);
    }
  }
};
