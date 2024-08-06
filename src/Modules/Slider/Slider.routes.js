import { Router } from "express";
import { upload } from "../../middlewares/FileUpload.middlwares.js";
import { addSlider, deleteSlider, getAllSliders, updateSlider } from "./Slider.controler.js";


const router = Router();

router.route("/add").post(
      upload.fields([
            {
                  name: "sliderImage",
                  maxCount: 1,
            },
      ]),
      addSlider
);
router.route("/edit").patch(
      upload.fields([
            {
                  name: "sliderImage",
                  maxCount: 1,
            },
      ]),
      updateSlider
);
router.route("/allslider").get(getAllSliders);
router.route("/delete").delete(deleteSlider);
export default router;
