/* engine.js — question flow, scoring, and result assembly.
   Everything runs in the browser. Nothing is stored or transmitted. */

import { QUESTIONS } from './questions.js';
import { CONDITIONS, COMORBIDS } from './conditions.js';

/* Answer helper passed to every `when` and gate predicate. */
export function helper(answers) {
  return {
    get: id => answers[id],
    has: (id, v) => {
      const a = answers[id];
      return Array.isArray(a) ? a.includes(v) : a === v;
    },
    any: (id, list) => {
      const a = answers[id];
      if (!a) return false;
      return Array.isArray(a) ? a.some(x => list.includes(x)) : list.includes(a);
    },
    answered: id => answers[id] !== undefined &&
      !(Array.isArray(answers[id]) && answers[id].length === 0)
  };
}

/* Which questions apply given the answers so far. */
export function visibleQuestions(answers) {
  const a = helper(answers);
  return QUESTIONS.filter(q => !q.when || q.when(a));
}

/* ---- Red flags ---------------------------------------------------------- */

const RED_FLAG_TEXT = {
  thunderclap: ['Thunderclap onset', 'Pain reaching maximum within about a minute is the classic presentation of a subarachnoid haemorrhage. It is a same-day emergency evaluation every time, even if it has since settled.'],
  worst_ever: ['Worst headache of your life', 'A headache unlike any you have had before, at an intensity you have never reached, is assessed urgently rather than treated as a new pattern.'],
  fever_neck: ['Headache with fever or a stiff neck', 'This combination is treated as possible meningitis until proven otherwise. Go to an emergency department now.'],
  new_over_50: ['New headache after 50', 'New headache patterns in this age group need assessment for giant cell arteritis and other secondary causes — particularly with jaw pain when chewing, scalp tenderness, or visual change.'],
  trauma: ['Headache after head injury', 'Post-traumatic headache needs assessment to exclude bleeding around the brain, which can present days after the injury.'],
  deficit: ['Neurological symptoms that did not resolve', 'Weakness, numbness, or speech difficulty that persists is treated as a stroke until proven otherwise. Call emergency services.'],
  altered: ['Confusion, seizure, or fainting', 'These point away from a primary headache disorder and need urgent assessment.'],
  vision_loss: ['Vision loss that has not returned', 'Persistent vision loss needs same-day ophthalmology or emergency assessment.'],
  immuno: ['Immunocompromised', 'A lowered immune system widens the range of causes considerably and lowers the threshold for imaging and testing.'],
  pregnancy: ['Pregnant or recently gave birth', 'Pregnancy and the weeks after delivery carry specific risks — pre-eclampsia, venous sinus thrombosis — that change how a new headache is assessed.'],
  progressive: ['Steadily worsening, worse lying flat, with vomiting', 'This triad is the classic pattern for raised pressure inside the skull and warrants prompt imaging.']
};

export function redFlags(answers) {
  const picked = answers.redflags || [];
  return picked.filter(v => v !== 'none').map(v => ({
    key: v, title: RED_FLAG_TEXT[v][0], detail: RED_FLAG_TEXT[v][1]
  }));
}

/* ---- Hard gates --------------------------------------------------------- */
/* A condition whose defining feature is absent is removed entirely rather
   than merely scoring low — this is what keeps the output honest. */

