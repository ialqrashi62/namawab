#!/bin/bash
# remote_step.sh - run a single SSH command via git-bash to avoid PowerShell session issues
CMD="$1"
SSH_KEY="/c/Users/ice/.ssh/nama_medical_key"
HOST="root@204.168.144.74"
ssh -i "${SSH_KEY}" "${HOST}" "${CMD}"
