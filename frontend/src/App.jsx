import { useState, useRef, useCallback, useEffect } from "react";
import * as mammoth from "mammoth";

/* ── BACKEND URL ── change this to your Render URL when deployed */
const API_URL = import.meta.env.VITE_API_URL || "";

/* ══════════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════════ */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0a0a0f;
  --bg2: #111118;
  --bg3: #18181f;
  --border: rgba(255,255,255,0.07);
  --border2: rgba(255,255,255,0.12);
  --text: #f0eff5;
  --text2: #9996aa;
  --text3: #55536a;
  --accent: #7c6aff;
  --accent2: #a98bff;
  --accent-glow: rgba(124,106,255,0.25);
  --green: #22c98a;
  --green-bg: rgba(34,201,138,0.1);
  --red: #ff5c6a;
  --red-bg: rgba(255,92,106,0.1);
  --amber: #f5a623;
  --amber-bg: rgba(245,166,35,0.1);
  --blue: #4da3ff;
  --blue-bg: rgba(77,163,255,0.1);
  --radius: 16px;
  --radius-sm: 10px;
  --shadow: 0 8px 32px rgba(0,0,0,0.4);
  --shadow-accent: 0 8px 32px rgba(124,106,255,0.2);
}

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  background-image:
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,106,255,0.12) 0%, transparent 60%),
    radial-gradient(ellipse 40% 30% at 90% 80%, rgba(169,139,255,0.06) 0%, transparent 50%);
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  font-weight: 400;
  min-height: 100vh;
  line-height: 1.6;
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg2); }
::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

.app { max-width: 860px; margin: 0 auto; padding: 48px 24px 120px; }

/* ── HEADER ── */
.header { text-align: center; margin-bottom: 64px; position: relative; }
.header-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(124,106,255,0.1); border: 1px solid rgba(124,106,255,0.25);
  border-radius: 100px; padding: 6px 16px; font-size: 12px;
  font-weight: 500; color: var(--accent2); letter-spacing: 0.08em;
  text-transform: uppercase; margin-bottom: 24px;
}
.header-badge::before {
  content: ''; width: 6px; height: 6px; border-radius: 50%;
  background: var(--accent); box-shadow: 0 0 8px var(--accent);
  animation: pulse 2s infinite;
}
@keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.85); } }

.header h1 {
  font-family: 'Syne', sans-serif;
  font-size: clamp(42px, 8vw, 80px);
  font-weight: 800; line-height: 1;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #fff 0%, var(--accent2) 60%, var(--accent) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; margin-bottom: 16px;
}
.header-sub {
  font-size: 16px; color: var(--text2); font-weight: 300;
  max-width: 460px; margin: 0 auto; line-height: 1.7;
}
.header-stats {
  display: flex; justify-content: center; gap: 32px;
  margin-top: 32px; flex-wrap: wrap;
}
.hstat {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
}
.hstat-num {
  font-family: 'Syne', sans-serif; font-size: 22px;
  font-weight: 700; color: var(--accent2);
}
.hstat-label { font-size: 12px; color: var(--text3); letter-spacing: 0.06em; text-transform: uppercase; }

/* ── CARDS ── */
.card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px 32px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s;
}
.card:hover { border-color: var(--border2); }
.card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(124,106,255,0.4), transparent);
}
.card-title {
  font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700;
  letter-spacing: 0.16em; text-transform: uppercase; color: var(--text3);
  margin-bottom: 20px; display: flex; align-items: center; gap: 10px;
}
.card-title::after {
  content: ''; flex: 1; height: 1px; background: var(--border);
}

