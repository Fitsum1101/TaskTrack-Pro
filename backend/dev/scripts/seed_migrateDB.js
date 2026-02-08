// dev/scripts/seed_migrateDB.js

const systemAdminData = require("./data/systemAdminData");
const companyData = require("./data/companyData");
const usersData = require("./data/usersData");
const teamsData = require("./data/teamsData");
const projectsData = require("./data/projectsData");
const tasksData = require("./data/tasksData");
const teamMembersData = require("./data/teamMembersData");

require("dotenv").config();
const bcrypt = require("bcrypt");
const { connectDB, getPrisma, disconnectDB } = require("../../src/config/db");

// Import data files

const logger = {
  info: (msg) => console.log(`ℹ️ ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  warn: (msg) => console.warn(`⚠️ ${msg}`),
  error: (msg) => console.error(`❌ ${msg}`),
};

// --- Seeding Functions ---
const clearDatabase = async (prisma) => {
  console.log("🧹 Clearing database...");

  const tables = [
    "Task",
    "Project",
    "TeamMember",
    "Team",
    "User",
    "Company",
    "SystemAdmin",
  ];

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`DELETE FROM \`${table}\`;`);
      console.log(`✅ Cleared ${table} table`);
    } catch (error) {
      console.warn(`⚠️ Could not clear ${table}: ${error.message}`);
    }
  }

  console.log("🎉 Database cleared successfully");
};

const seedSystemAdminData = async (prisma) => {
  logger.info("Seeding system admin data...");

  for (const data of systemAdminData) {
    let hashedPassword = await bcrypt.hash(data.password, 12);

    await prisma.systemAdmin.upsert({
      where: { email: data.email },
      update: {
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
      create: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    });
  }
  logger.success("Seeding system admin data completed");
};

const seedCompanyData = async (prisma) => {
  logger.info("Seeding company data...");

  for (let data of companyData) {
    await prisma.company.upsert({
      where: { name: data.name },
      update: {
        description: data.description,
        address: data.address,
        phone: data.phone,
      },
      create: {
        name: data.name,
        description: data.description,
        address: data.address,
        phone: data.phone,
      },
    });
  }
  logger.success(`Seeded ${companyData.length} companies`);
};

const seedUsers = async (prisma) => {
  logger.info("Seeding users...");

  for (const user of usersData) {
    let hashedPassword = await bcrypt.hash(user.password, 12);

    let companyId = await prisma.company.findUnique({
      where: { name: companyData[user.companyIndex].name },
    });

    if (!companyId) {
      logger.warn(`Company not found for user ${user.username}, skipping...`);
      continue;
    }

    await prisma.user.upsert({
      where: { username: user.username },
      update: {
        password: hashedPassword,
        companyId: companyId.id,
      },
      create: {
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: hashedPassword,
        isActive: user.isActive,
        role: user.role,
        status: user.status,
        companyId: companyId.id,
      },
    });
  }

  logger.success(`Seeded ${usersData.length} users`);
};

const seedTeamsData = async (prisma) => {
  logger.info("Seeding teams data...");

  for (const team of teamsData) {
    const company = await prisma.company.findUnique({
      where: { name: companyData[team.companyIndex].name },
    });
    await prisma.team.upsert({
      where: { companyId_name: { companyId: company.id, name: team.name } },
      update: {
        description: team.description,
        companyId: company.id,
      },
      create: {
        name: team.name,
        description: team.description,
        companyId: company.id,
      },
    });
  }
  logger.success(`Seeded ${teamsData.length} teams`);
};

const seedTeamMembersData = async (prisma) => {
  logger.info("Seeding team members data...");

  for (const tm of teamMembersData) {
    const company = await prisma.company.findUnique({
      where: { name: companyData[tm.companyIndex].name },
    });

    const team = await prisma.team.findUnique({
      where: { companyId_name: { companyId: company.id, name: tm.teamName } },
    });

    for (const teamMemberEmail of tm.memberEmails) {
      const user = await prisma.user.findUnique({
        where: { email: teamMemberEmail },
      });

      if (!user || !team) {
        logger.warn(
          `User or Team not found for member ${teamMemberEmail}, skipping...`,
        );
        continue;
      }

      await prisma.teamMember.upsert({
        where: {
          teamId_userId: {
            teamId: team.id,
            userId: user.id,
          },
        },
        update: {
          userId: user.id,
          teamId: team.id,
        },
        create: {
          userId: user.id,
          teamId: team.id,
        },
      });
    }
  }
  logger.success(`Seeded ${teamMembersData.length} team members`);
};

const seedProjectsData = async (prisma) => {
  logger.info("Seeding projects data...");

  for (const project of projectsData) {
    const company = await prisma.company.findUnique({
      where: { name: companyData[project.companyIndex].name },
    });
    const team = await prisma.team.findUnique({
      where: {
        companyId_name: { companyId: company.id, name: project.teamName },
      },
    });

    const manager = await prisma.user.findUnique({
      where: { email: project.managerEmail },
    });

    if (!team || !manager) {
      logger.warn(
        `Team or Manager not found for project ${project.name}, skipping...`,
      );
      continue;
    }

    await prisma.project.upsert({
      where: { teamId_name: { teamId: team.id, name: project.name } },
      update: {
        description: project.description,
        teamId: team.id,
      },
      create: {
        name: project.name,
        description: project.description,
        teamId: team.id,
        managerId: manager.id,
      },
    });
  }
  logger.success(`Seeded ${projectsData.length} projects`);
};

const seedTasksData = async (prisma) => {
  logger.info("Seeding tasks data...");

  for (const task of tasksData) {
    const company = await prisma.company.findUnique({
      where: { name: companyData[task.companyIndex].name },
    });

    const team = await prisma.team.findUnique({
      where: {
        companyId_name: {
          companyId: company.id,
          name: projectsData.find((pro) => pro.name === task.projectName)
            .teamName,
        },
      },
    });

    const project = await prisma.project.findUnique({
      where: {
        teamId_name: {
          teamId: team.id,
          name: task.projectName,
        },
      },
    });

    const assignedTo = await prisma.user.findUnique({
      where: { email: task.assignedToEmail },
    });
    if (!project || !assignedTo) {
      logger.warn(
        `Project or Assigned User not found for task ${task.title}, skipping...`,
      );
      continue;
    }
    await prisma.task.upsert({
      where: {
        projectId_title: {
          projectId: project.id,
          title: task.title,
        },
      },
      update: {
        description: task.description,
        status: task.status,
        assignedTo: assignedTo.id,
        projectId: project.id,
        progress: task.progress,
      },
      create: {
        title: task.title,
        description: task.description,
        status: task.status,
        assignedTo: assignedTo.id,
        projectId: project.id,
        progress: task.progress,
      },
    });
  }
  logger.success(`Seeded ${tasksData.length} tasks`);
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
    await seedSystemAdminData(prisma);
    await seedCompanyData(prisma);
    await seedUsers(prisma);
    await seedTeamsData(prisma);
    await seedTeamMembersData(prisma);
    await seedProjectsData(prisma);
    await seedTasksData(prisma);

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
