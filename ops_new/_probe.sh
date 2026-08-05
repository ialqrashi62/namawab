#!/usr/bin/env bash
# Tool probe — single shell, no quoting issues
echo "TOOL_PROBE_BEGIN"
for t in curl openssl nginx bash pm2 jq awk grep sed node df free awk date; do
    p=$(command -v "$t" 2>/dev/null)
    if [[ -n "$p" ]]; then
        echo "OK $t -> $p"
    else
        echo "MISSING $t"
    fi
done
echo "BASH_VERSION: $(bash --version | head -1)"
echo "TOOL_PROBE_END"