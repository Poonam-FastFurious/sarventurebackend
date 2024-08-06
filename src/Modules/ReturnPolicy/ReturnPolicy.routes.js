import { Router } from "express";
import { addReturnPolicy } from "./ReturmPolicy.controler.js";


const router = Router();

router.route("/add").post(addReturnPolicy);


export default router;