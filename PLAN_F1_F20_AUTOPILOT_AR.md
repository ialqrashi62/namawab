# خطة تنفيذ شاملة — المراحل F-1 → F-20 (وضع Auto-Pilot)

> **الهدف:** تنفيذ كل المراحل المتبقية دون العودة للمالك، مع احترام الـ 13
> safety rail، وتسجيل closeout لكل phase.
>
> **القاعدة:** كل مرحلة F-N تحتوي على:
> - PHIL (phase index, hours, label)
> - DELIVERABLES (ملفات/مسارات)
> - SAFETY RAILS (أي ريلز يتم تفعيلها)
> - SMOKE TESTS (عدد الاختبارات المضافة)
> - GATING (ما الذي يوقف التنفيذ)
> - CLOSEOUT (ملف الـ report)

---

## 🗺️ خريطة الـ 20 مرحلة (مرتبة حسب الـ dependency)

```
WAVE A — Foundation (F-1, F-11, F-10)
WAVE B — Internal Surfaces (F-2, F-5, F-6, F-7, F-13, F-15)
WAVE C — Patient/Provider (F-4, F-16, F-17)
WAVE D — Clinical Advanced (F-8, F-9, F-12, F-18, F-19)
WAVE E — External & GTM (F-3, F-14, F-20)
```

---

## WAVE A — Foundation (3 phases)

### F-1: AUTH-DEEP — Auth المتقدم
**Estimated: 4 modes**

| Mode | Deliverable |
|---|---|
| F-1.1 | `lib/auth/PKCE.js` — code_verifier + S256 challenge |
| F-1.2 | `lib/auth/Passkeys.js` — WebAuthn register/assert (sandbox-safe stub) |
| F-1.3 | `middleware/refresh_token.js` — rotation + revocation list |
| F-1.4 | smoke tests: PKCE round-trip, Passkeys assert, refresh rotation |

**Safety rails:** RAIL-1, RAIL-5, RAIL-11
**Smoke adds:** 3 tests (+3) → 45+3 = 48
**Closeout:** `docs/PHASE_F1_AUTHPILOT_DEEP_CLOSEOUT_AR.md`

---

### F-10: PROD-MIGRATE — Production Migrator
**Estimated: 5 modes**

| Mode | Deliverable |
|---|---|
| F-10.1 | `scripts/migrate_prod.js` — blue-green with shadow tables |
| F-10.2 | `scripts/migrate_check.js` — pre-flight against running PG |
| F-10.3 | `scripts/migrate_resume.js` — checkpoint resumability |
| F-10.4 | `lib/MigrationJournal.js` — JSONL audit log of every step |
| F-10.5 | smoke tests: shadow→swap, resume mid-migration, idempotent replay |

**Safety rails:** RAIL-4 (destructive), RAIL-10, RAIL-11
**Smoke adds:** 4 tests → 48+4 = 52
**Closeout:** `docs/PHASE_F10_MIGRATOR_CLOSEOUT_AR.md`

---

### F-11: REALTIME — Real-time Bus
**Estimated: 4 modes**

| Mode | Deliverable |
|---|---|
| F-11.1 | `bus/realtime.js` — WebSocket fan-out with per-tenant topic |
| F-11.2 | `bus/redis_streams.js` — optional Redis backend (in-memory fallback) |
| F-11.3 | `middleware/ws_tenant.js` — RLS-aware topic scoping |
| F-11.4 | smoke tests: per-tenant isolation, fan-out ordering, reconnect |

**Safety rails:** RAIL-5, RAIL-11, RAIL-12
**Smoke adds:** 3 tests → 52+3 = 55
**Closeout:** `docs/PHASE_F11_REALTIME_CLOSEOUT_AR.md`

---

## WAVE B — Internal Surfaces (6 phases)

### F-2: AUDIT-UI — Audit UI + Search
**Depends on:** F-11
**Estimated: 4 modes**

| Mode | Deliverable |
|---|---|
| F-2.1 | `routes/audit_chain_search.js` — paginated chain search |
| F-2.2 | `routes/audit_chain_ws.js` — WebSocket verify stream |
| F-2.3 | `public/audit.html` + `public/js/audit.js` — chain viewer |
| F-2.4 | smoke tests: search paged, verify stream, tamper detection |

**Smoke adds:** 3 tests → 55+3 = 58

---

### F-5: ANALYTICS — Analytics Layer
**Estimated: 5 modes**

