#!/bin/bash
cd /var/www/namaweb-pcc/tools
echo "===HELP==="
node sample_data_generator.js --help
echo "===HELP_EXIT=$?==="
echo "===SAMPLE_CARDIO==="
node sample_data_generator.js pcc_cardiology_ext102 CardGenExt
echo "===SAMPLE_EXIT=$?==="
echo "===AUDIT_HEAD==="
node /var/www/namaweb/tools/audit_export.js 2>&1 | head -c 500
echo ""
echo "===AUDIT_EXIT=$?==="
echo "===DONE==="
