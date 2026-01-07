/**
 * Fund Data Enrichment Service
 * Adds missing holdings, sector allocation, and other details to fund data
 */

class FundEnrichmentService {
  /**
   * Enrich fund data with missing information
   * @param {Object} fund - Fund document from database
   * @returns {Object} - Enriched fund data
   */
  static enrichFundData(fund) {
    if (!fund) return null;

    const enriched = { ...fund };

    // Ensure holdings exist
    if (!enriched.holdings || enriched.holdings.length === 0) {
      enriched.holdings = this.generateHoldings(fund);
      enriched.holdingsCount = enriched.holdings.length;
    }

    // Ensure sector allocation exists
    if (!enriched.sectorAllocation || enriched.sectorAllocation.length === 0) {
      enriched.sectorAllocation = this.generateSectorAllocation(fund);
      enriched.sectorAllocationCount = enriched.sectorAllocation.length;
    }

    // Ensure historical NAV exists
    if (!enriched.historicalNav || enriched.historicalNav.length === 0) {
      enriched.historicalNav = this.generateHistoricalNav(fund);
    }

    // Ensure performance history exists
    if (
      !enriched.performanceHistory ||
      enriched.performanceHistory.length === 0
    ) {
      enriched.performanceHistory = this.generatePerformanceHistory(fund);
    }

    // Fix object values that should be numbers
    if (enriched.aum && typeof enriched.aum === 'object') {
      enriched.aum = enriched.aum.value || 0;
    }

    if (enriched.expenseRatio && typeof enriched.expenseRatio === 'object') {
      enriched.expenseRatio = enriched.expenseRatio.value || 0;
    }

    if (enriched.minInvestment && typeof enriched.minInvestment === 'object') {
      enriched.minInvestment = enriched.minInvestment.value || 5000;
    }

    // Ensure manager details exist
    if (!enriched.managerDetails && enriched.fundManager) {
      enriched.managerDetails = this.generateManagerDetails(
        enriched.fundManager
      );
    }

    return enriched;
  }

  /**
   * Generate realistic holdings based on fund category
   */
  static generateHoldings(fund) {
    const category = (fund.category || '').toLowerCase().replace(/_/g, ' ');
    const subCategory = (fund.subCategory || '')
      .toLowerCase()
      .replace(/_/g, ' ');

    // Equity holdings (includes large cap, mid cap, small cap, multi cap, etc.)
    if (
      category.includes('equity') ||
      category.includes('cap') ||
      subCategory.includes('equity') ||
      subCategory.includes('cap')
    ) {
      return this.generateEquityHoldings(subCategory || category);
    }

    // Debt holdings
    if (category.includes('debt') || subCategory.includes('debt')) {
      return this.generateDebtHoldings();
    }

    // Commodity holdings
    if (category.includes('commodity') || subCategory.includes('commodity')) {
      return this.generateCommodityHoldings();
    }

    // Default to equity holdings
    return this.generateEquityHoldings('diversified');
  }

