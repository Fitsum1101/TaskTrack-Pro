// dev/scripts/data/usersData.js
module.exports = [
  {
    firstName: "Alice",
    lastName: "Admin",
    username: "alice.admin",
    email: "admin@acme.com",
    password: "admin123",
    role: "ADMIN",
    status: "ACTIVE",
    companyIndex: 0, // Acme Corporation
  },
  {
    firstName: "Peter",
    lastName: "Manager",
    username: "peter.manager",
    email: "manager@acme.com",
    password: "manager123",
    role: "PROJECT_MANAGER",
    status: "ACTIVE",
    companyIndex: 0,
  },
  {
    firstName: "Eve",
    lastName: "Employee",
    username: "eve.employee",
    email: "employee@acme.com",
    password: "employee123", // invited user
    role: "TEAM_MEMBER",
    status: "PENDING",
    companyIndex: 0,
  },
];
