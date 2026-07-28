# 27 — Wireframes (CARD-001)

> Owner: PM/UX · Template: wireframe_v1 · Tier 1

## Wireframe 1: Doctor Cardiology Station — main view

```yaml
screen:
  id: cardio__doctor_station_main
  title_ar: محطة طبيب القلب
  title_en: Cardiology Doctor Station
  layout: B
  rtl: true
  persona: doctor
  components:
    - { id: nav, type: nav, position: 'col 1 (rtl right)', i18n: 'cardio.nav' }
    - { id: topbar, type: header, position: 'top', i18n: 'common.topbar' }
    - { id: tabs, type: tab, position: 'col 2 top', tabs: [encounter, orders, results, notes, rx, disposition], i18n: 'cardio.tabs' }
    - { id: encounter_body, type: main, position: 'col 2', i18n: 'cardio.encounter' }
    - { id: timeline, type: timeline, position: 'col 3 (rtl left)', i18n: 'cardio.timeline' }
    - { id: red_flag_banner, type: alert, position: 'top', color: critical, condition: 'has_red_flag' }
    - { id: cds_alerts, type: callout, position: 'col 2 below tabs', color: warning, condition: 'cds_rules > 0' }
    - { id: footer, type: footer, position: 'bottom', buttons: [save, sign, print, send_to_nphies] }
  data:
    sources: [/api/cardiology/encounters/:id, /api/cardiology/copilot/queries]
    real_time: true
    cache: tenant:<id>:encounter:<id> ttl 60s
  states:
    - { state: loading, ui: skeleton_shimmer }
    - { state: empty, ui: empty_state_no_encounter }
    - { state: error, ui: error_with_retry }
    - { state: red_flag, ui: critical_banner + activated_alert }
  a11y:
    aria_labels: [nav, topbar, tabs, encounter, timeline, footer]
    focus_order: [topbar_search, tabs, encounter, timeline, footer]
    keyboard_shortcuts: [ctrl+s=save, ctrl+shift+s=sign, ctrl+p=print, ctrl+/=co-pilot]
  stitch_component_ids: [ds-header-card, ds-tab-group, ds-timeline-vertical, ds-alert-banner, ds-form-section]
  red_flag_highlight: ['STEMI', 'dissection', 'tamponade', 'PE', 'SCD']
  safe_html_required: true
```

## Wireframe 2: ECG viewer

```yaml
screen:
  id: cardio__ecg_viewer
  title_ar: عارض تخطيط القلب
  title_en: ECG Viewer
  layout: F
  rtl: true
  persona: doctor
  components:
    - { id: lead_set_12, type: chart, position: 'top', data: ecg_12_lead }
    - { id: rhythm_strip, type: chart, position: 'mid', data: lead_II_long }
    - { id: measurements, type: form, position: 'right', fields: [rate, pr, qrs, qtc, axis] }
    - { id: interpretation, type: text, position: 'bottom', i18n: 'cardio.ecg.interpretation' }
    - { id: red_flag_callout, type: alert, color: critical, condition: 'red_flag' }
  data:
    sources: [/api/cardiology/ecg/:id]
    real_time: false
    cache: tenant:<id>:ecg:<id> ttl 1h
  states: [loading, normal, stemi_pattern, af, vt, bbb, noisy]
  a11y:
    aria_labels: [lead_set, rhythm_strip, measurements, interpretation]
  red_flag_highlight: ['STEMI', 'NSTEMI', 'VT', 'VF', 'torsades']
```

## Wireframe 3: Cath lab report

```yaml
screen:
  id: cardio__cath_report
  title_ar: تقرير القسطرة
  title_en: Cath Lab Report
  layout: F
  rtl: true
  persona: doctor
  components:
    - { id: procedure_metadata, type: form, position: 'top', fields: [type, access_site, performed_at, performed_by] }
    - { id: findings_table, type: table, position: 'mid', data: vessels[stenosis_pct, ffr, ivus] }
    - { id: interventions_table, type: table, position: 'mid', data: stents[type, size, deployed_at] }
    - { id: fluoro_summary, type: kpi, position: 'right', kpis: [contrast_ml, fluoro_min, dose_mgy] }
    - { id: complications, type: text, position: 'mid', i18n: 'cardio.cath.complications' }
    - { id: nphies_panel, type: callout, position: 'right', data: bundle + amount + status }
    - { id: signoff_footer, type: footer, buttons: [save_draft, sign_and_submit, send_to_nphies] }
  data:
    sources: [/api/cardiology/cath/:id, /api/cardiology/nphies/eligibility]
  states: [draft, signed, submitted, paid, denied]
  a11y:
    aria_labels: [metadata, findings, interventions, fluoro, complications, nphies, footer]
  red_flag_highlight: ['dissection', 'perforation', 'no_reflow', 'stent_thrombosis', 'contrast_nephropathy']
```

