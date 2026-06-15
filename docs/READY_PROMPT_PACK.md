# Ready Prompt + Scenario + Data Flow Pack
> ملف واحد جاهز للاستخدام **للأقسام كافة**. انسخ القالب، استبدل `{{...}}`، وألصِقه في LangChain / OpenAI / Claude API.

---

## 1) META-PROMPT (يُولِّد بقية الـ prompts لأي قسم جديد)

```text
You are a Hospital ERP Solution Architect generating a *complete spec pack* for one
department of NamaMedical. Input: department name in EN+AR + sub-units list.

OUTPUT (markdown, in this exact order, in Arabic + English bilingual):
1. Department metadata (key, names, sub-units, KPIs, accreditations)
2. System Prompt for the department's AI co-pilot (production-ready)
3. Context schema (yaml)
4. 3 few-shot clinical examples
5. LangGraph state diagram (python pseudocode)
6. REST API endpoints (table + 1 OpenAPI yaml fragment)
7. Database tables (SQL DDL — SQL Server dialect)
8. Vector DB collections + RAG ingestion plan
9. UI screens list + component reuse
10. CI/CD pipeline notes
11. Test plan summary (unit / integration / E2E)
12. 5+ Gherkin user stories (mix happy + edge + safety-critical)
13. STRIDE security table
14. i18n keys list (≥30)
15. Sample seeder SQL (10 rows minimum)
16. Migration script V001
17. User-manual TOC
18. Training video script titles (5 videos × ≤5 min)
19. Legal / compliance mapping (PDPL, CBAHI, MoH, sub-specialty body)
20. Open questions + risks

CONSTRAINTS:
- Cite real, verifiable guidelines/scoring tools used in the specialty.
- Use SQL Server T-SQL syntax; UUIDs as PRIMARY KEY; DATETIMEOFFSET for time.
- All user-facing strings bilingual (ar + en).
- No placeholder lorem-ipsum. All examples must be clinically plausible.
```

---

## 2) RUNTIME SYSTEM PROMPT (drop-in for any dept)

```text
You are NamaMedical-{{DEPT_KEY}} Assistant.

CONTEXT
- Hospital: {{FACILITY_NAME}} ({{FACILITY_CODE}})
- Country: KSA — PDPL, MoH eHealth, CBAHI accredited
- Department: {{DEPT_NAME_EN}} / {{DEPT_NAME_AR}}
- Available roles: {{ROLES_LIST}}
- Current user: role={{ROLE}}, language={{LANG}}, on-call={{ON_CALL_BOOL}}

ROLE
Help {{ROLES_LIST}} execute clinical/admin tasks safely and efficiently in {{DEPT_NAME_EN}}.

DOMAIN GUARDRAILS
- Use only: {{GUIDELINES_LIST}} (latest version) + local SOP from RAG.
- Always verify: allergies, weight (peds), eGFR (renal), pregnancy (women 15–50),
  active meds for interactions.
- Safety-critical decisions (resuscitation, anticoag init, chemo, surgery consent,
  pediatric dosing < 5 yo) → require human confirmation.

TOOLS
{{TOOLS_LIST_AS_JSONSCHEMA}}

OUTPUT STYLE
- Language: {{LANG}}; medical terms include EN equivalents on first mention.
- Format: SOAP for notes, SBAR for handover, table for orders.
- Always end with: "Next-best-action:" and "Time-critical: yes|no".
- Cite sources from RAG with chunk IDs (e.g., [SOP-2024-§3.2]).

REFUSAL
- If a request would breach PDPL (export PHI without auth), reply with the
  refusal template + escalate(reason="pdpl_violation_attempt").
- If clinical confidence < 0.7 → "I am not confident; please consult {{ESCALATION_ROLE}}".
```

---

## 3) USER PROMPT WRAPPER (per request)

```text
[CONTEXT]
{{context_yaml_here}}

[USER QUESTION]
{{user_message}}

[INSTRUCTIONS TO ASSISTANT]
1. Identify intent (triage|order|interpret|prescribe|handover|question).
2. Retrieve relevant patient data via tools.
3. RAG-search guidelines (top 5 chunks).
4. Compose answer using OUTPUT STYLE.
5. Run SELF-CRITIQUE checklist before emitting.
6. If safety-critical → set requires_human_confirm = true.
```

---

## 4) BUSINESS SCENARIO TEMPLATE (one paragraph + flow)

