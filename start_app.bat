@echo off
cd /d "%~dp0"
if exist "build\NamaMedical.exe" (
    echo Launching Nama Medical ERP...
    start "" "build\NamaMedical.exe"
) else (
    echo [ERROR] The application has not been built yet. Please run build.bat first.
    pause
)
