# WSL bash → Windows .exe gotchas

When a bash script (called via `bash script.sh` from PowerShell) needs to invoke a
Windows binary like `node.exe` from `/mnt/c/...`, two silent failures happen:

1. **Env-var propagation drops**: both `KEY=val node ...` (per-command prefix)
   AND `export KEY=val; node ...` (export) are silently dropped by WSL when
   the target is a Windows .exe. The Windows process sees only a sanitized env.
   `process.env.KEY` ends up `undefined`.
   **Fix:** pass values via `process.argv` (split on a safe delimiter like `|`)
   or pipe via stdin.

2. **Path translation**: `/mnt/c/Users/...` is interpreted by the Windows
   binary as the relative Windows path `C:\mnt\c\Users\...` (which doesn't
   exist). Translate `/mnt/<drive>/<rest>` → `<DRIVE>:/<rest>` (forward slashes
   work for Node.js on Windows).
   **Fix:** detect `*.exe` in `NODE_BIN` and add a `to_win_path()` helper.

3. **Network isolation**: WSL has its own localhost. `127.0.0.1:3100` from WSL
   bash does NOT reach a Windows-bound service on the same port. WSL gateway
   (`172.29.x.1` from `ip route`) typically also doesn't route back. The
   `nameserver 10.255.255.254` from `/etc/resolv.conf` is also unreachable.
   **Fix for scripts:** not script-side — either run the script in
   PowerShell-native, or test the cron on the actual Hetzner box.

References:
- /memories/repo/master_builder_v1_state.md
- /memories/repo/pcc_sandbox_v3_316_*.md (verifying via master_runner)
