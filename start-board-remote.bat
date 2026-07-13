@echo off
rem ============================================================================
rem start-board-remote.bat - run the factory board + a password-protected
rem Cloudflare quick tunnel so the board is reachable from other machines.
rem
rem   - Requires a "password" in board\board.config.json (refuses to run without
rem     one: the board lists all client slugs and must never be exposed open).
rem   - Downloads cloudflared.exe (official Cloudflare release) on first run.
rem   - The public URL is printed by cloudflared below (https://....trycloudflare.com)
rem     and CHANGES on every restart. Login: username "arkatype" + the password.
rem ============================================================================
cd /d "%~dp0"

rem -- refuse to tunnel without a password configured ---------------------------
findstr /c:"\"password\"" board\board.config.json >nul 2>&1
if errorlevel 1 (
  echo [ERROR] No "password" set in board\board.config.json - refusing to expose the board.
  echo         Add:  "password": "your-strong-password"   and run this again.
  pause
  exit /b 1
)
findstr /r /c:"\"password\"[ ]*:[ ]*\"\"" board\board.config.json >nul 2>&1
if not errorlevel 1 (
  echo [ERROR] "password" in board\board.config.json is EMPTY - refusing to expose the board.
  pause
  exit /b 1
)

rem -- fetch cloudflared once ----------------------------------------------------
set CFD=%~dp0scripts\cloudflared.exe
if not exist "%CFD%" (
  echo Downloading cloudflared (official Cloudflare release, ~60 MB)...
  powershell -NoProfile -Command "Invoke-WebRequest -Uri 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe' -OutFile '%CFD%'"
  if not exist "%CFD%" ( echo [ERROR] cloudflared download failed & pause & exit /b 1 )
)

rem -- start the board server (skips if port already busy) -----------------------
start "factory-board" /min cmd /c "node scripts\board-server.js"
timeout /t 2 /nobreak >nul

rem -- open the tunnel (prints the public https URL; Ctrl+C to stop) -------------
echo.
echo  Look for the https://xxxxx.trycloudflare.com URL below - that is the remote
echo  board address. Username: arkatype   Password: the one in board.config.json
echo.
"%CFD%" tunnel --url http://localhost:8105
