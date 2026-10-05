@echo off
setlocal
cd /d "%~dp0"

echo ============================================
echo StudyQuest - Install Dependencies
echo ============================================

echo.
echo [1/2] Installing Laravel dependencies...
cd backend
call composer install
if errorlevel 1 (
  echo.
  echo Composer install failed. Make sure Composer and PHP are installed.
  pause
  exit /b 1
)

cd ..\frontend
echo.
echo [2/2] Installing Quasar dependencies...
call npm install
if errorlevel 1 (
  echo.
  echo npm install failed. Make sure Node.js and npm are installed.
  pause
  exit /b 1
)

echo.
echo Dependencies installed successfully.
echo Next: import database\studyquest_db.sql in phpMyAdmin.
echo Then run 02_START_BACKEND.bat and 03_START_FRONTEND.bat.
pause
