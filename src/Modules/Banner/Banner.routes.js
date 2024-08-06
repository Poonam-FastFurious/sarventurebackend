import { Router } from "express";
import { upload } from "../../middlewares/FileUpload.middlwares.js";
import {
  deleteBanner,
  editBanner,
  getallbanner,
  uploadBanner,
} from "./Banner.controler.js";

const router = Router();

router.route("/add").post(
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  uploadBanner
);
router.route("/edit").patch(
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  editBanner
);
router.route("/delete").delete(deleteBanner);
router.route("/allabnner").get(getallbanner);

export default router;