/* ── DROP ZONE ── */
.drop {
  border: 1.5px dashed var(--border2);
  border-radius: var(--radius-sm);
  padding: 48px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  background: rgba(255,255,255,0.02);
}
.drop:hover, .drop.drag {
  border-color: var(--accent);
  background: var(--accent-glow);
  box-shadow: inset 0 0 40px rgba(124,106,255,0.05);
}
.drop input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
.drop-icon {
  width: 56px; height: 56px; border-radius: 16px;
  background: linear-gradient(135deg, rgba(124,106,255,0.2), rgba(169,139,255,0.1));
  border: 1px solid rgba(124,106,255,0.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; margin: 0 auto 16px; 
}
.drop-title {
  font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700;
  margin-bottom: 6px; color: var(--text);
}
.drop-sub { font-size: 13px; color: var(--text3); }
.drop-types {
  display: flex; gap: 6px; justify-content: center; margin-top: 16px; flex-wrap: wrap;
}
.dtype {
  background: var(--bg3); border: 1px solid var(--border);
  border-radius: 6px; padding: 3px 10px;
  font-size: 11px; font-weight: 600; color: var(--text3);
  letter-spacing: 0.08em; text-transform: uppercase;
}

/* ── FILE LIST ── */
.flist { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
.fitem {
  display: flex; align-items: center; gap: 12px;
  background: var(--bg3); border: 1px solid var(--border);
  border-radius: var(--radius-sm); padding: 12px 16px;
  transition: border-color 0.2s;
}
.fitem:hover { border-color: var(--border2); }
.ficon {
  width: 36px; height: 36px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0;
}
.ficon.pdf { background: rgba(255,92,106,0.15); }
.ficon.ppt { background: rgba(245,166,35,0.15); }
.ficon.doc { background: rgba(77,163,255,0.15); }
.ficon.txt { background: rgba(124,106,255,0.15); }
.finfo { flex: 1; min-width: 0; }
.fname { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.fsize { font-size: 11px; color: var(--text3); margin-top: 1px; }
.fstatus {
  font-size: 11px; padding: 3px 10px; border-radius: 100px;
  font-weight: 600; letter-spacing: 0.04em; flex-shrink: 0;
}
.fstatus.ok { background: var(--green-bg); color: var(--green); }
.fstatus.err { background: var(--red-bg); color: var(--red); }
.fstatus.loading { background: var(--amber-bg); color: var(--amber); }
.fremove {
  background: none; border: none; color: var(--text3);
  cursor: pointer; font-size: 16px; padding: 4px; border-radius: 6px;
  transition: all 0.15s; flex-shrink: 0;
}
.fremove:hover { background: var(--red-bg); color: var(--red); }

/* ── SETTINGS GRID ── */
.settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media(max-width:560px) { .settings-grid { grid-template-columns: 1fr; } }

.setting { display: flex; flex-direction: column; gap: 10px; }
.setting-label {
  font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--text3);
}
.setting-value {
  font-family: 'Syne', sans-serif; font-size: 32px;
  font-weight: 700; color: var(--accent2); line-height: 1;
}

/* Slider */
input[type=range] {
  width: 100%; height: 4px; appearance: none;
  background: var(--border2); border-radius: 2px; cursor: pointer;
  accent-color: var(--accent);
}
input[type=range]::-webkit-slider-thumb {
  appearance: none; width: 18px; height: 18px;
  background: var(--accent); border-radius: 50%;
  box-shadow: 0 0 10px var(--accent-glow);
  cursor: pointer;
}

/* Pills */
.pills { display: flex; gap: 8px; flex-wrap: wrap; }
.pill {
  padding: 8px 18px; border-radius: 100px;
  border: 1.5px solid var(--border);
  font-size: 13px; font-weight: 500; cursor: pointer;
  transition: all 0.15s; background: transparent; color: var(--text2);
  font-family: 'DM Sans', sans-serif;
}
.pill:hover { border-color: var(--accent); color: var(--text); }
.pill.active { background: var(--accent); border-color: var(--accent); color: #fff; box-shadow: 0 4px 16px var(--accent-glow); }
.pill.active-easy { background: var(--green-bg); border-color: var(--green); color: var(--green); }
.pill.active-medium { background: var(--amber-bg); border-color: var(--amber); color: var(--amber); }
.pill.active-hard { background: var(--red-bg); border-color: var(--red); color: var(--red); }
.pill.active-mixed { background: var(--blue-bg); border-color: var(--blue); color: var(--blue); }

/* Question type selector */
.qtype-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
.qtype-card {
  border: 1.5px solid var(--border); border-radius: var(--radius-sm);
  padding: 14px 12px; cursor: pointer; transition: all 0.15s;
  text-align: center; background: transparent;
}
.qtype-card:hover { border-color: var(--accent); background: var(--accent-glow); }
.qtype-card.selected { border-color: var(--accent); background: var(--accent-glow); box-shadow: 0 0 20px rgba(124,106,255,0.1); }
.qtype-icon { font-size: 22px; margin-bottom: 6px; display: block; }
.qtype-name { font-size: 12px; font-weight: 600; color: var(--text); }
.qtype-desc { font-size: 11px; color: var(--text3); margin-top: 2px; }

/* Preview box */
.preview-box {
  background: var(--bg3); border: 1px solid var(--border);
  border-radius: var(--radius-sm); padding: 14px 16px;
  font-size: 12px; color: var(--text2); line-height: 1.7;
  font-family: 'DM Mono', monospace; max-height: 100px;
  overflow: hidden; position: relative; margin-top: 12px;
}
.preview-box::after {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 40px;
  background: linear-gradient(transparent, var(--bg3));
}

/* ── GENERATE BUTTON ── */
.gen-btn {
  width: 100%; padding: 20px 32px;
  background: linear-gradient(135deg, var(--accent) 0%, #5c4de8 100%);
  border: none; border-radius: var(--radius-sm);
  font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700;
  color: #fff; cursor: pointer; transition: all 0.2s;
  position: relative; overflow: hidden;
  box-shadow: 0 8px 32px rgba(124,106,255,0.35);
}
.gen-btn:disabled { opacity: 0.3; cursor: not-allowed; box-shadow: none; }
.gen-btn:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(124,106,255,0.45); }
.gen-btn:not(:disabled):active { transform: translateY(0); }
.gen-btn-sub { font-size: 12px; font-weight: 400; opacity: 0.7; margin-top: 3px; font-family: 'DM Sans', sans-serif; }
.gen-btn::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.1) 50%,transparent 60%);
  animation: sheen 3s infinite;
}
@keyframes sheen { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }

