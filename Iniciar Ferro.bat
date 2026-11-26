@echo off
setlocal
cd /d "%~dp0"
title Ferro
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  Precisas do Node.js instalado. Descarrega em https://nodejs.org
  echo.
  pause
  exit /b 1
)
node serve.cjs
pause