| Mode | Deliverable |
|---|---|
| F-5.1 | `lib/analytics/Cube.js` — OLAP cube definition (intake/discharge/RVU) |
| F-5.2 | `lib/analytics/Materializer.js` — run nightly, RLS-aware |
| F-5.3 | `routes/analytics_kpi.js` — KPI endpoints |
| F-5.4 | `routes/analytics_export.js` — CSV/Parquet export |
| F-5.5 | smoke tests: cube rollup, KPI accuracy, RLS-preserving |

**Smoke adds:** 3 tests → 58+3 = 61

---

### F-6: TENANT-ADMIN — Tenant Admin UI
**Depends on:** F-1
**Estimated: 4 modes**

| Mode | Deliverable |
|---|---|
| F-6.1 | `routes/tenant_admin.js` — self-service onboarding endpoints |
| F-6.2 | `routes/tenant_billing.js` — pay-as-you-go meter |
| F-6.3 | `public/tenant_admin.html` + `public/js/tenant_admin.js` |
| F-6.4 | smoke tests: onboarding wizard, RBAC promotion, billing calc |

**Smoke adds:** 3 tests → 61+3 = 64

---

### F-7: PATHWAYS — Clinical Pathways DSL
**Estimated: 5 modes**

| Mode | Deliverable |
|---|---|
| F-7.1 | `lib/pathways/DSL.js` — JSON Schema for paths |
| F-7.2 | `lib/pathways/Compiler.js` — DSL → Engine.js graph |
| F-7.3 | `lib/pathways/Runtime.js` — execute step conditions |
| F-7.4 | `routes/pathways.js` — CRUD + execute |
| F-7.5 | smoke tests: schema validate, compile, run pathway |

**Smoke adds:** 3 tests → 64+3 = 67

---

### F-13: COMPLIANCE-AUTO — Compliance Automation
**Depends on:** F-10
**Estimated: 4 modes**

| Mode | Deliverable |
|---|---|
| F-13.1 | `lib/compliance/nphies_batch.js` — nightly batch check |
| F-13.2 | `lib/compliance/zatca_rotation.js` — XAdES rotation |
| F-13.3 | `lib/compliance/cbahi_self.js` — quarterly assessment |
| F-13.4 | smoke tests: batch dry-run, rotation safe, assessment scoring |

**Smoke adds:** 3 tests → 67+3 = 70

---

### F-15: CREDENTIALING — Provider Credentialing
**Estimated: 4 modes**

| Mode | Deliverable |
|---|---|
| F-15.1 | `lib/credentialing/Verifier.js` — SCFHS/DHA/MOH check |
| F-15.2 | `lib/credentialing/Expiry.js` — auto-alerts + blocker |
| F-15.3 | `routes/credentialing.js` — verify + list |
| F-15.4 | smoke tests: verify flow, expiry alert, blocker behavior |

**Smoke adds:** 3 tests → 70+3 = 73

---

## WAVE C — Patient/Provider (3 phases)

### F-4: MOBILE-NATIVE — Mobile Native
**Depends on:** F-1
**Estimated: 5 modes**

| Mode | Deliverable |
|---|---|
| F-4.1 | `mobile/ReactNative/package.json` — RN scaffold |
| F-4.2 | `mobile/ReactNative/screens/` — 5 core screens |
| F-4.3 | `mobile/ReactNative/queue.js` — offline queue |
| F-4.4 | `mobile/ReactNative/biometric.js` — biometric gate |
| F-4.5 | smoke tests: queue ordering, biometric fallback |

**Smoke adds:** 2 tests → 73+2 = 75

---

### F-16: PATIENT-APP — Patient-facing App
**Depends on:** F-1, F-4
**Estimated: 5 modes**

| Mode | Deliverable |
|---|---|
| F-16.1 | `routes/patient_portal_v2.js` — appointments + telehealth |
| F-16.2 | `routes/patient_records_ro.js` — read-only mirror |
| F-16.3 | `lib/patient/HealthVault.js` — encrypted local store |
| F-16.4 | `mobile/PatientApp/` — separate RN app |
| F-16.5 | smoke tests: portal API, vault encryption, RLS |

**Smoke adds:** 3 tests → 75+3 = 78

---

### F-17: TRIALS — Clinical Trials Module
**Estimated: 5 modes**

| Mode | Deliverable |
|---|---|
| F-17.1 | `lib/trials/eCRF.js` — Case Report Form |
| F-17.2 | `lib/trials/Randomizer.js` — assignment + blinding |
| F-17.3 | `lib/trials/Queries.js` — data queries |
| F-17.4 | `routes/trials.js` — full CRUD |
| F-17.5 | smoke tests: eCRF design, randomization reproducible, audit |

**Smoke adds:** 3 tests → 78+3 = 81

---

## WAVE D — Clinical Advanced (5 phases)

### F-8: DICOM-FULL — Imaging Full Pipeline
**Estimated: 5 modes**

