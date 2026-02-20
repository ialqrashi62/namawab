@echo off
echo [1/4] Setting up MSVC environment...
call "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvarsall.bat" x64 2>nul
if errorlevel 1 (
    for /f "tokens=*" %%i in ('dir /b /s "C:\Program Files\Microsoft Visual Studio\*vcvarsall.bat" 2^>nul') do (
        call "%%i" x64
        goto :found
    )
    for /f "tokens=*" %%i in ('dir /b /s "C:\Program Files (x86)\Microsoft Visual Studio\*vcvarsall.bat" 2^>nul') do (
        call "%%i" x64
        goto :found
    )
)
:found

set CMAKE_PREFIX_PATH=E:\Qt\6.6.3\msvc2019_64

echo [2/4] Configuring with CMake...
cd /d "%~dp0"
if not exist build mkdir build
cd build
cmake .. -G "NMake Makefiles" -DCMAKE_PREFIX_PATH="%CMAKE_PREFIX_PATH%" -DCMAKE_BUILD_TYPE=Release -DCMAKE_EXPORT_COMPILE_COMMANDS=ON
if errorlevel 1 (
    echo [ERROR] CMake configuration failed!
    pause
    exit /b 1
)

echo [3/4] Building...
nmake
if errorlevel 1 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Build completed!
echo.

echo [4/4] Deploying Qt runtime...

:: Core DLLs
copy /Y "E:\Qt\6.6.3\msvc2019_64\bin\Qt6Core.dll" . 2>nul
copy /Y "E:\Qt\6.6.3\msvc2019_64\bin\Qt6Gui.dll" . 2>nul
copy /Y "E:\Qt\6.6.3\msvc2019_64\bin\Qt6Widgets.dll" . 2>nul
copy /Y "E:\Qt\6.6.3\msvc2019_64\bin\Qt6Sql.dll" . 2>nul
copy /Y "E:\Qt\6.6.3\msvc2019_64\bin\Qt6PrintSupport.dll" . 2>nul

:: Platform plugin (REQUIRED for Qt to start)
if not exist platforms mkdir platforms
copy /Y "E:\Qt\6.6.3\msvc2019_64\plugins\platforms\qwindows.dll" platforms\ 2>nul

:: SQL drivers (for SQLite and ODBC)
if not exist sqldrivers mkdir sqldrivers
copy /Y "E:\Qt\6.6.3\msvc2019_64\plugins\sqldrivers\qsqlite.dll" sqldrivers\ 2>nul
copy /Y "E:\Qt\6.6.3\msvc2019_64\plugins\sqldrivers\qsqlodbc.dll" sqldrivers\ 2>nul

echo.
echo [READY] Launching Nama Medical ERP...
start NamaMedical.exe
