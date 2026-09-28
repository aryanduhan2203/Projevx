import { Router } from "express";
import {
  addMembersToProject,
  createProject,
  deleteMember,
  deleteProject,
  getProjectById,
  getProjectMembers,
  getProjects,
  updateMembeRole,
  updateProject,
} from "../controllers/project.controlleres.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  verifyJWT,
  validateProjectPermission,
} from "../middlewares/auth.middleware.js";
import {
  addMemberToProjectValidator,
  createProjectValidator,
  memberParamsValidator,
  projectIdParamValidator,
  updateMemberRoleValidator,
  updateProjectValidator,
} from "../validators/index.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const router = Router();

// Every project route requires a logged-in user (401 otherwise)
router.use(verifyJWT);

router
  .route("/")
  .get(getProjects)
  .post(createProjectValidator(), validate, createProject);

router
  .route("/:projectId")
  .get(
    projectIdParamValidator(),
    validate,
    validateProjectPermission(AvailableUserRole),
    getProjectById,
  )
  .put(
    projectIdParamValidator(),
    updateProjectValidator(),
    validate,
    validateProjectPermission([UserRolesEnum.ADMIN]),
    updateProject,
  )
  .delete(
    projectIdParamValidator(),
    validate,
    validateProjectPermission([UserRolesEnum.ADMIN]),
    deleteProject,
  );

router
  .route("/:projectId/members")
  .get(
    projectIdParamValidator(),
    validate,
    validateProjectPermission(AvailableUserRole),
    getProjectMembers,
  )
  .post(
    projectIdParamValidator(),
    addMemberToProjectValidator(),
    validate,
    validateProjectPermission([UserRolesEnum.ADMIN]),
    addMembersToProject,
  );

router
  .route("/:projectId/members/:userId")
  .put(
    memberParamsValidator(),
    updateMemberRoleValidator(),
    validate,
    validateProjectPermission([UserRolesEnum.ADMIN]),
    updateMembeRole,
  )
  .delete(
    memberParamsValidator(),
    validate,
    validateProjectPermission([UserRolesEnum.ADMIN]),
    deleteMember,
  );

export default router;
