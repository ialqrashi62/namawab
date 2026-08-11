# 🔄 LOOP_ENGINEERING_GUIDE_2026 — دليل التكرار الهندسي

> تكرار منظم: Plan → Implement → Test → Verify، مع 4-cap وحد أقصى.

---

## 1. الحلقة الواحدة (Single Loop)

```
┌──────────┐    ┌────────────┐    ┌──────┐    ┌─────────┐
│   PLAN   │ →  │  IMPLEMENT │ →  │ TEST │ →  │ VERIFY  │
│  (≤2k)   │    │   (≤3k)    │    │ (≤2k)│    │  (≤1k)  │
└──────────┘    └────────────┘    └──────┘    └─────────┘
                                                     │
                              ┌──────────────────────┴──┐
                              │                          │
                          PASS ✓                   FAIL ✗
                              │                          │
                          EXIT LOOP              ┌───────────────┐
                                                 │ Counter < 4 ? │
                                                 └───────┬───────┘
                                                   YES   │   NO
                                                    ↓    ↓    ESCALATE
                                                 ┌─────────�  to owner
                                                 │ FIX +   │
                                                 │ RETRY   │
                                                 └─────────┘
```

---

## 2. تفاصيل كل مرحلة

### 2.1 PLAN (≤2k tokens)
- **Input:** file path + target change + dept config
- **Actions:**
  - اقرأ 2-3 files مرجعية (لا أكثر)
  - حدد snippet IDs (S-NN) المطلوبة
  - حدد success criteria (3-5 binary tests)
- **Output:** خطة في 5-10 أسطر

### 2.2 IMPLEMENT (≤3k tokens)
- **Input:** plan + snippet library
- **Actions:**
  - استخدم snippet كقالب
  - أضف dept-specific deltas فقط
  - لا verbose prose
- **Output:** ملف كامل (لا اختصارات)

### 2.3 TEST (≤2k tokens)
- **Input:** ملف منجز + existing test infra
- **Actions:**
  - شغّل tests القائمة (لو موجود)
  - أضف 1 test جديد فقط لو لزم
  - التقط pass/fail
- **Output:** exit code + error excerpt

### 2.4 VERIFY (≤1k tokens)
- **Input:** test results
- **Actions:**
  - تحقق 3-5 success criteria (binary)
  - قرر: PASS / FIX / ESCALATE
- **Output:** verdict

---

## 3. Counter Rules

| Iter | الإجراء | Token Budget |
|---|---|---|
| 1 | First attempt best guess | 8k |
| 2 | Apply 1 specific fix | 6k |
| 3 | Apply 2nd fix + simplify | 5k |
| 4 | Last attempt; if fail → ESCALATE | 4k |
| 5+ | **HARD STOP** — owner signal required | — |

---

## 4. Failure → Fix Recipes (Quick Lookup)

| Failure Symptom | Probable Cause | Fix |
|---|---|---|
| `ECONNREFUSED 5432` | Postgres not running | `pg_ctl start` |
| `Tenant ID required` | Missing `requireTenantScope` | Add middleware in route chain |
| `Row violates row-level security` | Missing RLS policy | Add `ENABLE + FORCE RLS + CREATE POLICY` |
| `Cannot read property of undefined` | Null check missing | Add `if (!x) throw` |
| `XSS detected` | innerHTML on user data | Use `textContent` or `escapeHTML` |
| `CSP violation` | inline script | Move to external file + nonce |
| `JWT expired` | clock skew | Refresh token logic |
| `PHI in logs` | console.log patient | Use redactor middleware |
| `Missing i18n key` | new string added | Add to ar.json + en.json |
| `Migration drift` | up without down | Add symmetric `*_down.sql` |

---

## 5. Parallel Loop Groups

عند معالجة 60 قسم × 35 ملف، نقسّم لـ5 groups متوازية:

```
Group A: engines (60 files)
Group B: migrations (120 files: 60 up + 60 down)
Group C: routes (60 files)
Group D: stations (60 files)
Group E: tests (180 files: unit + integration + bdd)
```

كل group يُشغّل بـ workers = 8 بالتوازي.

---

## 6. Output Aggregation

```yaml
loop_summary:
  total_depts: 60
  total_iterations: 240  # 60 × 4 cap avg
  total_tokens: 1200000
  pass_count: 58
  fail_count: 2  # escalated to owner
  wall_clock_minutes: 480
  avg_per_dept_minutes: 8
```

---

## 7. Integration Points

- **Drives:** `nm-ultimate-blueprint-factory`
- **Constrained by:** `nm-token-saver-pack-v2` (snippet reuse)
- **Verified by:** `nm-dept-discovery` (gap analysis)
- **Run via:** `.ai-brain/03_AUTOPILOT/orchestrator.js`

---

## 8. Stop Conditions

| Condition | Action |
|---|---|
| Counter = 4 + still failing | ESCALATE |
| Safety rail violation | IMMEDIATE STOP |
| Token budget exceeded | TRUNCATE + log |
| Owner signal = STOP | FULL STOP + report |
| File write fail (>3 retries) | SKIP + log to errors.json |
