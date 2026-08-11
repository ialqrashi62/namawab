#!/bin/bash
set -a
. /etc/default/wave30.env
set +a
PGPASSWORD="$PGPASSWORD" psql -h 127.0.0.1 -U "$PGUSER" -d "$PGDATABASE" \
    -c "SELECT rolname, rolsuper, rolbypassrls FROM pg_roles WHERE rolname IN ('nama_medical_app', 'nama_medical_backup') ORDER BY rolname"