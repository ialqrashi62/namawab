#!/usr/bin/env bash
set -u
export PGOPTIONS="--client-min-messages=warning"
PSQL() { sudo -u postgres psql -d nama_medical_web -tA "$@"; }

echo "=== count ==="
PSQL -c "SELECT count(*) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relkind='r' AND c.relrowsecurity=true AND COALESCE(c.relforcerowsecurity,false)=false;"

echo "=== list ==="
PSQL -c "SELECT c.relname FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relkind='r' AND c.relrowsecurity=true AND COALESCE(c.relforcerowsecurity,false)=false ORDER BY c.relname;"

echo "=== existing policies per table ==="
PSQL -c "SELECT c.relname || '|' || COALESCE(p.policies,0) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace LEFT JOIN (SELECT tablename, count(*) AS policies FROM pg_policies WHERE schemaname='public' GROUP BY tablename) p ON p.tablename=c.relname WHERE n.nspname='public' AND c.relkind='r' AND c.relrowsecurity=true AND COALESCE(c.relforcerowsecurity,false)=false ORDER BY c.relname;"

echo "=== app role check ==="
PSQL -c "SELECT rolname FROM pg_roles WHERE rolname LIKE 'nama%' ORDER BY rolname;"

echo "=== sample current policies (first 25) ==="
PSQL -c "SELECT tablename || '|' || policyname || '|' || cmd || '|' || roles FROM pg_policies WHERE schemaname='public' ORDER BY tablename, policyname LIMIT 25;"
