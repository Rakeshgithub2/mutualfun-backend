# Test script for Compare & Overlap APIs

$baseUrl = "http://localhost:3002/api"

Write-Host "🧪 Testing Compare & Overlap APIs" -ForegroundColor Cyan
Write-Host "===================================`n" -ForegroundColor Cyan

# First, get some fund IDs to test with
Write-Host "📋 Step 1: Getting fund IDs for testing..." -ForegroundColor Yellow
try {
    $fundsResponse = Invoke-RestMethod -Uri "$baseUrl/funds?limit=5" -Method Get
    $fundIds = $fundsResponse.data | Select-Object -First 3 | ForEach-Object { $_.id }
    
    if ($fundIds.Count -lt 2) {
        Write-Host "❌ Error: Need at least 2 funds in database. Run import:all first." -ForegroundColor Red
        Write-Host "   Command: npm run import:all`n" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "✅ Found $($fundIds.Count) funds for testing:" -ForegroundColor Green
    $fundsResponse.data | Select-Object -First 3 | ForEach-Object {
        Write-Host "   - $($_.name) (ID: $($_.id))" -ForegroundColor White
    }
    Write-Host ""
} catch {
    Write-Host "❌ Error fetching funds: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Make sure backend is running: npm run dev`n" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n---`n"

# Test 1: POST /compare
Write-Host "📊 Test 1: POST /compare" -ForegroundColor Yellow
Write-Host "Testing fund comparison with detailed analysis...`n"

try {
    $compareBody = @{
        fundIds = $fundIds
    } | ConvertTo-Json
    
    Write-Host "  Request body:"
    Write-Host "  $compareBody`n" -ForegroundColor Gray
    
    $compareResponse = Invoke-RestMethod -Uri "$baseUrl/compare" `
        -Method Post `
        -Body $compareBody `
        -ContentType "application/json"
    
    Write-Host "  ✅ Status: Success" -ForegroundColor Green
    Write-Host "  📊 Results:" -ForegroundColor Cyan
    Write-Host "     Funds compared: $($compareResponse.data.funds.Count)" -ForegroundColor White
    Write-Host "     Pairwise comparisons: $($compareResponse.data.pairwiseComparisons.Count)" -ForegroundColor White
    Write-Host "     Common holdings: $($compareResponse.data.overallMetrics.totalCommonHoldings)" -ForegroundColor White
    Write-Host "     Avg Jaccard similarity: $($compareResponse.data.overallMetrics.avgJaccardSimilarity)%" -ForegroundColor White
    Write-Host "     Avg weighted overlap: $($compareResponse.data.overallMetrics.avgWeightedOverlap)%" -ForegroundColor White
    Write-Host "     Avg return correlation: $($compareResponse.data.overallMetrics.avgReturnCorrelation)" -ForegroundColor White
    
    Write-Host "`n  🔍 Insights:" -ForegroundColor Cyan
    Write-Host "     Most similar: $($compareResponse.data.insights.mostSimilarPair.fund1.name) ↔ $($compareResponse.data.insights.mostSimilarPair.fund2.name)" -ForegroundColor White
    Write-Host "     Similarity score: $($compareResponse.data.insights.mostSimilarPair.similarity)%" -ForegroundColor White
    Write-Host "     Highest correlation: $($compareResponse.data.insights.highestCorrelation.returnCorrelation)" -ForegroundColor White
    
    if ($compareResponse.data.commonHoldings.Count -gt 0) {
        Write-Host "`n  📈 Top 5 Common Holdings:" -ForegroundColor Cyan
        $compareResponse.data.commonHoldings | Select-Object -First 5 | ForEach-Object {
            Write-Host "     - $($_.name) (Avg: $($_.avgPercentage)%)" -ForegroundColor White
        }
    }
    
    if ($compareResponse.data.sectorOverlap.Count -gt 0) {
        Write-Host "`n  🏢 Top 5 Sectors:" -ForegroundColor Cyan
        $compareResponse.data.sectorOverlap | Select-Object -First 5 | ForEach-Object {
            Write-Host "     - $($_.sector) (Avg: $($_.avgPercentage)%)" -ForegroundColor White
        }
    }
    
    Write-Host ""
} catch {
    Write-Host "  ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host "  Details: $($_.ErrorDetails)" -ForegroundColor Red
    }
}

Write-Host "`n---`n"

# Test 2: POST /overlap
Write-Host "📊 Test 2: POST /overlap" -ForegroundColor Yellow
Write-Host "Testing holdings overlap analysis...`n"

try {
    $overlapBody = @{
        fundIds = $fundIds
    } | ConvertTo-Json
    
    Write-Host "  Request body:"
    Write-Host "  $overlapBody`n" -ForegroundColor Gray
    
    $overlapResponse = Invoke-RestMethod -Uri "$baseUrl/overlap" `
        -Method Post `
        -Body $overlapBody `
        -ContentType "application/json"
    
    Write-Host "  ✅ Status: Success" -ForegroundColor Green
    Write-Host "  📊 Results:" -ForegroundColor Cyan
    Write-Host "     Funds analyzed: $($overlapResponse.data.funds.Count)" -ForegroundColor White
    Write-Host "     Pairwise overlaps: $($overlapResponse.data.pairwiseOverlaps.Count)" -ForegroundColor White
    Write-Host "     Total common holdings: $($overlapResponse.data.overallMetrics.totalCommonHoldings)" -ForegroundColor White
    Write-Host "     Avg Jaccard similarity: $($overlapResponse.data.overallMetrics.avgJaccardSimilarity)%" -ForegroundColor White
    Write-Host "     Avg weighted overlap: $($overlapResponse.data.overallMetrics.avgWeightedOverlap)%" -ForegroundColor White
    Write-Host "     Max overlap: $($overlapResponse.data.overallMetrics.maxOverlap)%" -ForegroundColor White
    Write-Host "     Min overlap: $($overlapResponse.data.overallMetrics.minOverlap)%" -ForegroundColor White
    
    Write-Host "`n  🔍 Insights:" -ForegroundColor Cyan
    Write-Host "     Most overlapping: $($overlapResponse.data.insights.mostOverlappingPair.fund1.name) ↔ $($overlapResponse.data.insights.mostOverlappingPair.fund2.name)" -ForegroundColor White
    Write-Host "     Overlap: $($overlapResponse.data.insights.mostOverlappingPair.weightedOverlap)%" -ForegroundColor White
    Write-Host "     Most diverse: $($overlapResponse.data.insights.mostDiverseFund.fundName)" -ForegroundColor White
    Write-Host "     Unique holdings: $($overlapResponse.data.insights.mostDiverseFund.uniquePercentage)%" -ForegroundColor White
    
    Write-Host "`n  🎯 Unique Holdings per Fund:" -ForegroundColor Cyan
    $overlapResponse.data.uniqueHoldings | ForEach-Object {
        Write-Host "     - $($_.fundName): $($_.uniqueCount) unique ($($_.uniquePercentage)%)" -ForegroundColor White
    }
    
    if ($overlapResponse.data.commonHoldings.Count -gt 0) {
        Write-Host "`n  📈 Top 5 Common Holdings:" -ForegroundColor Cyan
        $overlapResponse.data.commonHoldings | Select-Object -First 5 | ForEach-Object {
            Write-Host "     - $($_.name) (Avg: $($_.avgPercentage)%)" -ForegroundColor White
        }
    }
    
    Write-Host ""
} catch {
    Write-Host "  ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host "  Details: $($_.ErrorDetails)" -ForegroundColor Red
    }
}