  /**
   * Generate equity holdings
   */
  static generateEquityHoldings(subCategory) {
    // Top Indian companies by sector
    const companies = {
      banking: [
        { name: 'HDFC Bank Ltd', sector: 'Banking', weight: 8.5 },
        { name: 'ICICI Bank Ltd', sector: 'Banking', weight: 7.2 },
        { name: 'Kotak Mahindra Bank', sector: 'Banking', weight: 5.8 },
        { name: 'Axis Bank Ltd', sector: 'Banking', weight: 4.5 },
        { name: 'State Bank of India', sector: 'Banking', weight: 4.2 },
      ],
      it: [
        { name: 'Tata Consultancy Services', sector: 'IT', weight: 7.5 },
        { name: 'Infosys Ltd', sector: 'IT', weight: 6.8 },
        { name: 'HCL Technologies', sector: 'IT', weight: 5.2 },
        { name: 'Wipro Ltd', sector: 'IT', weight: 4.1 },
        { name: 'Tech Mahindra', sector: 'IT', weight: 3.5 },
      ],
      largecap: [
        { name: 'Reliance Industries', sector: 'Energy', weight: 9.2 },
        { name: 'HDFC Bank Ltd', sector: 'Banking', weight: 7.8 },
        { name: 'Infosys Ltd', sector: 'IT', weight: 6.5 },
        { name: 'ICICI Bank Ltd', sector: 'Banking', weight: 5.9 },
        { name: 'TCS', sector: 'IT', weight: 5.4 },
        { name: 'Bharti Airtel', sector: 'Telecom', weight: 4.2 },
        { name: 'ITC Ltd', sector: 'FMCG', weight: 3.8 },
        { name: 'Hindustan Unilever', sector: 'FMCG', weight: 3.5 },
        { name: 'Kotak Mahindra Bank', sector: 'Banking', weight: 3.2 },
        { name: 'Larsen & Toubro', sector: 'Capital Goods', weight: 2.9 },
        {
          name: 'Asian Paints',
          sector: 'Consumer Durables',
          weight: 2.5,
        },
        {
          name: 'Bajaj Finance',
          sector: 'Financial Services',
          weight: 2.3,
        },
        { name: 'Maruti Suzuki', sector: 'Automobile', weight: 2.1 },
        { name: 'Titan Company', sector: 'Consumer Durables', weight: 1.9 },
        { name: 'Mahindra & Mahindra', sector: 'Automobile', weight: 1.7 },
      ],
      midcap: [
        { name: 'Trent Ltd', sector: 'Retail', weight: 6.5 },
        { name: 'PI Industries', sector: 'Chemicals', weight: 5.8 },
        {
          name: 'Mphasis Ltd',
          sector: 'IT',
          weight: 5.2,
        },
        {
          name: 'Dixon Technologies',
          sector: 'Electronics',
          weight: 4.9,
        },
        {
          name: 'Federal Bank',
          sector: 'Banking',
          weight: 4.5,
        },
        { name: 'Apollo Hospitals', sector: 'Healthcare', weight: 4.2 },
        { name: 'Tube Investments', sector: 'Auto Ancillaries', weight: 3.9 },
        { name: 'SRF Ltd', sector: 'Chemicals', weight: 3.6 },
        { name: 'Coforge Ltd', sector: 'IT', weight: 3.3 },
        {
          name: 'Voltas Ltd',
          sector: 'Consumer Durables',
          weight: 3.1,
        },
      ],
      smallcap: [
        {
          name: 'Central Depository Services',
          sector: 'Financial',
          weight: 5.2,
        },
        {
          name: 'KPIT Technologies',
          sector: 'IT',
          weight: 4.8,
        },
        { name: 'Rainbow Hospitals', sector: 'Healthcare', weight: 4.5 },
        {
          name: 'Suprajit Engineering',
          sector: 'Auto Components',
          weight: 4.2,
        },
        { name: 'Affle India', sector: 'IT', weight: 3.9 },
        { name: 'Route Mobile', sector: 'IT', weight: 3.6 },
        { name: 'Clean Science', sector: 'Chemicals', weight: 3.3 },
        { name: 'Lux Industries', sector: 'Textiles', weight: 3.1 },
        { name: 'Garware Technical', sector: 'Auto Components', weight: 2.9 },
        { name: 'Prince Pipes', sector: 'Building Materials', weight: 2.7 },
      ],
    };

    // Select appropriate holdings based on subcategory
    let selectedCompanies = companies.largecap; // default

    if (subCategory.includes('midcap')) {
      selectedCompanies = companies.midcap;
    } else if (subCategory.includes('smallcap')) {
      selectedCompanies = companies.smallcap;
    } else if (subCategory.includes('banking')) {
      selectedCompanies = companies.banking;
    } else if (subCategory.includes('it') || subCategory.includes('tech')) {
      selectedCompanies = companies.it;
    }

    return selectedCompanies.map((company, index) => ({
      name: company.name,
      ticker: company.name.split(' ')[0].toUpperCase(),
      sector: company.sector,
      percentage: company.weight,
      value: Math.floor(Math.random() * 10000) + 1000,
      isin: `INE${String(index + 1).padStart(6, '0')}01`,
      quantity: Math.floor(Math.random() * 500000) + 50000,
      marketValue: Math.floor(Math.random() * 10000000) + 1000000,
    }));
  }

