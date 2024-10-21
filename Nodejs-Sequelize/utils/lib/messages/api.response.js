const status = {
  OK: 200,
  NotModified: 304,
  BadRequest: 400,
  Unauthorized: 401,
  NotFound: 404,
  Forbidden: 403,
  NotAcceptable: 406,
  Conflict: 409,
  InternalServerError: 500,
};
const messages = {
  succ_login: "Logged in successfully",
  err_login_failed: "Login failed",
  unauthorized: "Unauthorized Access",
  USER_LOG_OUT: "Logged Out Successfully",
  STATUS_UPDATE: "Status updated successfully",
  CHILD_DELETE_FIRST: "Please delete all child first",
  ONLY_SUPER_ADMIN_CAN_ACCESS: "Only super admin can access this API.",
  COVER_IMAGE_UPDATE: "Cover Image Updated Successfully",
  PROFILE_IMAGE_UPDATE: "Profile Image Updated Successfully",
  COVER_IMAGE_REMOVE: "Cover Image Removed Successfully",
  PROFILE_IMAGE_REMOVE: "Profile Image Removed Successfully",
  IMAGE_REMOVED_SUCCESSFULLY: "Image Removed Successfully",
  CODE_SENT_SUCCESSFULLY: "Code Sent Successfully",
  CODE_NOT_FOUND:
    "The verification code you entered is not valid. Please check your email for the correct code.",
  CODE_EXPIRED:
    "The verification code is no longer valid. Please resend the code to your email.",
  CODE_VERIFIED_SUCCESSFULLY: "Code Verified Successfully",
  ROLE_ALREADY_EXISTS: "Role already exists! Please enter a unique role.",

  //User Messages
  USER_CREATE: "User Created Successfully.",
  USER_UPDATE: "User updated successfully",
  USER_NOT_FOUND: "User not found",
  USER_DELETE: "User deleted successfully",

  // Email Template Category Messages
  EMAIL_TEMPLATE_CATEGORY_CREATE:
    "Email Template Category created successfully",
  EMAIL_TEMPLATE_CATEGORY_UPDATE:
    "Email Template Category updated successfully",
  EMAIL_TEMPLATE_CATEGORY_NOT_FOUND: "Email Template Category not found",
  EMAIL_TEMPLATE_CATEGORY_DELETE:
    "Email Template Category deleted successfully",

  // Email Template Messages
  EMAIL_TEMPLATE_CREATE: "Email Template created successfully",
  EMAIL_TEMPLATE_UPDATE: "Email Template updated successfully",
  EMAIL_TEMPLATE_NOT_FOUND: "Email Template not found",
  EMAIL_TEMPLATE_DELETE: "Email Template deleted successfully",

  // Email Configuration Messages
  EMAIL_CONFIGURATION_CREATE: "Email Configuration created successfully",
  EMAIL_CONFIGURATION_UPDATE: "Email Configuration updated successfully",
  EMAIL_CONFIGURATION_NOT_FOUND: "Email Configuration not found",
  EMAIL_CONFIGURATION_DELETE: "Email Configuration deleted successfully",

  // Module Messages
  MODULE_CREATE: "Module created successfully",
  MODULE_UPDATE: "Module updated successfully",
  MODULE_NOT_FOUND: "Module not found",
  MODULE_DELETE: "Module deleted successfully",

  // Project Setting Messages
  PROJECT_SETTING_CREATE: "Project Setting created successfully",
  PROJECT_SETTING_UPDATE: "Project Setting updated successfully",
  PROJECT_SETTING_NOT_FOUND: "Project Setting not found",
  PROJECT_SETTING_DELETE: "Project Setting deleted successfully",

  // Verification Email
  VERIFICATION_MAIL_SENT_SUCCESSFULLY:
    "Your new email address has received a verification link. Please check your inbox.",
  VERIFICATION_LINK_NOT_FOUND: "Verification link Not Found",
  EMAIL_VERIFIED_SUCCESSFULLY: "Email Verified Successfully",
  TOKEN_NOT_FOUND: "Token Not Found",
  LINK_EXPIRED: "Link Expired Please Generate New Link.",
  EMAIL_NOT_FOUND: "Email Not Found",
  MAIL_SENT_SUCCESSFULLY: "Mail Sent Successfully",
  MAX_COUNT: "You reached the limit.",
  EMAIL_CLEARED: "Email Cleared Successfully",

  // User Session Messages
  USER_SESSION_NOT_FOUND: "User Session Not Found",
  USER_SESSION_DELETED: "User Session Deleted Successfully",
  SESSION_EXPIRED: "Session Expired",
};

module.exports = {
  messages,
  status,
};
