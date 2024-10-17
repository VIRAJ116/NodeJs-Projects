"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "review",
      [
        {
          id: "f2b13458-ac56-4c54-a6cb-53f879dbfe6c",
          rating: 4,
          description: "A very very good product, must buy it.",
          product_id: "4db03064-6826-4a94-8943-5dbbba2f5de2",
          createdAt: "2024-10-17 07:22:55",
          updatedAt: "2024-10-17 07:22:55",
        },
        {
          id: "f2b13458-ac56-4c54-a6cb-53f879effe6c",
          rating: 5,
          description: "A testing product, just look at it.",
          product_id: "4db03064-6826-4a94-8943-5dbbba2f5de2",
          createdAt: "2024-10-17 07:22:55",
          updatedAt: "2024-10-17 07:22:55",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("review", null, {});
  },
};