const GATES = {
  mig_aura:              a => a.get('aura') !== 'no',
  silent_aura:           a => a.get('aura') !== 'no',
  hemiplegic_mig:        a => a.has('aura_types', 'weakness'),
  retinal_mig:           a => a.has('aura_types', 'one_eye'),
  brainstem_aura:        a => a.has('aura_types', 'brainstem'),
  vestibular_mig:        a => a.get('primary') === 'dizziness' || a.has('aura_types', 'brainstem') || a.answered('vertigo_detail'),
  abdominal_mig:         a => a.get('primary') === 'abdominal',
  status_mig:            a => a.get('duration') === 'over_72',
  chronic_mig:           a => a.get('frequency') === 'd15plus',
  menstrual_mig:         a => a.any('menstrual', ['around_period', 'only_period', 'hormonal_meds']),
  /* No overuse without use: the medication threshold is the whole diagnosis. */
  moh:                   a => a.any('med_days', ['d5_9', 'd10_14', 'd15plus']) &&
                              (a.get('frequency') === 'd15plus' || a.get('med_days') === 'd15plus'),

  cluster:               a => tacGate(a),
  paroxysmal_hemicrania: a => tacGate(a),
  sunct:                 a => tacGate(a),
  hemicrania_continua:   a => tacGate(a),

  hypnic:                a => a.has('position', 'wakes_night'),
  csf_leak:              a => a.has('position', 'worse_upright'),
  iih:                   a => a.any('iih_features', ['pulsatile', 'obscurations', 'double']) || a.has('position', 'worse_lying'),
  ndph:                  a => a.get('onset_pattern') === 'named_day',
  cough_ha:              a => a.has('valsalva', 'cough'),
  exercise_ha:           a => a.has('valsalva', 'exertion'),
  trigeminal_neuralgia:  a => a.has('valsalva', 'touch_face') || a.get('quality') === 'stabbing' || a.get('location') === 'face',
  sinus:                 a => a.any('sinus_features', ['discharge', 'smell_loss', 'fever_sinus']),
  sleep_apnea_ha:        a => a.has('position', 'worse_morning') || a.has('comorbid', 'snoring'),
  caffeine_withdrawal:   a => a.has('triggers', 'caffeine') || a.has('relief', 'caffeine_helps'),
  tmj:                   a => a.any('neck_jaw', ['jaw_click', 'grinding']) || a.get('location') === 'face',
  occipital_neuralgia:   a => a.has('neck_jaw', 'tender_base') || a.get('location') === 'back_neck',
  cervicogenic:          a => a.any('neck_jaw', ['neck_movement', 'neck_stiff', 'tender_base']) || a.get('location') === 'back_neck'
};

/* The trigeminal autonomic cephalalgias share an entry requirement:
   autonomic features, restlessness, or a decisive treatment response. */
function tacGate(a) {
  return (a.answered('autonomic') && !a.has('autonomic', 'none')) ||
    a.get('activity') === 'better' ||
    a.any('relief', ['indometh', 'oxygen']);
}

/* ---- Scoring ------------------------------------------------------------ */

/* For a multi-select question, assume a realistic best case is the three
   strongest supporting options rather than every single one. */
function maxPossible(question, key) {
  const weights = question.options
    .map(o => (o.s || {})[key] || 0)
    .filter(w => w > 0);
  if (!weights.length) return 0;
  if (question.type === 'single') return Math.max(...weights);
  return weights.sort((x, y) => y - x).slice(0, 3).reduce((s, w) => s + w, 0);
}

function tally(answers, keys) {
  const earned = {}, possible = {};
  for (const k of keys) { earned[k] = 0; possible[k] = 0; }

  const a = helper(answers);
  for (const q of visibleQuestions(answers)) {
    if (!a.answered(q.id)) continue;
    const picked = Array.isArray(answers[q.id]) ? answers[q.id] : [answers[q.id]];

    /* Score the question in isolation first. Ticking six migraine symptoms
       should max out this question, not out-earn its own ceiling and drown
       the questions that follow — otherwise conditions probed mostly by
       multi-selects score on a different scale from the rest. */
    const q_earned = {};
    for (const v of picked) {
      const opt = q.options.find(o => o.v === v);
      if (!opt || !opt.s) continue;
      for (const [k, w] of Object.entries(opt.s)) {
        if (k in earned) q_earned[k] = (q_earned[k] || 0) + w;
      }
    }

    for (const k of keys) {
      const ceiling = maxPossible(q, k);
      possible[k] += ceiling;
      const got = q_earned[k] || 0;
      earned[k] += got > ceiling ? ceiling : got;
    }
  }
  return { earned, possible };
}

function score(answers) {
  const a = helper(answers);
  const keys = Object.keys(CONDITIONS).filter(k => k !== 'urgent');
  const { earned, possible } = tally(answers, keys);

  return keys
    .filter(k => !GATES[k] || GATES[k](a))
    .filter(k => possible[k] > 0)
    .map(k => ({
      key: k,
      ...CONDITIONS[k],
      confidence: Math.max(0, Math.min(1, earned[k] / possible[k])),
      raw: earned[k]
    }))
    .filter(r => r.raw > 0)
    .sort((x, y) => y.confidence - x.confidence || y.raw - x.raw);
}

