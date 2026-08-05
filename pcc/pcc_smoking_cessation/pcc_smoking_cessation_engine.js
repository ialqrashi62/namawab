// P3_CX pcc_smoking_cessation_engine v3.62.0
'use strict';
function Readiness(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'readiness-none';
  if (t === 'yes') plan = 'readiness-protocol';
  return { plan, t };
}
function PackYears(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'packyears-none';
  if (t === 'yes') plan = 'packyears-protocol';
  return { plan, t };
}
function Fagerstrom(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'fagerstrom-none';
  if (t === 'yes') plan = 'fagerstrom-protocol';
  return { plan, t };
}
function QuitPlan(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'quitplan-none';
  if (t === 'yes') plan = 'quitplan-protocol';
  return { plan, t };
}
function Nrt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'nrt-none';
  if (t === 'yes') plan = 'nrt-protocol';
  return { plan, t };
}
function Varenicline(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'varenicline-none';
  if (t === 'yes') plan = 'varenicline-protocol';
  return { plan, t };
}
function Bupropion(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'bupropion-none';
  if (t === 'yes') plan = 'bupropion-protocol';
  return { plan, t };
}
function Counseling(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'counseling-none';
  if (t === 'yes') plan = 'counseling-protocol';
  return { plan, t };
}
function Relapse(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'relapse-none';
  if (t === 'yes') plan = 'relapse-protocol';
  return { plan, t };
}
function CarbonMonoxide(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'carbonmonoxide-none';
  if (t === 'yes') plan = 'carbonmonoxide-protocol';
  return { plan, t };
}
module.exports = {
  Readiness, PackYears, Fagerstrom, QuitPlan, Nrt, Varenicline, Bupropion, Counseling, Relapse, CarbonMonoxide
};
