// All portfolio content lives here. Edit this file to update the site.

export const PROFILE = {
  name: 'Mahmoud Khaled',
  tagline: 'Computer Science Student · Full-Stack Developer',
  title: 'Computer Science Student',
  academy: 'MIU, 2024 – Present',
  home: 'Cairo, Egypt',
  cvFile: 'Mahmoud_Khaled_CV.pdf',
  bio: "I'm a Computer Science student with a strong interest in software engineering and a passion for building practical, full-stack applications from the ground up. I enjoy working across the entire stack, from designing clean and responsive front-end interfaces to architecting reliable back-end systems and databases. I'm especially drawn to problem solving, system design, and writing efficient, well-structured code, and I'm always looking for opportunities to learn new technologies, contribute to open-source projects, and grow as a developer. I thrive in collaborative environments and enjoy turning ideas into functional, real-world products that genuinely solve problems for the people using them.",
};

// The PDF lives in /public, so it is served next to index.html.
export const CV_URL = `${import.meta.env.BASE_URL}${PROFILE.cvFile}`;

export const TABS = [
  { id: 'status', label: 'Status', sub: 'About me' },
  { id: 'inventory', label: 'Inventory', sub: 'Skills' },
  { id: 'quests', label: 'Quests', sub: 'Projects' },
  { id: 'chronicle', label: 'Chronicle', sub: 'Experience' },
  { id: 'contact', label: 'Contact', sub: 'Get in touch' },
  { id: 'save', label: 'Save', sub: 'Download CV' },
  { id: 'options', label: 'Options', sub: 'Colors & sound' },
  { id: 'quit', label: 'Quit', sub: 'Title screen' },
];

// Pages that award XP the first time they are opened (q0..q2 are the three quests).
export const XP_KEYS = ['status', 'inventory', 'q0', 'q1', 'q2', 'chronicle', 'contact'];

export const CATS = [
  { id: 'fe', name: 'Frontend', short: 'Front', kind: 'Crystal', icon: 'gem', level: 8 },
  { id: 'be', name: 'Backend', short: 'Back', kind: 'Blade', icon: 'sword', level: 8 },
  { id: 'db', name: 'Databases', short: 'Data', kind: 'Chest', icon: 'chest', level: 7 },
  { id: 'core', name: 'Core', short: 'Core', kind: 'Tome', icon: 'book', level: 7 },
  { id: 'ops', name: 'DevOps', short: 'DevOps', kind: 'Potion', icon: 'potion', level: 6 },
  { id: 'test', name: 'Testing & Tools', short: 'Tools', kind: 'Shield', icon: 'shield', level: 7 },
];

// [id, category, short name, full name, indexes of QUESTS it was used in]
export const ITEMS = [
  ['ts', 'fe', 'TypeScript', 'TypeScript', [0]],
  ['js', 'fe', 'JavaScript', 'JavaScript (ES6)', []],
  ['html', 'fe', 'HTML5', 'HTML5', []],
  ['css', 'fe', 'CSS3', 'CSS3', []],
  ['react', 'fe', 'React', 'React', [0, 1]],
  ['next', 'fe', 'Next.js', 'Next.js', [0]],
  ['rwd', 'fe', 'Responsive', 'Responsive Design', []],
  ['node', 'be', 'Node.js', 'Node.js', [1, 2]],
  ['express', 'be', 'Express', 'Express.js', [1, 2]],
  ['rest', 'be', 'REST APIs', 'REST API Design', [1]],
  ['jwt', 'be', 'JWT Auth', 'JWT Authentication', [1]],
  ['mw', 'be', 'Middleware', 'Middleware', []],
  ['pg', 'db', 'PostgreSQL', 'PostgreSQL', [0]],
  ['drizzle', 'db', 'Drizzle', 'Drizzle ORM', [0]],
  ['mongo', 'db', 'MongoDB', 'MongoDB (Mongoose)', [1, 2]],
  ['dbms', 'db', 'DBMS', 'Database Management Systems', []],
  ['cpp', 'core', 'C++', 'C++', []],
  ['java', 'core', 'Java', 'Java', []],
  ['dsa', 'core', 'DSA', 'Data Structures & Algorithms', []],
  ['docker', 'ops', 'Docker', 'Docker', [0, 1]],
  ['k8s', 'ops', 'Kubernetes', 'Kubernetes', []],
  ['gha', 'ops', 'CI/CD', 'GitHub Actions CI/CD', [0, 1]],
  ['vitest', 'test', 'Vitest', 'Vitest', [1]],
  ['supertest', 'test', 'Supertest', 'Supertest', [1]],
  ['git', 'test', 'Git', 'Git & GitHub', [0, 1, 2]],
].map(([id, cat, short, full, uses]) => ({ id, cat, short, full, uses }));

