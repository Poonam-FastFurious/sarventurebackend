import { Router } from "express";
import {
  addAssociateMember,
  deleteAssociateMember,
  editAssociateMember,
  getAllAssociateMembers,
} from "./Associate.controler.js";
import { upload } from "../../middlewares/FileUpload.middlwares.js";

const router = Router();

router.route("/add").post(
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  addAssociateMember
);
router.route("/edit").patch(editAssociateMember);
router.route("/delete").delete(deleteAssociateMember);
router.route("/all").get(getAllAssociateMembers);

export default router;
