// validations/teamValidation.js
const Joi = require("joi");
const { id } = require("../../../utils/customJoi");

// Create team
const createTeam = {
  body: Joi.object()
    .keys({
      name: Joi.string().required().min(2).max(100).messages({
        "any.required": "Team name is required",
        "string.empty": "Team name cannot be empty",
        "string.min": "Team name must be at least 2 characters long",
        "string.max": "Team name cannot exceed 100 characters",
      }),
      description: Joi.string().optional().allow("").max(500).messages({
        "string.max": "Description cannot exceed 500 characters",
      }),
      memberIds: Joi.array().optional().items(id()).unique().messages({
        "array.unique": "Duplicate member IDs are not allowed",
      }),
      projectIds: Joi.array().optional().items(id()).unique().messages({
        "array.unique": "Duplicate project IDs are not allowed",
      }),
    })
    .required(),
};

// Update team
const updateTeam = {
  params: Joi.object()
    .keys({
      companyId: id().required().messages({
        "any.required": "Company ID is required",
        "number.base": "Company ID must be a number",
      }),
      teamId: id().required().messages({
        "any.required": "Team ID is required",
        "number.base": "Team ID must be a number",
      }),
    })
    .required(),
  body: Joi.object()
    .keys({
      name: Joi.string().optional().min(2).max(100).messages({
        "string.min": "Team name must be at least 2 characters long",
        "string.max": "Team name cannot exceed 100 characters",
      }),
      description: Joi.string().optional().allow("").max(500).messages({
        "string.max": "Description cannot exceed 500 characters",
      }),
    })
    .min(1)
    .required()
    .messages({
      "object.min": "At least one field must be provided for update",
    }),
};

// Get single team
const getTeam = {
  params: Joi.object()
    .keys({
      companyId: id().required().messages({
        "any.required": "Company ID is required",
        "number.base": "Company ID must be a number",
      }),
      teamId: id().required().messages({
        "any.required": "Team ID is required",
        "number.base": "Team ID must be a number",
      }),
    })
    .required(),
  query: Joi.object().keys({
    includeMembers: Joi.boolean().optional().default(false).messages({
      "boolean.base": "includeMembers must be a boolean",
    }),
    includeProjects: Joi.boolean().optional().default(false).messages({
      "boolean.base": "includeProjects must be a boolean",
    }),
  }),
};

// Get all teams (with pagination)
const getTeams = {
  params: Joi.object()
    .keys({
      companyId: id().required().messages({
        "any.required": "Company ID is required",
        "number.base": "Company ID must be a number",
      }),
    })
    .required(),
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1).messages({
      "number.base": "Page must be a number",
      "number.integer": "Page must be a whole number",
      "number.min": "Page must be at least 1",
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
      "number.base": "Limit must be a number",
      "number.integer": "Limit must be a whole number",
      "number.min": "Limit must be at least 1",
      "number.max": "Limit cannot exceed 100",
    }),
    search: Joi.string().optional().allow("").max(100).messages({
      "string.max": "Search term cannot exceed 100 characters",
    }),
    sortBy: Joi.string()
      .optional()
      .valid("name", "createdAt", "updatedAt")
      .default("name")
      .messages({
        "any.only": "Sort by must be one of: name, createdAt, updatedAt",
      }),
    sortOrder: Joi.string()
      .optional()
      .valid("asc", "desc")
      .default("asc")
      .messages({
        "any.only": "Sort order must be either asc or desc",
      }),
    includeMembers: Joi.boolean().optional().default(false).messages({
      "boolean.base": "includeMembers must be a boolean",
    }),
    includeProjects: Joi.boolean().optional().default(false).messages({
      "boolean.base": "includeProjects must be a boolean",
    }),
  }),
};

// Delete team
const deleteTeam = {
  params: Joi.object()
    .keys({
      companyId: id().required().messages({
        "any.required": "Company ID is required",
        "number.base": "Company ID must be a number",
      }),
      teamId: id().required().messages({
        "any.required": "Team ID is required",
        "number.base": "Team ID must be a number",
      }),
    })
    .required(),
  body: Joi.object()
    .keys({
      force: Joi.boolean().optional().default(false).messages({
        "boolean.base": "Force must be a boolean",
      }),
      reassignToTeamId: id().optional().when("force", {
        is: true,
        then: Joi.optional(),
        otherwise: Joi.forbidden(),
      }),
    })
    .optional(),
};

// Add members to team
const addTeamMembers = {
  params: Joi.object()
    .keys({
      companyId: id().required().messages({
        "any.required": "Company ID is required",
        "number.base": "Company ID must be a number",
      }),
      teamId: id().required().messages({
        "any.required": "Team ID is required",
        "number.base": "Team ID must be a number",
      }),
    })
    .required(),
  body: Joi.object()
    .keys({
      memberIds: Joi.array()
        .required()
        .min(1)
        .items(id().required())
        .unique()
        .messages({
          "any.required": "Member IDs are required",
          "array.min": "At least one member ID must be provided",
          "array.unique": "Duplicate member IDs are not allowed",
          "array.base": "Member IDs must be an array",
        }),
      role: Joi.string()
        .optional()
        .valid("LEAD", "MEMBER", "OBSERVER")
        .default("MEMBER")
        .messages({
          "any.only": "Role must be one of: LEAD, MEMBER, OBSERVER",
        }),
    })
    .required(),
};

