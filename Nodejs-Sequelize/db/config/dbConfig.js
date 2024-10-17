module.exports = {
  host: "127.0.0.1",
  username: "root",
  password: null,
  DB: "node_sequelize_api_db",
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
};
