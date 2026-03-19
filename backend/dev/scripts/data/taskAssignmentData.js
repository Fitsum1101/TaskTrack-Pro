// dev/scripts/data/taskAssignmentData.js

module.exports = [
  // Task 0 → multiple members
  {
    taskIndex: 0,
    teamMemberIndex: 0,
    status: 'IN_PROGRESS',
    estimatedHours: 4,
  },
  {
    taskIndex: 0,
    teamMemberIndex: 1,
    status: 'TODO',
    estimatedHours: 4,
  },

  // Task 1
  {
    taskIndex: 1,
    teamMemberIndex: 2,
    status: 'TODO',
    estimatedHours: 6,
  },

  // Task 2
  {
    taskIndex: 2,
    teamMemberIndex: 3,
    status: 'DONE',
    estimatedHours: 5,
    actualHours: 5,
  },

  // Task 3 (multi-user)
  {
    taskIndex: 3,
    teamMemberIndex: 1,
    status: 'IN_PROGRESS',
    estimatedHours: 5,
  },
  {
    taskIndex: 3,
    teamMemberIndex: 4,
    status: 'IN_PROGRESS',
    estimatedHours: 5,
  },

  // Task 4
  {
    taskIndex: 4,
    teamMemberIndex: 5,
    status: 'TODO',
    estimatedHours: 7,
  },

  // Task 5
  {
    taskIndex: 5,
    teamMemberIndex: 2,
    status: 'IN_PROGRESS',
    estimatedHours: 10,
  },

  // Task 6
  {
    taskIndex: 6,
    teamMemberIndex: 3,
    status: 'IN_PROGRESS',
    estimatedHours: 6,
  },

  // Task 7
  {
    taskIndex: 7,
    teamMemberIndex: 6,
    status: 'DONE',
    estimatedHours: 4,
    actualHours: 4,
  },

  // Task 8
  {
    taskIndex: 8,
    teamMemberIndex: 0,
    status: 'TODO',
    estimatedHours: 8,
  },

  // Task 9
  {
    taskIndex: 9,
    teamMemberIndex: 4,
    status: 'IN_PROGRESS',
    estimatedHours: 5,
  },

  // Task 10
  {
    taskIndex: 10,
    teamMemberIndex: 1,
    status: 'DONE',
    estimatedHours: 3,
    actualHours: 2,
  },
];
