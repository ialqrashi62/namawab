// P3_CV pcc_pain_mgmt_engine v3.60.0
'use strict';
function Nrs(input) {
  const i = input || {};
  const s = Number(i.s ?? 0);
  let plan = 'pain-mild';
  if (s >= 7) plan = 'pain-severe';
  else if (s >= 4) plan = 'pain-moderate';
  return { plan, s };
}
function OpioidRisk(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'risk-low';
  if (t === 'high') plan = 'risk-high-monitor';
  return { plan, t };
}
function Adjuvant(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-adjuvant';
  if (t === 'neuropathic') plan = 'gabapentinoid-adjuvant';
  return { plan, t };
}
function Breakthrough(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-breakthrough';
  if (t === 'yes') plan = 'rescue-dose-plan';
  return { plan, t };
}
function Bowel(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'bowel-ok';
  if (t === 'constipation') plan = 'opioid-constipation-protocol';
  return { plan, t };
}
function Sedation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'sedation-none';
  if (t === 'yes') plan = 'sedation-monitor';
  return { plan, t };
}
function Nausea(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'nausea-none';
  if (t === 'yes') plan = 'antiemetic-protocol';
  return { plan, t };
}
function Itch(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'itch-none';
  if (t === 'yes') plan = 'antipruritic-protocol';
  return { plan, t };
}
function Respiratory(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'respiration-ok';
  if (t === 'depressed') plan = 'respiratory-depression-watch';
  return { plan, t };
}
function Urinary(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'urinary-ok';
  if (t === 'retention') plan = 'urinary-retention-protocol';
  return { plan, t };
}
module.exports = {
  Nrs, OpioidRisk, Adjuvant, Breakthrough, Bowel, Sedation, Nausea, Itch, Respiratory, Urinary
};
