// dev/scripts/data/usersData.js
module.exports = [
  {
    name: "Alice Admin",
    email: "admin@acme.com",
    password: "admin123",
    role: "ADMIN",
    status: "ACTIVE",
    companyIndex: 0, // Acme Corporation
  },
  {
    name: "Peter Manager",
    email: "manager@acme.com",
    password: "manager123",
    role: "PROJECT_MANAGER",
    status: "ACTIVE",
    companyIndex: 0,
  },
  {
    name: "Eve Employee",
    email: "employee@acme.com",
    password: null, // invited user
    role: "TEAM_MEMBER",
    status: "PENDING",
    companyIndex: 0,
  },
];
