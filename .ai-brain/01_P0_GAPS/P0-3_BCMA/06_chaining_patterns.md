# P0-3 BCMA — Chaining Patterns

## Pattern 1: Sequential Blocking Chain

5-Rights → Allergy → Interaction → High-Alert

Each gate must pass before next gate runs. Any failure blocks the entire chain.

```python
def bcma_chain(input):
    if not five_rights(input): return BLOCK("5_rights_fail")
    if not allergy_check(input): return BLOCK("allergy")
    if not interaction_check(input): return BLOCK("interaction")
    if is_high_alert(input.drug) and not witness_check(input): return BLOCK("witness_required")
    return ADMINISTER(input)
```

## Pattern 2: Parallel Safety Checks

For performance, allergy + interaction run in parallel after 5-Rights passes.

## Pattern 3: Override Workflow

If BLOCK, nurse can request override with reason code. Two nurses must sign for high-alert override.

## Pattern 4: Auto-Witness Selection

For high-alert drugs, system auto-selects available second nurse from same unit.