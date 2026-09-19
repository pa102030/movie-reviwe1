
/* ============================================================
   MOVIES WORLD — Application (hash router, state, rendering)
   ============================================================ */
"use strict";

/* ---------- helpers ---------- */
const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const store = {
  get(k, d){ try{ return JSON.parse(localStorage.getItem(k)) ?? d; }catch(e){ return d; } },
  set(k, v){ localStorage.setItem(k, JSON.stringify(v)); }
};
const toast = (msg, err=false) => {
  const t = document.createElement("div");
  t.className = "toast" + (err ? " err" : "");
  t.innerHTML = `<i class="fas ${err?"fa-circle-exclamation":"fa-circle-check"}" style="color:${err?"#e50914":"#f5c518"};margin-right:8px"></i>${esc(msg)}`;
  $("#toasts").appendChild(t);
  setTimeout(()=>{ t.style.opacity="0"; t.style.transition=".4s"; setTimeout(()=>t.remove(),400); }, 3200);
};

/* ---------- data merge (admin-added movies live in localStorage) ---------- */
function allMovies(){
  const extra = store.get("mw_custom_movies", []);
  return [...extra, ...MOVIES].map((m,i)=>{ if(!m.art) m.art = art((i+3)%PALETTES.length, m.title); return m; });
}
const findMovie = slug => allMovies().find(m => m.slug === slug);
const userReviews = () => store.get("mw_reviews", {});   // {slug:[{user,stars,text,date,helpful}]}
function getReviews(slug){
  const base = (SAMPLE_REVIEWS[slug] || []).map(r => ({...r, sample:true}));
  return [...base, ...(userReviews()[slug] || [])];
}
const currentUser = () => store.get("mw_session", null);
const users = () => store.get("mw_users", {});
const watchlist = () => store.get("mw_watchlist", []);

/* ---------- shared snippets ---------- */
const star = (n, max=5) => {
  let s = "";
  for(let i=1;i<=max;i++) s += `<i class="fas fa-star ${i<=n?"":"off"}"></i>`;
  return `<span class="stars">${s}</span>`;
};
const posterArt = (m, h4=true) => `
  <div class="poster-art" style="background:linear-gradient(160deg,${m.art.from},${m.art.to})">
    ${h4?`<h4>${esc(m.title)}</h4>`:""}
  </div>`;
const badgeQ = m => `<span class="badge badge-quality">${m.quality||"HD"}</span>`;
const badgeR = m => `<span class="badge badge-rate"><i class="fas fa-star"></i>${m.rating.toFixed(1)}</span>`;

function movieCard(m){
  return `
  <article class="movie-card reveal" onclick="location.hash='#/movie/${m.slug}'">
    <div class="poster">
      <div class="poster-badges">${badgeQ(m)}${badgeR(m)}</div>
      ${posterArt(m)}
      <div class="poster-overlay"><div class="play-circle"><i class="fas fa-play"></i></div></div>
    </div>
    <div class="card-body">
      <h3 title="${esc(m.title)}">${esc(m.title)}</h3>
      <div class="card-meta"><span><i class="far fa-calendar"></i> ${m.year}</span><span><i class="fas fa-language"></i> ${esc((m.languages||["—"])[0])}</span></div>
      <div class="card-genres"><b>${esc(m.genres[0])}</b> • ${esc(m.genres.slice(1,3).join(" • ")||m.genres[0])}</div>
      <div class="card-actions">
        <button class="btn btn-gold" onclick="event.stopPropagation();openTrailer('${m.slug}')"><i class="fas fa-play"></i> Trailer</button>
        <button class="btn btn-ghost" onclick="event.stopPropagation();toggleWatch('${m.slug}',this)"><i class="fas ${watchlist().includes(m.slug)?"fa-check":"fa-plus"}"></i> ${watchlist().includes(m.slug)?"Saved":"List"}</button>
      </div>
    </div>
  </article>`;
}
function skeletonCards(n=8){
  return Array(n).fill(`<div class="skeleton" style="aspect-ratio:2/3.4;border-radius:14px"></div>`).join("");
}

/* ---------- global actions ---------- */
window.toggleWatch = (slug, btn) => {
  const u = currentUser();
  if(!u){ toast("Please log in to use the watchlist", true); location.hash = "#/login"; return; }
  let w = watchlist();
  if(w.includes(slug)){ w = w.filter(s=>s!==slug); toast("Removed from watchlist"); }
  else { w.push(slug); toast("Added to your watchlist"); }
  store.set("mw_watchlist", w);
  if(btn){ btn.innerHTML = `<i class="fas ${w.includes(slug)?"fa-check":"fa-plus"}"></i> ${w.includes(slug)?"Saved":"List"}`; }
};
window.openTrailer = slug => {
  const m = findMovie(slug); if(!m) return;
  const modal = document.createElement("div");
  modal.style.cssText = "position:fixed;inset:0;z-index:2500;background:rgba(0,0,0,.9);display:grid;place-items:center;padding:20px;cursor:pointer";
  modal.innerHTML = `<div style="width:min(900px,100%);aspect-ratio:16/9;background:#000;border-radius:14px;overflow:hidden;border:1px solid #333;box-shadow:0 30px 80px rgba(0,0,0,.8);cursor:default" onclick="event.stopPropagation()">
      <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${m.trailer}" title="Official trailer" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </div>
    <button style="position:absolute;top:24px;right:28px;background:none;border:none;color:#fff;font-size:2rem;cursor:pointer"><i class="fas fa-times"></i></button>`;
  modal.onclick = () => modal.remove();
  document.body.appendChild(modal);
};
window.logout = () => { localStorage.removeItem("mw_session"); toast("Logged out. See you soon!"); route(); };

/* ---------- HERO ---------- */
let heroTimer = null;
function renderHero(){
  const feats = allMovies().filter(m => m.featured).slice(0,6);
  $("#hero").innerHTML = feats.map((m,i)=>`
    <div class="hero-slide ${i===0?"active":""}" data-i="${i}">
      <div class="hero-bg" style="background:linear-gradient(120deg,${m.art.from},${m.art.to});background-size:cover;background-position:center">
        <div style="position:absolute;inset:0;background:radial-gradient(circle at 75% 30%,rgba(255,255,255,.14),transparent 50%)"></div>
      </div>
      <div class="hero-content">
        <span class="hero-badge"><i class="fas fa-fire"></i> Featured</span>
        <h1>${esc(m.title)}</h1>
        <div class="hero-meta">
          <span class="rate"><i class="fas fa-star"></i> ${m.rating.toFixed(1)} <small style="color:var(--muted);font-weight:400">(${Number(m.votes).toLocaleString()} votes)</small></span>
          <span><i class="far fa-calendar"></i> ${m.year}</span>
          <span><i class="fas fa-clock"></i> ${m.runtime}</span>
          <span><i class="fas fa-film"></i> ${esc(m.genres.join(" • "))}</span>
          <span class="badge badge-quality" style="font-size:.68rem">${m.quality}</span>
        </div>
        <p class="hero-desc">${esc(m.desc)}</p>
        <div class="hero-btns">
          <button class="btn btn-gold" onclick="openTrailer('${m.slug}')"><i class="fas fa-play"></i> Watch Trailer</button>
          <button class="btn btn-ghost" onclick="location.hash='#/movie/${m.slug}'"><i class="fas fa-circle-info"></i> View Details</button>
          <button class="btn btn-outline" onclick="toggleWatch('${m.slug}',this)"><i class="fas fa-plus"></i> Watchlist</button>
        </div>
      </div>
    </div>`).join("") +
    `<div class="hero-dots">${feats.map((_,i)=>`<button data-d="${i}" class="${i===0?"active":""}" aria-label="Slide ${i+1}"></button>`).join("")}</div>`;
  let cur = 0;
  const slides = $$(".hero-slide"), dots = $$(".hero-dots button");
  const go = n => { slides[cur].classList.remove("active"); dots[cur]?.classList.remove("active"); cur = (n+slides.length)%slides.length; slides[cur].classList.add("active"); dots[cur]?.classList.add("active"); };
  dots.forEach(d => d.onclick = () => { clearInterval(heroTimer); go(+d.dataset.d); heroTimer = setInterval(()=>go(cur+1), 6000); });
  clearInterval(heroTimer);
  heroTimer = setInterval(()=>go(cur+1), 6000);
}

