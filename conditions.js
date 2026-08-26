/* conditions.js — reference library of headache-related conditions.
   Nothing here is a diagnosis. Each entry is a description written so that
   a patient can read it and bring the vocabulary to a clinician. */

export const CONDITIONS = {
  /* ---------- Migraine subtypes ---------- */
  mig_no_aura: {
    name: 'Migraine without aura',
    group: 'Migraine subtype',
    blurb: 'The most common form of migraine. Attacks of moderate-to-severe head pain, often one-sided and pulsing, lasting 4–72 hours untreated, made worse by ordinary movement, and paired with nausea and/or sensitivity to light and sound.',
    hallmarks: [
      'Attacks last 4–72 hours if untreated',
      'Routine activity (walking, stairs) makes the pain worse',
      'Nausea, light sensitivity, or sound sensitivity during attacks',
      'Normal between attacks'
    ],
    workup: 'Usually diagnosed on history alone. A clinician will typically review a headache diary and check for red flags rather than order imaging.',
    ask: 'Do my attacks meet the criteria for migraine without aura? Would a preventive medication be reasonable at my attack frequency?'
  },
  mig_aura: {
    name: 'Migraine with typical aura',
    group: 'Migraine subtype',
    blurb: 'Migraine preceded or accompanied by reversible neurological symptoms — most often visual (zigzags, shimmering blind spots that expand), sometimes tingling that marches up a limb, or word-finding trouble. Aura builds gradually over at least 5 minutes and clears within an hour.',
    hallmarks: [
      'Aura develops gradually rather than all at once',
      'Each aura symptom lasts 5–60 minutes and fully resolves',
      'Headache usually follows within an hour (but not always)',
      'Visual symptoms affect both eyes, not one'
    ],
    workup: 'History-based. Because aura raises stroke-risk considerations, clinicians often review blood pressure, smoking, and combined hormonal contraception use.',
    ask: 'Does aura change which medications are safe for me — especially estrogen-containing birth control?'
  },
  silent_aura: {
    name: 'Typical aura without headache ("silent migraine")',
    group: 'Migraine subtype',
    blurb: 'Aura episodes — visual, sensory, or speech — that arrive with little or no headache afterward. Common in people who had classic migraine when younger, and more common after age 50.',
    hallmarks: [
      'Aura symptoms occur on their own',
      'Little or no headache follows',
      'Symptoms build gradually and resolve within an hour'
    ],
    workup: 'Because late-onset aura-like spells can mimic TIA (mini-stroke), a first-time evaluation often includes vascular assessment and sometimes brain imaging.',
    ask: 'How do you distinguish my episodes from a TIA? Do I need imaging or a cardiac workup?'
  },
  chronic_mig: {
    name: 'Chronic migraine',
    group: 'Migraine subtype',
    blurb: 'Headache on 15 or more days per month for over three months, with at least 8 of those days having migraine features. It is a distinct diagnosis from frequent episodic migraine and unlocks specific treatments.',
    hallmarks: [
      '15+ headache days per month, 3+ months running',
      'At least 8 days per month with migraine features',
      'Often evolves gradually from episodic migraine',
      'Frequently coexists with medication-overuse headache'
    ],
    workup: 'A prospective headache diary is usually required. Treatments specific to this diagnosis include onabotulinumtoxinA and CGRP monoclonal antibodies.',
    ask: 'Do I meet criteria for chronic migraine? Am I a candidate for Botox or a CGRP preventive?'
  },
  menstrual_mig: {
    name: 'Menstrual-related migraine',
    group: 'Migraine subtype',
    blurb: 'Migraine attacks reliably clustered from two days before through three days after the start of menstruation, driven by the drop in estrogen. These attacks are often longer, more severe, and less responsive to usual treatment.',
    hallmarks: [
      'Attacks in the window from 2 days before to 3 days after bleeding starts',
      'Pattern holds across at least two of three cycles',
      'Attacks tend to be longer-lasting and harder to treat',
      'Usually without aura'
    ],
    workup: 'Diagnosed with a diary tracking attacks against cycle days for 2–3 months. Short-term "mini-prophylaxis" around the period is a recognized strategy.',
    ask: 'Would timed preventive treatment around my period help? Is my contraception affecting this?'
  },
  vestibular_mig: {
    name: 'Vestibular migraine',
    group: 'Migraine subtype',
    blurb: 'Migraine that presents primarily as vertigo, dizziness, or motion intolerance rather than pain. Episodes last minutes to days and may occur with or without headache. It is one of the most common causes of recurrent spontaneous vertigo in adults.',
    hallmarks: [
      'Episodes of vertigo or unsteadiness lasting 5 minutes to 72 hours',
      'Migraine features (light sensitivity, headache, aura) during at least half of episodes',
      'A personal or past history of migraine',
      'Motion and busy visual environments feel intolerable'
    ],
    workup: 'Usually a neurologist or neuro-otologist. Testing is often done to rule out inner-ear causes (BPPV, Ménière disease, vestibular neuritis) rather than to prove migraine.',
    ask: 'Could my dizziness be vestibular migraine rather than an inner-ear problem? Would vestibular rehab help?'
  },
  hemiplegic_mig: {
    name: 'Hemiplegic migraine',
    group: 'Migraine subtype',
    blurb: 'A rare migraine subtype in which the aura includes genuine one-sided motor weakness, alongside visual, sensory, or speech aura. Can run in families. Weakness fully resolves, but may last hours to days.',
    hallmarks: [
      'Aura includes real weakness on one side, not just numbness',
      'Other aura types present too (visual, sensory, speech)',
      'Symptoms fully reverse',
      'Often a family history of the same pattern'
    ],
    workup: 'Requires specialist evaluation and imaging to exclude stroke, especially at first presentation. Genetic testing is sometimes offered. Certain migraine drugs (triptans, ergots) are traditionally avoided.',
    ask: 'Should I avoid triptans? Do I need genetic testing or a stroke workup?',
    urgentNote: 'Any first episode of one-sided weakness must be treated as a possible stroke and evaluated emergently.'
  },
  brainstem_aura: {
    name: 'Migraine with brainstem aura',
    group: 'Migraine subtype',
    blurb: 'Migraine whose aura arises from the brainstem: vertigo, double vision, slurred speech, ringing in the ears, hearing change, unsteadiness, or reduced alertness — without any weakness. Previously called basilar migraine.',
    hallmarks: [
      'Two or more brainstem symptoms during aura',
      'No motor weakness (that would suggest hemiplegic migraine instead)',
      'Symptoms are fully reversible',
      'Headache typically follows'
    ],
    workup: 'Specialist evaluation; imaging is common at first presentation because the symptoms overlap with posterior-circulation events.',
    ask: 'Do my aura symptoms fit brainstem aura? Does that restrict which acute medications I can use?'
  },
  retinal_mig: {
    name: 'Retinal migraine',
    group: 'Migraine subtype',
    blurb: 'Repeated attacks of visual disturbance or blindness in one eye only — confirmed by covering each eye in turn — lasting under an hour and followed by headache. Genuinely monocular symptoms are what separate it from ordinary visual aura.',
    hallmarks: [
      'Visual loss confirmed in a single eye',
      'Fully reversible, under 60 minutes',
      'Headache typically follows the visual episode',
      'Normal eye exam between attacks'
    ],
    workup: 'Needs ophthalmology and often vascular assessment — monocular vision loss can signal retinal artery problems and is treated seriously.',
    ask: 'Have we ruled out a retinal or carotid vascular cause for my one-eye vision loss?',
    urgentNote: 'Sudden vision loss in one eye needs same-day assessment the first time it happens.'
  },
  abdominal_mig: {
    name: 'Abdominal migraine',
    group: 'Migraine subtype',
    blurb: 'Recurrent attacks of midline abdominal pain lasting 2–72 hours with nausea, pallor, and appetite loss, and little or no headache. Mostly seen in children, many of whom develop typical migraine later.',
    hallmarks: [
      'Midline, dull abdominal pain of moderate-to-severe intensity',
      'Attacks last hours to days with complete wellness between',
      'Pallor, nausea, loss of appetite',
      'Usually childhood onset'
    ],
    workup: 'A diagnosis of exclusion — GI causes are ruled out first.',
    ask: 'Could these episodes be a migraine variant rather than a stomach problem?'
  },
  status_mig: {
    name: 'Status migrainosus',
    group: 'Migraine subtype',
    blurb: 'A debilitating migraine attack that has run past 72 hours without meaningful relief. It is treated as an acute problem in its own right, often needing rescue therapy rather than more of the usual tablets.',
    hallmarks: [
      'Attack lasting more than 72 hours',
      'Severe and disabling throughout',
      'Usual acute medication has failed',
      'Often with dehydration from vomiting'
    ],
    workup: 'Often managed urgently — IV fluids, antiemetics, steroids, or nerve blocks depending on the setting.',
    ask: 'What is my rescue plan when an attack passes the three-day mark?',
    urgentNote: 'A migraine lasting past 72 hours warrants contacting a clinician rather than waiting it out.'
  },

  /* ---------- Other primary headaches ---------- */
  tth: {
    name: 'Tension-type headache',
    group: 'Other primary headache',
    blurb: 'A pressing or tightening band-like pain, usually on both sides, mild to moderate, that does not worsen with routine activity and comes without nausea. The most common headache type worldwide, and it frequently coexists with migraine.',
    hallmarks: [
      'Pressing or tightening, not pulsing',
      'Both sides, band or vice-like',
      'Not worsened by walking or climbing stairs',
      'No nausea; at most one of light or sound sensitivity'
    ],
    workup: 'History-based. Clinicians look for neck and jaw muscle tenderness and for medication overuse.',
    ask: 'Are some of my headaches tension-type and others migraine? Should they be treated differently?'
  },
  cluster: {
    name: 'Cluster headache',
    group: 'Other primary headache',
    blurb: 'Excruciating strictly one-sided pain around or behind the eye lasting 15–180 minutes, with tearing, a red eye, drooping lid, or a blocked nostril on that same side. People pace or rock rather than lie still. Attacks group into bouts lasting weeks, often waking people at the same hour each night.',
    hallmarks: [
      'Always the same side, centred on the eye or temple',
      '15–180 minutes per attack, up to 8 attacks a day',
      'Tearing, redness, lid droop, or nasal congestion on the painful side',
      'Restlessness and agitation during attacks',
      'Bouts over weeks separated by remission'
    ],
    workup: 'Neurology referral. First presentation usually gets brain imaging (MRI with pituitary views). High-flow oxygen and injectable sumatriptan are the standard acute treatments.',
    ask: 'Can I be prescribed high-flow oxygen and an injectable triptan? Should I start verapamil for the bout?',
    urgentNote: 'Cluster headache is severely painful but treatable — it is worth pushing for specialist referral rather than enduring bouts.'
  },
  paroxysmal_hemicrania: {
    name: 'Paroxysmal hemicrania',
    group: 'Other primary headache',
    blurb: 'Short, severe one-sided attacks around the eye lasting 2–30 minutes, many times a day, with tearing or nasal symptoms on that side. Its defining feature is a complete response to indomethacin.',
    hallmarks: [
      'Attacks of 2–30 minutes, often more than 5 per day',
      'One-sided with tearing, congestion, or lid droop',
      'Absolute response to indomethacin',
      'More common in women, unlike cluster'
    ],
    workup: 'A supervised indomethacin trial is both treatment and diagnostic test. Imaging is typically done first.',
    ask: 'Would an indomethacin trial be appropriate to test this?'
  },
  hemicrania_continua: {
    name: 'Hemicrania continua',
    group: 'Other primary headache',
    blurb: 'A continuous one-sided headache, always the same side, present daily for months, with periodic flares carrying tearing or nasal congestion. Like paroxysmal hemicrania, it responds completely to indomethacin.',
    hallmarks: [
      'Continuous, strictly one-sided, never switching sides',
      'Background pain with severe exacerbations',
      'Autonomic features or restlessness during flares',
      'Complete indomethacin response'
    ],
    workup: 'Neurology referral with imaging, then an indomethacin trial.',
    ask: 'My headache never fully goes away and never switches sides — could this be hemicrania continua?'
  },
  sunct: {
    name: 'SUNCT / SUNA',
    group: 'Other primary headache',
    blurb: 'Very brief stabs or bursts of one-sided pain around the eye — seconds to a few minutes — recurring many times an hour, with tearing and redness. Rare, and frequently mistaken for trigeminal neuralgia.',
    hallmarks: [
      'Attacks lasting seconds to ~10 minutes',
      'Very high attack frequency — dozens per day',
      'Prominent tearing and eye redness',
      'Can be triggered by touching the face'
    ],
    workup: 'Neurology referral and MRI, since secondary causes near the pituitary are well described.',
    ask: 'Could these be SUNCT attacks rather than trigeminal neuralgia?'
  },
  hypnic: {
    name: 'Hypnic headache',
    group: 'Other primary headache',
    blurb: 'The "alarm-clock headache" — a dull headache that only ever occurs during sleep, waking the person at a consistent time, lasting 15 minutes to a few hours. Almost always begins after age 50.',
    hallmarks: [
      'Occurs exclusively out of sleep',
      'Wakes at a predictable hour',
      'Onset typically after 50',
      'Often responds to caffeine at bedtime'
    ],
    workup: 'Imaging is generally done to exclude secondary causes, given the late age of onset.',
    ask: 'My headaches only happen at night and wake me at the same time — is this hypnic headache?'
  },
  exercise_ha: {
    name: 'Primary exercise headache',
    group: 'Other primary headache',
    blurb: 'Pulsating headache brought on only by sustained physical exertion, lasting minutes to 48 hours. More common in hot weather and at altitude.',
    hallmarks: [
      'Triggered exclusively by exertion',
      'Pulsating, often both sides',
      'Worse in heat or at altitude'
    ],
    workup: 'First presentation warrants imaging to exclude bleeding or a structural lesion before calling it primary.',
    ask: 'Do I need a scan before we accept this is exercise-triggered and benign?',
    urgentNote: 'A first severe exertional headache should be evaluated promptly to exclude a bleed.'
  },
  cough_ha: {
    name: 'Primary cough headache',
    group: 'Other primary headache',
    blurb: 'Sudden sharp head pain triggered only by coughing, sneezing, straining, or bearing down, lasting seconds to a couple of hours. About 40% of cases turn out to be secondary, most often to a Chiari malformation.',
    hallmarks: [
      'Triggered strictly by Valsalva-type effort',
      'Sudden onset, brief duration',
      'No headache between triggered events'
    ],
    workup: 'Brain MRI including craniocervical junction views is essentially mandatory.',
    ask: 'Has a Chiari malformation been excluded with an MRI?'
  },
  ndph: {
    name: 'New daily persistent headache',
    group: 'Other primary headache',
    blurb: 'A headache that begins on a day the person can name, becomes continuous within 24 hours, and simply never stops. Often follows an infection or a stressful event. The vivid memory of the start date is the diagnostic clue.',
    hallmarks: [
      'You can name the exact day it started',
      'Continuous from the beginning — no build-up',
      'Present daily for more than three months',
      'Often preceded by a viral illness'
    ],
    workup: 'Substantial workup to exclude CSF leak, venous sinus thrombosis, and raised or lowered intracranial pressure before the label is applied.',
    ask: 'My headache started on a specific day and never stopped — have we excluded a CSF leak or pressure problem?'
  },

  /* ---------- Neuralgias and musculoskeletal ---------- */
  occipital_neuralgia: {
    name: 'Occipital neuralgia',
    group: 'Nerve or musculoskeletal',
    blurb: 'Sharp, shooting, electric pain travelling from the base of the skull up the back of the head, sometimes behind the eye, with a tender spot over the occipital nerve and scalp that hurts to brush.',
    hallmarks: [
      'Shooting pain from the neck upward over the scalp',
      'A tender point at the base of the skull',
      'Scalp numbness or hypersensitivity in the same area',
      'Pressing the nerve reproduces the pain'
    ],
    workup: 'A diagnostic occipital nerve block both confirms and treats it.',
    ask: 'Would an occipital nerve block be worth trying, both to confirm this and to treat it?'
  },
  trigeminal_neuralgia: {
    name: 'Trigeminal neuralgia',
    group: 'Nerve or musculoskeletal',
    blurb: 'Sudden electric-shock facial pain lasting seconds, set off by light touch, chewing, talking, brushing teeth, or cold air, in the cheek or jaw. Between jolts there is often no pain at all.',
    hallmarks: [
      'Shock-like stabs of a few seconds',
      'Triggered by innocuous touch or movement',
      'Confined to a facial nerve territory',
      'Pain-free intervals between attacks'
    ],
    workup: 'MRI to look for a blood vessel compressing the nerve or other causes. Carbamazepine is first-line treatment.',
    ask: 'Should I have an MRI to look for vascular compression? Is carbamazepine appropriate for me?'
  },
  cervicogenic: {
    name: 'Cervicogenic headache',
    group: 'Nerve or musculoskeletal',
    blurb: 'Headache referred from the neck — usually one-sided without switching, starting in the neck and spreading forward, provoked by neck positions or pressure over the upper cervical spine, with reduced neck range of motion.',
    hallmarks: [
      'Pain starts in the neck and moves to the head',
      'Same side each time',
      'Neck movement or sustained posture provokes it',
      'Restricted neck movement on examination'
    ],
    workup: 'Physical examination of the cervical spine; physiotherapy is central, and diagnostic nerve blocks are sometimes used.',
    ask: 'Could my neck be the source? Would physiotherapy or a diagnostic block help?'
  },
  tmj: {
    name: 'Temporomandibular disorder headache',
    group: 'Nerve or musculoskeletal',
    blurb: 'Headache in the temples driven by the jaw joint and chewing muscles — associated with clicking, jaw fatigue, clenching or grinding, and pain that worsens through the day or with chewing.',
    hallmarks: [
      'Temple pain with jaw clicking, locking, or fatigue',
      'Worse with chewing or after clenching',
      'Tender chewing muscles',
      'Often nocturnal grinding'
    ],
    workup: 'Dental or orofacial-pain assessment. Splints, jaw physiotherapy, and habit management are typical.',
    ask: 'Should I be assessed for a jaw disorder or nighttime grinding?'
  },

  /* ---------- Secondary and contributing ---------- */
  moh: {
    name: 'Medication-overuse headache',
    group: 'Secondary or contributing',
    blurb: 'A headache pattern that has been worsened and locked in place by frequent acute painkiller use — 10+ days a month for triptans, opioids, or combination analgesics, or 15+ for simple painkillers. It is common, reversible, and easy to miss because the medication still works briefly each time.',
    hallmarks: [
      'Headache on 15+ days a month',
      'Regular acute medication above the threshold days',
      'Headache worsened while the overuse continued',
      'Often improves substantially after a supervised withdrawal'
    ],
    workup: 'Managed with a structured withdrawal plan, usually alongside starting a preventive. Withdrawal temporarily worsens headache before it improves.',
    ask: 'Am I overusing acute medication? Can we plan a withdrawal with a bridge and a preventive in place?'
  },
  iih: {
    name: 'Idiopathic intracranial hypertension',
    group: 'Secondary or contributing',
    blurb: 'Raised pressure inside the skull without a tumour. Daily headache that is worse on waking or lying flat, with whooshing pulsatile tinnitus, brief grey-outs of vision on standing or bending, and swelling of the optic nerves. Vision loss is the risk that makes it urgent.',
    hallmarks: [
      'Headache worse lying flat or on waking',
      'Pulse-synchronous whooshing in the ear',
      'Brief visual blackouts with position change',
      'Double vision from a sixth-nerve palsy'
    ],
    workup: 'Urgent eye examination for papilloedema, then MRI/MRV and a lumbar puncture with opening pressure.',
    ask: 'Can I have my optic nerves examined? These symptoms can mean raised intracranial pressure.',
    urgentNote: 'Pulsatile tinnitus with visual obscurations needs an eye exam promptly — untreated raised pressure can permanently damage vision.'
  },
  csf_leak: {
    name: 'Spontaneous intracranial hypotension (CSF leak)',
    group: 'Secondary or contributing',
    blurb: 'A leak of spinal fluid lowers pressure around the brain. The signature is a headache that appears or worsens within minutes to hours of being upright and improves substantially on lying flat — often with neck pain, muffled hearing, or ringing.',
    hallmarks: [
      'Clear positional pattern: bad upright, better flat',
      'Sometimes follows a spinal procedure, or occurs spontaneously',
      'Neck stiffness, ear fullness, tinnitus',
      'Can become less positional over months'
    ],
    workup: 'Brain MRI with contrast looking for characteristic changes, then targeted spinal imaging. Epidural blood patch is the usual treatment.',
    ask: 'My headache is clearly better lying down — should we investigate a CSF leak?'
  },
  sinus: {
    name: 'Rhinosinusitis-related headache',
    group: 'Secondary or contributing',
    blurb: 'Genuine sinus headache requires actual sinus disease — purulent discharge, blocked nose, fever, reduced sense of smell — and improves as the infection clears. Most self-diagnosed "sinus headaches" turn out to be migraine, because migraine itself causes facial pressure and a runny nose.',
    hallmarks: [
      'Discoloured nasal discharge and blockage',
      'Reduced or absent sense of smell',
      'Facial pressure worse leaning forward',
      'Resolves as the sinus infection resolves'
    ],
    workup: 'ENT or primary-care assessment; imaging only when the picture is unclear or recurrent.',
    ask: 'Is this true sinus disease, or is it migraine with nasal symptoms?'
  },
  sleep_apnea_ha: {
    name: 'Sleep apnoea headache',
    group: 'Secondary or contributing',
    blurb: 'A dull, both-sided morning headache present on waking most days and clearing within a few hours, driven by breathing pauses overnight. Snoring, witnessed pauses, daytime sleepiness, and unrefreshing sleep are the clues.',
    hallmarks: [
      'Present on waking, gone within about four hours',
      'Both sides, pressing rather than pulsing',
      'Loud snoring or witnessed apnoeas',
      'Daytime sleepiness'
    ],
    workup: 'Sleep study. Treating the apnoea typically resolves the headache.',
    ask: 'Should I have a sleep study? My headaches are worst on waking.'
  },
  caffeine_withdrawal: {
    name: 'Caffeine-withdrawal headache',
    group: 'Secondary or contributing',
    blurb: 'A diffuse throbbing headache that appears 12–24 hours after cutting back on habitual caffeine, peaks over a day or two, and is relieved almost immediately by caffeine. Weekend headaches in daily coffee drinkers are the classic pattern.',
    hallmarks: [
      'Regular caffeine intake with irregular timing',
      'Headache on late or skipped days — often weekends',
      'Relieved within an hour by caffeine',
      'Fatigue and irritability alongside'
    ],
    workup: 'No testing. A steady daily intake, or a slow taper, settles it.',
    ask: 'Could my caffeine pattern be driving this? What is a sensible taper?'
  },

  /* ---------- Red flag holding entry ---------- */
  urgent: {
    name: 'Features needing urgent assessment',
    group: 'Urgent',
    blurb: 'One or more of your answers describes a headache pattern that medicine treats as urgent until proven otherwise. This does not mean something is definitely wrong — it means the safe order of operations is assessment first, pattern-matching second.',
    hallmarks: [],
    workup: '',
    ask: ''
  }
};