// Remove members from team
const removeTeamMembers = {
  params: Joi.object()
    .keys({
      companyId: id().required().messages({
        "any.required": "Company ID is required",
        "number.base": "Company ID must be a number",
      }),
      teamId: id().required().messages({
        "any.required": "Team ID is required",
        "number.base": "Team ID must be a number",
      }),
    })
    .required(),
  body: Joi.object()
    .keys({
      memberIds: Joi.array()
        .required()
        .min(1)
        .items(id().required())
        .unique()
        .messages({
          "any.required": "Member IDs are required",
          "array.min": "At least one member ID must be provided",
          "array.unique": "Duplicate member IDs are not allowed",
          "array.base": "Member IDs must be an array",
        }),
    })
    .required(),
};

// Replace team members
const replaceTeamMembers = {
  params: Joi.object()
    .keys({
      companyId: id().required().messages({
        "any.required": "Company ID is required",
        "number.base": "Company ID must be a number",
      }),
      teamId: id().required().messages({
        "any.required": "Team ID is required",
        "number.base": "Team ID must be a number",
      }),
    })
    .required(),
  body: Joi.object()
    .keys({
      memberIds: Joi.array()
        .required()
        .items(id().required())
        .unique()
        .messages({
          "any.required": "Member IDs are required",
          "array.unique": "Duplicate member IDs are not allowed",
          "array.base": "Member IDs must be an array",
        }),
    })
    .required(),
};

// Assign projects to team
const assignProjects = {
  params: Joi.object()
    .keys({
      companyId: id().required().messages({
        "any.required": "Company ID is required",
        "number.base": "Company ID must be a number",
      }),
      teamId: id().required().messages({
        "any.required": "Team ID is required",
        "number.base": "Team ID must be a number",
      }),
    })
    .required(),
  body: Joi.object()
    .keys({
      projectIds: Joi.array()
        .required()
        .min(1)
        .items(id().required())
        .unique()
        .messages({
          "any.required": "Project IDs are required",
          "array.min": "At least one project ID must be provided",
          "array.unique": "Duplicate project IDs are not allowed",
          "array.base": "Project IDs must be an array",
        }),
    })
    .required(),
};

// Remove projects from team
const removeProjects = {
  params: Joi.object()
    .keys({
      companyId: id().required().messages({
        "any.required": "Company ID is required",
        "number.base": "Company ID must be a number",
      }),
      teamId: id().required().messages({
        "any.required": "Team ID is required",
        "number.base": "Team ID must be a number",
      }),
    })
    .required(),
  body: Joi.object()
    .keys({
      projectIds: Joi.array()
        .required()
        .min(1)
        .items(id().required())
        .unique()
        .messages({
          "any.required": "Project IDs are required",
          "array.min": "At least one project ID must be provided",
          "array.unique": "Duplicate project IDs are not allowed",
          "array.base": "Project IDs must be an array",
        }),
    })
    .required(),
};

// Get team members
const getTeamMembers = {
  params: Joi.object()
    .keys({
      companyId: id().required().messages({
        "any.required": "Company ID is required",
        "number.base": "Company ID must be a number",
      }),
      teamId: id().required().messages({
        "any.required": "Team ID is required",
        "number.base": "Team ID must be a number",
      }),
    })
    .required(),
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1).messages({
      "number.base": "Page must be a number",
      "number.min": "Page must be at least 1",
    }),
    limit: Joi.number().integer().min(1).max(100).default(20).messages({
      "number.base": "Limit must be a number",
      "number.max": "Limit cannot exceed 100",
    }),
    role: Joi.string().optional().valid("LEAD", "MEMBER", "OBSERVER").messages({
      "any.only": "Role must be one of: LEAD, MEMBER, OBSERVER",
    }),
  }),
};

// Get team projects
const getTeamProjects = {
  params: Joi.object()
    .keys({
      companyId: id().required().messages({
        "any.required": "Company ID is required",
        "number.base": "Company ID must be a number",
      }),
      teamId: id().required().messages({
        "any.required": "Team ID is required",
        "number.base": "Team ID must be a number",
      }),
    })
    .required(),
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1).messages({
      "number.base": "Page must be a number",
      "number.min": "Page must be at least 1",
    }),
    limit: Joi.number().integer().min(1).max(100).default(20).messages({
      "number.base": "Limit must be a number",
      "number.max": "Limit cannot exceed 100",
    }),
    status: Joi.string()
      .optional()
      .valid("ACTIVE", "COMPLETED", "ARCHIVED")
      .messages({
        "any.only": "Status must be one of: ACTIVE, COMPLETED, ARCHIVED",
      }),
  }),
};

// Check if user is in team
const checkTeamMembership = {
  params: Joi.object()
    .keys({
      companyId: id().required().messages({
        "any.required": "Company ID is required",
        "number.base": "Company ID must be a number",
      }),
      teamId: id().required().messages({
        "any.required": "Team ID is required",
        "number.base": "Team ID must be a number",
      }),
      userId: id().required().messages({
        "any.required": "User ID is required",
        "number.base": "User ID must be a number",
      }),
    })
    .required(),
};

// Transfer team ownership
const transferTeamOwnership = {
  params: Joi.object()
    .keys({
      companyId: id().required().messages({
        "any.required": "Company ID is required",
        "number.base": "Company ID must be a number",
      }),
      teamId: id().required().messages({
        "any.required": "Team ID is required",
        "number.base": "Team ID must be a number",
      }),
    })
    .required(),
  body: Joi.object()
    .keys({
      newLeaderId: id().required().messages({
        "any.required": "New team leader ID is required",
        "number.base": "New team leader ID must be a number",
      }),
    })
    .required(),
};

module.exports = {
  createTeam,
  updateTeam,
  getTeam,
  getTeams,
  deleteTeam,
  addTeamMembers,
  removeTeamMembers,
  replaceTeamMembers,
  assignProjects,
  removeProjects,
  getTeamMembers,
  getTeamProjects,
  checkTeamMembership,
  transferTeamOwnership,
};
