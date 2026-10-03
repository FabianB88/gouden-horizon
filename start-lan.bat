@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Install Node.js 22 or newer from https://nodejs.org then run this file again.
  pause
  exit /b 1
)
if not exist node_modules\ws\package.json (
  call npm ci --omit=dev
  if errorlevel 1 (
    echo Dependency installation failed. Check your internet connection.
    pause
    exit /b 1
  )
)
call npm run lan
pause
