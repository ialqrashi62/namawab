#!/usr/bin/env bash
# safety_audit.sh — read-only check of 13 production safety rails (AGENTS.md §2.2)
# Usage: bash ops/safety_audit.sh [--json] [--root /var/www/namaweb]
# Exit:  0 = no red findings, 1 = at least one FAIL, 2 = bad usage
# This script NEVER mutates the database, the filesystem, or the running app.
set -uo pipefail

JSON_MODE=0
ROOT="${NAMAMED_ROOT:-/var/www/namaweb}"
while [ $# -gt 0 ]; do
    case "$1" in
        --json) JSON_MODE=1; shift ;;
        --root) ROOT="$2"; shift 2 ;;
        -h|--help) sed -n '2,5p' "$0"; exit 0 ;;
        *) echo "Unknown arg: $1" >&2; exit 2 ;;
    esac
done

SERVER="$ROOT/server.js"; RBAC="$ROOT/rbac.js"; IDEMP="$ROOT/idempotency.js"
AUDITMW="$ROOT/audit_middleware.js"; CRYPTO="$ROOT/crypto_envelope.js"
PHIVAULT="$ROOT/phi_vault"; BACKUPS="$ROOT/ops/backups"
PASS=0; FAIL=0; WARN=0; JSON_LINES=()

red()    { printf '\033[31m%s\033[0m\n' "$1"; }
green()  { printf '\033[32m%s\033[0m\n' "$1"; }
yellow() { printf '\033[33m%s\033[0m\n' "$1"; }
bold()   { printf '\033[1m%s\033[0m\n'  "$1"; }

record() { # num name status detail
    case "$3" in
        pass) PASS=$((PASS+1)) ;; fail) FAIL=$((FAIL+1)) ;; warn) WARN=$((WARN+1)) ;;
    esac
    if [ "$JSON_MODE" -eq 1 ]; then
        JSON_LINES+=("{\"rail\":$1,\"name\":\"$2\",\"status\":\"$3\",\"detail\":\"$4\"}")
    else
        case "$3" in
            pass) green  "  ✅ Rail $1 — $2: $4" ;;
            warn) yellow "  ⚠️  Rail $1 — $2: $4" ;;
            fail) red    "  ❌ Rail $1 — $2: $4" ;;
        esac
    fi
}

if [ "$JSON_MODE" -eq 0 ]; then
    bold "═══════════════════════════════════════════════════════════════"
    bold "  NamaMedical ERP — Production Safety Audit (13 Rails)"
    bold "  Server: $(hostname)  ·  Root: $ROOT  ·  $(date -u +%Y-%m-%dT%H:%M:%SZ)"
    bold "═══════════════════════════════════════════════════════════════"
fi

# 1 — no hardcoded secrets
h=$(grep -rE "(password|secret|token|api[_-]?key)\s*[:=]\s*['\"][^'\"]{6,}" \
    --include="*.js" --exclude-dir=node_modules --exclude-dir=.git \
    "$ROOT" 2>/dev/null \
    | grep -v -E "(\.env|__CHANGE_ME__|process\.env|// |/\*|require\(|placeholder)" \
    | wc -l | tr -d ' ')
[ "$h" = "0" ] && record 1 no-hardcoded-secrets pass "0 secret literals in tracked JS" \
               || record 1 no-hardcoded-secrets fail "$h suspected secret literal(s)"

# 2 — no PHI in client / fixtures
h=$(grep -rEi "(national[_-]?id|iqama|medical[_-]?record|patient[_-]?name)" \
    --include="*.js" --include="*.json" --exclude-dir=node_modules --exclude-dir=.git \
    "$ROOT/public/js" "$ROOT/fixtures" 2>/dev/null \
    | grep -v -E "(__CHANGE_ME__|sample|example|placeholder|comment)" \
    | wc -l | tr -d ' ')
