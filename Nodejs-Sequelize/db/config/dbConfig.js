module.exports = {
  development: {
    username: "root",
    password: null,
    database: "node_sequelize_api_db",
    host: "127.0.0.1",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    migrationStorageTableName: "SequelizeMeta",
    seederStorage: "sequelize",
    seederStorageTableName: "SequelizeData",
    logging: false,
  },
};