/* Comorbidities are reported separately — they are conditions that travel
   alongside migraine rather than competing explanations for the headache. */
export const COMORBIDS = {
  pots: {
    name: 'Orthostatic intolerance / POTS',
    blurb: 'Lightheadedness, racing heart, and fatigue on standing. Dysautonomia and migraine overlap substantially, and treating the orthostatic symptoms often reduces headache load.',
    ask: 'Would a standing heart-rate and blood-pressure check, or a tilt-table test, be reasonable?'
  },
  hypermobility: {
    name: 'Joint hypermobility spectrum',
    blurb: 'Bendy joints, frequent sprains, and soft stretchy skin travel with migraine, dysautonomia, and — importantly — a higher rate of spontaneous CSF leaks.',
    ask: 'Should my joint hypermobility change how you think about my headaches?'
  },
  allodynia: {
    name: 'Cutaneous allodynia / central sensitisation',
    blurb: 'When brushing your hair, wearing glasses, or a light touch hurts during an attack, the migraine has already sensitised central pain pathways. It predicts poorer response to triptans taken late, so it is an argument for treating attacks early.',
    ask: 'Since I get scalp sensitivity during attacks, should I be treating them earlier?'
  },
  visual_snow: {
    name: 'Visual snow syndrome',
    blurb: 'Constant television-static across the whole visual field, present even with eyes closed, usually with after-images, light sensitivity, and floaters. It is continuous — unlike aura, which comes and goes — and is strongly associated with migraine.',
    ask: 'I see static continuously, not just during attacks — could this be visual snow syndrome?'
  },
  cvs: {
    name: 'Cyclic vomiting syndrome',
    blurb: 'Stereotyped bouts of intense vomiting lasting hours to days with complete wellness in between. Considered a migraine-spectrum disorder and often responds to migraine preventives.',
    ask: 'Could my vomiting episodes be part of the migraine spectrum?'
  },
  mood: {
    name: 'Anxiety or depression',
    blurb: 'Migraine roughly doubles the rate of both, and the relationship runs in both directions. It matters practically: some preventives treat both, and some can worsen mood.',
    ask: 'Could we choose a preventive that also helps mood?'
  },
  insomnia: {
    name: 'Insomnia or irregular sleep',
    blurb: 'Both too little and too much sleep trigger attacks, and poor sleep is one of the strongest predictors of episodic migraine becoming chronic. Sleep behavioural therapy has measurable effects on headache frequency.',
    ask: 'Should we address my sleep as part of migraine prevention?'
  },
  iron: {
    name: 'Iron deficiency',
    blurb: 'Heavy periods with fatigue, breathlessness, and pallor point to iron deficiency, which independently worsens headache frequency and is straightforward to check and correct.',
    ask: 'Can we check ferritin and a full blood count?'
  },
  thyroid: {
    name: 'Thyroid dysfunction',
    blurb: 'Hypothyroidism raises headache frequency, and headache sometimes improves once thyroid function is corrected. A simple blood test settles it.',
    ask: 'Can we check my thyroid function?'
  },
  pfo: {
    name: 'Patent foramen ovale (in migraine with aura)',
    blurb: 'A small hole between the upper heart chambers is more common in people with aura. Routine closure is not recommended for migraine alone, but it becomes relevant if you have also had a stroke of unclear cause.',
    ask: 'Given my aura, is a PFO relevant to me — particularly regarding stroke risk?'
  },
  gi: {
    name: 'Gut symptoms and gastric stasis',
    blurb: 'IBS and reflux are over-represented in migraine, and attacks slow stomach emptying — which is often why oral tablets fail. Non-oral routes or an added anti-nausea drug can rescue an otherwise ineffective treatment.',
    ask: 'If tablets are not absorbing during attacks, could I try a nasal spray, injection, or an added prokinetic?'
  }
};
