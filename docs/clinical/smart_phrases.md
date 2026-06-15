# Clinical Smart Phrases (templates)

> Quick-text snippets clinicians can expand with a `.shortcode`. Replace `{{...}}` placeholders.
> Saves time, ensures complete documentation, supports CBAHI documentation standards.

## Cardiology

### `.cardio.hpi`
```
{{age}}yo {{sex}} with PMH of {{problems}}, currently on {{meds}}, presenting with
{{chief_complaint}} for {{duration}}. Pain quality: {{pain_quality}}, radiation: {{radiation}}.
Associated symptoms: {{associated}}. Aggravating: {{aggravating}}; relieving: {{relieving}}.
Last similar episode: {{last_episode}}. ROS otherwise negative.
```

### `.cardio.assess.acs`
```
ACS workup: HEART={{heart}}, troponin {{trop}} (ref<{{trop_uln}}); ECG: {{ecg}}.
Plan: {{disposition}}; serial trop at 0/3h, ECG q30min x2, ASA {{asa}}, statin,
admit chest-pain unit / cath lab / discharge with stress test.
```

### `.cardio.af.dxplan`
```
AF, CHA2DS2-VASc={{cha}}, HAS-BLED={{bled}}. Anticoagulation indicated; chosen
{{drug}} {{dose}} (CrCl {{crcl}}). Counseled on bleeding risk, INR not needed for DOAC,
follow-up in {{weeks}} weeks. Rate control with {{rate_drug}}.
```

## ED

### `.ed.triage`
```
{{age}}yo {{sex}}, walked-in / arrived via {{mode}}. Vitals BP {{bp}}, HR {{hr}}, RR {{rr}},
SpO2 {{spo2}}, T {{temp}}, GCS {{gcs}}, pain {{pain}}/10. CTAS {{ctas}}.
Brief Hx: {{hx}}. Allergies: {{allergies}}. Prior: {{prior}}.
```

### `.ed.disposition.discharge`
```
Discharged home in stable condition. Vital signs at discharge BP {{bp}} HR {{hr}}.
Discharge meds reviewed. Follow-up: {{follow_up}}. Return precautions: worsening pain,
fever > 38.5, vomiting, breathing difficulty — return to ED. Patient verbalized understanding.
```

## ICU

### `.icu.daily.fasthugbid`
```
F: feeding (TPN/EN/PO) — {{f}}
A: analgesia (CPOT/visual analog) — {{a}}
S: sedation (RASS goal) — {{s}}
T: thromboprophylaxis — {{t}}
H: HOB elevation 30-45° — {{h}}
U: ulcer prophylaxis — {{u}}
G: glycemic control 140-180 — {{g}}
B: bowel regimen — {{b}}
I: indwelling catheters — {{i}}
D: de-escalation — {{d}}
```

### `.icu.handover.sbar`
```
S: {{patient}}, day {{los}} of ICU, on {{vent}} vent / RA / NRB. Active issues: {{issues}}.
B: admitted for {{reason}}, prior course {{course}}.
A: today APACHE {{ap}}, SOFA {{sofa}}; vasopressors {{vasos}}; sedation RASS {{rass}};
labs significant for {{labs}}.
R: continue {{plan}}; pending {{pending}}; concerns {{concerns}}.
```

## OB-GYN

### `.obgyn.anc.visit`
```
G{{g}}P{{p}} at {{ga}}w, by LMP {{lmp}} / by US {{us_ga}}. BP {{bp}}, weight {{w}} kg,
fundal height {{fh}} cm, FHR {{fhr}}. Edema {{edema}}, urine dip {{dip}}.
Plan: {{plan}}. Next visit {{next}}.
```

## Pediatrics

### `.peds.well.visit`
```
{{age_months}}-month well-child visit. Weight {{w}} kg ({{wp}}%), length {{l}} cm ({{lp}}%),
HC {{hc}} cm ({{hcp}}%). Development: {{dev}}. Immunizations up-to-date / due {{vac}}.
Anticipatory guidance covered: feeding, sleep, safety, screen time. Next visit {{next}}.
```

## Surgery

### `.surg.timeout`
```
Pre-incision time-out completed:
- Patient identity confirmed (2 identifiers)
- Consent verified for {{procedure}}, side: {{side}}
- Site marked + visible
- Antibiotics within {{abx_min}} min of incision
- Implants available
- Allergies reviewed: {{allergies}}
- Critical events anticipated: {{critical}}
All team present and confirmed. Surgeon {{surgeon}}, anesthesia {{anesth}}, scrub {{scrub}}.
```

### `.surg.opnote`
```
Procedure: {{procedure}}
Surgeon: {{surgeon}} ; Assistant: {{assist}}
Anesthesia: {{anes}} ({{type}})
Indication: {{indication}}
Findings: {{findings}}
Procedure: {{steps}}
EBL: {{ebl}} ; Fluids: {{fluids}}
Specimens: {{specimens}}
Complications: {{complications}}
Disposition: {{disposition}}
```

## Discharge summary

### `.dx.summary`
```
Admission: {{admit_date}} → Discharge: {{disc_date}} (LOS {{los}}d)
Primary diagnosis: {{primary}}
Secondary: {{secondary}}
Hospital course: {{course}}
Discharge meds: {{meds}}
Follow-up: {{follow_up}}
Pending results: {{pending}}
Patient education: {{education}}
```
