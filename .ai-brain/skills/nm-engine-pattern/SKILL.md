---
name: nm-engine-pattern
description: Use when writing any new clinical pure-function engine (GRACE, HAS-BLED, APGAR, ASA, ESI, DAS28, etc.). Loads the canonical input/result/citation contract so every engine returns the same shape. Saves ~60% tokens per engine.
---

# Clinical Engine Pattern — Token-Saver for Pure-Function Engines

## When to use

Any new clinical scoring/decision engine — GRACE, CHA2DS2-VASc, HAS-BLED, HF stage,
troponin interpretation, APGAR, PEWS, ASA, Caprini, ESI, Bishop, GFR, AKI, Kt/V, NIHSS,
DAS28, DAPSA, bone density, hormonal, glycemic, Glasgow-Blatchford, etc.

## Canonical contract

```js
// namaweb/{dept}_engine.js
'use strict';

// All inputs are plain JS objects (validated upstream by validateBody).
// All outputs follow this exact shape so front-end can render uniformly:

/**
 * @typedef {Object} EngineResult
 * @property {number|null} score        — numeric score, or null if N/A
 * @property {string}      risk          — 'low' | 'moderate' | 'high' | 'very_high' | 'unknown'
 * @property {string}      recommendation — 1-sentence clinical action
 * @property {string}      cite          — PMID / DOI / guideline reference
 * @property {string}      version       — engine version, e.g. '1.0.0'
 * @property {Object}      components    — sub-scores / breakdown for explainability
 * @property {string[]}    warnings      — non-fatal input issues (e.g. age out of range)
 */

/**
 * @param {Object} input — validated input per route_schemas.js
 * @returns {EngineResult}
 */
function someScore(input) {
    const warnings = [];
    // ... validation ...
    // ... calculate sub-scores ...
    // ... derive overall risk ...
    return {
        score: totalScore,
        risk: riskBand,
        recommendation: 'Refer to cardiology; consider early invasive strategy.',
        cite: 'JAMA.2006;295(11):1233-1240. PMID 16522839',
        version: '1.0.0',
        components: { ageScore, hrScore, sbpScore, killipScore, creaScore },
        warnings
    };
}

module.exports = {
    someScore,
    VERSION: '1.0.0',
    CITATIONS: ['JAMA.2006;295(11):1233-1240'],
};
```

## Engine module skeleton

```js
'use strict';

function validateInput(input, schema) { /* ...throw if invalid... */ }

function fooScore(input) {
    validateInput(input, fooSchema);
    // ... compute ...
    return { score, risk, recommendation, cite, version: VERSION, components, warnings };
}

function barScore(input) {
    validateInput(input, barSchema);
    // ... compute ...
    return { ... };
}

const VERSION = '1.0.0';
const CITATIONS = ['PMID:11111111', 'DOI:10.1000/xyz'];

module.exports = {
    fooScore,
    barScore,
    VERSION,
    CITATIONS,
};
```

## Required fields per result (enforced by front-end renderer)

| Field | Type | Notes |
|---|---|---|
| `score` | number\|null | null if N/A (e.g. qualitative result) |
| `risk` | string enum | one of `low \| moderate \| high \| very_high \| unknown` |
| `recommendation` | string | 1-line clinical action |
| `cite` | string | PMID/DOI/guideline reference |
| `version` | string | engine version |
| `components` | object | sub-scores for explainability |
| `warnings` | string[] | non-fatal input issues |

## Acceptance gate

- All exports follow `EngineResult` shape
- ≥ 1 PMID or DOI in `CITATIONS`
- Pure functions only — no DB calls, no HTTP, no fs
- Throws on invalid input (caller catches and converts to 400)
- ≥ 80% branch coverage from unit tests

## Token saving

Avoid re-inventing the result shape per engine. Avoid re-writing the validation boilerplate.
Each engine = ~50 lines of pure logic vs ~120 lines from scratch. Saves ~60%.

## Reference engines already shipped

- `cardiology_engine.js` (grace, cha2ds2vasc, hasbled, hf, troponin, stemi)
- `pediatrics_engine.js` (apgar, fluid, croup, pews, immunizations)
- `surgery_engine.js` (asa, nsqip-simp, timeout, caprini)
- `pharmacy_engine.js` (interactions, renal-dose, pregnancy)
- `oncology_engine.js` (tnm, bsa, chemo-dose)
- `esi_engine.js` (triage)
- `pulmonology_engine.js` (asthma, copd)
- `gi_engine.js` (gi-bleed, ucmayo, ibd-activity)
- `neurology_engine.js` (nihss)
- `ckd_staging_engine.js`, `aki_engine.js`, `hd_adequacy_engine.js`
- `rheumatology_engine.js` (das28, dapsa)
- `orthopedics_engine.js` (harris)
- `obgyn_engine.js` (bishop, partograph)
- `endocrinology_engine.js` (hba1c, insulin, thyroid)
