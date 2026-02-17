const prisma = require("../lib/prisma");
const ApiError = require("../../../utils/apiError");

/* ======================================================
   VALIDATIONS
====================================================== */

async function validateCompanyExists(companyId) {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    throw ApiError.notFound("Company not found");
  }

  return company;
}

async function validateTeamExists(teamId, companyId) {
  const team = await prisma.team.findFirst({
    where: { id: teamId, companyId },
  });

  if (!team) {
    throw ApiError.notFound("Team not found");
  }

  return team;
}

async function validateTeamNameAvailable(companyId, name) {
  const normalized = name.trim();

  if (!normalized) {
    throw ApiError.badRequest("Team name is required");
  }

  const existing = await prisma.team.findFirst({
    where: {
      companyId,
      name: normalized,
    },
  });

  if (existing) {
    throw ApiError.conflict("Team name already exists in this company");
  }

  return true;
}

/* ======================================================
   CRUD
====================================================== */

async function createTeam(companyId, name) {
  await validateCompanyExists(companyId);
  await validateTeamNameAvailable(companyId, name);

  return await prisma.team.create({
    data: {
      name: name.trim(),
      companyId,
    },
  });
}

async function updateTeam(teamId, companyId, newName) {
  await validateTeamExists(teamId, companyId);
  await validateTeamNameAvailable(companyId, newName);

  return await prisma.team.update({
    where: { id: teamId },
    data: { name: newName.trim() },
  });
}

async function deleteTeam(teamId, companyId) {
  const team = await prisma.team.findFirst({
    where: { id: teamId, companyId },
    include: { projects: true },
  });

  if (!team) {
    throw ApiError.notFound("Team not found");
  }

  if (team.projects.length > 0) {
    throw ApiError.forbidden("Cannot delete team with active projects");
  }

  return await prisma.$transaction(async (tx) => {
    await tx.teamMember.deleteMany({
      where: { teamId },
    });

    return await tx.team.delete({
      where: { id: teamId },
    });
  });
}

/* ======================================================
   PAGINATION + SEARCH
====================================================== */

async function getTeamsByCompany(companyId, options = {}) {
  await validateCompanyExists(companyId);

  const { page = 1, limit = 10, search = "", paginate = true } = options;

  const currentPage = Number(page) > 0 ? Number(page) : 1;
  const take = Number(limit) > 0 ? Number(limit) : 10;
  const skip = (currentPage - 1) * take;

  const whereClause = {
    companyId,
    ...(search && {
      name: {
        contains: search,
        mode: "insensitive",
      },
    }),
  };

  // If pagination disabled
  if (!paginate) {
    const teams = await prisma.team.findMany({
      where: whereClause,
      include: {
        members: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        _count: {
          select: {
            projects: true,
            teamMembers: true,
          },
        },
      },
      orderBy: { id: "desc" },
    });

    return {
      data: teams,
      total: teams.length,
      pagination: null,
    };
  }

  // Pagination enabled
  const [teams, total] = await prisma.$transaction([
    prisma.team.findMany({
      where: whereClause,
      skip,
      take,
      include: {
        members: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        _count: {
          select: {
            projects: true,
            teamMembers: true,
          },
        },
      },
      orderBy: { id: "desc" },
    }),
    prisma.team.count({ where: whereClause }),
  ]);

  return {
    data: teams,
    total,
    pagination: {
      page: currentPage,
      limit: take,
      totalPages: Math.ceil(total / take),
    },
  };
}

module.exports = {
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamsByCompany,
  validateCompanyExists,
  validateTeamExists,
  validateTeamNameAvailable,
};