/* Migraine subtypes are migraine *plus* a distinguishing feature, so a strong
   general migraine picture should lift them. And once genuine aura is on the
   record, "without aura" should stop leading the list. */
const SUBTYPES = ['mig_aura', 'chronic_mig', 'menstrual_mig', 'vestibular_mig',
  'status_mig', 'hemiplegic_mig', 'brainstem_aura', 'retinal_mig', 'silent_aura', 'abdominal_mig'];
const REAL_AURA = ['zigzag', 'both_eyes', 'one_eye', 'tingling', 'speech', 'weakness', 'brainstem'];

function refine(ranked, answers) {
  const a = helper(answers);
  const base = (ranked.find(r => r.key === 'mig_no_aura') || {}).confidence || 0;
  const hasRealAura = a.get('aura') === 'yes' && a.any('aura_types', REAL_AURA);

  for (const r of ranked) {
    if (SUBTYPES.includes(r.key)) r.confidence = 0.6 * r.confidence + 0.4 * base;
    if (r.key === 'mig_no_aura' && hasRealAura) r.confidence *= 0.7;
  }
  return ranked.sort((x, y) => y.confidence - x.confidence || y.raw - x.raw);
}

/* A couple of comorbidities have a defining symptom of their own. */
const COMORBID_GATES = {
  visual_snow: a => a.has('aura_types', 'static'),
  cvs:         a => a.has('comorbid', 'vomit_bouts') || a.get('primary') === 'abdominal'
};

function comorbidHits(answers, top) {
  const ga = helper(answers);
  const keys = Object.keys(COMORBIDS).filter(k => !COMORBID_GATES[k] || COMORBID_GATES[k](ga));
  const { earned, possible } = tally(answers, keys);
  const hits = keys
    .filter(k => possible[k] > 0 && earned[k] / possible[k] >= 0.5)
    .map(k => ({ key: k, ...COMORBIDS[k] }));

  /* PFO is not asked about directly — it becomes relevant only once aura
     is on the table. */
  const hasAura = top.some(r => ['mig_aura', 'hemiplegic_mig', 'brainstem_aura', 'retinal_mig', 'silent_aura'].includes(r.key));
  if (hasAura && !hits.some(h => h.key === 'pfo')) hits.push({ key: 'pfo', ...COMORBIDS.pfo });
  return hits;
}

function band(c) {
  if (c >= 0.62) return { label: 'Strong match', tone: 'strong' };
  if (c >= 0.40) return { label: 'Possible match', tone: 'medium' };
  return { label: 'Worth mentioning', tone: 'weak' };
}

/* ---- Public result ------------------------------------------------------ */

export function buildResults(answers) {
  const flags = redFlags(answers);
  const ranked = refine(score(answers), answers);
  const top = ranked.slice(0, 3).map(r => ({ ...r, band: band(r.confidence) }));
  const also = ranked.slice(3, 8).filter(r => r.confidence >= 0.25);

  /* Two aura questions can independently suggest something non-migrainous. */
  const a = helper(answers);
  const auraConcern = a.get('aura_onset') === 'sudden' || a.get('aura_duration') === 'persists';

  return {
    flags,
    top,
    also,
    comorbids: comorbidHits(answers, top),
    auraConcern,
    urgentNotes: top.filter(r => r.urgentNote).map(r => ({ name: r.name, note: r.urgentNote })),
    empty: ranked.length === 0
  };
}

/* A plain-text transcript of everything answered, for the appointment. */
export function transcript(answers) {
  const a = helper(answers);
  const out = [];
  for (const q of visibleQuestions(answers)) {
    if (!a.answered(q.id)) continue;
    const picked = Array.isArray(answers[q.id]) ? answers[q.id] : [answers[q.id]];
    const labels = picked
      .map(v => (q.options.find(o => o.v === v) || {}).label)
      .filter(Boolean);
    if (labels.length) out.push({ section: q.section, q: q.text, a: labels });
  }
  return out;
}