/* ── LOADING ── */
.loading-screen { text-align: center; padding: 72px 32px; }
.loading-orb {
  width: 80px; height: 80px; border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, var(--accent2), var(--accent));
  margin: 0 auto 28px;
  box-shadow: 0 0 40px var(--accent-glow);
  animation: orb-pulse 2s ease-in-out infinite;
}
@keyframes orb-pulse {
  0%,100% { transform: scale(1); box-shadow: 0 0 40px var(--accent-glow); }
  50% { transform: scale(1.08); box-shadow: 0 0 60px rgba(124,106,255,0.4); }
}
.loading-title {
  font-family: 'Syne', sans-serif; font-size: 26px;
  font-weight: 700; margin-bottom: 8px;
}
.loading-sub { font-size: 14px; color: var(--text2); }
.loading-steps { display: flex; flex-direction: column; gap: 8px; margin: 32px auto 0; max-width: 300px; text-align: left; }
.lstep {
  display: flex; align-items: center; gap: 12px;
  font-size: 13px; color: var(--text3); transition: all 0.3s;
  padding: 10px 14px; border-radius: 8px;
}
.lstep.active { color: var(--accent2); background: var(--accent-glow); }
.lstep.done { color: var(--green); }
.lstep-dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
.lstep.active .lstep-dot { animation: pulse 1s infinite; }

/* ── RESULTS ── */
.results-header { margin-bottom: 32px; }
.results-top {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 16px; flex-wrap: wrap; margin-bottom: 20px;
}
.results-title {
  font-family: 'Syne', sans-serif; font-size: 32px;
  font-weight: 800; color: var(--text);
}
.results-source { font-size: 13px; color: var(--text3); margin-top: 4px; }
.results-actions { display: flex; gap: 10px; flex-shrink: 0; }
.btn-outline {
  padding: 10px 20px; border-radius: var(--radius-sm);
  border: 1.5px solid var(--border2); background: transparent;
  color: var(--text2); font-size: 13px; font-weight: 500;
  cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif;
}
.btn-outline:hover { border-color: var(--text2); color: var(--text); }
.btn-solid {
  padding: 10px 20px; border-radius: var(--radius-sm);
  border: 1.5px solid var(--accent); background: var(--accent);
  color: #fff; font-size: 13px; font-weight: 500;
  cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif;
}
.btn-solid:hover { background: var(--accent2); border-color: var(--accent2); }

/* Meta chips */
.meta-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.chip {
  display: flex; align-items: center; gap: 6px;
  background: var(--bg3); border: 1px solid var(--border);
  border-radius: 8px; padding: 5px 12px;
  font-size: 12px; color: var(--text2);
}
.chip b { color: var(--text); font-weight: 600; }

/* Progress bar */
.progress-wrap { height: 3px; background: var(--border); border-radius: 2px; margin-bottom: 32px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent2)); border-radius: 2px; transition: width 0.4s ease; }

/* Score card */
.score-card {
  background: linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%);
  border: 1px solid rgba(124,106,255,0.2);
  border-radius: var(--radius); padding: 32px;
  margin-bottom: 24px; text-align: center;
  box-shadow: 0 0 40px rgba(124,106,255,0.1);
}
.score-ring {
  width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 16px;
  display: flex; align-items: center; justify-content: center;
  background: conic-gradient(var(--accent) var(--pct), var(--border) var(--pct));
  position: relative;
}
.score-ring::before {
  content: ''; position: absolute; inset: 8px; border-radius: 50%; background: var(--bg2);
}
.score-num {
  font-family: 'Syne', sans-serif; font-size: 28px;
  font-weight: 800; color: var(--accent2); position: relative; z-index: 1;
}
.score-label { font-size: 13px; color: var(--text2); margin-top: 6px; }
.score-grade { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; margin-top: 10px; }

/* Question card */
.qcard {
  background: var(--bg2); border: 1px solid var(--border);
  border-radius: var(--radius); margin-bottom: 16px;
  overflow: hidden; transition: border-color 0.2s;
}
.qcard:hover { border-color: var(--border2); }
.qcard-body { padding: 24px 28px 20px; }
.qtags { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
.qnum { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; color: var(--accent); letter-spacing: 0.1em; }
.qtype-chip {
  background: var(--bg3); border: 1px solid var(--border);
  border-radius: 6px; padding: 2px 9px; font-size: 10px;
  font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text3);
}
.qdiff {
  border-radius: 100px; padding: 2px 10px;
  font-size: 10px; font-weight: 600; letter-spacing: 0.06em;
}
.qdiff.easy { background: var(--green-bg); color: var(--green); }
.qdiff.medium { background: var(--amber-bg); color: var(--amber); }
.qdiff.hard { background: var(--red-bg); color: var(--red); }

.qtext {
  font-family: 'Syne', sans-serif; font-size: 17px;
  font-weight: 600; line-height: 1.55; color: var(--text);
}