export const QUESTS = [
  {
    title: 'Cliniqo',
    sub: 'Clinic Management Platform',
    repo: 'github.com/Nameless770/Cliniqo',
    url: 'https://github.com/Nameless770/Cliniqo',
    rarity: 'Legendary',
    stars: 5,
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'PostgreSQL 17', 'Drizzle ORM', 'Zod', 'Docker'],
    bullets: [
      'Built a HIPAA-oriented clinic management app covering appointments, patient records, clinical notes, prescriptions, billing, and a patient portal, with separate staff and patient sign-in (password with lockout, Google OAuth, optional TOTP two-factor).',
      'Designed PHI-safe data access: every read and write of a patient record is audited in the same transaction, clinical data is never hard-deleted, amendments preserve prior versions, and every server action re-checks permissions server-side.',
      'Implemented appointment scheduling with double-booking protection and a break-glass emergency access path that is logged and flagged for review.',
      'Built a symptom-triage assistant where a deterministic emergency check always runs first, with pluggable engines (local rules, local LLM via Ollama, or OpenAI) and post-generation filtering that discards any reply naming a medicine, dose, or diagnosis.',
      'Set up a four-layer verification suite: structural security-invariant checks, integration tests against a real PostgreSQL database, end-to-end journeys run with JavaScript disabled, and an automated permission-matrix check, wired into GitHub Actions CI.',
    ],
  },
  {
    title: 'Nova Marketplace',
    sub: 'Multi-Vendor E-Commerce Platform',
    repo: 'github.com/Nameless770/Nova-Marketplace',
    url: 'https://github.com/Nameless770/Nova-Marketplace',
    rarity: 'Epic',
    stars: 4,
    stack: ['React 19', 'Node.js/Express 5', 'MongoDB (Mongoose)', 'JWT', 'Anthropic/OpenAI SDK'],
    bullets: [
      'Built a full-stack, three-role (customer/seller/admin) marketplace as a modular monolith — React SPA + Express API over a MongoDB replica set — with 90+ REST endpoints across 18 route modules.',
      'Engineered concurrency-safe money and inventory logic: integer minor-unit pricing, prices re-verified at capture, and atomic conditional MongoDB updates that make overselling or over-refunding structurally impossible.',
      'Enforced server-side multi-tenant security and hardened JWT auth (pinned algorithm, issuer/audience checks, short-lived tokens, brute-force lockout) plus an append-only audit log on privileged mutations.',
      'Architected an AI shopping assistant and admin analytics tool with a "model selects, database renders" grounding contract, using schema-constrained outputs and post-generation fact re-verification to eliminate hallucinated prices or stock data.',
      'Delivered production-readiness tooling: 224 automated tests (Vitest/Supertest) including cross-tenant attack tests, structured logging and Prometheus metrics, and a GitHub Actions CI/CD pipeline with Docker image publishing.',
    ],
  },
  {
    title: 'BuzzMind',
    sub: 'Full-Stack Web Platform',
    repo: 'github.com/Nameless770/BuzzMind',
    url: 'https://github.com/Nameless770/BuzzMind',
    rarity: 'Rare',
    stars: 3,
    intro: 'Built BuzzMind — a full-stack web platform for instructors and students to create and run live quizzes, manage assignments, and track results with real-time chat and leaderboards.',
    stack: ['Node.js', 'Express', 'MongoDB', 'Real-time chat', 'Leaderboards'],
    bullets: [
      'Designed a full-stack architecture connecting a dynamic front-end to a Node.js/Express back-end with a MongoDB database',
      'Implemented live quiz sessions with real-time updates so instructors can run quizzes interactively in class',
      'Built real-time chat functionality to support communication between instructors and students during sessions',
      'Developed a leaderboard system to track and display student rankings and quiz performance',
      'Created assignment management features allowing instructors to post, track, and review student submissions',
    ],
  },
];

