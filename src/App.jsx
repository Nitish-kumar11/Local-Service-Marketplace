import { useState, useEffect, useRef, createContext, useContext } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --saffron:   #FF6B00;
    --saffron-d: #E55A00;
    --saffron-l: #FFF3E8;
    --green:     #138808;
    --green-l:   #E8F5E8;
    --navy:      #000080;
    --navy-l:    #E8E8F5;
    --gold:      #F59E0B;
    --gold-l:    #FFFBEB;
    --pink:      #EC4899;
    --pink-l:    #FDF2F8;
    --teal:      #0D9488;
    --teal-l:    #F0FDFA;
    --red:       #DC2626;
    --red-l:     #FEF2F2;
    --ink:       #1A0A00;
    --ink-2:     #3D1F00;
    --ink-3:     #6B4226;
    --muted:     #9CA3AF;
    --border:    #F0E6D8;
    --surface:   #FFFBF7;
    --white:     #FFFFFF;
    --grad1: linear-gradient(135deg, #FF6B00, #FF8C42);
    --grad2: linear-gradient(135deg, #FF6B00, #EC4899);
    --grad3: linear-gradient(135deg, #138808, #0D9488);
    --grad4: linear-gradient(135deg, #000080, #4F46E5);
    --shadow-sm: 0 2px 8px rgba(255,107,0,.08);
    --shadow-md: 0 6px 24px rgba(255,107,0,.15);
    --shadow-lg: 0 16px 48px rgba(255,107,0,.18);
    --shadow-xl: 0 24px 64px rgba(0,0,0,.18);
    --r: 14px; --r-lg: 22px; --r-xl: 32px;
  }

  html { scroll-behavior: smooth; }
  body { font-family: 'Nunito', sans-serif; color: var(--ink); background: var(--surface); -webkit-font-smoothing: antialiased; overflow-x: hidden; }
  h1,h2,h3,h4 { font-family: 'Baloo 2', sans-serif; }

  /* ── GLOBAL ANIMATIONS ── */
  @keyframes fadeUp    { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes scaleIn   { from{opacity:0;transform:scale(.85)} to{opacity:1;transform:scale(1)} }
  @keyframes slideLeft { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slideRight{ from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
  @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  @keyframes pulse     { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
  @keyframes spin      { to{transform:rotate(360deg)} }
  @keyframes shimmer   { 0%{background-position:-1000px 0} 100%{background-position:1000px 0} }
  @keyframes bounce    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes ripple    { 0%{transform:scale(0);opacity:.6} 100%{transform:scale(4);opacity:0} }
  @keyframes glow      { 0%,100%{box-shadow:0 0 20px rgba(255,107,0,.4)} 50%{box-shadow:0 0 40px rgba(255,107,0,.8)} }
  @keyframes toastIn   { from{transform:translateX(60px) scale(.8);opacity:0} to{transform:translateX(0) scale(1);opacity:1} }
  @keyframes marquee   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes countUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes starPop   { 0%{transform:scale(0) rotate(-45deg)} 60%{transform:scale(1.3) rotate(5deg)} 100%{transform:scale(1) rotate(0)} }
  @keyframes orbFloat  { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.05)} 66%{transform:translate(-20px,15px) scale(.95)} }

  .animate-fade-up   { animation: fadeUp .6s cubic-bezier(.22,1,.36,1) both; }
  .animate-scale-in  { animation: scaleIn .5s cubic-bezier(.22,1,.36,1) both; }
  .animate-slide-l   { animation: slideLeft .5s cubic-bezier(.22,1,.36,1) both; }
  .animate-slide-r   { animation: slideRight .5s cubic-bezier(.22,1,.36,1) both; }
  .delay-1 { animation-delay: .1s; } .delay-2 { animation-delay: .2s; }
  .delay-3 { animation-delay: .3s; } .delay-4 { animation-delay: .4s; }
  .delay-5 { animation-delay: .5s; }

  /* ── LAYOUT ── */
  .app { min-height:100vh; display:flex; flex-direction:column; }
  .page { flex:1; padding:44px 28px; max-width:1280px; margin:0 auto; width:100%; }
  .page-md { max-width:800px; }

  /* ── NAV ── */
  .nav {
    background: rgba(255,251,247,.92); backdrop-filter:blur(20px);
    border-bottom:2px solid var(--border);
    padding:0 28px; display:flex; align-items:center; justify-content:space-between;
    height:70px; position:sticky; top:0; z-index:200;
    box-shadow: 0 2px 20px rgba(255,107,0,.08);
    transition: all .3s;
  }
  .nav-brand {
    display:flex; align-items:center; gap:10px; cursor:pointer;
    font-family:'Baloo 2',sans-serif; font-weight:800; font-size:20px;
    text-decoration:none; letter-spacing:-.3px;
  }
  .nav-logo {
    width:42px; height:42px; border-radius:12px; background:var(--grad1);
    display:flex; align-items:center; justify-content:center;
    color:white; font-size:20px; box-shadow:var(--shadow-md);
    transition: transform .3s; animation: glow 3s infinite;
  }
  .nav-logo:hover { transform: rotate(15deg) scale(1.1); }
  .nav-brand-t1 { color:var(--saffron); }
  .nav-brand-t2 { color:var(--green); }
  .nav-brand-t3 { color:var(--navy); }
  .nav-links { display:flex; align-items:center; gap:4px; }
  .nav-link {
    padding:9px 18px; border-radius:10px; font-size:14px; font-weight:700;
    cursor:pointer; color:var(--ink-3); transition:all .2s; border:none; background:none;
    font-family:'Nunito',sans-serif; position:relative; overflow:hidden;
  }
  .nav-link::after { content:''; position:absolute; bottom:4px; left:50%; transform:translateX(-50%) scaleX(0); width:70%; height:2px; background:var(--grad1); border-radius:2px; transition:transform .2s; }
  .nav-link:hover { color:var(--saffron); }
  .nav-link:hover::after { transform:translateX(-50%) scaleX(1); }
  .nav-link.active { color:var(--saffron); background:var(--saffron-l); }
  .nav-link.active::after { transform:translateX(-50%) scaleX(1); }
  .nav-actions { display:flex; gap:10px; align-items:center; }
  .avatar {
    width:40px; height:40px; border-radius:50%; background:var(--grad2);
    color:white; display:flex; align-items:center; justify-content:center;
    font-weight:800; font-size:16px; cursor:pointer;
    border:2.5px solid white; box-shadow:var(--shadow-md);
    transition:transform .3s; font-family:'Baloo 2',sans-serif;
  }
  .avatar:hover { transform:scale(1.12) rotate(-5deg); }

  /* ── RIPPLE BUTTON ── */
  .btn {
    display:inline-flex; align-items:center; gap:8px;
    padding:11px 24px; border-radius:var(--r); font-size:14px;
    font-weight:800; cursor:pointer; border:none; transition:all .25s;
    font-family:'Nunito',sans-serif; letter-spacing:.01em;
    position:relative; overflow:hidden; white-space:nowrap;
  }
  .btn::before { content:''; position:absolute; inset:0; background:rgba(255,255,255,.15); opacity:0; transition:opacity .2s; }
  .btn:hover::before { opacity:1; }
  .btn:active { transform:scale(.96); }
  .btn-ripple { position:absolute; border-radius:50%; background:rgba(255,255,255,.4); animation:ripple .6s linear; pointer-events:none; }
  .btn-primary { background:var(--grad1); color:white; box-shadow:0 6px 20px rgba(255,107,0,.35); }
  .btn-primary:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(255,107,0,.45); }
  .btn-green  { background:var(--grad3); color:white; box-shadow:0 6px 20px rgba(19,136,8,.3); }
  .btn-green:hover  { transform:translateY(-2px); box-shadow:0 10px 28px rgba(19,136,8,.4); }
  .btn-navy   { background:var(--grad4); color:white; box-shadow:0 6px 20px rgba(0,0,128,.3); }
  .btn-navy:hover   { transform:translateY(-2px); }
  .btn-secondary { background:var(--white); color:var(--ink); border:2px solid var(--border); box-shadow:var(--shadow-sm); }
  .btn-secondary:hover { border-color:var(--saffron); color:var(--saffron); transform:translateY(-2px); box-shadow:var(--shadow-md); }
  .btn-ghost { background:transparent; color:var(--ink-3); }
  .btn-ghost:hover { background:var(--saffron-l); color:var(--saffron); }
  .btn-danger { background:var(--red); color:white; }
  .btn-danger:hover { opacity:.88; transform:translateY(-1px); }
  .btn-sm  { padding:7px 16px; font-size:13px; }
  .btn-lg  { padding:15px 36px; font-size:16px; }
  .btn-block { width:100%; justify-content:center; }
  .btn:disabled { opacity:.45; cursor:not-allowed; transform:none !important; box-shadow:none !important; }
  .btn-shine { background:linear-gradient(135deg,#FF6B00,#FFD700,#FF6B00); background-size:200% 100%; animation:shimmer 2s infinite; color:white; }

  /* ── FORMS ── */
  .form-group { display:flex; flex-direction:column; gap:7px; margin-bottom:18px; }
  .form-label { font-size:12px; font-weight:800; color:var(--ink-2); letter-spacing:.06em; text-transform:uppercase; }
  .form-input, .form-select, .form-textarea {
    padding:12px 16px; border:2px solid var(--border); border-radius:var(--r);
    font-size:14px; font-family:'Nunito',sans-serif; transition:all .25s;
    background:var(--white); color:var(--ink); width:100%; font-weight:600;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus {
    outline:none; border-color:var(--saffron); box-shadow:0 0 0 4px rgba(255,107,0,.12);
    transform:translateY(-1px);
  }
  .form-input::placeholder { color:var(--muted); font-weight:400; }
  .form-textarea { min-height:100px; resize:vertical; line-height:1.6; }
  .form-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }

  /* ── CARDS ── */
  .card { background:var(--white); border:2px solid var(--border); border-radius:var(--r-lg); padding:28px; box-shadow:var(--shadow-sm); }
  .card-hover { transition:all .3s cubic-bezier(.22,1,.36,1); cursor:pointer; }
  .card-hover:hover { box-shadow:var(--shadow-lg); transform:translateY(-6px) scale(1.01); border-color:rgba(255,107,0,.3); }

  /* ── BADGES ── */
  .badge { display:inline-flex; align-items:center; gap:4px; padding:4px 12px; border-radius:99px; font-size:11px; font-weight:800; letter-spacing:.05em; text-transform:uppercase; }
  .badge-orange { background:var(--saffron-l); color:var(--saffron); }
  .badge-green  { background:var(--green-l);   color:var(--green); }
  .badge-navy   { background:var(--navy-l);    color:var(--navy); }
  .badge-gold   { background:var(--gold-l);    color:#92400E; }
  .badge-pink   { background:var(--pink-l);    color:var(--pink); }
  .badge-teal   { background:var(--teal-l);    color:var(--teal); }
  .badge-red    { background:var(--red-l);     color:var(--red); }
  .badge-gray   { background:#F3F4F6; color:#6B7280; border:1.5px solid #E5E7EB; }

  /* ── MARQUEE BANNER ── */
  .marquee-wrap { background:var(--grad1); padding:10px 0; overflow:hidden; position:relative; }
  .marquee-track { display:flex; gap:0; animation:marquee 30s linear infinite; width:max-content; }
  .marquee-item { display:flex; align-items:center; gap:8px; padding:0 32px; color:white; font-weight:700; font-size:13px; white-space:nowrap; }
  .marquee-dot { width:6px; height:6px; background:rgba(255,255,255,.5); border-radius:50%; }

  /* ── HERO ── */
  .hero {
    background:linear-gradient(145deg, #1a0050 0%, #FF4500 40%, #FF6B00 70%, #FFD700 100%);
    padding:96px 28px 88px; text-align:center; color:white; position:relative; overflow:hidden;
  }
  .hero-orb { position:absolute; border-radius:50%; pointer-events:none; animation:orbFloat 8s ease-in-out infinite; }
  .hero-orb1 { width:500px; height:500px; background:radial-gradient(circle,rgba(255,215,0,.35) 0%,transparent 70%); top:-150px; left:-100px; animation-delay:0s; }
  .hero-orb2 { width:400px; height:400px; background:radial-gradient(circle,rgba(236,72,153,.35) 0%,transparent 70%); bottom:-100px; right:-80px; animation-delay:-3s; }
  .hero-orb3 { width:280px; height:280px; background:radial-gradient(circle,rgba(255,255,255,.15) 0%,transparent 70%); top:40%; left:55%; animation-delay:-6s; }
  .hero-particles { position:absolute; inset:0; overflow:hidden; pointer-events:none; }
  .particle { position:absolute; width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,.6); animation:float 4s ease-in-out infinite; }
  .hero-content { position:relative; max-width:780px; margin:0 auto; }
  .hero-badge { display:inline-flex; align-items:center; gap:10px; background:rgba(255,255,255,.15); border:1.5px solid rgba(255,255,255,.3); padding:8px 20px; border-radius:99px; font-size:13px; font-weight:700; color:white; margin-bottom:28px; backdrop-filter:blur(10px); animation:fadeUp .6s both; }
  .hero-badge-live { display:flex; align-items:center; gap:6px; }
  .hero-badge-dot { width:8px; height:8px; border-radius:50%; background:#4ade80; box-shadow:0 0 10px #4ade80; animation:pulse 1.5s infinite; }
  .hero h1 { font-size:clamp(32px,5.5vw,62px); font-weight:800; line-height:1.08; margin-bottom:22px; letter-spacing:-.04em; animation:fadeUp .7s .1s both; }
  .hero-hl { background:linear-gradient(135deg,#FFD700,#FF69B4,#FFD700); background-size:200% 100%; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 3s infinite; }
  .hero p { font-size:18px; opacity:.85; margin-bottom:44px; line-height:1.7; font-weight:500; max-width:560px; margin-left:auto; margin-right:auto; animation:fadeUp .7s .2s both; }
  .hero-search { display:flex; gap:0; max-width:620px; margin:0 auto; background:white; border-radius:var(--r-lg); padding:7px; box-shadow:0 20px 60px rgba(0,0,0,.3); animation:fadeUp .7s .3s both; }
  .hero-search input { flex:1; border:none; outline:none; font-size:15px; padding:10px 14px; font-family:'Nunito',sans-serif; color:var(--ink); font-weight:600; background:transparent; }
  .hero-search input::placeholder { color:var(--muted); font-weight:400; }
  .hero-search-icon { padding:10px 14px; font-size:20px; display:flex; align-items:center; }
  .hero-chips { display:flex; gap:10px; flex-wrap:wrap; justify-content:center; margin-top:32px; animation:fadeUp .7s .4s both; }
  .hero-chip { background:rgba(255,255,255,.15); color:white; border:1.5px solid rgba(255,255,255,.25); padding:8px 20px; border-radius:99px; font-size:13px; font-weight:700; cursor:pointer; transition:all .2s; backdrop-filter:blur(8px); }
  .hero-chip:hover { background:rgba(255,255,255,.28); transform:translateY(-2px) scale(1.04); }

  /* ── TRUST BAR ── */
  .trust-bar { background:var(--white); border-bottom:2px solid var(--border); padding:16px 28px; display:flex; align-items:center; justify-content:center; gap:40px; flex-wrap:wrap; }
  .trust-item { display:flex; align-items:center; gap:8px; font-size:13px; font-weight:700; color:var(--ink-2); }

  /* ── STATS ── */
  .stats-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:18px; margin:40px 0; }
  .stat-card { background:var(--white); border:2px solid var(--border); border-radius:var(--r-lg); padding:28px 20px; text-align:center; box-shadow:var(--shadow-sm); transition:all .3s; position:relative; overflow:hidden; }
  .stat-card::before { content:''; position:absolute; inset:0; background:var(--grad1); opacity:0; transition:opacity .3s; }
  .stat-card:hover::before { opacity:.05; }
  .stat-card:hover { box-shadow:var(--shadow-lg); transform:translateY(-4px); border-color:rgba(255,107,0,.3); }
  .stat-icon { font-size:30px; margin-bottom:12px; animation:float 3s ease-in-out infinite; display:block; }
  .stat-num { font-family:'Baloo 2',sans-serif; font-size:34px; font-weight:800; background:var(--grad1); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .stat-label { font-size:13px; color:var(--muted); margin-top:5px; font-weight:700; }

  /* ── CATEGORY GRID ── */
  .cat-section { margin-bottom:52px; }
  .cat-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(110px,1fr)); gap:14px; }
  .cat-card { background:var(--white); border:2px solid var(--border); border-radius:var(--r-lg); padding:20px 10px; text-align:center; cursor:pointer; transition:all .3s cubic-bezier(.22,1,.36,1); box-shadow:var(--shadow-sm); position:relative; overflow:hidden; }
  .cat-card::after { content:''; position:absolute; inset:0; background:var(--grad1); opacity:0; transition:opacity .3s; }
  .cat-card:hover::after { opacity:.06; }
  .cat-card:hover { border-color:var(--saffron); box-shadow:var(--shadow-lg); transform:translateY(-5px) scale(1.03); }
  .cat-card:hover .cat-emoji { transform:scale(1.2) rotate(-8deg); }
  .cat-card:hover .cat-name { color:var(--saffron); }
  .cat-emoji { font-size:28px; margin-bottom:8px; display:block; transition:transform .3s; position:relative; z-index:1; }
  .cat-name { font-size:12px; font-weight:800; color:var(--ink-2); position:relative; z-index:1; transition:color .3s; }
  .cat-count { font-size:10.5px; color:var(--muted); margin-top:2px; font-weight:600; position:relative; z-index:1; }

  /* ── SERVICE CARD ── */
  .service-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:24px; }
  .service-card { background:var(--white); border:2px solid var(--border); border-radius:var(--r-lg); overflow:hidden; transition:all .3s cubic-bezier(.22,1,.36,1); cursor:pointer; box-shadow:var(--shadow-sm); }
  .service-card:hover { box-shadow:var(--shadow-xl); transform:translateY(-8px) scale(1.01); border-color:rgba(255,107,0,.4); }
  .service-card:hover .sc-img-emoji { transform:scale(1.15) rotate(-5deg); }
  .service-card:hover .sc-book-btn { opacity:1; transform:translateY(0); }
  .sc-img { height:160px; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; }
  .sc-img-bg { position:absolute; inset:0; opacity:1; }
  .sc-img-emoji { font-size:60px; position:relative; z-index:1; transition:transform .35s cubic-bezier(.22,1,.36,1); filter:drop-shadow(0 4px 12px rgba(0,0,0,.15)); }
  .sc-img-badge { position:absolute; top:12px; right:12px; z-index:2; }
  .sc-book-btn { position:absolute; bottom:12px; right:12px; z-index:2; opacity:0; transform:translateY(8px); transition:all .3s; }
  .sc-body { padding:18px 20px 22px; }
  .sc-name { font-family:'Baloo 2',sans-serif; font-weight:700; font-size:16.5px; margin-bottom:6px; color:var(--ink); }
  .sc-meta { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px; }
  .sc-desc { font-size:13px; color:var(--muted); line-height:1.55; margin-bottom:14px; font-weight:500; }
  .sc-footer { display:flex; align-items:center; justify-content:space-between; padding-top:12px; border-top:2px solid var(--border); }
  .sc-rating { display:flex; align-items:center; gap:5px; font-size:13px; font-weight:800; color:var(--ink-2); }
  .sc-price { font-family:'Baloo 2',sans-serif; font-size:16px; font-weight:800; color:var(--saffron); }
  .sc-city { font-size:12px; color:var(--muted); font-weight:600; }

  /* ── SECTION ── */
  .section-hd { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:28px; }
  .section-title { font-family:'Baloo 2',sans-serif; font-size:26px; font-weight:800; letter-spacing:-.03em; color:var(--ink); }
  .section-title span { color:var(--saffron); }
  .section-sub { font-size:14px; color:var(--muted); margin-top:5px; font-weight:600; }

  /* ── HOW IT WORKS ── */
  .how-section { background:linear-gradient(135deg,var(--saffron-l),#FFF8F0); border-radius:var(--r-xl); padding:52px 40px; margin:52px 0; border:2px solid rgba(255,107,0,.12); }
  .how-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:32px; margin-top:36px; }
  .how-step { text-align:center; }
  .how-num { width:56px; height:56px; border-radius:50%; background:var(--grad1); color:white; font-family:'Baloo 2',sans-serif; font-size:22px; font-weight:800; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; box-shadow:var(--shadow-md); animation:float 3s ease-in-out infinite; }
  .how-step:nth-child(2) .how-num { animation-delay:-.5s; }
  .how-step:nth-child(3) .how-num { animation-delay:-1s; }
  .how-step:nth-child(4) .how-num { animation-delay:-1.5s; }
  .how-icon { font-size:32px; margin-bottom:12px; display:block; }
  .how-title { font-family:'Baloo 2',sans-serif; font-size:17px; font-weight:800; margin-bottom:8px; }
  .how-desc { font-size:13.5px; color:var(--muted); line-height:1.6; font-weight:500; }

  /* ── TESTIMONIALS ── */
  .testimonial-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:20px; }
  .testimonial-card { background:var(--white); border:2px solid var(--border); border-radius:var(--r-lg); padding:24px; box-shadow:var(--shadow-sm); transition:all .3s; }
  .testimonial-card:hover { transform:translateY(-4px); box-shadow:var(--shadow-lg); border-color:rgba(255,107,0,.3); }
  .test-stars { color:var(--gold); font-size:16px; margin-bottom:12px; letter-spacing:2px; }
  .test-text { font-size:14px; color:var(--ink-3); line-height:1.65; font-style:italic; margin-bottom:16px; font-weight:500; }
  .test-author { display:flex; align-items:center; gap:12px; }
  .test-avatar { width:40px; height:40px; border-radius:50%; background:var(--grad1); color:white; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:16px; font-family:'Baloo 2',sans-serif; }
  .test-name { font-weight:800; font-size:14px; }
  .test-city { font-size:12px; color:var(--muted); font-weight:600; }

  /* ── FILTER BAR ── */
  .filter-bar { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px; align-items:center; }
  .filter-label { font-size:12px; font-weight:800; color:var(--muted); text-transform:uppercase; letter-spacing:.07em; }
  .chip { padding:8px 18px; border-radius:99px; font-size:13px; font-weight:700; cursor:pointer; border:2px solid var(--border); background:var(--white); transition:all .2s; color:var(--ink-3); font-family:'Nunito',sans-serif; }
  .chip:hover { border-color:var(--saffron); color:var(--saffron); transform:translateY(-1px); }
  .chip.active { background:var(--grad1); color:white; border-color:transparent; box-shadow:0 4px 14px rgba(255,107,0,.35); transform:translateY(-1px); }

  /* ── SEARCH ── */
  .search-inp-wrap { display:flex; align-items:center; gap:10px; background:var(--white); border:2px solid var(--border); border-radius:var(--r-lg); padding:4px 16px; box-shadow:var(--shadow-sm); transition:all .2s; }
  .search-inp-wrap:focus-within { border-color:var(--saffron); box-shadow:0 0 0 4px rgba(255,107,0,.1); transform:translateY(-1px); }
  .search-inp-wrap input { border:none; outline:none; font-size:15px; font-family:'Nunito',sans-serif; font-weight:600; color:var(--ink); background:transparent; width:100%; padding:10px 0; }

  /* ── DASHBOARD / SIDEBAR ── */
  .dash-layout { display:grid; grid-template-columns:270px 1fr; gap:28px; align-items:start; }
  .sidebar { background:var(--white); border:2px solid var(--border); border-radius:var(--r-xl); overflow:hidden; box-shadow:var(--shadow-sm); position:sticky; top:88px; }
  .sidebar-top { padding:32px 24px; background:linear-gradient(145deg,#1a0050,#FF4500,#FF6B00); color:white; text-align:center; position:relative; overflow:hidden; }
  .sidebar-top-orb { position:absolute; width:200px; height:200px; border-radius:50%; background:rgba(255,255,255,.08); top:-60px; right:-60px; }
  .sidebar-avatar { width:68px; height:68px; border-radius:50%; background:rgba(255,255,255,.2); color:white; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:28px; margin:0 auto 14px; border:3px solid rgba(255,255,255,.3); font-family:'Baloo 2',sans-serif; position:relative; }
  .sidebar-name { font-family:'Baloo 2',sans-serif; font-weight:700; font-size:17px; margin-bottom:4px; }
  .sidebar-email { font-size:12px; opacity:.7; margin-bottom:10px; }
  .sidebar-nav { padding:10px 0; }
  .sidebar-item { display:flex; align-items:center; gap:13px; padding:14px 24px; cursor:pointer; font-size:14px; font-weight:700; color:var(--ink-3); border-left:3px solid transparent; transition:all .2s; }
  .sidebar-item:hover { background:var(--saffron-l); color:var(--saffron); }
  .sidebar-item.active { background:var(--saffron-l); color:var(--saffron); border-left-color:var(--saffron); }
  .sidebar-icon { font-size:17px; width:22px; text-align:center; }

  /* ── KPI ── */
  .kpi-row { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:16px; }
  .kpi { background:var(--white); border:2px solid var(--border); border-radius:var(--r-lg); padding:22px 18px; box-shadow:var(--shadow-sm); transition:all .3s; position:relative; overflow:hidden; }
  .kpi::after { content:''; position:absolute; bottom:0; left:0; right:0; height:3px; background:var(--grad1); transform:scaleX(0); transform-origin:left; transition:transform .3s; }
  .kpi:hover::after { transform:scaleX(1); }
  .kpi:hover { transform:translateY(-3px); box-shadow:var(--shadow-md); }
  .kpi-icon { font-size:24px; margin-bottom:12px; }
  .kpi-val { font-family:'Baloo 2',sans-serif; font-size:32px; font-weight:800; line-height:1; }
  .kpi-label { font-size:12px; color:var(--muted); margin-top:6px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; }

  /* ── TABLE ── */
  .table-wrap { overflow-x:auto; border:2px solid var(--border); border-radius:var(--r); background:var(--white); }
  table { width:100%; border-collapse:collapse; font-size:14px; }
  thead { background:var(--saffron-l); }
  th { padding:13px 18px; text-align:left; font-size:11px; font-weight:800; color:var(--saffron); text-transform:uppercase; letter-spacing:.08em; border-bottom:2px solid var(--border); }
  td { padding:14px 18px; border-bottom:1.5px solid var(--border); color:var(--ink-3); font-weight:600; }
  tr:last-child td { border-bottom:none; }
  tr:hover td { background:#FFFAF5; }

  /* ── AUTH ── */
  .auth-wrap { min-height:100vh; display:grid; grid-template-columns:1fr 1fr; background:var(--surface); }
  .auth-left { background:linear-gradient(145deg,#1a0050 0%,#FF4500 50%,#FFD700 100%); display:flex; flex-direction:column; justify-content:center; align-items:center; padding:60px; position:relative; overflow:hidden; }
  .auth-left-orb { position:absolute; border-radius:50%; animation:orbFloat 6s ease-in-out infinite; }
  .auth-left-content { position:relative; text-align:center; color:white; }
  .auth-left h2 { font-size:38px; font-weight:800; line-height:1.15; margin-bottom:18px; letter-spacing:-.04em; }
  .auth-left p { font-size:16px; opacity:.75; line-height:1.7; font-weight:500; }
  .auth-left-logo { display:flex; align-items:center; gap:14px; margin-bottom:44px; justify-content:center; }
  .auth-left-logo-icon { width:56px; height:56px; border-radius:16px; background:rgba(255,255,255,.2); backdrop-filter:blur(10px); display:flex; align-items:center; justify-content:center; font-size:28px; border:2px solid rgba(255,255,255,.3); }
  .auth-left-logo-name { font-family:'Baloo 2',sans-serif; font-weight:800; font-size:24px; }
  .auth-right { display:flex; align-items:center; justify-content:center; padding:40px; }
  .auth-card { background:var(--white); border-radius:var(--r-xl); padding:48px; width:100%; max-width:430px; box-shadow:var(--shadow-xl); border:2px solid var(--border); animation:scaleIn .5s both; }
  .auth-title { font-family:'Baloo 2',sans-serif; font-size:28px; font-weight:800; margin-bottom:6px; letter-spacing:-.03em; }
  .auth-sub { font-size:14px; color:var(--muted); margin-bottom:32px; font-weight:600; }
  .auth-switch { text-align:center; font-size:14px; color:var(--muted); margin-top:22px; font-weight:600; }
  .auth-switch a { color:var(--saffron); cursor:pointer; font-weight:800; }
  .auth-demo { background:linear-gradient(135deg,var(--saffron-l),#fff8f0); border:2px solid rgba(255,107,0,.2); border-radius:var(--r); padding:14px 16px; margin-bottom:24px; font-size:13px; color:var(--ink-3); line-height:1.9; }

  /* ── MODAL ── */
  .modal-overlay { position:fixed; inset:0; background:rgba(26,0,0,.6); backdrop-filter:blur(6px); z-index:300; display:flex; align-items:center; justify-content:center; padding:24px; animation:fadeIn .2s both; }
  .modal { background:var(--white); border-radius:var(--r-xl); width:100%; max-width:540px; max-height:90vh; overflow-y:auto; box-shadow:var(--shadow-xl); animation:scaleIn .35s cubic-bezier(.22,1,.36,1) both; border:2px solid var(--border); }
  .modal-header { padding:28px 28px 0; display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; }
  .modal-title { font-family:'Baloo 2',sans-serif; font-size:22px; font-weight:800; }
  .modal-close { width:36px; height:36px; border-radius:10px; border:2px solid var(--border); background:var(--surface); cursor:pointer; font-size:16px; display:flex; align-items:center; justify-content:center; transition:all .2s; color:var(--ink-3); }
  .modal-close:hover { background:var(--red-l); color:var(--red); border-color:var(--red-l); transform:rotate(90deg); }
  .modal-body { padding:0 28px 28px; }

  /* ── PROVIDER DETAIL ── */
  .provider-hero { background:linear-gradient(145deg,#1a0050,#FF4500,#FF6B00); border-radius:var(--r-xl); padding:40px; color:white; margin-bottom:24px; position:relative; overflow:hidden; animation:fadeUp .6s both; }

  /* ── TOAST ── */
  .toast-wrap { position:fixed; bottom:28px; right:28px; z-index:400; display:flex; flex-direction:column; gap:12px; }
  .toast { background:var(--ink); color:white; padding:16px 22px; border-radius:var(--r-lg); font-size:14px; font-weight:700; box-shadow:var(--shadow-xl); display:flex; align-items:center; gap:12px; min-width:280px; animation:toastIn .35s cubic-bezier(.22,1,.36,1) both; font-family:'Nunito',sans-serif; border-left:4px solid var(--saffron); }
  .toast-success { border-left-color:var(--green); }
  .toast-error   { border-left-color:var(--red); }
  .toast-icon { width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0; }
  .toast-success .toast-icon { background:var(--green); }
  .toast-error   .toast-icon { background:var(--red); }

  /* ── EMPTY ── */
  .empty { text-align:center; padding:64px 24px; }
  .empty-icon { font-size:56px; margin-bottom:18px; animation:bounce 2s infinite; display:block; }
  .empty-title { font-family:'Baloo 2',sans-serif; font-size:22px; font-weight:800; margin-bottom:8px; }
  .empty-sub { font-size:14px; color:var(--muted); font-weight:600; }

  /* ── CTA BANNER ── */
  .cta-banner { background:linear-gradient(135deg,#1a0050,#FF4500,#FFD700); border-radius:var(--r-xl); padding:52px 44px; margin-top:52px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:24px; position:relative; overflow:hidden; }
  .cta-banner-orb { position:absolute; border-radius:50%; background:rgba(255,255,255,.08); pointer-events:none; }

  /* ── SPECIAL OFFER CARD ── */
  .offer-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:16px; margin-bottom:40px; }
  .offer-card { border-radius:var(--r-lg); padding:20px 22px; color:white; position:relative; overflow:hidden; cursor:pointer; transition:transform .3s; }
  .offer-card:hover { transform:translateY(-4px) scale(1.02); }
  .offer-card-bg { position:absolute; inset:0; opacity:.15; background:repeating-linear-gradient(45deg,white 0,white 1px,transparent 0,transparent 50%); background-size:14px 14px; }
  .offer-label { font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:.1em; opacity:.85; margin-bottom:6px; }
  .offer-title { font-family:'Baloo 2',sans-serif; font-size:19px; font-weight:800; margin-bottom:4px; }
  .offer-sub { font-size:13px; opacity:.8; font-weight:600; }
  .offer-tag { display:inline-block; background:rgba(255,255,255,.25); border:1px solid rgba(255,255,255,.3); border-radius:99px; padding:4px 12px; font-size:12px; font-weight:800; margin-top:12px; }

  /* ── UTILS ── */
  .flex { display:flex; } .flex-c { display:flex; align-items:center; }
  .flex-b { display:flex; align-items:center; justify-content:space-between; }
  .gap-2{gap:8px;}.gap-3{gap:12px;}.gap-4{gap:18px;}
  .mt-3{margin-top:12px;}.mt-4{margin-top:18px;}.mt-6{margin-top:28px;}
  .mb-4{margin-bottom:18px;}.mb-6{margin-bottom:28px;}
  .fw-7{font-weight:700;}.fw-8{font-weight:800;}
  .text-m{color:var(--muted);font-size:13.5px;font-weight:600;}
  .divider{height:2px;background:var(--border);margin:20px 0;}
  .star{color:var(--gold);}

  @media(max-width:900px){
    .auth-wrap{grid-template-columns:1fr;}
    .auth-left{display:none;}
    .dash-layout{grid-template-columns:1fr;}
    .sidebar{position:static;}
    .how-section{padding:36px 24px;}
  }
  @media(max-width:640px){
    .form-row{grid-template-columns:1fr;}
    .hero{padding:64px 20px;}
    .hero-search{flex-direction:column;border-radius:var(--r);}
    .page{padding:24px 16px;}
    .nav{padding:0 16px;}
    .nav-links{display:none;}
    .trust-bar{gap:20px;}
    .cta-banner{padding:32px 24px;}
  }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const DB = {
  get: k => { try { return JSON.parse(localStorage.getItem(k)) || []; } catch { return []; } },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  seed() {
    if (localStorage.getItem("_in_seeded")) return;
    this.set("users", [
      { id:1, name:"Admin User",      email:"admin@local.com",   password:"admin123", role:"admin",    phone:"9876543210", city:"Delhi",     joined:"2024-01-01" },
      { id:2, name:"Priya Sharma",    email:"priya@example.com", password:"priya123", role:"user",     phone:"9876543211", city:"Mumbai",    joined:"2024-02-10" },
      { id:3, name:"Raju Electricals",email:"raju@example.com",  password:"raju123",  role:"provider", phone:"9876543212", city:"Bengaluru", joined:"2024-03-05" },
    ]);
    this.set("providers", [
      { id:1,  name:"Sharma Plumbing Works",     category:"Plumbing",         description:"Master plumber with 12+ years experience. Pipe repair, bathroom fitting, tank cleaning.", city:"Delhi",       rating:4.8, reviews:234, price:"₹299/hr", priceNum:299, image:"🔧", available:true,  verified:true  },
      { id:2,  name:"Raju Electricals",          category:"Electrical",       description:"Certified electrician. Wiring, MCB, inverter installation, short circuit repair.", city:"Bengaluru",   rating:4.9, reviews:189, price:"₹349/hr", priceNum:349, image:"⚡", available:true,  verified:true  },
      { id:3,  name:"GreenLeaf Gardening",       category:"Gardening",        description:"Complete garden design, plant care, terrace garden, lawn mowing and trimming.", city:"Pune",         rating:4.6, reviews:97,  price:"₹249/hr", priceNum:249, image:"🌿", available:true,  verified:false },
      { id:4,  name:"CleanIndia Home Services",  category:"Home Cleaning",    description:"Deep cleaning, sofa cleaning, bathroom scrub, move-in/out. Eco-friendly products.", city:"Mumbai",      rating:4.7, reviews:401, price:"₹199/hr", priceNum:199, image:"🧹", available:true,  verified:true  },
      { id:5,  name:"CoolAir AC Services",       category:"AC Repair",        description:"All AC brands. Gas refill, servicing, installation and emergency repair.", city:"Chennai",     rating:4.8, reviews:278, price:"₹499/visit",priceNum:499, image:"❄️", available:true,  verified:true  },
      { id:6,  name:"QuickFix Carpentry",        category:"Carpentry",        description:"Custom furniture, wardrobe repair, door fitting, kitchen cabinets.", city:"Hyderabad",   rating:4.5, reviews:63,  price:"₹399/hr", priceNum:399, image:"🪚", available:false, verified:true  },
      { id:7,  name:"TechCare IT Support",       category:"IT & Computer",    description:"Laptop/PC repair, virus removal, data recovery, WiFi setup, CCTV installation.", city:"Bengaluru",   rating:4.4, reviews:51,  price:"₹349/hr", priceNum:349, image:"💻", available:true,  verified:false },
      { id:8,  name:"ColourCraft Painters",      category:"Painting",         description:"Interior & exterior painting, waterproofing, texture painting, wall putty.", city:"Delhi",       rating:4.7, reviews:142, price:"₹29/sqft",  priceNum:29,  image:"🎨", available:true,  verified:true  },
      { id:9,  name:"Vedic Pest Control",        category:"Pest Control",     description:"Cockroach, termite, mosquito, rats treatment. Annual AMC available.", city:"Mumbai",      rating:4.6, reviews:188, price:"₹799/visit",priceNum:799, image:"🐛", available:true,  verified:true  },
      { id:10, name:"AutoCare Mechanic",         category:"Vehicle Repair",   description:"Car & bike repair at doorstep. Oil change, battery, AC gas, tyre puncture.", city:"Pune",        rating:4.5, reviews:76,  price:"₹299/hr", priceNum:299, image:"🔩", available:true,  verified:true  },
      { id:11, name:"Sewak Home Security",       category:"CCTV & Security",  description:"CCTV installation, video door bell, smart lock, alarm system setup.", city:"Hyderabad",   rating:4.7, reviews:44,  price:"₹599/visit",priceNum:599, image:"📷", available:true,  verified:true  },
      { id:12, name:"AquaPure Water Services",   category:"Water Purifier",   description:"RO service, filter replacement, installation of all brands. AMC available.", city:"Chennai",     rating:4.6, reviews:93,  price:"₹299/visit",priceNum:299, image:"💧", available:true,  verified:false },
    ]);
    this.set("bookings", [
      { id:1, userId:2, providerId:1, providerName:"Sharma Plumbing Works",    service:"Plumbing",      date:"2025-07-10", time:"10:00", note:"Kitchen sink leak", status:"confirmed", created:"2025-07-01" },
      { id:2, userId:2, providerId:4, providerName:"CleanIndia Home Services", service:"Home Cleaning", date:"2025-07-15", time:"09:00", note:"Full home deep clean", status:"pending", created:"2025-07-05" },
    ]);
    localStorage.setItem("_in_seeded", "1");
  }
};

const ALL_CATS = [
  {name:"Plumbing",        emoji:"🔧"}, {name:"Electrical",      emoji:"⚡"},
  {name:"Home Cleaning",   emoji:"🧹"}, {name:"AC Repair",       emoji:"❄️"},
  {name:"Carpentry",       emoji:"🪚"}, {name:"Painting",        emoji:"🎨"},
  {name:"Pest Control",    emoji:"🐛"}, {name:"Gardening",       emoji:"🌿"},
  {name:"Vehicle Repair",  emoji:"🔩"}, {name:"IT & Computer",   emoji:"💻"},
  {name:"CCTV & Security", emoji:"📷"}, {name:"Water Purifier",  emoji:"💧"},
  {name:"Appliance Repair",emoji:"🔌"}, {name:"Packers & Movers",emoji:"📦"},
  {name:"Interior Design", emoji:"🛋️"}, {name:"Photography",     emoji:"📸"},
  {name:"Tutoring",        emoji:"📚"}, {name:"Yoga & Fitness",  emoji:"🧘"},
  {name:"Beauty & Salon",  emoji:"💇"}, {name:"Laundry",         emoji:"👕"},
  {name:"Cooking & Chef",  emoji:"👨‍🍳"}, {name:"Elder Care",      emoji:"👴"},
  {name:"Baby Sitting",    emoji:"👶"}, {name:"Astrology",       emoji:"🪐"},
  {name:"Vastu Shastra",   emoji:"🏠"}, {name:"Event Planning",  emoji:"🎉"},
  {name:"Wedding Services",emoji:"💍"}, {name:"Mehendi",         emoji:"🌺"},
  {name:"Music Lessons",   emoji:"🎵"}, {name:"Dance Classes",   emoji:"💃"},
];

const OFFERS = [
  { title:"First Booking 30% Off", sub:"Use code SWAGAT30", label:"New User Offer", tag:"Limited Time", bg:"linear-gradient(135deg,#FF6B00,#FF8C42)" },
  { title:"Book 3 Get 1 Free",     sub:"Any cleaning service", label:"Bundle Deal",   tag:"This Week",    bg:"linear-gradient(135deg,#138808,#0D9488)" },
  { title:"Festival Special 🎊",   sub:"Flat ₹200 off on AC service", label:"Festive Offer", tag:"Diwali Special", bg:"linear-gradient(135deg,#000080,#4F46E5)" },
  { title:"Refer & Earn ₹500",     sub:"For every successful referral", label:"Referral Bonus", tag:"Ongoing", bg:"linear-gradient(135deg,#EC4899,#F59E0B)" },
];

const TESTIMONIALS = [
  { text:"Booked a plumber through LocalSeva and he came within 2 hours! Excellent work, very professional. Will definitely use again.", name:"Ananya Kapoor", city:"Mumbai", rating:5 },
  { text:"Got my AC serviced before summer. The technician was certified, polite and very thorough. Price was very reasonable.", name:"Vikram Nair",   city:"Chennai", rating:5 },
  { text:"Deep cleaning service was outstanding. They cleaned every corner. My house looks brand new! Highly recommend.", name:"Sunita Patel",  city:"Ahmedabad", rating:5 },
  { text:"Pest control treatment done for entire flat. Very effective, no smell, and they gave 6 months guarantee. Great value.", name:"Rohan Mehta",   city:"Delhi", rating:5 },
  { text:"Hired a carpenter for custom wardrobe. Excellent craftsmanship and on time delivery. Really impressed with the quality.", name:"Kavya Reddy",   city:"Bengaluru", rating:4 },
  { text:"The photography team for our wedding was phenomenal! Captured every beautiful moment. Forever grateful to LocalSeva.", name:"Neha & Arjun",  city:"Jaipur", rating:5 },
];

// ─── CONTEXT ──────────────────────────────────────────────────────────────────
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

// ─── RIPPLE BUTTON ────────────────────────────────────────────────────────────
function RippleBtn({ className, onClick, children, ...props }) {
  const btn = useRef(null);
  const handleClick = e => {
    const rect = btn.current.getBoundingClientRect();
    const r = document.createElement("span");
    const d = Math.max(rect.width, rect.height);
    r.className = "btn-ripple";
    r.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX-rect.left-d/2}px;top:${e.clientY-rect.top-d/2}px`;
    btn.current.appendChild(r);
    setTimeout(() => r.remove(), 700);
    onClick && onClick(e);
  };
  return <button ref={btn} className={`btn ${className||""}`} onClick={handleClick} {...props}>{children}</button>;
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toasts({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <div className="toast-icon">{t.type==="success"?"✓":"✕"}</div>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav() {
  const { user, setUser, page, setPage } = useApp();
  return (
    <nav className="nav">
      <div className="nav-brand" onClick={() => setPage("home")}>
        <div className="nav-logo">🇮🇳</div>
        <span className="nav-brand-t1">Local</span><span className="nav-brand-t2">Seva</span><span className="nav-brand-t3">.in</span>
      </div>
      <div className="nav-links">
        {[["home","🏠 Home"],["search","🔍 Services"],user&&["dashboard","📊 Dashboard"],user?.role==="admin"&&["admin","⚙️ Admin"]].filter(Boolean).map(([p,l]) => (
          <button key={p} className={`nav-link${page===p?" active":""}`} onClick={()=>setPage(p)}>{l}</button>
        ))}
      </div>
      <div className="nav-actions">
        {user ? (
          <>
            <div className="avatar" title={user.name}>{user.name[0]}</div>
            <RippleBtn className="btn-secondary btn-sm" onClick={()=>{setUser(null);setPage("home");}}>Sign out</RippleBtn>
          </>
        ) : (
          <>
            <RippleBtn className="btn-ghost btn-sm" onClick={()=>setPage("login")}>Sign in</RippleBtn>
            <RippleBtn className="btn-primary btn-sm" onClick={()=>setPage("register")}>Register Free</RippleBtn>
          </>
        )}
      </div>
    </nav>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function Home() {
  const { setPage, setSearchQ } = useApp();
  const [q, setQ] = useState("");
  const providers = DB.get("providers");
  const bookings  = DB.get("bookings");
  const search = t => { setSearchQ(t||q); setPage("search"); };

  const marqueeMsgs = ["✅ 100% Verified Professionals","🏆 Trusted by 50,000+ Families","⚡ Book in under 2 Minutes","🇮🇳 Serving 50+ Cities Across India","💰 Best Prices Guaranteed","🔒 Safe & Secure Payments","⭐ 4.8/5 Average Rating","📞 24/7 Customer Support"];

  return (
    <div>
      {/* Marquee */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...marqueeMsgs,...marqueeMsgs].map((m,i)=>(
            <div key={i} className="marquee-item"><span className="marquee-dot"/>{m}</div>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div className="hero">
        {[{w:500,h:500,style:{top:"-150px",left:"-100px",animationDelay:"0s"}},{w:400,h:400,style:{bottom:"-100px",right:"-80px",animationDelay:"-3s"}},{w:280,h:280,style:{top:"40%",left:"55%",animationDelay:"-6s"}}].map((o,i)=>(
          <div key={i} className="hero-orb" style={{width:o.w,height:o.h,...o.style,background:`radial-gradient(circle,rgba(255,${i===0?215:i===1?69:255},0,.35) 0%,transparent 70%)`}} />
        ))}
        {Array.from({length:8}).map((_,i)=>(
          <div key={i} className="particle" style={{left:`${10+i*11}%`,top:`${20+Math.sin(i)*40}%`,animationDelay:`${i*.4}s`,animationDuration:`${3+i*.3}s`}} />
        ))}
        <div className="hero-content">
          <div className="hero-badge"><div className="hero-badge-live"><div className="hero-badge-dot"/>Live</div> 2,400+ providers online now</div>
          <h1>India's Most Trusted<br/><span className="hero-hl">Home Services</span><br/>Platform</h1>
          <p>Book verified local professionals for any home or office need — plumbing, cleaning, AC, electrical and 25+ more services.</p>
          <div className="hero-search">
            <div className="hero-search-icon">🔍</div>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search plumbing, AC repair, cleaning…" onKeyDown={e=>e.key==="Enter"&&search()} />
            <RippleBtn className="btn-primary" style={{borderRadius:"10px",margin:"2px"}} onClick={()=>search()}>Search</RippleBtn>
          </div>
          <div className="hero-chips">
            {["AC Repair","Plumbing","Cleaning","Pest Control","Carpentry","Painting"].map(c=>(
              <span key={c} className="hero-chip" onClick={()=>search(c)}>{ALL_CATS.find(x=>x.name===c)?.emoji} {c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="trust-bar">
        {[["🛡️","100% Verified Pros"],["⚡","2-Hour Response"],["💯","Satisfaction Guarantee"],["📞","24/7 Support"],["🏅","ISI Certified"]].map(([i,t])=>(
          <div key={t} className="trust-item">{i} {t}</div>
        ))}
      </div>

      <div className="page">
        {/* Offer cards */}
        <div className="section-hd animate-fade-up">
          <div><div className="section-title">🎁 Special <span>Offers</span></div><div className="section-sub">Limited time deals just for you</div></div>
        </div>
        <div className="offer-grid animate-fade-up delay-1">
          {OFFERS.map((o,i)=>(
            <div key={i} className="offer-card" style={{background:o.bg}} onClick={()=>setPage("search")}>
              <div className="offer-card-bg"/>
              <div className="offer-label">{o.label}</div>
              <div className="offer-title">{o.title}</div>
              <div className="offer-sub">{o.sub}</div>
              <div className="offer-tag">{o.tag}</div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="stats-grid animate-fade-up delay-2">
          {[{icon:"🏢",num:`${providers.length * 200}+`,label:"Service Providers"},{icon:"📅",num:`${bookings.length+52840}+`,label:"Bookings Done"},{icon:"🗺️",num:"50+",label:"Cities Covered"},{icon:"⭐",num:"4.8/5",label:"Avg Rating"},{icon:"👨‍👩‍👧",num:"1L+",label:"Happy Families"}].map(s=>(
            <div key={s.label} className="stat-card">
              <span className="stat-icon" style={{animationDelay:`${Math.random()*2}s`}}>{s.icon}</span>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* How it Works */}
        <div className="how-section animate-fade-up">
          <div className="section-title" style={{textAlign:"center"}}>How <span>LocalSeva</span> Works</div>
          <div className="section-sub" style={{textAlign:"center",marginTop:8}}>Get professional help in 4 simple steps</div>
          <div className="how-grid">
            {[{n:1,icon:"🔍",title:"Search Service",desc:"Browse 30+ categories and find the service you need"},{n:2,icon:"👷",title:"Choose Provider",desc:"Pick from verified professionals with real reviews"},{n:3,icon:"📅",title:"Book Instantly",desc:"Select date & time that suits you. Confirm in seconds"},{n:4,icon:"✅",title:"Job Done!",desc:"Professional arrives, completes work, you pay safely"}].map(s=>(
              <div key={s.n} className="how-step">
                <div className="how-num">{s.n}</div>
                <span className="how-icon">{s.icon}</span>
                <div className="how-title">{s.title}</div>
                <div className="how-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="section-hd animate-fade-up">
          <div><div className="section-title">Browse <span>30+ Categories</span></div><div className="section-sub">Every home service under one roof</div></div>
        </div>
        <div className="cat-grid cat-section">
          {ALL_CATS.map((c,i)=>{
            const cnt = providers.filter(p=>p.category===c.name).length;
            return (
              <div key={c.name} className="cat-card animate-fade-up" style={{animationDelay:`${i*.03}s`}} onClick={()=>{setSearchQ(c.name);setPage("search");}}>
                <span className="cat-emoji">{c.emoji}</span>
                <div className="cat-name">{c.name}</div>
                <div className="cat-count">{cnt>0?`${cnt} provider${cnt!==1?"s":""}` : "Coming soon"}</div>
              </div>
            );
          })}
        </div>

        {/* Featured Providers */}
        <div className="section-hd animate-fade-up">
          <div><div className="section-title">Top Rated <span>Providers</span></div><div className="section-sub">Verified professionals with excellent reviews</div></div>
          <RippleBtn className="btn-secondary btn-sm" onClick={()=>setPage("search")}>View all →</RippleBtn>
        </div>
        <div className="service-grid animate-fade-up delay-1">
          {providers.filter(p=>p.verified).slice(0,6).map(p=><ServiceCard key={p.id} p={p}/>)}
        </div>

        {/* Testimonials */}
        <div className="section-hd mt-6 animate-fade-up">
          <div><div className="section-title">What Our <span>Customers Say</span></div><div className="section-sub">Real reviews from real people across India</div></div>
        </div>
        <div className="testimonial-grid animate-fade-up delay-1">
          {TESTIMONIALS.map((t,i)=>(
            <div key={i} className="testimonial-card" style={{animationDelay:`${i*.1}s`}}>
              <div className="test-stars">{"★".repeat(t.rating)}</div>
              <div className="test-text">"{t.text}"</div>
              <div className="test-author">
                <div className="test-avatar">{t.name[0]}</div>
                <div><div className="test-name">{t.name}</div><div className="test-city">📍 {t.city}</div></div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="cta-banner animate-fade-up">
          <div className="cta-banner-orb" style={{width:300,height:300,top:-100,right:80}}/>
          <div style={{position:"relative"}}>
            <div style={{fontFamily:"'Baloo 2',sans-serif",fontSize:"clamp(22px,3vw,32px)",fontWeight:800,color:"white",marginBottom:10}}>Are you a skilled professional? 🛠️</div>
            <div style={{color:"rgba(255,255,255,.75)",fontSize:16,fontWeight:600}}>Join 2,400+ providers earning ₹40,000–₹1,50,000/month on LocalSeva.</div>
          </div>
          <RippleBtn className="btn-lg btn-shine" onClick={()=>setPage("register")} style={{borderRadius:"var(--r-lg)"}}>Join as Provider →</RippleBtn>
        </div>
      </div>
    </div>
  );
}

// ─── SERVICE CARD ─────────────────────────────────────────────────────────────
const catBg = {"Plumbing":"#DBEAFE","Electrical":"#FEF9C3","Home Cleaning":"#DCFCE7","AC Repair":"#EDE9FE","Carpentry":"#FEF3C7","Painting":"#FCE7F3","Pest Control":"#F0FDF4","Gardening":"#DCFCE7","Vehicle Repair":"#FFF7ED","IT & Computer":"#E0F2FE","CCTV & Security":"#F3F4F6","Water Purifier":"#E0F2FE"};

function ServiceCard({ p }) {
  const { setSelectedProvider, setPage } = useApp();
  const go = () => { setSelectedProvider(p); setPage("provider"); };
  return (
    <div className="service-card" onClick={go}>
      <div className="sc-img" style={{background:catBg[p.category]||"#FFF3E8"}}>
        <span className="sc-img-emoji">{p.image}</span>
        <div className="sc-img-badge">
          {!p.available && <span className="badge badge-red">Unavailable</span>}
        </div>
        <div className="sc-book-btn">
          <span className="badge badge-orange">Book Now →</span>
        </div>
      </div>
      <div className="sc-body">
        <div className="sc-name">{p.name}</div>
        <div className="sc-meta">
          <span className="badge badge-orange">{p.category}</span>
          {p.verified && <span className="badge badge-green">✓ Verified</span>}
          <span className="sc-city">📍 {p.city}</span>
        </div>
        <div className="sc-desc">{p.description.slice(0,80)}…</div>
        <div className="sc-footer">
          <div className="sc-rating"><span>⭐</span> {p.rating} <span style={{color:"var(--muted)",fontWeight:500}}>({p.reviews})</span></div>
          <div className="sc-price">{p.price}</div>
        </div>
      </div>
    </div>
  );
}

// ─── SEARCH ───────────────────────────────────────────────────────────────────
function Search() {
  const { searchQ, setSearchQ, setSelectedProvider, setPage } = useApp();
  const [q, setQ]   = useState(searchQ||"");
  const [cat, setCat] = useState("All");
  const [city, setCity] = useState("All");
  const [sort, setSort] = useState("rating");
  const [verOnly, setVerOnly] = useState(false);
  useEffect(()=>setQ(searchQ||""),[searchQ]);

  const providers = DB.get("providers");
  const cities = ["All",...new Set(providers.map(p=>p.city))];

  const results = providers
    .filter(p=>!q||p.name.toLowerCase().includes(q.toLowerCase())||p.category.toLowerCase().includes(q.toLowerCase())||p.description.toLowerCase().includes(q.toLowerCase()))
    .filter(p=>cat==="All"||p.category===cat)
    .filter(p=>city==="All"||p.city===city)
    .filter(p=>!verOnly||p.verified)
    .sort((a,b)=>sort==="rating"?b.rating-a.rating:sort==="price"?a.priceNum-b.priceNum:b.reviews-a.reviews);

  return (
    <div className="page">
      <div className="section-hd mb-6 animate-fade-up">
        <div><div className="section-title">Find a <span>Service Provider</span></div><div className="section-sub">{results.length} result{results.length!==1?"s":""} found across India</div></div>
      </div>
      <div style={{display:"flex",gap:12,marginBottom:24,flexWrap:"wrap"}} className="animate-fade-up delay-1">
        <div className="search-inp-wrap" style={{flex:1,minWidth:250}}>
          <span style={{fontSize:18}}>🔍</span>
          <input value={q} onChange={e=>{setQ(e.target.value);setSearchQ(e.target.value);}} placeholder="Search services, providers…"/>
        </div>
        <select className="form-select" style={{width:"auto",borderRadius:"var(--r-lg)"}} value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="rating">⭐ Top Rated</option>
          <option value="price">💰 Lowest Price</option>
          <option value="reviews">💬 Most Reviews</option>
        </select>
      </div>
      <div className="filter-bar animate-fade-up delay-2">
        <span className="filter-label">Category:</span>
        <span className={`chip${cat==="All"?" active":""}`} onClick={()=>setCat("All")}>All</span>
        {ALL_CATS.map(c=><span key={c.name} className={`chip${cat===c.name?" active":""}`} onClick={()=>setCat(c.name)}>{c.emoji} {c.name}</span>)}
      </div>
      <div className="filter-bar animate-fade-up delay-3">
        <span className="filter-label">City:</span>
        {cities.map(c=><span key={c} className={`chip${city===c?" active":""}`} onClick={()=>setCity(c)}>{c}</span>)}
        <span className={`chip${verOnly?" active":""}`} onClick={()=>setVerOnly(!verOnly)}>✓ Verified only</span>
      </div>
      {results.length===0
        ? <div className="empty animate-scale-in"><span className="empty-icon">🔍</span><div className="empty-title">No providers found</div><div className="empty-sub">Try different filters or search keywords.</div></div>
        : <div className="service-grid animate-fade-up delay-2">{results.map(p=><ServiceCard key={p.id} p={p}/>)}</div>
      }
    </div>
  );
}

// ─── PROVIDER DETAIL ──────────────────────────────────────────────────────────
function ProviderDetail() {
  const { selectedProvider:p, user, setPage } = useApp();
  const [showBook, setShowBook] = useState(false);
  if (!p) return null;

  return (
    <div className="page page-md">
      <RippleBtn className="btn-ghost btn-sm mb-4" onClick={()=>setPage("search")}>← Back to results</RippleBtn>
      <div className="provider-hero">
        <div style={{position:"absolute",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,215,0,.3) 0%,transparent 70%)",top:-80,right:-80,pointerEvents:"none"}}/>
        <div style={{display:"flex",gap:24,alignItems:"flex-start",flexWrap:"wrap",position:"relative"}}>
          <div style={{width:88,height:88,background:"rgba(255,255,255,.15)",border:"2px solid rgba(255,255,255,.25)",borderRadius:"var(--r-lg)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:44,flexShrink:0,backdropFilter:"blur(8px)"}}>{p.image}</div>
          <div style={{flex:1}}>
            <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",marginBottom:12}}>
              <h1 style={{fontFamily:"'Baloo 2',sans-serif",fontSize:26,fontWeight:800,letterSpacing:"-.03em"}}>{p.name}</h1>
              {p.verified && <span className="badge badge-green">✓ Verified</span>}
              {!p.available && <span className="badge badge-red">Unavailable</span>}
            </div>
            <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:14,opacity:.85}}>
              <span style={{fontSize:14,fontWeight:700}}>📍 {p.city}</span>
              <span style={{fontSize:14,fontWeight:700}}>💰 {p.price}</span>
              <span style={{fontSize:14,fontWeight:700}}>🗂️ {p.category}</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><span style={{color:"var(--gold)",fontSize:18}}>{"★".repeat(Math.floor(p.rating))}</span><strong style={{fontSize:16}}>{p.rating}</strong><span style={{opacity:.65}}>({p.reviews} reviews)</span></div>
            <p style={{color:"rgba(255,255,255,.8)",lineHeight:1.7,fontSize:15,fontWeight:500}}>{p.description}</p>
          </div>
        </div>
      </div>
      <div className="card animate-fade-up">
        <div style={{fontFamily:"'Baloo 2',sans-serif",fontWeight:800,fontSize:20,marginBottom:18}}>📅 Book This Service</div>
        {p.available
          ? <RippleBtn className="btn-primary btn-lg" onClick={()=>user?setShowBook(true):setPage("login")}>Book Now — {p.price}</RippleBtn>
          : <button className="btn btn-secondary btn-lg" disabled>Currently Unavailable</button>}
        {!user && <span className="text-m" style={{marginLeft:16}}>Sign in for booking </span>}
      </div>
      {showBook && <BookingModal provider={p} onClose={()=>setShowBook(false)}/>}
    </div>
  );
}

// ─── BOOKING MODAL ────────────────────────────────────────────────────────────
function BookingModal({ provider, onClose }) {
  const { user, showToast } = useApp();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [note, setNote] = useState("");
  const [address, setAddress] = useState(user?.city||"");
  const [busy, setBusy] = useState(false);

  const submit = () => {
    if (!date) return showToast("Please select a date.", "error");
    if (!address) return showToast("Please enter your address.", "error");
    setBusy(true);
    const nb = { id:Date.now(), userId:user.id, providerId:provider.id, providerName:provider.name, service:provider.category, date, time, note, address, status:"pending", created:new Date().toISOString().split("T")[0] };
    DB.set("bookings",[...DB.get("bookings"),nb]);
    setTimeout(()=>{ setBusy(false); showToast("🎉 Booking request sent! Provider will confirm soon.","success"); onClose(); }, 800);
  };

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Book Service</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{background:"linear-gradient(135deg,var(--saffron-l),#fff8f0)",border:"2px solid rgba(255,107,0,.15)",borderRadius:"var(--r)",padding:"16px 18px",marginBottom:22,display:"flex",gap:14,alignItems:"center"}}>
            <span style={{fontSize:34}}>{provider.image}</span>
            <div><div style={{fontWeight:800,fontSize:16}}>{provider.name}</div><div className="text-m">{provider.category} · {provider.price}</div></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Date *</label><input className="form-input" type="date" value={date} onChange={e=>setDate(e.target.value)} min={new Date().toISOString().split("T")[0]}/></div>
            <div className="form-group"><label className="form-label">Preferred Time</label><select className="form-select" value={time} onChange={e=>setTime(e.target.value)}>{["07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"].map(t=><option key={t}>{t}</option>)}</select></div>
          </div>
          <div className="form-group"><label className="form-label">Full Address *</label><input className="form-input" value={address} onChange={e=>setAddress(e.target.value)} placeholder="Flat no., Street, Area, City, Pincode"/></div>
          <div className="form-group"><label className="form-label">Job Description</label><textarea className="form-textarea" value={note} onChange={e=>setNote(e.target.value)} placeholder="Describe what you need done in detail…"/></div>
          <RippleBtn className="btn-primary btn-block btn-lg" onClick={submit} disabled={busy}>{busy?"Submitting…":"Confirm Booking Request 🎉"}</RippleBtn>
          <p className="text-m mt-3" style={{textAlign:"center"}}>🔒 Secure booking • Provider confirms within 2 hours</p>
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function Login() {
  const { setUser, setPage, showToast } = useApp();
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [err, setErr]     = useState("");

  const submit = () => {
    const u = DB.get("users").find(u=>u.email===email&&u.password===pass);
    if (!u) { setErr("Invalid email or password."); return; }
    setUser(u); showToast(`🎉 Welcome back, ${u.name}!`,"success");
    setPage(u.role==="admin"?"admin":"dashboard");
  };

  return (
    <div className="auth-wrap">
      <div className="auth-left">
        <div className="auth-left-orb" style={{width:400,height:400,background:"radial-gradient(circle,rgba(255,215,0,.35) 0%,transparent 70%)",top:-100,left:-100}}/>
        <div className="auth-left-orb" style={{width:300,height:300,background:"radial-gradient(circle,rgba(236,72,153,.3) 0%,transparent 70%)",bottom:-60,right:-60,animationDelay:"-3s"}}/>
        <div className="auth-left-content animate-slide-l">
          <div className="auth-left-logo"><div className="auth-left-logo-icon">🇮🇳</div><div className="auth-left-logo-name">LocalSeva.in</div></div>
          <h2>Your city's best<br/>service pros,<br/>one tap away.</h2>
          <p style={{marginTop:16}}>Join 1 lakh+ families booking trusted home services every day across all over India.</p>
          <div style={{display:"flex",gap:16,justifyContent:"center",marginTop:36,flexWrap:"wrap"}}>
            {["🔧 Plumbing","⚡ Electrical","🧹 Cleaning","❄️ AC Repair"].map(s=><div key={s} style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.25)",borderRadius:"99px",padding:"8px 16px",fontSize:13,fontWeight:700,backdropFilter:"blur(8px)"}}>{s}</div>)}
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card animate-slide-r">
          <div style={{fontFamily:"'Baloo 2',sans-serif",fontSize:28,fontWeight:800,marginBottom:6}}>Welcome back 🙏</div>
          <div className="auth-sub">Sign in to manage your bookings</div>
          <div className="auth-demo">

            {/* HERE ARE THE DEMO AACOUNTS FOR USE */}
            
            <strong>Demo Accounts:</strong><br/>
            👤 admin@local.com / admin123 (Admin)<br/>
            👤 priya@example.com / priya123 (User)<br/>
            👤 raju@example.com / raju123 (Provider)
          </div>
          {err && <div style={{background:"var(--red-l)",color:"var(--red)",borderRadius:"var(--r)",padding:"12px 16px",marginBottom:16,fontSize:13,fontWeight:700,border:"2px solid var(--red-l)"}}>{err}</div>}
          <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></div>
          <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&submit()}/></div>
          <RippleBtn className="btn-primary btn-block btn-lg" onClick={submit}>Sign In 🚀</RippleBtn>
          <div className="auth-switch">No account? <a onClick={()=>setPage("register")}>Register free</a></div>
        </div>
      </div>
    </div>
  );
}

// ─── REGISTER ─────────────────────────────────────────────────────────────────
function Register() {
  const { setUser, setPage, showToast } = useApp();
  const [form, setForm] = useState({name:"",email:"",password:"",phone:"",city:"",role:"user"});
  const [err, setErr] = useState("");
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const submit = () => {
    if (!form.name||!form.email||!form.password) { setErr("Please fill all required fields."); return; }
    if (form.password.length<6) { setErr("Password must be at least 6 characters."); return; }
    if (DB.get("users").find(u=>u.email===form.email)) { setErr("Email already registered."); return; }
    const nu = {...form,id:Date.now(),joined:new Date().toISOString().split("T")[0]};
    DB.set("users",[...DB.get("users"),nu]);
    setUser(nu); showToast("🎉 Account created! Welcome to LocalSeva!","success"); setPage("dashboard");
  };

  return (
    <div className="auth-wrap">
      <div className="auth-left">
        <div className="auth-left-orb" style={{width:400,height:400,background:"radial-gradient(circle,rgba(255,215,0,.35) 0%,transparent 70%)",top:-100,left:-100}}/>
        <div className="auth-left-content animate-slide-l">
          <div className="auth-left-logo"><div className="auth-left-logo-icon">🇮🇳</div><div className="auth-left-logo-name">LocalSeva.in</div></div>
          <h2>Join India's fastest growing home services network.</h2>
          <p style={{marginTop:16}}>Free registration. No commission for first 3 months for new providers.</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card animate-slide-r">
          <div style={{fontFamily:"'Baloo 2',sans-serif",fontSize:28,fontWeight:800,marginBottom:6}}>Create Account 🚀</div>
          <div className="auth-sub">Free to join. Start booking in minutes.</div>
          {err && <div style={{background:"var(--red-l)",color:"var(--red)",borderRadius:"var(--r)",padding:"12px 16px",marginBottom:16,fontSize:13,fontWeight:700}}>{err}</div>}
          <div className="form-row">
            <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" value={form.name} onChange={f("name")} placeholder="Ramesh Kumar"/></div>
            <div className="form-group"><label className="form-label">Mobile No.</label><input className="form-input" value={form.phone} onChange={f("phone")} placeholder="98765 43210"/></div>
          </div>
          <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" value={form.email} onChange={f("email")} placeholder="you@example.com"/></div>
          <div className="form-group"><label className="form-label">Password *</label><input className="form-input" type="password" value={form.password} onChange={f("password")} placeholder="Min 6 characters"/></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">City</label><input className="form-input" value={form.city} onChange={f("city")} placeholder="Mumbai, Delhi…"/></div>
            <div className="form-group"><label className="form-label">I am a…</label><select className="form-select" value={form.role} onChange={f("role")}><option value="user">Customer</option><option value="provider">Service Provider</option></select></div>
          </div>
          <RippleBtn className="btn-primary btn-block btn-lg" onClick={submit}>Create Free Account 🎉</RippleBtn>
          <div className="auth-switch">Have an account? <a onClick={()=>setPage("login")}>Sign in</a></div>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard() {
  const { user, setPage, showToast } = useApp();
  const [tab, setTab] = useState("overview");
  const [bookings, setBookings] = useState(DB.get("bookings").filter(b=>b.userId===user?.id));
  const refresh = () => setBookings(DB.get("bookings").filter(b=>b.userId===user?.id));
  const cancel = id => { DB.set("bookings",DB.get("bookings").map(b=>b.id===id?{...b,status:"cancelled"}:b)); refresh(); showToast("Booking cancelled.","success"); };
  const sb = s => ({pending:"badge-gold",confirmed:"badge-green",cancelled:"badge-red",completed:"badge-navy"}[s]||"badge-gray");

  const nav = [{id:"overview",icon:"📊",label:"Overview"},{id:"bookings",icon:"📅",label:"My Bookings"},{id:"profile",icon:"👤",label:"Profile"}];

  return (
    <div className="page">
      <div style={{fontFamily:"'Baloo 2',sans-serif",fontSize:28,fontWeight:800,marginBottom:24}} className="animate-fade-up">My Dashboard 🏠</div>
      <div className="dash-layout">
        <div className="sidebar animate-slide-l">
          <div className="sidebar-top"><div className="sidebar-top-orb"/>
            <div className="sidebar-avatar">{user.name[0]}</div>
            <div className="sidebar-name">{user.name}</div>
            <div className="sidebar-email">{user.email}</div>
            <span className="badge badge-orange" style={{textTransform:"capitalize"}}>{user.role}</span>
          </div>
          <div className="sidebar-nav">
            {nav.map(t=><div key={t.id} className={`sidebar-item${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}><span className="sidebar-icon">{t.icon}</span>{t.label}</div>)}
            <div className="sidebar-item" onClick={()=>setPage("search")}><span className="sidebar-icon">🔍</span>Find Services</div>
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:22}} className="animate-fade-up delay-1">
          {tab==="overview" && <>
            <div className="kpi-row">
              {[{icon:"📋",val:bookings.length,label:"Total Bookings",color:"var(--saffron)"},{icon:"⏳",val:bookings.filter(b=>b.status==="pending").length,label:"Pending",color:"var(--gold)"},{icon:"✅",val:bookings.filter(b=>b.status==="confirmed").length,label:"Confirmed",color:"var(--green)"},{icon:"✕",val:bookings.filter(b=>b.status==="cancelled").length,label:"Cancelled",color:"var(--red)"}].map(k=>(
                <div key={k.label} className="kpi"><div className="kpi-icon">{k.icon}</div><div className="kpi-val" style={{color:k.color}}>{k.val}</div><div className="kpi-label">{k.label}</div></div>
              ))}
            </div>
            <div className="card">
              <div style={{fontFamily:"'Baloo 2',sans-serif",fontWeight:800,fontSize:20,marginBottom:20}}>Recent Bookings</div>
              {bookings.length===0
                ? <div className="empty" style={{padding:32}}><span className="empty-icon">📅</span><div className="empty-title">No bookings yet</div><div className="empty-sub">Find a service and make your first booking!</div><RippleBtn className="btn-primary mt-4" onClick={()=>setPage("search")}>Browse Services</RippleBtn></div>
                : <div className="table-wrap"><table><thead><tr><th>Provider</th><th>Service</th><th>Date</th><th>Status</th></tr></thead><tbody>{bookings.slice(0,5).map(b=><tr key={b.id}><td><strong style={{color:"var(--ink)"}}>{b.providerName}</strong></td><td>{b.service}</td><td>{b.date} · {b.time}</td><td><span className={`badge ${sb(b.status)}`}>{b.status}</span></td></tr>)}</tbody></table></div>
              }
            </div>
          </>}

          {tab==="bookings" && (
            <div className="card">
              <div className="flex-b mb-4"><div style={{fontFamily:"'Baloo 2',sans-serif",fontWeight:800,fontSize:20}}>All Bookings ({bookings.length})</div><RippleBtn className="btn-primary btn-sm" onClick={()=>setPage("search")}>+ New Booking</RippleBtn></div>
              {bookings.length===0
                ? <div className="empty" style={{padding:32}}><span className="empty-icon">📅</span><div className="empty-title">No bookings yet</div><RippleBtn className="btn-primary mt-4" onClick={()=>setPage("search")}>Browse Services</RippleBtn></div>
                : <div style={{display:"flex",flexDirection:"column",gap:14}}>{bookings.map(b=>(
                    <div key={b.id} style={{background:"var(--saffron-l)",borderRadius:"var(--r-lg)",padding:"18px 20px",border:"2px solid rgba(255,107,0,.15)"}}>
                      <div className="flex-b" style={{flexWrap:"wrap",gap:10}}>
                        <div><div style={{fontWeight:800,fontSize:15,marginBottom:4}}>{b.providerName}</div><div className="text-m">{b.service} · {b.date} at {b.time}</div>{b.note&&<div className="text-m mt-3">📝 {b.note}</div>}{b.address&&<div className="text-m">📍 {b.address}</div>}</div>
                        <div style={{display:"flex",alignItems:"center",gap:10}}><span className={`badge ${sb(b.status)}`}>{b.status}</span>{["pending","confirmed"].includes(b.status)&&<RippleBtn className="btn-danger btn-sm" onClick={()=>cancel(b.id)}>Cancel</RippleBtn>}</div>
                      </div>
                    </div>
                  ))}</div>
              }
            </div>
          )}

          {tab==="profile" && <ProfileEdit/>}
        </div>
      </div>
    </div>
  );
}

function ProfileEdit() {
  const { user, setUser, showToast } = useApp();
  const [form, setForm] = useState({name:user.name,phone:user.phone||"",city:user.city||""});
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}));
  const save = () => { DB.set("users",DB.get("users").map(u=>u.id===user.id?{...u,...form}:u)); setUser({...user,...form}); showToast("Profile updated! ✅","success"); };
  return (
    <div className="card">
      <div style={{fontFamily:"'Baloo 2',sans-serif",fontWeight:800,fontSize:20,marginBottom:24}}>Edit Profile 👤</div>
      <div className="form-row">
        <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={f("name")}/></div>
        <div className="form-group"><label className="form-label">Mobile No.</label><input className="form-input" value={form.phone} onChange={f("phone")}/></div>
      </div>
      <div className="form-group"><label className="form-label">City</label><input className="form-input" value={form.city} onChange={f("city")}/></div>
      <div className="form-group"><label className="form-label">Email (read only)</label><input className="form-input" value={user.email} disabled style={{opacity:.5}}/></div>
      <RippleBtn className="btn-primary" onClick={save}>Save Changes ✅</RippleBtn>
    </div>
  );
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────
function Admin() {
  const { user, showToast } = useApp();
  const [tab, setTab]           = useState("overview");
  const [users, setUsers]       = useState(DB.get("users"));
  const [providers, setProvs]   = useState(DB.get("providers"));
  const [bookings, setBooks]    = useState(DB.get("bookings"));
  const refresh = () => { setUsers(DB.get("users")); setProvs(DB.get("providers")); setBooks(DB.get("bookings")); };
  if (user?.role!=="admin") return <div className="page"><div className="empty"><span className="empty-icon">🔒</span><div className="empty-title">Access denied</div></div></div>;

  const upBook = (id,status) => { DB.set("bookings",DB.get("bookings").map(b=>b.id===id?{...b,status}:b)); refresh(); showToast(`Booking ${status}.`,"success"); };
  const togVer = id => { DB.set("providers",DB.get("providers").map(p=>p.id===id?{...p,verified:!p.verified}:p)); refresh(); showToast("Provider updated.","success"); };
  const delUsr = id => { if(id===user.id) return showToast("Cannot delete own account.","error"); DB.set("users",DB.get("users").filter(u=>u.id!==id)); refresh(); showToast("User deleted.","success"); };
  const sb = s => ({pending:"badge-gold",confirmed:"badge-green",cancelled:"badge-red",completed:"badge-navy"}[s]||"badge-gray");

  const navItems = [{id:"overview",icon:"📊",label:"Overview"},{id:"users",icon:"👥",label:"Users"},{id:"providers",icon:"🏢",label:"Providers"},{id:"bookings",icon:"📅",label:"Bookings"}];

  return (
    <div className="page">
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:28}} className="animate-fade-up">
        <div style={{fontFamily:"'Baloo 2',sans-serif",fontSize:28,fontWeight:800}}>Admin Dashboard ⚙️</div>
        <span className="badge badge-red">Admin Only</span>
      </div>
      <div className="dash-layout">
        <div className="sidebar animate-slide-l">
          <div className="sidebar-top"><div className="sidebar-top-orb"/>
            <div className="sidebar-avatar">{user.name[0]}</div>
            <div className="sidebar-name">{user.name}</div>
            <div className="sidebar-email">Super Admin</div>
          </div>
          <div className="sidebar-nav">
            {navItems.map(t=><div key={t.id} className={`sidebar-item${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}><span className="sidebar-icon">{t.icon}</span>{t.label}</div>)}
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:22}} className="animate-fade-up delay-1">
          {tab==="overview" && <>
            <div className="kpi-row">
              {[{icon:"👥",val:users.length,label:"Total Users",color:"var(--saffron)"},{icon:"🏢",val:providers.length,label:"Providers",color:"var(--green)"},{icon:"📅",val:bookings.length,label:"All Bookings",color:"var(--navy)"},{icon:"✅",val:providers.filter(p=>p.available).length,label:"Available Now",color:"var(--teal)"}].map(k=>(
                <div key={k.label} className="kpi"><div className="kpi-icon">{k.icon}</div><div className="kpi-val" style={{color:k.color}}>{k.val}</div><div className="kpi-label">{k.label}</div></div>
              ))}
            </div>
            <div className="card">
              <div style={{fontFamily:"'Baloo 2',sans-serif",fontWeight:800,fontSize:20,marginBottom:18}}>Recent Bookings</div>
              <div className="table-wrap"><table><thead><tr><th>User</th><th>Provider</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>
                {bookings.slice(-6).reverse().map(b=>(
                  <tr key={b.id}><td>#{b.userId}</td><td><strong style={{color:"var(--ink)"}}>{b.providerName}</strong></td><td>{b.date}</td><td><span className={`badge ${sb(b.status)}`}>{b.status}</span></td>
                  <td><div style={{display:"flex",gap:6}}>{b.status==="pending"&&<><RippleBtn className="btn-green btn-sm" onClick={()=>upBook(b.id,"confirmed")}>✓ Confirm</RippleBtn><RippleBtn className="btn-danger btn-sm" onClick={()=>upBook(b.id,"cancelled")}>✕</RippleBtn></>}{b.status==="confirmed"&&<RippleBtn className="btn-secondary btn-sm" onClick={()=>upBook(b.id,"completed")}>Complete</RippleBtn>}</div></td></tr>
                ))}
              </tbody></table></div>
            </div>
          </>}

          {tab==="users" && (
            <div className="card">
              <div style={{fontFamily:"'Baloo 2',sans-serif",fontWeight:800,fontSize:20,marginBottom:18}}>All Users ({users.length})</div>
              <div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>City</th><th>Joined</th><th>Actions</th></tr></thead><tbody>
                {users.map(u=><tr key={u.id}><td><strong style={{color:"var(--ink)"}}>{u.name}</strong></td><td>{u.email}</td><td><span className={`badge ${u.role==="admin"?"badge-red":u.role==="provider"?"badge-orange":"badge-gray"}`}>{u.role}</span></td><td>{u.city||"—"}</td><td>{u.joined}</td><td>{u.id!==user.id&&<RippleBtn className="btn-danger btn-sm" onClick={()=>delUsr(u.id)}>Delete</RippleBtn>}</td></tr>)}
              </tbody></table></div>
            </div>
          )}

          {tab==="providers" && (
            <div className="card">
              <div style={{fontFamily:"'Baloo 2',sans-serif",fontWeight:800,fontSize:20,marginBottom:18}}>All Providers ({providers.length})</div>
              <div className="table-wrap"><table><thead><tr><th>Name</th><th>Category</th><th>City</th><th>Price</th><th>Rating</th><th>Verified</th><th>Actions</th></tr></thead><tbody>
                {providers.map(p=><tr key={p.id}><td><strong style={{color:"var(--ink)"}}>{p.name}</strong></td><td>{p.category}</td><td>{p.city}</td><td style={{color:"var(--saffron)",fontWeight:800}}>{p.price}</td><td>⭐ {p.rating}</td><td><span className={`badge ${p.verified?"badge-green":"badge-gray"}`}>{p.verified?"Yes":"No"}</span></td><td><RippleBtn className="btn-secondary btn-sm" onClick={()=>togVer(p.id)}>{p.verified?"Unverify":"Verify"}</RippleBtn></td></tr>)}
              </tbody></table></div>
            </div>
          )}

          {tab==="bookings" && (
            <div className="card">
              <div style={{fontFamily:"'Baloo 2',sans-serif",fontWeight:800,fontSize:20,marginBottom:18}}>All Bookings ({bookings.length})</div>
              <div className="table-wrap"><table><thead><tr><th>User</th><th>Provider</th><th>Service</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>
                {bookings.map(b=><tr key={b.id}><td>#{b.userId}</td><td><strong style={{color:"var(--ink)"}}>{b.providerName}</strong></td><td>{b.service}</td><td>{b.date} {b.time}</td><td><span className={`badge ${sb(b.status)}`}>{b.status}</span></td>
                <td><div style={{display:"flex",gap:6}}>{b.status==="pending"&&<><RippleBtn className="btn-green btn-sm" onClick={()=>upBook(b.id,"confirmed")}>Confirm</RippleBtn><RippleBtn className="btn-danger btn-sm" onClick={()=>upBook(b.id,"cancelled")}>Cancel</RippleBtn></>}{b.status==="confirmed"&&<RippleBtn className="btn-secondary btn-sm" onClick={()=>upBook(b.id,"completed")}>Complete</RippleBtn>}</div></td></tr>)}
              </tbody></table></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  DB.seed();
  const [page, setPage]                         = useState("home");
  const [user, setUser]                         = useState(null);
  const [searchQ, setSearchQ]                   = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [toasts, setToasts]                     = useState([]);

  const showToast = (msg, type="info") => {
    const id = Date.now();
    setToasts(t=>[...t,{id,msg,type}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)), 3500);
  };

  const ctx = {page,setPage,user,setUser,searchQ,setSearchQ,selectedProvider,setSelectedProvider,showToast};
  const isAuth = ["login","register"].includes(page);

  return (
    <AppCtx.Provider value={ctx}>
      <style>{CSS}</style>
      {isAuth ? (page==="login"?<Login/>:<Register/>) : (
        <div className="app">
          <Nav/>
          {page==="home"      && <Home/>}
          {page==="search"    && <Search/>}
          {page==="provider"  && <ProviderDetail/>}
          {page==="dashboard" && (user?<Dashboard/>:<Login/>)}
          {page==="admin"     && <Admin/>}
        </div>
      )}
      <Toasts toasts={toasts}/>
    </AppCtx.Provider>
  );
}
