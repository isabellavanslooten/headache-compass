/* app.js — UI controller. All state is in-memory; nothing is persisted. */

import { visibleQuestions } from './engine.js';
import { buildResults, transcript, redFlags } from './engine.js';

const $ = id => document.getElementById(id);
const gate = $('gate'), quiz = $('quiz'), results = $('results');

const state = { answers: {}, pos: 0, flagAck: false };
let advanceToken = 0;

const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function show(el) {
  for (const s of [gate, quiz, results]) s.hidden = s !== el;
  window.scrollTo({ top: 0, behavior: 'instant' });
}

/* ---------------- question rendering ---------------- */

function currentQuestion() {
  return visibleQuestions(state.answers)[state.pos];
}

function renderQuestion() {
  const vis = visibleQuestions(state.answers);
  const q = vis[state.pos];
  if (!q) return renderResults();

  $('sectionName').textContent = q.section;
  $('counter').textContent = `${state.pos + 1} of about ${vis.length}`;
  $('bar').style.width = `${Math.round((state.pos / vis.length) * 100)}%`;

  const picked = state.answers[q.id];
  const isOn = v => Array.isArray(picked) ? picked.includes(v) : picked === v;

  $('qcard').dataset.qid = q.id;
  $('qcard').innerHTML = `
    <h2>${esc(q.text)}</h2>
    ${q.help ? `<p class="qhelp">${esc(q.help)}</p>` : ''}
    ${q.type === 'multi' ? '<p class="multi-hint">Select all that apply.</p>' : ''}
    <div class="opts" role="group">
      ${q.options.map((o, i) => `
        <button class="opt" type="button" data-v="${esc(o.v)}" data-type="${q.type}"
                aria-pressed="${isOn(o.v)}">
          <span class="box" aria-hidden="true">${i < 9 ? i + 1 : ''}</span>
          <span class="opt-text">
            <span class="opt-label">${esc(o.label)}</span>
            ${o.note ? `<span class="opt-note">${esc(o.note)}</span>` : ''}
          </span>
        </button>`).join('')}
    </div>`;

  $('qcard').querySelectorAll('.opt').forEach(btn =>
    btn.addEventListener('click', () => pick(q, btn.dataset.v)));

  $('back').disabled = state.pos === 0;
  syncNext(q);
}

function pick(q, v) {
  if (q.type === 'single') {
    state.answers[q.id] = v;
    renderQuestion();
    /* Single-choice answers advance on their own — but give the user a moment
       to see the selection register. The token guards against a second click
       landing inside that window and skipping a question. */
    const token = ++advanceToken;
    setTimeout(() => {
      if (token === advanceToken && currentQuestion() === q) advance();
    }, 220);
    return;
  }

  const set = new Set(state.answers[q.id] || []);
  if (set.has(v)) set.delete(v);
  else {
    /* "None of these" and the real answers are mutually exclusive. */
    if (q.exclusive && v === q.exclusive) set.clear();
    else if (q.exclusive) set.delete(q.exclusive);
    set.add(v);
  }
  state.answers[q.id] = [...set];
  renderQuestion();
}

function syncNext(q) {
  const a = state.answers[q.id];
  const has = Array.isArray(a) ? a.length > 0 : a !== undefined;
  $('next').disabled = q.type === 'single' && !has;
  $('next').textContent = (q.type === 'multi' && !has) ? 'Continue without selecting' : 'Continue';
}

function advance() {
  advanceToken++;
  const q = currentQuestion();

  /* The safety screen short-circuits everything else. */
  if (q && q.id === 'redflags' && redFlags(state.answers).length && !state.flagAck) {
    return renderResults();
  }

  state.pos++;
  if (state.pos >= visibleQuestions(state.answers).length) renderResults();
  else renderQuestion();
}

function goBack() {
  advanceToken++;
  if (state.pos > 0) { state.pos--; renderQuestion(); }
}

/* ---------------- results ---------------- */

function renderResults() {
  const r = buildResults(state.answers);
  results.innerHTML = r.flags.length && !state.flagAck ? urgentScreen(r) : fullResults(r);
  wireResults(r);
  show(results);

  requestAnimationFrame(() => requestAnimationFrame(() => {
    results.querySelectorAll('.meter-fill').forEach(el => { el.style.width = el.dataset.w; });
  }));
}