/* MCQ Options */
.opts { display: flex; flex-direction: column; gap: 8px; margin-top: 18px; }
.opt {
  display: flex; align-items: flex-start; gap: 12px;
  border: 1.5px solid var(--border); border-radius: var(--radius-sm);
  padding: 12px 16px; cursor: pointer; transition: all 0.15s;
  background: transparent;
}
.opt:hover:not(.revealed-correct):not(.revealed-wrong):not(.revealed-neutral) {
  border-color: var(--accent); background: var(--accent-glow);
}
.opt.selected-opt { border-color: var(--accent); background: var(--accent-glow); }
.opt.revealed-correct { background: var(--green-bg); border-color: var(--green); cursor: default; }
.opt.revealed-wrong { opacity: 0.4; cursor: default; }
.opt.revealed-neutral { cursor: default; }
.opt-letter {
  width: 28px; height: 28px; border-radius: 8px;
  background: var(--bg3); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; flex-shrink: 0; color: var(--text2);
  font-family: 'Syne', sans-serif;
}
.revealed-correct .opt-letter { background: var(--green); border-color: var(--green); color: #fff; }
.opt-txt { font-size: 14px; line-height: 1.5; padding-top: 4px; color: var(--text); }

/* Short answer */
.sa-wrap { margin-top: 16px; }
.sa-input {
  width: 100%; padding: 14px 16px;
  border: 1.5px solid var(--border); border-radius: var(--radius-sm);
  background: var(--bg3); color: var(--text);
  font-family: 'DM Sans', sans-serif; font-size: 14px;
  resize: vertical; min-height: 80px; transition: border-color 0.15s;
  line-height: 1.6;
}
.sa-input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
.sa-input:disabled { opacity: 0.6; cursor: default; }

/* True/False */
.tf-opts { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px; }
.tf-opt {
  border: 1.5px solid var(--border); border-radius: var(--radius-sm);
  padding: 14px; text-align: center; cursor: pointer;
  font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
  transition: all 0.15s; background: transparent;
}
.tf-opt:hover { border-color: var(--accent); background: var(--accent-glow); }
.tf-opt.selected-tf { border-color: var(--accent); background: var(--accent-glow); color: var(--accent2); }
.tf-opt.tf-correct { background: var(--green-bg); border-color: var(--green); color: var(--green); }
.tf-opt.tf-wrong { opacity: 0.4; }

/* Answer bar */
.answer-bar { border-top: 1px solid var(--border); padding: 20px 28px; }
.answer-bar.correct { background: var(--green-bg); border-top-color: rgba(34,201,138,0.15); }
.answer-bar.wrong { background: var(--red-bg); border-top-color: rgba(255,92,106,0.15); }
.answer-bar.neutral { background: rgba(124,106,255,0.05); border-top-color: rgba(124,106,255,0.1); }
.ab-label {
  font-size: 10px; font-weight: 700; letter-spacing: 0.14em;
  text-transform: uppercase; margin-bottom: 6px;
  display: flex; align-items: center; gap: 6px;
}
.ab-label.green { color: var(--green); }
.ab-label.red { color: var(--red); }
.ab-label.purple { color: var(--accent2); }
.ab-answer { font-size: 14px; font-weight: 500; line-height: 1.6; color: var(--text); }
.ab-explanation {
  margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border);
  font-size: 13px; color: var(--text2); line-height: 1.7; font-weight: 300;
}
.ab-explanation strong { display: block; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text3); margin-bottom: 4px; }

/* Reveal / Check buttons */
.qcard-footer { padding: 0 28px 20px; }
.reveal-btn {
  background: none; border: 1.5px dashed var(--border2);
  border-radius: var(--radius-sm); padding: 10px 20px;
  font-family: 'DM Sans', sans-serif; font-size: 12px;
  font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--text3); cursor: pointer; transition: all 0.15s; width: 100%;
}
.reveal-btn:hover { border-color: var(--accent); color: var(--accent); }
.check-btn {
  margin-top: 10px; background: var(--accent); border: none;
  border-radius: var(--radius-sm); padding: 10px 22px;
  font-family: 'DM Sans', sans-serif; font-size: 12px;
  font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
  color: #fff; cursor: pointer; transition: all 0.15s;
}
.check-btn:hover { background: var(--accent2); }

/* Error */
.error-box {
  background: var(--red-bg); border: 1px solid rgba(255,92,106,0.2);
  border-radius: var(--radius-sm); padding: 16px 20px;
  display: flex; gap: 12px; align-items: flex-start;
  font-size: 13px; color: var(--red); margin-bottom: 20px; line-height: 1.6;
}

