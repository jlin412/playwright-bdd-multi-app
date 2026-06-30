# Test Plan — Best Buy (bestbuy)

- **Target**: https://www.bestbuy.com
- **Mode**: UI
- **Date**: 2026-06-30
- **Author**: /plan-ui (Claude Code QA Toolkit v6)

---

## 1. Scope

Best Buy is a large e-commerce retailer. This test plan covers the core customer-facing web experience: browsing, searching, product discovery, cart, checkout flow, account management, and supporting features (deals, store locator, membership). It does not cover the internal seller portal, Best Buy for Business (separate domain), or native mobile apps.

---

## 2. Modules Under Test

| # | Module | Priority | Notes |
|---|---|---|---|
| 1 | Homepage | High | Hero banner, nav, deals, category tiles |
| 2 | Global Navigation | High | Top nav, mega menus, search bar, cart icon, account icon |
| 3 | Search | High | Keyword search, suggestions, results page, filters, sorting |
| 4 | Product Listing Page (PLP) | High | Category browse, faceted filters, sort, pagination, add-to-cart from tile |
| 5 | Product Detail Page (PDP) | High | Images, specs, pricing, availability, add-to-cart, add-to-wishlist |
| 6 | Shopping Cart | High | Add/update/remove items, quantity change, subtotal, promo codes |
| 7 | Checkout Flow | Critical | Guest and authenticated checkout, shipping/pickup, payment, order confirmation |
| 8 | Authentication | High | Sign in, create account, forgot password, session management |
| 9 | My Account / Order History | Medium | Order list, order detail, returns initiation |
| 10 | Wishlist / Saved Items | Medium | Add/remove/view saved items, share list |
| 11 | Deals / Sale Pages | Medium | Today's deals, flash sales, deal tiles, countdown timers |
| 12 | Store Locator | Medium | Find a store by zip, store detail page, in-store availability |
| 13 | Best Buy Totaltech / Membership | Medium | Membership upsell modal, member pricing display |
| 14 | Product Comparison | Low | Compare up to 4 products side-by-side |
| 15 | Reviews & Ratings | Medium | Read reviews, submit review (authenticated), filter by star |
| 16 | Recommendations / Recently Viewed | Low | Carousels on PDP and homepage |
| 17 | Error Pages | Medium | 404, out-of-stock, service unavailable |
| 18 | Accessibility (cross-cutting) | High | Keyboard nav, screen reader labels, focus order, ARIA on interactive components |
| 19 | Performance (cross-cutting) | Medium | Homepage load, search response, PDP load on slow network |
| 20 | Security (cross-cutting) | High | Auth protection, session handling, sensitive data masking, direct URL access |

---

## 3. Key Workflows

1. **Browse → Search → PDP → Add to Cart → Guest Checkout** (critical path; smoke candidate)
2. **Sign In → Browse → PDP → Add to Cart → Authenticated Checkout → Order Confirmation**
3. **Create Account → Profile Completion → Sign Out → Sign In again**
4. **Search with Filters** — apply category + price + brand filters, clear filters, re-sort
5. **Cart Management** — multi-item add, quantity update, remove, apply promo code, subtotal recalculates
6. **In-Store Pickup** — choose pickup at store, confirm availability, complete checkout with pickup
7. **Wishlist Round Trip** — add from PDP, view wishlist, add to cart from wishlist
8. **Password Reset** — forgot password flow end-to-end
9. **Store Locator** — search by zip, find nearest store, view store hours/address
10. **Deals Page** — load, filter by category, click through to PDP

---

## 4. Risks & Priorities

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Checkout flow breakage | Critical — lost revenue | Medium | Smoke gate on every run; dedicated workflow spec |
| Search returning no results / wrong results | High | Low-Medium | Search smoke with known popular term |
| Cart price/quantity not updating correctly | High | Low | Cart mutation tests with assertions on subtotal |
| Authentication regression (sign-in, session) | High | Low | Auth smoke; session persistence check |
| Geo/availability-based content variations | Medium | High | Pin test ZIP codes; use headless with stable location |
| Dynamic content / A/B tests changing selectors | High | High | Use semantic locators (role, label, testId); never hard-code nth-child |
| Rate limiting / bot detection blocking headless tests | High | Medium | Use realistic user-agent; add reasonable pacing; avoid rapid parallel hits |
| CAPTCHA gating checkout or sign-in | High | Medium | Flag as assumption; tests may require bypass config in CI |
| Membership/pricing logic tied to login state | Medium | Medium | Test with both guest and member accounts |
| Third-party iframes (payment, address verify) | Medium | High | Treat payment frame as out-of-scope for E2E; mock or assert pre-payment state |

