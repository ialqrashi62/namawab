# NamaMedical — Documentation & Implementation Hub

> منصة المستشفى الكاملة: 40 قسم طبي + بنية تحتية + كود بدء جاهز + أمن وامتثال + قانوني + تشغيل.
> مرجع لكل من يبني أو يدير أو يستخدم النظام.

---

## 0) Quick start
- **مستخدم سريري**: ابدأ بـ [faq/clinician_faq.md](faq/clinician_faq.md) ثم [onboarding/clinical_user_onboarding.md](onboarding/clinical_user_onboarding.md).
- **مريض**: [faq/patient_faq_ar.md](faq/patient_faq_ar.md) أو [patient_faq_en.md](faq/patient_faq_en.md).
- **مطوّر**: [onboarding/developer_onboarding.md](onboarding/developer_onboarding.md) → `make up` على `docs/dev-tooling/docker-compose.dev.yml`.
- **مدير منشأة**: [onboarding/admin_onboarding.md](onboarding/admin_onboarding.md) + [onboarding/facility_onboarding.md](onboarding/facility_onboarding.md).
- **تنفيذي / مبيعات**: [demos/one_pager_executive.md](demos/one_pager_executive.md) + [demos/demo_script_ed_stemi.md](demos/demo_script_ed_stemi.md).

---