function urgentScreen(r) {
  return `
    <p class="eyebrow" style="color:var(--danger)">Please read this first</p>
    <h1>Some of what you described needs a person, not a questionnaire.</h1>
    <p class="lede">
      You ticked something that medicine treats as urgent until proven otherwise. That does not
      mean something is definitely wrong — it means the safe order of operations is assessment
      first and pattern-matching second.
    </p>
    <div class="flagbox">
      <h2>What you flagged</h2>
      ${r.flags.map(f => `<div class="flag"><strong>${esc(f.title)}</strong><span>${esc(f.detail)}</span></div>`).join('')}
    </div>
    <div class="note">
      <h3>What to do now</h3>
      <p>Contact emergency services or go to an emergency department if the headache was sudden and severe, came with fever and a stiff neck, or came with weakness, confusion, or vision loss that has not resolved.</p>
      <p>For the others, contact your doctor promptly rather than waiting for a routine appointment.</p>
    </div>
    <div class="actions">
      <button id="ackFlags" class="btn ghost">Continue to the questions anyway</button>
      <button id="restart" class="btn ghost">Start over</button>
    </div>
    <p class="fineprint">Continuing does not clear the flag — it will still appear on your summary.</p>`;
}

function fullResults(r) {
  const t = transcript(state.answers);
  const bySection = t.reduce((m, row) => ((m[row.section] ||= []).push(row), m), {});

  return `
    <div class="result-head">
      <p class="eyebrow">Your summary</p>
      <h1>What your answers look like in clinical language</h1>
      <p class="lede">
        These are the patterns your answers most resemble — not diagnoses. Bring this to a
        clinician and let them do the diagnosing. The questions at the bottom of each card
        are the ones worth asking out loud.
      </p>
    </div>

    ${r.flags.length ? `
      <div class="flagbox">
        <h2>You flagged something urgent</h2>
        ${r.flags.map(f => `<div class="flag"><strong>${esc(f.title)}</strong><span>${esc(f.detail)}</span></div>`).join('')}
      </div>` : ''}

    ${r.empty ? `
      <div class="note"><p>Your answers did not settle onto a recognisable pattern. That happens, and
      it is not a bad sign — it usually means the picture is mixed or something here did not fit the
      wording. The transcript below is still worth bringing to an appointment.</p></div>` : `
      <div class="cards">
        ${r.top.map((c, i) => card(c, i)).join('')}
      </div>
      ${r.top.length < 3 ? `
        <div class="note">
          <p><strong>Only ${r.top.length === 1 ? 'one pattern' : `${r.top.length} patterns`} came back.</strong>
          That is usually a good sign rather than a gap — your answers pointed clearly in one
          direction instead of straddling several. Padding the list with weak matches would only
          add noise to the conversation with your doctor.</p>
        </div>` : ''}`}

    ${r.also.length ? `
      <div class="note">
        <h3>Also worth mentioning</h3>
        <p>These matched partially. They are here so the words are available to you, not because they are likely.</p>
        <div class="chips">${r.also.map(c => `<span class="chip">${esc(c.name)}</span>`).join('')}</div>
      </div>` : ''}

    ${r.auraConcern ? `
      <div class="note" style="background:var(--warn-bg);border-color:var(--warn-line)">
        <h3>One thing to raise specifically</h3>
        <p>You described neurological symptoms that either arrived all at once rather than building
        gradually, or have not fully resolved. Migraine aura characteristically spreads over minutes
        and clears within an hour. Symptoms that do neither are assessed for other causes first —
        please make sure a clinician hears this detail explicitly.</p>
      </div>` : ''}

    ${r.urgentNotes.length ? `
      <div class="note" style="background:var(--danger-bg);border-color:var(--danger-line)">
        <h3>Timing notes on the patterns above</h3>
        ${r.urgentNotes.map(n => `<p><strong>${esc(n.name)}:</strong> ${esc(n.note)}</p>`).join('')}
      </div>` : ''}

    ${r.comorbids.length ? `
      <details class="sheet" open>
        <summary>Conditions that travel with migraine — ${r.comorbids.length} flagged</summary>
        <div class="sheet-body">
          <p class="fineprint" style="margin:14px 0 4px">
            These do not explain your headaches. They sit alongside migraine, change which treatments
            work, and several are settled by a simple test.
          </p>
          ${r.comorbids.map(c => `
            <div class="como">
              <strong>${esc(c.name)}</strong>
              <p>${esc(c.blurb)}</p>
              <p class="ask"><em>Ask:</em> ${esc(c.ask)}</p>
            </div>`).join('')}
        </div>
      </details>` : ''}

    <details class="sheet">
      <summary>Everything you answered — the part to actually hand over</summary>
      <div class="sheet-body">
        ${Object.entries(bySection).map(([sec, rows]) => `
          <p class="sec-head">${esc(sec)}</p>
          ${rows.map(row => `
            <div class="qa">
              <p class="qa-q">${esc(row.q)}</p>
              <p class="qa-a">${esc(row.a.join(' · '))}</p>
            </div>`).join('')}`).join('')}
      </div>
    </details>

    <div class="actions">
      <button id="print" class="btn primary">Print or save as PDF</button>
      <button id="copy" class="btn ghost">Copy summary as text</button>
      <button id="restart" class="btn ghost">Start over</button>
    </div>
    <p class="fineprint">
      Nothing here has been saved. Closing this tab erases it permanently — print or copy first.
    </p>`;
}