```text
SCENARIO: {{Scenario name}} — {{dept}}
Persona: {{Role + experience level + language}}
Trigger: {{What initiates the scenario}}
Goal: {{Desired outcome with measurable success}}

PRECONDITIONS
- {{User logged in with role X}}
- {{Patient registered with MRN}}
- {{Required configurations in place}}

MAIN FLOW
1. {{Step 1: User action}}
2. {{Step 2: System response (incl. AI tool calls)}}
3. {{Step 3: Decision point — branch}}
4. {{Step 4: Confirmation/persistence}}
5. {{Step 5: Notification/event published}}

ALTERNATE FLOWS
A1. {{When precondition X fails}}
A2. {{When AI confidence is low}}

POSTCONDITIONS
- {{Data persisted}}
- {{Audit row appended}}
- {{Event {dept}.{action}.completed published}}

NON-FUNCTIONAL
- p95 latency ≤ {{X ms}}
- Concurrent users ≤ {{N}}
- Offline-tolerant: yes/no
```

### مثال: Cardiology — STEMI fast-track
```text
SCENARIO: STEMI fast-track from ED
Persona: ED physician (resident, AR UI), Cardiology fellow (on-call, AR UI)
Trigger: 12-lead ECG in ED tagged "STEMI" by AI with confidence ≥ 0.90
Goal: Door-to-balloon ≤ 90 min

PRECONDITIONS
- Patient registered (or quick-reg with MRN issued)
- Cath lab on-call team configured for the date
- AI ECG model available and within SLA

MAIN FLOW
1. ED nurse uploads ECG via mobile capture; system auto-tags STEMI anterior, conf 0.94
2. System fires `cardio.ecg.ai.completed` → ED dashboard turns red, banner appears
3. ED physician reviews → presses "Activate Code STEMI"
4. System pages cath lab team (SMS + push), creates `cardio_cath_cases` row "incoming"
5. Door-to-balloon timer starts on board (countdown 90:00)
6. Cath fellow opens app → confirms acceptance → adds anticipated access (radial-r)
7. Patient transferred; nurse marks "in cath lab"; finally "balloon time" recorded
8. Event `cardio.cath.completed` published → registry, billing, quality dashboards updated

ALTERNATE FLOWS
A1. AI confidence < 0.90 → no auto-banner; manual physician interpretation only
A2. Cath lab full → escalate to second on-call hospital (referral workflow G44)

POSTCONDITIONS
- ECG study + AI label persisted, immutable
- Code activation logged in `ed_codes` + `cardio_cath_cases`
- Quality KPI updated; if >90 min, root-cause flag opened in OVR (G36)

NON-FUNCTIONAL
- AI ECG label ≤ 5 s p95; pager push ≤ 30 s p95
- 24/7 availability; offline mode keeps capture queue
```

---

## 5) DATA FLOW TEMPLATE (universal)

```
┌──────────┐    HTTPS     ┌─────────────┐   gRPC    ┌────────────────┐
│  Client  │─────────────▶│  API Gateway│──────────▶│  Dept Service  │
│ (Web/Qt) │◀─────SSE─────│  (Kong/NGX) │◀──────────│ (FastAPI/.NET) │
└──────────┘              └─────────────┘           └───────┬────────┘
                                                            │
                          ┌─────────────────────────────────┼────────────────┐
                          │                                 │                │
                          ▼                                 ▼                ▼
                  ┌──────────────┐                  ┌───────────┐    ┌──────────────┐
                  │  SQL Server  │                  │  Qdrant   │    │  Redis cache │
                  │  (OLTP)      │                  │ (Vectors) │    │  + queues    │
                  └──────┬───────┘                  └─────┬─────┘    └──────┬───────┘
                         │ CDC                            │                  │
                         ▼                                ▼                  ▼
                  ┌──────────────┐                  ┌───────────┐    ┌──────────────┐
                  │  Kafka topic │─────────────────▶│  AI worker│    │  Pager / SMS │
                  │  (events)    │                  │ (Python)  │    │  (Twilio)    │
                  └──────┬───────┘                  └─────┬─────┘    └──────────────┘
                         │                                │
                         ▼                                ▼
                  ┌──────────────┐                  ┌───────────┐
                  │  Data Lake   │                  │  LLM API  │
                  │  (S3/MinIO)  │                  │ (KSA edge)│
                  └──────────────┘                  └───────────┘
```

### Detailed flow per dept (مثال Cardiology STEMI)

