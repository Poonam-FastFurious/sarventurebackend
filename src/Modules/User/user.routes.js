// import { Router } from "express";
// import {
//   loginUser,
//   logoutUser,
//   registerUser,
//   refreshAccessToken,
//   changeCurrentPassword,
//   getCurrentUser,
//   updateUserAvatar,
//   updateAccountDetails,
//   getAllUsers,
//   getUserProfile,
// } from "./User.controler.js";

// import { verifyJWT } from "../../middlewares/auth.middlwares.js";
// import { upload } from "../../middlewares/FileUpload.middlwares.js";

// const router = Router();

// router.route("/register").post(
//   upload.fields([
//     {
//       name: "avatar",
//       maxCount: 1,
//     },
//   ]),
//   registerUser
// );

// router.route("/login").post(loginUser);

// //secured routes
// router.route("/logout").post(verifyJWT, logoutUser);
// router.route("/refresh-token").post(refreshAccessToken);
// router.route("/change-password").post(verifyJWT, changeCurrentPassword);
// router.route("/current-user").get(verifyJWT, getCurrentUser);
// router.route("/alluser").get(getAllUsers);
// router.route("/update-account").patch(verifyJWT, updateAccountDetails);
// router.route("/getuser").get(getUserProfile);

// router
//   .route("/avatar")
//   .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

// export default router;
