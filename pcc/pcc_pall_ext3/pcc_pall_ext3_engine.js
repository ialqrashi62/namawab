// P3-CP pcc_pall_ext3_engine v3.54.0
'use strict';
function PainMng(input) {
  const i = input || {};
  const n = Number(i.n ?? 0);
  let plan = 'no-pain';
  if (n >= 7) plan = 'severe-pain-mixed';
  else if (n >= 4) plan = 'moderate-pain-opioid';
  return { plan, n };
}
function Dyspnea(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-dyspnea';
  if (t === 'refractory') plan = 'refractory-dyspnea-morphine';
  return { plan, t };
}
function Nausea(input) {
  const i = input || {};
  const s = String(i.s || '');
  let plan = 'no-nausea';
  if (s === 'refractory') plan = 'refractory-ponv-mixed';
  return { plan, s };
}
function Constipation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-constipation';
  if (t === 'opioid') plan = 'opioid-bowel';
  return { plan, t };
}
function Delirium(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-delirium';
  if (t === 'terminal') plan = 'terminal-restlessness';
  return { plan, t };
}
function Anxietyp(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-anxiety';
  if (t === 'existential') plan = 'existential-distress';
  return { plan, t };
}
function Hospice(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-hospice';
  if (t === 'eligible') plan = 'hospice-eligibility';
  return { plan, t };
}
function Advance(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-ACP';
  if (t === 'DNR') plan = 'DNR-ocumented';
  return { plan, t };
}
function Family(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-family-meeting';
  if (t === 'goals') plan = 'goals-of-care-meeting';
  return { plan, t };
}
function Grief(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-grief';
  if (t === 'anticipatory') plan = 'anticipatory-grief';
  return { plan, t };
}
module.exports = {
  PainMng, Dyspnea, Nausea, Constipation, Delirium, Anxietyp, Hospice, Advance, Family, Grief
};
