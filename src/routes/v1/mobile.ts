import { Router } from "express";
import {
  registerMobileUser,
  verifyEmail,
  resendVerificationCode,
  loginMobileUser,
  getMobileProfile,
  updateMobileProfile,
  changeMobilePassword,
  getAllMobileUsers,
  getMobileUserById,
  updateMobileUserStatus,
} from "../../controllers/mobileController";
import { authenticateMobile, authenticateAdmin, requireRole } from "../../middlewares/auth";
import { uploadSingleImage } from "../../middlewares/upload";
import {
  mobileUserRegistrationSchema,
  mobileUserLoginSchema,
  mobileUserUpdateSchema,
  mobilePasswordChangeSchema,
  emailVerificationSchema,
  resendVerificationSchema,
  mobileUserQuerySchema,
  mobileUserIdParamSchema,
} from "../../validations/mobileUserSchemas";
import { AdminRole } from "../../models/adminUser";
import { validate } from "../../utils";

const mobileRouter = Router();

mobileRouter.post("/register", validate(mobileUserRegistrationSchema), registerMobileUser);
mobileRouter.post("/verify-email", validate(emailVerificationSchema), verifyEmail);
mobileRouter.post(
  "/resend-verification",
  validate(resendVerificationSchema),
  resendVerificationCode,
);
mobileRouter.post("/login", validate(mobileUserLoginSchema), loginMobileUser);

mobileRouter.use(authenticateMobile);

mobileRouter.get("/profile", getMobileProfile);
mobileRouter.patch("/profile", uploadSingleImage, validate(mobileUserUpdateSchema), updateMobileProfile);
mobileRouter.put("/change-password", validate(mobilePasswordChangeSchema), changeMobilePassword);

mobileRouter.get(
  "/admin/users",
  authenticateAdmin,
  validate(mobileUserQuerySchema, "query"),
  requireRole([AdminRole.ADMIN, AdminRole.MANAGER]),
  getAllMobileUsers,
);

mobileRouter.get(
  "/admin/users/:id",
  authenticateAdmin,
  validate(mobileUserIdParamSchema, "params"),
  requireRole([AdminRole.ADMIN, AdminRole.MANAGER]),
  getMobileUserById,
);

mobileRouter.put(
  "/admin/users/:id/status",
  authenticateAdmin,
  validate(mobileUserIdParamSchema, "params"),
  requireRole([AdminRole.ADMIN]),
  updateMobileUserStatus,
);

export default mobileRouter;
