// employeeService code
const { prisma } = require('../../../config/db');
const ApiError = require('../../../utils/apiError');
const bcrypt = require('bcryptjs');

/**
 * Get all employees with advanced search, filtering and pagination
 */
const getAllEmployees = async (filters = {}, pagination = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = pagination;

  const {
    search,
    role_type,
    is_active,
    startDate,
    endDate,
    firstName,
    lastName,
    email,
    phone,
  } = filters;

  // Build where clause dynamically
  const where = {};

  // Role type filter
  if (role_type) {
    where.role_type = role_type;
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

  // Advanced search functionality
  if (search) {
    where.OR = [
      { first_name: { contains: search, mode: 'insensitive' } },
      { last_name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Specific field filters (if provided individually)
  if (firstName && !search) {
    where.first_name = { contains: firstName, mode: 'insensitive' };
  }

  if (lastName && !search) {
    where.last_name = { contains: lastName, mode: 'insensitive' };
  }

  if (email && !search) {
    where.email = { contains: email, mode: 'insensitive' };
  }

  if (phone && !search) {
    where.phone = { contains: phone, mode: 'insensitive' };
  }

  // Get total count for pagination
  const total = await prisma.employee.count({ where });

  // Get paginated employees with relations
  const employees = await prisma.employee.findMany({
    where,
    skip: (parseInt(page) - 1) * parseInt(limit),
    take: parseInt(limit),
    orderBy: { [sortBy]: sortOrder },
    include: {
      company: {
        select: {
          id: true,
          name: true,
        },
      },
      employeePositionAssignment: {
        include: {
          position: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        take: 5,
      },
      teamMemberships: {
        include: {
          team: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
        take: 5,
      },
      _count: {
        select: {
          tasksCreated: true,
          attachments: true,
          activityLogs: true,
          notification: true,
        },
      },
    },
  });

  // Remove password hashes from response
  const sanitizedEmployees = employees.map((employee) => {
    const { password_hash, ...employeeWithoutPassword } = employee;
    return employeeWithoutPassword;
  });

  // Calculate pagination metadata
  const totalPages = Math.ceil(total / parseInt(limit));
  const hasNextPage = parseInt(page) < totalPages;
  const hasPrevPage = parseInt(page) > 1;

  return {
    employees: sanitizedEmployees,
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
        role_type: role_type || null,
        is_active: is_active !== undefined ? is_active : null,
        dateRange: startDate || endDate ? { startDate, endDate } : null,
      },
      available: {
        role_types: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'GUEST'],
        sortFields: [
          'createdAt',
          'updatedAt',
          'first_name',
          'last_name',
          'email',
        ],
      },
    },
  };
};

/**
 * Get employees by company with pagination
 */
const getEmployeesByCompany = async (
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

  return getAllEmployees({ ...filters, companyId }, pagination);
};

/**
 * Get employees by role with pagination
 */
const getEmployeesByRole = async (roleType, filters = {}, pagination = {}) => {
  if (!roleType) {
    throw ApiError.badRequest('Role type is required');
  }

  const validRoles = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'GUEST'];
  if (!validRoles.includes(roleType)) {
    throw ApiError.badRequest(
      `Invalid role type. Must be one of: ${validRoles.join(', ')}`
    );
  }

  return getAllEmployees({ ...filters, role_type: roleType }, pagination);
};

/**
 * Search employees by keyword with pagination
 */
const searchEmployees = async (keyword, filters = {}, pagination = {}) => {
  if (!keyword || keyword.trim().length < 2) {
    throw ApiError.badRequest('Search keyword must be at least 2 characters');
  }

  return getAllEmployees({ ...filters, search: keyword }, pagination);
};

/**
 * Get employee by ID
 */
const getEmployeeById = async (id) => {
  const employee = await prisma.employee.findUnique({
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
      employeePositionAssignment: {
        include: {
          position: {
            include: {
              department: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      teamMemberships: {
        include: {
          team: {
            include: {
              department: true,
            },
          },
        },
      },
      tasksCreated: {
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          dueDate: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      attachments: {
        select: {
          id: true,
          fileName: true,
          fileType: true,
          fileSize: true,
          url: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      authTokens: {
        select: {
          id: true,
          type: true,
          createdAt: true,
          expiresAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      activityLogs: {
        select: {
          id: true,
          action: true,
          entity: true,
          entityId: true,
          details: true,
          ipAddress: true,
          userAgent: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      notification: {
        select: {
          id: true,
          title: true,
          message: true,
          type: true,
          isRead: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      _count: {
        select: {
          tasksCreated: true,
          attachments: true,
          activityLogs: true,
          notification: true,
          authTokens: true,
        },
      },
    },
  });

  if (!employee) {
    throw ApiError.notFound('Employee not found');
  }

  const { password_hash, ...employeeWithoutPassword } = employee;
  console.log(password_hash);

  return employeeWithoutPassword;
};

/**
 * Create a new employee
 */
const createEmployee = async (employeeData) => {
  // Check if email already exists
  const existingEmployee = await prisma.employee.findUnique({
    where: { email: employeeData.email.toLowerCase() },
  });

  if (existingEmployee) {
    throw ApiError.conflict('Email already exists');
  }

  // Verify company exists
  const company = await prisma.company.findUnique({
    where: { id: employeeData.companyId },
  });

  if (!company) {
    throw ApiError.notFound('Company not found');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(employeeData.password, 12);

  // Create employee
  const employee = await prisma.employee.create({
    data: {
      companyId: employeeData.companyId,
      first_name: employeeData.first_name,
      last_name: employeeData.last_name,
      email: employeeData.email.toLowerCase(),
      password_hash: hashedPassword,
      phone: employeeData.phone || null,
      profile_picture: employeeData.profile_picture || null,
      role_type: employeeData.role_type || 'EMPLOYEE',
      is_active: employeeData.is_active ?? true,
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          code: true,
          logo: true,
        },
      },
    },
  });

  const { password_hash, ...employeeWithoutPassword } = employee;

  console.log(password_hash);

  return employeeWithoutPassword;
};

/**
 * Update employee by ID
 */
const updateEmployee = async (id, updateData) => {
  // Check if employee exists
  const existingEmployee = await prisma.employee.findUnique({
    where: { id },
  });

  if (!existingEmployee) {
    throw ApiError.notFound('Employee not found');
  }

  // If companyId is being updated, verify company exists
  if (
    updateData.companyId &&
    updateData.companyId !== existingEmployee.companyId
  ) {
    const company = await prisma.company.findUnique({
      where: { id: updateData.companyId },
    });

    if (!company) {
      throw ApiError.notFound('Company not found');
    }
  }

  // Update employee
  const employee = await prisma.employee.update({
    where: { id },
    data: updateData,
    include: {
      company: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Log employee update activity

  const { password_hash, ...employeeWithoutPassword } = employee;
  console.log(password_hash);

  return employeeWithoutPassword;
};

/**
 * Delete employee by ID (soft delete by setting is_active to false)
 */
const deleteEmployee = async (id) => {
  // Check if employee exists
  const existingEmployee = await prisma.employee.findUnique({
    where: { id },
  });

  if (!existingEmployee) {
    throw ApiError.notFound('Employee not found');
  }

  // Check if already inactive
  if (!existingEmployee.is_active) {
    throw ApiError.badRequest('Employee is already inactive');
  }

  // Soft delete by setting is_active to false
  const employee = await prisma.employee.update({
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

  // Invalidate all refresh tokens for this employee
  await prisma.authToken.updateMany({
    where: {
      userId: employee.id,
      type: 'REFRESH',
    },
    data: {
      isValid: false,
    },
  });

  const { password_hash, ...employeeWithoutPassword } = employee;
  return employeeWithoutPassword;
};

/**
 * Hard delete employee by ID (use with caution - permanent deletion)
 */
const hardDeleteEmployee = async (id, req = null) => {
  // Check if employee exists
  const existingEmployee = await prisma.employee.findUnique({
    where: { id },
    include: {
      tasksCreated: { select: { id: true } },
      attachments: { select: { id: true } },
      activityLogs: { select: { id: true } },
      notification: { select: { id: true } },
      authTokens: { select: { id: true } },
      employeePositionAssignment: { select: { id: true } },
      teamMemberships: { select: { id: true } },
    },
  });

  if (!existingEmployee) {
    throw ApiError.notFound('Employee not found');
  }

  // Check if employee has any critical data that would be orphaned
  const hasCriticalData =
    existingEmployee.tasksCreated.length > 0 ||
    existingEmployee.attachments.length > 0;

  if (hasCriticalData) {
    throw ApiError.badRequest(
      'Cannot permanently delete employee with existing tasks or attachments. ' +
        'Please reassign or delete related data first.'
    );
  }

  // Store employee info for activity log before deletion
  const employeeInfo = {
    id: existingEmployee.id,
    email: existingEmployee.email,
    first_name: existingEmployee.first_name,
    last_name: existingEmployee.last_name,
  };

  // Delete related records first (cascade manually if not set in schema)
  await prisma.$transaction([
    // Delete auth tokens
    prisma.authToken.deleteMany({ where: { userId: id } }),

    // Delete notifications
    prisma.notification.deleteMany({ where: { userId: id } }),

    // Delete activity logs
    prisma.activityLog.deleteMany({ where: { userId: id } }),

    // Delete position assignments
    prisma.employeePositionAssignment.deleteMany({ where: { userId: id } }),

    // Delete team memberships
    prisma.teamMembers.deleteMany({ where: { userId: id } }),

    // Finally delete the employee
    prisma.employee.delete({ where: { id } }),
  ]);

  // Note: Activity log for hard delete is created by the system, but since employee is deleted,
  // we can't create it after deletion. In a production system, you might want to
  // store this in a separate audit table or log to file.

  return {
    message: 'Employee permanently deleted',
    employeeId: id,
    email: employeeInfo.email,
  };
};

/**
 * Update employee password (for employees changing their own password)
 */
const updateEmployeePassword = async (
  id,
  currentPassword,
  newPassword,
  req = null
) => {
  // Check if employee exists
  const employee = await prisma.employee.findUnique({
    where: { id },
  });

  if (!employee) {
    throw ApiError.notFound('Employee not found');
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    employee.password_hash
  );
  if (!isPasswordValid) {
    throw ApiError.badRequest('Current password is incorrect');
  }

  // Check if new password is same as old password
  const isSamePassword = await bcrypt.compare(
    newPassword,
    employee.password_hash
  );
  if (isSamePassword) {
    throw ApiError.badRequest(
      'New password must be different from current password'
    );
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Update password
  await prisma.employee.update({
    where: { id },
    data: {
      password_hash: hashedPassword,
      passwordChangedAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return {
    message:
      'Password updated successfully. Please login again with your new password.',
  };
};

/**
 * Update employee status (activate/deactivate) - Admin function
 */
const updateEmployeeStatus = async (id, isActive, req = null) => {
  // Check if employee exists
  const existingEmployee = await prisma.employee.findUnique({
    where: { id },
  });

  if (!existingEmployee) {
    throw ApiError.notFound('Employee not found');
  }

  // Prevent deactivating your own account
  // Note: You'll need to pass the current employee ID from controller
  if (existingEmployee.id === id && !isActive) {
    throw ApiError.badRequest('You cannot deactivate your own account');
  }

  // Check if status is already the same
  if (existingEmployee.is_active === isActive) {
    throw ApiError.badRequest(
      `Employee is already ${isActive ? 'active' : 'inactive'}`
    );
  }

  // Update status
  const employee = await prisma.employee.update({
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

  // If deactivating, invalidate all refresh tokens
  if (!isActive) {
    await prisma.authToken.updateMany({
      where: {
        userId: employee.id,
        type: 'REFRESH',
      },
      data: {
        isValid: false,
      },
    });
  }

  const { password_hash, ...employeeWithoutPassword } = employee;
  return employeeWithoutPassword;
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  getEmployeesByCompany,
  getEmployeesByRole,
  searchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  hardDeleteEmployee,
  updateEmployeePassword,
  updateEmployeeStatus,
};
