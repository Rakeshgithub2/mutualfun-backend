@echo off
echo ========================================================
echo  MUTUAL FUND SYSTEM - 15,000+ Funds Setup
echo ========================================================
echo.

echo Step 1: Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo Step 2: Running master setup...
node scripts\master-setup.js
if errorlevel 1 (
    echo ERROR: Master setup failed
    pause
    exit /b 1
)

echo.
echo ========================================================
echo  SETUP COMPLETE!
echo ========================================================
echo.
echo Your database now contains 15,000+ mutual funds with:
echo   - Proper categorization (equity, debt, commodity)
echo   - Automated updates configured
echo   - MongoDB indexes optimized
echo.
echo Next Steps:
echo   1. Start backend: npm run dev
echo   2. Start frontend: cd "..\mutual fund" ^&^& npm run dev
echo   3. Check verification: npm run verify:15k
echo.
echo Automatic Updates:
echo   - NAV: Every hour
echo   - Returns: Daily at 6 PM IST
echo   - Holdings: Quarterly
echo   - Fund Managers: Semi-annually
echo   - Market Indices: Every 5 minutes (trading hours)
echo.
pause
