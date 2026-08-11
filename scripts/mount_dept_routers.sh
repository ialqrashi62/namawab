#!/bin/bash
# Patch server.js on live to mount 14 new department routers
# - Backs up server.js first
# - Inserts mount block after line 21159 (the /api/v4/dept mount)
# - Each mount wrapped in try/catch (rail: blast-radius safety)
set -e
cd /var/www/namaweb

TS=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="/var/backups/server.js.before-mount-depts.$TS"
cp server.js "$BACKUP_PATH"
echo "[backup] saved: $BACKUP_PATH"

# Use python (always available on Ubuntu) for surgical text insertion.
python3 - <<'PYEOF'
import os
src_path = "server.js"
with open(src_path, "r", encoding="utf-8") as f:
    src = f.read()

anchor = "  app.use('/api/v4/dept', require('./routes/dept_router'));\n"
if anchor not in src:
    print("[error] anchor line not found in server.js")
    raise SystemExit(1)

mount_block = anchor + """
// ===== AUTO-MOUNT: 14 dept score routers (deploy v5, 2026-08-10) =====
try { app.use('/api/cardiology',   require('./cardiology_router'));   } catch(e){ console.warn('[mount] cardiology', e.message); }
try { app.use('/api/oncology',     require('./oncology_router'));     } catch(e){ console.warn('[mount] oncology', e.message); }
try { app.use('/api/pediatrics',   require('./pediatrics_router'));   } catch(e){ console.warn('[mount] pediatrics', e.message); }
try { app.use('/api/surgery',      require('./surgery_router'));      } catch(e){ console.warn('[mount] surgery', e.message); }
try { app.use('/api/pharmacy',     require('./pharmacy_router'));     } catch(e){ console.warn('[mount] pharmacy', e.message); }
try { app.use('/api/emergency',    require('./emergency_router'));    } catch(e){ console.warn('[mount] emergency', e.message); }
try { app.use('/api/endocrine',    require('./endocrine_router'));    } catch(e){ console.warn('[mount] endocrine', e.message); }
try { app.use('/api/pulmonology',  require('./pulmonology_router'));  } catch(e){ console.warn('[mount] pulmonology', e.message); }
try { app.use('/api/gi',           require('./gi_router'));           } catch(e){ console.warn('[mount] gi', e.message); }
try { app.use('/api/rheumatology', require('./rheumatology_router')); } catch(e){ console.warn('[mount] rheumatology', e.message); }
try { app.use('/api/orthopedics',  require('./orthopedics_router'));  } catch(e){ console.warn('[mount] orthopedics', e.message); }
try { app.use('/api/neurology',    require('./neurology_router'));    } catch(e){ console.warn('[mount] neurology', e.message); }
try { app.use('/api/nephrology',   require('./nephrology_router'));   } catch(e){ console.warn('[mount] nephrology', e.message); }
try { app.use('/api/obgyn',        require('./obgyn_router'));        } catch(e){ console.warn('[mount] obgyn', e.message); }
// ===== END AUTO-MOUNT =====
"""

new_src = src.replace(anchor, mount_block, 1)
if new_src == src:
    print("[error] replacement had no effect")
    raise SystemExit(1)

with open(src_path, "w", encoding="utf-8") as f:
    f.write(new_src)

# Report
new_count = new_src.count("'./cardiology_router'") + new_src.count("'./oncology_router'")
print(f"[patch] server.js updated, 14 mount lines inserted (count sanity: {new_count})")
PYEOF

echo "[verify] new mount lines:"
grep -nE "cardiology_router|oncology_router|pediatrics_router|surgery_router|pharmacy_router|emergency_router|endocrine_router|pulmonology_router|gi_router|rheumatology_router|orthopedics_router|neurology_router|nephrology_router|obgyn_router" server.js | grep "app.use" | head -20
