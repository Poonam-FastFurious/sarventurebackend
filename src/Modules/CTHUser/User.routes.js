import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getCurrentUser,
  loginUser,
  registerUser,
  updateUser,
} from "./User.controler.js";
import { upload } from "../../middlewares/FileUpload.middlwares.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/login").post(loginUser);
router.route("/alluser").get(getAllUsers);
router.route("/update").patch(updateUser);
router.route("/delete").delete(deleteUser);
router.route("/currentuser").get(getCurrentUser);
export default router;
