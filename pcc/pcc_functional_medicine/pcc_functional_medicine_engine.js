// P3_DA pcc_functional_medicine_engine v3.65.0
'use strict';
function RootCause(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'rootcause-none';
  if (t === 'yes') plan = 'rootcause-protocol';
  return { plan, t };
}
function Timeline(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'timeline-none';
  if (t === 'yes') plan = 'timeline-protocol';
  return { plan, t };
}
function EliminationDiet(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'eliminationdiet-none';
  if (t === 'yes') plan = 'eliminationdiet-protocol';
  return { plan, t };
}
function GutHealing(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'guthealing-none';
  if (t === 'yes') plan = 'guthealing-protocol';
  return { plan, t };
}
function HormoneBalance(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hormonebalance-none';
  if (t === 'yes') plan = 'hormonebalance-protocol';
  return { plan, t };
}
function Toxicity(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'toxicity-none';
  if (t === 'yes') plan = 'toxicity-protocol';
  return { plan, t };
}
function Inflammation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'inflammation-none';
  if (t === 'yes') plan = 'inflammation-protocol';
  return { plan, t };
}
function MitochondrialSupport(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'mitochondrialsupport-none';
  if (t === 'yes') plan = 'mitochondrialsupport-protocol';
  return { plan, t };
}
function ImmuneModulation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'immunemodulation-none';
  if (t === 'yes') plan = 'immunemodulation-protocol';
  return { plan, t };
}
function PersonalizedPlan(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'personalizedplan-none';
  if (t === 'yes') plan = 'personalizedplan-protocol';
  return { plan, t };
}
module.exports = {
  RootCause, Timeline, EliminationDiet, GutHealing, HormoneBalance, Toxicity, Inflammation, MitochondrialSupport, ImmuneModulation, PersonalizedPlan
};