/* Animations */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.fade-up { animation: fadeUp 0.4s ease forwards; }
.fade-up-delay-1 { animation: fadeUp 0.4s 0.05s ease both; }
.fade-up-delay-2 { animation: fadeUp 0.4s 0.1s ease both; }
.fade-up-delay-3 { animation: fadeUp 0.4s 0.15s ease both; }
`;

/* ══════════════════════════════════════════════
   FILE PARSERS
══════════════════════════════════════════════ */
async function parsePptx(file) {
  if (!window._JSZip) {
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
    window._JSZip = window.JSZip;
  }
  const ab = await file.arrayBuffer();
  const zip = await window._JSZip.loadAsync(ab);
  const slideFiles = Object.keys(zip.files)
    .filter(n => n.match(/^ppt\/slides\/slide[0-9]+\.xml$/))
    .sort((a, b) => parseInt(a.match(/slide(\d+)/)[1]) - parseInt(b.match(/slide(\d+)/)[1]));
  if (!slideFiles.length) throw new Error("No slides found");
  const texts = [];
  for (const sf of slideFiles) {
    const xml = await zip.files[sf].async("string");
    const matches = [...xml.matchAll(/<a:t[^>]*>([^<]*)<\/a:t>/g)];
    const t = matches.map(m => m[1].trim()).filter(Boolean).join(" ");
    if (t.trim()) texts.push(t);
  }
  return texts.join("\n\n");
}

async function parsePdf(file) {
  if (!window.pdfjsLib) {
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }
  const ab = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: ab }).promise;
  let text = "";
  for (let i = 1; i <= Math.min(pdf.numPages, 40); i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(" ") + "\n\n";
  }
  return text;
}

async function parseDocx(file) {
  const ab = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: ab });
  return result.value;
}

async function parseFile(file) {
  const n = file.name.toLowerCase();
  if (n.endsWith(".pdf")) return parsePdf(file);
  if (n.endsWith(".pptx") || n.endsWith(".ppt")) return parsePptx(file);
  if (n.endsWith(".docx") || n.endsWith(".doc")) return parseDocx(file);
  return file.text();
}

/* ══════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════ */
const DIFFS = ["Easy", "Medium", "Hard", "Mixed"];
const QTYPES = [
  { id: "mcq", icon: "☑️", name: "MCQ", desc: "4 options" },
  { id: "short", icon: "✍️", name: "Short Answer", desc: "Written response" },
  { id: "truefalse", icon: "⚖️", name: "True / False", desc: "Binary choice" },
  { id: "fillblank", icon: "🔤", name: "Fill in Blank", desc: "Complete the sentence" },
  { id: "mixed", icon: "🎲", name: "Mixed", desc: "All types" },
];
const STEPS = [
  "Parsing document content…",
  "Identifying key concepts…",
  "Generating questions with AI…",
  "Formatting answers & explanations…",
];

const fIcon = n => {
  if (n.endsWith(".pdf")) return { icon: "📄", cls: "pdf" };
  if (n.endsWith(".pptx") || n.endsWith(".ppt")) return { icon: "📊", cls: "ppt" };
  if (n.endsWith(".docx") || n.endsWith(".doc")) return { icon: "📝", cls: "doc" };
  return { icon: "📃", cls: "txt" };
};
const fSize = b => b < 1048576 ? (b / 1024).toFixed(1) + " KB" : (b / 1048576).toFixed(1) + " MB";
const getGrade = p =>
  p >= 90 ? "Outstanding 🏆" : p >= 75 ? "Excellent 🎉" : p >= 60 ? "Good work 👍" : p >= 40 ? "Keep going 📚" : "More practice 💪";

/* ══════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════ */
export default function App() {
  const [files, setFiles] = useState([]);
  const [fileStatuses, setFileStatuses] = useState({});
  const [filePreviews, setFilePreviews] = useState({});
  const [drag, setDrag] = useState(false);
  const [count, setCount] = useState(10);
  const [diff, setDiff] = useState("Mixed");
  const [qtype, setQtype] = useState("mixed");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);
  const [revealed, setRevealed] = useState({});
  const [userAnswers, setUserAnswers] = useState({});
  const [checked, setChecked] = useState({});
  const fileRef = useRef();

  const addFiles = useCallback(async (fl) => {
    const valid = Array.from(fl).filter(f =>
      [".pdf", ".pptx", ".ppt", ".docx", ".doc", ".txt"].some(e => f.name.toLowerCase().endsWith(e))
    );
    setFiles(prev => {
      const next = [...prev, ...valid].slice(0, 5);
      valid.forEach((f, i) => {
        const idx = prev.length + i;
        if (idx >= 5) return;
        setFileStatuses(s => ({ ...s, [idx]: "loading" }));
        parseFile(f).then(text => {
          setFileStatuses(s => ({ ...s, [idx]: text.length > 20 ? "ok" : "err" }));
          setFilePreviews(s => ({ ...s, [idx]: text.slice(0, 300) }));
        }).catch(() => setFileStatuses(s => ({ ...s, [idx]: "err" })));
      });
      return next;
    });
  }, []);

  const removeFile = i => {
    setFiles(p => p.filter((_, j) => j !== i));
    setFileStatuses(s => {
      const ns = {};
      Object.entries(s).forEach(([k, v]) => { const ki = +k; if (ki < i) ns[ki] = v; else if (ki > i) ns[ki - 1] = v; });
      return ns;
    });
    setFilePreviews(s => {
      const ns = {};
      Object.entries(s).forEach(([k, v]) => { const ki = +k; if (ki < i) ns[ki] = v; else if (ki > i) ns[ki - 1] = v; });
      return ns;
    });
  };

  const generate = async () => {
    if (!files.length) return;
    setLoading(true); setError(null); setQuiz(null);
    setRevealed({}); setUserAnswers({}); setChecked({});
    setStep(0);

    try {
      const textParts = [];
      for (const f of files) {
        try {
          const t = await parseFile(f);
          textParts.push(`=== ${f.name} ===\n${t}`);
        } catch (e) {
          textParts.push(`=== ${f.name} === [Error: ${e.message}]`);
        }
      }

      setStep(1); await new Promise(r => setTimeout(r, 300));
      setStep(2);

      const diffNote = diff === "Mixed" ? "a balanced mix of Easy, Medium and Hard" : `all ${diff} difficulty`;
      const typeInstructions = {
        mcq: `Generate ONLY multiple choice questions with 4 options (A,B,C,D). Each question must have exactly one correct answer.`,
        short: `Generate ONLY short answer questions. The ideal answer should be 2-4 sentences.`,
        truefalse: `Generate ONLY true/false questions. The answer must be exactly "True" or "False".`,
        fillblank: `Generate ONLY fill-in-the-blank questions where a key word or phrase is replaced with _____. Provide the missing word as the answer.`,
        mixed: `Generate a mix: ~40% MCQ, ~25% short answer, ~20% true/false, ~15% fill-in-the-blank.`,
      };

      const promptText = `${textParts.join("\n\n").slice(0, 12000)}