## Wireframe 4: HF GDMT optimizer

```yaml
screen:
  id: cardio__hf_gdmt_optimizer
  title_ar: محسن علاج الفشل القلبي
  title_en: HF GDMT Optimizer
  layout: C
  rtl: true
  persona: doctor
  components:
    - { id: patient_summary, type: card, position: 'top', data: ef, nyha, bp, hr, egfr, k, current_meds }
    - { id: gdmt_recommendations, type: list, position: 'mid', data: changes, contra, monitor }
    - { id: gdmt_visual, type: chart, position: 'right', chart: gdmt_pillars_radar, pillars: [arni, bb, mra, sglt2i] }
    - { id: cds_alerts, type: callout, position: 'mid', color: warning, data: cds_rules }
    - { id: action_footer, type: footer, buttons: [apply_changes, request_pharmacy_review, save_plan] }
  data:
    sources: [/api/cardiology/risk-scores/hf-gdmt, /api/medications, /api/labs]
    real_time: true
  states: [loading, hfrEF, hfmrEF, hfpEF, contraindication, ok]
  red_flag_highlight: ['hyperkalemia_severe', 'egfr<15', 'symptomatic_hypotension', 'bradycardia<50']
```

## Wireframe 5: Co-pilot chat

```yaml
screen:
  id: cardio__copilot
  title_ar: مساعد طب القلب الذكي
  title_en: Cardiology Co-pilot
  layout: C
  rtl: true
  persona: doctor
  components:
    - { id: chat_history, type: chat, position: 'main', data: question, answer, citations }
    - { id: retrieved_docs_panel, type: accordion, position: 'right', data: top_3_chunks }
    - { id: cds_panel, type: callout, position: 'right', color: warning, data: cds_rules }
    - { id: red_flag_alert, type: alert, color: critical, position: 'top', condition: 'red_flag' }
    - { id: input_bar, type: form, position: 'bottom', fields: [question, include_patient_context, stream] }
    - { id: action_buttons, type: footer, buttons: [send, clear, save_to_encounter, send_to_cds] }
  data:
    sources: [/api/cardiology/copilot/query]
    real_time: true (stream)
  states: [idle, thinking, streaming, complete, error, red_flag_detected]
  a11y:
    aria_labels: [chat, retrieved, cds, red_flag, input, footer]
  red_flag_highlight: ['auto-detected from copilot answer']
```

## Wireframe 6: Red flag activation

```yaml
screen:
  id: cardio__red_flag_activate
  title_ar: تفعيل تنبيه عاجل
  title_en: Red Flag Activation
  layout: C
  rtl: true
  persona: doctor | nurse | er
  components:
    - { id: critical_banner, type: alert, color: critical, position: 'top', fullwidth: true }
    - { id: rf_selector, type: select, position: 'top', options: [STEMI, dissection, tamponade, PE, SCD, ...] }
    - { id: patient_context, type: card, position: 'mid', data: name, mrn, age, sex, location }
    - { id: clinical_evidence, type: text, position: 'mid', i18n: 'cardio.rf.evidence' }
    - { id: on_call_team, type: list, position: 'right', data: cardiologist, cath_team, ccu }
    - { id: timeline, type: timeline, position: 'right', i18n: 'cardio.rf.timeline' }
    - { id: action_footer, type: footer, buttons: [activate, override_with_reason, cancel] }
  data:
    sources: [/api/cardiology/red-flags/:id/activate, /api/users/on-call]
  states: [selecting, confirming, activating, activated, error]
  red_flag_highlight: ['all 15 cardio red flags']
```

## Wireframe 7: NPHIES claim

```yaml
screen:
  id: cardio__nphies_claim
  title_ar: مطالبة NPHIES
  title_en: NPHIES Claim
  layout: C
  rtl: true
  persona: billing | doctor
  components:
    - { id: claim_form, type: form, position: 'left', fields: [encounter, patient, bundle, lines] }
    - { id: eligibility_check, type: callout, position: 'top', color: info, data: eligibility }
    - { id: amount_summary, type: kpi, position: 'right', kpis: [subtotal, vat, total, co_pay] }
    - { id: response_panel, type: table, position: 'mid', data: previous_claims, status }
    - { id: action_footer, type: footer, buttons: [validate, submit, retry, cancel] }
  data:
    sources: [/api/cardiology/nphies/claim, /api/cardiology/nphies/eligibility]
  states: [draft, validating, eligible, ineligible, submitting, submitted, paid, denied, partial]
  red_flag_highlight: ['duplicate_claim', 'amount_over_limit', 'ineligible_service']
```
