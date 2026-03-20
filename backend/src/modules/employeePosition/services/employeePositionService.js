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
 * Get all positions with pagination and filtering
 */
const getAllPositions = async (filters = {}, pagination = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = pagination;

  const { search, companyId, is_active, startDate, endDate } = filters;

  // Build where clause
  const where = {};

  // Company filter
  if (companyId) {
    where.companyId = companyId;
  }

  // Status filter
  if (is_active !== undefined && is_active !== '') {
    where.is_active = is_active === 'true' || is_active === true;
  }

  // Date range filter
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      where.createdAt.gte = new Date(startDate);
    }
    if (endDate) {
      where.createdAt.lte = new Date(endDate);
    }
  }

  // Search functionality
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Get total count for pagination
  const total = await prisma.employeePosition.count({ where });

  // Get paginated positions with relations
  const positions = await prisma.employeePosition.findMany({
    where,
    skip: (parseInt(page) - 1) * parseInt(limit),
    take: parseInt(limit),
    orderBy: { [sortBy]: sortOrder },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          code: true,
          logo: true,
        },
      },
      employees: {
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              profile_picture: true,
            },
          },
        },
        take: 5, // Limit to recent assignments
      },
      _count: {
        select: {
          employees: true,
        },
      },
    },
  });

  // Calculate pagination metadata
  const totalPages = Math.ceil(total / parseInt(limit));
  const hasNextPage = parseInt(page) < totalPages;
  const hasPrevPage = parseInt(page) > 1;

  return {
    positions,
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
    filters: {
      applied: {
        search: search || null,
        companyId: companyId || null,
        is_active: is_active !== undefined ? is_active : null,
        dateRange: startDate || endDate ? { startDate, endDate } : null,
      },
    },
  };
};

/**
 * Get position by ID
 */
const getPositionById = async (id) => {
  const position = await prisma.employeePosition.findUnique({
    where: { id },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          code: true,
          logo: true,
          address: true,
          phone: true,
          email: true,
        },
      },
      employees: {
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              profile_picture: true,
              is_active: true,
            },
          },
        },
        orderBy: { assignedAt: 'desc' },
      },
      _count: {
        select: {
          employees: true,
        },
      },
    },
  });

  if (!position) {
    throw ApiError.notFound('Position not found');
  }

  return position;
};

/**
 * Get positions by company
 */
const getPositionsByCompany = async (
  companyId,
  filters = {},
  pagination = {}
) => {
  if (!companyId) {
    throw ApiError.badRequest('Company ID is required');
  }

  // Verify company exists
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    throw ApiError.notFound('Company not found');
  }

  return getAllPositions({ ...filters, companyId }, pagination);
};

/**
 * Create a new position
 */
const createPosition = async (data, req = null) => {
  const { companyId, name, description, is_active } = data;

  // Verify company exists
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    throw ApiError.notFound('Company not found');
  }

  // Check if position with same name exists in the company
  const existingPosition = await prisma.employeePosition.findUnique({
    where: {
      companyId_name: {
        companyId,
        name,
      },
    },
  });

  if (existingPosition) {
    throw ApiError.conflict(
      `Position "${name}" already exists in this company`
    );
  }

  // Create position
  const position = await prisma.employeePosition.create({
    data: {
      companyId,
      name,
      description: description || null,
      is_active: is_active ?? true,
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
    },
  });

  // Log activity
  await createActivityLog(
    req?.user?.id || 'system',
    'CREATE',
    'EMPLOYEE_POSITION',
    position.id,
    `Position "${position.name}" created in company ${company.name}`,
    req
  );

  return position;
};

/**
 * Update position by ID
 */
const updatePosition = async (id, updateData, req = null) => {
  // Check if position exists
  const existingPosition = await prisma.employeePosition.findUnique({
    where: { id },
    include: {
      company: true,
    },
  });

  if (!existingPosition) {
    throw ApiError.notFound('Position not found');
  }

  // If name is being updated, check for duplicates in the same company
  if (updateData.name && updateData.name !== existingPosition.name) {
    const duplicatePosition = await prisma.employeePosition.findUnique({
      where: {
        companyId_name: {
          companyId: existingPosition.companyId,
          name: updateData.name,
        },
      },
    });

    if (duplicatePosition) {
      throw ApiError.conflict(
        `Position "${updateData.name}" already exists in this company`
      );
    }
  }

  // Prepare update data
  const dataToUpdate = {};
  const allowedFields = ['name', 'description', 'is_active'];

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      dataToUpdate[field] = updateData[field];
    }
  });

  dataToUpdate.updatedAt = new Date();

  // Update position
  const position = await prisma.employeePosition.update({
    where: { id },
    data: dataToUpdate,
    include: {
      company: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
    },
  });

  // Log activity
  await createActivityLog(
    req?.user?.id || 'system',
    'UPDATE',
    'EMPLOYEE_POSITION',
    position.id,
    `Position "${position.name}" updated`,
    req
  );

  return position;
};

/**
 * Delete position by ID (soft delete by setting is_active to false)
 */
