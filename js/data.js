
/* ============================================================
   MOVIES WORLD — Sample Database (demo data, TMDB-style fields)
   Posters are CSS-generated art (no copyrighted images used).
   ============================================================ */
const GENRES = ["Action","Adventure","Animation","Comedy","Crime","Drama","Fantasy","Horror","Mystery","Romance","Sci-Fi","Thriller","Documentary"];
const LANGS = ["English","Sinhala","Tamil","Hindi","Malayalam","Telugu","Korean","Japanese","Chinese","French","Spanish"];

const PALETTES = [
  ["#1a0533","#7b2ff7"],["#0b1e3a","#2f80ed"],["#2b0a0a","#eb5757"],
  ["#0a2b1e","#27ae60"],["#33260a","#f2c94c"],["#250a33","#bb6bd9"],
  ["#03222b","#56ccf2"],["#33130a","#f2994a"]
];

function art(i, title){
  const p = PALETTES[i % PALETTES.length];
  return { from:p[0], to:p[1], title };
}

const MOVIES = [
 {slug:"starfall-protocol", title:"Starfall Protocol", originalTitle:"Starfall Protocol", year:2026, releaseDate:"2026-03-14", runtime:"2h 18m", country:"USA", languages:["English"], genres:["Sci-Fi","Action","Thriller"], rating:8.7, votes:15420, quality:"1080p", director:"Elena Vasquez", writers:["Marcus Chen","Elena Vasquez"], cast:["Ryan Calder","Aiko Tanaka","David Mensah","Lara Osei"], studio:"Nova Pictures", featured:true, trailer:"dQw4w9WgXcQ",
  desc:"When a deep-space relay station goes silent, a disgraced pilot and a cryptic AI architect must cross a dying star system to stop a signal that could rewrite human memory.",
  story:8.8, acting:8.5, direction:9.0, cine:9.2, music:8.4},
 {slug:"the-last-monsoon", title:"The Last Monsoon", originalTitle:"The Last Monsoon", year:2026, releaseDate:"2026-01-30", runtime:"2h 05m", country:"Sri Lanka", languages:["Sinhala","Tamil"], genres:["Drama","Romance"], rating:8.9, votes:2310, quality:"1080p", director:"Nadeesha Perera", writers:["Nadeesha Perera"], cast:["Sithum Fernando","Amaya Jayasinghe","Ruwan Silva"], studio:"Island Light Films", featured:true, trailer:"dQw4w9WgXcQ",
  desc:"Two estranged brothers return to their flooded ancestral village and confront the choices that pulled their family apart, as one final monsoon threatens everything.",
  story:9.2, acting:9.0, direction:8.8, cine:8.6, music:9.1},
 {slug:"crimson-tide-rising", title:"Crimson Tide Rising", originalTitle:"Crimson Tide Rising", year:2025, releaseDate:"2025-07-18", runtime:"2h 24m", country:"USA", languages:["English"], genres:["Action","Thriller"], rating:7.9, votes:48200, quality:"4K", director:"James Okafor", writers:["Tina Roy"], cast:["Victor Hale","Mira Castellan","Owen Doyle","Sofia Brandt"], studio:"Harbor Gate Studios", featured:true, trailer:"dQw4w9WgXcQ",
  desc:"A coast guard investigator uncovers a smuggling ring operating inside her own unit — and has 48 hours before a chemical tanker reaches the harbor.",
  story:7.6, acting:8.1, direction:8.0, cine:8.3, music:7.7},
 {slug:"midnight-in-colombo", title:"Midnight in Colombo", originalTitle:"Midnight in Colombo", year:2025, releaseDate:"2025-11-07", runtime:"1h 58m", country:"Sri Lanka", languages:["Sinhala","English"], genres:["Crime","Mystery"], rating:8.2, votes:1890, quality:"720p", director:"Kasun Wijeratne", writers:["Kasun Wijeratne","Dilani Costa"], cast:["Tharindu Bandara","Nethmi Rodrigo","Asanka Herath"], studio:"Ceylon Noir", featured:true, trailer:"dQw4w9WgXcQ",
  desc:"A jazz pianist witnesses a murder from his hotel window, but every clue he finds points back to a night he swears he never lived.",
  story:8.4, acting:8.0, direction:8.3, cine:8.5, music:8.8},
 {slug:"kingdom-of-ash", title:"Kingdom of Ash", originalTitle:"Kingdom of Ash", year:2025, releaseDate:"2025-04-11", runtime:"2h 41m", country:"USA", languages:["English"], genres:["Fantasy","Adventure"], rating:8.1, votes:61050, quality:"4K", director:"Ingrid Solberg", writers:["Ingrid Solberg","Paul Adeyemi"], cast:["Freya Lindqvist","Tomás Herrera","Kwame Asante"], studio:"Northfall Pictures", featured:false, trailer:"dQw4w9WgXcQ",
  desc:"The last cartographer of a burned empire must lead a caravan across the Ashen Wastes to a city that appears on no map — because it is still being built.",
  story:8.0, acting:7.9, direction:8.2, cine:8.9, music:8.6},
 {slug:"seoul-echo", title:"Seoul Echo", originalTitle:"서울의 메아리", year:2024, releaseDate:"2024-09-20", runtime:"1h 52m", country:"South Korea", languages:["Korean"], genres:["Drama","Mystery"], rating:8.5, votes:12400, quality:"1080p", director:"Min-jun Park", writers:["Min-jun Park"], cast:["Ji-woo Han","Seo-jun Lee","Ha-eun Choi"], studio:"Han River Films", featured:false, trailer:"dQw4w9WgXcQ",
  desc:"A sound engineer recovering her hearing after an accident starts hearing conversations from twenty years in the past through her apartment walls.",
  story:8.7, acting:8.6, direction:8.4, cine:8.2, music:8.9},
 {slug:"laugh-track", title:"Laugh Track", originalTitle:"Laugh Track", year:2026, releaseDate:"2026-05-01", runtime:"1h 44m", country:"USA", languages:["English"], genres:["Comedy"], rating:7.2, votes:8300, quality:"720p", director:"Dana Whitfield", writers:["Dana Whitfield","Omar Reyes"], cast:["Pete Novak","Lucia Marino","Dev Arora"], studio:"Standup Republic", featured:false, trailer:"dQw4w9WgXcQ",
  desc:"A failed comedian inherits his father's comedy club on the condition that he performs every single night for one full year.",
  story:7.0, acting:7.5, direction:7.1, cine:6.9, music:7.3},
 {slug:"the-hollow-hour", title:"The Hollow Hour", originalTitle:"The Hollow Hour", year:2024, releaseDate:"2024-10-31", runtime:"1h 49m", country:"UK", languages:["English"], genres:["Horror","Mystery"], rating:7.6, votes:15200, quality:"1080p", director:"Cormac Byrne", writers:["Eloise Grant"], cast:["Maeve Kinsella","Arthur Bell","Nadia Okafor"], studio:"Black Barn Films", featured:false, trailer:"dQw4w9WgXcQ",
  desc:"Every night at 3:33 AM, the residents of a coastal village wake to find one hour has been erased from their lives. A skeptical doctor arrives to prove it's a hoax.",
  story:7.8, acting:7.4, direction:7.7, cine:8.1, music:8.0},
 {slug:"gold-of-the-deccan", title:"Gold of the Deccan", originalTitle:"Gold of the Deccan", year:2023, releaseDate:"2023-08-25", runtime:"2h 52m", country:"India", languages:["Hindi","Telugu"], genres:["Action","Adventure","History"], rating:8.0, votes:33800, quality:"1080p", director:"Arjun Mehta", writers:["Arjun Mehta","Priya Nair"], cast:["Vikram Rathore","Ananya Iyer","Farhan Sheikh"], studio:"Deccan Crown Studios", featured:false, trailer:"dQw4w9WgXcQ",
  desc:"In 1789, a band of rebel miners plots to steal back their kingdom's treasury gold from a fortified British garrison — using the monsoon itself as their weapon.",
  story:8.1, acting:7.8, direction:8.0, cine:8.7, music:8.2},
 {slug:"paper-moons", title:"Paper Moons", originalTitle:"Paper Moons", year:2023, releaseDate:"2023-02-10", runtime:"1h 56m", country:"USA", languages:["English"], genres:["Romance","Drama"], rating:7.8, votes:9600, quality:"720p", director:"Claire Dubois", writers:["Claire Dubois"], cast:["Elliot Marsh","Yuki Sato","Grace Whitmore"], studio:"Silverleaf Pictures", featured:false, trailer:"dQw4w9WgXcQ",
  desc:"A letterpress printer and an astronomer keep missing each other by exactly one year — until a misdelivered letter finally connects them.",
  story:7.9, acting:7.7, direction:7.6, cine:8.0, music:7.8},
 {slug:"neon-dynasty", title:"Neon Dynasty", originalTitle:"ネオン王朝", year:2024, releaseDate:"2024-06-14", runtime:"2h 10m", country:"Japan", languages:["Japanese"], genres:["Animation","Sci-Fi","Action"], rating:8.8, votes:28900, quality:"4K", director:"Kenji Mori", writers:["Kenji Mori","Yuki Amamiya"], cast:["Rin Takahashi (voice)","Sota Kimura (voice)","Mei Fujiwara (voice)"], studio:"Studio Kaen", featured:true, trailer:"dQw4w9WgXcQ",
  desc:"In Neo-Kyoto 2199, a courier who delivers memories instead of packages discovers her own past has been edited — and someone paid a fortune to hide it.",
  story:8.6, acting:8.7, direction:8.9, cine:9.3, music:9.0},
 {slug:"the-quiet-border", title:"The Quiet Border", originalTitle:"The Quiet Border", year:2022, releaseDate:"2022-11-18", runtime:"2h 02m", country:"Canada", languages:["English","French"], genres:["Drama","Thriller"], rating:8.3, votes:5400, quality:"1080p", director:"Michelle Lavoie", writers:["Michelle Lavoie"], cast:["Gabriel Roy","Ingrid Solano","Marc Delacroix"], studio:"Boreal Films", featured:false, trailer:"dQw4w9WgXcQ",
  desc:"A border radio operator in a remote northern town intercepts a distress call in a language that officially doesn't exist — spoken by a woman who claims to be from the other side of the border that was never drawn.",
  story:8.5, acting:8.2, direction:8.4, cine:8.1, music:7.9},
 {slug:"ocean-of-stars", title:"Ocean of Stars", originalTitle:"Ocean of Stars", year:2023, releaseDate:"2023-12-15", runtime:"1h 51m", country:"France", languages:["French"], genres:["Documentary"], rating:8.6, votes:3200, quality:"4K", director:"Luc Moreau", writers:["Luc Moreau"], cast:["Narrated by Isabelle Fontaine"], studio:"Planète Bleue", featured:false, trailer:"dQw4w9WgXcQ",
  desc:"Filmed over four years across five oceans, this documentary follows the secret nocturnal migrations of deep-sea creatures that have never been filmed before.",
  story:8.4, acting:0, direction:9.0, cine:9.5, music:8.8},
 {slug:"river-of-kings", title:"River of Kings", originalTitle:"River of Kings", year:2022, releaseDate:"2022-04-22", runtime:"2h 33m", country:"India", languages:["Malayalam","Tamil"], genres:["Crime","Drama","Thriller"], rating:8.4, votes:18700, quality:"1080p", director:"Joseph Mathew", writers:["Joseph Mathew","Anjali Das"], cast:["Mohan Pillai","Kavya Nair","Sajeev Kumar"], studio:"Backwater Films", featured:false, trailer:"dQw4w9WgXcQ",
  desc:"Three generations of a river-fishing family get pulled into the sand-mining mafia that controls their backwater village.",
  story:8.5, acting:8.6, direction:8.3, cine:8.4, music:8.0},
 {slug:"asphalt-angels", title:"Asphalt Angels", originalTitle:"Asphalt Angels", year:2021, releaseDate:"2021-08-06", runtime:"1h 47m", country:"USA", languages:["English"], genres:["Action","Crime"], rating:7.1, votes:12400, quality:"720p", director:"Ray Delgado", writers:["Ray Delgado","Kim Sung"], cast:["Trey Wallace","Bianca Ortiz","Jae Kim"], studio:"Torque Films", featured:false, trailer:"dQw4w9WgXcQ",
  desc:"An underground street-racing crew moonlights as getaway drivers — until a job goes wrong and they're chased by both the police and the cartel that hired them.",
  story:6.9, acting:7.0, direction:7.2, cine:7.6, music:7.8},
 {slug:"the-cartographers-daughter", title:"The Cartographer's Daughter", originalTitle:"The Cartographer's Daughter", year:2021, releaseDate:"2021-03-19", runtime:"2h 08m", country:"UK", languages:["English"], genres:["Mystery","Drama","Romance"], rating:8.0, votes:7800, quality:"1080p", director:"Harriet Vance", writers:["Harriet Vance","Owen Blackwood"], cast:["Clara Vance","Elias Thorne","Agnes Mbeki"], studio:"Meridian Pictures", featured:false, trailer:"dQw4w9WgXcQ",
  desc:"In 1890s Edinburgh, a young woman secretly finishes her late father's final map — one that leads to a place Scotland's elite would kill to keep hidden.",
  story:8.1, acting:7.9, direction:8.0, cine:8.2, music:7.7},
 {slug:"terra-forma", title:"Terra Forma", originalTitle:"Terra Forma", year:2022, releaseDate:"2022-06-03", runtime:"2h 21m", country:"USA", languages:["English"], genres:["Sci-Fi","Drama"], rating:7.7, votes:21500, quality:"4K", director:"Sofia Almeida", writers:["Sofia Almeida","Raj Patel"], cast:["Amara Diallo","Chris Nolan-Reyes","Dr. Priya Venkat"], studio:"Terraform Studios", featured:false, trailer:"dQw4w9WgXcQ",
  desc:"The first generation born on a terraformed Mars returns to Earth for the first time — and discovers their home planet is now the alien world.",
  story:7.8, acting:7.6, direction:7.9, cine:8.5, music:8.3},
 {slug:"bharat-express", title:"Bharat Express", originalTitle:"Bharat Express", year:2024, releaseDate:"2024-01-26", runtime:"2h 39m", country:"India", languages:["Hindi"], genres:["Action","Thriller"], rating:7.4, votes:41000, quality:"1080p", director:"Rohan Kapoor", writers:["Rohan Kapoor","Sneha Joshi"], cast:["Arjun Malhotra","Zoya Khan","Irfan Qureshi"], studio:"Express Films", featured:false, trailer:"dQw4w9WgXcQ",
  desc:"A suspended RAW officer has one night to stop a hijacked train carrying a witness whose testimony could topple a government.",
  story:7.2, acting:7.3, direction:7.5, cine:7.8, music:7.4},
 {slug:"whispers-of-the-willow", title:"Whispers of the Willow", originalTitle:"Whispers of the Willow", year:2020, releaseDate:"2020-10-09", runtime:"1h 43m", country:"Sri Lanka", languages:["Sinhala"], genres:["Drama","Fantasy"], rating:8.1, votes:1450, quality:"720p", director:"Samanthi Gunawardena", writers:["Samanthi Gunawardena"], cast:["Pasan Jayawardena","Iresha Attanayake","Gamini Corea"], studio:"Willow Tree Films", featured:false, trailer:"dQw4w9WgXcQ",
  desc:"A village girl who can hear the thoughts of an ancient willow tree must decide whether to reveal its final secret before the tree is cut down for a highway.",
  story:8.3, acting:7.9, direction:8.2, cine:8.0, music:8.4},
 {slug:"ghost-in-the-grid", title:"Ghost in the Grid", originalTitle:"Ghost in the Grid", year:2025, releaseDate:"2025-02-14", runtime:"2h 15m", country:"China", languages:["Chinese"], genres:["Sci-Fi","Crime","Action"], rating:7.8, votes:19800, quality:"1080p", director:"Wei Zhang", writers:["Wei Zhang","Ling Chen"], cast:["Yang Chen","Mei Lin","Hao Wu"], studio:"Gridline Pictures", featured:false, trailer:"dQw4w9WgXcQ",
  desc:"A detective in megacity Shenzhen hunts an AI that commits perfect crimes by predicting human hesitation — one second before it happens.",
  story:7.7, acting:7.8, direction:8.1, cine:8.6, music:7.9},
 {slug:"chasing-himal", title:"Chasing Himal", originalTitle:"Chasing Himal", year:2023, releaseDate:"2023-05-12", runtime:"1h 39m", country:"Nepal", languages:["Hindi","Nepali"], genres:["Adventure","Documentary"], rating:8.2, votes:2100, quality:"4K", director:"Tsering Lama", writers:["Tsering Lama"], cast:["Pasang Sherpa","Lakpa Tamang"], studio:"Summit Eye Films", featured:false, trailer:"dQw4w9WgXcQ",
  desc:"The youngest brother of a legendary Sherpa family attempts his first solo winter ascent — carrying his grandfather's 1963 ice axe.",
  story:8.0, acting:0, direction:8.3, cine:9.1, music:8.2},
 {slug:"court-of-silver", title:"Court of Silver", originalTitle:"Court of Silver", year:2026, releaseDate:"2026-06-19", runtime:"2h 27m", country:"USA", languages:["English"], genres:["Drama","Crime"], rating:8.3, votes:4100, quality:"1080p", director:"Adaeze Okafor", writers:["Adaeze Okafor","Ben Whitaker"], cast:["Naomi Adeleke","Richard Hale","Margaux Chen"], studio:"Silver Court Productions", featured:true, trailer:"dQw4w9WgXcQ",
  desc:"The first Black woman appointed to a powerful federal court discovers a sealed case file linking her own family to a fifty-year-old conspiracy.",
  story:8.6, acting:8.4, direction:8.2, cine:7.9, music:7.6},
];

