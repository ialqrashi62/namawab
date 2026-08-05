// P3_DE pcc_gut_microbiome_engine v3.69.0
'use strict';
function DysbiosisAssessment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dysbiosisassessment-none';
  if (t === 'yes') plan = 'dysbiosisassessment-protocol';
  return { plan, t };
}
function Probiotics(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'probiotics-none';
  if (t === 'yes') plan = 'probiotics-protocol';
  return { plan, t };
}
function Prebiotics(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'prebiotics-none';
  if (t === 'yes') plan = 'prebiotics-protocol';
  return { plan, t };
}
function FecalTransplant(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'fecaltransplant-none';
  if (t === 'yes') plan = 'fecaltransplant-protocol';
  return { plan, t };
}
function SIBO(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'sibo-none';
  if (t === 'yes') plan = 'sibo-protocol';
  return { plan, t };
}
function LeakyGut(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'leakygut-none';
  if (t === 'yes') plan = 'leakygut-protocol';
  return { plan, t };
}
function GutBrainAxis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'gutbrainaxis-none';
  if (t === 'yes') plan = 'gutbrainaxis-protocol';
  return { plan, t };
}
function MicrobiomeTesting(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'microbiometesting-none';
  if (t === 'yes') plan = 'microbiometesting-protocol';
  return { plan, t };
}
function DietaryFiber(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dietaryfiber-none';
  if (t === 'yes') plan = 'dietaryfiber-protocol';
  return { plan, t };
}
function PostbioticTherapy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'postbiotictherapy-none';
  if (t === 'yes') plan = 'postbiotictherapy-protocol';
  return { plan, t };
}
module.exports = {
  DysbiosisAssessment, Probiotics, Prebiotics, FecalTransplant, SIBO, LeakyGut, GutBrainAxis, MicrobiomeTesting, DietaryFiber, PostbioticTherapy
};