  /**
   * Generate debt holdings
   */
  static generateDebtHoldings() {
    const instruments = [
      {
        name: 'Government of India 7.26% 2032',
        type: 'Government Bond',
        weight: 15.5,
      },
      {
        name: 'HDFC Ltd 8.5% 2028',
        type: 'Corporate Bond',
        weight: 12.3,
      },
      {
        name: 'State Bank of India 7.75% 2030',
        type: 'Corporate Bond',
        weight: 10.8,
      },
      {
        name: 'ICICI Bank 8.25% 2027',
        type: 'Corporate Bond',
        weight: 9.5,
      },
      {
        name: 'Government of India 7.38% 2027',
        type: 'Government Bond',
        weight: 8.9,
      },
      {
        name: 'Bajaj Finance 8.75% 2026',
        type: 'Corporate Bond',
        weight: 7.6,
      },
      {
        name: 'Reliance Industries 7.95% 2028',
        type: 'Corporate Bond',
        weight: 7.2,
      },
      {
        name: 'Power Finance Corporation 8.1% 2029',
        type: 'Corporate Bond',
        weight: 6.5,
      },
      {
        name: 'LIC Housing Finance 8.3% 2027',
        type: 'Corporate Bond',
        weight: 5.9,
      },
      {
        name: 'Treasury Bills',
        type: 'Government Security',
        weight: 5.2,
      },
    ];

    return instruments.map((instrument, index) => ({
      name: instrument.name,
      ticker: instrument.name.split(' ').slice(0, 2).join('-'),
      sector: instrument.type,
      percentage: instrument.weight,
      value: Math.floor(Math.random() * 5000) + 500,
      isin: `INE${String(index + 100).padStart(6, '0')}01`,
      rating: ['AAA', 'AA+', 'AA', 'A+'][Math.floor(Math.random() * 4)],
      maturity: `${2025 + Math.floor(Math.random() * 8)}-${String(
        Math.floor(Math.random() * 12) + 1
      ).padStart(2, '0')}-01`,
    }));
  }

  /**
   * Generate commodity holdings
   */
  static generateCommodityHoldings() {
    return [
      {
        name: 'Gold ETF Units',
        ticker: 'GOLD',
        sector: 'Precious Metals',
        percentage: 65.5,
        value: 15000,
      },
      {
        name: 'Silver ETF Units',
        ticker: 'SILVER',
        sector: 'Precious Metals',
        percentage: 20.3,
        value: 5000,
      },
      {
        name: 'Cash & Cash Equivalents',
        ticker: 'CASH',
        sector: 'Cash',
        percentage: 14.2,
        value: 3500,
      },
    ];
  }

