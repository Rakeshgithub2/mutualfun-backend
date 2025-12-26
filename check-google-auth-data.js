/**
 * CHECK GOOGLE AUTH DATA IN DATABASE
 *
 * This script connects to MongoDB and checks what data is actually stored
 * when users login with Google OAuth
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

const DATABASE_URL = process.env.DATABASE_URL;

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  log(`\n${'='.repeat(70)}`, 'blue');
  log(`  ${title}`, 'bright');
  log(`${'='.repeat(70)}`, 'blue');
}

async function checkGoogleUsers() {
  let client;

  try {
    section('🔍 CHECKING GOOGLE AUTH USER DATA IN DATABASE');

    if (!DATABASE_URL) {
      log('\n❌ DATABASE_URL not found in .env file', 'red');
      return;
    }

    log('\n📡 Connecting to MongoDB...', 'cyan');
    client = new MongoClient(DATABASE_URL);
    await client.connect();
    log('✅ Connected to MongoDB', 'green');

    const db = client.db();
    const usersCollection = db.collection('users');

    // Count total users
    const totalUsers = await usersCollection.countDocuments();
    log(`\n📊 Total Users in Database: ${totalUsers}`, 'cyan');

    // Find Google users
    section('🔎 SEARCHING FOR GOOGLE OAUTH USERS');

    const googleUsers = await usersCollection
      .find({
        $or: [
          { provider: 'google' },
          { authMethod: 'google' },
          { googleId: { $exists: true } },
        ],
      })
      .toArray();

    if (googleUsers.length === 0) {
      log('\n⚠️  No Google OAuth users found in database', 'yellow');
      log('   This means no one has logged in with Google yet', 'yellow');

      section('📋 WHAT SHOULD BE STORED FOR GOOGLE USERS');
      log(
        '\nWhen a user logs in with Google, these fields should be saved:',
        'cyan'
      );
      log('  ✓ googleId         - Google user ID (from payload.sub)', 'green');
      log('  ✓ email            - User email', 'green');
      log('  ✓ name             - Full name (from payload.name)', 'green');
      log(
        '  ✓ firstName        - First name (from payload.given_name)',
        'green'
      );
      log(
        '  ✓ lastName         - Last name (from payload.family_name)',
        'green'
      );
      log('  ✓ picture          - Profile picture URL', 'green');
      log('  ✓ password         - Empty string "" (NOT null)', 'green');
      log('  ✓ provider         - "google" (in googleAuth.ts)', 'green');
      log('  ✓ authMethod       - "google" (in auth.service.ts)', 'green');
      log('  ✓ emailVerified    - true (Google verifies emails)', 'green');

      section('🧪 TO TEST GOOGLE OAUTH');
      log('\n1. Start your backend server:', 'cyan');
      log('   npm run dev', 'white');
      log('\n2. Visit this URL in browser:', 'cyan');
      log('   http://localhost:3002/api/auth/google', 'yellow');
      log('\n3. Complete Google sign-in', 'cyan');
      log('\n4. Run this script again to see stored data:', 'cyan');
      log('   node check-google-auth-data.js', 'white');
    } else {
      log(`\n✅ Found ${googleUsers.length} Google OAuth user(s)`, 'green');

      // Analyze each Google user
      googleUsers.forEach((user, index) => {
        section(`👤 GOOGLE USER #${index + 1}: ${user.email}`);

        // Check what's stored
        const analysis = {
          '✅ Has googleId': !!user.googleId,
          '✅ Has email': !!user.email,
          '✅ Has name': !!user.name,
          '✅ Has firstName': !!user.firstName,
          '✅ Has lastName': !!user.lastName,
          '✅ Has picture': !!user.picture,
          '✅ Has password': user.password !== undefined,
          '✅ Has provider': !!user.provider,
          '✅ Has authMethod': !!user.authMethod,
          '✅ Email verified': !!user.emailVerified || !!user.isVerified,
        };

        // Display user data
        log('\n📋 STORED DATA:', 'cyan');
        log(
          `   Email:           ${user.email || 'MISSING ❌'}`,
          user.email ? 'white' : 'red'
        );
        log(
          `   Name:            ${user.name || 'MISSING ❌'}`,
          user.name ? 'white' : 'red'
        );
        log(
          `   First Name:      ${user.firstName || 'MISSING ❌'}`,
          user.firstName ? 'white' : 'red'
        );
        log(
          `   Last Name:       ${user.lastName || 'MISSING ❌'}`,
          user.lastName ? 'white' : 'red'
        );
        log(
          `   Picture:         ${user.picture ? 'YES ✅' : 'NO ❌'}`,
          user.picture ? 'green' : 'yellow'
        );
        log(
          `   Google ID:       ${user.googleId || 'MISSING ❌'}`,
          user.googleId ? 'white' : 'red'
        );

        // Password analysis
        let passwordStatus = '';
        let passwordColor = 'white';
        if (user.password === undefined || user.password === null) {
          passwordStatus = 'null/undefined ⚠️ (should be empty string)';
          passwordColor = 'yellow';
        } else if (user.password === '') {
          passwordStatus = 'Empty string "" ✅ (CORRECT)';
          passwordColor = 'green';
        } else if (user.password.startsWith('$2')) {
          passwordStatus =
            'Hashed ⚠️ (Google users should have empty password)';
          passwordColor = 'yellow';
        } else {
          passwordStatus = user.password;
          passwordColor = 'white';
        }
        log(`   Password:        ${passwordStatus}`, passwordColor);

        // Provider/AuthMethod
        log(
          `   Provider:        ${user.provider || 'MISSING ❌'}`,
          user.provider === 'google' ? 'green' : 'yellow'
        );
        log(
          `   Auth Method:     ${user.authMethod || 'MISSING ❌'}`,
          user.authMethod === 'google' ? 'green' : 'yellow'
        );
        log(
          `   Email Verified:  ${user.emailVerified || user.isVerified || false}`,
          'white'
        );

        // Analysis summary
        log('\n🔍 FIELD ANALYSIS:', 'cyan');
        Object.entries(analysis).forEach(([field, exists]) => {
          const symbol = exists ? '✅' : '❌';
          const color = exists ? 'green' : 'red';
          log(`   ${symbol} ${field}`, color);
        });

        // Issues detection
        const issues = [];
        if (!user.firstName) issues.push('Missing firstName');
        if (!user.lastName) issues.push('Missing lastName');
        if (user.password === null || user.password === undefined) {
          issues.push('Password is null/undefined (should be empty string)');
        }
        if (!user.provider && !user.authMethod) {
          issues.push('Missing provider/authMethod field');
        }

        if (issues.length > 0) {
          log('\n⚠️  ISSUES FOUND:', 'yellow');
          issues.forEach((issue) => {
            log(`   • ${issue}`, 'yellow');
          });
        } else {
          log('\n✅ All required fields present!', 'green');
        }

        // Show raw user object (limited fields)
        log('\n📄 RAW DATA (relevant fields):', 'magenta');
        const relevantFields = {
          _id: user._id,
          userId: user.userId,
          googleId: user.googleId,
          email: user.email,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          picture: user.picture,
          password:
            user.password === ''
              ? '""'
              : user.password
                ? 'SET (hashed)'
                : 'null/undefined',
          provider: user.provider,
          authMethod: user.authMethod,
          emailVerified: user.emailVerified || user.isVerified,
          createdAt: user.createdAt,
        };
        console.log(relevantFields);
      });

      // Summary
      section('📊 SUMMARY & RECOMMENDATIONS');

      const allHaveFirstName = googleUsers.every((u) => u.firstName);
      const allHaveLastName = googleUsers.every((u) => u.lastName);
      const allHaveCorrectPassword = googleUsers.every(
        (u) => u.password === ''
      );
      const allHaveProvider = googleUsers.every(
        (u) => u.provider || u.authMethod
      );

      if (
        allHaveFirstName &&
        allHaveLastName &&
        allHaveCorrectPassword &&
        allHaveProvider
      ) {
        log('\n🎉 EXCELLENT! All Google users have complete data', 'green');
      } else {
        log('\n⚠️  ISSUES DETECTED:', 'yellow');
        if (!allHaveFirstName) log('   • Some users missing firstName', 'red');
        if (!allHaveLastName) log('   • Some users missing lastName', 'red');
        if (!allHaveCorrectPassword)
          log('   • Some users have non-empty password', 'red');
        if (!allHaveProvider)
          log('   • Some users missing provider/authMethod', 'red');
      }
    }

    // Check implementation files
    section('📝 IMPLEMENTATION CHECK');

    log('\n✅ TWO GOOGLE AUTH IMPLEMENTATIONS:', 'cyan');
    log('\n1. googleAuth.ts (redirect flow):', 'yellow');
    log(
      '   Fields stored: googleId, email, name, profilePicture, provider, isVerified',
      'white'
    );
    log('   ⚠️  MISSING: firstName, lastName separate fields', 'yellow');
    log('   Location: src/controllers/googleAuth.ts', 'white');

    log('\n2. auth.service.ts (token verification flow):', 'yellow');
    log(
      '   Fields stored: googleId, email, name, firstName, lastName, picture, authMethod',
      'white'
    );
    log('   ✅ COMPLETE: Has all fields including firstName/lastName', 'green');
    log('   Location: src/services/auth.service.ts', 'white');

    section('🔧 RECOMMENDATION');
    log(
      '\nThe googleAuth.ts controller needs to be updated to store firstName and lastName:',
      'yellow'
    );
    log('\nUpdate the updateFields object in googleAuth.ts:', 'cyan');
    log(
      `
const updateFields: any = {
  googleId: payload.sub,
  email: payload.email,
  name: payload.name || payload.email.split('@')[0],
  firstName: payload.given_name || '',  // ADD THIS
  lastName: payload.family_name || '',   // ADD THIS
  profilePicture: payload.picture || undefined,
  provider: 'google',
  isVerified: true,
  updatedAt: new Date(),
};
    `,
      'white'
    );
  } catch (error) {
    log('\n❌ Error:', 'red');
    console.error(error);
  } finally {
    if (client) {
      await client.close();
      log('\n📡 MongoDB connection closed', 'cyan');
    }
  }
}

// Run the check
checkGoogleUsers().catch(console.error);
