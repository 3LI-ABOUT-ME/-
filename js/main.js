/* ══════════════════════════════════════════════════════════════
   main.js — page logic (you don't need to edit this, use config.js)
   ══════════════════════════════════════════════════════════════ */
(() => {
  const C = CONFIG;
  const $ = id => document.getElementById(id);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} }
  };

  document.documentElement.style.setProperty("--accent", C.accent || "#a78bfa");

  /* ───────── logo + typing tab title ───────── */
  if (C.logo) $("favicon").href = C.logo;
  (async function tabTitle() {
    const texts = (C.tab && C.tab.texts && C.tab.texts.length) ? C.tab.texts : ["@" + C.name];
    const sp = (C.tab && C.tab.typeSpeed) || 260, pause = (C.tab && C.tab.pause) || 1800;
    const chars = s => Array.from(s);
    for (let i = 0; ; i = (i + 1) % texts.length) {
      const t = chars(texts[i]);
      for (let n = 1; n <= t.length; n++) { document.title = t.slice(0, n).join(""); await sleep(sp); }
      await sleep(pause);
      for (let n = t.length - 1; n >= 1; n--) { document.title = t.slice(0, n).join(""); await sleep(sp * 0.5); }
      await sleep(sp);
    }
  })();

  /* ───────── background video + volume ───────── */
  const video = $("bg-video");
  $("bg-overlay").style.opacity = C.video.darkness ?? 0.45;
  if (C.video.src) {
    video.src = C.video.src;
    video.addEventListener("error", () => { video.style.display = "none"; });
    video.play().catch(() => {});
  } else video.style.display = "none";

  const range = $("vol-range"), volBox = $("volume");
  let volume = parseFloat(store.get("volume") ?? C.video.volume ?? 0.5);
  if (isNaN(volume)) volume = 0.5;
  let muted = store.get("muted") === "1";

  function applyVolume() {
    video.volume = volume;
    video.muted = muted || volume === 0;
    range.value = muted ? 0 : volume;
    range.style.setProperty("--p", (muted ? 0 : volume * 100) + "%");
    volBox.classList.toggle("muted", video.muted);
  }
  range.addEventListener("input", () => {
    volume = parseFloat(range.value); muted = volume === 0;
    store.set("volume", volume); store.set("muted", muted ? "1" : "0");
    applyVolume();
  });
  $("mute-btn").addEventListener("click", () => {
    muted = !muted;
    if (!muted && volume === 0) volume = 0.5;
    store.set("muted", muted ? "1" : "0");
    applyVolume();
  });
  range.value = volume;
  volBox.classList.add("muted");

  /* ───────── box / name / bio / location ───────── */
  const box = $("box");
  box.style.background = C.box.background || "#d9d3c3";
  box.style.color = C.box.color || "#222";
  if (C.box.image) {
    const img = document.createElement("img"); img.src = C.box.image; img.alt = ""; box.appendChild(img);
  } else {
    box.textContent = C.box.text || "";
    box.dir = "auto";
  }

  const nameEl = $("name");
  nameEl.textContent = C.name; nameEl.dataset.text = C.name;
  $("name-badge").textContent = C.nameBadge || "";

  if (C.location) $("location").textContent = C.location;
  else { $("loc-wrap").style.display = "none"; $("loc-sep").style.display = "none"; }

  function addSparkles() {
    for (let i = 0; i < 14; i++) {
      const sp = document.createElement("span");
      sp.className = "sparkle";
      sp.style.left = Math.random() * 100 + "%";
      sp.style.top = (Math.random() * 130 - 15) + "%";
      sp.style.animationDelay = (Math.random() * 2.4).toFixed(2) + "s";
      const sz = 1 + Math.random() * 2.5;
      sp.style.width = sp.style.height = sz + "px";
      nameEl.appendChild(sp);
    }
  }
  addSparkles();

  async function typeBio() {
    const bio = $("bio");
    const full = (C.bio || []).join("\n");
    if (!C.bioTyping) { bio.textContent = full; return; }
    bio.classList.add("typing");
    const ch = Array.from(full);
    for (let i = 1; i <= ch.length; i++) { bio.textContent = ch.slice(0, i).join(""); await sleep(ch[i - 1] === "\n" ? 250 : 38); }
    await sleep(1200);
    bio.classList.remove("typing");
  }

  /* ───────── links ───────── */
  (C.links || []).forEach(l => {
    if (!l.url) return;
    const a = document.createElement("a");
    a.href = l.url; a.target = "_blank"; a.rel = "noopener"; a.title = l.title || "";
    const img = document.createElement("img"); img.src = l.icon; img.alt = l.title || "";
    a.appendChild(img); $("links").appendChild(a);
  });

  /* ───────── views counter ───────── */
  const fmt = n => Number(n).toLocaleString("en-US");
  async function loadViews() {
    const el = $("views"), v = C.views || {};
    if (v.mode === "manual") { el.textContent = fmt(v.manual || 0); return; }
    const start = Number(v.start) || 0;
    const ns = encodeURIComponent(v.namespace || "aboutme-" + C.name);
    const key = encodeURIComponent(v.key || "views");
    const flag = "viewed_" + ns + "_" + key;
    const counted = store.get(flag) === "1";      // each visitor is counted once
    el.textContent = fmt(start);
    const tries = [
      async () => {
        const r = await fetch(`https://abacus.jasoncameron.dev/${counted ? "get" : "hit"}/${ns}/${key}`);
        if (!r.ok) throw 0; return (await r.json()).value;
      },
      async () => {
        const r = await fetch(`https://api.counterapi.dev/v1/${ns}/${key}/${counted ? "" : "up"}`);
        if (!r.ok) throw 0; return (await r.json()).count;
      }
    ];
    for (const f of tries) {
      try {
        const n = await f();
        if (typeof n === "number") { store.set(flag, "1"); animateNumber(el, start + n); return; }
      } catch {}
    }
  }
  function animateNumber(el, to) {
    const from = parseInt(el.textContent.replace(/,/g, "")) || 0, t0 = performance.now(), d = 1200;
    (function step(now) {
      const p = Math.min(1, (now - t0) / d), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(from + (to - from) * e));
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ───────── discord (Lanyard) ───────── */
  const dc = $("discord");
  async function loadDiscord() {
    const id = (C.discord && C.discord.id || "").trim();
    if (!id) { dc.classList.add("hide"); return; }
    try {
      const r = await fetch(`https://api.lanyard.rest/v1/users/${id}`);
      const j = await r.json();
      if (!j.success) {
        $("dc-name").textContent = "discord";
        $("dc-activity").textContent = "join discord.gg/lanyard";
        console.warn("Lanyard: your account is not monitored. Join https://discord.gg/lanyard");
        return;
      }
      renderDiscord(j.data);
    } catch (e) { console.warn("Lanyard error", e); }
  }
  function renderDiscord(d) {
    const u = d.discord_user;
    let avatar;
    if (u.avatar) avatar = `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.${u.avatar.startsWith("a_") ? "gif" : "png"}?size=128`;
    else { let i = 0; try { i = Number((BigInt(u.id) >> 22n) % 6n); } catch {} avatar = `https://cdn.discordapp.com/embed/avatars/${i}.png`; }
    $("dc-avatar").src = avatar;

    const deco = u.avatar_decoration_data && u.avatar_decoration_data.asset;
    const decoEl = $("dc-deco");
    if (deco) { decoEl.src = `https://cdn.discordapp.com/avatar-decoration-presets/${deco}.png?size=160&passthrough=true`; decoEl.style.display = "block"; }
    else decoEl.style.display = "none";

    $("dc-name").textContent = u.global_name || u.display_name || u.username;  // nickname
    $("dc-status").className = "status " + (d.discord_status || "offline");

    const tag = $("dc-tag"); tag.innerHTML = "";
    const pg = u.primary_guild || u.clan;
    if (pg && pg.tag) {
      if (pg.badge && pg.identity_guild_id) {
        const b = document.createElement("img");
        b.src = `https://cdn.discordapp.com/guild-tag-badges/${pg.identity_guild_id}/${pg.badge}.png?size=16`;
        tag.appendChild(b);
      }
      tag.appendChild(document.createTextNode(pg.tag));
    }

    const act = $("dc-activity"); act.innerHTML = "";
    const acts = d.activities || [];
    const custom = acts.find(a => a.type === 4);
    const game = acts.find(a => a.type === 0);
    let text = C.discord.idleText || "currently doing nothing";
    if (d.listening_to_spotify && d.spotify) text = `listening to ${d.spotify.song} — ${d.spotify.artist}`;
    else if (custom && (custom.state || custom.emoji)) {
      if (custom.emoji && custom.emoji.id) {
        const e = document.createElement("img");
        e.src = `https://cdn.discordapp.com/emojis/${custom.emoji.id}.${custom.emoji.animated ? "gif" : "png"}?size=32`;
        act.appendChild(e);
        text = custom.state || "";
      } else text = ((custom.emoji && custom.emoji.name) ? custom.emoji.name + " " : "") + (custom.state || "");
    } else if (game) text = `playing ${game.name}`;
    act.appendChild(document.createTextNode(text));
  }

  /* ───────── snow ───────── */
  function snow() {
    const cv = $("snow"), ctx = cv.getContext("2d");
    let w, h, flakes = [];
    const resize = () => {
      const d = Math.min(2, devicePixelRatio || 1);
      w = cv.width = innerWidth * d; h = cv.height = innerHeight * d;
      flakes = Array.from({ length: Math.round(innerWidth / 18) }, () => mk(true));
    };
    const mk = (any) => ({
      x: Math.random() * w, y: any ? Math.random() * h : -20,
      r: (Math.random() * 2 + 0.6) * (devicePixelRatio || 1),
      v: Math.random() * 0.6 + 0.25, a: Math.random() * Math.PI * 2,
      star: Math.random() < 0.12, o: Math.random() * 0.5 + 0.35
    });
    resize(); addEventListener("resize", resize);
    (function loop() {
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.y += f.v * (devicePixelRatio || 1); f.a += 0.01; f.x += Math.sin(f.a) * 0.3;
        if (f.y > h + 20) Object.assign(f, mk(false));
        ctx.globalAlpha = f.o; ctx.fillStyle = "#fff";
        if (f.star) { ctx.font = `${f.r * 7}px sans-serif`; ctx.fillText("❄", f.x, f.y); }
        else { ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill(); }
      }
      requestAnimationFrame(loop);
    })();
  }
  if (C.snow) snow();

  /* ───────── intro → name → enter ───────── */
  const intro = $("intro");
  let nameShown = false, entered = false;

  function showName() {
    if (nameShown) return; nameShown = true;
    const box = $("intro-name");
    Array.from(C.name).forEach((ch, i) => {
      const sp = document.createElement("span");
      sp.textContent = ch;
      sp.style.animationDelay = (0.15 + i * 0.28) + "s";
      box.appendChild(sp);
    });
    const hint = $("enter-hint");
    hint.textContent = C.intro.enterText || "click to enter";
    setTimeout(() => hint.classList.add("show"), 400 + Array.from(C.name).length * 280);
  }

  function enter() {
    if (entered) return;
    if (C.intro.enabled && !Intro.done) { Intro.skip(); return; }   // first click skips the animation
    entered = true;
    intro.classList.add("gone");
    document.body.classList.add("entered");
    if (store.get("muted") === null) muted = false;
    applyVolume();
    video.play().catch(() => {});
    typeBio();
  }
  intro.addEventListener("click", enter);
  addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") enter(); });

  if (C.intro.enabled) Intro.start(C.intro, showName);
  else showName();

  loadViews();
  loadDiscord();
  setInterval(loadDiscord, 20000);
})();
