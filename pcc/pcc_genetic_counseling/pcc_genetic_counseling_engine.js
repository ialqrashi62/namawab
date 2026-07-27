// P3-CY pcc_genetic_counseling_engine v3.63.0
'use strict';
function RiskAssessment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'riskassessment-none';
  if (t === 'yes') plan = 'riskassessment-protocol';
  return { plan, t };
}
function Pedigree(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pedigree-none';
  if (t === 'yes') plan = 'pedigree-protocol';
  return { plan, t };
}
function CarrierScreen(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'carrierscreen-none';
  if (t === 'yes') plan = 'carrierscreen-protocol';
  return { plan, t };
}
function PrenatalTesting(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'prenataltesting-none';
  if (t === 'yes') plan = 'prenataltesting-protocol';
  return { plan, t };
}
function CancerGenetics(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cancergenetics-none';
  if (t === 'yes') plan = 'cancergenetics-protocol';
  return { plan, t };
}
function Pharmacogenomics(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pharmacogenomics-none';
  if (t === 'yes') plan = 'pharmacogenomics-protocol';
  return { plan, t };
}
function VariantInterpretation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'variantinterpretation-none';
  if (t === 'yes') plan = 'variantinterpretation-protocol';
  return { plan, t };
}
function Consent(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'consent-none';
  if (t === 'yes') plan = 'consent-protocol';
  return { plan, t };
}
function FamilyCommunication(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'familycommunication-none';
  if (t === 'yes') plan = 'familycommunication-protocol';
  return { plan, t };
}
function Referral(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'referral-none';
  if (t === 'yes') plan = 'referral-protocol';
  return { plan, t };
}
module.exports = {
  RiskAssessment, Pedigree, CarrierScreen, PrenatalTesting, CancerGenetics, Pharmacogenomics, VariantInterpretation, Consent, FamilyCommunication, Referral
};
