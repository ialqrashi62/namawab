// P3-CT pcc_urgent_care_engine v3.58.0
'use strict';
function WalkIn(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-walkin';
  if (t === 'fast-track') plan = 'fast-track-eligible';
  return { plan, t };
}
function InjuryType(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-injury';
  if (t === 'laceration') plan = 'laceration-repair';
  else if (t === 'fracture') plan = 'fracture-eval';
  return { plan, t };
}
function Illness(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-illness';
  if (t === 'URI') plan = 'URI-eval';
  else if (t === 'flu') plan = 'flu-eval';
  return { plan, t };
}
function Stitches(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-stitches';
  if (t === 'needed') plan = 'stitch-needed';
  return { plan, t };
}
function Splint(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-splint';
  if (t === 'applied') plan = 'splint-applied';
  return { plan, t };
}
function Neb(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-neb';
  if (t === 'asthma') plan = 'asthma-neb';
  return { plan, t };
}
function EkgUrgent(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-ekg';
  if (t === 'positive') plan = 'EKG-positive';
  return { plan, t };
}
function XrayOnsite(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-xray';
  if (t === 'positive') plan = 'Xray-positive';
  return { plan, t };
}
function LabRapid(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-lab';
  if (t === 'rapid-flu') plan = 'rapid-flu-positive';
  return { plan, t };
}
function DcUrgent(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-uc-dc';
  if (t === 'home') plan = 'home-discharge';
  else if (t === 'ED') plan = 'ED-transfer';
  return { plan, t };
}
module.exports = {
  WalkIn, InjuryType, Illness, Stitches, Splint, Neb, EkgUrgent, XrayOnsite, LabRapid, DcUrgent
};