---

## 5. Assumptions

- Tests run against the public-facing production site (`https://www.bestbuy.com`) unless a staging URL is provided.
- A dedicated test account (email + password) will be available for authenticated flows.
- CAPTCHA is assumed absent or bypassable in test environments; if present, login/checkout tests will be marked `.fixme` until resolved.
- Payment fields are in third-party iframes — E2E tests will assert order summary / proceed-to-payment state rather than completing real payment.
- Inventory data is live and may change; tests that depend on specific product availability use widely-available popular items and assert availability pattern rather than exact stock number.
- Geo-targeted content (store availability, local deals) will vary by detected IP; tests fix the ZIP code input to a stable known location (e.g., 55423 — Best Buy HQ zip) for store tests.
- Best Buy may deploy A/B experiments that alter the page structure; test selectors are chosen to be experiment-resilient (role/label-based).

---

## 6. Out of Scope

- Best Buy for Business portal
- Best Buy mobile apps (iOS/Android)
- Internal employee / seller portals
- Full load / stress testing
- Real payment processing (PCI-sensitive; iframe only)
- Email / SMS notification delivery
- Third-party integrations (Affirm financing, PayPal iframe internals)

---

## 7. Test Environment & Data

| Item | Value |
|---|---|
| Base URL | https://www.bestbuy.com |
| Browsers | Chromium (smoke), Firefox, WebKit (regression) |
| Devices | Desktop 1280×800 (primary), mobile 375×667 (responsive checks) |
| Test account | `BESTBUY_USERNAME` / `BESTBUY_PASSWORD` env vars |
| Test ZIP code | 55423 (Minneapolis — Best Buy HQ region, stable store data) |
| Test product | Use SKU for a current Apple or Samsung bestseller (high availability) |

---

## 8. Manual Test Case Inventory

The following test cases will be created in `/manual-ui`:

### Homepage & Navigation
- TC-NAV-01: Homepage loads and hero content is visible
- TC-NAV-02: Top navigation mega menu opens and links are present
- TC-NAV-03: Global search bar is accessible and accepts input
- TC-NAV-04: Cart icon reflects item count badge
- TC-NAV-05: Account icon navigates to sign-in when unauthenticated

### Search
- TC-SRCH-01: Keyword search returns relevant results
- TC-SRCH-02: Search autocomplete suggestions appear on typing
- TC-SRCH-03: Search with no results shows empty state message
- TC-SRCH-04: Search results page shows product tiles with name, price, rating
- TC-SRCH-05: Applying a price filter narrows results
- TC-SRCH-06: Applying a brand filter narrows results
- TC-SRCH-07: Sorting by "Price: Low to High" reorders results
- TC-SRCH-08: Clearing all filters restores original result set
- TC-SRCH-09: Pagination navigates to next/previous result pages

### Product Listing Page (PLP)
- TC-PLP-01: Category page loads with product grid
- TC-PLP-02: Faceted filters are visible and interactive
- TC-PLP-03: Add-to-cart from product tile adds item to cart
- TC-PLP-04: Product tile links navigate to correct PDP

### Product Detail Page (PDP)
- TC-PDP-01: PDP displays product name, price, and primary image
- TC-PDP-02: PDP shows availability / shipping options
- TC-PDP-03: Add to Cart button adds item and cart count updates
- TC-PDP-04: Add to Wishlist (authenticated) saves item
- TC-PDP-05: Product image gallery cycles through images
- TC-PDP-06: Specs / Overview tabs display content
- TC-PDP-07: Reviews section shows ratings and user reviews
- TC-PDP-08: Out-of-stock product shows unavailability messaging, no add-to-cart

