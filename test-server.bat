@echo off
echo Waiting for server to start...
timeout /t 5 /nobreak >nul

echo Testing port 3002...
netstat -ano | findstr :3002
if %errorlevel% equ 0 (
    echo ✅ Port 3002 is LISTENING
    echo.
    echo Testing API endpoints...
    curl -s http://localhost:3002/api/funds?limit=2 > api-test-result.json
    if %errorlevel% equ 0 (
        echo ✅ API is responding
        echo Response saved to api-test-result.json
    ) else (
        echo ❌ API is not responding
    )
) else (
    echo ❌ Port 3002 is NOT listening
)

pause
