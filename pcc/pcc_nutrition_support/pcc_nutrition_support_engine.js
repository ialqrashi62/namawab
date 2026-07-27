// P3-DL pcc_nutrition_support_engine v3.76.0
'use strict';
function CaloricTarget(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'calorictarget-none';
  if (t === 'yes') plan = 'calorictarget-protocol';
  return { plan, t };
}
function ProteinRequirement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'proteinrequirement-none';
  if (t === 'yes') plan = 'proteinrequirement-protocol';
  return { plan, t };
}
function EnteralAccess(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'enteralaccess-none';
  if (t === 'yes') plan = 'enteralaccess-protocol';
  return { plan, t };
}
function ParenteralIndication(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'parenteralindication-none';
  if (t === 'yes') plan = 'parenteralindication-protocol';
  return { plan, t };
}
function RefeedingRisk(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'refeedingrisk-none';
  if (t === 'yes') plan = 'refeedingrisk-protocol';
  return { plan, t };
}
function GlycemicControlNutrition(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'glycemiccontrolnutrition-none';
  if (t === 'yes') plan = 'glycemiccontrolnutrition-protocol';
  return { plan, t };
}
function Immunonutrition(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'immunonutrition-none';
  if (t === 'yes') plan = 'immunonutrition-protocol';
  return { plan, t };
}
function FluidBalance(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'fluidbalance-none';
  if (t === 'yes') plan = 'fluidbalance-protocol';
  return { plan, t };
}
function MicronutrientRepletion(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'micronutrientrepletion-none';
  if (t === 'yes') plan = 'micronutrientrepletion-protocol';
  return { plan, t };
}
function NutritionOutcome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'nutritionoutcome-none';
  if (t === 'yes') plan = 'nutritionoutcome-protocol';
  return { plan, t };
}
module.exports = {
  CaloricTarget, ProteinRequirement, EnteralAccess, ParenteralIndication, RefeedingRisk, GlycemicControlNutrition, Immunonutrition, FluidBalance, MicronutrientRepletion, NutritionOutcome
};