[ "$h" = "0" ] && record 2 no-phi-in-client pass "no PHI-shaped strings in public/fixtures" \
               || record 2 no-phi-in-client fail "$h PHI-shaped string(s) in client code"

# 3 — no force-push (process control; nothing on disk to prove)
record 3 no-force-push warn "process control — confirm no force-push to main/integration/*/audit/* this deploy"

# 4 — destructive DB ops guarded by backup (proxy: backup count)
bc=0; [ -d "$BACKUPS" ] && bc=$(find "$BACKUPS" -maxdepth 2 -type f \( -name "*.sql" -o -name "*.dump" -o -name "*.tar*" \) 2>/dev/null | wc -l | tr -d ' ')
if [ "$bc" -ge 1 ]; then
    record 4 destructive-ops-guarded pass "$bc backup artifact(s) in ops/backups"
else
    record 4 destructive-ops-guarded warn "no backup artifacts in ops/backups — confirm manually before any DROP/DELETE"
fi

# 5 — tenant isolation: requireTenantScope wired + admin endpoint rejects anon
wired=$(grep -c "requireTenantScope" "$SERVER" 2>/dev/null | tr -d ' ')
code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "http://127.0.0.1:3000/api/admin/users" 2>/dev/null || echo 000)
if [ -f "$SERVER" ] && [ "$wired" -ge 1 ] && { [ "$code" = "401" ] || [ "$code" = "403" ]; }; then
    record 5 tenant-isolation pass "requireTenantScope ×$wired; /api/admin/users anon -> HTTP $code"
elif [ -f "$SERVER" ] && [ "$wired" -ge 1 ]; then
    record 5 tenant-isolation warn "wired (×$wired) but admin probe returned HTTP $code (server may be down)"
else
    record 5 tenant-isolation fail "requireTenantScope not found in server.js"
fi

# 6 — idempotency on money/claim routes
if [ -f "$SERVER" ] && [ -f "$IDEMP" ]; then
    c=$(grep -c "idempotencyGuard" "$SERVER" | tr -d ' ')
    [ "$c" -ge 4 ] && record 6 idempotency pass "idempotencyGuard mounted on $c route(s) (≥4)" \
                   || record 6 idempotency fail "idempotencyGuard only on $c route(s) (≥4 required)"
else
    record 6 idempotency fail "server.js or idempotency.js missing"
fi

# 7 — PHI at rest encrypted
co=0; vo=0; [ -f "$CRYPTO" ] && co=1; [ -d "$PHIVAULT" ] && vo=1
if [ "$co" = "1" ] && [ "$vo" = "1" ]; then
    record 7 phi-at-rest pass "crypto_envelope.js + phi_vault/ both present"
elif [ "$co" = "1" ]; then
    record 7 phi-at-rest warn "crypto_envelope.js present, phi_vault/ missing"
else
    record 7 phi-at-rest fail "crypto_envelope.js missing — PHI at rest unencrypted"
fi

# 8 — CSP report-only header
hdr=""; curl -fsS --max-time 5 -I "http://127.0.0.1:3000/" >/dev/null 2>&1 \
    && hdr=$(curl -sI --max-time 5 "http://127.0.0.1:3000/" 2>/dev/null | grep -ic "content-security-policy-report-only")
{ [ -z "$hdr" ] || [ "$hdr" = "0" ]; } && hdr=$(curl -sI --max-time 5 "https://jumanasoft.com/" 2>/dev/null | grep -ic "content-security-policy-report-only")
if [ "$hdr" = "1" ]; then
    record 8 csp-report-only pass "Content-Security-Policy-Report-Only header present"
else
    record 8 csp-report-only warn "no CSP-Report-Only header (CSP_ENFORCE off — expected default)"
fi

# 9 — money/VAT server-side
if [ -f "$SERVER" ]; then
    m=$(grep -cE "vatFromInclusive|parseMoney" "$SERVER" | tr -d ' ')
    [ "$m" -ge 1 ] && record 9 money-server-side pass "parseMoney/vatFromInclusive used $m× in server.js" \
                   || record 9 money-server-side fail "no server-side money helper in server.js"
