// Script để setup DATABASE_URL từ POSTGRES_PRISMA_URL nếu chưa có
if (!process.env.DATABASE_URL && process.env.POSTGRES_PRISMA_URL) {
    process.env.DATABASE_URL = process.env.POSTGRES_PRISMA_URL;
    console.log('✅ Using POSTGRES_PRISMA_URL as DATABASE_URL');
}

if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set and POSTGRES_PRISMA_URL is also not available');
    console.error('Please set DATABASE_URL in Vercel Environment Variables');
    process.exit(1);
}

console.log('✅ DATABASE_URL is set');

