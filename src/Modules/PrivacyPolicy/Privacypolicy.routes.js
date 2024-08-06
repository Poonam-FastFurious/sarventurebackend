import { Router } from "express";
import { addPrivacyPolicy } from "./Privacypolicy.controler.js";


const router = Router();
router.route("/add").post(addPrivacyPolicy);

export default router;
