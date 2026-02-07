// dev/scripts/data/permissionsData.js
module.exports = [
    // User permissions
    { name: "user_create", description: "Create users", category: "user" },
    { name: "user_read", description: "Read users", category: "user" },
    { name: "user_read_own", description: "Read own user data", category: "user" },
    { name: "user_update", description: "Update users", category: "user" },
    { name: "user_update_own", description: "Update own user data", category: "user" },
    { name: "user_delete", description: "Delete users", category: "user" },
    
    // Role permissions
    { name: "role_create", description: "Create roles", category: "role" },
    { name: "role_read", description: "Read roles", category: "role" },
    { name: "role_update", description: "Update roles", category: "role" },
    { name: "role_delete", description: "Delete roles", category: "role" },
    
    // Permission permissions
    { name: "permission_create", description: "Create permissions", category: "permission" },
    { name: "permission_read", description: "Read permissions", category: "permission" },
    { name: "permission_update", description: "Update permissions", category: "permission" },
    { name: "permission_delete", description: "Delete permissions", category: "permission" },
    
    // Employee permissions
    { name: "employee_create", description: "Create employees", category: "employee" },
    { name: "employee_read", description: "Read employees", category: "employee" },
    { name: "employee_update", description: "Update employees", category: "employee" },
    { name: "employee_delete", description: "Delete employees", category: "employee" },
    
    // Additional permissions for your models
    { name: "address_create", description: "Create addresses", category: "address" },
    { name: "address_read", description: "Read addresses", category: "address" },
    { name: "address_update", description: "Update addresses", category: "address" },
    { name: "address_delete", description: "Delete addresses", category: "address" },
    
    { name: "emergency_contact_create", description: "Create emergency contacts", category: "emergency_contact" },
    { name: "emergency_contact_read", description: "Read emergency contacts", category: "emergency_contact" },
    { name: "emergency_contact_update", description: "Update emergency contacts", category: "emergency_contact" },
    { name: "emergency_contact_delete", description: "Delete emergency contacts", category: "emergency_contact" },
    
    { name: "document_create", description: "Create documents", category: "document" },
    { name: "document_read", description: "Read documents", category: "document" },
    { name: "document_update", description: "Update documents", category: "document" },
    { name: "document_delete", description: "Delete documents", category: "document" },
    
    { name: "allowance_create", description: "Create allowances", category: "allowance" },
    { name: "allowance_read", description: "Read allowances", category: "allowance" },
    { name: "allowance_update", description: "Update allowances", category: "allowance" },
    { name: "allowance_delete", description: "Delete allowances", category: "allowance" },
  ];