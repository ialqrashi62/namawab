/**
 * P0-9 Immunization Engine
 */
'use strict';

const CITATIONS = { MOH_SA: 'MoH Saudi EPI 2024', WHO_PQS: 'WHO PQS' };

const EPI = { birth: ['BCG', 'HepB'], '2m': ['DTaP', 'Hib', 'IPV', 'PCV13'], '4m': ['DTaP', 'Hib', 'IPV', 'PCV13'], '6m': ['DTaP', 'Hib', 'IPV', 'PCV13'], '12m': ['MMR', 'Varicella'], '18m': ['DTaP', 'Hib', 'IPV'], '4y': ['DTaP', 'IPV', 'MMR', 'Varicella'] };

function epiScheduleForAge(input) {
  const { age_months } = input;
  const schedule = [];
  if (age_months === 0) schedule.push({ age: 'birth', vaccines: EPI.birth });
  if (age_months >= 2) schedule.push({ age: '2m', vaccines: EPI['2m'] });
  if (age_months >= 4) schedule.push({ age: '4m', vaccines: EPI['4m'] });
  if (age_months >= 6) schedule.push({ age: '6m', vaccines: EPI['6m'] });
  if (age_months >= 12) schedule.push({ age: '12m', vaccines: EPI['12m'] });
  if (age_months >= 18) schedule.push({ age: '18m', vaccines: EPI['18m'] });
  if (age_months >= 48) schedule.push({ age: '4y', vaccines: EPI['4y'] });
  return { age_months, schedule };
}

function coldChainTracking(input) {
  const { storage_temp_c, min_temp_c, max_temp_c } = input;
  const excursion = storage_temp_c < min_temp_c || storage_temp_c > max_temp_c;
  return { excursion, action: excursion ? 'DISCARD_AND_INVESTIGATE' : 'OK' };
}

function aefiReporting(input) {
  const { patient_id, vaccine, severity } = input;
  return { report_id: `AEFI-${Date.now()}`, patient_id, vaccine, serious: severity === 'severe' || severity === 'life_threatening' };
}

function catchUpSchedule(input) {
  const { vaccines_received } = input;
  const all_vaccines = ['BCG', 'HepB', 'DTaP', 'Hib', 'IPV', 'PCV13', 'MMR', 'Varicella'];
  return { missed: all_vaccines.filter(v => !vaccines_received.includes(v)) };
}

function contraindicationCheck(input) {
  const { vaccine, allergies, current_conditions } = input;
  const egg_allergy = (allergies || []).includes('egg');
  const contraindications = [];
  if (vaccine === 'MMR' && egg_allergy) contraindications.push('severe_egg_allergy');
  if (current_conditions?.includes('immunocompromised')) contraindications.push('immunocompromised_state');
  return { contraindications, can_administer: contraindications.length === 0 };
}

module.exports = { epiScheduleForAge, coldChainTracking, aefiReporting, catchUpSchedule, contraindicationCheck, CITATIONS };