MOVIES.forEach((m,i)=>{ m.art = art(i, m.title); m.id = i+1; });

const SERIES = [
 {slug:"the-ninth-ward", title:"The Ninth Ward", year:2025, seasons:3, rating:8.6, genres:["Crime","Drama"], desc:"A New Orleans detective rebuilds her life and her precinct after the storm — one unsolved case at a time."},
 {slug:"orbital", title:"Orbital", year:2024, seasons:2, rating:8.9, genres:["Sci-Fi","Thriller"], desc:"Six crew members aboard a privatized space station discover their mission parameters were never meant to be completed."},
 {slug:"monsoon-court", title:"Monsoon Court", year:2026, seasons:1, rating:8.1, genres:["Drama","Mystery"], desc:"A Colombo courtroom drama where every verdict changes with the season's rains."},
 {slug:"static", title:"Static", year:2023, seasons:2, rating:7.9, genres:["Horror","Mystery"], desc:"A late-night radio host takes calls from listeners — some of whom died decades ago."},
 {slug:"iron-harvest", title:"Iron Harvest", year:2025, seasons:1, rating:8.4, genres:["Action","Adventure"], desc:"Farmers turned smugglers protect their valley town when the railroad barons come to claim it."},
 {slug:"citrus-and-smoke", title:"Citrus & Smoke", year:2024, seasons:3, rating:8.0, genres:["Comedy","Drama"], desc:"A Michelin-trained chef returns to her family's chaotic street-food stall in Penang."},
];

