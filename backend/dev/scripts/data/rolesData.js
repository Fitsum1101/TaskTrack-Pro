// dev/scripts/data/rolesData.js
const permissionsData = require('./permissionsData');

module.exports = [
  {
    name: "Super Admin",
    description: "Full system access",
    permissions: permissionsData.map((p) => p.name),
    requiresAccount: true,
    isDefault: false,
  },
  {
    name: "Admin",
    description: "Administrative access",
    permissions: permissionsData.map((p) => p.name),
    requiresAccount: true,
    isDefault: false,
  },
  {
    name: "Manager",
    description: "Management access",
    permissions: [
      "user_read", "user_update", "employee_read", "employee_update",
      "address_read", "emergency_contact_read", "document_read", "allowance_read"
    ],
    requiresAccount: true,
    isDefault: false,
  },
  {
    name: "Employee", 
    description: "Basic employee access",
    permissions: ["user_read_own", "user_update_own"],
    requiresAccount: false,
    isDefault: true,
  },
];