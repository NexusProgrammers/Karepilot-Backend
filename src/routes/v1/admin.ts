import { Router } from "express";
import {
  registerAdminUser,
  loginAdminUser,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  getAllAdminUsers,
  getAdminUserById,
  updateAdminUserById,
  deleteAdminUser,
  getAdminRolesAndPermissions,
} from "../../controllers/adminController";
import {
  authenticateAdmin,
  requirePermission,
  requireAnyPermission,
  requireRole,
} from "../../middlewares/auth";
import { uploadSingleImage } from "../../middlewares/upload";
import {
  adminUserRegistrationSchema,
  adminUserLoginSchema,
  adminUserUpdateSchema,
  adminPasswordChangeSchema,
  adminUserQuerySchema,
  adminUserIdParamSchema,
} from "../../validations/adminUserSchemas";
import { Permission } from "../../models/adminUser";
import { validate } from "../../utils";

const adminRouter = Router();

adminRouter.post("/register", validate(adminUserRegistrationSchema), registerAdminUser);
adminRouter.post("/login", validate(adminUserLoginSchema), loginAdminUser);
adminRouter.get("/roles-permissions", getAdminRolesAndPermissions);

adminRouter.use(authenticateAdmin);

adminRouter.get("/profile", getAdminProfile);
adminRouter.put("/profile", uploadSingleImage, validate(adminUserUpdateSchema), updateAdminProfile);
adminRouter.put("/change-password", validate(adminPasswordChangeSchema), changeAdminPassword);

adminRouter.get(
  "/users",
  validate(adminUserQuerySchema, "query"),
  requireAnyPermission([Permission.EDIT_USERS, Permission.DELETE_USERS]),
  getAllAdminUsers,
);

adminRouter.get(
  "/users/:id",
  validate(adminUserIdParamSchema, "params"),
  requireAnyPermission([Permission.EDIT_USERS, Permission.DELETE_USERS]),
  getAdminUserById,
);

adminRouter.put(
  "/users/:id",
  validate(adminUserIdParamSchema, "params"),
  requirePermission(Permission.EDIT_USERS),
  validate(adminUserUpdateSchema),
  updateAdminUserById,
);

adminRouter.delete(
  "/users/:id",
  validate(adminUserIdParamSchema, "params"),
  requirePermission(Permission.DELETE_USERS),
  deleteAdminUser,
);

export default adminRouter;
