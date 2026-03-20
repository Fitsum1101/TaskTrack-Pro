// employeePostionAssignemntService code
// employeePositionService code
const { prisma } = require('../../../config/db');
const ApiError = require('../../../utils/apiError');

/**
 * Helper function to create activity log
 */
const createActivityLog = async (
  userId,
  action,
  entity,
  entityId,
  details,
  req = null
) => {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        details,
        ipAddress: req?.ip || null,
        userAgent: req?.get('user-agent') || null,
      },
    });
  } catch (error) {
    console.error('Failed to create activity log:', error);
  }
};

/**
 * Get all assignments with pagination and filtering
 */
const getAllAssignments = async (filters = {}, pagination = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'assignedAt',
    sortOrder = 'desc',
  } = pagination;

  const {
    userId,
    positionId,
    companyId,
    departmentId,
    startDate,
    endDate,
    search,
  } = filters;

  // Build where clause
  const where = {};

  if (userId) {
    where.userId = userId;
  }
  if (positionId) {
    where.positionId = positionId;
  }

  // Filter by company through user or position
  if (companyId) {
    where.OR = [{ user: { companyId } }, { position: { companyId } }];
  }

  // Filter by department through position
  if (departmentId) {
    where.position = { departmentId };
  }

  // Date range filter
  if (startDate || endDate) {
    where.assignedAt = {};
    if (startDate) {
      where.assignedAt.gte = new Date(startDate);
    }
    if (endDate) {
      where.assignedAt.lte = new Date(endDate);
    }
  }

  // Search by user name or position title
  if (search) {
    where.AND = [
      {
        OR: [
          { user: { first_name: { contains: search, mode: 'insensitive' } } },
          { user: { last_name: { contains: search, mode: 'insensitive' } } },
          { position: { title: { contains: search, mode: 'insensitive' } } },
        ],
      },
    ];
  }

  // Get total count
  const total = await prisma.employeePositionAssignment.count({ where });

  // Get paginated assignments
  const assignments = await prisma.employeePositionAssignment.findMany({
    where,
    skip: (parseInt(page) - 1) * parseInt(limit),
    take: parseInt(limit),
    orderBy: { [sortBy]: sortOrder },
    include: {
      user: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          profile_picture: true,
          company: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      },
      position: {
        include: {
          department: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      },
    },
  });

  // Calculate pagination metadata
  const totalPages = Math.ceil(total / parseInt(limit));
  const hasNextPage = parseInt(page) < totalPages;
  const hasPrevPage = parseInt(page) > 1;

  return {
    assignments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? parseInt(page) + 1 : null,
      prevPage: hasPrevPage ? parseInt(page) - 1 : null,
    },
  };
};

/**
 * Get assignment by ID
 */
const getAssignmentById = async (id) => {
  const assignment = await prisma.employeePositionAssignment.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          profile_picture: true,
          is_active: true,
          company: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      },
      position: {
        include: {
          department: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      },
    },
  });

  if (!assignment) {
    throw ApiError.notFound('Assignment not found');
  }

  return assignment;
};

/**
 * Get assignments by user
 */
const getAssignmentsByUser = async (userId, pagination = {}) => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  return getAllAssignments({ userId }, pagination);
};

/**
 * Get assignments by position
 */
const getAssignmentsByPosition = async (positionId, pagination = {}) => {
  // Check if position exists
  const position = await prisma.employeePosition.findUnique({
    where: { id: positionId },
  });

  if (!position) {
    throw ApiError.notFound('Position not found');
  }

  return getAllAssignments({ positionId }, pagination);
};

/**
 * Create a new assignment
 */
