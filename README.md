# MOVIES WORLD 🎬

A modern, responsive movie review & discovery website — dark cinema theme, gold accents,
full catalog with search/filters, reviews, watchlist, TV series, admin dashboard, and a
built-in **page translator (15+ languages)**.

## Quick Start
No build step required — it's a static frontend demo.

```bash
cd movies-world
# just open index.html in a browser, or serve it:
python3 -m http.server 8080
# → http://localhost:8080
```

## Features
- **Auto-playing hero slider** with featured movies
- **Live search** with suggestions (title, actor, director)
- **Advanced filters**: year, genre, language, minimum rating, 5 sort orders
- **Movie detail pages**: backdrop, poster, crew, scores (story/acting/direction/cinematography/music),
  legal streaming providers, embedded official trailers, "More Like This"
- **Review system**: 5-star reviews, helpful/not-helpful votes, moderation-ready structure
- **User accounts** (localStorage demo): register, login, forgot password, profile,
  watchlist, favorites, my reviews
- **Admin dashboard** (create a user, then set its role to `admin` in localStorage key `mw_users`)
- **TV Series** section with season/episode browsing and legal viewing links
- **Genre & Year pages**, Latest, Top Rated, Reviews feed
- **Translator**: globe button in the navbar — powered by Google Translate, 15 languages
- **Static pages**: About, Contact (validated form), DMCA, Privacy, Terms
- SEO meta, Open Graph, Schema.org JSON-LD, hash-based clean URLs (`#/movie/starfall-protocol`)

## Notes
- All movie data is original demo content; posters are CSS-generated art (no copyrighted images).
- Streaming/download buttons route only to licensed providers — never fake links.
- In production, connect the included API-shaped data models to the Node.js/Express +
  MongoDB backend described in the brief (JWT auth, TMDB metadata import, review moderation).

## Structure
```
movies-world/
├── index.html
├── css/style.css
└── js/
    ├── data.js    # demo database (movies, series, reviews)
    └── app.js     # router, rendering, auth, watchlist, admin, translator
```
