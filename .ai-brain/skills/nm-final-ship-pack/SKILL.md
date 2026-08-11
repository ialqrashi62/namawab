---
name: nm-final-ship-pack
description: Token-saver skill for final ship tasks. Use when "ship", "wave 51", "close out", "final stats", "Admin UI", "skill index". Reduces 200-line closeout scripts to 5-line DSL.
---

# nm-final-ship-pack

## Snippet IDs

| ID | Pattern | Tokens Saved |
|---|---|---|
| **SP-SHIP-01** | Final stats display (engines/stations/routers/tests/migs/blueprints) | ~80 → ~10 |
| **SP-SHIP-02** | Syntax verification loop (`node --check` all `.js`) | ~50 → ~5 |
| **SP-SHIP-03** | Skill index generator (counts + cross-links) | ~120 → ~15 |
| **SP-SHIP-04** | CHANGELOG append (Wave N entry) | ~30 → ~5 |
| **SP-SHIP-05** | Admin UI panel factory (1 panel per area) | ~200 → ~20 |
| **SP-SHIP-06** | Memory wave state file (per session) | ~100 → ~10 |

## Snippet SP-SHIP-01 (stats)

```bash
$st=(Get-ChildItem namaweb\public\js\*-station.js).Count
$eng=(Get-ChildItem namaweb\*_engine.js).Count
$rout=(Get-ChildItem namaweb\*_router.js).Count
$test=(Get-ChildItem namaweb\*_test.js).Count
$mig=(Get-ChildItem namaweb\migrations\*.sql).Count
$dept=(Get-ChildItem .ai-brain\02_MODULES -Directory).Count
Write-Host "E:$eng S:$st R:$rout T:$test M:$mig B:$dept"
```

## Snippet SP-SHIP-02 (syntax verify)

```bash
$err=0;foreach($f in (Get-ChildItem namaweb\*_engine.js)){node --check $f.FullName 2>$null;if($LASTEXITCODE -ne 0){$err++}}
Write-Host "Engine errors: $err"
```

## Snippet SP-SHIP-05 (Admin panel)

```js
// AdminPanel.render(area, ctx) — single template
return `<section class="admin-panel" data-area="${area}" dir="${ctx.lang==='ar'?'rtl':'ltr'}">
  <h2>${i18n[area].title}</h2>
  <div class="admin-panel__body">${i18n[area].body}</div>
</section>`;
```

## Use Cases

- After any wave: invoke SP-SHIP-01 + SP-SHIP-02 to verify state
- Pre-deploy: SP-SHIP-03 to confirm skill inventory matches catalog
- Pre-PR: SP-SHIP-04 to append wave entry
- New admin feature: SP-SHIP-05 to scaffold
- Session close: SP-SHIP-06 to write memory

## Out of Scope

- NOT for live deploy (use `nm-hetzner-deploy`)
- NOT for migration (use `nm-erd-migrations`)
- NOT for test generation (use `nm-test-fixture-dsl`)
