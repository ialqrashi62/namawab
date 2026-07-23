---
module_id: ER-001
section: 02_ai_orchestration
template_ref: TPL:DEPT
generated: 2026-07-23
---

# ER-001 RAG Chains (AIE + LangGraph)

## Chain 1: Triage Triage-Assist Agent
**Purpose:** ESI auto-classification + red flag detection
**Architecture:** LangGraph supervisor → 4 parallel tools

```python
class TriageState(TypedDict):
    patient_id: str
    chief_complaint: str
    hpi: str
    vitals: dict
    pmh: list[str]
    medications: list[str]
    esi_level: int
    red_flags: list[str]
    requires_human: bool

def triage_supervisor(state):
    # Route to parallel tools
    state['esi_level'] = esi_classifier(state)
    state['red_flags'] = red_flag_detector(state)
    state['differentials'] = differential_generator(state)
    state['workup'] = workup_suggester(state)
    return state
```

**Tools:**
- `fhir_patient_lookup` — patient demographics, PMH, allergies
- `esi_classifier` — rule-based + ML hybrid (XGBoost trained on 100K ED visits)
- `red_flag_detector` — keyword + vital sign + pattern matching
- `differential_generator` — RAG on UpToDate, ACEP, clinical_knowledge
- `workup_suggester` — guideline-based order set recommendation

## Chain 2: Chest Pain Pathway
**Trigger:** chief complaint includes "chest pain" or "CP" or related

```python
def chest_pain_pathway(state):
    state = ecg_interpreter(state)  # AI-ECG (med-CNN)
    state = troponin_trend(state)  # serial troponin interpretation
    state = heart_score(state)  # HEART score calculator
    state = disposition_advisor(state)  # admit vs obs vs discharge
    return state
```

**RAG sources:**
- ACC/AHA 2023 Chest Pain Guidelines
- HEART score derivation papers
- ACEP clinical policy on chest pain
- Institution-specific chest pain protocol

## Chain 3: Sepsis Bundle Agent
**Trigger:** qSOFA >=2 OR clinical suspicion + SIRS

```python
def sepsis_bundle(state):
    state = sepsis_screener(state)  # qSOFA, SOFA, NEWS2
    state = bundle_initiator(state)  # lactate, blood cx, abx, fluids
    state = antibiotic_recommender(state)  # source-specific empiric
    state = source_finder(state)  # RAG on differential
    return state
```

**Hard rule:** Sepsis bundle MUST complete within 1h (Surviving Sepsis 2021)
- Lactate measured + repeated if >2
- Blood cultures BEFORE antibiotics (2 sets from different sites)
- Broad-spectrum antibiotics (within 1h, every hour delay = 7% mortality)
- IV crystalloid 30 mL/kg if hypotensive or lactate >=4
- Vasopressors if MAP <65 after fluids

## Chain 4: Stroke Alert Agent
**Trigger:** focal neuro deficit + last-known-well <24h + NIHSS >0

```python
def stroke_alert(state):
    state = nihss_calculator(state)  # auto-fill from exam
    state = tpa_eligibility_check(state)
    state = ct_order_set(state)  # STAT CT, CT angio
    state = thrombectomy_candidate(state)  # LVO screening
    return state
```

**Time targets:**
- Door-to-CT: <25 min
- Door-to-needle (tPA): <60 min
- Door-to-puncture (mechanical thrombectomy): <90 min for LVO

## Chain 5: Trauma Activation
**Trigger:** mechanism + abnormal vitals (ATLS criteria)

```python
def trauma_activation(state):
    state = injury_severity_scorer(state)  # ISS calculator
    state = activation_level(state)  # level 1 (highest) or 2
    state = mtp_calculator(state)  # massive transfusion protocol
    state = consultant_notifier(state)  # trauma surgery, IR, neurosurg
    return state
```

## Human-in-the-Loop (HITL) Triggers

Mandatory human review when:
- ESI 1 (resuscitation) auto-classified → MD must confirm
- Red flag detected → MD acknowledgment within 3 min
- AI confidence <0.7 on any critical recommendation
- Drug interaction alert (MD can override with reason)
- Disposition decision (MD must sign)
- Critical lab value (MD must acknowledge)
- Code activation (charge nurse must confirm)

## Observability
- Every tool call: input hash, output hash, latency, model version
- Every state change: full state snapshot (for replay)
- LangSmith (or LangFuse self-hosted) for trace visualization
- LLM cost tracking: tokens, $, per agent
- Drift monitoring: classification accuracy vs MD ground truth

## Fallback Strategy
- LLM API down → rule-based agents (no LLM, validated clinical rules)
- Specific tool failure → skip + warn (continue with remaining tools)
- Whole agent failure → manual triage with paper backup
- Network down → queue requests, batch reconciliation when online

---
*Section 02.a of ER-001. Owner: AIE.*
