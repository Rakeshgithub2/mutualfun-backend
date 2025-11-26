# Enhanced Autocomplete Documentation

## Overview

Intelligent autocomplete with special handling for 1-2 word queries, featuring tokenization, permutations, confidence scoring, and match highlighting.

## Features

### 1. Single Word (1 token)

**Behavior:** Prefix + Fuzzy + Tag Boost

**Strategy:**

1. **Prefix Match** (Score: 90)
   - Match on fund name: `^query`
   - Match on fund house: `^query`
   - Match on fund ID (symbol): `^QUERY`
   - Sort by popularity and AUM

2. **Fuzzy Match** (Score: 70)
   - Contains match on fund name
   - Handles typos and variations

3. **Tag-Based Match** (Score: 80)
   - Detect intent from keyword
   - Boost symbol matches (gold, silver) by 1.3×
   - Useful for commodity/thematic funds

**Example:**

```
Input: "sbi"
Results:
1. SBI Bluechip Fund (confidence: 0.95, prefix match)
2. SBI Small Cap Fund (confidence: 0.93, prefix match)
3. SBI Liquid Fund (confidence: 0.90, prefix match)

Input: "gold"
Results:
1. HDFC Gold ETF (confidence: 0.92, tag boost)
2. SBI Gold Fund (confidence: 0.90, prefix + tag)
3. ICICI Prudential Gold ETF (confidence: 0.85, tag)
```

### 2. Two Words (2 tokens)

**Behavior:** Try Permutations [Brand] [Strategy] or [Fund Name] [Type]

**Patterns Tried:**

**Pattern 1: [Brand] [Strategy]** (Score: 95)

```
word1 matches fundHouse or name prefix
AND word2 appears in name
```

Example: `"sbi small"` → SBI Small Cap Fund

**Pattern 2: [Strategy] [Brand]** (Score: 85)

```
Reversed: word2 matches fundHouse
AND word1 appears in name
```

Example: `"small sbi"` → SBI Small Cap Fund

**Pattern 3: Both Words in Name** (Score: 80)

```
name contains word1 AND word2 (any order)
```

Example: `"bluechip hdfc"` → HDFC Bluechip Fund

**Pattern 4: Category Match** (Score: 90)

```
word1 matches fundHouse
AND word2 maps to subCategory
```

Mapping:

- `large` → Large Cap
- `mid` → Mid Cap
- `small` → Small Cap
- `multi` → Multi Cap
- `flexi` → Flexi Cap
- `hybrid` → Hybrid
- `debt` → Debt
- `liquid` → Liquid
- `gilt` → Gilt

Example: `"hdfc large"` → HDFC Top 100 Fund (Large Cap)

**Example:**

```
Input: "sbi small"
Results:
1. SBI Small Cap Fund - Direct (confidence: 0.98)
2. SBI Small Cap Fund - Regular (confidence: 0.97)
3. SBI Smallcap Opportunities Fund (confidence: 0.92)

Input: "icici liquid"
Results:
1. ICICI Prudential Liquid Fund (confidence: 0.95)
2. ICICI Prudential Liquid Fund - Direct (confidence: 0.94)
```

### 3. Three+ Words (3+ tokens)

**Behavior:** Standard autocomplete (Atlas Search or n-gram)

Uses existing autocomplete logic for complex queries.

## Confidence Score (0-1)

Multi-factor scoring algorithm:

### Factor 1: Prefix Match (0.5 points)

- Exact prefix match on name: +0.5
- Exact prefix match on fund house: +0.4

### Factor 2: Token Coverage (0.3 points)

- All tokens present: +0.3
- Partial: +(matched/total) × 0.2

### Factor 3: Token Order (0.1 points)

- For 2-word queries, tokens in correct order: +0.1

### Factor 4: Popularity (0.05 points)

- High popularity (>80): +0.05
- Medium popularity (>50): +0.03

### Factor 5: AUM Size (0.05 points)

- Large AUM (>₹10,000 Cr): +0.05
- Medium AUM (>₹5,000 Cr): +0.02

**Confidence Ranges:**

- **0.9-1.0**: Excellent match (exact or near-exact)
- **0.7-0.9**: Good match (strong relevance)
- **0.5-0.7**: Moderate match (relevant but not precise)
- **0.3-0.5**: Weak match (tangential relevance)
- **0.0-0.3**: Poor match (low relevance)