else
    record 9 money-server-side fail "server.js missing"
fi

# 10 — audit middleware exists (inert by default)
if [ -f "$AUDITMW" ]; then
    f=$(grep -c "AUDIT_ALL_MUTATIONS" "$AUDITMW" | tr -d ' ')
    [ "$f" -ge 1 ] && record 10 audit-middleware pass "audit_middleware.js + AUDIT_ALL_MUTATIONS env switch" \
                   || record 10 audit-middleware warn "audit_middleware.js present, env switch not found"
else
    record 10 audit-middleware fail "audit_middleware.js missing"
fi

# 11 — fail-closed on missing tenant
if [ -f "$SERVER" ]; then
    g=$(grep -cE "if\s*\(\s*!tenant(Id)?\s*\)" "$SERVER" | tr -d ' ')
    [ "$g" -ge 1 ] && record 11 fail-closed-tenant pass "fail-closed guard $g× in server.js" \
                   || record 11 fail-closed-tenant fail "no fail-closed '!tenantId' guard in server.js"
else
    record 11 fail-closed-tenant fail "server.js missing"
fi

# 12 — no PHI in logs (no console.log of req.body / req.headers in prod code)
if [ -d "$ROOT" ]; then
    l=$(grep -rE "console\.(log|info|debug).*req\.(body|headers)" \
        --include="*.js" --exclude-dir=node_modules --exclude-dir=.git \
        --exclude="*_test.js" --exclude="*.test.js" \
        "$ROOT" 2>/dev/null | wc -l | tr -d ' ')
    [ "$l" = "0" ] && record 12 no-phi-in-logs pass "no console.log of req.body/req.headers in prod code" \
                   || record 12 no-phi-in-logs fail "$l console.log statement(s) leak req.body/req.headers"
else
    record 12 no-phi-in-logs fail "root $ROOT not found"
fi

# 13 — Golden Access (Admin bypass + specialty matrix)
if [ -f "$RBAC" ]; then
    a=$(grep -cE "ADMIN_ROLES|role\s*===\s*['\"]Admin['\"]" "$RBAC" | tr -d ' ')
    m=$(grep -cE "role_permissions|requirePermission" "$RBAC" | tr -d ' ')
    if [ "$a" -ge 1 ] && [ "$m" -ge 1 ]; then
        record 13 golden-access pass "Admin short-circuit + role_permissions matrix present"
    elif [ "$a" -ge 1 ]; then
        record 13 golden-access warn "Admin short-circuit present, specialty matrix not detected"
    else
        record 13 golden-access fail "neither Admin short-circuit nor matrix found in rbac.js"
    fi
else
    record 13 golden-access fail "rbac.js missing"
fi

# Summary
TOTAL=$((PASS+FAIL+WARN))
if [ "$JSON_MODE" -eq 1 ]; then
    printf '{"timestamp":"%s","server":"%s","root":"%s","summary":{"pass":%d,"warn":%d,"fail":%d,"total":%d}}\n' \
        "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$(hostname)" "$ROOT" "$PASS" "$WARN" "$FAIL" "$TOTAL"
    for l in "${JSON_LINES[@]}"; do printf '%s\n' "$l"; done
    [ "$FAIL" -gt 0 ] && exit 1 || exit 0
fi

echo
bold "═══════════════════════════════════════════════════════════════"
bold "  Summary: $PASS pass / $WARN warn / $FAIL fail  (total $TOTAL)"
bold "═══════════════════════════════════════════════════════════════"
if [ "$FAIL" -gt 0 ]; then red    "  → $FAIL rail(s) FAILED — investigate before next deploy"; exit 1
elif [ "$WARN" -gt 0 ]; then yellow "  → No red findings; $WARN warning(s) require human review"; exit 0
else green  "  → All 13 rails PASS"; exit 0; fi
