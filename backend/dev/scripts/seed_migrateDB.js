// dev/scripts/seed_migrateDB.js

const companyData = require('./data/companyData');
const employeeData = require('./data/employeeData');
const teamsData = require('./data/teamsData');
const projectsData = require('./data/projectsData');
const tasksData = require('./data/tasksData');
const teamMembersData = require('./data/teamMembersData');
const employeePositionData = require('./data/employeePostion');
const employeePostionAssignment = require('./data/employeePostionAssignment');
const taskCommentData = require('./data/taskComment');
const moduleData = require('./data/moduleData');
const taskAssignmentData = require('./data/taskAssignmentData');

require('dotenv').config();
const bcrypt = require('bcrypt');
const { connectDB, getPrisma, disconnectDB } = require('../../src/config/db');

// Import data files

const logger = {
  info: (msg) => console.log(`ℹ️ ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  warn: (msg) => console.warn(`⚠️ ${msg}`),
  error: (msg) => console.error(`❌ ${msg}`),
};

// --- Seeding Functions ---
const clearDatabase = async (prisma) => {
  console.log('🧹 Clearing database...');

  const tables = [
    'Task',
    'Project',
    'TeamMember',
    'Team',
    'employee',
    'Company',
    'SystemAdmin',
  ];

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`DELETE FROM \`${table}\`;`);
      console.log(`✅ Cleared ${table} table`);
    } catch (error) {
      console.warn(`⚠️ Could not clear ${table}: ${error.message}`);
    }
  }

  console.log('🎉 Database cleared successfully');
};

