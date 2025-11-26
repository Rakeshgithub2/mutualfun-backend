// Seed fund managers data to MongoDB
const { MongoClient } = require('mongodb');

const uri =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/mutual_funds_db';

const fundManagers = [
  {
    managerId: 'mgr001',
    name: 'Rajiv Sharma',
    bio: 'Rajiv Sharma is the Chief Investment Officer at HDFC Asset Management with 18 years of experience in equity markets. He specializes in large-cap and multi-cap equity funds and is known for his disciplined value investing approach.',
    experience: 18,
    qualification: ['MBA (IIM-A)', 'CFA'],
    currentFundHouse: 'HDFC Asset Management',
    designation: 'Chief Investment Officer',
    joinedDate: new Date('2015-03-01'),
    fundsManaged: [
      {
        fundId: 'hdfc001',
        fundName: 'HDFC Top 100 Fund',
        startDate: new Date('2015-03-01'),
        aum: 85000,
        returns: {
          oneYear: 15.2,
          threeYear: 18.5,
          fiveYear: 22.3,
        },
      },
      {
        fundId: 'hdfc002',
        fundName: 'HDFC Balanced Advantage Fund',
        startDate: new Date('2017-06-01'),
        aum: 45000,
        returns: {
          oneYear: 12.8,
          threeYear: 16.2,
          fiveYear: 19.5,
        },
      },
      {
        fundId: 'hdfc003',
        fundName: 'HDFC Mid-Cap Opportunities Fund',
        startDate: new Date('2018-01-15'),
        aum: 32000,
        returns: {
          oneYear: 18.5,
          threeYear: 22.8,
          fiveYear: 27.2,
        },
      },
    ],
    totalAumManaged: 162000,
    averageReturns: {
      oneYear: 15.5,
      threeYear: 19.2,
      fiveYear: 23.0,
    },
    awards: [
      {
        title: 'Best Large Cap Fund Manager',
        year: 2023,
        organization: 'Morningstar India',
      },
      {
        title: 'Excellence in Equity Investment',
        year: 2022,
        organization: 'CNBC-TV18',
      },
    ],
    email: 'rajiv.sharma@hdfc.com',
    linkedin: 'https://linkedin.com/in/rajiv-sharma-hdfc',
    isActive: true,
    createdAt: new Date(),
    lastUpdated: new Date(),
  },
  {
    managerId: 'mgr002',
    name: 'Priya Desai',
    bio: 'Priya Desai is a Senior Fund Manager at SBI Mutual Fund with 14 years of experience. She specializes in small and mid-cap equity funds and is recognized for her expertise in identifying emerging growth companies.',
    experience: 14,
    qualification: ['CA', 'CFA'],
    currentFundHouse: 'SBI Mutual Fund',
    designation: 'Senior Fund Manager',
    joinedDate: new Date('2016-08-01'),
    fundsManaged: [
      {
        fundId: 'sbi001',
        fundName: 'SBI Blue Chip Fund',
        startDate: new Date('2016-08-01'),
        aum: 62000,
        returns: {
          oneYear: 17.8,
          threeYear: 19.2,
          fiveYear: 24.1,
        },
      },
      {
        fundId: 'sbi002',
        fundName: 'SBI Focused Equity Fund',
        startDate: new Date('2018-03-01'),
        aum: 38000,
        returns: {
          oneYear: 16.5,
          threeYear: 20.8,
          fiveYear: 25.5,
        },
      },
      {
        fundId: 'sbi003',
        fundName: 'SBI Small Cap Fund',
        startDate: new Date('2019-01-01'),
        aum: 28000,
        returns: {
          oneYear: 22.5,
          threeYear: 28.2,
          fiveYear: 32.8,
        },
      },
    ],
    totalAumManaged: 128000,
    averageReturns: {
      oneYear: 18.9,
      threeYear: 22.7,
      fiveYear: 27.5,
    },
    awards: [
      {
        title: 'Best Mid-Cap Fund Manager',
        year: 2023,
        organization: 'Value Research',
      },
    ],
    email: 'priya.desai@sbi.com',
    linkedin: 'https://linkedin.com/in/priya-desai-sbi',
    isActive: true,
    createdAt: new Date(),
    lastUpdated: new Date(),
  },
  {
    managerId: 'mgr003',
    name: 'Amit Verma',
    bio: 'Amit Verma heads the Fixed Income division at ICICI Prudential with 16 years of experience. He specializes in debt and fixed income funds and is known for his expertise in managing credit risk.',
    experience: 16,
    qualification: ['MBA (Finance)', 'CFA'],
    currentFundHouse: 'ICICI Prudential',
    designation: 'Head of Fixed Income',
    joinedDate: new Date('2014-05-01'),
    fundsManaged: [
      {
        fundId: 'icici001',
        fundName: 'ICICI Pru Bond Fund',
        startDate: new Date('2014-05-01'),
        aum: 48000,
        returns: {
          oneYear: 7.5,
          threeYear: 8.2,
          fiveYear: 9.1,
        },
      },
      {
        fundId: 'icici002',
        fundName: 'ICICI Pru Liquid Fund',
        startDate: new Date('2015-09-01'),
        aum: 95000,
        returns: {
          oneYear: 6.8,
          threeYear: 7.1,
          fiveYear: 7.5,
        },
      },
      {
        fundId: 'icici003',
        fundName: 'ICICI Pru Credit Risk Fund',
        startDate: new Date('2017-02-01'),
        aum: 22000,
        returns: {
          oneYear: 8.2,
          threeYear: 9.5,
          fiveYear: 10.8,
        },
      },
    ],
    totalAumManaged: 165000,
    averageReturns: {
      oneYear: 7.5,
      threeYear: 8.3,
      fiveYear: 9.1,
    },
    awards: [
      {
        title: 'Best Debt Fund Manager',
        year: 2022,
        organization: 'Outlook Money',
      },
    ],
    email: 'amit.verma@icicipru.com',
    linkedin: 'https://linkedin.com/in/amit-verma-icici',
    isActive: true,
    createdAt: new Date(),
    lastUpdated: new Date(),
  },
];

async function seedFundManagers() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const database = client.db('mutual_funds_db');
    const collection = database.collection('fundManagers');

    // Clear existing data
    const deleteResult = await collection.deleteMany({});
    console.log(
      `🗑️  Deleted ${deleteResult.deletedCount} existing fund managers`
    );

    // Insert new fund managers
    const result = await collection.insertMany(fundManagers);
    console.log(`✅ Inserted ${result.insertedCount} fund managers`);

    // Display inserted managers
    fundManagers.forEach((manager, index) => {
      console.log(`\n📋 Manager ${index + 1}:`);
      console.log(`   ID: ${manager.managerId}`);
      console.log(`   Name: ${manager.name}`);
      console.log(`   Company: ${manager.currentFundHouse}`);
      console.log(`   Experience: ${manager.experience} years`);
      console.log(
        `   Total AUM: ₹${(manager.totalAumManaged / 10000).toFixed(1)}K Cr`
      );
      console.log(`   Funds Managed: ${manager.fundsManaged.length}`);
    });

    console.log('\n✅ Fund managers seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding fund managers:', error);
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

seedFundManagers();
