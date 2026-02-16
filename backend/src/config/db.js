// src/config/db.js
const { PrismaClient } = require("../../generated/prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  // connectionLimit: 5,
});

// Singleton pattern for PrismaClient
const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("✅ Using existing Prisma connection");
    return prisma;
  }
  try {
    // Test connection with a simple query
    await prisma.$queryRaw`SELECT 1`;
    isConnected = true;
    console.log("🎯 Prisma connected to MySQL database");
    return prisma;
  } catch (error) {
    console.error("❌ Prisma connection error:", error.message);

    if (error.code === "P1001") {
      console.error(
        "❌ Cannot connect to MySQL server. Check if MySQL is running.",
      );
    } else if (error.code === "P1017") {
      console.error(
        "❌ Database connection closed. Check your MySQL credentials.",
      );
    }

    isConnected = false;
    throw error;
  }
};

const getPrisma = () => {
  return prisma;
};

const checkConnection = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { connected: true };
  } catch (error) {
    isConnected = false;
    return { connected: false, error: error.message };
  }
};

const disconnectDB = async () => {
  await prisma.$disconnect();
  isConnected = false;
  console.log("✅ Prisma connection closed");
};

module.exports = {
  connectDB,
  checkConnection,
  getPrisma,
  disconnectDB,
  prisma, // Export the instance directly
};
