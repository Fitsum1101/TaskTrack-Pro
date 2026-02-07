// dev/scripts/seed_migrateDB.js
require("dotenv").config();
const bcrypt = require("bcrypt");
const { connectDB, getPrisma, disconnectDB } = require("../../src/config/db");

// Import data files

const usersData = require("./data/usersData");

const logger = {
  info: (msg) => console.log(`ℹ️ ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  warn: (msg) => console.warn(`⚠️ ${msg}`),
  error: (msg) => console.error(`❌ ${msg}`),
};

// --- Seeding Functions ---
const clearDatabase = async (prisma) => {
  logger.info("Clearing database...");

  // Delete in correct order to respect foreign key constraints
  const tables = ["user"];

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`DELETE FROM ${table};`);
      logger.info(`Cleared ${table} table`);
    } catch (error) {
      logger.warn(`Could not clear ${table}: ${error.message}`);
    }
  }

  logger.success("Database cleared");
};

const seedUsers = async (prisma) => {
  logger.info("Seeding users...");

  for (const userData of usersData) {
    const role = await prisma.role.findUnique({
      where: { name: userData.roleName },
    });

    const employee = await prisma.employee.findUnique({
      where: { employeeID: userData.employeeID },
    });

    if (!role || !employee) {
      logger.warn(`Role or employee not found for user ${userData.username}`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);

    await prisma.user.upsert({
      where: { username: userData.username },
      update: {
        password: hashedPassword,
        isActive: userData.isActive,
        roleId: role.id,
        employeeId: employee.id,
      },
      create: {
        username: userData.username,
        password: hashedPassword,
        isActive: userData.isActive,
        roleId: role.id,
        employeeId: employee.id,
      },
    });
  }

  logger.success(`Seeded ${usersData.length} users`);
};

// --- Main Seeding Function ---
const seedData = async () => {
  const clearData = process.argv.includes("--clear");
  let prisma;

  try {
    logger.info("Connecting to database...");
    await connectDB();
    prisma = getPrisma();

    if (clearData) {
      await clearDatabase(prisma);
    }

    await seedUsers(prisma);

    logger.success("✅ Database seeding completed successfully!");
  } catch (error) {
    logger.error("Seeding failed:");
    logger.error(error.message);
    if (error.code) {
      logger.error(`Error code: ${error.code}`);
    }
    if (error.stack) {
      logger.error(error.stack);
    }
  } finally {
    if (prisma) {
      await disconnectDB();
    }
    logger.info("Database connection closed.");
  }
};

// Run the seeding
seedData();
