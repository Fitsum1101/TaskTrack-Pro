// employeeController code
// employeeController code
const ApiResponse = require('../../../utils/apiResponse');
const catchAsync = require('../../../utils/catchAsync');
const ApiError = require('../../../utils/apiError');
const employeeService = require('../services/employeeService');
const { StatusCodes } = require('http-status-codes');

/**
 * Get all employees with pagination and filtering
 */
const getAllEmployees = catchAsync(async (req, res) => {
  const filters = {
    search: req.query.search,
    role_type: req.query.role_type,
    is_active: req.query.is_active,
    companyId: req.query.companyId,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
    firstName: req.query.firstName,
    lastName: req.query.lastName,
    email: req.query.email,
    phone: req.query.phone,
  };

  const pagination = {
    page: req.query.page,
    limit: req.query.limit,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder,
  };

  const result = await employeeService.getAllEmployees(filters, pagination);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        result,
        'Employees retrieved successfully'
      )
    );
});

/**
 * Get employee by ID
 */
const getEmployeeById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const employee = await employeeService.getEmployeeById(id);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        employee,
        'Employee retrieved successfully'
      )
    );
});

/**
 * Get employees by company
 */
const getEmployeesByCompany = catchAsync(async (req, res) => {
  const { companyId } = req.params;

  const filters = {
    search: req.query.search,
    role_type: req.query.role_type,
    is_active: req.query.is_active,
  };

  const pagination = {
    page: req.query.page,
    limit: req.query.limit,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder,
  };

  const result = await employeeService.getEmployeesByCompany(
    companyId,
    filters,
    pagination
  );

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        result,
        'Employees retrieved successfully'
      )
    );
});

/**
 * Create a new employee
 */
const createEmployee = catchAsync(async (req, res) => {
  const employee = await employeeService.createEmployee(req.body, req);

  return res
    .status(StatusCodes.CREATED)
    .json(
      new ApiResponse(
        StatusCodes.CREATED,
        employee,
        'Employee created successfully'
      )
    );
});

/**
 * Update employee by ID
 */
const updateEmployee = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Regular employees cannot update other employees
  if (
    req.employee.role_type !== 'SUPER_ADMIN' &&
    req.employee.role_type !== 'ADMIN' &&
    req.employee.id !== id
  ) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'You can only update your own profile'
    );
  }

  const employee = await employeeService.updateEmployee(id, req.body, req);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, employee, 'Employee updated successfully')
    );
});

/**
 * Delete employee (soft delete)
 */
const deleteEmployee = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Prevent self-deletion
  if (req.employee.id === id) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'You cannot delete your own account'
    );
  }

  const employee = await employeeService.deleteEmployee(id, req);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        employee,
        'Employee deactivated successfully'
      )
    );
});

/**
 * Hard delete employee (permanent deletion)
 */
const hardDeleteEmployee = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Only super admins can hard delete
  if (req.employee.role_type !== 'SUPER_ADMIN') {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only super admins can permanently delete employees'
    );
  }

  // Prevent self hard deletion
  if (req.employee.id === id) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'You cannot permanently delete your own account'
    );
  }

  const result = await employeeService.hardDeleteEmployee(id, req);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, result, 'Employee permanently deleted')
    );
});

/**
 * Update employee password (employee changing their own password)
 */
const updateEmployeePassword = catchAsync(async (req, res) => {
  const employeeId = req.employee.id; // From auth middleware
  const { currentPassword, newPassword } = req.body;

  const result = await employeeService.updateEmployeePassword(
    employeeId,
    currentPassword,
    newPassword,
    req
  );

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, result, 'Password updated successfully')
    );
});

/**
 * Reset employee password (admin resetting another employee's password)
 */
const resetEmployeePassword = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  // Check if employee exists and get their info
  const targetEmployee = await employeeService.getEmployeeById(id);

  // Prevent admins from resetting super admin passwords
  if (
    targetEmployee.role_type === 'SUPER_ADMIN' &&
    req.employee.role_type !== 'SUPER_ADMIN'
  ) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'You cannot reset a super admin password'
    );
  }

  // Admin can reset password without current password
  // We'll use a special function or modify the updateEmployeePassword to accept an admin flag
  const result = await employeeService.resetEmployeePassword(
    id,
    newPassword,
    req
  );

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, result, 'Password reset successfully')
    );
});

/**
 * Update employee status (activate/deactivate)
 */
const updateEmployeeStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  // Prevent self deactivation
  if (req.employee.id === id && !is_active) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'You cannot deactivate your own account'
    );
  }

  // Check if target employee exists and get their info
  const targetEmployee = await employeeService.getEmployeeById(id);

  // Prevent deactivating super admin unless you're super admin
  if (
    targetEmployee.role_type === 'SUPER_ADMIN' &&
    req.employee.role_type !== 'SUPER_ADMIN'
  ) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'You cannot modify a super admin status'
    );
  }

  const employee = await employeeService.updateEmployeeStatus(
    id,
    is_active,
    req
  );

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        employee,
        `Employee ${is_active ? 'activated' : 'deactivated'} successfully`
      )
    );
});

