# CARD-301_STROKE — Wireframes

## Page 1: Stroke Center Dashboard (ER View)
```
┌────────────────────────────────────────────────────────────┐
│ ⚠️ CODE STROKE — مركز السكتة الدماغية   [Live SLA: 24:13] │
├────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│ │ Door-CT  │ │Door-Needle│ │Door-Groin│ │ Cases    │        │
│ │   22 min │ │   45 min │ │   78 min │ │  12      │        │
│ │ ✓ target │ │ ✓ target │ │ ✓ target │ │ this mo  │        │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
├────────────────────────────────────────────────────────────┤
│ Active Cases (3)                                            │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ MRN-12345 | NIHSS 18 | AIS | TLKW 90 min | [View]    │ │
│ │ MRN-67890 | NIHSS 4  | TIA | TLKW 4h     | [View]    │ │
│ │ MRN-11111 | NIHSS 22 | ICH | onset 30min | [View]    │ │
│ └────────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────┤
│ Quality Trend (Last 12 months)                              │
│ [Line Chart: DNT over time]                                │
└────────────────────────────────────────────────────────────┘
```

## Page 2: Stroke Case Detail
```
┌────────────────────────────────────────────────────────────┐
│ Case #12345 — Patient ID 67890                              │
├────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────┐  ┌──────────────────┐          │
│ │ Patient Information     │  │ SLA Indicators   │          │
│ │ ID: 67890               │  │ Door-CT: 18 min  │          │
│ │ Arrival: 09:00          │  │ Door-Needle: 51  │          │
│ │ TLKW: 08:30             │  │ Door-Groin: N/A  │          │
│ │ Stroke Type: AIS        │  │ Stroke Unit: Yes │          │
│ │ NIHSS: 18 (Severe)      │  └──────────────────┘          │
│ │ ASPECTS: 8              │                                │
│ └─────────────────────────┘                                │
│                                                             │
│ Treatment Timeline                                          │
│ ● 09:00 — Arrival                                           │
│ ● 09:18 — CT Complete                                       │
│ ● 09:35 — CT Result: LVO Negative                          │
│ ● 09:42 — Tenecteplase 17.5mg administered                 │
│ ● 10:30 — Stroke Unit admission                            │
│                                                             │
│ Secondary Prevention Bundle (4/5)                          │
│ ✓ Antiplatelet ✓ Statin ✓ Anticoag ✓ BP Control ✗ Lifestyle│
└────────────────────────────────────────────────────────────┘
```

## Page 3: Code Stroke Form
```
┌────────────────────────────────────────────────────────────┐
│ 🚨 CODE STROKE — ACTIVATION FORM                          │
├────────────────────────────────────────────────────────────┤
│ Patient ID: [_____]  Last Known Well: [datetime]            │
│                                                             │
│ NIHSS Assessment (0-42)                                     │
│ ┌─────────────────┬─────────────────┐                      │
│ │ Consciousness: 0│ Gaze: 0         │                      │
│ │ Visual Fields: 0│ Facial Palsy: 0 │                      │
│ │ Motor Arm L: 0  │ Motor Arm R: 0  │                      │
│ │ Motor Leg L: 0  │ Motor Leg R: 0  │                      │
│ │ Limb Ataxia: 0  │ Sensory: 0      │                      │
│ │ Language: 0     │ Dysarthria: 0   │                      │
│ │ Extinction: 0   │                 │                      │
│ └─────────────────┴─────────────────┘                      │
│ Total: 0 [MINOR]                                            │
│                                                             │
│ Contraindications:                                          │
│ ☐ CT Hemorrhage  ☐ Active Bleeding                         │
│ ☐ Recent Surgery (14d)  ☐ Recent Stroke (90d)              │
│                                                             │
│ Vitals:                                                     │
│ INR: [_____]  Platelets: [_____]                          │
│ BP: [_____]/[_____]  Weight: [_____] kg  Age: [_____]      │
│                                                             │
│ Eligibility Result: [✓ Eligible for Thrombolysis]          │
│ Recommended Dose: 17.5 mg Tenecteplase                     │
│                                                             │
│ [🚨 ACTIVATE CODE STROKE]                                  │
└────────────────────────────────────────────────────────────┘
```

## Page 4: Mobile Stroke Team View
```
┌────────────────────────────┐
│ ⚠️ CODE STROKE — Live      │
├────────────────────────────┤
│ Patient: 67890              │
│ TLKW: 60 min ago           │
│ NIHSS: 14                  │
│ ────────────────────────   │
│ Activation: ACTIVE        │
│ Door-CT: 22 min ✓         │
│ Door-Needle: TARGET 60 min │
│ Currently: 45 min         │
│ ────────────────────────   │
│ [Send Update to Team]      │
│ [Mark Treatment Complete]  │
└────────────────────────────┘
```
