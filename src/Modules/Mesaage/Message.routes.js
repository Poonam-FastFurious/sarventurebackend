import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middlwares.js";
import { allMessages, sendMessage } from "./Message.controler.js";

const router = Router();

router.route("/").post(verifyJWT, sendMessage);
router.route("/:chatId").get(verifyJWT, allMessages);

export default router;
