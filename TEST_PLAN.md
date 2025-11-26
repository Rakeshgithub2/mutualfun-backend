# Test Plan & Acceptance Criteria

## Production Mutual Funds Platform

---

## 📋 Test Categories

### 1. Unit Tests

### 2. Integration Tests

### 3. Performance Tests

### 4. Security Tests

### 5. Data Accuracy Tests

### 6. User Acceptance Tests

---

## 1️⃣ Unit Tests

### Authentication Service Tests

**File**: `tests/unit/auth.service.test.ts`

```typescript
describe('AuthService', () => {
  describe('Google Token Verification', () => {
    it('should verify valid Google ID token', async () => {
      const token = 'valid-google-token';
      const result = await authService.verifyGoogleToken(token);

      expect(result).toBeDefined();
      expect(result.email).toContain('@');
      expect(result.email_verified).toBe(true);
    });

    it('should reject invalid Google token', async () => {
      const token = 'invalid-token';
      await expect(authService.verifyGoogleToken(token)).rejects.toThrow(
        'Google token verification failed'
      );
    });
  });

  describe('User Management', () => {
    it('should create new user on first login', async () => {
      const googleData = {
        sub: 'google123',
        email: 'test@example.com',
        name: 'Test User',
        given_name: 'Test',
        family_name: 'User',
        email_verified: true,
      };

      const user = await authService.findOrCreateUser(
        googleData,
        '127.0.0.1',
        'Mozilla'
      );

      expect(user.userId).toBeDefined();
      expect(user.googleId).toBe('google123');
      expect(user.email).toBe('test@example.com');
    });

    it('should update existing user on subsequent login', async () => {
      // Create user first
      const user1 = await authService.findOrCreateUser(
        googleData,
        '127.0.0.1',
        'Mozilla'
      );

      // Login again with updated name
      googleData.name = 'Updated Name';
      const user2 = await authService.findOrCreateUser(
        googleData,
        '127.0.0.2',
        'Chrome'
      );

      expect(user2.userId).toBe(user1.userId);
      expect(user2.name).toBe('Updated Name');
      expect(user2.loginHistory).toHaveLength(2);
    });
  });

  describe('JWT Token Management', () => {
    it('should generate valid access token', () => {
      const token = authService.generateAccessToken(mockUser);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      const decoded = authService.verifyAccessToken(token);
      expect(decoded.userId).toBe(mockUser.userId);
      expect(decoded.type).toBe('access');
    });

    it('should generate valid refresh token', () => {
      const token = authService.generateRefreshToken(mockUser);

      expect(token).toBeDefined();
      const decoded = authService.verifyRefreshToken(token);
      expect(decoded.type).toBe('refresh');
    });

    it('should reject expired tokens', async () => {
      // Mock expired token
      const expiredToken = jwt.sign({ ...mockPayload, exp: 0 }, JWT_SECRET);

      expect(() => authService.verifyAccessToken(expiredToken)).toThrow();
    });
  });
});
```

**Acceptance Criteria:**

- ✅ All token operations succeed with valid input
- ✅ Invalid tokens are rejected
- ✅ User creation and updates work correctly
- ✅ Token expiry is enforced

---

### Search Service Tests

**File**: `tests/unit/search.service.test.ts`

```typescript
describe('SearchService', () => {
  describe('Fuzzy Search', () => {
    it('should find funds with exact match', async () => {
      const results = await searchService.fuzzySearch('Nifty 50');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name).toContain('Nifty');
    });

    it('should find funds with typos', async () => {
      const results = await searchService.fuzzySearch('Nify'); // typo

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name).toContain('Nifty');
    });

    it('should return results sorted by relevance', async () => {
      const results = await searchService.fuzzySearch('gold', {
        sort: 'relevance',
      });

      expect(results[0].relevanceScore).toBeGreaterThanOrEqual(
        results[1].relevanceScore
      );
    });
  });

  describe('Auto-suggest', () => {
    it('should return suggestions within 200ms', async () => {
      const start = Date.now();
      const suggestions = await searchService.autoSuggest('nif', 10);
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(200);
      expect(suggestions.length).toBeLessThanOrEqual(10);
    });
  });
});
```

