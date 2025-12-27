@echo off
echo ========================================
echo   GOOGLE OAUTH SETUP - QUICK START
echo ========================================
echo.

echo Step 1: Checking if backend is running...
curl -s http://localhost:3002/api/health >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Backend is not running!
    echo.
    echo Please start the backend first:
    echo   npm run dev
    echo.
    pause
    exit /b 1
)
echo [OK] Backend is running!
echo.

echo Step 2: Testing Google OAuth endpoint...
node test-oauth-setup.js
echo.

echo ========================================
echo   NEXT STEPS
echo ========================================
echo.
echo 1. Open: https://console.cloud.google.com/apis/credentials
echo.
echo 2. Add this redirect URI:
echo    http://localhost:3002/api/auth/google/callback
echo.
echo 3. Save changes in Google Console
echo.
echo 4. Test the complete flow:
echo    Start your frontend and click "Login with Google"
echo.
echo ========================================
echo.
pause
