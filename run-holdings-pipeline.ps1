# Quick Start - Run Holdings Pipeline
# Activates virtual environment and runs the complete pipeline

Write-Host "`n🚀 Starting Holdings Extraction Pipeline..." -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Gray

# Navigate to holdings directory
Set-Location "holdings-extraction"

# Check if virtual environment exists
if (-not (Test-Path "venv")) {
    Write-Host "❌ Virtual environment not found!" -ForegroundColor Red
    Write-Host "   Run setup first: .\setup-holdings.ps1" -ForegroundColor Yellow
    exit 1
}

# Activate virtual environment
& ".\venv\Scripts\Activate.ps1"

# Check MongoDB
Write-Host "`n🔍 Checking MongoDB connection..." -ForegroundColor Cyan
try {
    python -c "from pymongo import MongoClient; MongoClient('mongodb://localhost:27017', serverSelectionTimeoutMS=2000).server_info()"
    Write-Host "✅ MongoDB is running" -ForegroundColor Green
} catch {
    Write-Host "❌ MongoDB is not running!" -ForegroundColor Red
    Write-Host "   Start MongoDB first, then run this script again" -ForegroundColor Yellow
    exit 1
}

# Run pipeline
Write-Host "`n🏃 Running complete pipeline...`n" -ForegroundColor Cyan
python run_pipeline.py

Write-Host "`n✅ Pipeline execution complete!" -ForegroundColor Green
Write-Host "`n📡 Holdings API is now ready at: http://localhost:3002/api/holdings" -ForegroundColor Cyan
