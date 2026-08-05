// P3_CK pcc_neonatal_ext2_engine v3.49.0
'use strict';
function GestationAge(input) {
  const i = input || {};
  const w = Number(i.w ?? 0);
  let plan = 'post-term';
  if (w <= 28) plan = 'extreme-preterm';
  else if (w <= 32) plan = 'very-preterm';
  else if (w <= 37) plan = 'late-preterm';
  else if (w <= 40) plan = 'term';
  return { plan, w };
}
function APGAR(input) {
  const i = input || {};
  const s = Number(i.s ?? 10);
  let plan = 'vigorous-newborn';
  if (s <= 3) plan = 'severely-depressed';
  else if (s <= 6) plan = 'moderately-depressed';
  return { plan, s };
}
function BirthWeight(input) {
  const i = input || {};
  const g = Number(i.g ?? 3000);
  let plan = 'AGA';
  if (g < 1000) plan = 'ELBW';
  else if (g < 1500) plan = 'VLBW';
  else if (g < 2500) plan = 'low-birth-weight';
  else if (g >= 4000) plan = 'macrosomia';
  return { plan, g };
}
function NewbornScreen(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'standard-screen';
  if (t === 'pku') plan = 'PKU-screen';
  else if (t === 'hearing') plan = 'hearing-screen';
  return { plan, t };
}
function Breastfeed(input) {
  const i = input || {};
  const status = String(i.s || '');
  let plan = 'no-supports';
  if (status === 'successful') plan = 'effective-breastfeeding';
  else if (status === 'latch') plan = 'latch-support-needed';
  return { plan, status };
}
function Hyperbilirubin(input) {
  const i = input || {};
  const t = Number(i.t ?? 5);
  let plan = 'low-risk';
  if (t >= 20) plan = 'exchange-transfusion-zone';
  else if (t >= 15) plan = 'phototherapy-zone';
  return { plan, t };
}
function Feeding(input) {
  const i = input || {};
  const type = String(i.t || '');
  let plan = 'no-feeding';
  if (type === 'breast') plan = 'breastfed';
  else if (type === 'bottle') plan = 'bottle-fed';
  else if (type === 'ng') plan = 'NG-feeding';
  return { plan, type };
}
function DischargeChecklist(input) {
  const i = input || {};
  const c = String(i.c || '');
  let plan = 'incomplete';
  if (c === 'complete') plan = 'discharge-ready';
  return { plan, c };
}
function SepsisEval(input) {
  const i = input || {};
  const r = String(i.r || '');
  let plan = 'no-eval';
  if (r === 'high') plan = 'full-sepsis-eval';
  return { plan, r };
}
function CordCare(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'standard-care';
  if (t === 'chlorhexidine') plan = 'chlorhexidine-cord-care';
  return { plan, t };
}
module.exports = {
  GestationAge, APGAR, BirthWeight, NewbornScreen, Breastfeed, Hyperbilirubin, Feeding, DischargeChecklist, SepsisEval, CordCare
};
