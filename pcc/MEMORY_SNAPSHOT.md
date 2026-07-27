# MEMORY_SNAPSHOT — Final P3-P State (v0.8.0)

This is the **post-P3-P snapshot** of the PCC sandbox. Final.

---

## 1. PCC sandbox layout (canonical — final)

```
pcc/                          # SANDBOX (this is the only place code lives)
├── server.js                 # v0.8.0, 15 modules wired
├── package.json
├── db.js
├── routes/cath_lab.js
├── engines/cath_lab_specialized_engine.js
├── tests/cath_lab_test.js
├── tests/integration_test.js
├── cath_lab/                 # 57 tests (40 unit + 17 integration)
├── ccu/                      # 66 tests (49 + 17)
├── nnicu/                    # 72 tests (55 + 17)
├── bicu/                     # 60 tests (43 + 17)
├── picu/                     # 38 tests (21 + 17)
├── sicu/                     # 34 tests (17 + 17)
├── ticu/                     # 36 tests (19 + 17)
├── micu/                     # 33 tests (16 + 17)
├── honc/                     # 41 tests (24 + 17)         P3-N
├── cticu/                    # 40 tests (23 + 17)         P3-N
├── nicu/                     # 41 tests (24 + 17)         P3-N
├── or/                       # 41 tests (24 + 17)         P3-O
├── ed/                       # 39 tests (22 + 17)         P3-O
├── obgyn/                    # 38 tests (21 + 17)         P3-O
├── copilot/                  # 28 tests (mock LLM)
├── SHIP_P3L.md
├── SHIP_P3N.md
├── SHIP_P3O.md
├── SHIP_FINAL.md
├── SHIP_ULTIMATE.md
├── SHIP_ABSOLUTE.md          # ← MASTER closeout
├── MEMORY_SNAPSHOT.md
├── HANDOFF.md
└── README.md
```

---

## 2. Live tests (664 / 664) — 100% pass

| Module | Unit | Integration | Total |
|---|---|---|---|
| cath_lab | 40 | 17 | 57 |
| ccu | 49 | 17 | 66 |
| nnicu | 55 | 17 | 72 |
| bicu | 43 | 17 | 60 |
| picu | 21 | 17 | 38 |
| sicu | 17 | 17 | 34 |
| ticu | 19 | 17 | 36 |
| micu | 16 | 17 | 33 |
| honc | 24 | 17 | 41 |
| cticu | 23 | 17 | 40 |
| nicu | 24 | 17 | 41 |
| or | 24 | 17 | 41 |
| ed | 22 | 17 | 39 |
| obgyn | 21 | 17 | 38 |
| copilot | 28 | 0 | 28 |
| **TOTAL** | **426** | **238** | **664** |

All passing as of 2026-07-24.

---

## 3. Server commands

### Start
```bash
cd pcc
node server.js   # listens on PORT (default 3100)
```

### Verify
```bash
curl http://localhost:3100/health
# {"status":"ok","service":"pcc-sandbox","version":"0.8.0", ... 15 modules}
```

### Stop
```bash
Get-Process -Name node | Stop-Process -Force   # Windows PowerShell
```

---

## 4. The 13 safety rails (canonical)

1. No hardcoded secrets
2. No PHI
3. No force-push
4. No DROP without backup
5. Tenant isolation (RLS + FORCE RLS)
6. Money routes idempotent
7. PHI at rest encrypted
8. CSP report-only
9. Money/VAT server-side
10. Audit hash-chained (SHA-256)
11. Fail-closed tenant
12. No secret/PHI in logs
13. Golden Access Rule

---

## 5. The 6 L4 validation gates (canonical)

| Gate | Description |
|---|---|
| L4-1 | No red flags (no `DROP`, no truncation, no eval) |
| L4-2 | Drug safety (no contraindicated combos) |
| L4-3 | PHI encrypted (sandbox: N/A) |
| L4-4 | Auth on every endpoint |
| L4-5 | Compliance mapped (CBAHI, PDPL, NPHIES, ZATCA, SFDA) |
| L4-6 | Tests present |

---

## 6. PowerShell escape fix (lesson learned — archived)

The temp scripts (`fix_icu_*.py`, `gen_p3*.py`, `test_runner.py`) are
archived at `c:\Users\ice\Desktop\NMEDCALVSCODE\scratch\p3_temp_scripts\`.

When generating JS files via PowerShell here-strings, the following
escape sequences get written **literally** to the file and break Node.js:

| Sequence | Should be | Fix |
|---|---|---|
| `\n` | newline | `\\n` in here-string |
| `\t` | tab | `\\t` in here-string |
| `\)` | `)` | `\\)` |
| `\:` | `:` | `\\:` |
| `\${name}` | `${name}` | `\\\${name}` |
| `\` `<var>` | `<var>` | regex `\\ (\w+)` |
| `\u2713` | `✓` | literal `✓` in here-string |
| `\u2717` | `✗` | literal `✗` in here-string |
| `: any` | (TypeScript) | omit `: any` (Node.js doesn't support it) |

**Mitigation**: prefer `create_file` tool with explicit content over
PowerShell here-strings for any JS file. The PowerShell here-string
escape handling is fragile and produces the table above.

---

## 7. Outstanding questions for owner

1. Real PostgreSQL DSN for production wiring?
2. Real JWT signing key + JWKS endpoint?
3. Real LLM (Azure OpenAI, Bedrock, or local)?
4. Owner sign-off to begin Phase 4 (Tier-2 real wiring)?
5. Per-ICU specialty-based access (Golden Access Rule #13) — what does the role-permission matrix look like?

---

## 8. Sign-off

**P3 ABSOLUTE SHIP ✅** — 15 modules, 157 functions, 664 tests, 13 rails, 6 gates, 0 `namaweb/` touches, 0 live-DB touches, 0 PHI.

**Ready for Phase 4 owner authorization.**
