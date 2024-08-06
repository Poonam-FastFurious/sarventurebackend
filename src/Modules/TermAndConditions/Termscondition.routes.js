import { Router } from "express";

import { addtermscondition } from "./termscondition.controler.js";


const router = Router();
router.route("/add").post(addtermscondition);

export default router;
