const { validationResult } = require("express-validator");
const { status, messages } = require("./messages/api.response");
const cryptoJs = require("crypto-js");

const secretKey = "VIRAJ_PROJECT_SECRET_KEY";

module.exports = {
  expressValidate(req, res, next) {
    const errors = validationResult(req);
    let errorSort = errors.array({
      onlyFirstError: true,
    });

    if (!errors.isEmpty()) {
      let error = errorSort[0];
      return res
        .status(status.BadRequest)
        .json({ message: error?.msg, fields: errorSort });
    }
    next();
  },

  async addDaysSetHours(
    days,
    date = new Date(),
    hours = null,
    minutes = null,
    seconds = null
  ) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    if (hours != null) result.setHours(hours);
    if (minutes != null) result.setHours(hours, minutes);
    if (seconds != null) result.setHours(hours, minutes, seconds);
    return result;
  },

  /**
   *
   * @param {*} error Error Object.
   * @param {*} APIName - API/Function name where error occurred - will be used if REQ is not available.
   * @param {*} req Request Object (optional).
   * @param {*} res Response Object (optional).
   * @param {*} customMessage Any custom message to send in API response. (optional)
   * @returns return response to client with message.
   */
  throwException(error, APIName, req = null, res = null, customMessage = null) {
    if (Object.prototype.hasOwnProperty.call(error, "errors")) {
      error.message = error.errors[0].message || error.name;
    }

    if (req) {
      // eslint-disable-next-line no-console
      console.error(
        `Error in ${APIName}, URL: ${req.method} - ${req.url}:`,
        error.message
      );
    } else {
      // eslint-disable-next-line no-console
      console.error(`Error in ${APIName},`, error.message);
    }

    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("Error: ", error);
    }

    if (res) {
      return res.status(status.InternalServerError).json({
        message: customMessage
          ? customMessage
          : "Something went wrong, please try again!",
        error: error.message,
      });
    } else {
      return true;
    }
  },

  /**
   *
   * @description return date&Time in UTC format as per required with addon/deduction as param.
   */
  async getUTCDateComponents({
    dateObj,
    addMinutes = 0,
    subtractMinutes = 0,
    addHours = 0,
    addDays = 0,
  }) {
    if (!(dateObj instanceof Date) || isNaN(dateObj)) {
      throw new Error("Invalid Date object");
    }
    // Apply the time adjustments
    dateObj.setUTCMinutes(dateObj.getUTCMinutes() + Number(addMinutes));
    dateObj.setUTCHours(dateObj.getUTCHours() + Number(addHours));
    dateObj.setUTCDate(dateObj.getUTCDate() + Number(addDays));
    dateObj.setUTCMinutes(dateObj.getUTCMinutes() - Number(subtractMinutes));

    const pad = (number) => number.toString().padStart(2, "0");

    const year = dateObj.getUTCFullYear();
    const month = pad(dateObj.getUTCMonth() + 1); // Months are zero-indexed
    const date = pad(dateObj.getUTCDate());
    const hours = pad(dateObj.getUTCHours());
    const minutes = pad(dateObj.getUTCMinutes());
    const seconds = pad(dateObj.getUTCSeconds());

    const utcDate = `${year}-${month}-${date}`;
    const utcTime = `${hours}:${minutes}:${seconds}`;
    const utcDateTime = `${utcDate}T${utcTime}Z`;

    return {
      dateObj,
      utcDate,
      utcTime,
      utcDateTime,
    };
  },

  getFileObjFromReq(req, field = null) {
    if (req?.file) {
      return {
        key: req.file.key,
        acl: req.file.acl,
        location: req.file.location,
        bucket: req.file.bucket,
      };
    }
    return null;
  },

  /**
   * Decrypts data using AES encryption.
   * @param {string} encryptedData - Encrypted data as a base64 encoded string.
   * @returns {Object} - Decrypted data.
   */
  async decryptData(encryptedData) {
    const bytes = cryptoJs.AES.decrypt(encryptedData, secretKey);
    const decrypted = JSON.parse(bytes.toString(cryptoJs.enc.Utf8));
    return decrypted;
  },
};