const SAMPLE_REVIEWS = {
 "starfall-protocol":[
  {user:"AstroNadia", stars:5, text:"The zero-G heist sequence in the third act is the best-directed action set piece of the decade. Vasquez directs silence better than most directors handle dialogue.", date:"2026-03-20", helpful:214, notHelpful:8},
  {user:"FrameByFrame", stars:4, text:"Aiko Tanaka carries the emotional weight of the entire film. The third act stumbles slightly, but the ending recontextualizes everything.", date:"2026-03-28", helpful:96, notHelpful:12},
 ],
 "neon-dynasty":[
  {user:"SakuraGhost", stars:5, text:"Studio Kaen has outdone themselves. Every frame of Neo-Kyoto is wallpaper-worthy. The memory-market concept is terrifyingly plausible.", date:"2024-06-21", helpful:512, notHelpful:14},
  {user:"PixelPurist", stars:5, text:"I have watched the rain-soaked chase on the maglev line eleven times. Eleven.", date:"2024-07-02", helpful:301, notHelpful:6},
 ],
 "midnight-in-colombo":[
  {user:"CineLanka", stars:4, text:"A genuinely original noir. Nethmi Rodrigo's performance is a revelation. The jazz score alone is worth the ticket.", date:"2025-11-12", helpful:88, notHelpful:5},
 ],
 "the-last-monsoon":[
  {user:"IsharaW", stars:5, text:"Finally, a Sri Lankan film that trusts its audience. No exposition, no melodrama — just a family dissolving like riverbanks in the rain.", date:"2026-02-03", helpful:167, notHelpful:2},
  {user:"FilmBuffLK", stars:5, text:"The final shot, held for four minutes as the water rises, is the single best image of the year. Full stop.", date:"2026-02-11", helpful:143, notHelpful:4},
 ],
 "seoul-echo":[
  {user:"HangulHenry", stars:5, text:"A sound designer's mystery that you can practically hear. Watch this with good headphones — the mixing is a character of its own.", date:"2024-09-29", helpful:178, notHelpful:9},
 ],
 "court-of-silver":[
  {user:"BarReview99", stars:4, text:"Courtroom procedurals rarely get this tense. Adeleke's final summation is awards-worthy.", date:"2026-06-25", helpful:64, notHelpful:3},
 ],
};

const PROVIDERS = ["Netflix","Prime Video","Disney+","Apple TV","YouTube Movies","HBO Max"];
