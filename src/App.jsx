import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   THE ARCADE — Max's Retro Pixel Game Hub
   A complete personal website disguised as an 8-bit console.
   Single-file React artifact. Deploy to Vercel as-is.
   ═══════════════════════════════════════════════════════════════ */

// ─── CUSTOM HOOKS ───────────────────────────────────────────────

const useKonamiCode = (callback) => {
  const seq = [
    "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
    "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a",
  ];
  const inputRef = useRef([]);
  const cb = useRef(callback);
  cb.current = callback;
  useEffect(() => {
    const handler = (e) => {
      inputRef.current = [...inputRef.current, e.key].slice(-seq.length);
      if (inputRef.current.join(",") === seq.join(",")) {
        cb.current();
        inputRef.current = [];
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
};

const useIdleTimer = (timeout, onIdle, onActive) => {
  const timer = useRef(null);
  const idleCb = useRef(onIdle);
  const activeCb = useRef(onActive);
  idleCb.current = onIdle;
  activeCb.current = onActive;
  useEffect(() => {
    const reset = () => {
      if (timer.current) clearTimeout(timer.current);
      activeCb.current?.();
      timer.current = setTimeout(() => idleCb.current?.(), timeout);
    };
    const evts = ["mousemove","mousedown","keydown","scroll","touchstart"];
    evts.forEach((e) => window.addEventListener(e, reset));
    timer.current = setTimeout(() => idleCb.current?.(), timeout);
    return () => {
      evts.forEach((e) => window.removeEventListener(e, reset));
      if (timer.current) clearTimeout(timer.current);
    };
  }, [timeout]);
};

const useGlitchText = (original, triggerCount = 7) => {
  const [clicks, setClicks] = useState(0);
  const [display, setDisplay] = useState(original);
  const glitch = "!@#$%^&*█▓▒░╔╗╚╝";
  const handleClick = () => {
    const n = clicks + 1;
    setClicks(n);
    if (n % triggerCount === 0) {
      const iv = setInterval(() => {
        setDisplay(
          original.split("").map((c) =>
            Math.random() > 0.4 ? glitch[Math.floor(Math.random() * glitch.length)] : c
          ).join("")
        );
      }, 50);
      setTimeout(() => { clearInterval(iv); setDisplay(original); }, 500);
    }
  };
  return [display, handleClick, clicks];
};

// ─── DATA ───────────────────────────────────────────────────────

const STATS = [
  { label:"STR", value:8, max:10, flavour:"Can carry 4 monitors to a LAN party", color:"#E63946" },
  { label:"DEX", value:6, max:10, flavour:"Decent mouse aim, questionable dance moves", color:"#F77F00" },
  { label:"INT", value:9, max:10, flavour:"Reads documentation (sometimes)", color:"#48BFE3" },
  { label:"WIS", value:7, max:10, flavour:"Knows when to git stash", color:"#7B2D8E" },
  { label:"CHA", value:6, max:10, flavour:"Can do a mass-comm presentation", color:"#FF6B9D" },
  { label:"COD", value:9, max:10, flavour:"The real stat that matters", color:"#3450A1" },
  { label:"CKR", value:10, max:10, flavour:"Chicken Rice Opinions: LEGENDARY", color:"#FFD23F" },
];

const EQUIPMENT = [
  { slot:"WEAPON", item:"Mechanical Keyboard", bonus:"+3 WPM, +5 Satisfaction" },
  { slot:"ARMOUR", item:"Noise-Cancelling Headphones", bonus:"+10 Focus" },
  { slot:"ACCESSORY", item:"Third Monitor", bonus:"+2 Productivity, -3 Desk Space" },
  { slot:"MOUNT", item:"Herman Miller Aeron", bonus:"Legendary" },
];

const SKILLS = [
  { name:"HTML/CSS", level:"MAX", unlocked:true },
  { name:"JavaScript", level:"8", unlocked:true },
  { name:"React", level:"7", unlocked:true },
  { name:"Rust", level:"1", unlocked:false, note:"just started the tutorial" },
  { name:"Figma", level:"6", unlocked:true },
  { name:"Chicken Rice Criticism", level:"MAX — PRESTIGE", unlocked:true },
];

const PROJECTS = [
  { world:"1-1", name:"Project Pixel Fortress", difficulty:4, status:"CLEARED", boss:"Scope Creep", tech:["React","Node","Figma"], desc:"A design system that survived three redesigns and an executive pivot. Built with pixelated precision and shipped under budget." },
  { world:"1-2", name:"Operation Midnight Deploy", difficulty:5, status:"CLEARED", boss:"Production Database", tech:["TypeScript","AWS","Docker"], desc:"Friday night deploy gone right. Zero downtime migration of 2M records. The on-call Slack channel fell silent — the good kind of silent." },
  { world:"2-1", name:"The Dashboard Dungeon", difficulty:3, status:"CLEARED", boss:"CSS Grid", tech:["Next.js","D3","Tailwind"], desc:"An analytics dashboard so clean it made the PM cry. Real-time data, zero jank, dark mode that actually looks good." },
  { world:"2-2", name:"Quest for the Perfect API", difficulty:4, status:"IN PROGRESS", boss:"Rate Limiting", tech:["Go","PostgreSQL","Redis"], desc:"RESTful? GraphQL? Why not both? Building the API that developers actually want to use. Documentation included (revolutionary)." },
  { world:"3-1", name:"Chicken Rice Index", difficulty:2, status:"CLEARED", boss:"Opinions", tech:["Python","GPT","Maps API"], desc:"A data-driven ranking of Singapore's best chicken rice. Controversial? Yes. Accurate? Obviously. Fight me in the issues." },
  { world:"BONUS", name:"The Arcade", difficulty:5, status:"IN PROGRESS", boss:"Infinite Scope", tech:["React","Pixels","Caffeine"], desc:"You're looking at it. A website that thinks it's a game. Or a game that thinks it's a website. Who's to say?" },
];

const QUESTS = [
  { day:47, title:"The Great Refactoring", tags:["🗡️ JS","🧪 React"], status:"COMPLETE", body:"Rewrote 3,000 lines of legacy jQuery into modern React hooks. No tests were harmed. (Because there were none to begin with.)" },
  { day:82, title:"The CSS Wars", tags:["🛡️ CSS","📜 Tutorial"], status:"COMPLETE", body:"Discovered that `z-index: 9999` wasn't enough. Went to 99999. Then learned about stacking contexts. Dark times." },
  { day:114, title:"The Authentication Saga", tags:["🗡️ JS","🧪 React"], status:"ACTIVE", body:"OAuth, JWT, sessions, cookies — tried them all. Currently on attempt #4. The login page now has more code than the rest of the app." },
  { day:156, title:"Operation Chicken Rice Review", tags:["📜 Tutorial"], status:"COMPLETE", body:"Published the definitive chicken rice ranking. Received 47 angry emails. Worth it. The roasted > steamed take remains undefeated." },
];

const COSTUMES = [
  { name:"DEFAULT", emoji:"👤", color:"#3450A1" },
  { name:"WIZARD", emoji:"🧙", color:"#7B2D8E" },
  { name:"SUNGLASSES", emoji:"😎", color:"#FFD23F" },
  { name:"CAT EARS", emoji:"😺", color:"#FF6B9D" },
  { name:"ASTRONAUT", emoji:"👨‍🚀", color:"#48BFE3" },
  { name:"NINJA", emoji:"🥷", color:"#1A1A2E" },
];

const CARTRIDGES = [
  { id:"about", title:"ABOUT QUEST", genre:"RPG", emoji:"⚔️", color:"#2DC653", stars:4, year:"v1.0" },
  { id:"projects", title:"PROJECT HUNTER", genre:"ACTION", emoji:"🎯", color:"#E63946", stars:5, year:"v2.1" },
  { id:"quests", title:"QUEST LOG", genre:"ADVENTURE", emoji:"📜", color:"#7B2D8E", stars:3, year:"v1.3" },
  { id:"contact", title:"MULTIPLAYER LOBBY", genre:"MULTIPLAYER", emoji:"🌐", color:"#48BFE3", stars:4, year:"v1.0" },
  { id:"snake", title:"SNAKE ARCADE", genre:"PUZZLE", emoji:"🐍", color:"#F77F00", stars:5, year:"v1.0" },
];

const ACHIEVEMENT_DEFS = {
  FIRST_BOOT:   { icon:"🎮", title:"FIRST BOOT", desc:"Booted up The Arcade" },
  EXPLORER:     { icon:"🗺️", title:"EXPLORER", desc:"Visited every page" },
  GAMER:        { icon:"🐍", title:"GAMER", desc:"Played the mini-game" },
  CHAMPION:     { icon:"🏆", title:"CHAMPION", desc:"Scored 100+ in Snake" },
  SECRET_AGENT: { icon:"↑↓", title:"SECRET AGENT", desc:"Entered the Konami code" },
  FASHIONISTA:  { icon:"👔", title:"FASHIONISTA", desc:"Unlocked all costumes" },
  HACKER:       { icon:"🔧", title:"HACKER", desc:"Opened the debug console" },
  CHICKEN_RICE: { icon:"🍗", title:"CHICKEN RICE", desc:"Maximum chicken rice opinions" },
  COMPLETIONIST:{ icon:"💯", title:"COMPLETIONIST", desc:"Earned all achievements" },
};

const NAV_PAGES = [
  { id:"home", label:"HOME" },
  { id:"about", label:"ABOUT" },
  { id:"projects", label:"PROJECTS" },
  { id:"quests", label:"QUESTS" },
  { id:"contact", label:"CONTACT" },
  { id:"snake", label:"SNAKE" },
];

// ─── SUB-COMPONENTS ─────────────────────────────────────────────

const CRTOverlay = () => (
  <>
    <div className="crt-scanlines" />
    <div className="crt-vignette" />
  </>
);

const Starfield = () => (
  <div className="starfield">
    <div className="stars-sm" />
    <div className="stars-md" />
    <div className="stars-lg" />
  </div>
);

const FloatingNumber = ({ id, text, x, y, color }) => {
  const [opacity, setOpacity] = useState(1);
  const [offY, setOffY] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => {
      setOpacity((p) => Math.max(0, p - 0.04));
      setOffY((p) => p - 2);
    }, 30);
    return () => clearInterval(iv);
  }, []);
  if (opacity <= 0) return null;
  return (
    <div style={{
      position:"fixed", left:x, top:y, transform:`translateY(${offY}px)`,
      opacity, fontFamily:"'Press Start 2P',monospace", fontSize:"12px",
      color: color || "#FFD23F", pointerEvents:"none",
      textShadow:"2px 2px 0 #0A0A15", zIndex:10002,
    }}>{text}</div>
  );
};

const AchievementToast = ({ achievement, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="achievement-toast">
      <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:"7px", color:"#FFD23F", letterSpacing:"2px", marginBottom:6 }}>
        ★ ACHIEVEMENT UNLOCKED ★
      </div>
      <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:"9px", color:"#E8E8E8", marginBottom:4 }}>
        {achievement.icon} {achievement.title}
      </div>
      <div style={{ fontFamily:"'VT323',monospace", fontSize:"16px", color:"#8B8B8B" }}>
        {achievement.desc}
      </div>
    </div>
  );
};