**Acceptance Criteria:**

- ✅ Search handles typos (1-2 char difference)
- ✅ Results returned in <500ms
- ✅ Auto-suggest in <200ms
- ✅ Relevance scoring >80% accuracy

---

### Comparison Service Tests

**File**: `tests/unit/comparison.service.test.ts`

```typescript
describe('ComparisonService', () => {
  describe('Jaccard Similarity', () => {
    it('should calculate 100% similarity for identical funds', () => {
      const fund1 = createMockFund(['AAPL', 'GOOGL', 'MSFT']);
      const fund2 = createMockFund(['AAPL', 'GOOGL', 'MSFT']);

      const similarity = comparisonService.jaccardSimilarity(
        fund1.holdings,
        fund2.holdings
      );

      expect(similarity).toBe(1.0);
    });

    it('should calculate 0% similarity for non-overlapping funds', () => {
      const fund1 = createMockFund(['AAPL', 'GOOGL']);
      const fund2 = createMockFund(['GOLD', 'SILVER']);

      const similarity = comparisonService.jaccardSimilarity(
        fund1.holdings,
        fund2.holdings
      );

      expect(similarity).toBe(0);
    });

    it('should calculate partial similarity correctly', () => {
      const fund1 = createMockFund(['AAPL', 'GOOGL', 'MSFT']);
      const fund2 = createMockFund(['AAPL', 'GOOGL', 'TSLA']);

      const similarity = comparisonService.jaccardSimilarity(
        fund1.holdings,
        fund2.holdings
      );

      // 2 common / 4 total = 0.5
      expect(similarity).toBeCloseTo(0.5, 2);
    });
  });

  describe('Weighted Overlap', () => {
    it('should calculate weighted overlap correctly', () => {
      const fund1 = {
        holdings: [
          { ticker: 'AAPL', percentage: 10 },
          { ticker: 'GOOGL', percentage: 15 },
          { ticker: 'MSFT', percentage: 20 },
        ],
      };

      const fund2 = {
        holdings: [
          { ticker: 'AAPL', percentage: 12 },
          { ticker: 'GOOGL', percentage: 10 },
          { ticker: 'TSLA', percentage: 25 },
        ],
      };

      const overlap = comparisonService.weightedOverlap(fund1, fund2);

      // min(10,12) + min(15,10) = 10 + 10 = 20
      expect(overlap).toBe(20);
    });
  });

  describe('Sector Overlap', () => {
    it('should identify common sectors', async () => {
      const fundIds = ['fund1', 'fund2'];
      const result = await comparisonService.calculateSectorOverlap(fundIds);

      expect(result.commonSectors).toBeDefined();
      expect(result.totalOverlap).toBeGreaterThanOrEqual(0);
      expect(result.totalOverlap).toBeLessThanOrEqual(100);
    });
  });
});
```

**Acceptance Criteria:**

- ✅ Jaccard similarity matches manual calculation
- ✅ Weighted overlap within 5% margin
- ✅ Sector percentages sum to 100%
- ✅ Handles edge cases (empty holdings)

---

## 2️⃣ Integration Tests

### Auth API Tests

**File**: `tests/integration/auth.api.test.ts`

```typescript
describe('Auth API', () => {
  describe('POST /api/auth/google', () => {
    it('should authenticate with valid Google token', async () => {
      const response = await request(app)
        .post('/api/auth/google')
        .send({ idToken: validGoogleToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.tokens.accessToken).toBeDefined();
      expect(response.body.data.tokens.refreshToken).toBeDefined();
    });

    it('should reject invalid Google token', async () => {
      const response = await request(app)
        .post('/api/auth/google')
        .send({ idToken: 'invalid-token' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh access token with valid refresh token', async () => {
      // First login
      const loginRes = await request(app)
        .post('/api/auth/google')
        .send({ idToken: validGoogleToken });

      const refreshToken = loginRes.body.data.tokens.refreshToken;

      // Refresh
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.accessToken).not.toBe(
        loginRes.body.data.tokens.accessToken
      );
    });
  });

  describe('Protected Routes', () => {
    it('should require authentication for /api/auth/me', async () => {
      await request(app).get('/api/auth/me').expect(401);
    });

    it('should return user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.data.userId).toBeDefined();
      expect(response.body.data.email).toBeDefined();
    });
  });
});
```

