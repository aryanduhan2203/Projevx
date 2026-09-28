import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { ProjectMember } from "../models/projectmember.models.js";
export const verifyJWT = asyncHandler(
  async (req, res, next) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry",
      );

      if (!user) {
        throw new ApiError(401, "Invalid access token");
      }
      req.user = user;
      next();
    } catch (error) {
      throw new ApiError(401, "Invalid access token");
    }
  },
);

/**
 * Authorization (403) - runs AFTER verifyJWT (authentication, 401).
 * Usage: validateProjectPermission([UserRolesEnum.ADMIN])
 * An empty list means "any member of the project".
 */
export const validateProjectPermission = (allowedRoles = []) =>
  asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;

    if (!projectId || !mongoose.isValidObjectId(projectId)) {
      throw new ApiError(400, "Invalid project id");
    }

    const membership = await ProjectMember.findOne({
      project: projectId,
      user: req.user._id,
    });

    if (!membership) {
      throw new ApiError(403, "You are not a member of this project");
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(membership.role)) {
      throw new ApiError(
        403,
        "You do not have permission to perform this action",
      );
    }

    req.projectMember = membership; // later handlers can read the caller's role
    next();
  });
