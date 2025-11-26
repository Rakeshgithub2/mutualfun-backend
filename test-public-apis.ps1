# Test script for Public APIs
# Tests all 4 public API endpoints

$baseUrl = "http://localhost:3002/api"

Write-Host "🧪 Testing Public APIs" -ForegroundColor Cyan
Write-Host "========================`n" -ForegroundColor Cyan

# Test 1: GET /funds (Search & Filter)
Write-Host "📋 Test 1: GET /funds" -ForegroundColor Yellow
Write-Host "Testing search and filter functionality...`n"

try {
    # Test basic list
    Write-Host "  1a. Get all funds (default pagination):"
    $response = Invoke-RestMethod -Uri "$baseUrl/funds" -Method Get
    Write-Host "    ✅ Status: Success" -ForegroundColor Green
    Write-Host "    📊 Total funds: $($response.pagination.total)" -ForegroundColor Cyan
    Write-Host "    📄 Returned: $($response.data.Count) funds`n" -ForegroundColor Cyan

    # Test search
    Write-Host "  1b. Search for 'sbi':"
    $response = Invoke-RestMethod -Uri "$baseUrl/funds?query=sbi&limit=5" -Method Get
    Write-Host "    ✅ Status: Success" -ForegroundColor Green
    Write-Host "    🔍 Search results: $($response.data.Count) funds`n" -ForegroundColor Cyan

    # Test filtering by type
    Write-Host "  1c. Filter by type (etf):"
    $response = Invoke-RestMethod -Uri "$baseUrl/funds?type=etf&limit=5" -Method Get
    Write-Host "    ✅ Status: Success" -ForegroundColor Green
    Write-Host "    📑 ETF results: $($response.data.Count) funds`n" -ForegroundColor Cyan

    # Test filtering by category
    Write-Host "  1d. Filter by category (equity):"
    $response = Invoke-RestMethod -Uri "$baseUrl/funds?category=equity&limit=5" -Method Get
    Write-Host "    ✅ Status: Success" -ForegroundColor Green
    Write-Host "    📈 Equity results: $($response.data.Count) funds`n" -ForegroundColor Cyan

} catch {
    Write-Host "    ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n---`n"

# Test 2: GET /funds/:id (Fund Details)
Write-Host "📄 Test 2: GET /funds/:id" -ForegroundColor Yellow
Write-Host "Testing fund details endpoint...`n"

try {
    # First, get a fund ID from the list
    $listResponse = Invoke-RestMethod -Uri "$baseUrl/funds?limit=1" -Method Get
    
    if ($listResponse.data.Count -gt 0) {
        $fundId = $listResponse.data[0].id
        Write-Host "  Testing with fund ID: $fundId"
        Write-Host "  Fund name: $($listResponse.data[0].name)`n"
        
        $fundDetails = Invoke-RestMethod -Uri "$baseUrl/funds/$fundId" -Method Get
        Write-Host "    ✅ Status: Success" -ForegroundColor Green
        Write-Host "    📊 Fund: $($fundDetails.data.name)" -ForegroundColor Cyan
        Write-Host "    💰 Current NAV: ₹$($fundDetails.data.currentNav)" -ForegroundColor Cyan
        Write-Host "    📈 1Y Return: $($fundDetails.data.returns.oneYear)%" -ForegroundColor Cyan
        Write-Host "    👤 Manager: $($fundDetails.data.fundManager)" -ForegroundColor Cyan
        Write-Host "    🏢 Top Holdings: $($fundDetails.data.topHoldings.Count)" -ForegroundColor Cyan
        Write-Host "    📊 Sectors: $($fundDetails.data.sectorAllocation.Count)`n" -ForegroundColor Cyan
    } else {
        Write-Host "    ⚠️ No funds found in database. Run import first.`n" -ForegroundColor Yellow
    }
} catch {
    Write-Host "    ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n---`n"

# Test 3: GET /funds/:id/price-history (Historical Data)
Write-Host "📈 Test 3: GET /funds/:id/price-history" -ForegroundColor Yellow
Write-Host "Testing price history endpoint...`n"

try {
    # Get a fund ID
    $listResponse = Invoke-RestMethod -Uri "$baseUrl/funds?limit=1" -Method Get
    
    if ($listResponse.data.Count -gt 0) {
        $fundId = $listResponse.data[0].id
        
        # Test different periods
        $periods = @('1M', '3M', '1Y', '5Y')
        
        foreach ($period in $periods) {
            Write-Host "  Testing period: $period"
            $priceHistory = Invoke-RestMethod -Uri "$baseUrl/funds/$fundId/price-history?period=$period" -Method Get
            Write-Host "    ✅ Status: Success" -ForegroundColor Green
            Write-Host "    📊 Data points: $($priceHistory.data.dataPoints)" -ForegroundColor Cyan
            Write-Host "    📅 Date range: $($priceHistory.data.startDate) to $($priceHistory.data.endDate)`n" -ForegroundColor Cyan
        }
    } else {
        Write-Host "    ⚠️ No funds found in database. Run import first.`n" -ForegroundColor Yellow
    }
} catch {
    Write-Host "    ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n---`n"

# Test 4: GET /suggest (Autocomplete)
Write-Host "🔍 Test 4: GET /suggest" -ForegroundColor Yellow
Write-Host "Testing autocomplete/fuzzy search...`n"

try {
    # Test with different queries
    $queries = @('sb', 'hdfc', 'nifty', 'gold')
    
    foreach ($query in $queries) {
        Write-Host "  Testing query: '$query'"
        $suggestions = Invoke-RestMethod -Uri "$baseUrl/suggest?q=$query" -Method Get
        Write-Host "    ✅ Status: Success" -ForegroundColor Green
        Write-Host "    🔍 Suggestions found: $($suggestions.data.count)" -ForegroundColor Cyan
        
        if ($suggestions.data.count -gt 0) {
            Write-Host "    📋 Top suggestions:" -ForegroundColor Cyan
            $suggestions.data.suggestions | Select-Object -First 3 | ForEach-Object {
                Write-Host "       - $($_.name) ($($_.category))" -ForegroundColor White
            }
        }
        Write-Host ""
    }
} catch {
    Write-Host "    ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n========================" -ForegroundColor Cyan
Write-Host "✅ All API tests completed!" -ForegroundColor Green
Write-Host "`n💡 Notes:" -ForegroundColor Yellow
Write-Host "  - If you see 0 results, run: npm run import:all" -ForegroundColor White
Write-Host "  - For price history data, run: npm run import:prices" -ForegroundColor White
Write-Host "  - Check PUBLIC_API_DOCUMENTATION.md for full details" -ForegroundColor White
Write-Host ""
