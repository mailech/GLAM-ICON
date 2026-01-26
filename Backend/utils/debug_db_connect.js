const dotenv = require('dotenv');
console.log("Loading dotenv...");
dotenv.config({ path: './.env' });

console.log("DATABASE string present:", !!process.env.DATABASE);
console.log("DATABASE_PASSWORD present:", !!process.env.DATABASE_PASSWORD);

try {
    const DB = process.env.DATABASE.replace(
        '<PASSWORD>',
        process.env.DATABASE_PASSWORD
    );
    console.log("Connection string constructed successfully.");
} catch (e) {
    console.error("Error constructing connection string:", e.message);
}
