@echo off
setlocal
cd /d "%~dp0"
echo ===============================================
echo Enterprise Employee Service Desk - Setup
echo ===============================================
node -v
if errorlevel 1 (
  echo Node.js is not installed. Install Node.js 22 LTS x64 first.
  pause
  exit /b 1
)
node -e "const v=process.versions.node.split('.')[0]; if(v!=='22'){console.error('ERROR: This project requires Node.js 22 LTS. Detected '+process.version);process.exit(1)}"
if errorlevel 1 (
  echo Please install Node.js 22 LTS, restart VS Code, and try again.
  pause
  exit /b 1
)
if not exist .env copy .env.example .env
echo Installing dependencies with npm.cmd...
npm.cmd install
if errorlevel 1 (
  echo Installation failed. Check internet access and confirm Node 22 LTS is installed.
  pause
  exit /b 1
)
echo Starting application...
npm.cmd start
pause