Write-Host "`n---`n"

# Test 3: Validation Tests
Write-Host "🧪 Test 3: Validation Tests" -ForegroundColor Yellow
Write-Host "Testing error handling...`n"

# Test 3a: Too few funds
Write-Host "  3a. Testing with only 1 fund (should fail):" -ForegroundColor White
try {
    $invalidBody = @{
        fundIds = @($fundIds[0])
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/compare" `
        -Method Post `
        -Body $invalidBody `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    Write-Host "    ❌ Should have failed but didn't!" -ForegroundColor Red
} catch {
    Write-Host "    ✅ Correctly rejected: At least 2 fund IDs required" -ForegroundColor Green
}

# Test 3b: Too many funds
Write-Host "`n  3b. Testing with 6 funds (should fail):" -ForegroundColor White
try {
    $tooManyBody = @{
        fundIds = @("f1", "f2", "f3", "f4", "f5", "f6")
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/compare" `
        -Method Post `
        -Body $tooManyBody `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    Write-Host "    ❌ Should have failed but didn't!" -ForegroundColor Red
} catch {
    Write-Host "    ✅ Correctly rejected: Maximum 5 funds allowed" -ForegroundColor Green
}

# Test 3c: Invalid fund ID
Write-Host "`n  3c. Testing with non-existent fund ID:" -ForegroundColor White
try {
    $invalidFundBody = @{
        fundIds = @("invalid123", "invalid456")
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/compare" `
        -Method Post `
        -Body $invalidFundBody `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    Write-Host "    ❌ Should have failed but didn't!" -ForegroundColor Red
} catch {
    Write-Host "    ✅ Correctly rejected: Funds not found" -ForegroundColor Green
}

Write-Host "`n===================================`n" -ForegroundColor Cyan
Write-Host "✅ All API tests completed!" -ForegroundColor Green
Write-Host "`n📚 Documentation:" -ForegroundColor Yellow
Write-Host "   See COMPARE_OVERLAP_API_DOCUMENTATION.md for details" -ForegroundColor White
Write-Host ""