const ScreenWipe = ({ active, onComplete }) => {
  useEffect(() => {
    if (active) { const t = setTimeout(onComplete, 500); return () => clearTimeout(t); }
  }, [active, onComplete]);
  if (!active) return null;
  return (
    <div className="screen-wipe">
      <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:"14px", color:"#FFD23F" }}>
        LOADING...
      </span>
    </div>
  );
};

const DialogueBox = ({ speaker, text, portrait }) => {
  const [displayText, setDisplayText] = useState("");
  const [complete, setComplete] = useState(false);
  useEffect(() => {
    let i = 0; setDisplayText(""); setComplete(false);
    const iv = setInterval(() => {
      if (i < text.length) { setDisplayText(text.slice(0, i + 1)); i++; }
      else { setComplete(true); clearInterval(iv); }
    }, 30);
    return () => clearInterval(iv);
  }, [text]);
  return (
    <div className="dialogue-box">
      <div className="dialogue-inner-border" />
      {portrait && <div className="dialogue-portrait">{portrait}</div>}
      <div style={{ flex:1 }}>
        {speaker && <div className="dialogue-speaker">{speaker}</div>}
        <div className="dialogue-text">
          {displayText}
          {complete && <span className="blink" style={{ color:"#FFD23F" }}> ▼</span>}
        </div>
      </div>
    </div>
  );
};

const StatBar = ({ label, value, max, color, flavour, onClick, delay }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), delay || 100); return () => clearTimeout(t); }, [delay]);
  const filled = "█".repeat(value);
  const empty = "░".repeat(max - value);
  return (
    <div className="stat-row" style={{
      opacity: mounted ? 1 : 0, transform: mounted ? "translateX(0)" : "translateX(-20px)",
      transition: `all 0.4s ease-out ${(delay || 0)}ms`,
    }} title={flavour}>
      <span className="stat-label" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>{label}</span>
      <span className="stat-bar" style={{ color: color || "#2DC653" }}>{filled}{empty}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
};

const CartridgeCard = ({ title, genre, year, stars, color, emoji, onClick, isHighlighted, isSecret }) => (
  <div className={`cartridge-card ${isHighlighted ? "cartridge-highlighted" : ""} ${isSecret ? "cartridge-secret" : ""}`} onClick={onClick}>
    <div className="cartridge-art" style={{ background: color }}>
      <span style={{ fontSize:40 }}>{emoji}</span>
      <span className="cartridge-genre">{genre}</span>
    </div>
    <div className="cartridge-info">
      <h3 className="cartridge-title">{title}</h3>
      <div className="cartridge-meta">
        <span className="cartridge-year">{year}</span>
        <span className="cartridge-stars">{"★".repeat(stars)}{"☆".repeat(5 - stars)}</span>
      </div>
    </div>
  </div>
);

const ConsoleBar = ({ score, lives, heartClicks, onHeartClick }) => {
  const dayNum = Math.floor((Date.now() - new Date("2024-01-01")) / 86400000);
  return (
    <div className="console-bar">
      <span>PLAYER 1 <span className="blink-fast">_</span></span>
      <span style={{ color:"#E63946", cursor:"pointer" }} onClick={onHeartClick}>
        {"♥".repeat(lives)}{"♡".repeat(3 - lives)}
      </span>
      <span style={{ color:"#FFD23F" }}>SCORE: {String(score).padStart(6, "0")}</span>
      <span className="console-bar-day">DAY {dayNum} OF THE ADVENTURE</span>
    </div>
  );
};

const NavDPad = ({ currentPage, onNavigate }) => (
  <nav className="nav-dpad">
    {NAV_PAGES.map((p) => (
      <button key={p.id} className={`nav-btn ${currentPage === p.id ? "nav-active" : ""}`}
        onClick={() => onNavigate(p.id)}>{p.label}</button>
    ))}
  </nav>
);

const WarpPipe = ({ onClick }) => (
  <div className="warp-pipe" onClick={onClick} title="?">
    <div className="warp-pipe-cap" />
  </div>
);

// ─── PAGES ──────────────────────────────────────────────────────

const HomePage = ({ onSelect, attractMode, highlightIdx, secretUnlocked, onTitleClick, titleDisplay, addScore }) => (
  <div className="page-home">
    <h1 className={`arcade-title ${attractMode ? "rainbow-cycle" : ""}`} onClick={onTitleClick}>
      {titleDisplay}
    </h1>
    <p className={`insert-coin blink ${attractMode ? "blink-fast" : ""}`}>INSERT COIN TO BEGIN</p>
    <div className="cartridge-grid">
      {CARTRIDGES.map((c, i) => (
        <CartridgeCard key={c.id} {...c} isHighlighted={attractMode && highlightIdx === i}
          onClick={() => { addScore(15); onSelect(c.id); }} />
      ))}
      {secretUnlocked && (
        <CartridgeCard title="SECRET LEVEL" genre="???" year="v?.?" stars={5}
          color="#1A1A2E" emoji="🔮" isSecret onClick={() => onSelect("secret")} />
      )}
    </div>
    {attractMode && (
      <div style={{ marginTop:24 }}>
        <DialogueBox speaker="THE ARCADE" portrait="🕹️"
          text="FEATURING: MAX'S PROJECTS / LEGENDARY CHICKEN RICE OPINIONS / 1 PLAYABLE GAME / HIDDEN EASTER EGGS" />
      </div>
    )}
  </div>
);

