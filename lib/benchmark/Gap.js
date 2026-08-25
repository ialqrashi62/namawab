// lib/benchmark/Gap.js — compare + prioritize (token-saver DSL)
// Usage:
//   const Gap = require('./lib/benchmark/Gap');
//   Gap.compare({ categories: ['clinical','revenue_cycle'] });
//   Gap.prioritize({ horizon: '90d' });
'use strict';

const { SYSTEMS, DIMENSIONS } = require('./Competitors');

function compare({ categories } = {}) {
  const cats = (categories && categories.length ? categories : DIMENSIONS)
    .filter(c => DIMENSIONS.includes(c));
  const matrix = cats.map(cat => {
    const row = { dimension: cat };
    for (const [sys, prof] of Object.entries(SYSTEMS)) row[sys] = prof[cat];
    return row;
  });
  const leaders = {};
  for (const cat of cats) {
    let best = null;
    for (const [sys, prof] of Object.entries(SYSTEMS)) {
      if (!best || prof[cat] > SYSTEMS[best][cat]) best = sys;
    }
    leaders[cat] = best;
  }
  return { matrix, leaders, generated_at: new Date().toISOString() };
}

// Known verified gaps (from GAP_ANALYSIS_CATALOG.md + ROADMAP_GAPS_USER_STORIES.md)
const GAP_REGISTER = [
  { id: 'GAP-1', title: 'Persist analytics events (funnel/BI)', impact: 3, effort: 1, rail: 'RAIL-13', sprintable: true },
  { id: 'GAP-2', title: 'Persist helpdesk tickets + SLA timers', impact: 3, effort: 1, rail: 'RAIL-10', sprintable: true },
  { id: 'GAP-3', title: 'APM metrics endpoint + retention', impact: 3, effort: 1, rail: 'RAIL-13', sprintable: true },
  { id: 'GAP-4', title: 'Wire pgvector ingestion pipeline to engines', impact: 5, effort: 3, rail: 'RAIL-5', sprintable: true },
  { id: 'GAP-5', title: 'BCMA barcode administration flow', impact: 5, effort: 3, rail: 'RAIL-1', sprintable: true },
  { id: 'GAP-6', title: 'e-Prescribing/EPCS depth vs Epic', impact: 4, effort: 3, rail: 'RAIL-1', sprintable: false },
  { id: 'GAP-7', title: 'CDSS formal rules engine consolidation', impact: 4, effort: 2, rail: 'RAIL-1', sprintable: true },
  { id: 'GAP-8', title: 'Patient portal self-service parity', impact: 4, effort: 3, rail: 'RAIL-5', sprintable: false },
  { id: 'GAP-9', title: 'E2E regression suite for mounted routes', impact: 3, effort: 2, rail: 'RAIL-13', sprintable: true },
  { id: 'GAP-10', title: 'Mobile/offline companion strategy', impact: 3, effort: 3, rail: 'RAIL-5', sprintable: false },
];

function prioritize({ horizon = '90d' } = {}) {
  const horizonDays = parseInt(horizon, 10) || 90;
  const items = GAP_REGISTER
    .map(g => ({ ...g, score: +(g.impact / g.effort).toFixed(2) }))
    .sort((a, b) => b.score - a.score);
  const inHorizon = items.filter(g => g.sprintable && g.effort <= (horizonDays >= 180 ? 3 : 2));
  const later = items.filter(g => !inHorizon.includes(g));
  return { horizon, now: inHorizon, later };
}

module.exports = { compare, prioritize, GAP_REGISTER };
