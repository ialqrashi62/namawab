// P3-DE pcc_nutritional_medicine_engine v3.69.0
'use strict';
function MacronutrientBalance(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'macronutrientbalance-none';
  if (t === 'yes') plan = 'macronutrientbalance-protocol';
  return { plan, t };
}
function MicronutrientStatus(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'micronutrientstatus-none';
  if (t === 'yes') plan = 'micronutrientstatus-protocol';
  return { plan, t };
}
function TherapeuticDiet(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'therapeuticdiet-none';
  if (t === 'yes') plan = 'therapeuticdiet-protocol';
  return { plan, t };
}
function EnteralNutrition(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'enteralnutrition-none';
  if (t === 'yes') plan = 'enteralnutrition-protocol';
  return { plan, t };
}
function ParenteralNutrition(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'parenteralnutrition-none';
  if (t === 'yes') plan = 'parenteralnutrition-protocol';
  return { plan, t };
}
function MalnutritionScreen(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'malnutritionscreen-none';
  if (t === 'yes') plan = 'malnutritionscreen-protocol';
  return { plan, t };
}
function FoodAllergy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'foodallergy-none';
  if (t === 'yes') plan = 'foodallergy-protocol';
  return { plan, t };
}
function EatingDisorder(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'eatingdisorder-none';
  if (t === 'yes') plan = 'eatingdisorder-protocol';
  return { plan, t };
}
function SportsNutrition(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'sportsnutrition-none';
  if (t === 'yes') plan = 'sportsnutrition-protocol';
  return { plan, t };
}
function CancerNutrition(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cancernutrition-none';
  if (t === 'yes') plan = 'cancernutrition-protocol';
  return { plan, t };
}
module.exports = {
  MacronutrientBalance, MicronutrientStatus, TherapeuticDiet, EnteralNutrition, ParenteralNutrition, MalnutritionScreen, FoodAllergy, EatingDisorder, SportsNutrition, CancerNutrition
};
