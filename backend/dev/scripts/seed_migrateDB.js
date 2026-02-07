// dev/scripts/seed_migrateDB.js
require("dotenv").config();
const bcrypt = require("bcrypt");
const { connectDB, getPrisma, disconnectDB } = require("../../src/config/db");

// Import data files
const permissionsData = require("./data/permissionsData");
const rolesData = require("./data/rolesData");
const employeesData = require("./data/employeesData");
const usersData = require("./data/usersData");
const addressesData = require("./data/addressesData");
const emergencyContactsData = require("./data/emergencyContactsData");
const documentsData = require("./data/documentsData");
const allowancesData = require("./data/allowancesData");

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
  const tables = [
    "userPermission",
    "rolePermission",
    "user",
    "emergencyContact",
    "address",
    "document",
    "allowance",
    "employee",
    "permission",
    "role",
  ];

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

const seedPermissions = async (prisma) => {
  logger.info("Seeding permissions...");

  for (const permissionData of permissionsData) {
    await prisma.permission.upsert({
      where: { name: permissionData.name },
      update: permissionData,
      create: permissionData,
    });
  }

  logger.success(`Seeded ${permissionsData.length} permissions`);
};

const seedRoles = async (prisma) => {
  logger.info("Seeding roles...");

  for (const roleData of rolesData) {
    const role = await prisma.role.upsert({
      where: { name: roleData.name },
      update: {
        description: roleData.description,
        requiresAccount: roleData.requiresAccount,
        isDefault: roleData.isDefault,
      },
      create: {
        name: roleData.name,
        description: roleData.description,
        requiresAccount: roleData.requiresAccount,
        isDefault: roleData.isDefault,
      },
    });

    // Add permissions to role
    const permissions = await prisma.permission.findMany({
      where: {
        name: { in: roleData.permissions },
      },
    });

    for (const permission of permissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }

  logger.success(`Seeded ${rolesData.length} roles`);
};

const seedEmployees = async (prisma) => {
  logger.info("Seeding employees...");

  for (const employeeData of employeesData) {
    const role = await prisma.role.findUnique({
      where: { name: employeeData.roleName },
    });

    if (!role) {
      logger.warn(
        `Role ${employeeData.roleName} not found for employee ${employeeData.fullName}`
      );
      continue;
    }

    await prisma.employee.upsert({
      where: { employeeID: employeeData.employeeID },
      update: {
        fullName: employeeData.fullName,
        phoneNumber: employeeData.phoneNumber,
        email: employeeData.email,
        gender: employeeData.gender,
        dateOfBirth: employeeData.dateOfBirth,
        department: employeeData.department,
        position: employeeData.position,
        employmentType: employeeData.employmentType,
        dateOfJoining: employeeData.dateOfJoining,
        baseSalary: employeeData.baseSalary,
        employmentStatus: employeeData.employmentStatus,
        workShift: employeeData.workShift,
        paymentMethod: employeeData.paymentMethod,
        nationalIdNo: employeeData.nationalIdNo,
        roleId: role.id,
      },
      create: {
        fullName: employeeData.fullName,
        phoneNumber: employeeData.phoneNumber,
        email: employeeData.email,
        gender: employeeData.gender,
        dateOfBirth: employeeData.dateOfBirth,
        department: employeeData.department,
        position: employeeData.position,
        employmentType: employeeData.employmentType,
        dateOfJoining: employeeData.dateOfJoining,
        baseSalary: employeeData.baseSalary,
        employmentStatus: employeeData.employmentStatus,
        workShift: employeeData.workShift,
        paymentMethod: employeeData.paymentMethod,
        nationalIdNo: employeeData.nationalIdNo,
        employeeID: employeeData.employeeID,
        roleId: role.id,
      },
    });
  }

  logger.success(`Seeded ${employeesData.length} employees`);
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

const seedAddresses = async (prisma) => {
  logger.info("Seeding addresses...");

  for (const addressData of addressesData) {
    const employee = await prisma.employee.findUnique({
      where: { employeeID: addressData.employeeID },
    });

    if (!employee) {
      logger.warn(`Employee ${addressData.employeeID} not found for address`);
      continue;
    }

    await prisma.address.create({
      data: {
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        zipCode: addressData.zipCode,
        country: addressData.country,
        employeeId: employee.id,
      },
    });
  }

  logger.success(`Seeded ${addressesData.length} addresses`);
};

const seedEmergencyContacts = async (prisma) => {
  logger.info("Seeding emergency contacts...");

  for (const contactData of emergencyContactsData) {
    const employee = await prisma.employee.findUnique({
      where: { employeeID: contactData.employeeID },
    });

    if (!employee) {
      logger.warn(
        `Employee ${contactData.employeeID} not found for emergency contact`
      );
      continue;
    }

    let addressId = null;
    if (contactData.address) {
      const address = await prisma.address.create({
        data: {
          street: contactData.address.street,
          city: contactData.address.city,
          state: contactData.address.state,
          zipCode: contactData.address.zipCode,
          country: contactData.address.country,
          employeeId: employee.id,
        },
      });
      addressId = address.id;
    }

    await prisma.emergencyContact.create({
      data: {
        name: contactData.name,
        relationship: contactData.relationship,
        phoneNumber: contactData.phoneNumber,
        employeeId: employee.id,
        addressId: addressId,
      },
    });
  }

  logger.success(`Seeded ${emergencyContactsData.length} emergency contacts`);
};

const seedDocuments = async (prisma) => {
  logger.info("Seeding documents...");

  for (const documentData of documentsData) {
    const employee = await prisma.employee.findUnique({
      where: { employeeID: documentData.employeeID },
    });

    if (!employee) {
      logger.warn(`Employee ${documentData.employeeID} not found for document`);
      continue;
    }

    await prisma.document.create({
      data: {
        type: documentData.type,
        number: documentData.number,
        fileUrl: documentData.fileUrl,
        issueDate: documentData.issueDate,
        expiryDate: documentData.expiryDate,
        employeeId: employee.id,
      },
    });
  }

  logger.success(`Seeded ${documentsData.length} documents`);
};

const seedAllowances = async (prisma) => {
  logger.info("Seeding allowances...");

  for (const allowanceData of allowancesData) {
    const employee = await prisma.employee.findUnique({
      where: { employeeID: allowanceData.employeeID },
    });

    if (!employee) {
      logger.warn(
        `Employee ${allowanceData.employeeID} not found for allowance`
      );
      continue;
    }

    await prisma.allowance.create({
      data: {
        type: allowanceData.type,
        amount: allowanceData.amount,
        description: allowanceData.description,
        employeeId: employee.id,
      },
    });
  }

  logger.success(`Seeded ${allowancesData.length} allowances`);
};

const seedUserPermissions = async (prisma) => {
  logger.info("Seeding user permissions...");

  for (const userData of usersData) {
    const user = await prisma.user.findUnique({
      where: { username: userData.username },
    });

    if (!user) {
      logger.warn(`User ${userData.username} not found for custom permissions`);
      continue;
    }

    if (
      !userData.customPermissions ||
      userData.customPermissions.length === 0
    ) {
      continue; // skip if no custom permissions
    }

    const permissions = await prisma.permission.findMany({
      where: { name: { in: userData.customPermissions } },
    });

    for (const permission of permissions) {
      await prisma.userPermission.upsert({
        where: {
          userId_permissionId: {
            userId: user.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          permissionId: permission.id,
        },
      });
    }
  }

  logger.success("Seeded user permissions");
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

    await seedPermissions(prisma);
    await seedRoles(prisma);
    await seedEmployees(prisma);
    await seedUsers(prisma);
    await seedAddresses(prisma);
    await seedEmergencyContacts(prisma);
    await seedDocuments(prisma);
    await seedAllowances(prisma);
    await seedUserPermissions(prisma);

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
