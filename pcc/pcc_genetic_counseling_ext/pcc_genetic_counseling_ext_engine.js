// P3-EA pcc_genetic_counseling_ext_engine v3.91.0
'use strict';
function HereditaryCancerSyndromeAssessment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hereditaryCancerSyndromeAssessment-none';
  if (t === 'yes') plan = 'hereditaryCancerSyndromeAssessment-protocol';
  return { plan, t };
}
function BRCA1BRCA2RiskModel(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'bRCA1BRCA2RiskModel-none';
  if (t === 'yes') plan = 'bRCA1BRCA2RiskModel-protocol';
  return { plan, t };
}
function LynchSyndromeScreen(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'lynchSyndromeScreen-none';
  if (t === 'yes') plan = 'lynchSyndromeScreen-protocol';
  return { plan, t };
}
function FamilialHypercholesterolemia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'familialHypercholesterolemia-none';
  if (t === 'yes') plan = 'familialHypercholesterolemia-protocol';
  return { plan, t };
}
function PrenatalGeneticScreening(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'prenatalGeneticScreening-none';
  if (t === 'yes') plan = 'prenatalGeneticScreening-protocol';
  return { plan, t };
}
function PreImplantationCounseling(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'preImplantationCounseling-none';
  if (t === 'yes') plan = 'preImplantationCounseling-protocol';
  return { plan, t };
}
function PharmacogenomicInterpretation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pharmacogenomicInterpretation-none';
  if (t === 'yes') plan = 'pharmacogenomicInterpretation-protocol';
  return { plan, t };
}
function CascadeFamilyScreening(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cascadeFamilyScreening-none';
  if (t === 'yes') plan = 'cascadeFamilyScreening-protocol';
  return { plan, t };
}
function VariantReclassification(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'variantReclassification-none';
  if (t === 'yes') plan = 'variantReclassification-protocol';
  return { plan, t };
}
function ReproductiveGeneticOptions(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'reproductiveGeneticOptions-none';
  if (t === 'yes') plan = 'reproductiveGeneticOptions-protocol';
  return { plan, t };
}
module.exports = { HereditaryCancerSyndromeAssessment, BRCA1BRCA2RiskModel, LynchSyndromeScreen, FamilialHypercholesterolemia, PrenatalGeneticScreening, PreImplantationCounseling, PharmacogenomicInterpretation, CascadeFamilyScreening, VariantReclassification, ReproductiveGeneticOptions };