const createAssignment = async (data, req = null) => {
  const { userId, positionId } = data;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { company: true },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Check if position exists
  const position = await prisma.employeePosition.findUnique({
    where: { id: positionId },
    include: { company: true },
  });

  if (!position) {
    throw ApiError.notFound('Position not found');
  }

  // Check if user and position belong to the same company
  if (user.companyId !== position.companyId) {
    throw ApiError.badRequest(
      'User and position must belong to the same company'
    );
  }

  // Check if assignment already exists
  const existingAssignment = await prisma.employeePositionAssignment.findUnique(
    {
      where: {
        userId_positionId: {
          userId,
          positionId,
        },
      },
    }
  );

  if (existingAssignment) {
    throw ApiError.conflict('This user is already assigned to this position');
  }

  // Create assignment
  const assignment = await prisma.employeePositionAssignment.create({
    data: {
      userId,
      positionId,
      assignedAt: new Date(),
    },
    include: {
      user: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
        },
      },
      position: {
        select: {
          id: true,
          title: true,
          department: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return assignment;
};

/**
 * Delete assignment by ID
 */
const deleteAssignment = async (id, req = null) => {
  // Check if assignment exists
  const existingAssignment = await prisma.employeePositionAssignment.findUnique(
    {
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
        position: {
          select: {
            title: true,
          },
        },
      },
    }
  );

  if (!existingAssignment) {
    throw ApiError.notFound('Assignment not found');
  }

  // Delete assignment
  await prisma.employeePositionAssignment.delete({
    where: { id },
  });

  // Log activity
  await createActivityLog(
    existingAssignment.user.id,
    'DELETE',
    'EMPLOYEE_POSITION_ASSIGNMENT',
    id,
    `User ${existingAssignment.user.first_name} ${existingAssignment.user.last_name} removed from position ${existingAssignment.position.title}`,
    req
  );

  return {
    message: 'Assignment deleted successfully',
    id,
  };
};

/**
 * Delete all assignments for a user
 */
const deleteUserAssignments = async (userId, req = null) => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Get count before deletion
  const count = await prisma.employeePositionAssignment.count({
    where: { userId },
  });

  // Delete all assignments
  await prisma.employeePositionAssignment.deleteMany({
    where: { userId },
  });

  // Log activity
  await createActivityLog(
    userId,
    'DELETE',
    'EMPLOYEE_POSITION_ASSIGNMENT',
    userId,
    `All positions (${count}) removed from user ${user.first_name} ${user.last_name}`,
    req
  );

  return {
    message: `Successfully removed ${count} position(s) from user`,
    count,
  };
};

/**
 * Delete all assignments for a position
 */
const deletePositionAssignments = async (positionId, req = null) => {
  // Check if position exists
  const position = await prisma.employeePosition.findUnique({
    where: { id: positionId },
  });

  if (!position) {
    throw ApiError.notFound('Position not found');
  }

  // Get count before deletion
  const count = await prisma.employeePositionAssignment.count({
    where: { positionId },
  });

  // Delete all assignments
  await prisma.employeePositionAssignment.deleteMany({
    where: { positionId },
  });

  // Note: Can't log per-user activity here since multiple users affected
  // You might want to create a system log instead

  return {
    message: `Successfully removed ${count} user(s) from position ${position.title}`,
    count,
  };
};

/**
 * Check if user has a specific position
 */
const checkUserPosition = async (userId, positionId) => {
  const assignment = await prisma.employeePositionAssignment.findUnique({
    where: {
      userId_positionId: {
        userId,
        positionId,
      },
    },
  });

  return !!assignment;
};

/**
 * Get user's current positions
 */
const getUserPositions = async (userId) => {
  const assignments = await prisma.employeePositionAssignment.findMany({
    where: { userId },
    include: {
      position: {
        include: {
          department: {
            select: {
              id: true,
              name: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: { assignedAt: 'desc' },
  });

  return assignments.map((a) => a.position);
};

/**
 * Bulk create assignments
 */
const bulkCreateAssignments = async (assignments, req = null) => {
  const results = {
    successful: [],
    failed: [],
  };

  for (const item of assignments) {
    try {
      const assignment = await createAssignment(item, req);
      results.successful.push(assignment);
    } catch (error) {
      results.failed.push({
        data: item,
        error: error.message,
      });
    }
  }

  return results;
};

module.exports = {
  getAllAssignments,
  getAssignmentById,
  getAssignmentsByUser,
  getAssignmentsByPosition,
  createAssignment,
  deleteAssignment,
  deleteUserAssignments,
  deletePositionAssignments,
  checkUserPosition,
  getUserPositions,
  bulkCreateAssignments,
};
