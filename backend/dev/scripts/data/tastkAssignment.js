// dev/scripts/data/taskAssignmentData.js

module.exports = [
  // 🔹 Acme Corporation - Frontend Team Tasks
  {
    taskTitle: "Design Landing Page",
    usernames: ["charlie_employee", "alice_admin"], // multiple members
    estimatedHoursPerMember: 10,
  },
  {
    taskTitle: "Implement Responsive Layout",
    usernames: ["charlie_employee", "bob_manager"],
    estimatedHoursPerMember: 12,
  },

  // 🔹 Acme Corporation - Backend Team Tasks
  {
    taskTitle: "Setup REST API",
    usernames: ["bob_manager"],
    estimatedHoursPerMember: 40,
  },
  {
    taskTitle: "Database Schema Design",
    usernames: ["bob_manager", "charlie_employee"],
    estimatedHoursPerMember: 15,
  },

  // 🔹 EduCore Academy - Teaching Team Tasks
  {
    taskTitle: "Prepare Math Lessons",
    usernames: ["abel_teacher", "sara_admin"],
    estimatedHoursPerMember: 5,
  },
  {
    taskTitle: "Prepare English Lessons",
    usernames: ["abel_teacher"],
    estimatedHoursPerMember: 6,
  },

  // 🔹 EduCore Academy - Library Team Tasks
  {
    taskTitle: "Digitize Library Books",
    usernames: ["sara_admin"],
    estimatedHoursPerMember: 25,
  },
];
