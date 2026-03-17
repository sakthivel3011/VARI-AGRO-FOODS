const processedImages = new Set<string>();

export const warmImage = (url: string): void => {
  if (!url || processedImages.has(url)) {
    return;
  }

  const image = new Image();
  image.loading = "eager";
  image.decoding = "async";
  image.src = url;

  processedImages.add(url);
};

export const warmCriticalImages = (urls: string[]): void => {
  urls.slice(0, 4).forEach((url) => warmImage(url));
};
