import { body, param } from "express-validator";
import { AvailableUserRole } from "../utils/constants.js";

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Emial is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("username is required")
      .isLowercase()
      .withMessage("username must be in lowercase")
      .isLength({ min: 3 })
      .withMessage("username must be three character long"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ];
};

const userLoginValidator = () => {
  return [
    body("email").optional().isEmail().withMessage("Email is invalid"),
    body("password").notEmpty().withMessage("password is required"),
  ];
};

const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("old password is required"),
    body("newPassword")
      .notEmpty()
      .withMessage("new Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("Email is invalid"),
  ];
};

const userResetForgotValidator = () => {
  return[
    body("newPassword")
      .notEmpty()
      .withMessage("password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
  ];
};
const projectIdParamValidator = () => {
  return [param("projectId").isMongoId().withMessage("Invalid project id")];
};

const memberParamsValidator = () => {
  return [
    param("projectId").isMongoId().withMessage("Invalid project id"),
    param("userId").isMongoId().withMessage("Invalid user id"),
  ];
};

const createProjectValidator = () => {
  return [
    body("name").trim().notEmpty().withMessage("Project name is required"),
    body("description").optional().trim(),
  ];
};

const updateProjectValidator = () => {
  return [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
    body("description").optional().trim(),
  ];
};

const addMemberToProjectValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("role")
      .optional()
      .isIn(AvailableUserRole)
      .withMessage(`Role must be one of: ${AvailableUserRole.join(", ")}`),
  ];
};

const updateMemberRoleValidator = () => {
  return [
    body("newRole")
      .notEmpty()
      .withMessage("newRole is required")
      .isIn(AvailableUserRole)
      .withMessage(`Role must be one of: ${AvailableUserRole.join(", ")}`),
  ];
};

export {
  projectIdParamValidator,
  memberParamsValidator,
  createProjectValidator,
  updateProjectValidator,
  addMemberToProjectValidator,
  updateMemberRoleValidator,
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetForgotValidator,
};