| Mode | Deliverable |
|---|---|
| F-8.1 | `routes/dicomweb/wado.js` — WADO-RS retrieval |
| F-8.2 | `routes/dicomweb/stow.js` — STOW-RS upload |
| F-8.3 | `routes/dicomweb/qido.js` — QIDO-RS search |
| F-8.4 | `lib/dicom/PACSAdapter.js` — Orthanc prod-mode |
| F-8.5 | smoke tests: WADO round-trip, STOW idempotent, search |

**Smoke adds:** 3 tests → 81+3 = 84

---

### F-9: VOICE-SCRIBE — Voice / NLP Scribe
**Estimated: 5 modes**

| Mode | Deliverable |
|---|---|
| F-9.1 | `lib/voice/Transcriber.js` — Whisper-tiny streaming |
| F-9.2 | `lib/voice/Deidentifier.js` — PHI strip pre-LLM |
| F-9.3 | `lib/voice/SOAPBuilder.js` — note structuring |
| F-9.4 | `routes/voice_scribe.js` — upload + transcript |
| F-9.5 | smoke tests: PHI strip, SOAP structure, audit |

**Safety rails:** RAIL-2, RAIL-7, RAIL-12 (heaviest)
**Smoke adds:** 3 tests → 84+3 = 87

---

### F-12: I18N-L2 — Internationalization v2
**Estimated: 4 modes**

| Mode | Deliverable |
|---|---|
| F-12.1 | `lib/i18n/LocaleLoader.js` — en-US/ar-SA/fr-FR/ur-PK |
| F-12.2 | `lib/i18n/ClinicalTranslator.js` — drugs/vitals |
| F-12.3 | `public/js/i18n_grid.js` — RTL-aware grid |
| F-12.4 | smoke tests: locale switch, RTL flip, clinical terms |

**Smoke adds:** 3 tests → 87+3 = 90

---

### F-18: GENOMICS — Genomic Data Module
**Estimated: 4 modes**

| Mode | Deliverable |
|---|---|
| F-18.1 | `lib/genomics/VCF.js` — VCF parser |
| F-18.2 | `lib/genomics/Pharmaco.js` — CPIC integration |
| F-18.3 | `lib/genomics/CoolStore.js` — cold storage tier |
| F-18.4 | smoke tests: parse VCF, CPIC lookup, cold tier |

**Smoke adds:** 3 tests → 90+3 = 93

---

### F-19: NLP-V2 — NLP/RAG v2 (Fine-tuned Arabic LLM)
**Depends on:** F-9
**Estimated: 5 modes**

| Mode | Deliverable |
|---|---|
| F-19.1 | `lib/nlp/ArabicLLM.js` — fine-tuned model adapter |
| F-19.2 | `lib/nlp/KnowledgeGraph.js` — KG enrichment |
| F-19.3 | `lib/nlp/Deidentify.js` — re-ID pre-LLM |
| F-19.4 | `routes/nlp_query.js` — clinical Q&A |
| F-19.5 | smoke tests: query, knowledge graph, PHI strip |

**Smoke adds:** 3 tests → 93+3 = 96

---

## WAVE E — External & GTM (3 phases)

### F-3: DR-MULTI — Multi-region DR
**Depends on:** F-10
**Estimated: 5 modes**

| Mode | Deliverable |
|---|---|
| F-3.1 | `deploy/regions/hetzner-secondary.yml` |
| F-3.2 | `lib/dr/ReplicaSync.js` — WAL streaming |
| F-3.3 | `lib/dr/Failover.js` — DNS-driven |
| F-3.4 | `deploy/dns/failover.js` — Route53 hook |
| F-3.5 | smoke tests: replica lag, failover dry-run |

**Smoke adds:** 3 tests → 96+3 = 99

---

### F-14: API-MARKET — Public API Marketplace
**Depends on:** F-1
**Estimated: 5 modes**

| Mode | Deliverable |
|---|---|
| F-14.1 | `lib/api/DeveloperPortal.js` — OAuth2 issuer |
| F-14.2 | `lib/api/RateLimiter.js` — per-partner limit |
| F-14.3 | `lib/api/WebhookSubs.js` — webhook registry |
| F-14.4 | `routes/developer.js` — full surface |
| F-14.5 | smoke tests: OAuth2 flow, rate limit, webhook deliver |

**Smoke adds:** 3 tests → 99+3 = 102

---

### F-20: GTM — Go-To-Market
**Estimated: 5 modes**

