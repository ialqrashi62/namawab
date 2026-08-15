SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename IN (
  'stroke_cases','stroke_thrombolysis','stroke_thrombectomy','stroke_imaging','stroke_followup',
  'hf_cases','hf_admissions','lvad_patients','heart_transplants','hf_medications',
  'cardio_onc_cases','cardiotoxicity_events','ici_myocarditis','vte_cancer',
  'robotic_cv_cases','robotic_cv_procedures','robotic_cv_followups','robotic_cv_devices',
  'pe_dvt_cases','pe_dvt_treatments','pe_dvt_followups'
) ORDER BY tablename;
