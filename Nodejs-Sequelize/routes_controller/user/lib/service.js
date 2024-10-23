const { status, common, enums, messages } = require("../../../utils");
const db = require("../../../db/models");

module.exports = {
  async createUser(userData, transaction, req) {
    const userFields = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      mobile: userData.mobile,
      email: userData.email,
      password: userData.password,
      roleId: userData.roleId,
      createdBy: userData.createdBy,
    };
    const newUserData = await db.User.create(userFields, { transaction });
    return {
      status: status.OK,
      message: messages.USER_CREATE,
      id: newUserData.id ? newUserData.id : null,
    };
  },

  async updateUser(userData, transaction, modalData) {
    const userFields = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      mobile: userData.mobile,
      email: userData.email,
      roleId: userData.roleId,
      updatedBy: userData.updatedBy,
    };
    modalData.set(userFields);
    await modalData.save({ transaction });
    return {
      status: status.OK,
      message: messages.USER_UPDATE,
    };
  },
};
