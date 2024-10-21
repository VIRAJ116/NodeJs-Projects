"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "product",
      [
        {
          id: "4db03064-6826-4a94-8943-5dbbba2f5de2",
          title: "System Admin",
          price: 3213,
          description: "testing admin user",
          published: true,
          createdAt: "2024-10-16 07:39:04",
          updatedAt: "2024-10-16 07:39:04",
        },
        {
          id: "766b7ee4-9347-4752-84ab-24b9cc7c996e",
          title: "Admin",
          price: 1231,
          description: "testing this user",
          published: true,
          createdAt: "2024-10-16 07:41:10",
          updatedAt: "2024-10-16 07:41:10",
        },
        {
          id: "766b7re4-9347-4752-84ab-24b9aa7c996e",
          title: "Admin 2",
          price: 1253,
          description: "testing this user 2",
          published: true,
          createdAt: "2024-10-16 04:12:10",
          updatedAt: "2024-10-16 04:12:10",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("product", null, {});
  },
};
