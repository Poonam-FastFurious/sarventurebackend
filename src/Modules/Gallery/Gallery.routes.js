import { Router } from "express";
import {
  deleteGalleryImage,
  editGalleryImage,
  getAllGalleryImages,
  uploadGalleryImage,
} from "./Gallery.controler.js";
import { upload } from "../../middlewares/FileUpload.middlwares.js";

const router = Router();

router.route("/add").post(
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  uploadGalleryImage
);
router.route("/all").get(getAllGalleryImages);
router.route("/delete").delete(deleteGalleryImage);
router.route("/edit").patch(
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  editGalleryImage
);

export default router;