export const CHRONICLE = [
  { kicker: 'Academy · Education', title: 'Bachelor of Computer Science', org: 'MIU International University', meta: '2024 – Present · Cairo, Egypt', note: '', icon: 'book' },
  { kicker: 'Guild contract · Experience', title: 'Software Development Intern', org: 'El-Zatuna', meta: '1 Month', note: 'Gained hands-on experience contributing to real-world software development tasks within a professional team environment.', icon: 'scroll' },
  { kicker: 'Guild contract · Experience', title: 'Intern', org: 'CIB (Commercial International Bank)', meta: '1 Month', note: 'Completed a one-month internship exposure to enterprise workflows and technology practices within the banking sector.', icon: 'scroll' },
  { kicker: 'Order · Volunteering', title: 'Co-Head, Software Development', org: 'MSP Tech Club, MIU', meta: '', note: 'Contributed to software development initiatives as part of the MSP Tech Club at MIU.', icon: 'shield' },
];

export const CONTACTS = [
  { label: 'Email', value: 'mahmoud1412007@gmail.com', href: 'mailto:mahmoud1412007@gmail.com', badge: '@' },
  { label: 'LinkedIn', value: 'linkedin.com/in/mahmoud-khaled-793892347', href: 'https://linkedin.com/in/mahmoud-khaled-793892347', badge: 'in' },
  { label: 'GitHub', value: 'github.com/Nameless770', href: 'https://github.com/Nameless770', badge: '</>' },
  { label: 'Phone', value: '01021258579', href: 'tel:+201021258579', badge: '#' },
];

export const ACHIEVEMENTS = [
  { id: 'first', name: 'First steps', desc: 'Earn your first XP' },
  { id: 'collector', name: 'Collector', desc: 'Inspect 5 inventory items' },
  { id: 'quests', name: 'Quest reader', desc: 'Read all three quests' },
  { id: 'raven', name: 'Raven sent', desc: 'Open a contact link' },
  { id: 'loot', name: 'Loot acquired', desc: 'Download the CV' },
  { id: 'complete', name: 'Completionist', desc: 'Reach 700 XP' },
  { id: 'secret', name: '???', desc: 'Hidden. Finish everything, then listen to Byte.' },
];

// What Byte the owl says on each page.
export const LINES = {
  start: "Welcome, traveller. I'm Byte, keeper of this realm's records. Use ↑ ↓ or click the menu to explore Mahmoud's story. Each new page is worth XP.",
  status: 'The status screen. Mahmoud is a Computer Science student at MIU in Cairo who builds full-stack apps from the ground up.',
  inventory: 'His inventory: 25 items in six classes. Click an item to see which quests it was used in.',
  quests: 'The quest log holds three completed quests. Pick one on the left to read it.',
  q0: 'Cliniqo is the legendary one: audited patient records, two-factor sign-in and a four-layer test suite.',
  q1: 'Nova Marketplace: 90+ endpoints, 224 automated tests, and money logic that makes overselling impossible.',
  q2: 'BuzzMind runs live quizzes in class, with real-time chat and leaderboards.',
  chronicle: 'The chronicle: his academy, two guild contracts and his post at the MSP Tech Club.',
  contact: 'Want Mahmoud in your party? Choose a way to send word.',
  save: 'Slot 1 holds the full CV as a PDF. Slot 2 opens a plain version with no game.',
  options: 'Four realms to choose from. Some say a fifth is hidden.',
  optionsSecret: 'The Arcane realm is yours now. Wear it well.',
  quit: 'Leaving already? Your progress stays until you close the page.',
  realm: 'Realm changed. The world shifts around you.',
  locked: "That realm is sealed. See every page first, then I'll tell you the way in.",
  nowPlaying: 'Now playing: {title}, by {composer}.',
  done: "You've seen everything. An old code still works here: ↑ ↑ ↓ ↓ ← → ← → B A",
  secret: 'Cheat code accepted. Not many travellers find that one.',
};

export const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
export const SECRET_LEVEL = 3; // the level the secret code sets

// Starting settings.
export const DEFAULTS = {
  realm: 'moon', // moon | elder | ember | royal
  scanlines: false,
  startScene: 'title', // title | game | plain
  music: true, // classical music; starts with New Game (browsers only allow audio after a click/keypress). N or the HUD button toggles it
  sound: true, // sound effects; press M or use the HUD button to turn them off
  voice: true, // Byte "talks" in blips while his text types out (only when sound is on)
  guide: true,
};