**Acceptance Criteria:**

- ✅ All endpoints return correct status codes
- ✅ Valid requests succeed
- ✅ Invalid requests are rejected
- ✅ Protected routes require authentication

---

### Fund Search API Tests

**File**: `tests/integration/search.api.test.ts`

```typescript
describe('Search API', () => {
  describe('GET /api/funds/search', () => {
    it('should search funds by query', async () => {
      const response = await request(app)
        .get('/api/funds/search')
        .query({ q: 'nifty', limit: 10 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.funds.length).toBeLessThanOrEqual(10);
      expect(response.body.data.total).toBeGreaterThan(0);
    });

    it('should filter by category', async () => {
      const response = await request(app)
        .get('/api/funds/search')
        .query({ category: 'commodity' })
        .expect(200);

      response.body.data.funds.forEach((fund: any) => {
        expect(fund.category).toBe('commodity');
      });
    });

    it('should sort by returns', async () => {
      const response = await request(app)
        .get('/api/funds/search')
        .query({ sort: 'returns', order: 'desc' })
        .expect(200);

      const funds = response.body.data.funds;
      for (let i = 0; i < funds.length - 1; i++) {
        expect(funds[i].returns.oneYear).toBeGreaterThanOrEqual(
          funds[i + 1].returns.oneYear
        );
      }
    });

    it('should handle pagination', async () => {
      const page1 = await request(app)
        .get('/api/funds/search')
        .query({ page: 1, limit: 10 });

      const page2 = await request(app)
        .get('/api/funds/search')
        .query({ page: 2, limit: 10 });

      expect(page1.body.data.funds[0].fundId).not.toBe(
        page2.body.data.funds[0].fundId
      );
    });
  });
});
```

**Acceptance Criteria:**

- ✅ Search returns relevant results
- ✅ Filters work correctly
- ✅ Sorting works as expected
- ✅ Pagination works correctly

---

## 3️⃣ Performance Tests

### Load Testing

**Tool**: Apache JMeter or Artillery

```yaml
# artillery-config.yml
config:
  target: 'http://localhost:3002'
  phases:
    - duration: 60
      arrivalRate: 10
      name: 'Warm up'
    - duration: 120
      arrivalRate: 50
      name: 'Sustained load'
    - duration: 60
      arrivalRate: 100
      name: 'Spike'

scenarios:
  - name: 'Search Funds'
    flow:
      - get:
          url: '/api/funds/search?q=nifty'
          expect:
            - statusCode: 200
            - contentType: json
            - hasProperty: data.funds

  - name: 'Compare Funds'
    flow:
      - post:
          url: '/api/comparison/compare'
          json:
            fundIds: ['NIFTYBEES.NS', 'GOLDBEES.NS']
          expect:
            - statusCode: 200
            - maxResponseTime: 1000
```

**Acceptance Criteria:**

- ✅ API response time <1s (95th percentile)
- ✅ Support 1000+ concurrent users
- ✅ Error rate <1% under load
- ✅ Database query time <100ms
- ✅ Cache hit rate >90%

---

## 4️⃣ Security Tests

### Authentication Security

