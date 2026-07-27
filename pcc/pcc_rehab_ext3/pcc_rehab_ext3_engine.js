// P3-CP pcc_rehab_ext3_engine v3.54.0
'use strict';
function PhysTherapy(input) {
  const i = input || {};
  const f = String(i.f || '');
  let plan = 'general-PT';
  if (f === 'knee') plan = 'knee-PT';
  else if (f === 'hip') plan = 'hip-PT';
  return { plan, f };
}
function OccTherapy(input) {
  const i = input || {};
  const f = String(i.f || '');
  let plan = 'general-OT';
  if (f === 'ADL') plan = 'ADL-training';
  return { plan, f };
}
function SpeechLang(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-SLP';
  if (t === 'dysphagia') plan = 'dysphagia-SLP';
  else if (t === 'aphasia') plan = 'aphasia-SLP';
  return { plan, t };
}
function PostStroke(input) {
  const i = input || {};
  const d = Number(i.d ?? 0);
  let plan = 'acute-stroke';
  if (d >= 30) plan = 'chronic-stroke';
  else if (d >= 7) plan = 'subacute-stroke-rehab';
  return { plan, d };
}
function Sci(input) {
  const i = input || {};
  const l = String(i.l || '');
  let plan = 'incomplete-SCI';
  if (l === 'C4') plan = 'C4-quadriplegic';
  else if (l === 'T6') plan = 'T6-paraplegic-rehab';
  return { plan, l };
}
function Tbi(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'mild-TBI';
  if (t === 'severe') plan = 'severe-TBI-rehab';
  return { plan, t };
}
function Amp(input) {
  const i = input || {};
  const l = String(i.l || '');
  let plan = 'no-amputation';
  if (l === 'AK') plan = 'AK-amputee-rehab';
  else if (l === 'BK') plan = 'BK-amputee-rehab';
  return { plan, l };
}
function Burnr(input) {
  const i = input || {};
  const tbsa = Number(i.tbsa ?? 0);
  let plan = 'minor-burn-rehab';
  if (tbsa >= 20) plan = 'major-burn-rehab';
  return { plan, tbsa };
}
function PreOp(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-prehab';
  if (t === 'THA') plan = 'THA-prehab';
  return { plan, t };
}
function Back(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'acute-back-pain';
  if (t === 'chronic') plan = 'chronic-back-rehab';
  return { plan, t };
}
module.exports = {
  PhysTherapy, OccTherapy, SpeechLang, PostStroke, Sci, Tbi, Amp, Burnr, PreOp, Back
};