### Cart
- TC-CART-01: Cart opens with correct item(s) after add
- TC-CART-02: Quantity can be increased and subtotal updates
- TC-CART-03: Item can be removed; cart shows empty state when last item removed
- TC-CART-04: Valid promo code applies discount
- TC-CART-05: Invalid promo code shows error message
- TC-CART-06: Multiple different items can coexist in cart

### Checkout — Guest
- TC-CHK-01: Guest checkout starts without requiring sign-in
- TC-CHK-02: Shipping address form validates required fields
- TC-CHK-03: Shipping method selection updates order summary
- TC-CHK-04: Order summary shows correct items, quantities, and subtotal before payment
- TC-CHK-05: Proceed-to-payment step is reachable (payment iframe not entered)

### Checkout — In-Store Pickup
- TC-CHK-06: In-store pickup option appears for available item
- TC-CHK-07: Store search by ZIP shows nearby stores
- TC-CHK-08: Selecting a pickup store updates checkout summary

### Authentication
- TC-AUTH-01: Sign-in with valid credentials succeeds and redirects to account
- TC-AUTH-02: Sign-in with invalid credentials shows error message
- TC-AUTH-03: Create account with valid data succeeds
- TC-AUTH-04: Create account with existing email shows duplicate error
- TC-AUTH-05: Forgot password sends reset email (form submission confirmed)
- TC-AUTH-06: Sign out ends session and redirects to homepage
- TC-AUTH-07: Accessing account page while signed out redirects to sign-in
- TC-AUTH-08: Session persists across page navigation when signed in

### Account / Order History
- TC-ACCT-01: My Account page loads with profile information
- TC-ACCT-02: Order history lists past orders (if any)
- TC-ACCT-03: Order detail page shows items, status, and shipping info

### Wishlist
- TC-WISH-01: Wishlist page shows saved items (authenticated)
- TC-WISH-02: Removing an item from wishlist removes it from the list
- TC-WISH-03: Adding wishlist item to cart adds it to cart

### Deals
- TC-DEAL-01: Deals page loads with sale product tiles
- TC-DEAL-02: Deal tile links navigate to correct PDP with sale price

### Store Locator
- TC-STORE-01: Store locator accepts ZIP code and returns nearby stores
- TC-STORE-02: Store detail page shows address, hours, and phone
- TC-STORE-03: Invalid ZIP shows error or no-results state

### Reviews
- TC-REV-01: Reviews section on PDP shows rating distribution and individual reviews
- TC-REV-02: Filtering reviews by star rating filters the list

### Accessibility
- TC-A11Y-01: Homepage is keyboard-navigable (tab through nav, hero, categories)
- TC-A11Y-02: Search input has accessible label
- TC-A11Y-03: Cart modal has focus trap and Escape closes it
- TC-A11Y-04: Form fields on checkout have associated labels and error messages
- TC-A11Y-05: Product images have non-empty alt text on PDP

### Security
- TC-SEC-01: Direct URL access to account pages redirects to sign-in when unauthenticated
- TC-SEC-02: Sign-out invalidates session (back-button does not restore authenticated state)
- TC-SEC-03: Password field is masked on sign-in form
- TC-SEC-04: HTTPS is used across all pages

### Performance
- TC-PERF-01: Homepage loads within acceptable time on simulated slow network
- TC-PERF-02: Search results return within acceptable time
- TC-PERF-03: PDP loads within acceptable time

### Error States
- TC-ERR-01: 404 page is displayed for an unknown URL path
- TC-ERR-02: Out-of-stock product shows appropriate messaging

---

## 9. Open Questions

1. Is there a test/staging environment or sandbox account available, or do all tests run against production?
2. Are CAPTCHA / bot-detection mechanisms bypassable in test runs (e.g., test account exemption)?
3. Should payment flows be tested with a sandbox payment processor, or stop at the payment entry step?
4. What is the acceptable performance baseline for page load times (e.g., < 3s on 4G)?
5. Are there specific membership/Totaltech scenarios to cover (member pricing, exclusive deals)?
6. Is there a requirement to test the Best Buy app via browser (PWA) or only the desktop web?
7. Should the order-confirmation email content be verified, or only the confirmation page?