```typescript
describe('Security Tests', () => {
  it('should reject expired JWT tokens', async () => {
    const expiredToken = generateExpiredToken();

    await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${expiredToken}`)
      .expect(403);
  });

  it('should enforce rate limiting', async () => {
    const requests = [];

    // Send 100 requests
    for (let i = 0; i < 100; i++) {
      requests.push(request(app).get('/api/funds/search?q=nifty'));
    }

    const responses = await Promise.all(requests);
    const rateLimited = responses.filter((r) => r.status === 429);

    expect(rateLimited.length).toBeGreaterThan(0);
  });

  it('should sanitize SQL injection attempts', async () => {
    const maliciousQuery = "'; DROP TABLE funds; --";

    const response = await request(app)
      .get(`/api/funds/search?q=${encodeURIComponent(maliciousQuery)}`)
      .expect(200);

    // Should return no results, not error
    expect(response.body.data.funds).toEqual([]);
  });

  it('should prevent XSS attacks', async () => {
    const xssPayload = '<script>alert("XSS")</script>';

    const response = await request(app)
      .post('/api/auth/profile')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ name: xssPayload })
      .expect(400);

    // Should validate and reject
    expect(response.body.error).toBeDefined();
  });
});
```

**Acceptance Criteria:**

- ✅ All tokens validated on every request
- ✅ Expired tokens rejected
- ✅ Rate limiting active on all endpoints
- ✅ SQL injection attempts blocked
- ✅ XSS payloads sanitized
- ✅ CORS configured correctly

---

## 5️⃣ Data Accuracy Tests

### Fund Data Validation

```typescript
describe('Data Accuracy', () => {
  describe('Fund Data Integrity', () => {
    it('should have at least 100 stock funds', async () => {
      const count = await db.collection('funds').countDocuments({
        $or: [
          { category: 'equity' },
          { fundType: 'etf', category: { $ne: 'commodity' } },
        ],
      });

      expect(count).toBeGreaterThanOrEqual(100);
    });

    it('should have at least 50 commodity funds', async () => {
      const count = await db.collection('funds').countDocuments({
        category: 'commodity',
      });

      expect(count).toBeGreaterThanOrEqual(50);
    });

    it('should have valid NAV data', async () => {
      const funds = await db
        .collection('funds')
        .find({
          isActive: true,
        })
        .limit(100)
        .toArray();

      funds.forEach((fund) => {
        expect(fund.currentNav).toBeGreaterThan(0);
        expect(fund.navDate).toBeInstanceOf(Date);
        expect(fund.navDate.getTime()).toBeGreaterThan(
          Date.now() - 7 * 24 * 60 * 60 * 1000 // Within 7 days
        );
      });
    });

    it('should have real fund manager data', async () => {
      const managers = await db
        .collection('fundManagers')
        .find({
          isActive: true,
        })
        .limit(10)
        .toArray();

      managers.forEach((manager) => {
        expect(manager.name).not.toContain('Mock');
        expect(manager.name).not.toContain('Test');
        expect(manager.experience).toBeGreaterThan(0);
        expect(manager.fundsManaged.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Price Data Freshness', () => {
    it('should have prices updated within 15 minutes', async () => {
      const topFunds = await db
        .collection('funds')
        .find({ isActive: true })
        .sort({ popularity: -1 })
        .limit(100)
        .toArray();

      for (const fund of topFunds) {
        const minutesOld = (Date.now() - fund.navDate.getTime()) / 60000;
        expect(minutesOld).toBeLessThan(15);
      }
    });

    it('should have historical prices for past 30 days', async () => {
      const fund = await db.collection('funds').findOne({ isActive: true });

      const prices = await db
        .collection('fundPrices')
        .find({
          fundId: fund!.fundId,
          date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        })
        .toArray();

      expect(prices.length).toBeGreaterThanOrEqual(20); // At least 20 trading days
    });
  });
});
```

**Acceptance Criteria:**

- ✅ ≥100 stock funds in database
- ✅ ≥50 commodity funds in database
- ✅ All NAV data valid and recent (<7 days)
- ✅ Fund managers are real (not mock)
- ✅ Top 100 funds have prices <15min old
- ✅ Historical data available (30+ days)

---

## 6️⃣ User Acceptance Tests (UAT)

### Feature: Fund Search

```gherkin
Feature: Fund Search
  As a user
  I want to search for mutual funds
  So that I can find investment opportunities

  Scenario: Search by fund name
    Given I am on the homepage
    When I type "Nifty 50" in the search box
    Then I should see funds matching "Nifty 50"
    And results should appear within 500ms

  Scenario: Filter by category
    Given I am on the search page
    When I select "Commodity" category
    Then I should see only commodity funds
    And all funds should have category "commodity"

  Scenario: Sort by returns
    Given I have search results
    When I select "Sort by 1-year returns"
    Then funds should be sorted by highest returns first
```

### Feature: Fund Comparison

```gherkin
Feature: Fund Comparison
  As a user
  I want to compare multiple funds
  So that I can make informed investment decisions

  Scenario: Compare two funds
    Given I have selected 2 funds
    When I click "Compare"
    Then I should see side-by-side comparison
    And I should see overlap percentage
    And I should see common holdings

  Scenario: View overlap details
    Given I am comparing funds
    When I view the overlap section
    Then I should see common stocks
    And I should see duplicate exposure percentage
```

**Acceptance Criteria:**

- ✅ All features work as designed
- ✅ UI is responsive and intuitive
- ✅ Error messages are user-friendly
- ✅ Loading states are clear
- ✅ Data displays correctly

---

## 🎯 Overall Acceptance Criteria Summary

### Data Quality

- [x] 100+ stock funds populated with real data
- [x] 50+ commodity funds populated with real data
- [x] Fund managers have real profiles (not mock)
- [ ] All NAV data updated daily (automated)
- [ ] Holdings data for top 100 funds

### Performance

- [ ] Search results in <500ms (95th percentile)
- [ ] API response time <1s (95th percentile)
- [ ] Price cache hit rate >90%
- [ ] Support 1000+ concurrent users
- [ ] Database queries <100ms (indexed)

### Functionality

- [x] Google OAuth authentication working
- [ ] Fuzzy search handles typos (1-2 chars)
- [ ] Auto-suggest in <200ms
- [ ] Comparison engine accurate (±5%)
- [ ] Overlap calculation correct
- [ ] Portfolio analysis complete

### Security

- [x] JWT tokens validated
- [ ] Rate limiting active
- [ ] SQL injection protected
- [ ] XSS sanitization
- [ ] CORS configured
- [ ] HTTPS in production

### Data Freshness

- [ ] Current prices <15min old (top 100 funds)
- [ ] NAV data updated daily
- [ ] Fund manager info updated monthly
- [ ] Cache invalidation working

---

## 🚀 Test Execution Plan

### Phase 1: Unit Tests (Week 1)

- Run: `npm test -- --testPathPattern=unit`
- Goal: 80% code coverage
- Focus: Core services (auth, search, comparison)

### Phase 2: Integration Tests (Week 2)

- Run: `npm test -- --testPathPattern=integration`
- Goal: All API endpoints tested
- Focus: End-to-end flows

### Phase 3: Performance Tests (Week 3)

- Tool: Artillery
- Run: `artillery run artillery-config.yml`
- Goal: Meet performance benchmarks

### Phase 4: UAT (Week 4)

- Manual testing with real users
- Collect feedback
- Fix issues
- Final validation

---

## ✅ Test Report Template

```markdown
# Test Report - [Date]

## Summary

- Total Tests: XX
- Passed: XX
- Failed: XX
- Coverage: XX%

## Failed Tests

1. [Test Name] - [Reason] - [Priority]

## Performance Metrics

- Average Response Time: XXms
- 95th Percentile: XXms
- Throughput: XX req/sec
- Error Rate: XX%

## Action Items

1. [Issue] - [Owner] - [Due Date]

## Sign-off

- QA Lead: [Name]
- Dev Lead: [Name]
- Product Owner: [Name]
```

---

This comprehensive test plan ensures the production mutual funds platform meets all quality, performance, and security standards before deployment.
