// P3-CQ pcc_social_work_engine v3.55.0
'use strict';
function Assessment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-assessment';
  if (t === 'psychosocial') plan = 'psychosocial-assessment';
  return { plan, t };
}
function Placement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-placement';
  if (t === 'SNF') plan = 'SNF-placement';
  else if (t === 'ALF') plan = 'ALF-placement';
  return { plan, t };
}
function Psychosocial(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-psychosocial';
  if (t === 'crisis') plan = 'psychosocial-crisis';
  return { plan, t };
}
function Saf(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-safety';
  if (t === 'concern') plan = 'safety-concern';
  return { plan, t };
}
function Financial(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-financial';
  if (t === 'assistance') plan = 'financial-assistance';
  return { plan, t };
}
function Transport(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-transport';
  if (t === 'needed') plan = 'transport-assistance';
  return { plan, t };
}
function Family(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-family-issue';
  if (t === 'conflict') plan = 'family-conflict';
  return { plan, t };
}
function Abuse(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-abuse';
  if (t === 'suspected') plan = 'suspected-abuse';
  return { plan, t };
}
function Substance(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-substance';
  if (t === 'concern') plan = 'substance-concern';
  return { plan, t };
}
function Resources(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-resources';
  if (t === 'needed') plan = 'community-resources';
  return { plan, t };
}
module.exports = {
  Assessment, Placement, Psychosocial, Saf, Financial, Transport, Family, Abuse, Substance, Resources
};
