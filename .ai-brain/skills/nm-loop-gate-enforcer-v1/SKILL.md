---
name: nm-loop-gate-enforcer-v1
description: Enforces 4-loop engineering cycle per phase with strict gates and escalation rules.
---

# nm-loop-gate-enforcer-v1

## Loop Contract
For each phase:
1. Plan
2. Implement
3. Test
4. Verify

If Verify fails, repeat loop until max 4.
At loop 4 fail => escalate and stop phase closure.

## Gate Set
- `QG1`: safety rails unchanged
- `QG2`: tests pass for touched scope
- `QG3`: syntax/lint clean for touched files
- `QG4`: tenant/RLS proof maintained
- `QG5`: audit/logging proof maintained
- `QG6`: docs + changelog + memory updated

## SP-LOOP snippets
- `SP-LOOP-01`: loop status table
- `SP-LOOP-02`: failed gate diagnosis
- `SP-LOOP-03`: fix-plan delta
- `SP-LOOP-04`: escalation note
