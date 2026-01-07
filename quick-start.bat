@echo off
echo ===================================================================
echo  15,000+ FUNDS SYSTEM - QUICK START
echo ===================================================================
echo.

echo Step 1: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] npm install failed
    pause
    exit /b 1
)
echo [OK] Dependencies installed
echo.

echo Step 2: Running complete setup...
node scripts/master-setup.js
if %errorlevel% neq 0 (
    echo [ERROR] Setup failed
    pause
    exit /b 1
)
echo [OK] Setup completed
echo.

echo ===================================================================
echo  SETUP COMPLETE!
echo ===================================================================
echo.
echo Your system now has 15,000+ funds in MongoDB Atlas
echo.
echo Next steps:
echo   1. Start backend: npm run dev
echo   2. Start frontend: cd "../mutual fund" then npm run dev
echo   3. Visit: http://localhost:5001
echo.
echo ===================================================================
pause
