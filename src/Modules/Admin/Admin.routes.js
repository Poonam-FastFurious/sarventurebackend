import { Router } from "express";
import {
  changeAdminPassword,
  forgotPassword,
  getAdminDetails,
  loginAdmin,
  logoutAdmin,
  resetPassword,
  updateAdmin,
  verifyPassword,
} from "./Admin.controler.js";

import { adminVerifyJWT } from "../../middlewares/adminVerifyJWT.js";

const router = Router();

router.route("/login").post(loginAdmin);
router.route("/verifyPassword").post(verifyPassword);
router.route("/logout").post(logoutAdmin);
router.route("/Profile").get(getAdminDetails);
router.route("/update").patch(updateAdmin);
router.route("/change-password").post(adminVerifyJWT, changeAdminPassword);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").patch(resetPassword);

export default router;
