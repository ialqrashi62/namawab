// P3-DG pcc_thyroid_advanced_engine v3.71.0
'use strict';
function TSHPattern(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'tshpattern-none';
  if (t === 'yes') plan = 'tshpattern-protocol';
  return { plan, t };
}
function FreeT3T4(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'freet3t4-none';
  if (t === 'yes') plan = 'freet3t4-protocol';
  return { plan, t };
}
function ReverseT3(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'reverset3-none';
  if (t === 'yes') plan = 'reverset3-protocol';
  return { plan, t };
}
function ThyroidAntibodies(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'thyroidantibodies-none';
  if (t === 'yes') plan = 'thyroidantibodies-protocol';
  return { plan, t };
}
function IodineStatus(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'iodinestatus-none';
  if (t === 'yes') plan = 'iodinestatus-protocol';
  return { plan, t };
}
function SeleniumSupport(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'seleniumsupport-none';
  if (t === 'yes') plan = 'seleniumsupport-protocol';
  return { plan, t };
}
function Hashimotos(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hashimotos-none';
  if (t === 'yes') plan = 'hashimotos-protocol';
  return { plan, t };
}
function Graves(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'graves-none';
  if (t === 'yes') plan = 'graves-protocol';
  return { plan, t };
}
function ThyroidNodule(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'thyroidnodule-none';
  if (t === 'yes') plan = 'thyroidnodule-protocol';
  return { plan, t };
}
function PostpartumThyroid(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'postpartumthyroid-none';
  if (t === 'yes') plan = 'postpartumthyroid-protocol';
  return { plan, t };
}
module.exports = {
  TSHPattern, FreeT3T4, ReverseT3, ThyroidAntibodies, IodineStatus, SeleniumSupport, Hashimotos, Graves, ThyroidNodule, PostpartumThyroid
};
