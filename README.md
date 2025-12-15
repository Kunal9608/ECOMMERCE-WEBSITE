E-COMMERCE
=========

Overview
--------
A lightweight, client-side E‑Commerce demo built with plain HTML, CSS and JavaScript. It demonstrates core storefront flows: product browsing, cart, checkout (mock), wishlist, orders, and basic profile/login flows — designed as a focused front-end reference and teaching project.

**Tech stack**: HTML | CSS | Vanilla JavaScript

**Features**
- Browse products and view item details
- Add/remove items from cart and update quantities
- Mock checkout pages and payment flow (`payment.html`)
- Wishlist functionality
- Basic authentication pages (`login.html`, `signup.html`, `forget.html`) — client-only
- Order history and profile pages

**Key files**
- [itemdash.html](itemdash.html): Product listing / dashboard
- [cart.html](cart.html): Cart UI
- [checkout.html](checkout.html): Checkout flow
- [payment.html](payment.html): Payment page (mock)
- [wishlist.html](wishlist.html): Wishlist management
- [profile.html](profile.html) & [orders.html](orders.html): Profile and order views
- [scripts/](scripts/) : Client-side JS modules
  - `cart.js`, `checkout.js`, `payment.js`, `profile.js`, `scriptlogin.js`, etc.
- [styles/](styles/) and various page-specific CSS files

Quick start (local)
-------------------
1. Open a terminal in the project root.
2. Serve the folder as static files (recommended for correct routing):

Python:

```
python -m http.server 8000
```

Node (http-server):

```
npx http-server -p 8000
```

3. Open http://localhost:8000/itemdash.html in your browser.

Developer notes
---------------
- This is a purely client-side application. Replace mock flows with server-backed APIs to make it production-ready.
- Key JS entry points: `scriptitems.js` (product listing), `cart.js` (cart state), `checkout.js` (checkout validations), `scriptlogin.js` (auth flows).
- No build system is required; use a static server for local testing.

Contact
-------
Open an issue in this repository or contact the project owner.
