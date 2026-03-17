import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
import HomePage from "@/pages/HomePage";
import ProductsPage from "@/pages/ProductsPage";
import SubscriptionPage from "@/pages/SubscriptionPage";
import ReviewsPage from "@/pages/ReviewsPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";
import ProductDetailsPage from "@/pages/ProductDetailsPage";
import NotFoundPage from "@/pages/NotFoundPage";
import DevSeedPage from "@/pages/DevSeedPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import ProfilePage from "@/pages/dashboard/ProfilePage";
import OrdersPage from "@/pages/dashboard/OrdersPage";
import HistoryPage from "@/pages/dashboard/HistoryPage";
import SubscriptionsPage from "@/pages/dashboard/SubscriptionsPage";
import AddressesPage from "@/pages/dashboard/AddressesPage";
import OverviewPage from "@/pages/admin/OverviewPage";
import ProductsAdminPage from "@/pages/admin/ProductsAdminPage";
import OrdersAdminPage from "@/pages/admin/OrdersAdminPage";
import UsersAdminPage from "@/pages/admin/UsersAdminPage";
import CustomerManagementPage from "@/pages/admin/CustomerManagementPage";
import ReviewsAdminPage from "@/pages/admin/ReviewsAdminPage";
import AnalyticsAdminPage from "@/pages/admin/AnalyticsAdminPage";
import MessagesAdminPage from "@/pages/admin/MessagesAdminPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "products/:slug", element: <ProductDetailsPage /> },
      { path: "subscription", element: <SubscriptionPage /> },
      { path: "reviews", element: <ReviewsPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "order-success/:orderId", element: <OrderSuccessPage /> },
      { path: "dev/seed", element: <DevSeedPage /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/admin/login", element: <AdminLoginPage /> },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <ProfilePage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "history", element: <HistoryPage /> },
      { path: "subscriptions", element: <SubscriptionsPage /> },
      { path: "addresses", element: <AddressesPage /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <OverviewPage /> },
      { path: "products", element: <ProductsAdminPage /> },
      { path: "orders", element: <OrdersAdminPage /> },
      { path: "users", element: <UsersAdminPage /> },
      { path: "customers", element: <CustomerManagementPage /> },
      { path: "reviews", element: <ReviewsAdminPage /> },
      { path: "messages", element: <MessagesAdminPage /> },
      { path: "analytics", element: <AnalyticsAdminPage /> },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