/* ---------- SECTIONS ---------- */
function sectionHTML(id, icon, title, sub, movies, gridCls="grid", extra=""){
  return `
  <section class="section" id="${id}">
    <div class="container">
      <div class="section-head">
        <div><h2><i class="fas ${icon}"></i> ${title}</h2>${sub?`<p>${sub}</p>`:""}</div>
        <a class="view-all" href="#/movies">View All <i class="fas fa-arrow-right"></i></a>
      </div>
      ${extra}
      <div class="${gridCls} movies-row">${skeletonCards(6)}</div>
    </div>
  </section>`;
}
function fillRow(id, movies){
  const row = document.querySelector(`#${id} .movies-row`);
  if(row){ row.innerHTML = movies.length ? movies.map(movieCard).join("") : emptyState("No movies found"); observeReveals(); }
}
function emptyState(msg, sub=""){
  return `<div class="empty-state" style="grid-column:1/-1"><i class="fas fa-film"></i><h3 style="color:#fff;font-size:1.4rem;margin-bottom:6px">${msg}</h3><p>${sub||"Try adjusting your filters or search."}</p></div>`;
}
function latestReviewsHTML(n=4){
  const rows = [];
  Object.keys(SAMPLE_REVIEWS).concat(Object.keys(userReviews())).forEach(slug=>{
    getReviews(slug).forEach(r=>rows.push({...r, slug}));
  });
  rows.sort((a,b)=> new Date(b.date) - new Date(a.date));
  return rows.slice(0,n).map(r=>{
    const m = findMovie(r.slug);
    return `<div class="review-card reveal" style="cursor:pointer" onclick="location.hash='#/movie/${r.slug}'">
      <div class="review-head">
        <div class="review-user"><div class="avatar">${esc(r.user[0].toUpperCase())}</div>
          <div><b>${esc(r.user)}</b><small>reviewed <span style="color:var(--gold)">${m?esc(m.title):"a movie"}</span> • ${r.date}</small></div>
        </div>
        ${star(r.stars)}
      </div>
      <p class="review-text">${esc(r.text.length>220 ? r.text.slice(0,220)+"…" : r.text)}</p>
      <div class="review-actions"><span style="color:var(--muted);font-size:.75rem"><i class="fas fa-thumbs-up" style="color:var(--gold);margin-right:5px"></i>${r.helpful||0} found this helpful</span></div>
    </div>`;
  }).join("");
}

/* ---------- HOME ---------- */
function pageHome(){
  $("#app").innerHTML = `
  <div class="hero" id="hero"></div>
  <div class="section" style="padding-top:26px">
    <div class="container">
      <div class="section-head"><div><h2><i class="fas fa-compass"></i> Browse by Genre</h2><p>Find your next favorite film</p></div></div>
      <div class="chip-row">${GENRES.map(g=>`<a class="chip" href="#/genre/${encodeURIComponent(g)}">${g}</a>`).join("")}</div>
    </div>
  </div>
  ${sectionHTML("sec-latest","fa-bolt","Latest Movies","Fresh additions to the catalog")}
  ${sectionHTML("sec-popular","fa-fire","Popular Movies","What everyone is watching")}
  ${sectionHTML("sec-top","fa-star","Top Rated","Highest rated by our community")}
  ${sectionHTML("sec-tv","fa-tv","TV Series","Binge-worthy shows")}
  <section class="section"><div class="container">
    <div class="section-head"><div><h2><i class="fas fa-comment-dots"></i> Latest Reviews</h2><p>From our community of film lovers</p></div>
    <a class="view-all" href="#/reviews">All Reviews <i class="fas fa-arrow-right"></i></a></div>
    <div id="latest-reviews">${latestReviewsHTML(4)}</div>
  </div></section>`;
  renderHero();
  const ms = allMovies();
  fillRow("sec-latest",   [...ms].sort((a,b)=> b.releaseDate.localeCompare(a.releaseDate)).slice(0,12));
  fillRow("sec-popular",  [...ms].sort((a,b)=> b.votes - a.votes).slice(0,12));
  fillRow("sec-top",      [...ms].sort((a,b)=> b.rating - a.rating || b.votes - a.votes).slice(0,12));
  const tvRow = $("#sec-tv .movies-row");
  if(tvRow){
    tvRow.className = "grid";
    tvRow.innerHTML = SERIES.map(seriesCardHTML).join("");
  }
  observeReveals();
}
function seriesCardHTML(s, i){
  const p = PALETTES[(i+5)%PALETTES.length];
  return `<article class="movie-card reveal" onclick="location.hash='#/series/${s.slug}'">
    <div class="poster">
      <div class="poster-badges"><span class="badge badge-quality">${s.seasons} Season${s.seasons>1?"s":""}</span><span class="badge badge-rate"><i class="fas fa-star"></i>${s.rating.toFixed(1)}</span></div>
      <div class="poster-art" style="background:linear-gradient(160deg,${p[0]},${p[1]})"><h4>${esc(s.title)}</h4></div>
      <div class="poster-overlay"><div class="play-circle"><i class="fas fa-play"></i></div></div>
    </div>
    <div class="card-body"><h3>${esc(s.title)}</h3>
      <div class="card-meta"><span><i class="far fa-calendar"></i> ${s.year}</span><span><i class="fas fa-film"></i> ${esc(s.genres[0])}</span></div>
    </div></article>`;
}