## Match Highlighting

Matched substrings are wrapped with `<mark>` tags for frontend highlighting.

**Algorithm:**

1. Sort tokens by length (longest first)
2. For each token, replace with `<mark>token</mark>` (case-insensitive)
3. Return highlighted HTML string

**Example:**

```javascript
Input: "sbi small"
Fund Name: "SBI Small Cap Fund - Direct Plan"

Output:
highlightedName: "<mark>SBI</mark> <mark>Small</mark> Cap Fund - Direct Plan"
```

**Frontend Rendering:**

```tsx
<div dangerouslySetInnerHTML={{ __html: suggestion.highlightedName }} />
```

Or safer with React:

```tsx
<span>
  {suggestion.highlightedName
    ?.split(/<mark>|<\/mark>/)
    .map((part, i) => (i % 2 === 1 ? <mark key={i}>{part}</mark> : part))}
</span>
```

## API Response Format

### GET `/api/search/suggest?q=sbi+small&limit=10`

```json
{
  "success": true,
  "data": {
    "query": "sbi small",
    "suggestions": [
      {
        "fundId": "INF200K01VF6",
        "name": "SBI Small Cap Fund - Direct Plan",
        "fundHouse": "SBI Mutual Fund",
        "category": "equity",
        "subCategory": "Small Cap",
        "fundType": "mutual_fund",
        "currentNav": 145.32,
        "shortDescription": "SBI Mutual Fund | equity",
        "similarityScore": 95,
        "confidence": 0.98,
        "highlightedName": "<mark>SBI</mark> <mark>Small</mark> Cap Fund - Direct Plan",
        "matchedTokens": ["sbi", "small"]
      },
      {
        "fundId": "INF200K01VG4",
        "name": "SBI Small Cap Fund - Regular Plan",
        "fundHouse": "SBI Mutual Fund",
        "category": "equity",
        "subCategory": "Small Cap",
        "fundType": "mutual_fund",
        "currentNav": 142.18,
        "shortDescription": "SBI Mutual Fund | equity",
        "similarityScore": 94,
        "confidence": 0.97,
        "highlightedName": "<mark>SBI</mark> <mark>Small</mark> Cap Fund - Regular Plan",
        "matchedTokens": ["sbi", "small"]
      }
    ],
    "count": 2
  },
  "cached": false
}
```

### Response Fields

| Field              | Type     | Description                                    |
| ------------------ | -------- | ---------------------------------------------- |
| `fundId`           | string   | Unique fund identifier (ISIN)                  |
| `name`             | string   | Full fund name                                 |
| `fundHouse`        | string   | Fund house/AMC name                            |
| `category`         | string   | Broad category (equity, debt, hybrid, etc.)    |
| `subCategory`      | string   | Specific category (Large Cap, Small Cap, etc.) |
| `fundType`         | string   | mutual_fund or etf                             |
| `currentNav`       | number   | Latest NAV                                     |
| `shortDescription` | string   | Quick summary                                  |
| `similarityScore`  | number   | Match score (0-100)                            |
| `confidence`       | number   | Confidence score (0-1) **[NEW]**               |
| `highlightedName`  | string   | Name with `<mark>` tags **[NEW]**              |
| `matchedTokens`    | string[] | Which input tokens matched **[NEW]**           |

## Performance Characteristics

### Query Complexity

- **1 word**: 3 database queries (prefix, fuzzy, tags)
- **2 words**: 4 database queries (4 permutation patterns)
- **3+ words**: 1-2 queries (standard autocomplete)

### Response Times

- **Cached**: 10-30ms
- **Uncached (1 word)**: 100-200ms
- **Uncached (2 words)**: 150-300ms
- **Uncached (3+ words)**: 80-150ms

### Caching Strategy

- Cache key: `suggest:v2:{query}:{limit}`
- TTL: 1 hour (3600 seconds)
- Auto-update when fund data changes

## Usage Examples

### JavaScript/TypeScript

