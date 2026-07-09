@echo off
REM Double-click launcher for the Arkatype Factory Board.
REM Requires Node.js installed (https://nodejs.org) — no other setup, no npm install.
cd /d "%~dp0"
if not exist "board\board.config.json" (
  echo No board\board.config.json found — copying the example.
  echo Edit board\board.config.json afterwards to point vaultPath at this machine's Obsidian vault, if it has one.
  copy "board\board.config.example.json" "board\board.config.json" >nul
)
echo Starting Factory Board...
start "" "http://localhost:8105/board/"
node scripts\board-server.js
pause