/* ---------- CATALOG (movies page + filters) ---------- */
const catState = { q:"", year:"all", genre:"all", lang:"all", rating:"all", sort:"latest" };
function pageMovies(){
  $("#app").innerHTML = `
  <div class="container">
    <div class="page-head"><h1><i class="fas fa-film" style="color:var(--gold)"></i> Movies</h1><p>Search and filter the full MOVIES WORLD catalog</p></div>
    <div class="filter-bar">
      <div><label>Search</label><input id="f-q" placeholder="Title, actor, director…" value="${esc(catState.q)}" style="width:100%;background:var(--bg3);border:1px solid var(--line);color:#fff;border-radius:9px;padding:9px 12px;font-family:Poppins;font-size:.83rem;outline:none"></div>
      <div><label>Year</label><select id="f-year"><option value="all">All Years</option>${[...new Set(allMovies().map(m=>m.year))].sort((a,b)=>b-a).map(y=>`<option ${catState.year==y?"selected":""}>${y}</option>`).join("")}</select></div>
      <div><label>Genre</label><select id="f-genre"><option value="all">All Genres</option>${GENRES.map(g=>`<option ${catState.genre==g?"selected":""}>${g}</option>`).join("")}</select></div>
      <div><label>Language</label><select id="f-lang"><option value="all">All Languages</option>${LANGS.map(l=>`<option ${catState.lang==l?"selected":""}>${l}</option>`).join("")}</select></div>
      <div><label>Rating</label><select id="f-rating">
        <option value="all">Any Rating</option>
        ${[9,8,7,6].map(r=>`<option value="${r}" ${catState.rating==r?"selected":""}>${r}+</option>`).join("")}</select></div>
      <div><label>Sort By</label><select id="f-sort">
        <option value="latest" ${catState.sort=="latest"?"selected":""}>Latest</option>
        <option value="oldest" ${catState.sort=="oldest"?"selected":""}>Oldest</option>
        <option value="rated" ${catState.sort=="rated"?"selected":""}>Highest Rated</option>
        <option value="popular" ${catState.sort=="popular"?"selected":""}>Most Popular</option>
        <option value="az" ${catState.sort=="az"?"selected":""}>A – Z</option></select></div>
    </div>
    <div id="catalog" class="grid grid-6" style="padding-bottom:50px"><div style="grid-column:1/-1">${skeletonCards(10)}</div></div>
  </div>`;
  const apply = () => {
    let ms = allMovies().filter(m =>
      (catState.year==="all"  || m.year==catState.year) &&
      (catState.genre==="all" || m.genres.includes(catState.genre)) &&
      (catState.lang==="all"  || (m.languages||[]).includes(catState.lang)) &&
      (catState.rating==="all"|| m.rating >= +catState.rating) &&
      (!catState.q || [m.title, m.originalTitle, m.director, ...(m.cast||[]), ...(m.writers||[])].join(" ").toLowerCase().includes(catState.q.toLowerCase()))
    );
    const S = { latest:(a,b)=>b.releaseDate.localeCompare(a.releaseDate), oldest:(a,b)=>a.releaseDate.localeCompare(b.releaseDate),
                rated:(a,b)=>b.rating-a.rating||b.votes-a.votes, popular:(a,b)=>b.votes-a.votes, az:(a,b)=>a.title.localeCompare(b.title) };
    ms.sort(S[catState.sort]);
    const box = $("#catalog");
    box.innerHTML = ms.length ? ms.map(movieCard).join("") : emptyState("No movies found","Try a different title, genre, or filter combination.");
    observeReveals();
  };
  $("#f-q").oninput = e => { catState.q = e.target.value; apply(); };
  $("#f-year").onchange = e => { catState.year = e.target.value==="all"?"all":+e.target.value; apply(); };
  $("#f-genre").onchange = e => { catState.genre = e.target.value; apply(); };
  $("#f-lang").onchange  = e => { catState.lang  = e.target.value; apply(); };
  $("#f-rating").onchange= e => { catState.rating= e.target.value; apply(); };
  $("#f-sort").onchange  = e => { catState.sort  = e.target.value; apply(); };
  apply();
}

/* ---------- GENRE / YEAR ---------- */
function pageGenre(g){
  const ms = allMovies().filter(m=>m.genres.includes(g));
  $("#app").innerHTML = `<div class="container">
    <div class="page-head"><h1><i class="fas fa-film" style="color:var(--gold)"></i> ${esc(g)} Movies</h1><p>${ms.length} film${ms.length!==1?"s":""} in the ${esc(g)} genre</p></div>
    <div class="chip-row" style="margin-bottom:26px">${GENRES.map(x=>`<a class="chip ${x===g?"active":""}" href="#/genre/${encodeURIComponent(x)}">${x}</a>`).join("")}</div>
    <div class="grid grid-6" style="padding-bottom:50px">${ms.length?ms.map(movieCard).join(""):emptyState("No movies found")}</div></div>`;
  observeReveals();
}
function pageYear(y){
  const ms = allMovies().filter(m=>m.year==y);
  $("#app").innerHTML = `<div class="container">
    <div class="page-head"><h1><i class="far fa-calendar" style="color:var(--gold)"></i> Movies of ${y}</h1><p>${ms.length} release${ms.length!==1?"s":""} from ${y}</p></div>
    <div class="chip-row" style="margin-bottom:26px">${[...new Set(allMovies().map(m=>m.year))].sort((a,b)=>b-a).map(x=>`<a class="chip ${x==y?"active":""}" href="#/year/${x}">${x}</a>`).join("")}</div>
    <div class="grid grid-6" style="padding-bottom:50px">${ms.length?ms.map(movieCard).join(""):emptyState("No movies found","Try another year.")}</div></div>`;
  observeReveals();
}

