const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SCHEMA_PATH = path.join(__dirname, '../prisma/schema.prisma');
const ENV_PATH = path.join(__dirname, '../.env');

function migrateToPostgres() {
  console.log('🚀 Initiating PostgreSQL Transition Utility...');

  // 1. Verify schema file exists
  if (!fs.existsSync(SCHEMA_PATH)) {
    console.error(`❌ Error: schema.prisma not found at ${SCHEMA_PATH}`);
    process.exit(1);
  }

  // 2. Read schema file
  let schemaContent = fs.readFileSync(SCHEMA_PATH, 'utf8');

  // 3. Search and replace SQLite block with PostgreSQL block
  const sqlitePattern = /datasource\s+db\s*{[\s\S]*?provider\s*=\s*"sqlite"[\s\S]*?}/;
  
  const postgresBlock = `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}`;

  if (!sqlitePattern.test(schemaContent)) {
    if (schemaContent.includes('provider = "postgresql"')) {
      console.log('ℹ️ Prisma schema is already configured for PostgreSQL.');
    } else {
      console.error('❌ Error: Could not locate sqlite datasource block in schema.prisma.');
      process.exit(1);
    }
  } else {
    schemaContent = schemaContent.replace(sqlitePattern, postgresBlock);
    fs.writeFileSync(SCHEMA_PATH, schemaContent, 'utf8');
    console.log('✅ Successfully refactored prisma/schema.prisma to use PostgreSQL!');
  }

  // 4. Verify DATABASE_URL exists in `.env`
  let hasDatabaseUrl = false;
  if (fs.existsSync(ENV_PATH)) {
    const envContent = fs.readFileSync(ENV_PATH, 'utf8');
    if (envContent.includes('DATABASE_URL=')) {
      hasDatabaseUrl = true;
    }
  }

  if (!hasDatabaseUrl) {
    console.warn('\n⚠️  WARNING: "DATABASE_URL" is missing in your `.env` file!');
    console.warn('   Please open your `.env` and add:');
    console.warn('   DATABASE_URL="postgresql://username:password@localhost:5432/databasename"');
    console.warn('   Then run: npx prisma db push\n');
  } else {
    console.log('✅ Found DATABASE_URL in environment configuration.');
    try {
      console.log('🔄 Executing prisma client regeneration and database schema push...');
      execSync('npx prisma generate', { stdio: 'inherit' });
      execSync('npx prisma db push', { stdio: 'inherit' });
      console.log('🎉 PostgreSQL database sync successfully completed!');
    } catch (err) {
      console.error('❌ Failed to run prisma commands automatically:', err.message);
      console.warn('👉 Please verify your DATABASE_URL in .env and run manually: npx prisma generate && npx prisma db push');
    }
  }
}

migrateToPostgres();
