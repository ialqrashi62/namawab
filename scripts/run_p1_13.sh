#!/bin/bash
set -e
set -a
. /etc/default/wave30.env
set +a
PGPASSWORD="$PGPASSWORD" psql -h 127.0.0.1 -U "$PGUSER" -d "$PGDATABASE" -f /tmp/p1_13_wave39_csp_reports_up.sql
echo "---POST-MIGRATION---"
PGPASSWORD="$PGPASSWORD" psql -h 127.0.0.1 -U "$PGUSER" -d "$PGDATABASE" -c "\d csp_reports"