const AboutPage = ({ addScore, unlockAchievement, costumeIndex, setCostumeIndex, avatarClicks, setAvatarClicks, ckrClicks, setCkrClicks }) => {
  const [showFlash, setShowFlash] = useState(false);
  const [showChicken, setShowChicken] = useState(false);
  const [costumeBanner, setCostumeBanner] = useState("");
  const costume = COSTUMES[costumeIndex];

  const handleAvatarClick = () => {
    const n = avatarClicks + 1;
    setAvatarClicks(n);
    addScore(1);
    if (n % 10 === 0) {
      const next = (costumeIndex + 1) % COSTUMES.length;
      setCostumeIndex(next);
      setShowFlash(true);
      addScore(50);
      setCostumeBanner(`COSTUME UNLOCKED: ${COSTUMES[next].name}`);
      setTimeout(() => { setShowFlash(false); setCostumeBanner(""); }, 1500);
      if (next === COSTUMES.length - 1) unlockAchievement("FASHIONISTA");
    }
  };

  const handleCkrClick = () => {
    const n = ckrClicks + 1;
    setCkrClicks(n);
    if (n >= 5 && !showChicken) {
      setShowChicken(true);
      addScore(100);
      unlockAchievement("CHICKEN_RICE");
      setTimeout(() => setShowChicken(false), 3000);
    }
  };

  return (
    <div className="page-about">
      {showChicken && (
        <div className="chicken-rice-overlay">
          <div className="chicken-rice-text">🍗 CHICKEN RICE OPINIONS: MAXIMUM 🍗</div>
          <div className="chicken-rice-sub">THIS IS THE WAY.</div>
        </div>
      )}
      <h2 className="page-heading" style={{ color:"#2DC653" }}>CHARACTER STAT SHEET</h2>
      <div className="about-grid">
        <div className="about-left">
          <div className="avatar-area" onClick={handleAvatarClick}
            style={{ borderColor: costume.color, position:"relative" }}>
            {showFlash && <div className="avatar-flash" />}
            <span style={{ fontSize:64, imageRendering:"pixelated" }}>{costume.emoji}</span>
          </div>
          {costumeBanner && <div className="costume-banner">{costumeBanner}</div>}
          <div className="char-info">
            <div className="char-line"><span className="char-key">NAME:</span> MAX</div>
            <div className="char-line"><span className="char-key">CLASS:</span> Developer / Creator / Gamer</div>
            <div className="char-line"><span className="char-key">LEVEL:</span> 28</div>
          </div>
          <div className="hp-bars">
            <div className="hp-row"><span className="char-key">HP:</span> <div className="bar-track"><div className="bar-fill bar-hp" style={{ width:"80%" }} /></div><span className="bar-num">80/100</span></div>
            <div className="hp-row"><span className="char-key">MP:</span> <div className="bar-track"><div className="bar-fill bar-mp" style={{ width:"100%" }} /></div><span className="bar-num">100/100</span></div>
            <div className="hp-row"><span className="char-key">XP:</span> <div className="bar-track"><div className="bar-fill bar-xp" style={{ width:"78%" }} /></div><span className="bar-num">7,832/10,000</span></div>
          </div>
        </div>
        <div className="about-right">
          <div className="stat-block" style={{ borderColor: costume.color }}>
            <h3 className="section-label">⚔️ STATS</h3>
            {STATS.map((s, i) => (
              <StatBar key={s.label} {...s} delay={i * 80}
                onClick={s.label === "CKR" ? handleCkrClick : undefined} />
            ))}
          </div>
          <div className="equip-block">
            <h3 className="section-label">🎒 EQUIPMENT</h3>
            {EQUIPMENT.map((e) => (
              <div key={e.slot} className="equip-row">
                <span className="equip-slot">{e.slot}:</span>
                <span className="equip-item">{e.item}</span>
                <span className="equip-bonus">({e.bonus})</span>
              </div>
            ))}
          </div>
          <div className="skill-block">
            <h3 className="section-label">🌳 SKILL TREE</h3>
            <div className="skill-grid">
              {SKILLS.map((s) => (
                <div key={s.name} className={`skill-node ${s.unlocked ? "skill-unlocked" : "skill-locked"}`}>
                  <span>{s.unlocked ? "✅" : "🔒"}</span>
                  <span className="skill-name">{s.name}</span>
                  <span className="skill-level">Lv. {s.level}</span>
                  {s.note && <span className="skill-note">({s.note})</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectsPage = ({ addScore, navigateTo }) => {
  const [expanded, setExpanded] = useState(null);
  return (
    <div className="page-projects" style={{ position:"relative" }}>
      <h2 className="page-heading" style={{ color:"#E63946" }}>LEVEL SELECT</h2>
      <div className="project-list">
        {PROJECTS.map((p, i) => (
          <div key={p.world} className="project-node" onClick={() => setExpanded(expanded === i ? null : i)}>
            <div className="project-header">
              <span className="project-world">WORLD {p.world}</span>
              <span className="project-name">{p.name}</span>
              <span className="project-difficulty">{"⭐".repeat(p.difficulty)}{"☆".repeat(5 - p.difficulty)}</span>
              <span className={`project-status ${p.status === "CLEARED" ? "status-cleared" : "status-progress"}`}>
                {p.status === "CLEARED" ? "CLEARED ✓" : "IN PROGRESS..."}
              </span>
            </div>
            <div className="project-sub">
              <span className="project-boss">Boss: {p.boss}</span>
              <span className="project-tech">{p.tech.map((t) => <span key={t} className="tech-badge">{t}</span>)}</span>
            </div>
            {expanded === i && (
              <div style={{ marginTop:12 }}>
                <DialogueBox speaker={`WORLD ${p.world}`} portrait="📋" text={p.desc} />
              </div>
            )}
          </div>
        ))}
      </div>
      <WarpPipe onClick={() => { addScore(200); navigateTo("about"); }} />
    </div>
  );
};

const QuestsPage = () => (
  <div className="page-quests">
    <h2 className="page-heading" style={{ color:"#7B2D8E" }}>QUEST LOG</h2>
    <div className="quest-journal">
      {QUESTS.map((q, i) => (
        <div key={i} className="quest-entry">
          <div className="quest-header">
            <span className="quest-day">Day {q.day}</span>
            <span className="quest-title">{q.title}</span>
            <span className={`quest-status ${q.status === "COMPLETE" ? "qs-complete" : "qs-active"}`}>
              {q.status === "COMPLETE" ? "QUEST COMPLETE" : "QUEST ACTIVE"}
            </span>
          </div>
          <div className="quest-tags">{q.tags.map((t) => <span key={t} className="quest-tag">{t}</span>)}</div>
          <DialogueBox text={q.body} />
        </div>
      ))}
    </div>
  </div>
);

const ContactPage = ({ addScore }) => {
  const [sent, setSent] = useState(false);
  const [online, setOnline] = useState(5);
  useEffect(() => {
    const iv = setInterval(() => setOnline(Math.floor(Math.random() * 5) + 3), 4000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="page-contact">
      <h2 className="page-heading" style={{ color:"#48BFE3" }}>MULTIPLAYER LOBBY</h2>
      <div className="lobby-status">
        <span>PLAYERS ONLINE: <strong style={{ color:"#2DC653" }}>{online}</strong></span>
        <span>SIGNAL: <span style={{ color:"#2DC653" }}>████</span> STRONG</span>
      </div>
      <div className="contact-panel">
        <h3 className="section-label">PLAYER 2 HAS ENTERED THE LOBBY</h3>
        {sent ? (
          <div className="sent-confirm">
            <div style={{ fontSize:48, marginBottom:16 }}>📨</div>
            <div className="sent-text">QUEST DISPATCHED!</div>
            <div className="sent-sub">Max will respond at the speed of a loading screen.</div>
          </div>
        ) : (
          <div className="contact-form">
            <label className="form-label">PLAYER NAME:</label>
            <input className="form-input" type="text" placeholder="Enter your name..." />
            <label className="form-label">CLASS:</label>
            <select className="form-input">
              <option>Recruiter</option><option>Collaborator</option>
              <option>Fellow Gamer</option><option>Secret Agent</option>
            </select>
            <label className="form-label">MESSAGE SCROLL:</label>
            <textarea className="form-input form-textarea" placeholder="Write your quest..." rows={4} />
            <button className="send-btn" onClick={() => { setSent(true); addScore(100); }}>
              ⚔️ SEND QUEST
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const SnakePage = ({ addScore, unlockAchievement }) => {
  const GRID = 16;
  const CELL = 15;
  const [snake, setSnake] = useState([{ x:8, y:8 }]);
  const [food, setFood] = useState({ x:4, y:4 });
  const [dir, setDir] = useState({ x:1, y:0 });
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [snakeScore, setSnakeScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const dirRef = useRef({ x:1, y:0 });
  const gameRef = useRef(null);
  const achievedGamer = useRef(false);

  const spawnFood = useCallback((snk) => {
    let pos;
    do { pos = { x:Math.floor(Math.random()*GRID), y:Math.floor(Math.random()*GRID) }; }
    while (snk.some((s) => s.x === pos.x && s.y === pos.y));
    return pos;
  }, []);

  const startGame = () => {
    const s = [{ x:8, y:8 }];
    setSnake(s); setFood(spawnFood(s)); setDir({ x:1, y:0 });
    dirRef.current = { x:1, y:0 };
    setGameOver(false); setStarted(true); setSnakeScore(0);
    if (!achievedGamer.current) { addScore(50); unlockAchievement("GAMER"); achievedGamer.current = true; }
  };

  useEffect(() => {
    const handler = (e) => {
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault();
      const d = dirRef.current;
      if (e.key === "ArrowUp" && d.y !== 1) dirRef.current = { x:0, y:-1 };
      if (e.key === "ArrowDown" && d.y !== -1) dirRef.current = { x:0, y:1 };
      if (e.key === "ArrowLeft" && d.x !== 1) dirRef.current = { x:-1, y:0 };
      if (e.key === "ArrowRight" && d.x !== -1) dirRef.current = { x:1, y:0 };
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;
    gameRef.current = setInterval(() => {
      setSnake((prev) => {
        const d = dirRef.current;
        const head = { x: prev[0].x + d.x, y: prev[0].y + d.y };
        if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID ||
            prev.some((s) => s.x === head.x && s.y === head.y)) {
          setGameOver(true); clearInterval(gameRef.current);
          return prev;
        }
        const next = [head, ...prev];
        setFood((f) => {
          if (head.x === f.x && head.y === f.y) {
            setSnakeScore((sc) => {
              const ns = sc + 10;
              if (ns >= 100) { addScore(500); unlockAchievement("CHAMPION"); }
              return ns;
            });
            return spawnFood(next);
          }
          next.pop();
          return f;
        });
        return next;
      });
    }, 150);
    return () => clearInterval(gameRef.current);
  }, [started, gameOver, addScore, unlockAchievement, spawnFood]);

  useEffect(() => { if (gameOver && snakeScore > highScore) setHighScore(snakeScore); }, [gameOver, snakeScore, highScore]);

  return (
    <div className="page-snake">
      <h2 className="page-heading" style={{ color:"#F77F00" }}>SNAKE ARCADE</h2>
      <div className="snake-hud">
        <span>SCORE: {String(snakeScore).padStart(4, "0")}</span>
        <span>HI-SCORE: {String(highScore).padStart(4, "0")}</span>
      </div>
      <div className="snake-board" style={{ width:GRID*CELL, height:GRID*CELL }}>
        {Array.from({ length: GRID * GRID }).map((_, i) => {
          const x = i % GRID, y = Math.floor(i / GRID);
          const isSnake = snake.some((s) => s.x === x && s.y === y);
          const isHead = snake[0]?.x === x && snake[0]?.y === y;
          const isFood = food.x === x && food.y === y;
          return (
            <div key={i} style={{
              width:CELL, height:CELL, position:"absolute",
              left:x*CELL, top:y*CELL,
              background: isHead ? "#4ADE80" : isSnake ? "#2DC653" : isFood ? "#E63946" : "transparent",
              border: isSnake || isFood ? "1px solid #0F0F1B" : "none",
              borderRadius: isFood ? "50%" : 0,
              boxShadow: isFood ? "0 0 8px #E63946" : "none",
              transition: "background 0.05s",
            }} />
          );
        })}
        {!started && !gameOver && (
          <div className="snake-overlay">
            <div className="snake-overlay-text">🐍 SNAKE ARCADE</div>
            <button className="snake-start-btn" onClick={startGame}>INSERT COIN</button>
            <div style={{ fontFamily:"'VT323',monospace", fontSize:16, color:"#8B8B8B", marginTop:8 }}>
              Arrow keys to move
            </div>
          </div>
        )}
        {gameOver && (
          <div className="snake-overlay">
            <div className="snake-overlay-text" style={{ color:"#E63946" }}>GAME OVER</div>
            <div style={{ fontFamily:"'VT323',monospace", fontSize:20, color:"#FFD23F", margin:"8px 0" }}>
              Score: {snakeScore}
            </div>
            <button className="snake-start-btn" onClick={startGame}>INSERT COIN TO CONTINUE</button>
          </div>
        )}
      </div>
    </div>
  );
};

const SecretPage = () => (
  <div className="page-secret">
    <h2 className="page-heading" style={{ color:"#FFD23F" }}>🔮 SECRET LEVEL — DEBUG ROOM</h2>
    <div className="secret-content">
      <DialogueBox speaker="MAX" portrait="🕹️"
        text="You found the secret room! There's nothing here except bragging rights, the knowledge that you're thorough, and a developer who appreciates your curiosity. +1000 points well earned." />
      <div className="credits-block">
        <h3 className="section-label">🎬 CREDITS</h3>
        <div className="credit-line"><span className="credit-role">Lead Developer:</span> Max</div>
        <div className="credit-line"><span className="credit-role">Art Director:</span> Also Max</div>
        <div className="credit-line"><span className="credit-role">Sound Design:</span> Your Imagination</div>
        <div className="credit-line"><span className="credit-role">QA Testing:</span> Mostly Max</div>
        <div className="credit-line"><span className="credit-role">Chicken Rice Consultant:</span> Max (Lv. MAX)</div>
        <div className="credit-line"><span className="credit-role">Pixel Wrangler:</span> Caffeine</div>
        <div className="credit-line"><span className="credit-role">Built With:</span> React, Pixels, and Determination</div>
        <div className="credit-line" style={{ color:"#FFD23F", marginTop:16 }}>No AIs were harmed. (Okay, maybe one.)</div>
      </div>
    </div>
  </div>
);

const DevConsole = ({ visible, score, onClose }) => {
  const [input, setInput] = useState("");
  const [log, setLog] = useState(["> THE ARCADE DEBUG CONSOLE v1.0", "> Type HELP for commands"]);
  const inputRef = useRef(null);
  useEffect(() => { if (visible && inputRef.current) inputRef.current.focus(); }, [visible]);

  const processCmd = (cmd) => {
    const c = cmd.trim().toUpperCase();
    const cmds = {
      HELP: "> Commands: HELP, SCORE, STATS, CREDITS, NOCLIP, IDDQD, EXIT",
      SCORE: `> Current score: ${score}`,
      STATS: "> STR:8 DEX:6 INT:9 WIS:7 CHA:6 COD:9 CKR:10",
      CREDITS: "> Built with pixels and caffeine. No AIs were harmed. (Okay, maybe one.)",
      NOCLIP: "> Nice try. Walls are load-bearing.",
      IDDQD: "> God mode enabled. (Not really.) +100 SCORE",
      EXIT: "> [closing console...]",
    };
    return cmds[c] || `> Unknown command: ${cmd}. Type HELP.`;
  };

  const handleSubmit = () => {
    if (!input.trim()) return;
    const result = processCmd(input);
    setLog((p) => [...p, `$ ${input}`, result]);
    if (input.trim().toUpperCase() === "EXIT") setTimeout(onClose, 300);
    setInput("");
  };

  if (!visible) return null;
  return (
    <div className="dev-console">
      <div className="dev-console-log">
        {log.map((l, i) => <div key={i} className="dev-line">{l}</div>)}
      </div>
      <div className="dev-input-row">
        <span className="dev-prompt">$</span>
        <input ref={inputRef} className="dev-input" value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
          placeholder="Type a command..." />
      </div>
    </div>
  );
};

// ─── MAIN APP ───────────────────────────────────────────────────

export default function TheArcade() {
  // — Core state —
  const [page, setPage] = useState("home");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [transitioning, setTransitioning] = useState(false);
  const [pendingPage, setPendingPage] = useState(null);
  const [floaters, setFloaters] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [achievements, setAchievements] = useState(new Set());
  const [visitedPages, setVisitedPages] = useState(new Set(["home"]));
  // — Easter egg state —
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [attractMode, setAttractMode] = useState(false);
  const [attractIdx, setAttractIdx] = useState(0);
  const [devConsole, setDevConsole] = useState(false);
  const [devConsoleOpened, setDevConsoleOpened] = useState(false);
  const [costumeIndex, setCostumeIndex] = useState(0);
  const [avatarClicks, setAvatarClicks] = useState(0);
  const [ckrClicks, setCkrClicks] = useState(0);
  const [screenFlash, setScreenFlash] = useState(false);
  const [heartClicks, setHeartClicks] = useState(0);

  const scoreRef = useRef(score);
  scoreRef.current = score;
  const [titleDisplay, titleClick, titleClicks] = useGlitchText("THE ARCADE", 7);
  const achievementsRef = useRef(achievements);
  achievementsRef.current = achievements;

  // — Floater helper —
  const spawnFloat = useCallback((text, color) => {
    const id = Date.now() + Math.random();
    const x = Math.random() * (window.innerWidth - 200) + 100;
    const y = Math.random() * 200 + 200;
    setFloaters((p) => [...p, { id, text, x, y, color }]);
    setTimeout(() => setFloaters((p) => p.filter((f) => f.id !== id)), 1500);
  }, []);

  // — Score with milestones —
  const addScore = useCallback((pts) => {
    setScore((prev) => {
      const next = prev + pts;
      if (prev < 100 && next >= 100) setTimeout(() => spawnFloat("NOT BAD, PLAYER 1", "#FFD23F"), 200);
      if (prev < 500 && next >= 500) setTimeout(() => spawnFloat("SKILLED GAMER DETECTED", "#48BFE3"), 200);
      if (prev < 1000 && next >= 1000) setTimeout(() => spawnFloat("HIGH SCORE MATERIAL", "#2DC653"), 200);
      if (prev < 5000 && next >= 5000) setTimeout(() => spawnFloat("LEGENDARY", "#E63946"), 200);
      return Math.max(0, next);
    });
    if (pts > 0) spawnFloat(`+${pts}`, pts >= 100 ? "#FFD23F" : "#2DC653");
  }, [spawnFloat]);

  // — Achievement system —
  const unlockAchievement = useCallback((key) => {
    if (achievementsRef.current.has(key)) return;
    setAchievements((prev) => {
      const next = new Set(prev);
      next.add(key);
      // Check completionist
      const allOthers = Object.keys(ACHIEVEMENT_DEFS).filter((k) => k !== "COMPLETIONIST");
      if (allOthers.every((k) => next.has(k)) && !next.has("COMPLETIONIST")) {
        next.add("COMPLETIONIST");
        setTimeout(() => {
          setToasts((p) => [...p, { id: Date.now() + 1, ...ACHIEVEMENT_DEFS.COMPLETIONIST }]);
        }, 4000);
      }
      return next;
    });
    setToasts((p) => [...p, { id: Date.now(), ...ACHIEVEMENT_DEFS[key] }]);
  }, []);

  // — Navigation with transitions —
  const navigateTo = useCallback((target) => {
    if (target === page) return;
    setTransitioning(true);
    setPendingPage(target);
  }, [page]);

  const handleWipeComplete = useCallback(() => {
    setTransitioning(false);
    if (pendingPage) {
      setPage(pendingPage);
      setVisitedPages((prev) => {
        const next = new Set(prev);
        next.add(pendingPage);
        // Check EXPLORER
        if (NAV_PAGES.every((p) => next.has(p.id)) && !achievementsRef.current.has("EXPLORER")) {
          setTimeout(() => unlockAchievement("EXPLORER"), 500);
        }
        return next;
      });
      addScore(5);
      setPendingPage(null);
    }
  }, [pendingPage, addScore, unlockAchievement]);

  // — First boot achievement —
  useEffect(() => {
    setTimeout(() => { unlockAchievement("FIRST_BOOT"); addScore(10); }, 1000);
  }, []); // eslint-disable-line

  // — Konami code —
  useKonamiCode(useCallback(() => {
    if (!secretUnlocked) {
      setSecretUnlocked(true);
      setScreenFlash(true);
      setTimeout(() => setScreenFlash(false), 150);
      addScore(1000);
      unlockAchievement("SECRET_AGENT");
    }
  }, [secretUnlocked, addScore, unlockAchievement]));

  // — Idle attract mode —
  useIdleTimer(30000,
    useCallback(() => { if (page === "home") { setAttractMode(true); addScore(-10); } }, [page, addScore]),
    useCallback(() => setAttractMode(false), [])
  );

  // Attract mode cycling
  useEffect(() => {
    if (!attractMode) return;
    const iv = setInterval(() => setAttractIdx((p) => (p + 1) % CARTRIDGES.length), 3000);
    return () => clearInterval(iv);
  }, [attractMode]);

  // — Dev console toggle —
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "`") {
        e.preventDefault();
        setDevConsole((prev) => {
          if (!prev && !devConsoleOpened) {
            setDevConsoleOpened(true);
            addScore(50);
            unlockAchievement("HACKER");
          }
          return !prev;
        });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [devConsoleOpened, addScore, unlockAchievement]);

  // — Heart click —
  const handleHeartClick = () => {
    const n = heartClicks + 1;
    setHeartClicks(n);
    if (n % 3 === 0) { setLives(3); spawnFloat("1UP!", "#FF6B9D"); }
  };

  // — Title click with score —
  const handleTitleClick = () => {
    titleClick();
    if ((titleClicks + 1) % 7 === 0) addScore(100);
  };

  // — Render current page —
  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage onSelect={navigateTo} attractMode={attractMode} highlightIdx={attractIdx}
          secretUnlocked={secretUnlocked} onTitleClick={handleTitleClick}
          titleDisplay={titleDisplay} addScore={addScore} />;
      case "about":
        return <AboutPage addScore={addScore} unlockAchievement={unlockAchievement}
          costumeIndex={costumeIndex} setCostumeIndex={setCostumeIndex}
          avatarClicks={avatarClicks} setAvatarClicks={setAvatarClicks}
          ckrClicks={ckrClicks} setCkrClicks={setCkrClicks} />;
      case "projects":
        return <ProjectsPage addScore={addScore} navigateTo={navigateTo} />;
      case "quests":
        return <QuestsPage />;
      case "contact":
        return <ContactPage addScore={addScore} />;
      case "snake":
        return <SnakePage addScore={addScore} unlockAchievement={unlockAchievement} />;
      case "secret":
        return <SecretPage />;
      default:
        return <HomePage onSelect={navigateTo} attractMode={attractMode} highlightIdx={attractIdx}
          secretUnlocked={secretUnlocked} onTitleClick={handleTitleClick}
          titleDisplay={titleDisplay} addScore={addScore} />;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Silkscreen:wght@400;700&display=swap');
        :root {
          --bg-dark:#0F0F1B;--bg-panel:#1A1A2E;--bg-panel-alt:#16213E;
          --pixel-blue:#3450A1;--pixel-red:#E63946;--pixel-green:#2DC653;
          --pixel-yellow:#FFD23F;--pixel-cyan:#48BFE3;--pixel-orange:#F77F00;
          --pixel-purple:#7B2D8E;--pixel-pink:#FF6B9D;
          --text-primary:#E8E8E8;--text-secondary:#8B8B8B;--text-highlight:#FFD23F;
          --text-damage:#E63946;--text-heal:#2DC653;
          --border-default:#2A2A4A;--border-active:#48BFE3;--border-gold:#FFD23F;
          --scanline:rgba(0,0,0,0.10);--pixel-shadow:#0A0A15;
        }
        *{margin:0;padding:0;box-sizing:border-box;}
        body{background:var(--bg-dark);color:var(--text-primary);overflow-x:hidden;-webkit-font-smoothing:none;}
        /* ── CRT ──────────────────── */
        .crt-scanlines{position:fixed;inset:0;pointer-events:none;z-index:9999;
          background:repeating-linear-gradient(to bottom,transparent 0px,transparent 2px,var(--scanline) 2px,var(--scanline) 4px);}
        .crt-vignette{position:fixed;inset:0;pointer-events:none;z-index:9998;
          background:radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,0.35) 100%);}
        @keyframes crt-flicker{0%,100%{opacity:1}92%{opacity:1}93%{opacity:0.96}94%{opacity:1}}
        .crt-screen{animation:crt-flicker 8s infinite;}
        /* ── STARFIELD ────────────── */
        .starfield{position:fixed;inset:0;z-index:0;overflow:hidden;background:var(--bg-dark);}
        .stars-sm,.stars-md,.stars-lg{position:absolute;inset:0;background-repeat:repeat;}
        .stars-sm{background-image:radial-gradient(1px 1px at 50px 100px,#8B8B8B,transparent),radial-gradient(1px 1px at 200px 300px,#8B8B8B,transparent),radial-gradient(1px 1px at 400px 50px,#8B8B8B,transparent),radial-gradient(1px 1px at 600px 200px,#8B8B8B,transparent),radial-gradient(1px 1px at 150px 450px,#8B8B8B,transparent),radial-gradient(1px 1px at 500px 350px,#8B8B8B,transparent);background-size:700px 500px;animation:drift 120s linear infinite;}
        .stars-md{background-image:radial-gradient(1.5px 1.5px at 150px 250px,#E8E8E8,transparent),radial-gradient(1.5px 1.5px at 450px 150px,#E8E8E8,transparent),radial-gradient(1.5px 1.5px at 350px 400px,#E8E8E8,transparent);background-size:600px 400px;animation:drift 80s linear infinite;}
        .stars-lg{background-image:radial-gradient(2px 2px at 300px 350px,#FFD23F,transparent),radial-gradient(2px 2px at 100px 120px,#48BFE3,transparent);background-size:800px 600px;animation:drift 40s linear infinite;}
        @keyframes drift{from{transform:translateY(0)}to{transform:translateY(-500px)}}
        /* ── BLINK ────────────────── */
        @keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}
        .blink{animation:blink 1.06s step-end infinite;}
        .blink-fast{animation:blink 0.4s step-end infinite;}
        /* ── SCREEN WIPE ──────────── */
        @keyframes wipeIn{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
        @keyframes wipeOut{from{clip-path:inset(0 0 0 0)}to{clip-path:inset(0 0 0 100%)}}
        .screen-wipe{position:fixed;inset:0;z-index:10000;background:var(--bg-dark);
          display:flex;align-items:center;justify-content:center;
          animation:wipeIn 0.25s steps(8) forwards,wipeOut 0.25s steps(8) 0.25s forwards;}
        /* ── FLASH ────────────────── */
        .screen-flash{position:fixed;inset:0;z-index:10003;background:#fff;pointer-events:none;
          animation:flashOut 0.15s forwards;}
        @keyframes flashOut{from{opacity:1}to{opacity:0}}
        /* ── ACHIEVEMENT ──────────── */
        @keyframes slideInRight{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes slideOutRight{from{transform:translateX(0);opacity:1}to{transform:translateX(120%);opacity:0}}
        .achievement-toast{position:fixed;top:20px;right:20px;background:var(--bg-dark);border:3px solid var(--pixel-yellow);
          padding:12px 16px;z-index:10001;max-width:300px;box-shadow:0 0 20px rgba(255,210,63,0.3);
          animation:slideInRight 0.3s ease-out,slideOutRight 0.3s ease-in 3s forwards;}
        /* ── CONSOLE BAR ──────────── */
        .console-bar{position:fixed;bottom:0;left:0;right:0;height:40px;background:var(--bg-dark);
          border-top:3px solid var(--border-default);display:flex;align-items:center;
          justify-content:space-between;padding:0 20px;z-index:1000;
          font-family:'Press Start 2P',monospace;font-size:8px;color:var(--text-secondary);}
        .console-bar-day{display:none;}
        @media(min-width:768px){.console-bar-day{display:inline;}}
        /* ── NAV ──────────────────── */
        .nav-dpad{display:flex;gap:4px;padding:8px;background:var(--bg-panel);border:3px solid var(--border-default);
          justify-content:center;flex-wrap:wrap;margin-bottom:20px;}
        .nav-btn{font-family:'Press Start 2P',monospace;font-size:8px;padding:8px 12px;
          background:var(--bg-dark);color:var(--text-secondary);border:2px solid var(--border-default);
          cursor:pointer;text-transform:uppercase;letter-spacing:1px;transition:all 0.1s;}
        .nav-btn:hover{background:var(--bg-panel-alt);color:var(--text-primary);}
        .nav-active{background:var(--pixel-blue)!important;color:var(--text-primary)!important;border-color:var(--pixel-cyan)!important;}
        @media(min-width:640px){.nav-btn{font-size:9px;padding:8px 16px;}}
        /* ── MAIN CONTENT ─────────── */
        .main-content{position:relative;z-index:1;min-height:100vh;padding:20px 16px 60px;max-width:960px;margin:0 auto;}
        @media(min-width:768px){.main-content{padding:30px 24px 60px;}}
        /* ── HOMEPAGE ─────────────── */
        .page-home{text-align:center;padding-top:40px;}
        .arcade-title{font-family:'Press Start 2P',monospace;font-size:22px;color:var(--text-primary);
          text-shadow:0 0 10px rgba(72,191,227,0.5),0 0 30px rgba(72,191,227,0.2),3px 3px 0 var(--pixel-shadow);
          letter-spacing:3px;cursor:pointer;user-select:none;margin-bottom:12px;
          animation:neonPulse 3s ease-in-out infinite;}
        @media(min-width:640px){.arcade-title{font-size:32px;letter-spacing:5px;}}
        @keyframes neonPulse{0%,100%{text-shadow:0 0 10px rgba(72,191,227,0.5),0 0 30px rgba(72,191,227,0.2),3px 3px 0 var(--pixel-shadow)}50%{text-shadow:0 0 20px rgba(72,191,227,0.8),0 0 50px rgba(72,191,227,0.4),3px 3px 0 var(--pixel-shadow)}}
        .rainbow-cycle{animation:rainbow 2s linear infinite!important;}
        @keyframes rainbow{0%{color:#E63946}16%{color:#F77F00}33%{color:#FFD23F}50%{color:#2DC653}66%{color:#48BFE3}83%{color:#7B2D8E}100%{color:#E63946}}
        .insert-coin{font-family:'Press Start 2P',monospace;font-size:11px;color:var(--pixel-yellow);
          margin-bottom:40px;letter-spacing:2px;}
        /* ── CARTRIDGE GRID ────────── */
        .cartridge-grid{display:grid;grid-template-columns:1fr;gap:16px;max-width:700px;margin:0 auto;}
        @media(min-width:520px){.cartridge-grid{grid-template-columns:repeat(2,1fr);}}
        @media(min-width:768px){.cartridge-grid{grid-template-columns:repeat(3,1fr);}}
        .cartridge-card{background:var(--bg-panel);border:3px solid var(--border-default);cursor:pointer;
          transition:transform 0.15s,box-shadow 0.15s,border-color 0.15s;overflow:hidden;image-rendering:pixelated;}
        .cartridge-card:hover{transform:translateY(-4px);border-color:var(--pixel-cyan);
          box-shadow:0 0 20px rgba(72,191,227,0.3),0 4px 0 var(--pixel-shadow);}
        .cartridge-highlighted{border-color:var(--pixel-cyan)!important;box-shadow:0 0 20px rgba(72,191,227,0.3)!important;transform:translateY(-4px)!important;}
        .cartridge-secret{border-color:var(--pixel-yellow)!important;box-shadow:0 0 25px rgba(255,210,63,0.4)!important;
          animation:secretGlow 1.5s ease-in-out infinite;}
        @keyframes secretGlow{0%,100%{box-shadow:0 0 15px rgba(255,210,63,0.3)}50%{box-shadow:0 0 30px rgba(255,210,63,0.6)}}
        .cartridge-art{height:100px;display:flex;align-items:center;justify-content:center;
          border-bottom:3px solid var(--border-default);position:relative;}
        @media(min-width:640px){.cartridge-art{height:120px;}}
        .cartridge-genre{position:absolute;top:8px;right:8px;background:var(--bg-dark);color:var(--text-highlight);
          font-family:'Press Start 2P',monospace;font-size:7px;padding:3px 6px;border:2px solid var(--border-default);}
        .cartridge-info{padding:12px;}
        .cartridge-title{font-family:'Press Start 2P',monospace;font-size:9px;color:var(--text-primary);
          margin:0 0 8px;letter-spacing:1px;text-transform:uppercase;text-shadow:2px 2px 0 var(--pixel-shadow);}
        @media(min-width:640px){.cartridge-title{font-size:10px;}}
        .cartridge-meta{display:flex;justify-content:space-between;align-items:center;}
        .cartridge-year{font-family:'VT323',monospace;font-size:16px;color:var(--text-secondary);}
        .cartridge-stars{font-family:'VT323',monospace;font-size:16px;color:var(--pixel-yellow);letter-spacing:2px;}
        /* ── DIALOGUE BOX ─────────── */
        .dialogue-box{background:var(--bg-dark);border:4px solid var(--text-primary);padding:16px;
          display:flex;gap:16px;position:relative;max-width:600px;margin:0 auto;}
        .dialogue-inner-border{position:absolute;inset:3px;border:2px solid var(--border-default);pointer-events:none;}
        .dialogue-portrait{width:48px;height:48px;background:var(--bg-panel);border:2px solid var(--border-default);
          flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:28px;}
        .dialogue-speaker{font-family:'Press Start 2P',monospace;font-size:9px;color:var(--pixel-cyan);
          margin-bottom:8px;letter-spacing:1px;}
        .dialogue-text{font-family:'VT323',monospace;font-size:18px;color:var(--text-primary);line-height:1.6;min-height:40px;}
        /* ── ABOUT PAGE ───────────── */
        .page-about{padding-top:10px;}
        .page-heading{font-family:'Press Start 2P',monospace;font-size:16px;text-transform:uppercase;
          letter-spacing:2px;text-shadow:2px 2px 0 var(--pixel-shadow);margin-bottom:20px;text-align:center;}
        @media(min-width:640px){.page-heading{font-size:20px;}}
        .about-grid{display:flex;flex-direction:column;gap:24px;}
        @media(min-width:768px){.about-grid{flex-direction:row;}}
        .about-left{display:flex;flex-direction:column;align-items:center;gap:16px;min-width:220px;}
        .about-right{flex:1;display:flex;flex-direction:column;gap:20px;}
        .avatar-area{width:100px;height:100px;border:4px solid var(--pixel-blue);background:var(--bg-panel);
          display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;
          transition:border-color 0.3s;image-rendering:pixelated;}
        .avatar-area:hover{animation:shake 0.2s;}
        @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-2px)}75%{transform:translateX(2px)}}
        .avatar-flash{position:absolute;inset:0;background:#fff;z-index:5;animation:flashOut 0.2s forwards;}
        .costume-banner{font-family:'Press Start 2P',monospace;font-size:8px;color:var(--pixel-yellow);
          text-align:center;animation:slideInRight 0.3s ease-out;}
        .char-info{text-align:left;width:100%;}
        .char-line{font-family:'VT323',monospace;font-size:20px;color:var(--text-primary);margin-bottom:4px;}
        .char-key{color:var(--pixel-cyan);font-family:'Press Start 2P',monospace;font-size:9px;margin-right:8px;}
        .hp-bars{width:100%;}
        .hp-row{display:flex;align-items:center;gap:8px;margin-bottom:6px;}
        .bar-track{flex:1;height:12px;background:var(--bg-dark);border:2px solid var(--border-default);overflow:hidden;}
        .bar-fill{height:100%;transition:width 1s ease-out;}
        .bar-hp{background:var(--pixel-red);}
        .bar-mp{background:var(--pixel-blue);}
        .bar-xp{background:var(--pixel-yellow);}
        .bar-num{font-family:'Silkscreen',monospace;font-size:11px;color:var(--text-secondary);min-width:70px;text-align:right;}
        .section-label{font-family:'Press Start 2P',monospace;font-size:10px;color:var(--text-highlight);
          margin-bottom:12px;letter-spacing:1px;text-transform:uppercase;}
        .stat-block{border:3px solid var(--pixel-blue);padding:16px;background:var(--bg-panel);transition:border-color 0.3s;}
        .stat-row{display:flex;align-items:center;gap:8px;margin-bottom:6px;cursor:help;}
        .stat-label{font-family:'Press Start 2P',monospace;font-size:9px;color:var(--text-highlight);
          width:32px;text-align:right;letter-spacing:1px;flex-shrink:0;}
        .stat-bar{font-family:'VT323',monospace;font-size:18px;letter-spacing:1px;}
        .stat-value{font-family:'Silkscreen',monospace;font-size:12px;color:var(--text-primary);min-width:16px;}
        .equip-block{border:3px solid var(--border-default);padding:16px;background:var(--bg-panel);}
        .equip-row{font-family:'VT323',monospace;font-size:18px;margin-bottom:4px;display:flex;flex-wrap:wrap;gap:4px;}
        .equip-slot{color:var(--pixel-cyan);font-family:'Press Start 2P',monospace;font-size:8px;min-width:80px;}
        .equip-item{color:var(--text-primary);}
        .equip-bonus{color:var(--text-secondary);font-size:16px;}
        .skill-block{border:3px solid var(--border-default);padding:16px;background:var(--bg-panel);}
        .skill-grid{display:flex;flex-wrap:wrap;gap:8px;}
        .skill-node{font-family:'VT323',monospace;font-size:16px;padding:6px 10px;
          border:2px solid var(--border-default);display:flex;align-items:center;gap:6px;
          background:var(--bg-dark);}
        .skill-unlocked{border-color:var(--pixel-green);}
        .skill-locked{opacity:0.5;border-color:var(--border-default);}
        .skill-name{color:var(--text-primary);}
        .skill-level{color:var(--text-secondary);font-size:14px;}
        .skill-note{color:var(--text-secondary);font-size:13px;font-style:italic;}
        /* ── CHICKEN RICE ─────────── */
        .chicken-rice-overlay{position:fixed;inset:0;z-index:10001;background:rgba(15,15,27,0.95);
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          animation:flashOut 3s forwards 2.5s;}
        .chicken-rice-text{font-family:'Press Start 2P',monospace;font-size:14px;color:var(--pixel-yellow);
          text-align:center;animation:shake 0.3s infinite;letter-spacing:2px;}
        @media(min-width:640px){.chicken-rice-text{font-size:20px;}}
        .chicken-rice-sub{font-family:'VT323',monospace;font-size:28px;color:var(--text-primary);margin-top:16px;}
        /* ── PROJECTS ─────────────── */
        .page-projects{padding-top:10px;}
        .project-list{display:flex;flex-direction:column;gap:12px;}
        .project-node{background:var(--bg-panel);border:3px solid var(--border-default);padding:16px;
          cursor:pointer;transition:border-color 0.15s,transform 0.15s;}
        .project-node:hover{border-color:var(--pixel-red);transform:translateX(4px);}
        .project-header{display:flex;flex-wrap:wrap;align-items:center;gap:8px 16px;}
        .project-world{font-family:'Press Start 2P',monospace;font-size:10px;color:var(--pixel-red);min-width:70px;}
        .project-name{font-family:'Press Start 2P',monospace;font-size:10px;color:var(--text-primary);
          text-shadow:2px 2px 0 var(--pixel-shadow);flex:1;min-width:120px;}
        .project-difficulty{font-family:'VT323',monospace;font-size:18px;color:var(--pixel-yellow);}
        .project-status{font-family:'Press Start 2P',monospace;font-size:8px;}
        .status-cleared{color:var(--pixel-green);}
        .status-progress{color:var(--pixel-orange);animation:blink 1.5s step-end infinite;}
        .project-sub{display:flex;flex-wrap:wrap;align-items:center;gap:8px 16px;margin-top:8px;}
        .project-boss{font-family:'VT323',monospace;font-size:18px;color:var(--pixel-purple);}
        .project-tech{display:flex;gap:4px;flex-wrap:wrap;}
        .tech-badge{font-family:'VT323',monospace;font-size:14px;background:var(--bg-dark);
          color:var(--pixel-cyan);padding:2px 8px;border:1px solid var(--border-default);}
        /* ── WARP PIPE ────────────── */
        .warp-pipe{width:40px;height:30px;background:var(--pixel-green);border:3px solid #1a8a3a;
          border-radius:4px 4px 0 0;cursor:pointer;position:absolute;bottom:0;right:20px;opacity:0.5;
          transition:opacity 0.3s;}
        .warp-pipe:hover{opacity:1;}
        .warp-pipe-cap{width:46px;height:10px;background:var(--pixel-green);border:3px solid #1a8a3a;
          position:absolute;top:-8px;left:-6px;}
        /* ── QUESTS ───────────────── */
        .page-quests{padding-top:10px;}
        .quest-journal{border:4px solid var(--pixel-purple);padding:20px;background:var(--bg-panel);
          display:flex;flex-direction:column;gap:20px;
          box-shadow:inset 0 0 30px rgba(123,45,142,0.1);}
        .quest-entry{border-bottom:2px solid var(--border-default);padding-bottom:16px;}
        .quest-entry:last-child{border-bottom:none;padding-bottom:0;}
        .quest-header{display:flex;flex-wrap:wrap;align-items:center;gap:8px 16px;margin-bottom:8px;}
        .quest-day{font-family:'Press Start 2P',monospace;font-size:9px;color:var(--pixel-purple);}
        .quest-title{font-family:'Press Start 2P',monospace;font-size:10px;color:var(--text-primary);
          text-shadow:2px 2px 0 var(--pixel-shadow);flex:1;min-width:120px;}
        .quest-status{font-family:'Press Start 2P',monospace;font-size:7px;padding:4px 8px;
          border:2px solid;letter-spacing:1px;}
        .qs-complete{color:var(--pixel-green);border-color:var(--pixel-green);}
        .qs-active{color:var(--pixel-orange);border-color:var(--pixel-orange);animation:blink 1.5s step-end infinite;}
        .quest-tags{display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;}
        .quest-tag{font-family:'VT323',monospace;font-size:16px;background:var(--bg-dark);padding:2px 8px;
          border:1px solid var(--border-default);color:var(--text-secondary);}
        /* ── CONTACT ──────────────── */
        .page-contact{padding-top:10px;}
        .lobby-status{display:flex;justify-content:space-between;font-family:'VT323',monospace;font-size:18px;
          color:var(--text-secondary);margin-bottom:16px;flex-wrap:wrap;gap:8px;}
        .contact-panel{border:3px solid var(--pixel-cyan);padding:24px;background:var(--bg-panel);max-width:600px;margin:0 auto;}
        .contact-form{display:flex;flex-direction:column;gap:12px;}
        .form-label{font-family:'Press Start 2P',monospace;font-size:9px;color:var(--pixel-cyan);letter-spacing:1px;}
        .form-input{font-family:'VT323',monospace;font-size:20px;background:var(--bg-dark);color:var(--text-primary);
          border:3px solid var(--border-default);padding:10px 12px;outline:none;transition:border-color 0.2s;}
        .form-input:focus{border-color:var(--pixel-cyan);}
        .form-textarea{resize:vertical;min-height:100px;}
        .send-btn{font-family:'Press Start 2P',monospace;font-size:11px;background:var(--pixel-blue);
          color:var(--text-primary);border:3px solid var(--pixel-cyan);padding:12px 24px;cursor:pointer;
          transition:all 0.15s;text-transform:uppercase;letter-spacing:1px;align-self:flex-start;}
        .send-btn:hover{background:var(--pixel-cyan);color:var(--bg-dark);transform:translateY(-2px);
          box-shadow:0 4px 0 var(--pixel-shadow);}
        .send-btn:active{transform:translateY(0);box-shadow:none;}
        .sent-confirm{text-align:center;padding:40px 0;}
        .sent-text{font-family:'Press Start 2P',monospace;font-size:14px;color:var(--pixel-green);margin-bottom:8px;}
        .sent-sub{font-family:'VT323',monospace;font-size:20px;color:var(--text-secondary);}
        /* ── SNAKE ────────────────── */
        .page-snake{padding-top:10px;display:flex;flex-direction:column;align-items:center;}
        .snake-hud{display:flex;gap:24px;font-family:'Press Start 2P',monospace;font-size:10px;
          color:var(--text-highlight);margin-bottom:12px;}
        .snake-board{position:relative;background:var(--bg-dark);border:3px solid var(--border-default);
          background-image:linear-gradient(var(--border-default) 1px,transparent 1px),linear-gradient(90deg,var(--border-default) 1px,transparent 1px);
          background-size:15px 15px;}
        .snake-overlay{position:absolute;inset:0;background:rgba(15,15,27,0.9);display:flex;flex-direction:column;
          align-items:center;justify-content:center;z-index:5;}
        .snake-overlay-text{font-family:'Press Start 2P',monospace;font-size:14px;color:var(--pixel-green);
          text-shadow:2px 2px 0 var(--pixel-shadow);margin-bottom:16px;}
        .snake-start-btn{font-family:'Press Start 2P',monospace;font-size:10px;background:var(--pixel-green);
          color:var(--bg-dark);border:3px solid #1a8a3a;padding:10px 20px;cursor:pointer;
          transition:all 0.15s;text-transform:uppercase;letter-spacing:1px;}
        .snake-start-btn:hover{background:#4ADE80;transform:translateY(-2px);box-shadow:0 4px 0 var(--pixel-shadow);}
        /* ── SECRET PAGE ──────────── */
        .page-secret{padding-top:10px;text-align:center;}
        .secret-content{max-width:600px;margin:24px auto 0;}
        .credits-block{border:3px solid var(--pixel-yellow);padding:20px;background:var(--bg-panel);margin-top:24px;text-align:left;}
        .credit-line{font-family:'VT323',monospace;font-size:20px;color:var(--text-primary);margin-bottom:6px;}
        .credit-role{color:var(--pixel-cyan);margin-right:8px;}
        /* ── DEV CONSOLE ──────────── */
        .dev-console{position:fixed;inset:0;z-index:10001;background:rgba(10,10,21,0.95);
          display:flex;flex-direction:column;padding:24px;font-family:'VT323',monospace;}
        .dev-console-log{flex:1;overflow-y:auto;margin-bottom:12px;}
        .dev-line{font-size:18px;color:var(--pixel-green);margin-bottom:4px;line-height:1.4;}
        .dev-input-row{display:flex;align-items:center;gap:8px;border-top:2px solid var(--border-default);padding-top:12px;}
        .dev-prompt{color:var(--pixel-green);font-size:20px;}
        .dev-input{flex:1;background:transparent;border:none;outline:none;color:var(--pixel-green);
          font-family:'VT323',monospace;font-size:20px;caret-color:var(--pixel-green);}
        .dev-input::placeholder{color:var(--border-default);}
        /* ── UTILITY ──────────────── */
        select option{background:var(--bg-dark);color:var(--text-primary);}
      `}</style>

      <Starfield />
      <CRTOverlay />
      {screenFlash && <div className="screen-flash" />}
      <ScreenWipe active={transitioning} onComplete={handleWipeComplete} />

      {/* Floating damage numbers */}
      {floaters.map((f) => <FloatingNumber key={f.id} {...f} />)}

      {/* Achievement toasts */}
      {toasts.map((t) => (
        <AchievementToast key={t.id} achievement={t}
          onDone={() => setToasts((p) => p.filter((x) => x.id !== t.id))} />
      ))}

      {/* Dev console */}
      <DevConsole visible={devConsole} score={score}
        onClose={() => setDevConsole(false)} />

      {/* Main content */}
      <div className="main-content crt-screen">
        <NavDPad currentPage={page} onNavigate={navigateTo} />
        {renderPage()}
      </div>

      <ConsoleBar score={score} lives={lives} heartClicks={heartClicks} onHeartClick={handleHeartClick} />
    </>
  );
}