Generate exactly ${count} quiz questions from the above study material.
${typeInstructions[qtype]}
Difficulty: ${diffNote}.
Questions must be based DIRECTLY on the content above.
Include a 2-3 sentence explanation for every question.

Respond ONLY with a raw JSON array. No markdown, no extra text.
Schema:
[{
  "id": number,
  "type": "mcq" | "short" | "truefalse" | "fillblank",
  "difficulty": "Easy" | "Medium" | "Hard",
  "question": "...",
  "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
  "answer": "for mcq: A/B/C/D only | for truefalse: True/False | for others: full answer string",
  "explanation": "..."
}]`;

      const res = await fetch(`${API_URL}/api/generate-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText }),
      });

      setStep(3);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const raw = data.result || "";
      const match = raw.replace(/```json|```/g, "").trim().match(/\[[\s\S]*\]/);
      if (!match) throw new Error("Could not parse questions. Please try again.");
      const qs = JSON.parse(match[0]);
      if (!Array.isArray(qs) || !qs.length) throw new Error("No questions generated.");
      await new Promise(r => setTimeout(r, 300));
      setQuiz({ qs, diff, qtype, docNames: files.map(f => f.name) });
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const revealQ = i => setRevealed(p => ({ ...p, [i]: true }));
  const checkShort = i => setChecked(p => ({ ...p, [i]: true }));

  const mcqQs = quiz?.qs.filter(q => q.type === "mcq") || [];
  const tfQs = quiz?.qs.filter(q => q.type === "truefalse") || [];
  const scorableQs = [...mcqQs, ...tfQs];
  const mcqScore = scorableQs.filter(q => {
    const gi = quiz.qs.indexOf(q);
    return revealed[gi] && (userAnswers[gi] || "").toString().trim().toLowerCase() === q.answer?.trim().toLowerCase().charAt(0) || (userAnswers[gi] || "").toString().trim().toLowerCase() === q.answer?.trim().toLowerCase();
  }).length;

  const revealedCount = Object.keys(revealed).length + Object.keys(checked).length;
  const totalQ = quiz?.qs.length || 0;
  const progressPct = totalQ ? Math.round((revealedCount / totalQ) * 100) : 0;
  const allScorableRevealed = scorableQs.length > 0 && scorableQs.every((q) => revealed[quiz.qs.indexOf(q)]);

  const exportQuiz = () => {
    if (!quiz) return;
    let t = `QUIZFORGE — STUDY QUIZ\nSource: ${quiz.docNames.join(", ")}\nDifficulty: ${quiz.diff} | Questions: ${quiz.qs.length}\n${"═".repeat(60)}\n\n`;
    quiz.qs.forEach((q, i) => {
      const typeLabel = { mcq: "Multiple Choice", short: "Short Answer", truefalse: "True/False", fillblank: "Fill in Blank" }[q.type] || q.type;
      t += `${i + 1}. [${typeLabel}] [${q.difficulty}]\n${q.question}\n`;
      if (q.options?.length) q.options.forEach(o => { t += `   ${o}\n`; });
      t += `\n✓ Answer: ${q.answer}\n💡 ${q.explanation}\n\n${"─".repeat(60)}\n\n`;
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([t], { type: "text/plain" }));
    a.download = "quizforge-study.txt"; a.click();
  };

  /* ── RENDER ── */
  return (
    <>
      <style>{G}</style>
      <div className="app">

        {/* HEADER */}
        <header className="header fade-up">
          <div className="header-badge">QuizForge AI</div>
          <h1>Study Smarter,<br />Not Harder.</h1>
          <p className="header-sub">Upload your notes, slides or textbook chapters — get a personalised exam quiz in seconds.</p>
          <div className="header-stats">
            <div className="hstat"><span className="hstat-num">4</span><span className="hstat-label">File formats</span></div>
            <div className="hstat"><span className="hstat-num">4</span><span className="hstat-label">Question types</span></div>
            <div className="hstat"><span className="hstat-num">∞</span><span className="hstat-label">Practice quizzes</span></div>
          </div>
        </header>

        {!quiz && !loading && (
          <>
            {/* UPLOAD */}
            <div className="card fade-up-delay-1">
              <div className="card-title">Upload Study Material</div>
              <div
                className={`drop ${drag ? "drag" : ""}`}
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={e => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
                onClick={() => fileRef.current?.click()}
              >
                <input ref={fileRef} type="file" multiple accept=".pdf,.pptx,.ppt,.docx,.doc,.txt" onChange={e => addFiles(e.target.files)} />
                <div className="drop-icon">📚</div>
                <div className="drop-title">Drop your files here</div>
                <div className="drop-sub">or click to browse — up to 5 files</div>
                <div className="drop-types">
                  {["PDF", "PPTX", "DOCX", "TXT"].map(t => <span key={t} className="dtype">{t}</span>)}
                </div>
              </div>
              {files.length > 0 && (
                <div className="flist">
                  {files.map((f, i) => {
                    const { icon, cls } = fIcon(f.name);
                    const st = fileStatuses[i];
                    return (
                      <div key={i} className="fitem">
                        <div className={`ficon ${cls}`}>{icon}</div>
                        <div className="finfo">
                          <div className="fname">{f.name}</div>
                          <div className="fsize">{fSize(f.size)}</div>
                        </div>
                        {st === "loading" && <span className="fstatus loading">Parsing…</span>}
                        {st === "ok" && <span className="fstatus ok">✓ Ready</span>}
                        {st === "err" && <span className="fstatus err">⚠ Error</span>}
                        <button className="fremove" onClick={() => removeFile(i)}>✕</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SETTINGS */}
            <div className="card fade-up-delay-2">
              <div className="card-title">Quiz Settings</div>
              <div className="settings-grid" style={{ marginBottom: 24 }}>
                <div className="setting">
                  <div className="setting-label">Number of questions</div>
                  <div className="setting-value">{count}</div>
                  <input type="range" min="3" max="30" value={count} onChange={e => setCount(+e.target.value)} />
                </div>
                <div className="setting">
                  <div className="setting-label">Difficulty level</div>
                  <div className="pills" style={{ marginTop: 6 }}>
                    {DIFFS.map(d => (
                      <button key={d} className={`pill ${diff === d ? "active-" + d.toLowerCase() : ""}`} onClick={() => setDiff(d)}>{d}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="setting-label" style={{ marginBottom: 12 }}>Question type</div>
              <div className="qtype-grid">
                {QTYPES.map(t => (
                  <button key={t.id} className={`qtype-card ${qtype === t.id ? "selected" : ""}`} onClick={() => setQtype(t.id)}>
                    <span className="qtype-icon">{t.icon}</span>
                    <div className="qtype-name">{t.name}</div>
                    <div className="qtype-desc">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="error-box fade-up">⚠️ <div><b>Error:</b> {error}</div></div>}

            <button className="gen-btn fade-up-delay-3" disabled={!files.length} onClick={generate}>
              {files.length ? `Generate ${count} Questions` : "Upload a file to begin"}
              <div className="gen-btn-sub">{files.length ? `From ${files.length} document${files.length > 1 ? "s" : ""} · ${QTYPES.find(t => t.id === qtype)?.name}` : ""}</div>
            </button>
          </>
        )}

        {/* LOADING */}
        {loading && (
          <div className="card">
            <div className="loading-screen">
              <div className="loading-orb" />
              <div className="loading-title">Generating your quiz…</div>
              <div className="loading-sub">AI is analysing your documents</div>
              <div className="loading-steps">
                {STEPS.map((s, i) => (
                  <div key={i} className={`lstep ${i < step ? "done" : i === step ? "active" : ""}`}>
                    <div className="lstep-dot" />
                    {i < step ? "✓ " : ""}{s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {quiz && (
          <>
            <div className="results-header fade-up">
              <div className="results-top">
                <div>
                  <div className="results-title">Your Study Quiz</div>
                  <div className="results-source">From: {quiz.docNames.join(", ")}</div>
                </div>
                <div className="results-actions">
                  <button className="btn-outline" onClick={exportQuiz}>Export .txt</button>
                  <button className="btn-solid" onClick={() => { setQuiz(null); setFiles([]); }}>New Quiz</button>
                </div>
              </div>
              <div className="meta-chips">
                <div className="chip">Questions <b>{quiz.qs.length}</b></div>
                <div className="chip">Difficulty <b>{quiz.diff}</b></div>
                <div className="chip">MCQ <b>{quiz.qs.filter(q => q.type === "mcq").length}</b></div>
                <div className="chip">Short <b>{quiz.qs.filter(q => q.type === "short").length}</b></div>
                <div className="chip">T/F <b>{quiz.qs.filter(q => q.type === "truefalse").length}</b></div>
                <div className="chip">Fill <b>{quiz.qs.filter(q => q.type === "fillblank").length}</b></div>
              </div>
            </div>

            <div className="progress-wrap">
              <div className="progress-fill" style={{ width: progressPct + "%" }} />
            </div>

            {allScorableRevealed && scorableQs.length > 0 && (
              <div className="score-card fade-up">
                <div className="score-ring" style={{ "--pct": `${Math.round((mcqScore / scorableQs.length) * 100 * 3.6)}deg` }}>
                  <span className="score-num">{Math.round((mcqScore / scorableQs.length) * 100)}%</span>
                </div>
                <div className="score-label">Score — {mcqScore} / {scorableQs.length} correct (MCQ + T/F)</div>
                <div className="score-grade">{getGrade((mcqScore / scorableQs.length) * 100)}</div>
              </div>
            )}

            {quiz.qs.map((q, i) => {
              const isRevealed = revealed[i];
              const isChecked = checked[i];
              const ua = userAnswers[i] || "";
              const correctLetter = q.answer?.trim().toUpperCase().charAt(0);
              const userCorrect =
                (q.type === "mcq" && ua.toUpperCase() === correctLetter) ||
                (q.type === "truefalse" && ua.toLowerCase() === q.answer?.toLowerCase()) ||
                (q.type === "fillblank" && isChecked);

              return (
                <div key={q.id || i} className="qcard fade-up">
                  <div className="qcard-body">
                    <div className="qtags">
                      <span className="qnum">Q{i + 1}</span>
                      <span className="qtype-chip">{q.type === "mcq" ? "MCQ" : q.type === "short" ? "Short Answer" : q.type === "truefalse" ? "True / False" : "Fill Blank"}</span>
                      <span className={`qdiff ${q.difficulty?.toLowerCase()}`}>{q.difficulty}</span>
                    </div>
                    <div className="qtext">{q.question}</div>

                    {/* MCQ */}
                    {q.type === "mcq" && q.options?.length > 0 && (
                      <div className="opts">
                        {q.options.map((opt, j) => {
                          const letter = ["A", "B", "C", "D"][j];
                          const sel = ua === letter;
                          const correct = isRevealed && letter === correctLetter;
                          const wrong = isRevealed && sel && letter !== correctLetter;
                          return (
                            <div key={j}
                              className={`opt ${correct ? "revealed-correct" : wrong ? "revealed-wrong" : isRevealed ? "revealed-neutral" : sel ? "selected-opt" : ""}`}
                              onClick={() => !isRevealed && setUserAnswers(p => ({ ...p, [i]: letter }))}>
                              <div className="opt-letter">{letter}</div>
                              <div className="opt-txt">{opt.replace(/^[A-Da-d]\)\s*/, "")}</div>
                              {correct && <span style={{ marginLeft: "auto", color: "var(--green)", fontSize: 18 }}>✓</span>}
                              {wrong && <span style={{ marginLeft: "auto", color: "var(--red)", fontSize: 16 }}>✗</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* True / False */}
                    {q.type === "truefalse" && (
                      <div className="tf-opts">
                        {["True", "False"].map(val => {
                          const sel = ua === val;
                          const correct = isRevealed && val.toLowerCase() === q.answer?.toLowerCase();
                          const wrong = isRevealed && sel && val.toLowerCase() !== q.answer?.toLowerCase();
                          return (
                            <div key={val}
                              className={`tf-opt ${correct ? "tf-correct" : wrong ? "tf-wrong" : sel ? "selected-tf" : ""}`}
                              onClick={() => !isRevealed && setUserAnswers(p => ({ ...p, [i]: val }))}>
                              {val}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Short Answer */}
                    {(q.type === "short" || q.type === "fillblank") && (
                      <div className="sa-wrap">
                        <textarea className="sa-input"
                          placeholder={q.type === "fillblank" ? "Type the missing word or phrase…" : "Write your answer here…"}
                          value={ua} disabled={isChecked}
                          onChange={e => setUserAnswers(p => ({ ...p, [i]: e.target.value }))} />
                        {!isChecked && <button className="check-btn" onClick={() => checkShort(i)}>Compare Answer</button>}
                      </div>
                    )}
                  </div>

                  {/* Reveal button */}
                  {(q.type === "mcq" || q.type === "truefalse") && !isRevealed && (
                    <div className="qcard-footer">
                      <button className="reveal-btn" onClick={() => revealQ(i)}>Reveal Answer</button>
                    </div>
                  )}

                  {/* Answer bar */}
                  {(isRevealed || isChecked) && (
                    <div className={`answer-bar ${q.type === "mcq" || q.type === "truefalse" ? (userCorrect ? "correct" : "wrong") : "neutral"}`}>
                      <div className={`ab-label ${q.type === "mcq" || q.type === "truefalse" ? (userCorrect ? "green" : "red") : "purple"}`}>
                        {q.type === "mcq" || q.type === "truefalse"
                          ? userCorrect ? "✓ Correct!" : "✗ Incorrect — Correct Answer"
                          : "✓ Model Answer"}
                      </div>
                      <div className="ab-answer">{q.answer}</div>
                      {q.explanation && (
                        <div className="ab-explanation">
                          <strong>Explanation</strong>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}
