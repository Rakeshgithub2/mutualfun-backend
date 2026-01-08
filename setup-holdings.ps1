# Holdings Extraction Setup Script for Windows
# Sets up Python environment and runs the complete pipeline

Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host ("=" * 68) -ForegroundColor Cyan
Write-Host "  FUND HOLDINGS EXTRACTION SYSTEM - SETUP" -ForegroundColor Yellow
Write-Host "  MongoDB-based Portfolio Data Pipeline" -ForegroundColor Gray
Write-Host ("=" * 69) -ForegroundColor Cyan

# Check Python installation
Write-Host "`n[1/5] Checking Python installation..." -ForegroundColor Cyan
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ $pythonVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python 3.8+" -ForegroundColor Red
    Write-Host "   Download from: https://www.python.org/downloads/" -ForegroundColor Yellow
    exit 1
}

# Check Java installation (required for tabula-py)
Write-Host "`n[2/5] Checking Java installation..." -ForegroundColor Cyan
try {
    $javaVersion = java -version 2>&1 | Select-Object -First 1
    Write-Host "✅ Java found: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Java not found - Required for PDF parsing" -ForegroundColor Yellow
    Write-Host "   Download from: https://www.java.com/download/" -ForegroundColor Yellow
    Write-Host "   The script will continue, but PDF parsing may fail without Java" -ForegroundColor Yellow
    $continue = Read-Host "`n   Continue anyway? (y/n)"
    if ($continue -ne 'y') {
        exit 1
    }
}

# Navigate to holdings-extraction directory
Write-Host "`n[3/5] Setting up environment..." -ForegroundColor Cyan
Set-Location "holdings-extraction"

# Create virtual environment
if (-not (Test-Path "venv")) {
    Write-Host "   Creating Python virtual environment..." -ForegroundColor Gray
    python -m venv venv
    Write-Host "✅ Virtual environment created" -ForegroundColor Green
} else {
    Write-Host "✅ Virtual environment already exists" -ForegroundColor Green
}

# Activate virtual environment
Write-Host "   Activating virtual environment..." -ForegroundColor Gray
& ".\venv\Scripts\Activate.ps1"

# Install dependencies
Write-Host "`n[4/5] Installing Python dependencies..." -ForegroundColor Cyan
Write-Host "   This may take a few minutes..." -ForegroundColor Gray
pip install -r requirements.txt --quiet

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ All dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Check MongoDB connection
Write-Host "`n[5/5] Checking MongoDB connection..." -ForegroundColor Cyan
$mongoUri = $env:MONGODB_URI
if (-not $mongoUri) {
    $mongoUri = "mongodb://localhost:27017/mutual-funds"
    Write-Host "   Using default: $mongoUri" -ForegroundColor Gray
}

try {
    python -c "from pymongo import MongoClient; client = MongoClient('$mongoUri', serverSelectionTimeoutMS=5000); client.server_info(); print('✅ MongoDB connected')"
} catch {
    Write-Host "⚠️  MongoDB connection test failed" -ForegroundColor Yellow
    Write-Host "   Make sure MongoDB is running: mongod" -ForegroundColor Yellow
}

# Setup complete
Write-Host "`n" -NoNewline
Write-Host ("=" * 69) -ForegroundColor Cyan
Write-Host "✅ SETUP COMPLETE!" -ForegroundColor Green
Write-Host ("=" * 69) -ForegroundColor Cyan

Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Make sure MongoDB is running" -ForegroundColor White
Write-Host "   2. Run the complete pipeline:" -ForegroundColor White
Write-Host "      python run_pipeline.py" -ForegroundColor Cyan
Write-Host "`n   Or run individual steps:" -ForegroundColor White
Write-Host "      python scrape_amfi_pdfs.py    # Download PDFs" -ForegroundColor Gray
Write-Host "      python parse_holdings.py      # Extract data" -ForegroundColor Gray
Write-Host "      python import_to_mongodb.py   # Import to DB" -ForegroundColor Gray
Write-Host "      python classify_sectors.py    # Classify sectors" -ForegroundColor Gray

Write-Host "`n📡 API Endpoints (after import):" -ForegroundColor Yellow
Write-Host "   GET /api/holdings/:schemeCode" -ForegroundColor Cyan
Write-Host "   GET /api/holdings/:schemeCode/top" -ForegroundColor Cyan
Write-Host "   GET /api/holdings/:schemeCode/sectors" -ForegroundColor Cyan
Write-Host "   POST /api/holdings/compare" -ForegroundColor Cyan
Write-Host "   GET /api/holdings/stats" -ForegroundColor Cyan

Write-Host "`n💡 Tip: Activate virtual environment in new terminals with:" -ForegroundColor Yellow
Write-Host "   cd holdings-extraction" -ForegroundColor Gray
Write-Host "   .\venv\Scripts\Activate.ps1" -ForegroundColor Gray

Write-Host "`n"
