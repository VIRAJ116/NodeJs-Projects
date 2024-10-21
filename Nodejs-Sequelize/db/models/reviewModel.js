module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    "Review",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      rating: {
        type: DataTypes.INTEGER,
      },
      description: {
        type: DataTypes.TEXT,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
        association: {
          model: "Product",
          key: "id",
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
          belongsToAlias: "product",
          hasManyAlias: "review",
        },
      },
    },
    {
      tableName: "review", // specify the table name here
    }
  );
  return Review;
};
