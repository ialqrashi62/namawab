# NamaMedical — خطة الانتقال (Transition Plan)
## من V37 (idle) → V38 (full build) → Deploy

> **التاريخ:** 2026-08-11
> **الحالة:** جاهز للتنفيذ

---

## 1. الحالة الحالية

تم بناء **الأساس الكامل** (master plan + templates + system modules + orchestration + POC) في هذا الـ batch.

**جاهز للتنفيذ:**
- 51 deliverable لكل قسم (محدد)
- 20+ template قابلة لإعادة الاستخدام
- 7 system modules مكتوبة وجاهزة
- 2 orchestrator (autopilot + multi-agent)
- 1 POC كامل (family-medicine) — pattern validated

---

## 2. خطة التنفيذ المقترحة (3 مراحل)

### المرحلة 1: System Modules to Live (4 ساعات)
**الهدف:** تفعيل كل الـ system modules على production

| # | Task | ETA | Files |
|---|---|---|---|
| 1.1 | Vector store migration | 30m | `pgvector` extension + `documents` + `chunks` tables + HNSW index |
| 1.2 | Prompt registry migration | 15m | `prompts.registry` + `ab_assignments` + `eval_runs` + `render_history` |
| 1.3 | Observability migration | 15m | `audit_log` (hash-chained) + `llm_cost_events` + `api_metrics` |
| 1.4 | AI co-pilot service | 1h | `ai/co-pilot.js` + 4 model adapters + PHI redaction |
| 1.5 | RAG pipeline service | 1h | `rag/ingest.js` + `rag/retrieve.js` + `rag/hybrid.js` |
| 1.6 | LangChain orchestrator | 30m | `core/langchain.js` |
| 1.7 | RBAC middleware | 30m | `middleware/rbac.js` + tests |
| 1.8 | i18n middleware | 30m | `middleware/i18n.js` + 4 locales |

**Deliverable:** كل الـ system modules على production، verified.

---

### المرحلة 2: W06-W14 (108 departments × 51 ملف) (12 ساعة)

**الهدف:** بناء كل الأقسام المتبقية

| Wave | Departments | Files | ETA | Sub-agents |
|---|---|---|---|---|
| W06 | family, geriatric, sports | 153 | 1h | 3 |
| W07 | dental, ophthalmology, ENT | 153 | 1h | 3 |
| W08 | urology, plastic, vascular | 153 | 1h | 3 |
| W09 | thoracic, neurosurg, trauma | 153 | 1h | 3 |
| W10 | anesthesia, pain, palliative | 153 | 1h | 3 |
| W11 | rehab, physio, occ-therapy | 153 | 1h | 3 |
| W12 | nutrition, psych, sleep | 153 | 1h | 3 |
| W13 | genetics, immunol, allergy | 153 | 1h | 3 |
| W14 | remaining 38 depts | 1938 | 6h | 38 (parallel) |

**Sub-agents strategy:**
- 3 depts per sub-agent (V36/V37 token-safe)
- 5 new skills pre-created (medical dept patterns)
- Total tokens: ~600K (with skills)

**Deliverable:** 122/122 depts مكتملة

---

### المرحلة 3: Deploy + Verify (2 ساعة)

| # | Task | ETA |
|---|---|---|
| 3.1 | Full test suite (5K+ tests) | 15m |
| 3.2 | Security scan (OWASP ZAP) | 15m |
| 3.3 | Performance test (k6) | 15m |
| 3.4 | DB migration (108 depts × 2 migrations = 216 SQL files) | 30m |
| 3.5 | Frontend build | 15m |
| 3.6 | Deploy to staging | 15m |
| 3.7 | Smoke test on staging | 15m |
| 3.8 | Deploy to production (blue-green) | 30m |
| 3.9 | Live verification (curl all endpoints) | 15m |
| 3.10 | Notify stakeholders (Slack) | 5m |

**Deliverable:** All 122 depts live on jumanasoft.com, smoke green

---

## 3. Token Budget

| Phase | Tokens | Notes |
|---|---|---|
| Phase 1 (system modules) | 50K | mostly apply templates |
| Phase 2 (108 depts) | 600K | with skills = 75% saving |
| Phase 3 (deploy + verify) | 20K | mostly existing |
| **Total** | **670K** | of 1M available |

**Buffer:** 330K for fixes, polish, edge cases

---

## 4. Risk Mitigation

| Risk | Mitigation |
|---|---|
| Token limit (V36/V37 lesson) | 1 src + 1 test per sub-agent; pre-create skills |
| Sub-agent drift | Strong templates + acceptance criteria in prompt |
| Migration conflicts | 1 schema per dept, no shared tables |
| Frontend layout drift | Use 27_HTML_PAGE_TEMPLATE.html strictly |
| i18n missing keys | Pre-load template per locale, verify 100% parity |
| Build failures | Run `npm run build` after every 3 depts |
| Deploy rollback | Blue-green + auto-rollback script ready |

---

## 5. Acceptance Criteria (End State)

- [ ] **122/122 depts** deployed to production
- [ ] **5,000+ i18n keys** × 4 locales (100% parity)
- [ ] **~5,000 unit tests** passing
- [ ] **~200 integration tests** passing
- [ ] **6/6 quality gates** passing
- [ ] **All endpoints** respond < 200ms p95
- [ ] **Zero secrets** in code
- [ ] **Zero PHI** in logs
- [ ] **Zero tenant leaks** (RLS verified)
- [ ] **Audit log** hash-chained, 7+ year retention
- [ ] **NPHIES integration** complete
- [ ] **ZATCA Phase 2** signing
- [ ] **CBAHI 6 chapters** compliant
- [ ] **PDPL** consent + data export + erasure
- [ ] **Live verification** all green on jumanasoft.com

---

## 6. الـ Decision

الـ autopilot جاهز للبدء. سيناريو "كمل" (continue) يفعّل:

1. **Phase 1** — 4 ساعات
2. **Phase 2** — 12 ساعة
3. **Phase 3** — 2 ساعة
4. **Total: 18 ساعة من التنفيذ المتواصل** (~2 أيام)

أو: تقسيم على دفعات، أو: مراجعة كل wave قبل البدء بالـ wave التالي.

---

## 7. ملخص للـ Owner

| Item | قبل هذا الـ batch | بعد هذا الـ batch |
|---|---|---|
| **الاستعداد** | 60% | 95% |
| **Templates** | 5 | 25+ |
| **System modules** | 0 مكتوب | 7 مكتوبة |
| **POC** | لا | family-medicine كامل |
| **خطة التنفيذ** | 14 wave | 14 wave + 3 phases |
| **Token budget** | unknown | 670K estimated |
| **ETA to live** | unclear | 18 ساعة |

---

## 8. الـ Next Step

أخبرني:
- **"كمل"** → تنفيذ Phase 1 → Phase 2 → Phase 3 تلقائياً
- **"Phase 1 فقط"** → system modules to live
- **"Phase 2 فقط"** → build remaining 108 depts
- **"اعتمد ثم نام"** → commit + push + sleep

---

> **Status:** Ready. Owner decision pending.
