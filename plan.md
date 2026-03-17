# Vari Agro Foods - Implementation Plan

## Decisions Confirmed

- Online payments: Stripe
- Chatbot v1: Smart FAQ bot (intent/rule based, no external LLM key)
- Admin provisioning: Admin email allowlist (securely enforced via backend)

## Architecture

- Frontend: React + Vite + TypeScript + Tailwind CSS + React Router + AOS + Framer Motion
- Backend: Firebase Auth, Firestore, Storage, Analytics, and Firebase Cloud Functions for secure server logic
- Payments: Stripe Checkout + Webhooks (one-time orders + weekly/monthly subscriptions)
- Admin charts: Recharts
- Deployment: Vercel/Netlify-compatible frontend with Firebase backend services

## Project Structure

```txt
variagrofoods/
  functions/
    src/index.ts
    src/stripe.ts
    src/admin.ts
    src/moderation.ts
  public/
  src/
    app/router.tsx
    app/providers.tsx
    config/firebase.ts
    config/env.ts
    context/AuthContext.tsx
    context/CartContext.tsx
    services/{auth,products,orders,reviews,chat,subscriptions}.ts
    components/{layout,ui,home,products,checkout,chatbot,voice,admin}/...
    pages/
      HomePage.tsx ProductsPage.tsx ProductDetailsPage.tsx
      CartPage.tsx CheckoutPage.tsx OrderSuccessPage.tsx
      SubscriptionPage.tsx ReviewsPage.tsx AboutPage.tsx ContactPage.tsx
      dashboard/{Profile,Orders,History,Subscriptions,Addresses}.tsx
      admin/{Overview,Products,Orders,Users,Reviews,Analytics,Messages}.tsx
    styles/{tailwind.css,theme.css}
    main.tsx
```

## Routes and Features

- Public: `/`, `/products`, `/products/:slug`, `/subscription`, `/reviews`, `/about`, `/contact`
- Commerce: `/cart`, `/checkout`, `/order-success/:orderId`
- User dashboard: `/dashboard/profile`, `/dashboard/orders`, `/dashboard/history`, `/dashboard/subscriptions`, `/dashboard/addresses`
- Admin dashboard: `/admin/*` with role guard
- Floating utilities: AI chatbot widget + voice order widget + anonymous community chat panel

## Firestore Collections

- `users`: profile, role, addresses, lastLoginAt, timestamps
- `products`: type, pricing, stock, images, rating, popularity, featured/new flags
- `orders`: items, totals, payment/status, delivery info, timestamps
- `reviews`: product/user refs, rating, text, media, moderation status
- `subscriptions`: plan, product, quantity, Stripe IDs, next delivery, status
- `messages`: anonymous alias, text, moderation flags, timestamps

## Security and Admin Control

- Firebase rules enforce owner-based access and admin-only writes for moderation/management
- Admin role assignment validated via backend allowlist logic (not client-trusted)
- Stripe secret and webhook keys stored only in server environment variables
- Dedicated moderation flows for reviews and chat messages in admin panel

## Premium UI Direction

- Brand tokens: deep red (primary), gold (secondary), green (accent), white (background)
- Hero with farm imagery, gradient overlays, premium typography, soft shadows
- Smooth AOS section reveals + Framer Motion interactions
- Fully responsive behavior across desktop, laptop, tablet, mobile, and small devices

## Execution Phases

1. Scaffold app, routing, theme system, shared components, navbar/footer
2. Integrate Firebase (auth/firestore/storage/analytics), role guards, and admin access
3. Build catalog, product details, sample pack flow, cart, checkout, and order success
4. Add subscriptions, Stripe billing, and webhook lifecycle handling
5. Implement reviews, anonymous realtime chat, voice ordering, and smart FAQ chatbot
6. Complete user/admin dashboards, analytics charts, performance/SEO, and deploy setup

## Phase 2 Implementation Status

Completed in this codebase:

- Firebase core setup:
  - `src/config/firebase.ts` initializes App, Auth, Firestore, Storage, and Analytics bootstrap.
  - `src/config/env.ts` + `src/vite-env.d.ts` provide typed environment config with supplied Vari Agro Foods values.
  - `.env.example` added for deployment/local env bootstrapping.

- Authentication and role guard system:
  - Google Sign-In service in `src/services/auth.ts`.
  - User profile upsert/get in Firestore via `src/services/users.ts`.
  - Context provider in `src/context/AuthContext.tsx`.
  - Shared auth hook `src/hooks/useAuth.ts`.
  - Route guards: `src/components/auth/ProtectedRoute.tsx` and `src/components/auth/AdminRoute.tsx`.