## 1) Master documents
- [00_Master_Blueprint.md](00_Master_Blueprint.md) — جرد + قالب + 40 مجموعة + روادمابب
- [TEMPLATE_per_department.md](TEMPLATE_per_department.md) — قالب لأي قسم جديد
- [READY_PROMPT_PACK.md](READY_PROMPT_PACK.md) — Meta-prompt + Runtime + Scenario + Data flow
- [GLOSSARY.md](GLOSSARY.md) — معجم AR/EN
- [CHANGELOG.md](CHANGELOG.md) · [CONTRIBUTING.md](CONTRIBUTING.md) · [SECURITY.md](SECURITY.md) · [SUPPORT.md](SUPPORT.md) · [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

---

## 2) المجموعات الـ 40 ([groups/](groups/))
G01 Cardiology · G02 Pulm · G03 GI/Hep · G04 Nephro · G05 Heme-Onc · G06 Endo/DM · G07 Rheum · G08 ID · G09 Derm · G10 GenSurg · G11 CTS/Vasc · G12 NeuroSurg · G13 Ortho · G14 Eye · G15 ENT · G16 Urology · G17 Plastic/Burn · G18 OBGYN · G19 Neonate/Peds · G20 PedSubspec · G21 Radiology · G22 Lab · G23 FuncDx · G24 ED · G25 ICU · G26 Anes/Pain · G27 Rehab · G28 RadOnc/Pharm · G29 Integrative · G30 Nursing · G31 Nutrition · G32 Social · G33 IT/Biomed · G34 Safety · G35 Executive · G36 Quality · G37 Edu/Research · G38 HR · G39 CoE · G40 Rare/Adv

كل ملف يحتوي 23 مخرَج (System Prompt, Workflow, API, Data, Frontend, Tests, BPMN, ERD, Stories, Security, i18n, Seeders, Migrations, Manual, Compliance, إلخ).

---

## 3) Implementation skeletons (كود جاهز للنسخ)

### 3.1 Backend — [backend-skeleton/](backend-skeleton/) (FastAPI cardio-api كامل)
| ملف | غرض |
|------|-----|
| `app/main.py` | FastAPI bootstrap + middleware + routes |
| `app/settings.py` | 12-factor config |
| `app/db/{session,models}.py` | async SQLAlchemy + ORM |
| `app/schemas/cardio.py` | Pydantic |
| `app/security/{auth,middleware}.py` | OIDC RS256 + hash-chained audit |
| `app/services/{repository,risk_calculators}.py` | data + clinical scoring |
| `app/events/publisher.py` | Kafka idempotent producer |
| `app/api/router_*.py` | endpoints |
| `tests/test_*.py` | unit + integration |

### 3.2 Frontend — [frontend-skeleton/](frontend-skeleton/) (React 19 + Vite)
| ملف | غرض |
|------|-----|
| `src/main.tsx`, `App.tsx` | bootstrap + routes |
| `src/lib/{api,i18n}.ts` | axios + i18next + RTL |
| `src/stores/auth.ts` | Zustand persisted |
| `src/hooks/useCardio.ts` | TanStack Query hooks |
| `src/components/{AppShell,PatientHeader,OrderSheet,AINotePad,LangToggle}.tsx` | UI |
| `tailwind.config.ts` | bound to design tokens |

### 3.3 LangGraph orchestrator — [orchestration/langgraph_base.py](orchestration/langgraph_base.py)

---

## 4) البنية التحتية المشتركة
| Folder | Purpose |
|--------|---------|
| [design-system/](design-system/) | Design tokens (W3C-DTCG) |
| [i18n/](i18n/) | Base + per-dept JSON (AR/EN) |
| [openapi/](openapi/) | Components + per-dept YAML + template |
| [orchestration/](orchestration/) | LangGraph base orchestrator |
| [erd/](erd/) | DBML per dept + template |
| [migrations/](migrations/) | SQL migrations per dept |
| [seeders/](seeders/) | Sample data SQL per dept |
| [bpmn/](bpmn/) | BPMN 2.0 XML flows |
| [tests/](tests/) | Test plans per dept |
| [sdk/](sdk/) | Python + TypeScript SDK examples |
| [postman/](postman/) | Postman v2.1 collection |

---

## 5) DevOps & Infra
| Folder | Purpose |
|--------|---------|
| [ci-cd/](ci-cd/) | GitHub Actions pipeline |
| [iac/](iac/) | Terraform (Hetzner + DNS) + Kustomize (k8s overlays) |
| [devops/](devops/) | Helm chart skeleton |
| [dev-tooling/](dev-tooling/) | docker-compose, Makefile, pre-commit, .env.example |
| [observability/](observability/) | Prometheus alerts + SLOs + Grafana JSON |
| [db-ops/](db-ops/) | DB runbook + DR scripts (bash) |
| [perf/](perf/) | k6 load tests |

---

## 6) أمن وامتثال وحوكمة
| Folder | Purpose |
|--------|---------|
| [security/](security/) | STRIDE + ضوابط أمنية |
| [compliance/](compliance/) | PDPL/NCA/CBAHI/JCI/CAP/IAEA/SFDA mapping |
| [risk/](risk/) | Enterprise risk register |
| [ai-governance/](ai-governance/) | Policy + model cards + risk template |
| [policies/](policies/) | Whistleblower, anti-bribery, COI, OSS, sustainability, third-party AI |
| [accessibility/](accessibility/) | WCAG 2.2 AA + RTL guide + testing kit |

---

## 7) قانوني — [legal/](legal/)
- Privacy Policy AR + EN
- Terms of Service (AR + EN)
- DPA template
- 10 Consent forms (AR + EN)
- Patient Bill of Rights (AR + EN)
- Data Retention Policy
- Acceptable Use Policy

---

## 8) تشغيل — [runbooks/](runbooks/)
- Disaster Recovery
- Incident Response
- Ransomware playbook
- PHI Breach playbook
- On-call runbook

---

## 9) محتوى سريري — [clinical/](clinical/)
- Order Sets catalog (STEMI, Sepsis, Stroke, FN, NRP, ARDS، إلخ)
- CDS rules library (دواء/بيدياتر/AF/sepsis/cardio/imaging/pregnancy/stewardship/falls)
- Smart phrases (`.shortcode`-style note templates)

---

## 10) تكاملات KSA — [integrations/](integrations/)
- NPHIES (FHIR R4)
- Wasfaty (e-Rx)
- Mawid + Sehhaty + Yaqeen
- ZATCA Phase 2 e-Invoice
- Shahm + 937 Emergency

---

## 11) جودة — [quality/](quality/)
- KPI Catalog (80+ KPI)
- SLA
- CBAHI Evidence Index

---

## 12) دعم وتعليم
| Folder | Purpose |
|--------|---------|
| [faq/](faq/) | Patient FAQ AR/EN + Clinician FAQ bilingual |
| [onboarding/](onboarding/) | Facility + Clinical + Developer + Admin |
| [demos/](demos/) | Demo scripts + Executive + per-dept one-pagers |

---

## 13) منتجات للمريض/الموبايل
- [patient-portal/spec.md](patient-portal/spec.md) — Web portal product spec
- [mobile/spec.md](mobile/spec.md) — Clinical & Patient mobile apps spec

---

## 14) Architecture
- [architecture/C4_overview.md](architecture/C4_overview.md) — C4 levels 1-4 + SLOs + capacity

---

## 15) إحصائيات (final)
- **40 قسم طبي** كامل (G01–G40)
- **5 ملفات محورية** (Master Blueprint, Template, Prompt Pack, Glossary, Changelog)
- **5 ملفات repo meta** (Contributing, Security, Support, CoC, Changelog)
- **Backend skeleton** (FastAPI كامل، 13 ملف)
- **Frontend skeleton** (React 19 + Vite + TS + Tailwind، 12 ملف)
- **5 BPMN XML flows** + **6 BPMN per dept**
- **6 KSA integration handbooks**
- **10 ملفات runbooks + AI governance**
- **8 ملفات قانونية** كاملة AR/EN
- **6 cross-cutting policies**
- **3 accessibility documents** (WCAG, RTL, testing)
- **5 k6 perf scripts** + README
- **6 DB ops + DR bash scripts**
- **CI/CD pipeline + IaC (Terraform + Kustomize)**
- **Observability** (Prometheus alerts/SLOs + 3 Grafana JSONs)
- **Per-dept artifacts** (OpenAPI + Seeders + Migrations + ERD + i18n + Test plan)

**المجموع: 200+ ملف عمل + ~360 ملف per-dept stub** = **~560 ملف**.

---

## كيف تستخدم
1. اقرأ [00_Master_Blueprint.md](00_Master_Blueprint.md).
2. للتطوير: `cp -r dev-tooling/* /repo-root` ثم `make up`.
3. للنشر: `terraform apply` ← `kubectl apply -k kustomize/overlays/staging`.
4. لإضافة قسم جديد: انسخ template ← اِملأ ← أضف migration + seed + OpenAPI + i18n + test plan.
5. للاعتماد: تابع [quality/cbahi_evidence_index.md](quality/cbahi_evidence_index.md).
6. للحوادث: ابدأ من [runbooks/incident_response.md](runbooks/incident_response.md).
