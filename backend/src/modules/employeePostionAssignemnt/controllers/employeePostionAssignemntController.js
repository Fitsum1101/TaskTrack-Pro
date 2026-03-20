// employeePostionAssignemntController code
const ApiResponse = require('../../../utils/apiResponse');
const catchAsync = require('../../../utils/catchAsync');
const ApiError = require('../../../utils/apiError');
const assignmentService = require('../services/employeePositionAssignmentService');
const { StatusCodes } = require('http-status-codes');

/**
 * Get all assignments with pagination and filtering
 */
const getAllAssignments = catchAsync(async (req, res) => {
  const filters = {
    userId: req.query.userId,
    positionId: req.query.positionId,
    companyId: req.query.companyId,
    departmentId: req.query.departmentId,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
    search: req.query.search,
  };

  const pagination = {
    page: req.query.page,
    limit: req.query.limit,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder,
  };

  const result = await assignmentService.getAllAssignments(filters, pagination);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        result,
        'Assignments retrieved successfully'
      )
    );
});

/**
 * Get assignment by ID
 */
const getAssignmentById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const assignment = await assignmentService.getAssignmentById(id);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        assignment,
        'Assignment retrieved successfully'
      )
    );
});

/**
 * Get assignments by user
 */
const getAssignmentsByUser = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const pagination = {
    page: req.query.page,
    limit: req.query.limit,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder,
  };

  const result = await assignmentService.getAssignmentsByUser(
    userId,
    pagination
  );

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        result,
        'User assignments retrieved successfully'
      )
    );
});

/**
 * Get assignments by position
 */
const getAssignmentsByPosition = catchAsync(async (req, res) => {
  const { positionId } = req.params;

  const pagination = {
    page: req.query.page,
    limit: req.query.limit,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder,
  };

  const result = await assignmentService.getAssignmentsByPosition(
    positionId,
    pagination
  );

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        result,
        'Position assignments retrieved successfully'
      )
    );
});

/**
 * Get user's current positions (simplified list)
 */
const getUserPositions = catchAsync(async (req, res) => {
  const { userId } = req.params;

  // Check if requesting own positions or has permission
  if (
    req.user.id !== userId &&
    req.user.role_type !== 'SUPER_ADMIN' &&
    req.user.role_type !== 'ADMIN'
  ) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'You can only view your own positions'
    );
  }

  const positions = await assignmentService.getUserPositions(userId);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        { positions },
        'User positions retrieved successfully'
      )
    );
});

/**
 * Check if user has a specific position
 */
const checkUserPosition = catchAsync(async (req, res) => {
  const { userId, positionId } = req.params;

  const hasPosition = await assignmentService.checkUserPosition(
    userId,
    positionId
  );

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        { hasPosition },
        'Position check completed'
      )
    );
});

/**
 * Create a new assignment
 */
const createAssignment = catchAsync(async (req, res) => {
  const { userId, positionId } = req.body;

  // Check permissions
  if (req.user.role_type !== 'SUPER_ADMIN' && req.user.role_type !== 'ADMIN') {
    // Regular users can only assign positions to themselves
    if (req.user.id !== userId) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'You can only assign positions to yourself'
      );
    }
  }

  const assignment = await assignmentService.createAssignment(
    { userId, positionId },
    req
  );

  return res
    .status(StatusCodes.CREATED)
    .json(
      new ApiResponse(
        StatusCodes.CREATED,
        assignment,
        'Assignment created successfully'
      )
    );
});

/**
 * Delete assignment by ID
 */
const deleteAssignment = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Get assignment details first to check permissions
  const assignment = await assignmentService.getAssignmentById(id);

  // Check permissions
  if (req.user.role_type !== 'SUPER_ADMIN' && req.user.role_type !== 'ADMIN') {
    // Regular users can only remove their own assignments
    if (req.user.id !== assignment.userId) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'You can only remove your own assignments'
      );
    }
  }

  const result = await assignmentService.deleteAssignment(id, req);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, result, 'Assignment deleted successfully')
    );
});

/**
 * Delete all assignments for a user
 */
const deleteUserAssignments = catchAsync(async (req, res) => {
  const { userId } = req.params;

  // Check permissions
  if (req.user.role_type !== 'SUPER_ADMIN' && req.user.role_type !== 'ADMIN') {
    // Regular users can only remove their own assignments
    if (req.user.id !== userId) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'You can only remove your own assignments'
      );
    }
  }

  const result = await assignmentService.deleteUserAssignments(userId, req);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        result,
        'User assignments deleted successfully'
      )
    );
});

/**
 * Delete all assignments for a position
 */
const deletePositionAssignments = catchAsync(async (req, res) => {
  const { positionId } = req.params;

  // Only admins can remove all assignments from a position
  if (req.user.role_type !== 'SUPER_ADMIN' && req.user.role_type !== 'ADMIN') {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only admins can remove all assignments from a position'
    );
  }

  const result = await assignmentService.deletePositionAssignments(
    positionId,
    req
  );

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        result,
        'Position assignments deleted successfully'
      )
    );
});

/**
 * Bulk create assignments
 */
const bulkCreateAssignments = catchAsync(async (req, res) => {
  const { assignments } = req.body;

  // Only admins can perform bulk operations
  if (req.user.role_type !== 'SUPER_ADMIN' && req.user.role_type !== 'ADMIN') {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only admins can perform bulk assignments'
    );
  }

  const results = await assignmentService.bulkCreateAssignments(
    assignments,
    req
  );

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        results,
        'Bulk assignment creation completed'
      )
    );
});

/**
 * Get current user's positions
 */
const getMyPositions = catchAsync(async (req, res) => {
  const positions = await assignmentService.getUserPositions(req.user.id);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        { positions },
        'Your positions retrieved successfully'
      )
    );
});

/**
 * Assign current user to a position
 */
const assignMyself = catchAsync(async (req, res) => {
  const { positionId } = req.body;

  const assignment = await assignmentService.createAssignment(
    {
      userId: req.user.id,
      positionId,
    },
    req
  );

  return res
    .status(StatusCodes.CREATED)
    .json(
      new ApiResponse(
        StatusCodes.CREATED,
        assignment,
        'You have been assigned to the position successfully'
      )
    );
});

/**
 * Remove current user from a position
 */
const removeMyself = catchAsync(async (req, res) => {
  const { positionId } = req.params;

  // Check if assignment exists
  const hasPosition = await assignmentService.checkUserPosition(
    req.user.id,
    positionId
  );

  if (!hasPosition) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'You are not assigned to this position'
    );
  }

  // Get assignment ID first
  const assignments = await assignmentService.getAssignmentsByUser(
    req.user.id,
    {
      limit: 100,
    }
  );

  const assignment = assignments.assignments.find(
    (a) => a.positionId === positionId
  );

  if (!assignment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Assignment not found');
  }

  const result = await assignmentService.deleteAssignment(assignment.id, req);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        result,
        'You have been removed from the position successfully'
      )
    );
});

module.exports = {
  // Basic CRUD
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  deleteAssignment,

  // Specialized queries
  getAssignmentsByUser,
  getAssignmentsByPosition,
  getUserPositions,
  checkUserPosition,

  // Bulk operations
  bulkCreateAssignments,
  deleteUserAssignments,
  deletePositionAssignments,

  // Self-service operations
  getMyPositions,
  assignMyself,
  removeMyself,

  // Statistics
};
