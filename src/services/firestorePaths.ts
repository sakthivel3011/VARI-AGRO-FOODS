export const collections = {
  users: "users",
  products: "products",
  orders: "orders",
  reviews: "reviews",
  subscriptions: "subscriptions",
  messages: "messages",
} as const;

export const docPaths = {
  user: (uid: string) => `${collections.users}/${uid}`,
};