```
1. ECG uploaded (POST /cardio/ecg)
   → API writes blob to MinIO
   → DB row in cardio_ecg_studies (status=processing)
   → publish cardio.ecg.uploaded

2. AI worker consumes event
   → fetches blob, runs model
   → updates cardio_ecg_studies (ai_interpretation, ai_confidence)
   → if STEMI prob ≥ 0.90 → publish cardio.ecg.ai.stemi.detected

3. ED service consumes cardio.ecg.ai.stemi.detected
   → triggers UI banner via SSE
   → no clinical action without human confirm

4. Physician confirms → POST /ed/codes/STEMI/activate
   → ed_codes row inserted
   → cardio_cath_cases row inserted (status=incoming)
   → publish ed.code.STEMI.activated

5. Notification service consumes
   → sends pager/SMS via Twilio
   → adds entry to internal_messages

6. Quality service consumes
   → starts door-to-balloon timer (Redis with TTL)
   → on cardio.cath.completed (later) → compute LOS, write KPI
```

---

## 6) ORCHESTRATION CODE SKELETON

```python
# orchestrator/{{dept_key}}_graph.py
from langgraph.graph import StateGraph, END
from langchain_anthropic import ChatAnthropic
from langchain_core.tools import tool
from typing import TypedDict, Literal

llm = ChatAnthropic(model="claude-opus-4-7", temperature=0.0, max_tokens=2048)

@tool
def search_patient(query: str) -> dict:
    """Search ERP for patient by MRN/name/nationalId."""
    ...

@tool
def get_lab_results(patient_id: str, panel: str) -> list:
    """Fetch lab results panel for patient."""
    ...

@tool
def pull_protocol(condition: str) -> list[str]:
    """RAG retrieval over guidelines collection."""
    ...

class DeptState(TypedDict):
    intent: str
    patient_id: str | None
    rag_chunks: list[str]
    tool_results: dict
    answer: str
    requires_human: bool
    confidence: float

def classify(state):
    res = llm.invoke([{"role":"system","content":SYSTEM_PROMPT},
                      {"role":"user","content":state["question"]}])
    state["intent"] = parse_intent(res.content)
    return state

def retrieve(state):
    state["rag_chunks"] = pull_protocol.invoke(state.get("topic",""))
    return state

def execute_tools(state):
    # iterative tool calling
    ...
    return state

def compose(state):
    state["answer"] = llm.invoke(build_messages(state)).content
    state["confidence"] = score_confidence(state["answer"])
    return state

def critique(state):
    if state["confidence"] < 0.7 or is_safety_critical(state):
        state["requires_human"] = True
    return state

g = StateGraph(DeptState)
for n,fn in [("classify",classify),("retrieve",retrieve),
             ("tools",execute_tools),("compose",compose),("critique",critique)]:
    g.add_node(n, fn)

g.set_entry_point("classify")
g.add_edge("classify","retrieve")
g.add_edge("retrieve","tools")
g.add_edge("tools","compose")
g.add_edge("compose","critique")
g.add_edge("critique", END)

graph = g.compile()
```

---

## 7) HOW TO USE THIS PACK (operational)

1. **اختر القسم** من القائمة (200+ قسم) في `00_Master_Blueprint.md`.
2. **انسخ** `TEMPLATE_per_department.md` إلى `docs/groups/{{NN}}_{{dept_key}}.md`.
3. استخدم **META-PROMPT (1)** في Claude/GPT لتوليد المحتوى مرة واحدة.
4. راجع المحتوى يدوياً مع clinical lead — صحّح/أكمل.
5. ضع **SYSTEM PROMPT (2)** + **USER PROMPT WRAPPER (3)** في خادم الـ AI الإنتاجي.
6. ارسم **BUSINESS SCENARIO (4)** لـ 3–5 رحلات حرجة لكل قسم.
7. اعتمد **DATA FLOW (5)** كأساس للنشر — عدّل ما يلزم لكل قسم.
8. انسخ **ORCHESTRATION SKELETON (6)** كنقطة بداية للكود.

---

## 8) QUICK CHECKLIST لكل قسم قبل الإنتاج
- [ ] System prompt مُختبَر مع 50 vignette طبية
- [ ] جداول DB مهجَّرة على staging
- [ ] Vector collection مُحمَّلة بآخر إصدار guideline
- [ ] OpenAPI منشور + SDK مولَّد
- [ ] Wireframes معتمدة من المستخدم النهائي
- [ ] Test matrix ≥ 80% pass
- [ ] STRIDE راجعها فريق الأمن
- [ ] Manual + 5 فيديوهات منشورة
- [ ] قسم مسؤول معتمد (sign-off)
