// dev/scripts/data/tasksData.js
module.exports = [
  {
    title: "Design database schema",
    description: "Create Prisma schema and relations",
    projectName: "Internal Management System",
    companyIndex: 0, // Acme Corporation
    assignedToEmail: "manager@acme.com",
    status: "in progress",
    progress: 60,
  },
  {
    title: "Implement authentication",
    description: "JWT + role-based access",
    projectName: "Internal Management System",
    companyIndex: 0, // Acme Corporation
    assignedToEmail: "employee@acme.com",
    status: "not started",
    progress: 0,
  },
  {
    title: "Build UI components",
    description: "Reusable frontend components",
    companyIndex: 0, // Acme Corporation
    projectName: "Website Redesign",
    assignedToEmail: "employee@acme.com",
    status: "in progress",
    progress: 40,
  },
];
