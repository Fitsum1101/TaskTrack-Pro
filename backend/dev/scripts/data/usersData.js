// dev/scripts/data/usersData.js
module.exports = [
    {
      username: "superadmin",
      password: "superadmin123",
      roleName: "Super Admin",
      employeeID: "EMP0000",
      isActive: true,
  
    },
    {
      username: "admin",
      password: "admin123",
      roleName: "Admin",
      employeeID: "EMP0001",
      isActive: true,
      customPermissions: ["employee_create", "employee_update"]
    },
    {
      username: "manager",
      password: "manager123",
      roleName: "Manager",
      employeeID: "EMP0002",
      isActive: true,
    },
    {
      username: "janesmith",
      password: "employee123",
      roleName: "Employee",
      employeeID: "EMP0003",
      isActive: true,
    },
  ];