// P3-DS pcc_stroke_unit_engine v3.83.0
'use strict';
function NIHSS(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'nihss-none';
  if (t === 'yes') plan = 'nihss-protocol';
  return { plan, t };
}
function DoorToNeedle(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'doortoneedle-none';
  if (t === 'yes') plan = 'doortoneedle-protocol';
  return { plan, t };
}
function tPAContraindications(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'tpacontraindications-none';
  if (t === 'yes') plan = 'tpacontraindications-protocol';
  return { plan, t };
}
function ICHScore(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'ichscore-none';
  if (t === 'yes') plan = 'ichscore-protocol';
  return { plan, t };
}
function ASPECTS(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'aspects-none';
  if (t === 'yes') plan = 'aspects-protocol';
  return { plan, t };
}
function ABCD2(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'abcd2-none';
  if (t === 'yes') plan = 'abcd2-protocol';
  return { plan, t };
}
function HASBLED(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hasbled-none';
  if (t === 'yes') plan = 'hasbled-protocol';
  return { plan, t };
}
function StrokeSepsisBundle(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'strokesepsisbundle-none';
  if (t === 'yes') plan = 'strokesepsisbundle-protocol';
  return { plan, t };
}
function DysphagiaScreen(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dysphagiascreen-none';
  if (t === 'yes') plan = 'dysphagiascreen-protocol';
  return { plan, t };
}
function SecondaryPrevention(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'secondaryprevention-none';
  if (t === 'yes') plan = 'secondaryprevention-protocol';
  return { plan, t };
}
module.exports = {
  NIHSS, DoorToNeedle, tPAContraindications, ICHScore, ASPECTS, ABCD2, HASBLED, StrokeSepsisBundle, DysphagiaScreen, SecondaryPrevention
};
