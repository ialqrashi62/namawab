// P3_EE pcc_neuroendocrine_engine v3.95.0
'use strict';
function PituitaryAdenomaWorkup(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pituitaryAdenomaWorkup-none';
  if (t === 'yes') plan = 'pituitaryAdenomaWorkup-protocol';
  return { plan, t };
}
function CushingSyndromeDiagnosis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cushingSyndromeDiagnosis-none';
  if (t === 'yes') plan = 'cushingSyndromeDiagnosis-protocol';
  return { plan, t };
}
function AddisonDiseaseCrisis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'addisonDiseaseCrisis-none';
  if (t === 'yes') plan = 'addisonDiseaseCrisis-protocol';
  return { plan, t };
}
function AcromegalyManagement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'acromegalyManagement-none';
  if (t === 'yes') plan = 'acromegalyManagement-protocol';
  return { plan, t };
}
function ProlactinomaTreatment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'prolactinomaTreatment-none';
  if (t === 'yes') plan = 'prolactinomaTreatment-protocol';
  return { plan, t };
}
function HypopituitarismEvaluation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hypopituitarismEvaluation-none';
  if (t === 'yes') plan = 'hypopituitarismEvaluation-protocol';
  return { plan, t };
}
function PheochromocytomaWorkup(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pheochromocytomaWorkup-none';
  if (t === 'yes') plan = 'pheochromocytomaWorkup-protocol';
  return { plan, t };
}
function MultipleEndocrineNeoplasia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'multipleEndocrineNeoplasia-none';
  if (t === 'yes') plan = 'multipleEndocrineNeoplasia-protocol';
  return { plan, t };
}
function CarcinoidSyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'carcinoidSyndrome-none';
  if (t === 'yes') plan = 'carcinoidSyndrome-protocol';
  return { plan, t };
}
function HypothalamicHamartoma(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hypothalamicHamartoma-none';
  if (t === 'yes') plan = 'hypothalamicHamartoma-protocol';
  return { plan, t };
}
module.exports = { PituitaryAdenomaWorkup, CushingSyndromeDiagnosis, AddisonDiseaseCrisis, AcromegalyManagement, ProlactinomaTreatment, HypopituitarismEvaluation, PheochromocytomaWorkup, MultipleEndocrineNeoplasia, CarcinoidSyndrome, HypothalamicHamartoma };
