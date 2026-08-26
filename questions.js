/* questions.js — the branching question tree.

   Each question may declare a `when` predicate; if it returns false the
   question is skipped entirely, so the path through the tree is shaped by
   the answers rather than being a fixed questionnaire.

   Options carry `s`: weights contributed to each condition key. Negative
   weights are evidence against. Scoring lives in engine.js. */

export const SECTIONS = [
  'Safety check',
  'Your attacks',
  'Aura',
  'Pattern over time',
  'Triggers and positions',
  'Other symptoms'
];

/* Convenience predicates over the answer set. `a` is the helper from engine.js */
const oneSided = a => ['same_side', 'switching_sides', 'behind_eye'].includes(a.get('location'));
const shortAttacks = a => ['seconds', 'mins_2_30', 'mins_15_180'].includes(a.get('duration'));

export const QUESTIONS = [

  /* ================= Safety check ================= */
  {
    id: 'redflags',
    section: 'Safety check',
    text: 'Do any of these describe your headaches?',
    help: 'These are the patterns clinicians screen for first. Tick everything that applies — ticking one does not mean something is wrong, only that assessment should come before pattern-matching.',
    type: 'multi',
    exclusive: 'none',
    options: [
      { v: 'thunderclap', label: 'Reached maximum intensity within about a minute', note: 'A "thunderclap" onset — like being struck' },
      { v: 'worst_ever', label: 'The worst headache of my life, unlike any before' },
      { v: 'fever_neck', label: 'Headache with fever, a stiff neck, or a rash' },
      { v: 'new_over_50', label: 'A brand-new headache pattern that started after age 50' },
      { v: 'trauma', label: 'Started within days of a head injury' },
      { v: 'deficit', label: 'Weakness, numbness, or speech trouble that did not fully go away', note: 'Or symptoms lasting more than an hour' },
      { v: 'altered', label: 'Confusion, seizure, fainting, or personality change' },
      { v: 'vision_loss', label: 'Vision loss that has not fully returned' },
      { v: 'immuno', label: 'I have cancer, HIV, or take immune-suppressing medication' },
      { v: 'pregnancy', label: 'I am pregnant or gave birth in the last six weeks' },
      { v: 'progressive', label: 'Steadily worsening every week with vomiting, and worse when lying flat' },
      { v: 'none', label: 'None of these', note: 'Continue to the questions' }
    ]
  },

  /* ================= Your attacks ================= */
  {
    id: 'primary',
    section: 'Your attacks',
    text: 'What is the main thing you experience?',
    help: 'Pick whichever dominates. Migraine does not always lead with pain.',
    type: 'single',
    options: [
      { v: 'headache', label: 'Attacks of head pain', s: {} },
      { v: 'aura_only', label: 'Visual or neurological episodes with little or no headache',
        s: { silent_aura: 6, mig_aura: 2, mig_no_aura: -3, tth: -3, cluster: -3 } },
      { v: 'dizziness', label: 'Episodes of vertigo, dizziness, or motion intolerance',
        s: { vestibular_mig: 6, brainstem_aura: 2, mig_no_aura: -1, tth: -2, cluster: -3 } },
      { v: 'abdominal', label: 'Recurrent stomach pain and vomiting episodes',
        s: { abdominal_mig: 7, cvs: 4, mig_no_aura: -2, tth: -3, cluster: -3 } },
      { v: 'facial', label: 'Facial pain rather than head pain',
        s: { trigeminal_neuralgia: 5, tmj: 4, sinus: 2, sunct: 2, tth: -2 } }
    ]
  },
  {
    id: 'age',
    section: 'Your attacks',
    text: 'How old were you when this pattern began?',
    type: 'single',
    options: [
      { v: 'child', label: 'Under 18', s: { abdominal_mig: 3, mig_no_aura: 2, cvs: 2, hypnic: -6, iih: -1 } },
      { v: 'young', label: '18–39', s: { mig_no_aura: 2, mig_aura: 1, cluster: 1, iih: 1, hypnic: -6, abdominal_mig: -3 } },
      { v: 'mid', label: '40–49', s: { mig_no_aura: 1, tth: 1, cervicogenic: 1, hypnic: -4, abdominal_mig: -4 } },
      { v: 'older', label: '50 or older', s: { hypnic: 4, silent_aura: 2, trigeminal_neuralgia: 2, cervicogenic: 2, abdominal_mig: -5, mig_no_aura: -1 } }
    ]
  },
  {
    id: 'location',
    section: 'Your attacks',
    text: 'Where does the pain sit?',
    type: 'single',
    when: a => a.get('primary') !== 'aura_only',
    options: [
      { v: 'switching_sides', label: 'One side, but it changes sides between attacks',
        s: { mig_no_aura: 5, mig_aura: 3, cluster: -3, hemicrania_continua: -5, cervicogenic: -2 } },
      { v: 'same_side', label: 'Always the same side, never the other',
        s: { cluster: 4, hemicrania_continua: 4, paroxysmal_hemicrania: 3, cervicogenic: 3, occipital_neuralgia: 2, mig_no_aura: 1, tth: -2 } },
      { v: 'behind_eye', label: 'Centred behind or around one eye',
        s: { cluster: 5, paroxysmal_hemicrania: 4, sunct: 3, mig_no_aura: 2, hemicrania_continua: 2, tth: -2 } },
      { v: 'both_band', label: 'Both sides, like a tight band or vice',
        s: { tth: 6, sleep_apnea_ha: 3, moh: 2, ndph: 2, cluster: -5, paroxysmal_hemicrania: -4, mig_no_aura: -1 } },
      { v: 'back_neck', label: 'Back of the head and neck',
        s: { cervicogenic: 6, occipital_neuralgia: 5, tth: 3, cluster: -3 } },
      { v: 'face', label: 'Cheek, jaw, or temple',
        s: { tmj: 5, trigeminal_neuralgia: 4, sinus: 3, tth: 1 } },
      { v: 'whole', label: 'All over, or hard to localise',
        s: { tth: 3, moh: 2, sleep_apnea_ha: 2, iih: 2, ndph: 2, cluster: -4 } }
    ]
  },
  {
    id: 'quality',
    section: 'Your attacks',
    text: 'What does the pain feel like?',
    type: 'single',
    when: a => a.get('primary') !== 'aura_only',
    options: [
      { v: 'throbbing', label: 'Throbbing or pulsing, in time with your pulse',
        s: { mig_no_aura: 6, mig_aura: 3, exercise_ha: 2, iih: 1, tth: -4 } },
      { v: 'pressing', label: 'Pressing, tightening, dull',
        s: { tth: 6, sleep_apnea_ha: 3, moh: 2, cervicogenic: 2, mig_no_aura: -2, cluster: -3 } },
      { v: 'boring', label: 'Boring, drilling, or like a hot poker',
        s: { cluster: 6, paroxysmal_hemicrania: 4, tth: -4, mig_no_aura: -1 } },
      { v: 'stabbing', label: 'Electric shocks or sharp stabs',
        s: { trigeminal_neuralgia: 6, sunct: 5, occipital_neuralgia: 4, cough_ha: 2, tth: -3, mig_no_aura: -2 } },
      { v: 'burning', label: 'Burning or raw',
        s: { occipital_neuralgia: 3, trigeminal_neuralgia: 3, tmj: 1 } }
    ]
  },
  {
    id: 'severity',
    section: 'Your attacks',
    text: 'At its worst, how bad does it get?',
    type: 'single',
    when: a => a.get('primary') !== 'aura_only',
    options: [
      { v: 'mild', label: 'Mild — I carry on normally',
        s: { tth: 5, sleep_apnea_ha: 2, mig_no_aura: -3, cluster: -6 } },
      { v: 'moderate', label: 'Moderate — I push through but it is hard',
        s: { tth: 3, mig_no_aura: 3, moh: 2, cluster: -3 } },
      { v: 'severe', label: 'Severe — I have to stop what I am doing',
        s: { mig_no_aura: 5, chronic_mig: 2, status_mig: 1, tth: -3 } },
      { v: 'excruciating', label: 'Excruciating — among the worst pain imaginable',
        s: { cluster: 6, trigeminal_neuralgia: 4, paroxysmal_hemicrania: 3, mig_no_aura: 2, tth: -6 } }
    ]
  },
  {
    id: 'activity',
    section: 'Your attacks',
    text: 'Does ordinary physical activity — walking about, climbing stairs — make it worse?',
    help: 'This single question separates migraine from tension-type headache more reliably than almost any other.',
    type: 'single',
    when: a => a.get('primary') !== 'aura_only',
    options: [
      { v: 'yes', label: 'Yes, I avoid moving during an attack',
        s: { mig_no_aura: 6, mig_aura: 3, chronic_mig: 2, tth: -5 } },
      { v: 'no', label: 'No, movement makes no difference',
        s: { tth: 5, cluster: 2, sleep_apnea_ha: 1, mig_no_aura: -4 } },
      { v: 'better', label: 'Moving actually helps — I cannot keep still',
        s: { cluster: 6, paroxysmal_hemicrania: 2, hemicrania_continua: 2, mig_no_aura: -3, tth: -1 } }
    ]
  },
  {
    id: 'duration',
    section: 'Your attacks',
    text: 'Untreated, how long does one attack last?',
    help: 'Attack length is one of the sharpest dividing lines between headache types.',
    type: 'single',
    when: a => a.get('primary') !== 'aura_only',
    options: [
      { v: 'seconds', label: 'Seconds to a couple of minutes',
        s: { sunct: 7, trigeminal_neuralgia: 6, cough_ha: 3, mig_no_aura: -6, tth: -4, cluster: -3 } },
      { v: 'mins_2_30', label: '2 to 30 minutes',
        s: { paroxysmal_hemicrania: 7, sunct: 2, cough_ha: 2, mig_no_aura: -4, tth: -2 } },
      { v: 'mins_15_180', label: '15 minutes to 3 hours',
        s: { cluster: 7, hypnic: 3, paroxysmal_hemicrania: 2, mig_no_aura: -2 } },
      { v: 'hours_4_72', label: '4 hours to 3 days',
        s: { mig_no_aura: 7, mig_aura: 4, menstrual_mig: 3, vestibular_mig: 2, tth: 2, cluster: -5, paroxysmal_hemicrania: -5, sunct: -5 } },
      { v: 'over_72', label: 'More than 3 days at a stretch',
        s: { status_mig: 7, chronic_mig: 3, moh: 2, cluster: -5, paroxysmal_hemicrania: -5 } },
      { v: 'continuous', label: 'It never fully goes away',
        s: { ndph: 5, hemicrania_continua: 5, moh: 5, chronic_mig: 4, iih: 3, csf_leak: 2, cluster: -5 } }
    ]
  },
  {
    id: 'assoc',
    section: 'Your attacks',
    text: 'What happens alongside your attacks?',
    help: 'Tick everything you notice during a typical attack, whether or not there is pain.',
    type: 'multi',
    exclusive: 'none',
    options: [
      { v: 'nausea', label: 'Nausea', s: { mig_no_aura: 5, mig_aura: 2, vestibular_mig: 2, chronic_mig: 1, tth: -4 } },
      { v: 'vomiting', label: 'Vomiting', s: { mig_no_aura: 4, status_mig: 2, cvs: 2, abdominal_mig: 1, tth: -4 } },
      { v: 'photo', label: 'Light hurts', s: { mig_no_aura: 5, mig_aura: 2, vestibular_mig: 2, visual_snow: 1, tth: -2 } },
      { v: 'phono', label: 'Sound hurts', s: { mig_no_aura: 4, vestibular_mig: 1, tth: -2 } },
      { v: 'osmo', label: 'Smells become unbearable', s: { mig_no_aura: 4, mig_aura: 1, tth: -3 } },
      { v: 'dark_room', label: 'I need to lie down in a dark, quiet room', s: { mig_no_aura: 5, chronic_mig: 1, cluster: -4, tth: -2 } },
      { v: 'allodynia', label: 'My scalp or skin hurts to touch — hair brushing, glasses', s: { mig_no_aura: 3, chronic_mig: 3, allodynia: 6, occipital_neuralgia: 2 } },
      { v: 'neck_pain', label: 'Neck pain or stiffness', s: { cervicogenic: 4, mig_no_aura: 2, tth: 2, occipital_neuralgia: 2, csf_leak: 1 } },
      { v: 'prodrome', label: 'Yawning, food cravings, or mood change a day before', s: { mig_no_aura: 5, mig_aura: 3, chronic_mig: 1, tth: -3 } },
      { v: 'fog', label: 'Brain fog and difficulty finding words', s: { mig_no_aura: 3, mig_aura: 2, chronic_mig: 2 } },
      { v: 'none', label: 'None of these', s: { tth: 5, cough_ha: 2, mig_no_aura: -5 } }
    ]
  },
  {
    id: 'autonomic',
    section: 'Your attacks',
    text: 'During an attack, does anything happen to the eye or nostril on the painful side?',
    help: 'These are called cranial autonomic features. They point strongly toward one family of headaches.',
    type: 'multi',
    exclusive: 'none',
    when: a => oneSided(a) && a.get('primary') !== 'aura_only',
    options: [
      { v: 'tearing', label: 'That eye waters', s: { cluster: 5, paroxysmal_hemicrania: 4, sunct: 5, hemicrania_continua: 3, mig_no_aura: 1, tth: -3 } },
      { v: 'red_eye', label: 'That eye goes red or bloodshot', s: { cluster: 4, sunct: 5, paroxysmal_hemicrania: 3, hemicrania_continua: 2 } },
      { v: 'ptosis', label: 'That eyelid droops or the eye looks smaller', s: { cluster: 5, paroxysmal_hemicrania: 3, hemicrania_continua: 3 } },
      { v: 'nasal', label: 'That nostril blocks or runs', s: { cluster: 4, paroxysmal_hemicrania: 3, hemicrania_continua: 2, sinus: 2, mig_no_aura: 1 } },
      { v: 'sweating', label: 'Forehead or face sweats on that side', s: { cluster: 3, paroxysmal_hemicrania: 2 } },
      { v: 'ear', label: 'That ear feels full or blocked', s: { cluster: 1, hemicrania_continua: 1, vestibular_mig: 2, csf_leak: 2 } },
      { v: 'none', label: 'None of these', s: { mig_no_aura: 2, tth: 2, cluster: -6, paroxysmal_hemicrania: -5, sunct: -6, hemicrania_continua: -4 } }
    ]
  },
  {
    id: 'bouts',
    section: 'Your attacks',
    text: 'Do the attacks come in bouts — weeks of daily attacks, then months of nothing?',
    type: 'single',
    when: a => oneSided(a) && shortAttacks(a),
    options: [
      { v: 'bouts_night', label: 'Yes, and they often wake me at roughly the same time each night',
        s: { cluster: 7, hypnic: 3 } },
      { v: 'bouts', label: 'Yes, in bouts — sometimes at the same time of year',
        s: { cluster: 6 } },
      { v: 'daily_no_remission', label: 'They happen most days without long breaks',
        s: { paroxysmal_hemicrania: 4, sunct: 3, hemicrania_continua: 3, cluster: 1 } },
      { v: 'random', label: 'No pattern — scattered and unpredictable',
        s: { mig_no_aura: 2, tth: 1, cluster: -3 } }
    ]
  },

  /* ================= Aura ================= */
  {
    id: 'aura',
    section: 'Aura',
    text: 'Do you get neurological symptoms before or during attacks?',
    help: 'Visual disturbances, numbness or tingling, speech trouble, or weakness that come and then go.',
    type: 'single',
    options: [
      { v: 'yes', label: 'Yes', s: { mig_aura: 6, mig_no_aura: -2 } },
      { v: 'no', label: 'No', s: { mig_no_aura: 4, tth: 2, mig_aura: -8, silent_aura: -8, hemiplegic_mig: -8, brainstem_aura: -8, retinal_mig: -8 } },
      { v: 'unsure', label: 'I am not sure', s: { mig_aura: 1 } }
    ]
  },
  {
    id: 'aura_types',
    section: 'Aura',
    text: 'Which of these happen during those episodes?',
    type: 'multi',
    when: a => a.get('aura') !== 'no',
    options: [
      { v: 'zigzag', label: 'Zigzag lines, shimmering arcs, or a blind spot that grows',
        s: { mig_aura: 6, silent_aura: 3, retinal_mig: -1 } },
      { v: 'both_eyes', label: 'The visual change is in both eyes — it stays when I cover either eye',
        s: { mig_aura: 4, retinal_mig: -6 } },
      { v: 'one_eye', label: 'Vision goes in ONE eye only — I checked by covering each eye',
        s: { retinal_mig: 8, mig_aura: -1 } },
      { v: 'tingling', label: 'Tingling or numbness that creeps up a hand, arm, or face',
        s: { mig_aura: 5, silent_aura: 2 } },
      { v: 'speech', label: 'Words come out wrong or I cannot find them',
        s: { mig_aura: 4, hemiplegic_mig: 2, brainstem_aura: 1 } },
      { v: 'weakness', label: 'Genuine weakness on one side — a limb will not do what I ask',
        s: { hemiplegic_mig: 9, mig_aura: -1 } },
      { v: 'brainstem', label: 'Vertigo, double vision, slurred speech, ringing ears, or unsteadiness',
        s: { brainstem_aura: 7, vestibular_mig: 3, hemiplegic_mig: -1 } },
      { v: 'static', label: 'Constant TV static across my whole vision, even with eyes shut',
        s: { visual_snow: 8, mig_aura: 1 } }
    ]
  },
  {
    id: 'aura_onset',
    section: 'Aura',
    text: 'How does it begin?',
    help: 'Migraine aura spreads. Vascular events tend to arrive complete.',
    type: 'single',
    when: a => a.get('aura') !== 'no',
    options: [
      { v: 'gradual', label: 'It builds and spreads gradually over 5 minutes or more',
        s: { mig_aura: 6, silent_aura: 3, brainstem_aura: 2, hemiplegic_mig: 2 } },
      { v: 'sudden', label: 'It arrives fully formed, all at once',
        s: { mig_aura: -3, silent_aura: -2, urgent_hint: 3 } },
      { v: 'unsure_onset', label: 'I have never noticed', s: {} }
    ]
  },
  {
    id: 'aura_duration',
    section: 'Aura',
    text: 'How long does each neurological symptom last?',
    type: 'single',
    when: a => a.get('aura') !== 'no',
    options: [
      { v: 'under5', label: 'Under 5 minutes', s: { mig_aura: -1, sunct: 1 } },
      { v: 'five_60', label: '5 to 60 minutes', s: { mig_aura: 6, silent_aura: 4, retinal_mig: 3, brainstem_aura: 3 } },
      { v: 'over_60', label: 'Longer than an hour, but it fully resolves',
        s: { hemiplegic_mig: 4, mig_aura: 1, brainstem_aura: 1 } },
      { v: 'persists', label: 'It has not fully gone away', s: { urgent_hint: 6, mig_aura: -3 } }
    ]
  },
  {
    id: 'aura_headache',
    section: 'Aura',
    text: 'Does a headache follow?',
    type: 'single',
    when: a => a.get('aura') !== 'no',
    options: [
      { v: 'always', label: 'Yes, usually within an hour', s: { mig_aura: 5, silent_aura: -5 } },
      { v: 'sometimes', label: 'Sometimes', s: { mig_aura: 3, silent_aura: 3 } },
      { v: 'rarely', label: 'Rarely or never', s: { silent_aura: 7, mig_aura: -1 } }
    ]
  },

  /* ================= Pattern over time ================= */
  {
    id: 'frequency',
    section: 'Pattern over time',
    text: 'How many days a month do you have any headache at all?',
    help: 'Count any day with any head pain, even a mild one you medicated early.',
    type: 'single',
    options: [
      { v: 'under1', label: 'Less than one', s: { mig_no_aura: 1, chronic_mig: -8, moh: -6 } },
      { v: 'd1_4', label: '1 to 4 days', s: { mig_no_aura: 3, menstrual_mig: 2, chronic_mig: -8, moh: -6 } },
      { v: 'd5_9', label: '5 to 9 days', s: { mig_no_aura: 3, tth: 2, chronic_mig: -4, moh: -2 } },
      { v: 'd10_14', label: '10 to 14 days', s: { mig_no_aura: 2, moh: 3, chronic_mig: -1, tth: 1 } },
      { v: 'd15plus', label: '15 or more days', s: { chronic_mig: 8, moh: 5, ndph: 3, tth: 2, iih: 2, sleep_apnea_ha: 2 } }
    ]
  },
  {
    id: 'onset_pattern',
    section: 'Pattern over time',
    text: 'How did this pattern start?',
    type: 'single',
    options: [
      { v: 'named_day', label: 'On one specific day I can name — and it never stopped since',
        s: { ndph: 9, csf_leak: 3, iih: 2, chronic_mig: -2, mig_no_aura: -2 } },
      { v: 'gradual_worse', label: 'It was occasional and has slowly become more frequent',
        s: { chronic_mig: 6, moh: 5, mig_no_aura: 2 } },
      { v: 'stable_years', label: 'Roughly the same for years', s: { mig_no_aura: 3, tth: 3, cluster: 2 } },
      { v: 'after_illness', label: 'After an infection, a procedure, or a period of high stress',
        s: { ndph: 5, csf_leak: 3, tth: 2, chronic_mig: 1 } }
    ]
  },
  {
    id: 'med_days',
    section: 'Pattern over time',
    text: 'How many days a month do you take something for the pain?',
    help: 'Include over-the-counter painkillers, triptans, combination tablets with caffeine or codeine — anything taken to stop an attack.',
    type: 'single',
    options: [
      { v: 'none', label: 'Rarely or never', s: { moh: -8 } },
      { v: 'under5', label: 'Fewer than 5 days', s: { moh: -4 } },
      { v: 'd5_9', label: '5 to 9 days', s: { moh: 2 } },
      { v: 'd10_14', label: '10 to 14 days', s: { moh: 7, chronic_mig: 2 } },
      { v: 'd15plus', label: '15 or more days', s: { moh: 9, chronic_mig: 3 } }
    ]
  },
  {
    id: 'med_type',
    section: 'Pattern over time',
    text: 'Which do you reach for most often?',
    help: 'The threshold for medication-overuse headache differs by drug class — 10 days a month for these, 15 for plain paracetamol or ibuprofen.',
    type: 'single',
    when: a => ['d5_9', 'd10_14', 'd15plus'].includes(a.get('med_days')),
    options: [
      { v: 'simple', label: 'Plain paracetamol, aspirin, or ibuprofen', s: { moh: 2 } },
      { v: 'combo', label: 'Combination tablets — with caffeine, codeine, or sold for migraine', s: { moh: 6 } },
      { v: 'triptan', label: 'A triptan — sumatriptan, rizatriptan, and similar', s: { moh: 5, mig_no_aura: 3 } },
      { v: 'opioid', label: 'An opioid — codeine, tramadol, or stronger', s: { moh: 7 } }
    ]
  },

  /* ================= Triggers and positions ================= */
  {
    id: 'position',
    section: 'Triggers and positions',
    text: 'Does body position change the pain?',
    help: 'The direction of the positional effect points to opposite problems, so this one matters.',
    type: 'multi',
    exclusive: 'none',
    options: [
      { v: 'worse_upright', label: 'Much worse within minutes of standing, better lying flat',
        s: { csf_leak: 9, iih: -3 } },
      { v: 'worse_lying', label: 'Worse lying flat or bending forward, better upright',
        s: { iih: 6, sinus: 3, csf_leak: -4 } },
      { v: 'worse_morning', label: 'Worst on waking, eases through the morning',
        s: { sleep_apnea_ha: 6, iih: 4, moh: 2 } },
      { v: 'wakes_night', label: 'It wakes me from sleep',
        s: { cluster: 4, hypnic: 6, iih: 2, moh: 1 } },
      { v: 'none', label: 'Position makes no difference', s: { csf_leak: -4, iih: -2 } }
    ]
  },
  {
    id: 'valsalva',
    section: 'Triggers and positions',
    text: 'Do any of these set it off?',
    type: 'multi',
    exclusive: 'none',
    options: [
      { v: 'cough', label: 'Coughing, sneezing, straining, or bearing down',
        s: { cough_ha: 8, iih: 3, csf_leak: 2 } },
      { v: 'exertion', label: 'Sustained exercise — running, lifting',
        s: { exercise_ha: 8, mig_no_aura: 2 } },
      { v: 'touch_face', label: 'Light touch to the face, chewing, brushing teeth, or cold air',
        s: { trigeminal_neuralgia: 8, sunct: 4 } },
      { v: 'none', label: 'None of these', s: { cough_ha: -6, exercise_ha: -6, trigeminal_neuralgia: -4 } }
    ]
  },
  {
    id: 'neck_jaw',
    section: 'Triggers and positions',
    text: 'Anything going on with your neck or jaw?',
    type: 'multi',
    exclusive: 'none',
    options: [
      { v: 'neck_movement', label: 'Certain neck positions or movements bring the headache on',
        s: { cervicogenic: 7, occipital_neuralgia: 3, tth: 1 } },
      { v: 'tender_base', label: 'A tender spot at the base of my skull that reproduces the pain when pressed',
        s: { occipital_neuralgia: 7, cervicogenic: 4 } },
      { v: 'neck_stiff', label: 'Reduced neck range of motion',
        s: { cervicogenic: 5, tth: 2 } },
      { v: 'jaw_click', label: 'My jaw clicks, locks, or gets tired when chewing',
        s: { tmj: 7 } },
      { v: 'grinding', label: 'I clench or grind my teeth, especially at night',
        s: { tmj: 5, tth: 3, sleep_apnea_ha: 2 } },
      { v: 'none', label: 'None of these', s: { cervicogenic: -4, occipital_neuralgia: -4, tmj: -5 } }
    ]
  },
  {
    id: 'triggers',
    section: 'Triggers and positions',
    text: 'What reliably brings an attack on?',
    help: 'Migraine is characteristically triggered by change of any kind — in sleep, meals, hormones, or weather.',
    type: 'multi',
    exclusive: 'none',
    options: [
      { v: 'stress', label: 'Stress, or the let-down after stress', s: { mig_no_aura: 3, tth: 3 } },
      { v: 'sleep', label: 'Too little or too much sleep', s: { mig_no_aura: 4, insomnia: 3 } },
      { v: 'meals', label: 'Skipping meals', s: { mig_no_aura: 4 } },
      { v: 'alcohol', label: 'Alcohol, especially red wine', s: { mig_no_aura: 3, cluster: 4 } },
      { v: 'foods', label: 'Aged cheese, cured meats, MSG, or artificial sweeteners', s: { mig_no_aura: 3 } },
      { v: 'weather', label: 'Weather or barometric pressure shifts', s: { mig_no_aura: 4, sinus: 1 } },
      { v: 'light', label: 'Bright, flickering, or fluorescent light', s: { mig_no_aura: 4, visual_snow: 2 } },
      { v: 'smells', label: 'Strong smells — perfume, petrol, cleaning products', s: { mig_no_aura: 4, tth: -1 } },
      { v: 'dehydration', label: 'Dehydration', s: { mig_no_aura: 2 } },
      { v: 'caffeine', label: 'Missing or delaying my usual coffee', s: { caffeine_withdrawal: 8, mig_no_aura: 1 } },
      { v: 'none', label: 'Nothing predictable', s: { mig_no_aura: -2, ndph: 2 } }
    ]
  },
  {
    id: 'menstrual',
    section: 'Triggers and positions',
    text: 'How do your attacks relate to your menstrual cycle?',
    type: 'single',
    options: [
      { v: 'na', label: 'I do not menstruate', s: { menstrual_mig: -9 } },
      { v: 'no_relation', label: 'No relationship I have noticed', s: { menstrual_mig: -5 } },
      { v: 'around_period', label: 'Attacks cluster from two days before to three days after bleeding starts, plus at other times',
        s: { menstrual_mig: 8, mig_no_aura: 3 } },
      { v: 'only_period', label: 'Attacks happen almost exclusively in that window',
        s: { menstrual_mig: 9, mig_no_aura: 2 } },
      { v: 'hormonal_meds', label: 'They changed when I started or stopped hormonal contraception or HRT',
        s: { menstrual_mig: 5, mig_aura: 1 } }
    ]
  },

  /* ================= Other symptoms ================= */
  {
    id: 'iih_features',
    section: 'Other symptoms',
    text: 'Do you get any of these?',
    help: 'This group screens for pressure problems inside the skull, which are treated differently and more urgently.',
    type: 'multi',
    exclusive: 'none',
    options: [
      { v: 'pulsatile', label: 'A whooshing sound in one ear, in time with my heartbeat',
        s: { iih: 8, csf_leak: 1 } },
      { v: 'obscurations', label: 'Vision greys out for a few seconds when I stand or bend over',
        s: { iih: 8 } },
      { v: 'double', label: 'Intermittent double vision', s: { iih: 5, brainstem_aura: 2 } },
      { v: 'muffled', label: 'Muffled hearing or ear fullness that changes with position',
        s: { csf_leak: 5 } },
      { v: 'none', label: 'None of these', s: { iih: -5, csf_leak: -2 } }
    ]
  },
  {
    id: 'vertigo_detail',
    section: 'Other symptoms',
    text: 'Tell us about the dizziness.',
    type: 'multi',
    exclusive: 'none',
    when: a => a.get('primary') === 'dizziness' || a.has('aura_types', 'brainstem') || a.has('iih_features', 'double'),
    options: [
      { v: 'spontaneous', label: 'Spinning that starts on its own and lasts minutes to hours',
        s: { vestibular_mig: 7, brainstem_aura: 2 } },
      { v: 'head_motion', label: 'Turning my head or busy visual scenes make me feel awful',
        s: { vestibular_mig: 6 } },
      { v: 'with_migraine', label: 'It comes with light sensitivity or a headache at least half the time',
        s: { vestibular_mig: 7, brainstem_aura: 2 } },
      { v: 'brief_positional', label: 'Brief spinning of under a minute, only when I roll over or look up',
        s: { vestibular_mig: -3 }, note: 'This pattern suggests BPPV, an inner-ear problem that is often fixed in a single appointment' },
      { v: 'hearing_loss', label: 'Hearing loss or ear fullness that comes with the spinning',
        s: { vestibular_mig: -2 }, note: 'Worth an audiology assessment' }
    ]
  },
  {
    id: 'sinus_features',
    section: 'Other symptoms',
    text: 'Any nasal or sinus symptoms with your headaches?',
    type: 'multi',
    exclusive: 'none',
    options: [
      { v: 'discharge', label: 'Thick discoloured discharge from my nose', s: { sinus: 7 } },
      { v: 'smell_loss', label: 'My sense of smell drops during these episodes', s: { sinus: 6 } },
      { v: 'fever_sinus', label: 'Fever with facial pressure', s: { sinus: 5 } },
      { v: 'clear_runny', label: 'A clear runny nose or watery eye, but nothing else',
        s: { mig_no_aura: 3, cluster: 2, sinus: -3 }, note: 'Migraine commonly causes this, which is why it is so often mistaken for sinus headache' },
      { v: 'none', label: 'None of these', s: { sinus: -6 } }
    ]
  },
  {
    id: 'relief',
    section: 'Other symptoms',
    text: 'What actually helps?',
    type: 'multi',
    exclusive: 'none',
    options: [
      { v: 'sleep', label: 'Sleeping it off', s: { mig_no_aura: 4, chronic_mig: 1 } },
      { v: 'dark', label: 'A dark, silent room', s: { mig_no_aura: 4, cluster: -2 } },
      { v: 'triptan', label: 'A triptan works well', s: { mig_no_aura: 6, mig_aura: 2, tth: -3 } },
      { v: 'triptan_no', label: 'I have tried a triptan and it did nothing', s: { mig_no_aura: -2, tth: 2, moh: 1 } },
      { v: 'indometh', label: 'Indometacin wiped it out completely',
        s: { paroxysmal_hemicrania: 9, hemicrania_continua: 9 } },
      { v: 'oxygen', label: 'Breathing high-flow oxygen aborts it', s: { cluster: 9 } },
      { v: 'caffeine_helps', label: 'Caffeine reliably fixes it', s: { caffeine_withdrawal: 5, hypnic: 2 } },
      { v: 'nothing', label: 'Nothing much helps', s: { moh: 3, ndph: 3, chronic_mig: 2 } }
    ]
  },
  {
    id: 'comorbid',
    section: 'Other symptoms',
    text: 'Last one — do any of these apply to you?',
    help: 'These conditions travel alongside migraine. They do not explain your headaches, but they change what treatment is likely to work, and several are worth a simple test.',
    type: 'multi',
    exclusive: 'none',
    options: [
      { v: 'pots', label: 'Lightheaded with a racing heart when I stand up', s: { pots: 8 } },
      { v: 'hyper', label: 'Very flexible joints, frequent sprains, or stretchy skin', s: { hypermobility: 8, csf_leak: 2 } },
      { v: 'fibro', label: 'Widespread body pain and persistent fatigue', s: { allodynia: 4, mood: 2 } },
      { v: 'snoring', label: 'Loud snoring, witnessed breathing pauses, or daytime sleepiness', s: { sleep_apnea_ha: 7 } },
      { v: 'mood', label: 'Anxiety or depression', s: { mood: 8, insomnia: 2 } },
      { v: 'insomnia', label: 'Trouble falling or staying asleep', s: { insomnia: 8 } },
      { v: 'gi', label: 'IBS, reflux, or a stomach that empties slowly', s: { gi: 8 } },
      { v: 'vomit_bouts', label: 'Bouts of relentless vomiting lasting a day or more', s: { cvs: 8, status_mig: 1 } },
      { v: 'periods', label: 'Heavy periods with fatigue or breathlessness', s: { iron: 8 } },
      { v: 'thyroid', label: 'Known or suspected thyroid problems', s: { thyroid: 8 } },
      { v: 'none', label: 'None of these', s: {} }
    ]
  }
];