/* ---------- MOVIE DETAILS ---------- */
function pageMovie(slug){
  const m = findMovie(slug);
  if(!m){ $("#app").innerHTML = `<div class="container">${emptyState("Movie not found")}</div>`; return; }
  document.title = `${m.title} (${m.year}) — MOVIES WORLD`;
  const reviews = getReviews(slug);
  const scores = [["Story",m.story],["Acting",m.acting],["Direction",m.direction],["Cinematography",m.cine],["Music",m.music]].filter(s=>s[1]>0);
  $("#app").innerHTML = `
  <div class="details-hero">
    <div class="details-backdrop" style="background:linear-gradient(120deg,${m.art.from},${m.art.to})"></div>
    <div class="container"><div class="details-grid">
      <div>
        <div class="details-poster">${posterArt(m)}</div>
        <div style="display:flex;gap:10px;margin-top:14px">
          <button class="btn btn-gold" style="flex:1;justify-content:center" onclick="openTrailer('${m.slug}')"><i class="fas fa-play"></i> Trailer</button>
          <button class="btn btn-ghost" style="flex:1;justify-content:center" onclick="toggleWatch('${m.slug}',this)"><i class="fas ${watchlist().includes(m.slug)?"fa-check":"fa-plus"}"></i> ${watchlist().includes(m.slug)?"In Watchlist":"Watchlist"}</button>
        </div>
      </div>
      <div class="details-info">
        <h1>${esc(m.title)}</h1>
        <div class="orig">${esc(m.originalTitle)}</div>
        <div class="details-meta">
          <span><i class="fas fa-star"></i><b style="color:var(--gold)">${m.rating.toFixed(1)}</b>&nbsp;(${Number(m.votes).toLocaleString()} votes)</span>
          <span><i class="far fa-calendar"></i> ${m.releaseDate}</span>
          <span><i class="fas fa-clock"></i> ${m.runtime}</span>
          <span class="badge badge-quality">${m.quality}</span>
        </div>
        <div class="details-meta">${m.genres.map(g=>`<a href="#/genre/${encodeURIComponent(g)}" class="chip" style="padding:6px 14px;font-size:.75rem">${g}</a>`).join("")}
          <span><i class="fas fa-globe"></i> ${m.country}</span>
          <span><i class="fas fa-language"></i> ${(m.languages||[]).join(", ")}</span>
        </div>
        <p class="details-desc">${esc(m.desc)}</p>
        <div class="crew-grid">
          <div class="crew-box"><small>Director</small><div>${esc(m.director)}</div></div>
          <div class="crew-box"><small>Writers</small><div>${(m.writers||[]).map(esc).join(", ")}</div></div>
          <div class="crew-box"><small>Cast</small><div>${(m.cast||[]).map(esc).join(", ")}</div></div>
          <div class="crew-box"><small>Production</small><div>${esc(m.studio||"—")}</div></div>
        </div>
        <h3 style="margin-top:30px;font-size:1.5rem"><i class="fas fa-chart-simple" style="color:var(--gold);margin-right:8px"></i>MOVIES WORLD Scores</h3>
        <div class="score-wrap">${scores.map(([n,v])=>`
          <div class="score-item"><small>${n}<b>${v.toFixed(1)}</b></small><div class="score-bar"><div style="width:0%" data-w="${v*10}"></div></div></div>`).join("")}
        </div>
        <h3 style="font-size:1.5rem;margin-top:10px"><i class="fas fa-circle-play" style="color:var(--gold);margin-right:8px"></i>Watch Legally</h3>
        <div class="provider-row">
          <button class="btn btn-red" onclick="toast('Opening legal streaming options…')"><i class="fas fa-play"></i> Watch Now</button>
          ${PROVIDERS.slice(0,3).map(p=>`<span class="provider"><i class="fas fa-tv"></i>${p}</span>`).join("")}
        </div>
        <div class="provider-row">${PROVIDERS.slice(3).map(p=>`<span class="provider"><i class="fas fa-tv"></i>${p}</span>`).join("")}</div>
        <div class="legal-note"><i class="fas fa-shield-halved"></i><span>MOVIES WORLD does not host or distribute copyrighted files. Streaming/download links are provided only for content we have rights to — otherwise we direct you to licensed providers such as Netflix, Prime Video, Disney+, Apple TV and YouTube Movies.</span></div>
      </div>
    </div></div>
  </div>
  <div class="container" style="padding-bottom:60px">
    <div class="section-head"><h2><i class="fas fa-comment-dots"></i> Reviews <span style="color:var(--muted);font-size:1rem;font-family:Poppins">(${reviews.length})</span></h2></div>
    <div id="review-list">${reviews.map(reviewCardHTML).join("") || `<p style="color:var(--muted);font-size:.88rem">No reviews yet — be the first!</p>`}</div>
    <div class="review-form">
      <h3 style="font-size:1.3rem">Write a Review</h3>
      <div style="display:flex;gap:6px;margin:14px 0 4px;align-items:center">
        <span style="font-size:.8rem;color:var(--muted);margin-right:6px">Your rating:</span>
        ${[1,2,3,4,5].map(i=>`<i class="fas fa-star rate-star" data-v="${i}" style="color:#3d3d4d;cursor:pointer;font-size:1.3rem;transition:.2s"></i>`).join("")}
      </div>
      <textarea id="rev-text" placeholder="Share your thoughts about ${esc(m.title)}…"></textarea>
      <button class="btn btn-gold" style="margin-top:14px" id="rev-submit"><i class="fas fa-paper-plane"></i> Submit Review</button>
      ${currentUser()?"":`<p style="color:var(--muted);font-size:.78rem;margin-top:10px"><i class="fas fa-lock" style="color:var(--gold);margin-right:5px"></i>You must be <a href="#/login" style="color:var(--gold)">logged in</a> to submit a review.</p>`}
    </div>
    <h3 style="font-size:1.5rem;margin-top:44px"><i class="fas fa-photo-film" style="color:var(--gold);margin-right:8px"></i>Official Trailer</h3>
    <div style="max-width:820px;aspect-ratio:16/9;margin-top:14px;border-radius:14px;overflow:hidden;border:1px solid var(--line)">
      <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${m.trailer}" title="Official trailer" frameborder="0" allow="encrypted-media" allowfullscreen loading="lazy"></iframe>
    </div>
    <div class="section-head" style="margin-top:44px"><h2><i class="fas fa-clapperboard"></i> More Like This</h2></div>
    <div class="grid">${allMovies().filter(x=>x.slug!==slug && x.genres.some(g=>m.genres.includes(g))).slice(0,6).map(movieCard).join("")}</div>
  </div>`;
  /* animated score bars */
  setTimeout(()=>$$(".score-bar div").forEach(b=>b.style.width = b.dataset.w+"%"), 150);
  /* star picker */
  let picked = 0;
  const stars = $$(".rate-star");
  const paint = n => stars.forEach(s=>s.style.color = +s.dataset.v<=n ? "var(--gold)" : "#3d3d4d");
  stars.forEach(s=>{ s.onmouseenter=()=>paint(+s.dataset.v); s.onclick=()=>{ picked=+s.dataset.v; paint(picked); }; });
  $(".review-form").onmouseleave = ()=>paint(picked);
  $("#rev-submit").onclick = ()=>{
    const u = currentUser();
    if(!u){ toast("Please log in to write a review", true); return; }
    const text = $("#rev-text").value.trim();
    if(!picked){ toast("Please select a star rating", true); return; }
    if(text.length < 10){ toast("Review is too short (min 10 characters)", true); return; }
    const all = userReviews();
    (all[slug] = all[slug] || []).push({user:u.username, stars:picked, text, date:new Date().toISOString().slice(0,10), helpful:0});
    store.set("mw_reviews", all);
    toast("Review published. Thank you!"); pageMovie(slug); window.scrollTo({top:$("#review-list").offsetTop-100, behavior:"smooth"});
  };
  observeReveals();
}
function reviewCardHTML(r){
  return `<div class="review-card">
    <div class="review-head">
      <div class="review-user"><div class="avatar">${esc(r.user[0].toUpperCase())}</div>
        <div><b>${esc(r.user)}</b><small>${r.date}${r.sample?" • Critic":""}</small></div></div>
      ${star(r.stars)}
    </div>
    <p class="review-text">${esc(r.text)}</p>
    <div class="review-actions">
      <button onclick="voteReview(this,'${esc(r.user)}',1)"><i class="fas fa-thumbs-up"></i> Helpful (${r.helpful||0})</button>
      <button onclick="voteReview(this,'${esc(r.user)}',0)"><i class="fas fa-thumbs-down"></i> Not Helpful (${r.notHelpful||0})</button>
    </div></div>`;
}
window.voteReview = (btn,user,up)=>{ if(btn.dataset.v){return;} btn.dataset.v=1; btn.style.color="var(--gold)"; toast("Thanks for your feedback!"); };

