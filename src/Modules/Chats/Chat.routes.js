import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middlwares.js";
import { accessChat, addToGroup, createGroupChat, fetchChats, removeFromGroup, renameGroup } from "./Chat.controler.js";


const router = Router();
router.route("/").post(verifyJWT, accessChat);
router.route("/getallchat").get(verifyJWT, fetchChats);
router.route("/groupcreate").post(verifyJWT, createGroupChat);
router.route("/renamegroup").patch(verifyJWT, renameGroup);
router.route("/groupadduser").patch(verifyJWT, addToGroup);
router.route("/groupremoveuser").patch(verifyJWT, removeFromGroup);

export default router;
