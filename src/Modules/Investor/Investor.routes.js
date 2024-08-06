import { Router } from "express";
import { upload } from "../../middlewares/FileUpload.middlwares.js";
import {
  addOrUpdateInvestor,
  deleteInvestor,
  getAllInvestors,
} from "./Investor.controler.js";

const router = Router();

router.route("/add").post(
  upload.fields([
    {
      name: "documents",
      maxCount: 1,
    },
  ]),
  addOrUpdateInvestor
);
router.route("/all").get(getAllInvestors);
router.route("/delete").delete(deleteInvestor);

export default router;
