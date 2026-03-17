import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/config/firebase";

const createSafeFilename = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-");
};

export const uploadReviewFeedbackMedia = async (
  userId: string,
  file: File,
): Promise<string> => {
  const safeName = createSafeFilename(file.name || "feedback.jpg");
  const path = `review-media/${userId}/${Date.now()}-${safeName}`;
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, file, {
    contentType: file.type,
  });

  return getDownloadURL(storageRef);
};

export const uploadProductImage = async (file: File): Promise<string> => {
  const safeName = createSafeFilename(file.name || "product.jpg");
  const path = `product-images/${Date.now()}-${safeName}`;
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, file, {
    contentType: file.type,
  });

  return getDownloadURL(storageRef);
};