function card(c, i) {
  const pct = Math.round(c.confidence * 100);
  return `
    <article class="card">
      <div class="card-top">
        <div>
          <h3>${esc(c.name)}</h3>
          <p class="group">${esc(c.group)}</p>
        </div>
        <span class="rank">${i + 1}</span>
      </div>

      <div class="meter">
        <div class="meter-row">
          <span class="meter-label ${c.band.tone}">${esc(c.band.label)}</span>
          <span class="meter-pct">${pct}% of the features fit</span>
        </div>
        <div class="meter-track">
          <div class="meter-fill ${c.band.tone}" data-w="${pct}%"></div>
        </div>
      </div>

      <p class="blurb">${esc(c.blurb)}</p>

      ${c.hallmarks.length ? `
        <p class="sub">What defines it</p>
        <ul class="hall">${c.hallmarks.map(h => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}

      ${c.workup ? `<p class="sub">How it gets confirmed</p><p class="blurb">${esc(c.workup)}</p>` : ''}
      ${c.ask ? `<p class="ask"><em>Worth asking:</em> ${esc(c.ask)}</p>` : ''}
      ${c.urgentNote ? `<p class="urgent">${esc(c.urgentNote)}</p>` : ''}
    </article>`;
}

/* ---------------- plain-text export ---------------- */

function summaryText(r) {
  const L = [];
  L.push('HEADACHE SUMMARY');
  L.push('Generated by Headache Compass — an educational questionnaire.');
  L.push('NOT A DIAGNOSIS. Not a substitute for medical assessment.');
  L.push('');

  if (r.flags.length) {
    L.push('FLAGGED FOR URGENT ATTENTION');
    r.flags.forEach(f => L.push(`  ! ${f.title}`));
    L.push('');
  }

  if (r.top.length) {
    L.push('PATTERNS THE ANSWERS MOST RESEMBLE');
    r.top.forEach((c, i) => {
      L.push(`  ${i + 1}. ${c.name} (${c.group}) — ${c.band.label}, ${Math.round(c.confidence * 100)}% of features fit`);
      L.push(`     ${c.blurb}`);
      if (c.ask) L.push(`     Ask: ${c.ask}`);
      L.push('');
    });
  }

  if (r.also.length) {
    L.push('ALSO CONSIDERED: ' + r.also.map(c => c.name).join(', '));
    L.push('');
  }

  if (r.comorbids.length) {
    L.push('CONDITIONS THAT TRAVEL WITH MIGRAINE');
    r.comorbids.forEach(c => L.push(`  - ${c.name} — ${c.ask}`));
    L.push('');
  }

  L.push('ANSWERS GIVEN');
  let sec = '';
  transcript(state.answers).forEach(row => {
    if (row.section !== sec) { sec = row.section; L.push(''); L.push(`[${sec}]`); }
    L.push(`  Q: ${row.q}`);
    L.push(`  A: ${row.a.join(' · ')}`);
  });

  return L.join('\n');
}

async function copySummary(btn, r) {
  const text = summaryText(r);
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch { /* clipboard unavailable */ }
    ta.remove();
  }
  const original = btn.textContent;
  btn.textContent = 'Copied to clipboard';
  setTimeout(() => { btn.textContent = original; }, 1900);
}

function wireResults(r) {
  const ack = $('ackFlags');
  if (ack) ack.addEventListener('click', () => {
    state.flagAck = true;
    state.pos++;
    renderQuestion();
    show(quiz);
  });

  const p = $('print');
  if (p) p.addEventListener('click', () => window.print());

  const c = $('copy');
  if (c) c.addEventListener('click', () => copySummary(c, r));

  const rs = $('restart');
  if (rs) rs.addEventListener('click', () => {
    state.answers = {}; state.pos = 0; state.flagAck = false;
    show(gate);
  });
}

/* ---------------- wiring ---------------- */

$('begin').addEventListener('click', () => { show(quiz); renderQuestion(); });
$('next').addEventListener('click', advance);
$('back').addEventListener('click', goBack);

document.addEventListener('keydown', e => {
  if (quiz.hidden) return;
  if (e.target.matches('input, textarea')) return;

  if (e.key === 'Enter' && !$('next').disabled) { e.preventDefault(); advance(); return; }

  const n = parseInt(e.key, 10);
  if (n >= 1 && n <= 9) {
    const q = currentQuestion();
    const opt = q && q.options[n - 1];
    if (opt) { e.preventDefault(); pick(q, opt.v); }
  }
});