/* ---------- TV ---------- */
function pageTV(){
  $("#app").innerHTML = `<div class="container">
    <div class="page-head"><h1><i class="fas fa-tv" style="color:var(--gold)"></i> TV Series</h1><p>Full seasons, episodes and legal viewing options</p></div>
    <div class="grid grid-6" style="padding-bottom:50px">${SERIES.map(seriesCardHTML).join("")}</div></div>`;
  observeReveals();
}
function pageSeries(slug){
  const s = SERIES.find(x=>x.slug===slug);
  if(!s){ $("#app").innerHTML = `<div class="container">${emptyState("Series not found")}</div>`; return; }
  const eps = Array.from({length: Math.min(8, 4+s.seasons)}, (_,i)=>({
    n:i+1, title:`Episode ${i+1}: ${["The Arrival","Old Wounds","Smoke Signals","The Long Night","Crossroads","What Remains","Homecoming","The Reckoning"][i]||"Untitled"}`,
    date:`${s.year}-${String(3+i*4).padStart(2,"0")}-1${i%10}`,
    desc:`Season 1 continues as the story deepens — alliances shift, secrets surface, and nothing stays buried for long.`
  }));
  $("#app").innerHTML = `<div class="container" style="padding-bottom:60px">
    <div class="page-head"><h1><i class="fas fa-tv" style="color:var(--gold)"></i> ${esc(s.title)}</h1>
    <p>${s.year} • ${s.seasons} Season${s.seasons>1?"s":""} • ${star(Math.round(s.rating/2))} ${s.rating.toFixed(1)} • ${esc(s.genres.join(" • "))}</p></div>
    <div class="about-block">${esc(s.desc)}</div>
    <div class="section-head"><h2><i class="fas fa-list"></i> Season 1 Episodes</h2></div>
    <div class="ep-list">${eps.map(e=>`
      <div class="ep-item"><div class="ep-num">${String(e.n).padStart(2,"0")}</div>
        <div style="flex:1"><h4>${esc(e.title)}</h4><p>${e.date} — ${esc(e.desc)}</p></div>
        <button class="btn btn-ghost" style="font-size:.72rem" onclick="openTrailer('starfall-protocol')"><i class="fas fa-play"></i> Trailer</button>
        <button class="btn btn-gold" style="font-size:.72rem" onclick="toast('Opening legal viewing options for ${esc(s.title)}…')"><i class="fas fa-tv"></i> Watch Legally</button>
      </div>`).join("")}
    </div>
    <div class="badge-note"><i class="fas fa-shield-halved" style="margin-top:2px"></i><span>Episodes are available exclusively through licensed providers: Netflix, Prime Video, Disney+, Apple TV and YouTube Movies. MOVIES WORLD never hosts unauthorized content.</span></div>
    <div class="section-head" style="margin-top:34px"><h2><i class="fas fa-clapperboard"></i> You May Also Like</h2></div>
    <div class="grid">${SERIES.filter(x=>x.slug!==slug).map(seriesCardHTML).join("")}</div>
  </div>`;
  observeReveals();
}

/* ---------- REVIEWS PAGE ---------- */
function pageReviews(){
  $("#app").innerHTML = `<div class="container" style="padding-bottom:60px">
    <div class="page-head"><h1><i class="fas fa-comment-dots" style="color:var(--gold)"></i> Community Reviews</h1><p>Latest reviews from MOVIES WORLD members and critics</p></div>
    <div id="all-reviews">${latestReviewsHTML(50)}</div></div>`;
  observeReveals();
}

