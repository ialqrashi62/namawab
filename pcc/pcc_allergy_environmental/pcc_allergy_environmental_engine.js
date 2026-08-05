// P3_DJ pcc_allergy_environmental_engine v3.74.0
'use strict';
function PollenForecast(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pollenforecast-none';
  if (t === 'yes') plan = 'pollenforecast-protocol';
  return { plan, t };
}
function MoldExposure(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'moldexposure-none';
  if (t === 'yes') plan = 'moldexposure-protocol';
  return { plan, t };
}
function DustMite(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dustmite-none';
  if (t === 'yes') plan = 'dustmite-protocol';
  return { plan, t };
}
function PetDander(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'petdander-none';
  if (t === 'yes') plan = 'petdander-protocol';
  return { plan, t };
}
function Cockroach(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cockroach-none';
  if (t === 'yes') plan = 'cockroach-protocol';
  return { plan, t };
}
function RodentAllergen(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'rodentallergen-none';
  if (t === 'yes') plan = 'rodentallergen-protocol';
  return { plan, t };
}
function IndoorAirQuality(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'indoorairquality-none';
  if (t === 'yes') plan = 'indoorairquality-protocol';
  return { plan, t };
}
function SeasonalStrategy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'seasonalstrategy-none';
  if (t === 'yes') plan = 'seasonalstrategy-protocol';
  return { plan, t };
}
function EnvironmentalControl(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'environmentalcontrol-none';
  if (t === 'yes') plan = 'environmentalcontrol-protocol';
  return { plan, t };
}
function AllergenImmunotherapy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'allergenimmunotherapy-none';
  if (t === 'yes') plan = 'allergenimmunotherapy-protocol';
  return { plan, t };
}
module.exports = {
  PollenForecast, MoldExposure, DustMite, PetDander, Cockroach, RodentAllergen, IndoorAirQuality, SeasonalStrategy, EnvironmentalControl, AllergenImmunotherapy
};
