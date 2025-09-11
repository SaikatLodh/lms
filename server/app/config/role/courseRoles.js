const roles = {
  admin: {
    permissions: ["read_record", "update_record", "delete_record"],
  },
  instructor: {
    permissions: [
      "create_record",
      "read_record",
      "update_record",
      "delete_record",
    ],
  },
  user: {
    permissions: ["read_record"],
  },
};

module.exports = roles;
