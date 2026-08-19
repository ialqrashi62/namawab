/**
 * Immunization Registry — Engine
 */

'use strict';

const CITATIONS = { MOH_SA: 'MoH Saudi EPI 2024', WHO_PQS: 'WHO PQS Cold Chain' };

const EPI_SCHEDULE = {
  birth: ['BCG', 'HepB'],
  '2m': ['DTaP', 'Hib', 'IPV', 'PCV13', 'Rota'],
  '4m': ['DTaP', 'Hib', 'IPV', 'PCV13', 'Rota'],
  '6m': ['DTaP', 'Hib', 'IPV', 'PCV13', 'HepB'],
  '12m': ['MMR', 'Varicella', 'HepA'],
  '18m': ['DTaP', 'Hib', 'IPV'],
  '4y': ['DTaP', 'IPV', 'MMR', 'Varicella'],
  '11y': ['Tdap', 'HPV'],
  '65y': ['PPSV23', 'Influenza'],
};

function epiScheduleForAge(input) {
  const { age_months } = input;
  const schedule = [];
  if (age_months === 0) schedule.push({ age: 'birth', vaccines: EPI_SCHEDULE.birth });
  if (age_months >= 2) schedule.push({ age: '2m', vaccines: EPI_SCHEDULE['2m'] });
  if (age_months >= 4) schedule.push({ age: '4m', vaccines: EPI_SCHEDULE['4m'] });
  if (age_months >= 6) schedule.push({ age: '6m', vaccines: EPI_SCHEDULE['6m'] });
  if (age_months >= 12) schedule.push({ age: '12m', vaccines: EPI_SCHEDULE['12m'] });
  if (age_months >= 18) schedule.push({ age: '18m', vaccines: EPI_SCHEDULE['18m'] });
  if (age_months >= 48) schedule.push({ age: '4y', vaccines: EPI_SCHEDULE['4y'] });
  if (age_months >= 132) schedule.push({ age: '11y', vaccines: EPI_SCHEDULE['11y'] });
  if (age_months >= 780) schedule.push({ age: '65y', vaccines: EPI_SCHEDULE['65y'] });
  return { age_months, schedule, citation: CITATIONS.MOH_SA };
}

function coldChainTracking(input) {
  const { lot_number, storage_temp_c, min_temp_c, max_temp_c } = input;
  const excursion = storage_temp_c < min_temp_c || storage_temp_c > max_temp_c;
  return {
    lot_number, storage_temp_c, min_temp_c, max_temp_c,
    excursion,
    action: excursion ? 'DISCARD_AND_INVESTIGATE' : 'OK',
    citation: CITATIONS.WHO_PQS,
  };
}

function aefiReporting(input) {
  const { patient_id, vaccine, lot_number, adverse_event, severity, onset_hours } = input;
  const serious = severity === 'severe' || severity === 'life_threatening';
  return {
    report_id: `AEFI-${Date.now()}`,
    patient_id, vaccine, lot_number, adverse_event, severity, onset_hours,
    serious,
    follow_up_required: serious,
    citation: CITATIONS.MOH_SA,
  };
}

function catchUpSchedule(input) {
  const { age_months, vaccines_received } = input;
  const all_vaccines = ['BCG', 'HepB', 'DTaP', 'Hib', 'IPV', 'PCV13', 'Rota', 'MMR', 'Varicella', 'HepA', 'Tdap', 'HPV'];
  const missed = all_vaccines.filter(v => !vaccines_received.includes(v));
  return {
    age_months,
    received: vaccines_received,
    missed,
    catch_up_plan: missed.map(v => ({ vaccine: v, recommended_age: 'catch_up' })),
    citation: CITATIONS.MOH_SA,
  };
}

function contraindicationCheck(input) {
  const { vaccine, allergies, current_conditions } = input;
  const egg_allergy = allergies?.includes('egg');
  const contraindications = [];
  if (vaccine === 'MMR' && egg_allergy) contraindications.push('severe_egg_allergy');
  if (vaccine === 'Live' && current_conditions?.includes('immunocompromised')) contraindications.push('immunocompromised_state');
  return {
    vaccine,
    contraindications,
    can_administer: contraindications.length === 0,
    citation: CITATIONS.MOH_SA,
  };
}

module.exports = { epiScheduleForAge, coldChainTracking, aefiReporting, catchUpSchedule, contraindicationCheck, CITATIONS, EPI_SCHEDULE };