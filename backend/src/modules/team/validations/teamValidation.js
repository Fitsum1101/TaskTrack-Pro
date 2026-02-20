const Joi = require("joi");

// Assuming you have these enums defined elsewhere
const TeamStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  ARCHIVED: "ARCHIVED",
};

const teamValidation = {
  // For creating a new team
  createTeam: {
    params: Joi.object().keys({
      companyId: Joi.number().integer().positive().required().messages({
        "number.base": "Company ID must be a number",
        "number.integer": "Company ID must be a whole number",
        "number.positive": "Company ID must be greater than 0",
        "any.required": "Company ID is required",
      }),
    }),

    body: Joi.object()
      .keys({
        name: Joi.string()
          .required()
          .min(2)
          .max(100)
          .pattern(/^[a-zA-Z0-9\s\-_&.]+$/)
          .messages({
            "string.empty": "Team name is required",
            "any.required": "Team name is required",
            "string.min": "Team name must be at least 2 characters long",
            "string.max": "Team name cannot exceed 100 characters",
            "string.pattern.base":
              "Team name can only contain letters, numbers, spaces, hyphens, underscores, ampersands, and periods",
          }),

        description: Joi.string().optional().allow("").max(500).messages({
          "string.max": "Description cannot exceed 500 characters",
        }),

        status: Joi.string()
          .optional()
          .valid(...Object.values(TeamStatus))
          .default("ACTIVE")
          .messages({
            "any.only": `Status must be one of: ${Object.values(TeamStatus).join(", ")}`,
          }),

        // Optional: Add members during team creation
        memberIds: Joi.array()
          .optional()
          .items(
            Joi.number().integer().positive().messages({
              "number.base": "Each member ID must be a number",
              "number.integer": "Each member ID must be a whole number",
              "number.positive": "Each member ID must be greater than 0",
            }),
          )
          .unique()
          .messages({
            "array.unique": "Duplicate member IDs are not allowed",
          }),

        // Optional: Add projects during team creation
        projectIds: Joi.array()
          .optional()
          .items(
            Joi.number().integer().positive().messages({
              "number.base": "Each project ID must be a number",
              "number.integer": "Each project ID must be a whole number",
              "number.positive": "Each project ID must be greater than 0",
            }),
          )
          .unique()
          .messages({
            "array.unique": "Duplicate project IDs are not allowed",
          }),
      })
      .required(),
  },

  // For updating an existing team
  updateTeam: {
    params: Joi.object().keys({
      companyId: Joi.number().integer().positive().required().messages({
        "number.base": "Company ID must be a number",
        "number.integer": "Company ID must be a whole number",
        "number.positive": "Company ID must be greater than 0",
        "any.required": "Company ID is required",
      }),

      teamId: Joi.number().integer().positive().required().messages({
        "number.base": "Team ID must be a number",
        "number.integer": "Team ID must be a whole number",
        "number.positive": "Team ID must be greater than 0",
        "any.required": "Team ID is required",
      }),
    }),

    body: Joi.object()
      .keys({
        name: Joi.string()
          .optional()
          .min(2)
          .max(100)
          .pattern(/^[a-zA-Z0-9\s\-_&.]+$/)
          .messages({
            "string.min": "Team name must be at least 2 characters long",
            "string.max": "Team name cannot exceed 100 characters",
            "string.pattern.base":
              "Team name can only contain letters, numbers, spaces, hyphens, underscores, ampersands, and periods",
          }),

        description: Joi.string().optional().allow("").max(500).messages({
          "string.max": "Description cannot exceed 500 characters",
        }),

        status: Joi.string()
          .optional()
          .valid(...Object.values(TeamStatus))
          .messages({
            "any.only": `Status must be one of: ${Object.values(TeamStatus).join(", ")}`,
          }),
      })
      .min(1)
      .messages({
        "object.min": "At least one field must be provided for update",
      }),
  },

  // For managing team members
  manageTeamMembers: {
    params: Joi.object().keys({
      companyId: Joi.number().integer().positive().required(),

      teamId: Joi.number().integer().positive().required(),
    }),

    body: Joi.object()
      .keys({
        action: Joi.string()
          .required()
          .valid("ADD", "REMOVE", "REPLACE")
          .messages({
            "any.required": "Action is required",
            "any.only": "Action must be one of: ADD, REMOVE, REPLACE",
          }),

        memberIds: Joi.array()
          .required()
          .min(1)
          .items(
            Joi.number().integer().positive().messages({
              "number.base": "Each member ID must be a number",
              "number.integer": "Each member ID must be a whole number",
              "number.positive": "Each member ID must be greater than 0",
            }),
          )
          .unique()
          .messages({
            "array.min": "At least one member ID must be provided",
            "array.unique": "Duplicate member IDs are not allowed",
            "any.required": "Member IDs are required",
          }),

        // Optional: Role assignment for added members
        role: Joi.string()
          .optional()
          .valid("LEAD", "MEMBER", "OBSERVER")
          .default("MEMBER")
          .when("action", {
            is: "ADD",
            then: Joi.optional(),
            otherwise: Joi.forbidden(),
          })
          .messages({
            "any.only": "Role must be one of: LEAD, MEMBER, OBSERVER",
          }),
      })
      .required(),
  },

  // For managing team projects
  manageTeamProjects: {
    params: Joi.object().keys({
      companyId: Joi.number().integer().positive().required(),

      teamId: Joi.number().integer().positive().required(),
    }),

    body: Joi.object()
      .keys({
        action: Joi.string()
          .required()
          .valid("ASSIGN", "UNASSIGN", "REPLACE")
          .messages({
            "any.required": "Action is required",
            "any.only": "Action must be one of: ASSIGN, UNASSIGN, REPLACE",
          }),

        projectIds: Joi.array()
          .required()
          .min(1)
          .items(
            Joi.number().integer().positive().messages({
              "number.base": "Each project ID must be a number",
              "number.integer": "Each project ID must be a whole number",
              "number.positive": "Each project ID must be greater than 0",
            }),
          )
          .unique()
          .messages({
            "array.min": "At least one project ID must be provided",
            "array.unique": "Duplicate project IDs are not allowed",
            "any.required": "Project IDs are required",
          }),
      })
      .required(),
  },

  // For getting teams with filters
  getTeams: {
    params: Joi.object().keys({
      companyId: Joi.number().integer().positive().required(),
    }),

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

      status: Joi.string()
        .optional()
        .valid(...Object.values(TeamStatus))
        .messages({
          "any.only": `Status must be one of: ${Object.values(TeamStatus).join(", ")}`,
        }),

      sortBy: Joi.string()
        .optional()
        .valid("name", "createdAt", "updatedAt", "memberCount")
        .default("name")
        .messages({
          "any.only":
            "Sort by must be one of: name, createdAt, updatedAt, memberCount",
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
  },

  // For getting a single team by ID
  getTeamById: {
    params: Joi.object().keys({
      companyId: Joi.number().integer().positive().required(),

      teamId: Joi.number().integer().positive().required(),
    }),

    query: Joi.object().keys({
      includeMembers: Joi.boolean().optional().default(false),

      includeProjects: Joi.boolean().optional().default(false),
    }),
  },

  // For deleting a team
  deleteTeam: {
    params: Joi.object().keys({
      companyId: Joi.number().integer().positive().required(),

      teamId: Joi.number().integer().positive().required(),
    }),

    body: Joi.object().keys({
      force: Joi.boolean().optional().default(false).messages({
        "boolean.base": "Force must be a boolean",
      }),

      reassignToTeamId: Joi.number()
        .integer()
        .positive()
        .optional()
        .when("force", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.forbidden(),
        })
        .messages({
          "number.base": "Reassign to team ID must be a number",
          "number.integer": "Reassign to team ID must be a whole number",
          "number.positive": "Reassign to team ID must be greater than 0",
        }),
    }),
  },
};

module.exports = teamValidation;
