// Script để switch giữa SQLite (local) và PostgreSQL (production)
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
const schemaContent = fs.readFileSync(schemaPath, 'utf8');

// Kiểm tra DATABASE_URL từ environment
const dbUrl = process.env.DATABASE_URL || '';

if (dbUrl.startsWith('file:')) {
    // SQLite cho local
    const sqliteSchema = schemaContent.replace(
        /provider = "postgresql"/,
        'provider = "sqlite"'
    ).replace(
        /message   String   @db\.Text/,
        'message   String'
    );
    fs.writeFileSync(schemaPath, sqliteSchema);
    console.log('✅ Switched to SQLite for local development');
} else if (dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://')) {
    // PostgreSQL cho production
    const postgresSchema = schemaContent.replace(
        /provider = "sqlite"/,
        'provider = "postgresql"'
    ).replace(
        /message   String$/,
        'message   String   @db.Text'
    );
    fs.writeFileSync(schemaPath, postgresSchema);
    console.log('✅ Switched to PostgreSQL for production');
} else {
    console.log('⚠️  DATABASE_URL not set or unrecognized format');
    console.log('   Using current schema configuration');
}

