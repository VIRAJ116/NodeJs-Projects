/* eslint-disable no-console */
"use strict";
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const dbConfig = require("../config/dbConfig.js");
const { Sequelize } = require("sequelize");
let sequelize;

sequelize = new Sequelize(
  dbConfig.development.database,
  dbConfig.development.username,
  dbConfig.development.password,
  {
    host: dbConfig.development.host,
    dialect: dbConfig.development.dialect,
    operatorsAliases: false,
    pool: {
      max: dbConfig.development.pool.max,
      min: dbConfig.development.pool.min,
      acquire: dbConfig.development.pool.acquire,
      idle: dbConfig.development.pool.idle,
    },
  }
);

const db = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// Looping all Models in db
Object.keys(db).forEach((modelName) => {
  // Current Model reference
  const currentModel = db[modelName];

  if (currentModel.options.auditEnabled === true) auditList.push(modelName);

  //** For Dynamic Associations */
  // Looping all columns in Model
  Object.keys(currentModel.rawAttributes).forEach((attributeName) => {
    // Current Column reference
    const currentColumn = currentModel.rawAttributes[attributeName];
    // Check if Column has association property
    if (Object.prototype.hasOwnProperty.call(currentColumn, "association")) {
      // check if Column has association and has model, key, belongsToAlias
      if (
        Object.prototype.hasOwnProperty.call(
          currentColumn.association,
          "model"
        ) &&
        Object.prototype.hasOwnProperty.call(
          currentColumn.association,
          "key"
        ) &&
        Object.prototype.hasOwnProperty.call(
          currentColumn.association,
          "belongsToAlias"
        )
      ) {
        // Referenced Model
        const referencedModel = db[currentColumn.association.model];
        // Default Aliases for BelongsTo and HasMany relations
        let belongsToAlias = currentColumn.association.belongsToAlias;
        let hasManyAlias = `${currentModel.name}s`;
        let hasOneAlias = `${currentModel.name}`;

        // If association property has belongsToAlias than use that
        if (currentColumn.association.belongsToAlias)
          belongsToAlias = currentColumn.association.belongsToAlias;

        // If association property has hasManyAlias than use that
        if (currentColumn.association.hasManyAlias)
          hasManyAlias = currentColumn.association.hasManyAlias;

        // If association property has hasOneAlias than use that
        //* Note: If hasOneAlias is defined then hasManyAlias will not work
        if (currentColumn.association.hasOneAlias)
          hasOneAlias = currentColumn.association.hasOneAlias;

        let columnActions = {};
        if (currentColumn.association.onUpdate)
          columnActions.onUpdate = currentColumn.association.onUpdate;

        if (currentColumn.association.onDelete)
          columnActions.onDelete = currentColumn.association.onDelete;

        // Other Options
        let options = {};

        // If reference property has options add
        if (currentColumn.association?.options)
          options = currentColumn.association.options;

        currentModel.belongsTo(referencedModel, {
          foreignKey: attributeName,
          as: belongsToAlias,
          ...columnActions,
          ...options,
        });
        if (!currentColumn.association.hasOneAlias) {
          referencedModel.hasMany(currentModel, {
            foreignKey: attributeName,
            as: hasManyAlias,
          });
        } else {
          referencedModel.hasOne(currentModel, {
            foreignKey: attributeName,
            as: hasOneAlias,
          });
        }
      } else {
        console.log(
          `***SKIPPED* ${modelName} -> ${attributeName} references a model`
        );
      }
    }
  });
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
