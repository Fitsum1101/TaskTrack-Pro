// dev/scripts/data/taskData.js

module.exports = [
  // Module 0 - Frontend (Project 0)
  {
    moduleIndex: 0,
    title: "Build Navbar",
    description: "Create responsive navigation bar",
    assignedByIndex: 0,
    status: "IN_PROGRESS",
    priority: "HIGH",
    estimatedHours: 8,
  },
  {
    moduleIndex: 0,
    title: "Landing Page UI",
    description: "Design homepage layout",
    assignedByIndex: 0,
    status: "TODO",
    priority: "HIGH",
    estimatedHours: 12,
  },

  // Module 1 - Backend (Project 0)
  {
    moduleIndex: 1,
    title: "Setup Express Server",
    description: "Initialize backend project structure",
    assignedByIndex: 1,
    status: "DONE",
    priority: "MEDIUM",
    estimatedHours: 6,
    actualHours: 5,
  },
  {
    moduleIndex: 1,
    title: "User Authentication API",
    description: "JWT login and registration",
    assignedByIndex: 1,
    status: "IN_PROGRESS",
    priority: "HIGH",
    estimatedHours: 10,
  },

  // Module 2 - Testing
  {
    moduleIndex: 2,
    title: "Write Unit Tests",
    description: "Test core functionalities",
    assignedByIndex: 2,
    status: "TODO",
    priority: "MEDIUM",
    estimatedHours: 7,
  },

  // Module 3 - Frontend (Project 1)
  {
    moduleIndex: 3,
    title: "Mobile UI Design",
    description: "Design app screens",
    assignedByIndex: 3,
    status: "IN_PROGRESS",
    priority: "HIGH",
    estimatedHours: 15,
  },

  // Module 4 - Backend (Project 1)
  {
    moduleIndex: 4,
    title: "Database Schema Design",
    description: "Design DB structure",
    assignedByIndex: 1,
    status: "DONE",
    priority: "HIGH",
    estimatedHours: 10,
    actualHours: 9,
  },

  // Module 5 - API Integration
  {
    moduleIndex: 5,
    title: "Integrate Payment Gateway",
    description: "Connect Stripe API",
    assignedByIndex: 2,
    status: "TODO",
    priority: "HIGH",
    estimatedHours: 12,
  },

  // Module 6 - Security
  {
    moduleIndex: 6,
    title: "Implement Role-Based Access",
    description: "Authorization middleware",
    assignedByIndex: 1,
    status: "IN_PROGRESS",
    priority: "HIGH",
    estimatedHours: 8,
  },

  // Module 7 - Design
  {
    moduleIndex: 7,
    title: "Create Wireframes",
    description: "Low fidelity designs",
    assignedByIndex: 3,
    status: "DONE",
    priority: "MEDIUM",
    estimatedHours: 6,
    actualHours: 6,
  },

  // Module 8 - Deployment
  {
    moduleIndex: 8,
    title: "Setup CI/CD",
    description: "Automate deployment pipeline",
    assignedByIndex: 1,
    status: "TODO",
    priority: "HIGH",
    estimatedHours: 10,
  },

  // Module 9 - Documentation
  {
    moduleIndex: 9,
    title: "Write API Docs",
    description: "Document endpoints",
    assignedByIndex: 2,
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    estimatedHours: 5,
  },

  // Module 10 - Maintenance
  {
    moduleIndex: 10,
    title: "Fix Login Bug",
    description: "Resolve authentication issue",
    assignedByIndex: 0,
    status: "DONE",
    priority: "HIGH",
    estimatedHours: 3,
    actualHours: 2,
    completedAt: new Date(),
  },
];