const deletePosition = async (id, req = null) => {
  // Check if position exists
  const existingPosition = await prisma.employeePosition.findUnique({
    where: { id },
    include: {
      employees: {
        select: { id: true },
      },
    },
  });

  if (!existingPosition) {
    throw ApiError.notFound('Position not found');
  }

  // Check if already inactive
  if (!existingPosition.is_active) {
    throw ApiError.badRequest('Position is already inactive');
  }

  // Check if position has active employees
  if (existingPosition.employees.length > 0) {
    throw ApiError.badRequest(
      'Cannot deactivate position with assigned employees. Please reassign employees first.'
    );
  }

  // Soft delete by setting is_active to false
  const position = await prisma.employeePosition.update({
    where: { id },
    data: {
      is_active: false,
      updatedAt: new Date(),
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
    },
  });

  // Log activity
  await createActivityLog(
    req?.user?.id || 'system',
    'DELETE',
    'EMPLOYEE_POSITION',
    position.id,
    `Position "${position.name}" deactivated`,
    req
  );

  return position;
};

/**
 * Hard delete position by ID (permanent deletion)
 */
const hardDeletePosition = async (id, req = null) => {
  // Check if position exists
  const existingPosition = await prisma.employeePosition.findUnique({
    where: { id },
    include: {
      employees: {
        select: { id: true },
      },
    },
  });

  if (!existingPosition) {
    throw ApiError.notFound('Position not found');
  }

  // Check if position has any employees
  if (existingPosition.employees.length > 0) {
    throw ApiError.badRequest(
      'Cannot permanently delete position with assigned employees. Please reassign employees first.'
    );
  }

  // Store info for logging
  const positionInfo = {
    id: existingPosition.id,
    name: existingPosition.name,
    companyId: existingPosition.companyId,
  };

  // Delete position
  await prisma.employeePosition.delete({
    where: { id },
  });

  return {
    message: 'Position permanently deleted',
    positionId: id,
    name: positionInfo.name,
  };
};

/**
 * Update position status (activate/deactivate)
 */
const updatePositionStatus = async (id, isActive, req = null) => {
  // Check if position exists
  const existingPosition = await prisma.employeePosition.findUnique({
    where: { id },
    include: {
      employees: {
        select: { id: true },
      },
    },
  });

  if (!existingPosition) {
    throw ApiError.notFound('Position not found');
  }

  // Check if status is already the same
  if (existingPosition.is_active === isActive) {
    throw ApiError.badRequest(
      `Position is already ${isActive ? 'active' : 'inactive'}`
    );
  }

  // If deactivating, check for active employees
  if (!isActive && existingPosition.employees.length > 0) {
    throw ApiError.badRequest(
      'Cannot deactivate position with assigned employees. Please reassign employees first.'
    );
  }

  // Update status
  const position = await prisma.employeePosition.update({
    where: { id },
    data: {
      is_active: isActive,
      updatedAt: new Date(),
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
    },
  });

  // Log activity
  await createActivityLog(
    req?.user?.id || 'system',
    'UPDATE',
    'EMPLOYEE_POSITION',
    position.id,
    `Position "${position.name}" ${isActive ? 'activated' : 'deactivated'}`,
    req
  );

  return position;
};

/**
 * Bulk create positions
 */
const bulkCreatePositions = async (positions, req = null) => {
  const results = {
    successful: [],
    failed: [],
  };

  for (const positionData of positions) {
    try {
      const position = await createPosition(positionData, req);
      results.successful.push(position);
    } catch (error) {
      results.failed.push({
        data: positionData,
        error: error.message,
      });
    }
  }

  return results;
};

/**
 * Get position statistics
 */
const getPositionStats = async (companyId = null) => {
  const where = companyId ? { companyId } : {};

  const [
    totalPositions,
    activePositions,
    inactivePositions,
    positionsWithEmployees,
    totalAssignments,
  ] = await Promise.all([
    // Total positions
    prisma.employeePosition.count({ where }),

    // Active positions
    prisma.employeePosition.count({
      where: { ...where, is_active: true },
    }),

    // Inactive positions
    prisma.employeePosition.count({
      where: { ...where, is_active: false },
    }),

    // Positions with at least one employee
    prisma.employeePosition.count({
      where: {
        ...where,
        employees: { some: {} },
      },
    }),

    // Total assignments across all positions
    prisma.employeePositionAssignment.count({
      where: {
        position: companyId ? { companyId } : {},
      },
    }),
  ]);

  // Get most popular positions (top 5)
  const popularPositions = await prisma.employeePosition.findMany({
    where,
    include: {
      _count: {
        select: { employees: true },
      },
    },
    orderBy: {
      employees: {
        _count: 'desc',
      },
    },
    take: 5,
  });

  const stats = {
    totalPositions,
    activePositions,
    inactivePositions,
    positionsWithEmployees,
    totalAssignments,
    averageEmployeesPerPosition:
      positionsWithEmployees > 0
        ? (totalAssignments / positionsWithEmployees).toFixed(2)
        : 0,
    popularPositions: popularPositions.map((p) => ({
      id: p.id,
      name: p.name,
      employeeCount: p._count.employees,
    })),
  };

  return stats;
};

module.exports = {
  getAllPositions,
  getPositionById,
  getPositionsByCompany,
  createPosition,
  updatePosition,
  deletePosition,
  hardDeletePosition,
  updatePositionStatus,
  bulkCreatePositions,
  getPositionStats,
};
