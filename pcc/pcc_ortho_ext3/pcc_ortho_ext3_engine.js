// P3_CL pcc_ortho_ext3_engine v3.50.0
'use strict';
function Fx(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-fracture';
  if (t === 'displaced') plan = 'displaced-fracture-ORIF';
  else if (t === 'non-displaced') plan = 'non-displaced-cast';
  else if (t === 'comminuted') plan = 'comminuted-ORIF';
  return { plan, t };
}
function Joint(input) {
  const i = input || {};
  const j = String(i.j || '');
  let plan = 'no-arthropathy';
  if (j === 'hip') plan = 'hip-arthroplasty';
  else if (j === 'knee') plan = 'knee-arthroplasty';
  return { plan, j };
}
function Spine(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-spine-issue';
  if (t === 'stenosis') plan = 'spinal-stenosis';
  else if (t === 'disc') plan = 'disc-herniation';
  return { plan, t };
}
function Sports(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-sports-injury';
  if (t === 'ACL') plan = 'ACL-tear';
  else if (t === 'rotator') plan = 'rotator-cuff';
  return { plan, t };
}
function Pediatric(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-pediatric-ortho';
  if (t === 'SCFE') plan = 'SCFE-pinning';
  return { plan, t };
}
function Tumor(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-tumor';
  if (t === 'benign') plan = 'benign-bone-tumor';
  else if (t === 'malignant') plan = 'sarcoma-workup';
  return { plan, t };
}
function Hand(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-hand-injury';
  if (t === 'laceration') plan = 'hand-laceration-repair';
  else if (t === 'fracture') plan = 'hand-fracture';
  return { plan, t };
}
function Foot(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-foot-issue';
  if (t === 'diabetic') plan = 'diabetic-foot';
  return { plan, t };
}
function Postop(input) {
  const i = input || {};
  const d = Number(i.d ?? 0);
  let plan = 'immediate-postop';
  if (d >= 6) plan = 'week-1-postop';
  else if (d >= 1) plan = 'day-1-postop';
  return { plan, d };
}
function Rehab(input) {
  const i = input || {};
  const w = Number(i.w ?? 0);
  let plan = 'pre-rehab';
  if (w >= 12) plan = 'long-term-rehab';
  else if (w >= 6) plan = 'mid-rehab';
  return { plan, w };
}
module.exports = {
  Fx, Joint, Spine, Sports, Pediatric, Tumor, Hand, Foot, Postop, Rehab
};