```typescript
// Fetch autocomplete suggestions
async function getAutocompleteSuggestions(query: string) {
  const response = await fetch(
    `/api/search/suggest?q=${encodeURIComponent(query)}&limit=10`
  );
  const data = await response.json();

  if (data.success) {
    return data.data.suggestions;
  }
  return [];
}

// Example usage
const suggestions = await getAutocompleteSuggestions('sbi small');

// Render with highlighting
suggestions.forEach((s) => {
  console.log(`${s.name} (confidence: ${s.confidence})`);
  console.log(`Highlighted: ${s.highlightedName}`);
  console.log(`Matched tokens: ${s.matchedTokens.join(', ')}`);
});
```

### React Component

```tsx
import { useState, useEffect } from 'react';

function AutocompleteInput() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(`/api/search/suggest?q=${query}`);
      const data = await res.json();
      setSuggestions(data.data.suggestions);
      setLoading(false);
    }, 300); // Client-side debounce

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search funds (e.g., 'sbi small')"
      />
      {loading && <div>Loading...</div>}
      <ul>
        {suggestions.map((s) => (
          <li key={s.fundId} style={{ opacity: s.confidence }}>
            <div dangerouslySetInnerHTML={{ __html: s.highlightedName }} />
            <small>
              {s.fundHouse} | {s.category}
            </small>
            <small>Confidence: {(s.confidence * 100).toFixed(0)}%</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Testing Scenarios

### Test Cases

**Single Word:**

```
"sbi" → SBI funds (prefix match)
"hdfc" → HDFC funds (prefix match)
"gold" → Gold ETFs/funds (tag match with boost)
"liquid" → Liquid funds (tag + category match)
"icici" → ICICI funds (prefix match)
```

**Two Words (Brand + Strategy):**

```
"sbi small" → SBI Small Cap Fund
"hdfc large" → HDFC Top 100 Fund (Large Cap)
"icici liquid" → ICICI Prudential Liquid Fund
"axis bluechip" → Axis Bluechip Fund
"kotak flexi" → Kotak Flexicap Fund
```

**Two Words (Strategy + Brand):**

```
"small sbi" → SBI Small Cap Fund
"large hdfc" → HDFC Top 100 Fund
"liquid icici" → ICICI Prudential Liquid Fund
```

**Two Words (Both in Name):**

```
"tax saver" → ELSS Tax Saver funds
"balanced advantage" → Balanced Advantage funds
"bluechip equity" → Bluechip Equity funds
```

**Edge Cases:**

```
"a" → Empty (too short)
"xyz123" → Low confidence matches
"sbi xyz" → SBI funds only (ignore invalid token)
"" → Empty
"  sbi  " → Trimmed to "sbi"
```

## Integration with Frontend

### Autocomplete Dropdown

```tsx
<Autocomplete
  onInputChange={(query) => fetchSuggestions(query)}
  renderOption={(suggestion) => (
    <div className="flex items-center justify-between">
      <div>
        <div dangerouslySetInnerHTML={{ __html: suggestion.highlightedName }} />
        <small className="text-gray-500">{suggestion.fundHouse}</small>
      </div>
      <div className="flex items-center gap-2">
        <Badge>{suggestion.category}</Badge>
        <div className="text-sm text-gray-600">
          {(suggestion.confidence * 100).toFixed(0)}%
        </div>
      </div>
    </div>
  )}
/>
```

### Confidence Indicator

Use confidence score to style results:

```tsx
<div style={{ opacity: suggestion.confidence }}>{/* Suggestion content */}</div>
```

Or with color coding:

```tsx
const getConfidenceColor = (confidence) => {
  if (confidence > 0.9) return 'text-green-600';
  if (confidence > 0.7) return 'text-blue-600';
  if (confidence > 0.5) return 'text-yellow-600';
  return 'text-gray-600';
};
```

## Future Enhancements

1. **Learning from User Behavior**
   - Track which suggestions users click
   - Boost popular selections
   - Personalized ranking

2. **Abbreviation Expansion**
   - "sbi sc" → "SBI Small Cap"
   - "hdfc tpef" → "HDFC Top 100 Equity Fund"

3. **Synonym Support**
   - "big cap" → "large cap"
   - "little cap" → "small cap"

4. **Recent Searches**
   - Cache user's recent searches
   - Show in dropdown before typing

5. **Trending Searches**
   - Boost funds that are trending
   - Show popular searches

6. **Multi-language Support**
   - Hindi transliteration
   - Regional language support

---

**Status:** ✅ Implemented
**Version:** 2.0
**Last Updated:** November 18, 2025
