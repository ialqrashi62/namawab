// P3_CH pcc_surgical_ext_engine v3.46.0
'use strict';
function Urgency(input) {
  const i = input || {};
  const u = String(i.u || '');
  let plan = 'elective-case';
  if (u === 'emergent') plan = 'emergent-OR';
  else if (u === 'urgent') plan = 'urgent-OR';
  return { plan, u };
}
function Approach(input) {
  const i = input || {};
  const a = String(i.a || '');
  let plan = 'open-approach';
  if (a === 'lap') plan = 'laparoscopic';
  else if (a === 'robotic') plan = 'robotic-assisted';
  else if (a === 'endo') plan = 'endoscopic';
  return { plan, a };
}
function Positioning(input) {
  const i = input || {};
  const p = String(i.p || '');
  let plan = 'supine';
  if (p === 'prone') plan = 'prone-positioning';
  else if (p === 'lateral') plan = 'lateral-positioning';
  return { plan, p };
}
function Timeout(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'standard-timeout';
  if (t === 'fire') plan = 'fire-risk-timeout';
  else if (t === 'wrong-site') plan = 'site-mark-verified';
  return { plan, t };
}
function Counts(input) {
  const i = input || {};
  const status = String(i.s || '');
  let plan = 'counts-correct';
  if (status === 'incorrect') plan = 'missing-item-XR';
  return { plan, status };
}
function Antibiotic(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'standard-prophylaxis';
  if (t === 'redose') plan = 're-dose-2hr';
  return { plan, t };
}
function Dvt(input) {
  const i = input || {};
  const r = String(i.r || '');
  let plan = 'SCDs-only';
  if (r === 'high') plan = 'LMWH-and-SCDs';
  else if (r === 'low') plan = 'SCDs';
  return { plan, r };
}
function Implant(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-implant';
  if (t === 'mesh') plan = 'mesh-implant';
  else if (t === 'prosthesis') plan = 'prosthesis-implant';
  return { plan, t };
}
function Anesthesia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'general-anesthesia';
  if (t === 'spinal') plan = 'spinal-anesthesia';
  else if (t === 'regional') plan = 'regional-block';
  else if (t === 'local') plan = 'local-only';
  return { plan, t };
}
function Specimen(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-specimen';
  if (t === 'path') plan = 'pathology-specimen';
  else if (t === 'culture') plan = 'culture-specimen';
  return { plan, t };
}
module.exports = {
  Urgency, Approach, Positioning, Timeout, Counts, Antibiotic, Dvt, Implant, Anesthesia, Specimen
};
