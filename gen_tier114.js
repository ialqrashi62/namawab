// filepath: gen_tier114.js
const fs = require('fs');
const mounts = [
  { mount: '/api/anxiety_v2', engine: 'tier114_anxiety_600_engine', fns: ['gad','panic_disorder','social_anxiety','phobia','separation_anxiety'] },
  { mount: '/api/mood_v2', engine: 'tier114_mood_601_engine', fns: ['mdd','bipolar','dysthymia','seasonal_affective','mixed_features'] },
  { mount: '/api/psychotic_v2', engine: 'tier114_psychotic_602_engine', fns: ['schizophrenia','schizoaffective','brief_psychotic','delusional','substance_induced_psychotic'] },
  { mount: '/api/trauma_v2', engine: 'tier114_trauma_603_engine', fns: ['ptsd','acute_stress','adjustment','complex_trauma','bereavement_reaction'] },
  { mount: '/api/substance_use_v2', engine: 'tier114_substance_use_604_engine', fns: ['alcohol_use','opioid_use','stimulant_use','cannabis_use','sedative_use'] },
];
for (const m of mounts) {
  const e = require('./' + m.engine);
  const fns = e.funcs();
  let r = `const express = require('express');\nconst router = express.Router();\nconst { funcs } = require('./${m.engine}');\nconst f = funcs();\nfunction asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }\n`;
  for (const fn of m.fns) {
    r += `router.post('/${fn}', asyncH((req, res) => { const r = f.${fn}(req.body || {}); res.json({ ok: true, op: '${fn}', result: r }); }));\n`;
  }
  r += `module.exports = router;\n`;
  const routerFile = m.engine.replace('_engine', '_router') + '.js';
  fs.writeFileSync(routerFile, r);
  console.log('Wrote', routerFile);
}
const bodies = [
  {"patient_id":"B0","assessment_id":"gd_0","gad_7_score":14,"duration_months":12,"severity":"moderate","worry_hours_per_day":3,"triggers":"work_health","treatment":"cbt","provider":"ps_001"},
  {"patient_id":"B1","assessment_id":"pd_1","panic_frequency":2,"last_panic_days":5,"agoraphobia":"moderate","pdss_score":15,"experimental_med":true,"cbt_initiated":true,"provider":"ps_001"},
  {"patient_id":"B2","assessment_id":"sa_2","lsas_score":75,"avoidance_behavior":true,"situations_count":4,"severity":"severe","response_to_medication":"partial","provider":"ps_001"},
  {"patient_id":"B3","assessment_id":"ph_3","phobia_type":"flying","onset_age":10,"avoids_situation":true,"exposure_treatment":"planned","progress":0.3,"provider":"ps_001"},
  {"patient_id":"B4","assessment_id":"sp_4","age":8,"duration_months":3,"school_refusal_days":10,"attachment_pattern":"insecure","parent_intervention":true,"outcome":"improving","provider":"ps_001"},
  {"patient_id":"B5","assessment_id":"md_5","phq_9_score":18,"duration_weeks":12,"suicidal_ideation":false,"severity":"moderately_severe","previous_treatment":true,"episodes_count":2,"provider":"ps_001"},
  {"patient_id":"B6","assessment_id":"bi_6","episode_type":"manic","young_score":12,"duration_days":14,"mood_stabilizer":"lithium","mood_episodes_per_year":2,"medication_adherent":true,"provider":"ps_001"},
  {"patient_id":"B7","assessment_id":"dy_7","duration_years":3,"ham_d_score":16,"workup":"completed","trialed_meds":true,"daily_functioning":6,"provider":"ps_001"},
  {"patient_id":"B8","assessment_id":"sa_8","winter_severity":7,"summer_improvement":3,"pattern":"fall_winter","light_treatment":true,"response":"good","provider":"ps_001"},
  {"patient_id":"B9","assessment_id":"mf_9","mde_count":2,"manic_features":true,"symptom_count":5,"treatment":"mood_stabilizer","side_effects":true,"provider":"ps_001"},
  {"patient_id":"B10","assessment_id":"sc_10","panss_total":85,"positive_score":20,"negative_score":25,"cognitive_score":40,"medication_adherence":"partial","hospitalizations_count":2,"provider":"ps_001"},
  {"patient_id":"B11","assessment_id":"sa_11","subtype":"bipolar_type","mood_episodes_count":4,"psychotic_episodes_count":2,"duration_years":5,"treatment":"combination","functioning":false,"provider":"ps_001"},
  {"patient_id":"B12","assessment_id":"bp_12","duration_days":7,"episode_count":1,"trigger":"stress","outcome":"full_recovery","follow_up":true,"provider":"ps_001"},
  {"patient_id":"B13","assessment_id":"dl_13","delusion_type":"persecutory","duration_years":2,"behavioral_impact":true,"treatment_response":"partial","psychiatric_comorbidity":false,"provider":"ps_001"},
  {"patient_id":"B14","assessment_id":"si_14","substance":"methamphetamine","days_after_last_use":3,"duration_days":5,"resolve_with_abstinence":true,"long_term_outcome":"resolved","provider":"ps_001"},
  {"patient_id":"B15","assessment_id":"pt_15","trauma_type":"combat","pcl_5_score":65,"duration_months":24,"severity":"severe","intrusive_symptoms":true,"traumatherapy":true,"provider":"ps_001"},
  {"patient_id":"B16","assessment_id":"as_16","days_since_event":10,"dissociation_score":15,"intrusive_symptoms":true,"hyperarousal":true,"functioning_score":5,"outcome":"improving","provider":"ps_001"},
  {"patient_id":"B17","assessment_id":"aj_17","stressor":"divorce","duration_months":4,"severity":"moderate","functioning_pct":70,"counseling_initiated":true,"provider":"ps_001"},
  {"patient_id":"B18","assessment_id":"ct_18","age_of_onset":5,"trauma_events_count":8,"dissociation_score":30,"emotional_dysregulation":true,"attachment_issues":true,"therapy_weeks":12,"provider":"ps_001"},
  {"patient_id":"B19","assessment_id":"br_19","months_since_loss":3,"relationship":"spouse","grief_intensity":8,"functioning_pct":50,"complicated_grief":true,"support_offered":true,"provider":"ps_001"},
  {"patient_id":"B20","assessment_id":"al_20","audit_score":18,"drinks_per_week":14,"use_pattern":"heavy","treatment":"brief_intervention","medications_for_addiction":false,"days_sober":7,"provider":"ps_001"},
  {"patient_id":"B21","assessment_id":"op_21","use_severity":"moderate","daily_dose_mge":120,"treatment":"buprenorphine","overdose_history":true,"days_in_treatment":90,"provider":"ps_001"},
  {"patient_id":"B22","assessment_id":"st_22","substance":"cocaine","use_days_per_month":15,"route":"nasal","days_clean":30,"craving_score":6,"response":"sustained_abstinence","provider":"ps_001"},
  {"patient_id":"B23","assessment_id":"ca_23","use_days_per_month":20,"amount_grams_per_week":7,"dependence_signs":true,"cudit_score":18,"cognitive_concerns":true,"motivation_to_quit":7,"provider":"ps_001"},
  {"patient_id":"B24","assessment_id":"se_24","medication":"alprazolam","daily_dose_mg":2,"duration_months":12,"tolerance":true,"taper":"planned","withdrawal_symptoms":false,"provider":"ps_001"}
];
for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:\\tmp\\multi_body_${i}.json`, JSON.stringify(bodies[i]));
}
console.log('Wrote 25 bodies and 5 routers');