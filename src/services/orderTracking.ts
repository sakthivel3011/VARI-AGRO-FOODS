import { getOrderById } from "@/services/orders";

export const getOrderStatusText = (status: string): string => {
  switch (status) {
    case "placed":
      return "Order placed successfully";
    case "processing":
      return "Order is being packed";
    case "shipped":
      return "Order is on the way";
    case "delivered":
      return "Order delivered";
    case "cancelled":
      return "Order cancelled";
    default:
      return "Status unavailable";
  }
};

export const getTrackingSnapshot = async (orderId: string): Promise<string> => {
  const order = await getOrderById(orderId);
  if (!order) {
    return "Order not found.";
  }

  return `${getOrderStatusText(order.status)} · Payment ${order.paymentStatus}`;
};
