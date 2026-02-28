# Your Energy

A fitness exercise web application that helps you discover, explore, and save workout exercises by muscle group, body part, or equipment type.

🔗 **Live demo:** [https://sergekhoroshko.github.io/EMC2/](https://sergekhoroshko.github.io/EMC2/)

---

## Features

- **Filter tabs** — browse exercises by Muscles, Body parts, or Equipment
- **Category cards** — visual grid of filter categories with images
- **Exercise cards** — name, rating, body part, target muscle, burned calories, duration
- **Exercise modal** — animated GIF preview, full details, add/remove from Favorites, give a rating
- **Rating modal** — interactive star selector, email validation, submits to the API
- **Search** — find exercises by keyword within a selected category
- **Pagination** — smooth page navigation with ellipsis for large result sets
- **Quote of the day** — motivational quote fetched from the API and cached in localStorage for the day
- **Favorites page** — saved exercises stored in localStorage, removable at any time
- **Email subscription** — subscribe to exercise updates via the footer form
- **Burger menu** — responsive mobile navigation with overlay
- **Responsive design** — mobile (320px+), tablet (768px+), desktop (1200px+)
- **Accessible markup** — ARIA roles, labels, live regions, keyboard navigation

---

## Technologies

| Tool | Purpose |
| --- | --- |
| Vanilla JavaScript (ES Modules) | All application logic, no frameworks |
| [Vite 5](https://vitejs.dev/) | Dev server, bundler, HTML partial injection |
| CSS custom properties | Dark-theme design system, responsive layout |
| vite-plugin-html-inject | Reusable HTML partials |
| localStorage | Favorites cache and daily quote cache |
| Your Energy REST API | Exercises, filters, quotes, subscriptions |

---

## Getting started

### Prerequisites

- Node.js 18+
- npm 9+

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

The dev server starts at `http://localhost:5173/`. Changes to HTML, CSS, and JS hot-reload automatically.

### Build for production

```bash
npm run build
```

Output is written to the `dist/` folder. The build uses `/vanilla-app-template/` as the base path (matches the GitHub Pages deployment URL).

### Preview the production build

```bash
npm run preview
```

---

## Project structure

```
src/
├── index.html          # Home page
├── page-2.html         # Favorites page
├── main.js             # Home page entry point
├── page-2.js           # Favorites page entry point
├── partials/
│   ├── header.html     # Shared header (logo, nav, burger, socials)
│   └── footer.html     # Shared footer (logo, subscribe form)
├── css/
│   ├── styles.css      # Imports all CSS partials
│   ├── base.css        # CSS variables, global tokens
│   ├── header.css
│   ├── hero.css
│   ├── filters.css
│   ├── cards.css
│   ├── modal.css
│   ├── pagination.css
│   └── footer.css
├── js/
│   ├── api.js          # All API calls (fetch wrapper)
│   ├── storage.js      # localStorage helpers (favorites + quote cache)
│   ├── home.js         # Home page logic (categories, exercises, search)
│   ├── favorites.js    # Favorites page render
│   ├── exercise-modal.js
│   ├── rating-modal.js
│   ├── modal.js        # Generic open/close helpers
│   ├── pagination.js
│   ├── quote.js
│   ├── header.js       # Mobile burger menu
│   └── footer.js       # Subscription form
└── img/
    └── sprite.svg      # SVG icon sprite
```

---

## API

Base URL: `https://your-energy.b.goit.study/api`

| Endpoint                  | Method | Description                                   |
| ------------------------- | ------ | --------------------------------------------- |
| `/quote`                  | GET    | Daily motivational quote                      |
| `/filters`                | GET    | Category list (`filter`, `page`, `limit`)     |
| `/exercises`              | GET    | Exercise list with filters and keyword search |
| `/exercises/{id}/rating`  | PATCH  | Submit a rating `{rate, email, review}`       |
| `/subscription`           | POST   | Subscribe an email to updates                 |
