@echo off
chcp 65001 >nul 2>&1
title Nama Medical ERP Server
color 0B

echo.
echo  🏥 Nama Medical ERP - Starting Server...
echo  🏥 نما الطبي - تشغيل الخادم...
echo.

:: Check if setup was done
if not exist "node_modules" (
    echo  ⚠️  First time? Running setup...
    call setup.bat
)

if not exist ".env" (
    copy ".env.example" ".env" >nul
    echo  ✅ Created .env
)

:: Start server
echo  🚀 Starting server on http://localhost:3000
echo.
node server.js

:: If server exits
echo.
echo  ❌ Server stopped.
pause