- Role-aware navigation and dashboards:
  - Navbar auth state wiring in `src/components/layout/NavBar.tsx`.
  - User dashboard shell in `src/components/layout/DashboardLayout.tsx`.
  - Admin dashboard shell in `src/components/layout/AdminLayout.tsx`.
  - Dashboard and admin page scaffolds created under `src/pages/dashboard/*` and `src/pages/admin/*`.

- Router integration:
  - Protected `/dashboard/*` and `/admin/*` routes added in `src/app/router.tsx`.
  - Dev seed route `/dev/seed` added for product bootstrap.

- Firestore/Storage security and indexes:
  - `firestore.rules` with owner checks, admin checks, and email allowlist guard for admin role creation.
  - `storage.rules` with user/admin write segmentation.
  - `firestore.indexes.json` with initial indexes for products/orders/reviews/subscriptions/messages.
  - `firebase.json` wired for rules/indexes/hosting rewrite.

- Firestore service layer (phase-2 foundation):
  - `src/services/products.ts`
  - `src/services/orders.ts`
  - `src/services/reviews.ts`
  - `src/services/subscriptions.ts`
  - `src/services/chat.ts`
  - `src/services/analytics.ts`

- Data model typing:
  - Firestore document types in `src/types/firestore.ts`.

- Validation:
  - `npm run lint` passes.
  - `npm run build` passes.

## Phase 3 Implementation Status

Completed in this codebase:

- Commerce core pages and routing:
  - Product details page: `src/pages/ProductDetailsPage.tsx`
  - Cart page: `src/pages/CartPage.tsx`
  - Checkout page: `src/pages/CheckoutPage.tsx`
  - Order success page: `src/pages/OrderSuccessPage.tsx`
  - Routes added in `src/app/router.tsx` for `/products/:slug`, `/checkout`, `/order-success/:orderId`

- Cart state management:
  - Cart provider and logic: `src/context/CartContext.tsx`
  - Shared context contract: `src/context/cart-context.ts`
  - Cart hook: `src/hooks/useCart.ts`
  - Quantity selector component: `src/components/cart/QuantityInput.tsx`
  - Navbar cart badge integration: `src/components/layout/NavBar.tsx`

- Product data/model improvements:
  - Catalog and cart types: `src/types/product.ts`
  - Expanded static catalog: `src/data/catalogProducts.ts`
  - Firestore mapper: `src/services/productMapper.ts`
  - Product services expanded for catalog/list/details access in `src/services/products.ts`
  - Product card supports add-to-cart, sample purchase, and detail navigation in `src/components/home/ProductCard.tsx`

- Checkout + order flow:
  - COD order creation path via Firestore in `src/pages/CheckoutPage.tsx` + `src/services/orders.ts`
  - Dashboard orders/history now read live order data:
    - `src/pages/dashboard/OrdersPage.tsx`
    - `src/pages/dashboard/HistoryPage.tsx`

## Phase 4 Implementation Status

Completed in this codebase:

- Stripe + subscriptions backend (Cloud Functions):
  - Functions project scaffolded under `functions/`
  - Main functions implementation: `functions/src/index.ts`
    - `createStripeCheckoutSession`
    - `createStripeSubscriptionCheckout`
    - `stripeWebhook`
    - `setAdminRole`
  - Functions config files:
    - `functions/package.json`
    - `functions/tsconfig.json`
    - `functions/.env.example`

- Frontend Stripe integration:
  - Functions client initialized in `src/config/firebase.ts`
  - Callable payment service layer in `src/services/payments.ts`
  - Checkout online payment now redirects to Stripe checkout from `src/pages/CheckoutPage.tsx`
  - Subscription plan flow now redirects to Stripe subscription checkout from `src/pages/SubscriptionPage.tsx`

- Subscription dashboard updates:
  - Subscription services enhanced with status update in `src/services/subscriptions.ts`
  - Dashboard subscription management wired in `src/pages/dashboard/SubscriptionsPage.tsx`

- Seed data alignment:
  - Dev seed now uses catalog data source in `src/pages/DevSeedPage.tsx`

- Firebase project metadata:
  - Added `.firebaserc` default project mapping for `variagrofoods`

- Validation:
  - App: `npm run lint` and `npm run build` pass.
  - Functions: `npm run build` pass.
