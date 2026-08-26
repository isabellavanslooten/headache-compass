# Headache Compass

A private, browser-only question tree that helps you describe your headaches in the
language clinicians use, then hands you a structured summary to bring to an appointment.

**It does not diagnose anything.** Headache medicine has no confirmatory blood test or
scan — diagnosis is made almost entirely from how a patient describes their attacks. This
tool walks through the questions a headache specialist would ask and organises the answers.
That is all it does.

## How it works

The questionnaire is a branching tree, not a fixed form. Each question declares an optional
`when` predicate, so the path adapts: cranial autonomic features are only asked about if the
pain is one-sided, aura sub-questions only appear if aura exists, and the medication-class
question only appears above a usage threshold.

Answers accumulate weights toward ~31 conditions. Two mechanisms keep the output honest:

- **Hard gates.** A condition whose defining feature is absent is removed entirely rather
  than merely scoring low. No hemiplegic migraine without motor weakness; no medication-overuse
  headache without medication; no CSF leak without the positional pattern.
- **Normalised confidence.** A condition's score is divided by the maximum it could have earned
  across the questions actually asked, so conditions probed by few questions are not penalised.

Migraine subtypes then blend with the general migraine score, since a subtype is migraine
*plus* a distinguishing feature.

A red-flag screen runs first and short-circuits the questionnaire — thunderclap onset, fever
with neck stiffness, unresolved neurological deficits, and the rest of the standard list.

## Privacy

No server, no build step, no framework, no analytics, no cookies, no `localStorage`. Every
answer lives in a JavaScript object and dies with the tab. There is no session to recover,
which is why the results screen pushes you to print or copy before leaving.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Disclaimer gate, question shell, results container |
| `questions.js` | The 30-question tree with branching predicates and scoring weights |
| `conditions.js` | Descriptions of 31 conditions and 11 comorbidities |
| `engine.js` | Visibility, gates, scoring, red flags, transcript |
| `app.js` | Rendering, keyboard handling, print and clipboard export |
| `styles.css` | Light/dark tokens and a print stylesheet |

Static files only. Run it with any web server:

```
python3 -m http.server 8000
```

ES modules require a real server — opening `index.html` over `file://` will not work.

## Clinical framing

Condition descriptions follow the ICHD-3 framework. They are written for patients to read and
to hand over, not as diagnostic criteria.

## Licence

MIT.