/* ---------- AUTH ---------- */
function pageLogin(){
  if(currentUser()){ location.hash="#/profile"; return; }
  $("#app").innerHTML = `<div class="auth-wrap"><div class="auth-box">
    <h2>Welcome Back</h2><p class="sub">Log in to rate movies, write reviews and build your watchlist</p>
    <div class="field"><label>Email</label><input id="l-email" type="email" placeholder="you@example.com"></div>
    <div class="field"><label>Password</label><input id="l-pass" type="password" placeholder="••••••••"></div>
    <button class="btn btn-gold" style="width:100%;justify-content:center;margin-top:6px" id="l-btn"><i class="fas fa-right-to-bracket"></i> Log In</button>
    <p class="auth-alt">New here? <a href="#/register">Create an account</a> · <a href="#/forgot">Forgot password?</a></p>
    <p class="auth-alt" style="margin-top:10px;font-size:.72rem;color:#666">Demo tip: register any account — data is stored locally in your browser.</p>
  </div></div>`;
  const go = ()=>{
    const em = $("#l-email").value.trim().toLowerCase(), pw = $("#l-pass").value;
    const u = Object.values(users()).find(x=>x.email===em);
    if(!u || u.pass !== btoa(pw)){ toast("Invalid email or password", true); return; }
    store.set("mw_session", {username:u.username, email:u.email, role:u.role||"user"});
    toast(`Welcome back, ${u.username}!`); location.hash = "#/profile";
  };
  $("#l-btn").onclick = go;
  $(".auth-box").addEventListener("keydown", e=>{ if(e.key==="Enter") go(); });
}
function pageRegister(){
  $("#app").innerHTML = `<div class="auth-wrap"><div class="auth-box">
    <h2>Join MOVIES WORLD</h2><p class="sub">Create your free account in seconds</p>
    <div class="field"><label>Username</label><input id="r-name" placeholder="e.g. CinePhile99"></div>
    <div class="field"><label>Email</label><input id="r-email" type="email" placeholder="you@example.com"></div>
    <div class="field"><label>Password</label><input id="r-pass" type="password" placeholder="Min 6 characters"></div>
    <div class="field"><label>Confirm Password</label><input id="r-pass2" type="password" placeholder="Repeat password"></div>
    <button class="btn btn-gold" style="width:100%;justify-content:center;margin-top:6px" id="r-btn"><i class="fas fa-user-plus"></i> Create Account</button>
    <p class="auth-alt">Already have an account? <a href="#/login">Log in</a></p>
  </div></div>`;
  $("#r-btn").onclick = ()=>{
    const n=$("#r-name").value.trim(), em=$("#r-email").value.trim().toLowerCase(), p1=$("#r-pass").value, p2=$("#r-pass2").value;
    if(n.length<3){ toast("Username must be at least 3 characters", true); return; }
    if(!/^\S+@\S+\.\S+$/.test(em)){ toast("Please enter a valid email", true); return; }
    if(p1.length<6){ toast("Password must be at least 6 characters", true); return; }
    if(p1!==p2){ toast("Passwords do not match", true); return; }
    const all = users();
    if(all[n] || Object.values(all).some(u=>u.email===em)){ toast("An account with these details already exists", true); return; }
    all[n] = {username:n, email:em, pass:btoa(p1), role:"user", joined:new Date().toISOString().slice(0,10)};
    store.set("mw_users", all);
    store.set("mw_session", {username:n, email:em, role:"user"});
    toast(`Account created. Welcome, ${n}!`); location.hash = "#/profile";
  };
}
function pageForgot(){
  $("#app").innerHTML = `<div class="auth-wrap"><div class="auth-box">
    <h2>Reset Password</h2><p class="sub">Enter your email and we'll send reset instructions</p>
    <div class="field"><label>Email</label><input id="fp-email" type="email" placeholder="you@example.com"></div>
    <button class="btn btn-gold" style="width:100%;justify-content:center" id="fp-btn"><i class="fas fa-paper-plane"></i> Send Reset Link</button>
    <p class="auth-alt"><a href="#/login"><i class="fas fa-arrow-left"></i> Back to login</a></p></div></div>`;
  $("#fp-btn").onclick = ()=>{
    const em = $("#fp-email").value.trim().toLowerCase();
    if(!/^\S+@\S+\.\S+$/.test(em)){ toast("Please enter a valid email", true); return; }
    if(!Object.values(users()).some(u=>u.email===em)){ toast("No account found with that email", true); return; }
    toast("Reset link sent! (Demo mode — no email is actually sent)");
  };
}
function pageProfile(){
  const u = currentUser();
  if(!u){ toast("Please log in first", true); location.hash="#/login"; return; }
  const myRevs = Object.entries(userReviews()).flatMap(([slug,rs])=>rs.map(r=>({...r,slug}))).filter(r=>r.user===u.username);
  const wl = watchlist().map(findMovie).filter(Boolean);
  $("#app").innerHTML = `<div class="container" style="padding-bottom:60px">
    <div class="page-head"><h1><i class="fas fa-user" style="color:var(--gold)"></i> My Profile</h1></div>
    <div class="profile-head">
      <div class="avatar">${esc(u.username[0].toUpperCase())}</div>
      <div style="flex:1;min-width:200px"><h2 style="font-size:1.9rem">${esc(u.username)}</h2>
        <p style="color:var(--muted);font-size:.85rem">${esc(u.email)} ${u.role==="admin"?'• <span style="color:var(--gold)"><i class="fas fa-crown"></i> Administrator</span>':""}</p></div>
      <div class="stat-row">
        <div class="stat"><b>${wl.length}</b><small>Watchlist</small></div>
        <div class="stat"><b>${myRevs.length}</b><small>Reviews</small></div>
        <div class="stat"><b>${wl.filter(m=>m.rating>=8).length}</b><small>Favorites</small></div>
      </div>
      <button class="btn btn-red" onclick="logout()"><i class="fas fa-right-from-bracket"></i> Logout</button>
    </div>
    <div class="section-head"><h2><i class="fas fa-bookmark"></i> My Watchlist</h2></div>
    <div class="grid">${wl.length?wl.map(movieCard).join(""):emptyState("Your watchlist is empty","Browse movies and tap the + button to save them here.")}</div>
    <div class="section-head" style="margin-top:40px"><h2><i class="fas fa-comment-dots"></i> My Reviews</h2></div>
    ${myRevs.length ? myRevs.map(r=>{const m=findMovie(r.slug);return `<div class="review-card"><div class="review-head">
      <div class="review-user"><div class="avatar">${esc(u.username[0].toUpperCase())}</div><div><b>${esc(u.username)}</b><small>on <a href="#/movie/${r.slug}" style="color:var(--gold)">${m?esc(m.title):""}</a> • ${r.date}</small></div></div>${star(r.stars)}</div>
      <p class="review-text">${esc(r.text)}</p></div>`;}).join("") : `<p style="color:var(--muted)">You haven't written any reviews yet.</p>`}
  </div>`;
  observeReveals();
}

/* ---------- ADMIN ---------- */
function pageAdmin(){
  const u = currentUser();
  if(!u || u.role!=="admin"){ toast("Admin access required", true); location.hash="#/login"; return; }
  const ms = allMovies();
  const revs = Object.values(userReviews()).flat();
  $("#app").innerHTML = `<div class="container" style="padding-bottom:60px">
    <div class="page-head"><h1><i class="fas fa-gauge-high" style="color:var(--gold)"></i> Admin Dashboard</h1><p>Manage movies, users, reviews and sources</p></div>
    <div class="stat-row" style="margin-bottom:30px">
      <div class="stat"><b>${ms.length}</b><small>Movies</small></div>
      <div class="stat"><b>${Object.keys(users()).length}</b><small>Users</small></div>
      <div class="stat"><b>${Object.values(SAMPLE_REVIEWS).flat().length + revs.length}</b><small>Reviews</small></div>
      <div class="stat"><b>${SERIES.length}</b><small>TV Series</small></div>
    </div>
    <div class="section-head"><h2><i class="fas fa-plus"></i> Add Movie</h2></div>
    <div class="review-form" style="margin-top:0">
      <div class="filter-bar" style="margin-bottom:14px">
        <div><label>Title *</label><input id="a-title" placeholder="Movie title" style="width:100%;background:var(--bg3);border:1px solid var(--line);color:#fff;border-radius:9px;padding:9px 12px;font-family:Poppins;font-size:.83rem;outline:none"></div>
        <div><label>Year *</label><input id="a-year" type="number" value="2026" style="width:100%;background:var(--bg3);border:1px solid var(--line);color:#fff;border-radius:9px;padding:9px 12px;font-family:Poppins;font-size:.83rem;outline:none"></div>
        <div><label>Rating (0–10)</label><input id="a-rating" type="number" step="0.1" min="0" max="10" value="7.5" style="width:100%;background:var(--bg3);border:1px solid var(--line);color:#fff;border-radius:9px;padding:9px 12px;font-family:Poppins;font-size:.83rem;outline:none"></div>
        <div><label>Genre</label><select id="a-genre">${GENRES.map(g=>`<option>${g}</option>`).join("")}</select></div>
        <div><label>Language</label><select id="a-lang">${LANGS.map(l=>`<option>${l}</option>`).join("")}</select></div>
        <div><label>Quality</label><select id="a-q"><option>1080p</option><option>720p</option><option>480p</option><option>4K</option></select></div>
      </div>
      <div class="field"><label>Description</label><textarea id="a-desc" style="width:100%;background:var(--bg3);border:1px solid var(--line);border-radius:10px;color:#fff;padding:12px;font-family:Poppins;font-size:.85rem;min-height:80px;outline:none"></textarea></div>
      <button class="btn btn-gold" id="a-add"><i class="fas fa-plus"></i> Add Movie</button>
    </div>
    <div class="section-head" style="margin-top:36px"><h2><i class="fas fa-film"></i> Manage Movies</h2></div>
    <div class="ep-list">${ms.map(m=>`
      <div class="ep-item"><div class="ep-num"><i class="fas fa-film"></i></div>
        <div style="flex:1"><h4>${esc(m.title)} <span style="color:var(--muted);font-weight:400">(${m.year})</span></h4>
        <p>${esc(m.genres.join(", "))} • ★ ${m.rating.toFixed(1)} • ${(m.languages||[]).join(", ")}</p></div>
        ${m.custom?`<button class="btn btn-red" style="font-size:.72rem" onclick="adminDelete('${m.slug}')"><i class="fas fa-trash"></i> Delete</button>`:`<span class="provider" style="font-size:.7rem"><i class="fas fa-lock"></i> Core catalog</span>`}
      </div>`).join("")}
    </div>
    <div class="badge-note" style="margin-top:24px"><i class="fas fa-info-circle" style="margin-top:2px"></i><span>In production, this dashboard connects to the Node.js/Express + MongoDB backend with JWT role-based access. In this demo, admin-added movies persist in your browser's localStorage. Create a user and toggle the <code>mw_users</code> role to "admin" to try it.</span></div>
  </div>`;
  $("#a-add").onclick = ()=>{
    const t=$("#a-title").value.trim(), y=+$("#a-year").value, r=Math.min(10,Math.max(0,parseFloat($("#a-rating").value)||5));
    if(t.length<2){ toast("Please enter a movie title", true); return; }
    const extra = store.get("mw_custom_movies", []);
    if(extra.some(m=>m.slug===t.toLowerCase().replace(/[^a-z0-9]+/g,"-"))){ toast("This movie already exists", true); return; }
    extra.unshift({ custom:true, slug:t.toLowerCase().replace(/[^a-z0-9]+/g,"-"), title:t, originalTitle:t,
      year:y||2026, releaseDate:`${y||2026}-01-01`, runtime:"—", country:"—", languages:[$("#a-lang").value],
      genres:[$("#a-genre").value], rating:r, votes:1, quality:$("#a-q").value, director:"—", writers:[], cast:[],
      studio:"—", trailer:"dQw4w9WgXcQ", desc:$("#a-desc").value.trim()||"No description provided yet.",
      story:r, acting:r, direction:r, cine:r, music:r });
    store.set("mw_custom_movies", extra);
    toast(`"${t}" added to the catalog!`); pageAdmin();
  };
}
window.adminDelete = slug => {
  store.set("mw_custom_movies", store.get("mw_custom_movies",[]).filter(m=>m.slug!==slug));
  toast("Movie deleted"); pageAdmin();
};

/* ---------- STATIC PAGES ---------- */
function pageAbout(){
  $("#app").innerHTML = `<div class="container" style="padding-bottom:60px;max-width:900px">
    <div class="page-head"><h1><i class="fas fa-circle-info" style="color:var(--gold)"></i> About MOVIES WORLD</h1><p>Your destination for movie discovery, reviews and legal viewing options.</p></div>
    <div class="about-block"><h3>What we do</h3>MOVIES WORLD is a movie discovery and review platform. We provide rich movie metadata — titles, posters, backdrops, release dates, genres, cast and crew, ratings, trailers and editorial scores — all in one beautiful, searchable catalog.</div>
    <div class="about-block"><h3>Our review system</h3>Every film carries MOVIES WORLD scores for Story, Acting, Direction, Cinematography and Music, alongside community reviews from registered members. Third-party metadata ratings are clearly distinguished from user reviews — we never present unofficial ratings as IMDb ratings.</div>
    <div class="about-block"><h3>Legal viewing, only</h3>MOVIES WORLD does <b>not</b> host, upload or redistribute copyrighted movie files without authorization. For films we don't have distribution rights to, we direct you to legitimate licensed services:
      <ul><li>Netflix, Prime Video, Disney+, Apple TV, YouTube Movies and other authorized providers</li><li>Official trailer embeds from studio-verified YouTube sources</li></ul>
      We never create fake download links.</div>
    <div class="about-block"><h3>Technology</h3>The production stack uses Node.js + Express, MongoDB/Mongoose, JWT authentication and the TMDB metadata API (used under its terms, with results cached in MongoDB). The design is original to MOVIES WORLD.</div>
  </div>`;
}
function pageContact(){
  $("#app").innerHTML = `<div class="container" style="padding-bottom:60px">
    <div class="page-head"><h1><i class="fas fa-envelope" style="color:var(--gold)"></i> Contact Us</h1><p>Questions, feedback or partnership inquiries</p></div>
    <div class="contact-grid">
      <div>
        <div class="info-card"><i class="fas fa-location-dot"></i><div><b>Head Office</b><p style="color:var(--muted);font-size:.83rem;margin-top:4px">42 Cinema Lane, Colombo 03, Sri Lanka</p></div></div>
        <div class="info-card"><i class="fas fa-envelope"></i><div><b>Email</b><p style="color:var(--muted);font-size:.83rem;margin-top:4px">hello@moviesworld.example</p></div></div>
        <div class="info-card"><i class="fas fa-clock"></i><div><b>Response Time</b><p style="color:var(--muted);font-size:.83rem;margin-top:4px">Within 2 business days</p></div></div>
      </div>
      <div class="review-form" style="margin-top:0">
        <div class="field"><label>Name</label><input id="c-name" placeholder="Your name"></div>
        <div class="field"><label>Email</label><input id="c-email" type="email" placeholder="you@example.com"></div>
        <div class="field"><label>Subject</label><input id="c-subj" placeholder="How can we help?"></div>
        <div class="field"><label>Message</label><textarea id="c-msg" placeholder="Write your message…" style="min-height:130px"></textarea></div>
        <button class="btn btn-gold" id="c-send"><i class="fas fa-paper-plane"></i> Send Message</button>
      </div>
    </div></div>`;
  $("#c-send").onclick = ()=>{
    const n=$("#c-name").value.trim(), e=$("#c-email").value.trim(), s=$("#c-subj").value.trim(), m=$("#c-msg").value.trim();
    if(!n || !/^\S+@\S+\.\S+$/.test(e) || !s || m.length<10){ toast("Please fill all fields correctly (message min 10 chars)", true); return; }
    toast("Message sent! We'll get back to you soon.");
    ["c-name","c-email","c-subj","c-msg"].forEach(id=>$("#"+id).value="");
  };
}
function pageDMCA(){
  $("#app").innerHTML = `<div class="container" style="padding-bottom:60px;max-width:900px">
    <div class="page-head"><h1><i class="fas fa-shield-halved" style="color:var(--gold)"></i> Copyright & DMCA Policy</h1><p>How we respect and protect intellectual property</p></div>
    <div class="about-block"><h3>Our Policy</h3>MOVIES WORLD respects the intellectual property rights of filmmakers, studios and distributors. We do not host, store or distribute copyrighted movie files, and we do not link to unauthorized copies of copyrighted works.</div>
    <div class="about-block"><h3>Metadata & Trailers</h3>Movie metadata (titles, descriptions, cast, ratings) is sourced from licensed APIs such as TMDB under their terms of use, and cached in our database. Trailers are embedded from official studio channels on YouTube.</div>
    <div class="about-block"><h3>Filing a Takedown Request</h3>If you believe any content on MOVIES WORLD infringes your copyright, send a notice to <b>dmca@moviesworld.example</b> including:
      <ul><li>Identification of the copyrighted work</li><li>URL(s) of the allegedly infringing material</li><li>Your name, organization and contact details</li><li>A good-faith statement that the use is unauthorized</li><li>A declaration that the information is accurate, under penalty of perjury</li></ul></div>
    <div class="about-block"><h3>Removal Procedure</h3>Valid requests are reviewed within 48 hours. Infringing material is removed promptly and repeat-infringement sources are permanently blocked from the platform.</div>
  </div>`;
}
function pagePolicy(title){
  $("#app").innerHTML = `<div class="container" style="padding-bottom:60px;max-width:900px">
    <div class="page-head"><h1><i class="fas fa-file-contract" style="color:var(--gold)"></i> ${title}</h1><p>Last updated: September 2026</p></div>
    <div class="about-block"><h3>Overview</h3>This page outlines how MOVIES WORLD handles your data and governs your use of the platform. By creating an account or browsing the site, you agree to these terms.</div>
    <div class="about-block"><h3>Privacy Policy</h3>We collect only the information needed to operate your account: username, email and your on-site activity (reviews, watchlist, ratings). We never sell personal data. Authentication is secured with hashed passwords and JWT sessions. You may request export or deletion of your data at any time via the contact page.</div>
    <div class="about-block"><h3>Terms of Service</h3>Users must be 13 or older. Reviews must be respectful and free of spam or hate speech — administrators moderate content and may remove violations. All movie metadata is provided for informational purposes; availability of streaming/download options is always routed through licensed providers.</div>
  </div>`;
}

/* ---------- NAV / SEARCH ---------- */
function renderNavAuth(){
  const u = currentUser();
  $("#nav-auth").innerHTML = u
    ? `<a href="#/profile" class="btn btn-ghost" style="padding:8px 14px"><i class="fas fa-user"></i> ${esc(u.username)}</a>
       ${u.role==="admin"?`<a href="#/admin" class="btn btn-gold" style="padding:8px 13px"><i class="fas fa-crown"></i></a>`:""}
       <button class="btn btn-red" style="padding:8px 14px" onclick="logout()"><i class="fas fa-right-from-bracket"></i></button>`
    : `<a href="#/login" class="btn btn-ghost" style="padding:8px 14px"><i class="fas fa-right-to-bracket"></i> Login</a>
       <a href="#/register" class="btn btn-gold" style="padding:8px 16px"><i class="fas fa-user-plus"></i> Register</a>`;
}
function initSearch(){
  const inp = $("#nav-q"), box = $("#suggest");
  const close = ()=> box.classList.remove("show");
  inp.addEventListener("input", ()=>{
    const q = inp.value.trim().toLowerCase();
    if(q.length < 2){ close(); return; }
    const hits = allMovies().filter(m => [m.title, m.originalTitle, m.director, ...(m.cast||[])].join(" ").toLowerCase().includes(q)).slice(0,7);
    box.innerHTML = hits.length ? hits.map(m=>`
      <div class="suggest-item" onclick="location.hash='#/movie/${m.slug}';document.querySelector('#suggest').classList.remove('show')">
        <div class="mini" style="background:linear-gradient(160deg,${m.art.from},${m.art.to})"></div>
        <span><b style="font-size:.82rem">${esc(m.title)}</b><small>${m.year} • ★ ${m.rating.toFixed(1)} • ${esc(m.genres[0])}</small></span>
      </div>`).join("") : `<div class="suggest-empty"><i class="fas fa-search" style="margin-right:8px"></i>No movies found</div>`;
    box.classList.add("show");
  });
  inp.addEventListener("keydown", e=>{ if(e.key==="Enter"){ close(); catState.q = inp.value.trim(); catState.genre="all"; catState.year="all"; catState.lang="all"; catState.rating="all"; location.hash="#/movies"; if(location.hash==="#/movies") pageMovies(); }});
  document.addEventListener("click", e=>{ if(!e.target.closest(".nav-search")) close(); });
}

/* ---------- TRANSLATOR ---------- */
const TRANSLATE_LANGS = [
  ["en","English","🇺🇸"],["si","සිංහල","🇱🇰"],["ta","தமிழ்","🇮🇳"],["hi","हिन्दी","🇮🇳"],
  ["ml","മലയാളം","🇮🇳"],["te","తెలుగు","🇮🇳"],["ko","한국어","🇰🇷"],["ja","日本語","🇯🇵"],
  ["zh-CN","中文","🇨🇳"],["fr","Français","🇫🇷"],["es","Español","🇪🇸"],["de","Deutsch","🇩🇪"],
  ["ar","العربية","🇸🇦"],["pt","Português","🇵🇹"],["ru","Русский","🇷🇺"]
];
function initTranslator(){
  const menu = $("#translate-menu");
  menu.innerHTML = TRANSLATE_LANGS.map(([code,name,flag])=>`<button data-lang="${code}" class="${code==="en"?"active":""}"><span>${flag}</span>${name}${code==="en"?'<small style="margin-left:auto;color:var(--muted);font-size:.65rem">default</small>':""}</button>`).join("");
  $("#translate-btn").onclick = e => { e.stopPropagation(); menu.classList.toggle("show"); };
  document.addEventListener("click", e=>{ if(!e.target.closest(".translate-wrap")) menu.classList.remove("show"); });
  menu.addEventListener("click", e=>{
    const b = e.target.closest("button[data-lang]"); if(!b) return;
    $$("#translate-menu button").forEach(x=>x.classList.remove("active")); b.classList.add("active");
    setTranslateCookie(b.dataset.lang);
    menu.classList.remove("show");
    toast(b.dataset.lang==="en" ? "Language reset to English" : `Translating page to ${b.textContent.trim()}…`);
    if(b.dataset.lang==="en" && !window.__gtLoaded){ /* nothing to reset */ }
  });
}
function setTranslateCookie(lang){
  const trySet = ()=>{
    try{
      document.cookie = `googtrans=/en/${lang};path=/`;
      document.cookie = `googtrans=/en/${lang};path=/;domain=${location.hostname}`;
      /* force widget refresh */
      if(window.google?.translate){ location.reload(); return true; }
    }catch(e){}
    return false;
  };
  if(!trySet()){ setTimeout(()=>{ if(!trySet()) toast("Translator loading… the page will reload shortly.", true); }, 800); }
}

/* ---------- REVEAL ANIMATIONS ---------- */
let obs;
function observeReveals(){
  if(!obs) obs = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("visible"); obs.unobserve(e.target);} }), {threshold:.08});
  $$(".reveal:not(.visible)").forEach(el=>obs.observe(el));
}

/* ---------- ROUTER ---------- */
const routes = {
  "": pageHome, "home": pageHome, "movies": pageMovies, "tv": pageTV, "reviews": pageReviews,
  "login": pageLogin, "register": pageRegister, "forgot": pageForgot, "profile": pageProfile,
  "admin": pageAdmin, "about": pageAbout, "contact": pageContact, "dmca": pageDMCA,
  "privacy": ()=>pagePolicy("Privacy Policy"), "terms": ()=>pagePolicy("Terms of Service"),
};
function route(){
  clearInterval(heroTimer);
  const hash = location.hash.replace(/^#\/?/, "");
  const [page, arg] = hash.split("/").map(decodeURIComponent);
  window.scrollTo({top:0});
  document.title = "MOVIES WORLD — Discover, Review, Watch Legally";
  const app = $("#app");
  app.style.opacity = 0;
  setTimeout(()=>{
    if(page==="movie" && arg) pageMovie(arg);
    else if(page==="genre" && arg) pageGenre(arg);
    else if(page==="year" && arg) pageYear(arg);
    else if(page==="series" && arg) pageSeries(arg);
    else (routes[page] || pageHome)();
    app.style.transition = "opacity .35s"; app.style.opacity = 1;
    renderNavAuth();
    $$(".nav-links a").forEach(a=>a.classList.toggle("active", a.dataset.route === (page||"home")));
  }, 60);
}

/* ---------- BOOT ---------- */
document.addEventListener("DOMContentLoaded", ()=>{
  initTranslator(); initSearch(); renderNavAuth();
  $("#hamburger").onclick = ()=> $("#nav-links").classList.toggle("open");
  $$(".nav-links a").forEach(a=>a.addEventListener("click", ()=>$("#nav-links").classList.remove("open")));
  window.addEventListener("hashchange", route);
  route();
});