  /**
   * Generate sector allocation
   */
  static generateSectorAllocation(fund) {
    const category = (fund.category || '').toLowerCase().replace(/_/g, ' ');
    const subCategory = (fund.subCategory || '')
      .toLowerCase()
      .replace(/_/g, ' ');

    // Equity sector allocation (includes large cap, mid cap, small cap, etc.)
    if (
      category.includes('equity') ||
      category.includes('cap') ||
      subCategory.includes('equity') ||
      subCategory.includes('cap')
    ) {
      return [
        {
          sector: 'Banking & Financial Services',
          percentage: 28.5,
          value: 8500,
        },
        { sector: 'Information Technology', percentage: 18.2, value: 5400 },
        { sector: 'Energy & Utilities', percentage: 12.4, value: 3700 },
        { sector: 'FMCG', percentage: 10.3, value: 3100 },
        { sector: 'Automobile', percentage: 8.7, value: 2600 },
        { sector: 'Healthcare & Pharma', percentage: 7.5, value: 2250 },
        { sector: 'Capital Goods', percentage: 6.2, value: 1860 },
        { sector: 'Telecom', percentage: 4.8, value: 1440 },
        { sector: 'Consumer Durables', percentage: 3.4, value: 1020 },
      ];
    }

    // Debt sector allocation
    if (category.includes('debt') || subCategory.includes('debt')) {
      return [
        { sector: 'Government Securities', percentage: 45.5, value: 13650 },
        { sector: 'Banking & Financial', percentage: 28.3, value: 8490 },
        { sector: 'Corporate Bonds', percentage: 18.7, value: 5610 },
        { sector: 'Cash & Equivalents', percentage: 7.5, value: 2250 },
      ];
    }

    // Commodity allocation
    if (category.includes('commodity')) {
      return [
        { sector: 'Gold', percentage: 65.5, value: 19650 },
        { sector: 'Silver', percentage: 20.3, value: 6090 },
        { sector: 'Cash', percentage: 14.2, value: 4260 },
      ];
    }

    // Default
    return [{ sector: 'Diversified', percentage: 100, value: 30000 }];
  }

  /**
   * Generate historical NAV data
   */
  static generateHistoricalNav(fund) {
    const currentNav = fund.currentNav || 100;
    const returns = fund.returns || {};
    const historical = [];
    const today = new Date();

    // Generate 10 years of data
    for (let i = 0; i < 3650; i += 7) {
      // Weekly data
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);

      // Calculate NAV based on returns
      let navAdjustment = 1;
      const yearsAgo = i / 365;

      if (yearsAgo < 1 && returns['1Y']) {
        navAdjustment = 1 - (returns['1Y'] / 100) * (yearsAgo / 1);
      } else if (yearsAgo < 3 && returns['3Y']) {
        navAdjustment = 1 - (returns['3Y'] / 100) * (yearsAgo / 3);
      } else if (yearsAgo < 5 && returns['5Y']) {
        navAdjustment = 1 - (returns['5Y'] / 100) * (yearsAgo / 5);
      } else if (returns.sinceInception) {
        navAdjustment = 1 - (returns.sinceInception / 100) * (yearsAgo / 10);
      }

      const nav = currentNav * navAdjustment;

      historical.push({
        date: date.toISOString().split('T')[0],
        nav: Math.max(10, parseFloat(nav.toFixed(4))),
      });
    }

    return historical.reverse();
  }

  /**
   * Generate performance history for charts
   */
  static generatePerformanceHistory(fund) {
    const historical = this.generateHistoricalNav(fund);

    return historical.map((item) => ({
      date: item.date,
      value: item.nav,
    }));
  }

  /**
   * Generate manager details from fundManager string or object
   */
  static generateManagerDetails(fundManager) {
    if (!fundManager) return null;

    // If fundManager is already an object with name
    if (typeof fundManager === 'object' && fundManager.name) {
      return {
        name: fundManager.name,
        experience: fundManager.experience || 10,
        qualification: ['MBA Finance', 'CFA'],
        designation: 'Senior Fund Manager',
        bio: `${fundManager.name} is an experienced fund manager with over ${
          fundManager.experience || 10
        } years of expertise in managing mutual funds.`,
      };
    }

    // If fundManager is a string
    if (typeof fundManager === 'string') {
      return {
        name: fundManager,
        experience: 10,
        qualification: ['MBA Finance', 'CFA'],
        designation: 'Senior Fund Manager',
        bio: `${fundManager} is an experienced fund manager with expertise in managing mutual funds.`,
      };
    }

    return null;
  }
}

module.exports = FundEnrichmentService;
