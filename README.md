# Your Energy 💪

A single-page fitness web application for discovering, filtering, and saving exercises. Built as a course project using Vanilla JavaScript.

**🌐 Live Demo → [sergekhoroshko.github.io/EMC2](https://sergekhoroshko.github.io/EMC2/)**

---

## About

Your Energy helps users find exercises by muscle group, body part, or equipment. Each exercise card shows calories, rating, and target muscles. Users can save favourites to localStorage, rate exercises, and subscribe to the newsletter.

**Key features:**
- Filter exercises by Muscles / Body parts / Equipment
- Search exercises by keyword
- Exercise detail modal with video preview
- Save & manage favourite exercises (localStorage)
- Daily motivational quote (cached in localStorage)
- Email newsletter subscription
- Server-side pagination
- Fully responsive: mobile 375px · tablet 768px · desktop 1440px

---

## Tech Stack

- Vanilla JavaScript (ES Modules)
- Vite — build tool & dev server
- CSS (custom, no frameworks)
- REST API: [your-energy.b.goit.study](https://your-energy.b.goit.study/api-docs/)
- Deployed via GitHub Pages + GitHub Actions

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# 1. Clone the repository
git clone https://github.com/SergeKhoroshko/EMC2.git
cd EMC2

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
# → http://localhost:5173

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

---

## Project Structure

```
EMC2/
├── src/
│   ├── css/          # Stylesheets (modular, per component)
│   ├── img/          # Optimised images (WebP)
│   ├── js/           # JavaScript modules
│   └── index.html    # Home page
│   └── page-2.html   # Favourites page
├── public/
├── vite.config.js
└── package.json
```

---

## Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Hero, filters, exercise catalogue, quote of the day |
| Favourites | `/page-2.html` | Saved exercises, quote of the day |

---

## API

All data is fetched from the public REST API:  
`https://your-energy.b.goit.study/api-docs/`

| Endpoint | Description |
|----------|-------------|
| `GET /api/quote` | Quote of the day |
| `GET /api/filters` | Filter categories |
| `GET /api/exercises` | Exercise list (with pagination) |
| `GET /api/exercises/:id` | Exercise details |
| `PATCH /api/exercises/:id/rating` | Submit rating |
| `POST /api/subscription` | Email subscription |