| Mode | Deliverable |
|---|---|
| F-20.1 | `deploy/helm/nama-medical/` — production Helm chart |
| F-20.2 | `marketing/site/` — public landing page |
| F-20.3 | `marketing/funnel.js` — sales funnel |
| F-20.4 | `lib/saas/BillingMeter.js` — usage metering |
| F-20.5 | smoke tests: helm template, funnel, billing |

**Smoke adds:** 3 tests → 102+3 = 105

---

## 📊 الملخص الإجمالي

| Wave | Phases | Modes | Smoke Tests |
|---|---|---|---|
| A | 3 | 13 | +10 |
| B | 6 | 26 | +18 |
| C | 3 | 15 | +8 |
| D | 5 | 23 | +16 |
| E | 3 | 15 | +9 |
| **Total** | **20** | **92** | **+60** → **105/105** |

---

## 🛡️ قواعد الـ Auto-Pilot (يجب احترامها)

1. **كل mode** = ملفات كاملة + smoke tests + closeout.
2. **RAIL-7 الفاسدة** (PHI) في كل اختبار جديد.
3. **RAIL-11 fail-closed** في كل middleware جديد.
4. **RBAC tests** لكل route جديد.
5. **tmp/ scratch** فقط للملفات المؤقتة، لا `.env` mutations.
6. **CHANGELOG.md** تحدّث بعد كل wave.
7. **Cross-tenant test** في أي فصل جديد.
8. **CI** (`smoke.js`) يمر في 100% قبل الانتقال للـ wave التالي.

---

## 🛑 Gating (التوقف والـ Escalation)

| Signal | Action |
|---|---|
| `node scripts/smoke.js` FAIL | Stop. Fix. Re-run. Max 4 retries. |
| RAIL-1 violation detected | STOP. Owner escalate. |
| More than 4 retries in one mode | STOP. Write incident report. |
| Memory pressure / window hang | KILL all terminals, restart clean. |
| Discovered PHI in code | STOP. Redact. Audit. Re-run. |

---

## 📁 Outputs Structure

```
docs/
  PHASE_F1_AUTHPILOT_DEEP_CLOSEOUT_AR.md
  PHASE_F10_MIGRATOR_CLOSEOUT_AR.md
  PHASE_F11_REALTIME_CLOSEOUT_AR.md
  PHASE_F2_AUDIT_UI_CLOSEOUT_AR.md
  PHASE_F5_ANALYTICS_CLOSEOUT_AR.md
  PHASE_F6_TENANT_ADMIN_CLOSEOUT_AR.md
  PHASE_F7_PATHWAYS_CLOSEOUT_AR.md
  PHASE_F13_COMPLIANCE_AUTO_CLOSEOUT_AR.md
  PHASE_F15_CREDENTIALING_CLOSEOUT_AR.md
  PHASE_F4_MOBILE_NATIVE_CLOSEOUT_AR.md
  PHASE_F16_PATIENT_APP_CLOSEOUT_AR.md
  PHASE_F17_TRIALS_CLOSEOUT_AR.md
  PHASE_F8_DICOM_FULL_CLOSEOUT_AR.md
  PHASE_F9_VOICE_SCRIBE_CLOSEOUT_AR.md
  PHASE_F12_I18N_L2_CLOSEOUT_AR.md
  PHASE_F18_GENOMICS_CLOSEOUT_AR.md
  PHASE_F19_NLP_V2_CLOSEOUT_AR.md
  PHASE_F3_DR_MULTI_CLOSEOUT_AR.md
  PHASE_F14_API_MARKET_CLOSEOUT_AR.md
  PHASE_F20_GTM_CLOSEOUT_AR.md
  PHASE_V14_WAVE_A_CLOSEOUT_AR.md
  PHASE_V15_WAVE_B_CLOSEOUT_AR.md
  PHASE_V16_WAVE_C_CLOSEOUT_AR.md
  PHASE_V17_WAVE_D_CLOSEOUT_AR.md
  PHASE_V18_WAVE_E_CLOSEOUT_AR.md
  CHANGELOG.md  (updated each wave)
```

---

## ✅ عند فتح Session جديد

قل في الـ prompt:
> "AUTOPILOT: شغّل PLAN_F1_F20_AUTOPILOT_AR.md — start from WAVE A F-1."

ثم:
1. اقرأ الـ plan
2. افتح todo list
3. ابدأ WAVE A / F-1.1
4. أضف smoke tests
5. شغّل smoke
6. اقفل الـ mode
7. continue للـ mode التالي
8. بعد إكمال wave → اكتب closeout
9. استمر حتى 105/105

---

## 🎯 Acceptance Criteria

- 105/105 smoke PASS
- 20 closeout reports
- 0 RAIL violations
- CHANGELOG محدّث
- لا `.env` mutations
- لا live deploy commands
- لا audit-fork edits