const seedCompanyData = async (prisma) => {
  logger.info('Seeding company data...');

  for (const data of companyData) {
    await prisma.company.upsert({
      where: { name: data.name },
      update: {
        status: data.status || 'APPROVED',
        address: data.address,
        phone: data.phone,
        description: data.description,
      },
      create: {
        name: data.name,
        status: data.status || 'APPROVED',
        address: data.address,
        phone: data.phone,
        description: data.description,
        email: data.email,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  logger.success(`Seeded ${companyData.length} companies`);
};

const seedemployees = async (prisma) => {
  logger.info('Seeding employees...');

  for (const employee of employeeData) {
    let hashedPassword = await bcrypt.hash(employee.password, 12);

    let companyId = await prisma.company.findUnique({
      where: { name: companyData[employee.companyIndex].name },
    });

    if (!companyId) {
      logger.warn(
        `Company not found for employee ${employee.email}, skipping...`
      );
      continue;
    }

    await prisma.employee.upsert({
      where: { email: employee.email },
      update: {
        password_hash: hashedPassword,
        companyId: companyId.id,
      },
      create: {
        email: employee.email,
        first_name: employee.firstName,
        last_name: employee.lastName,
        password_hash: hashedPassword,
        is_active: employee.isActive,
        role_type: employee.role,
        companyId: companyId.id,
      },
    });
  }

  logger.success(`Seeded ${employeeData.length} employees`);
};

const seedEmployeePositions = async (prisma) => {
  logger.info('Seeding employee positions...');

  for (const pos of employeePositionData) {
    const company = await prisma.company.findFirst({
      where: {
        name: companyData[pos.companyIndex].name,
      },
    });

    if (!company) {
      logger.warn(`Company not found for position ${pos.name}, skipping...`);
      continue;
    }

    await prisma.employeePosition.upsert({
      where: {
        companyId_name: {
          companyId: company.id,
          name: pos.name,
        },
      },
      update: {
        description: pos.description,
        is_active: true,
        updatedAt: new Date(),
      },
      create: {
        companyId: company.id,
        name: pos.name,
        description: pos.description,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  logger.success(`Seeded ${employeePositionData.length} positions`);
};

const seedEmployeePositionAssignments = async (prisma) => {
  logger.info('Seeding employee position assignments...');

  for (const item of employeePostionAssignment) {
    const employee = await prisma.employee.findUnique({
      where: {
        email: employeeData[item.userIndex].email,
      },
    });

    if (!employee) {
      logger.warn('employee not found, skipping assignment...');
      continue;
    }

    const position = await prisma.employeePosition.findFirst({
      where: {
        name: employeePositionData[item.positionIndex].name,
      },
    });

    if (!position) {
      logger.warn('Position not found, skipping assignment...');
      continue;
    }

    await prisma.employeePositionAssignment.upsert({
      where: {
        employeeId_positionId: {
          employeeId: employee.id,
          positionId: position.id,
        },
      },
      update: {
        assignedAt: new Date(),
      },
      create: {
        employeeId: employee.id,
        positionId: position.id,
        assignedAt: new Date(),
      },
    });
  }

  logger.success(
    `Seeded ${employeePostionAssignment.length} position assignments`
  );
};

const seedTeamsData = async (prisma) => {
  logger.info('Seeding teams data...');

  for (const team of teamsData) {
    const company = await prisma.company.findFirst({
      where: { name: companyData[team.companyIndex].name },
    });

    await prisma.team.upsert({
      where: {
        companyId_name: {
          companyId: company.id,
          name: team.name,
        },
      },
      update: {
        description: team.description,
        companyId: company.id,
      },
      create: {
        name: team.name,
        description: team.description,
        companyId: company.id,
        createdBy: '102292ii',
      },
    });
  }
  logger.success(`Seeded ${teamsData.length} teams`);
};

const seedTeamMembersData = async (prisma) => {
  logger.info('Seeding team members data...');

  for (const tm of teamMembersData) {
    const company = await prisma.company.findUnique({
      where: { name: companyData[tm.companyIndex].name },
    });

    const team = await prisma.team.findFirst({
      where: {
        companyId: company.id,
        name: tm.teamName,
      },
    });

    const employee = await prisma.employee.findUnique({
      where: {
        email: employeeData.find(
          (employee) => employee.employee === tm.username
        ).email,
      },
    });

    await prisma.teamMembers.upsert({
      where: {
        teamId_employeeId: {
          teamId: team.id,
          employeeId: employee.id,
        },
      },
      update: {
        employeeId: employee.id,
        teamId: team.id,
      },
      create: {
        employeeId: employee.id,
        teamId: team.id,
      },
    });
  }
  logger.success(`Seeded ${teamMembersData.length} team members`);
};

const seedProjectsData = async (prisma) => {
  logger.info('Seeding projects data...');

  for (const project of projectsData) {
    const company = await prisma.company.findFirst({
      where: { name: companyData[project.companyIndex].name },
    });
    const team = await prisma.team.findUnique({
      where: {
        companyId_name: { companyId: company.id, name: project.teamName },
      },
    });

    const manager = await prisma.employee.findUnique({
      where: {
        email: employeeData.find(
          (employee) => employee.username === project.createdByemployeename
        ).email,
      },
    });

    if (!team || !manager) {
      logger.warn(
        `Team or Manager not found for project ${project.name}, skipping...`
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
        companyId: company.id,
        name: project.name,
        description: project.description,
        teamId: team.id,
        createdBy: manager.id,
      },
    });
  }
  logger.success(`Seeded ${projectsData.length} projects`);
};

const seedModules = async (prisma) => {
  logger.info('Seeding modules...');

  for (const module of moduleData) {
    const project = await prisma.project.findFirst({
      where: {
        name: projectsData[module.projectIndex].name,
      },
    });

    if (!project) {
      logger.warn(`Project not found for module ${module.name}, skipping...`);
      continue;
    }

    await prisma.module.upsert({
      where: {
        // fallback unique key
        projectId_name: {
          name: module.name,
          projectId: project.id,
        },
      },
      update: {
        description: module.description,
      },
      create: {
        name: module.name,
        description: module.description,
        projectId: project.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  logger.success(`Seeded ${moduleData.length} modules`);
};

const seedTasks = async (prisma) => {
  logger.info('Seeding tasks...');

  for (const task of tasksData) {
    const module = await prisma.module.findFirst({
      where: {
        name: moduleData[task.moduleIndex].name,
      },
    });

    if (!module) {
      logger.warn(`Module not found for task ${task.title}, skipping...`);
      continue;
    }

    const employee = await prisma.employee.findUnique({
      where: {
        email: employeeData[task.assignedByIndex].email,
      },
    });

    if (!employee) {
      logger.warn(`employee not found for task ${task.title}, skipping...`);
      continue;
    }

    await prisma.task.upsert({
      where: {
        moduleId_title: {
          moduleId: module.id,
          title: task.title,
        },
      },
      update: {
        description: task.description,
        status: task.status || 'TODO',
        priority: task.priority || 'MEDIUM',
        dueDate: task.dueDate || null,
        estimatedHours: task.estimatedHours || null,
        actualHours: task.actualHours || null,
        completedAt: task.completedAt || null,
        updatedAt: new Date(),
      },
      create: {
        moduleId: module.id,
        title: task.title,
        description: task.description,
        assignedById: employee.id,
        status: task.status || 'TODO',
        priority: task.priority || 'MEDIUM',
        dueDate: task.dueDate || null,
        estimatedHours: task.estimatedHours || null,
        actualHours: task.actualHours || null,
        completedAt: task.completedAt || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  logger.success(`Seeded ${tasksData.length} tasks`);
};

const seedTaskAssignments = async (prisma) => {
  logger.info('Seeding task assignments...');

  for (const item of taskAssignmentData) {
    const task = await prisma.task.findFirst({
      where: {
        title: tasksData[item.taskIndex].title,
      },
    });

    if (!task) {
      logger.warn('Task not found for assignment, skipping...');
      continue;
    }

    const teamMember = await prisma.teamMembers.findFirst({
      where: {
        employeeId: teamMembersData[item.teamMemberIndex].employeeId, // depends on your seed
      },
    });

    if (!teamMember) {
      logger.warn('Team member not found, skipping...');
      continue;
    }

    await prisma.taskAssignment.upsert({
      where: {
        taskId_teamMemberId: {
          taskId: task.id,
          teamMemberId: teamMember.id,
        },
      },
      update: {
        status: item.status || 'TODO',
        estimatedHours: item.estimatedHours || null,
        actualHours: item.actualHours || null,
      },
      create: {
        taskId: task.id,
        teamMemberId: teamMember.id,
        assignedAt: new Date(),
        status: item.status || 'TODO',
        estimatedHours: item.estimatedHours || null,
        actualHours: item.actualHours || null,
      },
    });
  }

  logger.success(`Seeded ${taskAssignmentData.length} task assignments`);
};

const seedTaskComments = async (prisma) => {
  logger.info('Seeding task comments...');

  const assignments = await prisma.taskAssignment.findMany();

  for (const item of taskCommentData) {
    const assignment = assignments[item.taskAssignmentIndex];

    if (!assignment) {
      logger.warn('TaskAssignment not found for comment, skipping...');
      continue;
    }

    await prisma.taskComment.create({
      data: {
        taskAssignmentId: assignment.id,
        comment: item.comment,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  logger.success(`Seeded ${taskCommentData.length} task comments`);
};

// --- Main Seeding Function ---
const seedData = async () => {
  const clearData = process.argv.includes('--clear');
  let prisma;

  try {
    logger.info('Connecting to database...');
    await connectDB();
    prisma = getPrisma();

    if (clearData) {
      await clearDatabase(prisma);
    }
    await seedCompanyData(prisma);
    await seedemployees(prisma);
    await seedEmployeePositions(prisma);
    await seedEmployeePositionAssignments(prisma);
    await seedTeamsData(prisma);
    await seedTeamMembersData(prisma);
    await seedProjectsData(prisma);
    await seedModules(prisma);
    await seedTasks(prisma);
    await seedTaskAssignments(prisma);
    await seedTaskComments(prisma);

    logger.success('✅ Database seeding completed successfully!');
  } catch (error) {
    logger.error('Seeding failed:');
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
    logger.info('Database connection closed.');
  }
};

// Run the seeding
seedData();