/**
 * Bulk create employees
 */
const bulkCreateEmployees = catchAsync(async (req, res) => {
  const { employees } = req.body;

  // Check permissions for bulk operations
  if (
    req.employee.role_type !== 'SUPER_ADMIN' &&
    req.employee.role_type !== 'ADMIN'
  ) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only admins can perform bulk operations'
    );
  }

  const results = {
    successful: [],
    failed: [],
  };

  // Process employees sequentially to handle errors individually
  for (const employeeData of employees) {
    try {
      const employee = await employeeService.createEmployee(employeeData, req);
      results.successful.push(employee);
    } catch (error) {
      results.failed.push({
        email: employeeData.email,
        error: error.message,
      });
    }
  }

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        results,
        'Bulk employee creation completed'
      )
    );
});

/**
 * Bulk update employee status
 */
const bulkUpdateStatus = catchAsync(async (req, res) => {
  const { employeeIds, is_active } = req.body;

  // Check permissions
  if (
    req.employee.role_type !== 'SUPER_ADMIN' &&
    req.employee.role_type !== 'ADMIN'
  ) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only admins can perform bulk operations'
    );
  }

  // Prevent self deactivation in bulk
  if (employeeIds.includes(req.employee.id) && !is_active) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Cannot deactivate your own account in bulk operation'
    );
  }

  const results = {
    successful: [],
    failed: [],
  };

  for (const employeeId of employeeIds) {
    try {
      // Check if target is super admin
      const targetEmployee = await employeeService.getEmployeeById(employeeId);
      if (
        targetEmployee.role_type === 'SUPER_ADMIN' &&
        req.employee.role_type !== 'SUPER_ADMIN'
      ) {
        results.failed.push({
          employeeId,
          error: 'Cannot modify super admin status',
        });
        continue;
      }

      const employee = await employeeService.updateEmployeeStatus(
        employeeId,
        is_active,
        req
      );
      results.successful.push(employee);
    } catch (error) {
      results.failed.push({
        employeeId,
        error: error.message,
      });
    }
  }

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, results, 'Bulk status update completed')
    );
});

/**
 * Bulk delete employees
 */
const bulkDeleteEmployees = catchAsync(async (req, res) => {
  const { employeeIds, permanent = false } = req.body;

  // Only super admins can permanently delete
  if (permanent && req.employee.role_type !== 'SUPER_ADMIN') {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only super admins can permanently delete employees'
    );
  }

  // Check permissions
  if (
    req.employee.role_type !== 'SUPER_ADMIN' &&
    req.employee.role_type !== 'ADMIN'
  ) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only admins can perform bulk operations'
    );
  }

  // Prevent self deletion in bulk
  if (employeeIds.includes(req.employee.id)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Cannot delete your own account in bulk operation'
    );
  }

  const results = {
    successful: [],
    failed: [],
  };

  for (const employeeId of employeeIds) {
    try {
      // Check if target is super admin
      const targetEmployee = await employeeService.getEmployeeById(employeeId);
      if (
        targetEmployee.role_type === 'SUPER_ADMIN' &&
        req.employee.role_type !== 'SUPER_ADMIN'
      ) {
        results.failed.push({
          employeeId,
          error: 'Cannot delete super admin',
        });
        continue;
      }

      let result;
      if (permanent) {
        result = await employeeService.hardDeleteEmployee(employeeId, req);
      } else {
        result = await employeeService.deleteEmployee(employeeId, req);
      }
      results.successful.push({ employeeId, ...result });
    } catch (error) {
      results.failed.push({
        employeeId,
        error: error.message,
      });
    }
  }

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        results,
        'Bulk delete operation completed'
      )
    );
});

/**
 * Get current employee profile
 */
const getCurrentEmployee = catchAsync(async (req, res) => {
  const employee = await employeeService.getEmployeeById(req.employee.id);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        employee,
        'Profile retrieved successfully'
      )
    );
});

/**
 * Update current employee profile
 */
const updateCurrentEmployee = catchAsync(async (req, res) => {
  // Restrict fields that current employee can update
  const allowedFields = ['first_name', 'last_name', 'phone', 'profile_picture'];
  const updateData = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'No valid fields to update');
  }

  const employee = await employeeService.updateEmployee(
    req.employee.id,
    updateData,
    req
  );

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, employee, 'Profile updated successfully')
    );
});

module.exports = {
  // Basic CRUD
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  hardDeleteEmployee,

  // Specialized queries
  getEmployeesByCompany,
  // Note: getEmployeesByRole and searchEmployees would need to be added
  // if they exist in the service

  // Profile management
  getCurrentEmployee,
  updateCurrentEmployee,

  // Password management
  updateEmployeePassword,
  resetEmployeePassword,

  // Status management
  updateEmployeeStatus,

  // Bulk operations
  bulkCreateEmployees,
  bulkUpdateStatus,
  bulkDeleteEmployees,
};
