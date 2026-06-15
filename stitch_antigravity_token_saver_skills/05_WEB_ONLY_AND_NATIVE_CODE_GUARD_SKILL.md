# Skill: Web-Only and Native Code Safety Guard

This Stitch design task is frontend/web UI only.

Do not delete or modify:
- EXE/Desktop files
- Electron/Tauri files
- C++ files
- Native addons
- Printer/POS hardware integrations
- Barcode device integrations
- ZATCA/e-invoice native helpers
- installer scripts
- database/migrations
- Prisma schema unless absolutely required by existing code and documented

Native files that require separate review:
- `*.cpp`
- `*.h`
- `*.hpp`
- `binding.gyp`
- `CMakeLists.txt`
- `*.sln`
- `*.vcxproj`
- `native/`
- `cpp/`
- `addon/`

For this UI task:
- Keep them unchanged.
- Mention them only if they block build.
- If they block build, document the issue and create a separate review report instead of deleting.

Reason:
Desktop/EXE cleanup is a separate task. UI migration must not silently remove hardware or native integrations.
