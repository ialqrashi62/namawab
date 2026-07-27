// P3-CU pcc_immunizations_engine v3.59.0
'use strict';
function Immunization(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-imm';
  if (t === 'flu') plan = 'flu-vaccine';
  else if (t === 'covid') plan = 'covid-vaccine';
  return { plan, t };
}
function Schedule(input) {
  const i = input || {};
  const a = Number(i.a ?? 30);
  let plan = 'adult-schedule';
  if (a < 18) plan = 'pediatric-schedule';
  return { plan, a };
}
function Catchup(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-catchup';
  if (t === 'needed') plan = 'catchup-needed';
  return { plan, t };
}
function AllergyToVaccine(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-allergy';
  if (t === 'severe') plan = 'severe-vaccine-allergy';
  return { plan, t };
}
function Consent(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-consent';
  if (t === 'obtained') plan = 'vaccine-consent';
  return { plan, t };
}
function LotNumber(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-lot';
  if (t === 'recorded') plan = 'lot-recorded';
  return { plan, t };
}
function Site(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-site';
  if (t === 'IM') plan = 'IM-deltoid';
  return { plan, t };
}
function Adrs(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-adr';
  if (t === 'severe') plan = 'severe-ADR';
  return { plan, t };
}
function Pregnancy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'not-pregnant';
  if (t === 'pregnant') plan = 'pregnant-considerations';
  return { plan, t };
}
function Titer(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-titer';
  if (t === 'immune') plan = 'titer-immune';
  return { plan, t };
}
module.exports = {
  Immunization, Schedule, Catchup, AllergyToVaccine, Consent, LotNumber, Site, Adrs, Pregnancy, Titer
};
