// dev/scripts/data/usersData.js
module.exports = [
  {
    firstName: "Alice",
    lastName: "Admin",
    username: "admin",
    email: "admin@acme.com",
    password: "admin123",
    role: "ADMIN",
    status: "ACTIVE",
    companyIndex: 0, // Acme Corporation
  },
  {
    firstName: "Peter",
    lastName: "Manager",
    username: "manager",
    email: "manager@acme.com",
    password: "manager123",
    role: "PROJECT_MANAGER",
    status: "ACTIVE",
    companyIndex: 0,
  },
  {
    firstName: "Eve",
    lastName: "Employee",
    username: "employee",
    email: "employee@acme.com",
    password: "employee123", // invited user
    role: "TEAM_MEMBER",
    status: "PENDING",
    companyIndex: 0,
  },
];
