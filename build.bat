@echo off
echo [1/4] Setting up MinGW environment...

set CMAKE_PREFIX_PATH=C:\Qt\6.8.0\mingw_64
set PATH=C:\Qt\Tools\mingw1310_64\bin;C:\Qt\6.8.0\mingw_64\bin;%PATH%

echo [2/4] Configuring with CMake...
cd /d "%~dp0"
if not exist build mkdir build
cd build
cmake .. -G "MinGW Makefiles" -DCMAKE_PREFIX_PATH="%CMAKE_PREFIX_PATH%" -DCMAKE_BUILD_TYPE=Release -DCMAKE_EXPORT_COMPILE_COMMANDS=ON
if errorlevel 1 (
    echo [ERROR] CMake configuration failed!
    pause
    exit /b 1
)

echo [3/4] Building...
mingw32-make -j%NUMBER_OF_PROCESSORS%
if errorlevel 1 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Build completed!
echo.

echo [4/4] Deploying Qt runtime...

:: Copy config
copy /Y "%~dp0config.ini" . 2>nul

:: Core DLLs
copy /Y "C:\Qt\6.8.0\mingw_64\bin\Qt6Core.dll" . 2>nul
copy /Y "C:\Qt\6.8.0\mingw_64\bin\Qt6Gui.dll" . 2>nul
copy /Y "C:\Qt\6.8.0\mingw_64\bin\Qt6Widgets.dll" . 2>nul
copy /Y "C:\Qt\6.8.0\mingw_64\bin\Qt6Sql.dll" . 2>nul
copy /Y "C:\Qt\6.8.0\mingw_64\bin\Qt6PrintSupport.dll" . 2>nul

:: MinGW runtime DLLs
copy /Y "C:\Qt\Tools\mingw1310_64\bin\libgcc_s_seh-1.dll" . 2>nul
copy /Y "C:\Qt\Tools\mingw1310_64\bin\libstdc++-6.dll" . 2>nul
copy /Y "C:\Qt\Tools\mingw1310_64\bin\libwinpthread-1.dll" . 2>nul

:: Platform plugin (REQUIRED for Qt to start)
if not exist platforms mkdir platforms
copy /Y "C:\Qt\6.8.0\mingw_64\plugins\platforms\qwindows.dll" platforms\ 2>nul

:: SQL drivers (for SQLite and ODBC)
if not exist sqldrivers mkdir sqldrivers
copy /Y "C:\Qt\6.8.0\mingw_64\plugins\sqldrivers\qsqlite.dll" sqldrivers\ 2>nul
copy /Y "C:\Qt\6.8.0\mingw_64\plugins\sqldrivers\qsqlodbc.dll" sqldrivers\ 2>nul

echo.
echo [READY] Launching Nama Medical ERP...
start NamaMedical.exe
