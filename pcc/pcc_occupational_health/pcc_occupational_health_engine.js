// P3_CW pcc_occupational_health_engine v3.61.0
'use strict';
function Fitness(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'fitness-none';
  if (t === 'yes') plan = 'fitness-protocol';
  return { plan, t };
}
function Exposure(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'exposure-none';
  if (t === 'yes') plan = 'exposure-protocol';
  return { plan, t };
}
function Vaccination(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vaccination-none';
  if (t === 'yes') plan = 'vaccination-protocol';
  return { plan, t };
}
function Injury(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'injury-none';
  if (t === 'yes') plan = 'injury-protocol';
  return { plan, t };
}
function ReturnToWork(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'returntowork-none';
  if (t === 'yes') plan = 'returntowork-protocol';
  return { plan, t };
}
function Hearing(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hearing-none';
  if (t === 'yes') plan = 'hearing-protocol';
  return { plan, t };
}
function Vision(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vision-none';
  if (t === 'yes') plan = 'vision-protocol';
  return { plan, t };
}
function Respiratory(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'respiratory-none';
  if (t === 'yes') plan = 'respiratory-protocol';
  return { plan, t };
}
function Chemical(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'chemical-none';
  if (t === 'yes') plan = 'chemical-protocol';
  return { plan, t };
}
function Ergonomics(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'ergonomics-none';
  if (t === 'yes') plan = 'ergonomics-protocol';
  return { plan, t };
}
module.exports = {
  Fitness, Exposure, Vaccination, Injury, ReturnToWork, Hearing, Vision, Respiratory, Chemical, Ergonomics
};
