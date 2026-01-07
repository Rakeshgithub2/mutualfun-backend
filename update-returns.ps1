# Fund Returns Update Script
# Fetches NAV and returns data from MFAPI

Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   FUND RETURNS UPDATE MANAGER         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "Select update mode:" -ForegroundColor Yellow
Write-Host "  1. Quick Test (2 funds - 30 seconds)" -ForegroundColor Green
Write-Host "  2. Small Batch (50 funds - 2-3 minutes)" -ForegroundColor Green
Write-Host "  3. Medium Batch (500 funds - 20-25 minutes)" -ForegroundColor Green
Write-Host "  4. Large Batch (2000 funds - 1-1.5 hours)" -ForegroundColor Yellow
Write-Host "  5. Full Update (ALL 14,200 funds - 4-5 hours)" -ForegroundColor Red
Write-Host ""

$choice = Read-Host "Enter choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host "`n🚀 Running QUICK TEST (2 funds)..." -ForegroundColor Cyan
        node run-update-returns.js 2
    }
    "2" {
        Write-Host "`n🚀 Running SMALL BATCH (50 funds)..." -ForegroundColor Cyan
        node run-update-returns.js 50
    }
    "3" {
        Write-Host "`n🚀 Running MEDIUM BATCH (500 funds)..." -ForegroundColor Cyan
        node run-update-returns.js 500
    }
    "4" {
        Write-Host "`n🚀 Running LARGE BATCH (2000 funds)..." -ForegroundColor Yellow
        Write-Host "⚠️  This will take 1-1.5 hours!" -ForegroundColor Yellow
        $confirm = Read-Host "Continue? (y/n)"
        if ($confirm -eq "y") {
            node run-update-returns.js 2000
        } else {
            Write-Host "❌ Cancelled" -ForegroundColor Red
        }
    }
    "5" {
        Write-Host "`n🚀 Running FULL UPDATE (ALL 14,200 funds)..." -ForegroundColor Red
        Write-Host "⚠️  This will take 4-5 HOURS!" -ForegroundColor Red
        $confirm = Read-Host "Are you SURE? (y/n)"
        if ($confirm -eq "y") {
            node run-update-returns.js
        } else {
            Write-Host "❌ Cancelled" -ForegroundColor Red
        }
    }
    default {
        Write-Host "`n❌ Invalid choice!" -ForegroundColor Red
    }
}

Write-Host "`n✅ Update completed!" -ForegroundColor Green
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
