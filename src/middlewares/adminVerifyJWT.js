import { Admin } from "../Modules/Admin/Admin.model.js"; // Ensure correct import path
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const adminVerifyJWT = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    console.error("Unauthorized request: No token provided");
    throw new ApiError(401, "Unauthorized request: No token provided");
  }

  try {
    console.log("Token received:", token);
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded Token:", decodedToken);

    if (!decodedToken?._id) {
      console.error("Unauthorized request: Invalid token structure");
      throw new ApiError(401, "Unauthorized request: Invalid token structure");
    }

    console.log("Fetching admin with ID:", decodedToken._id);
    const admin = await Admin.findById(decodedToken._id).select(
      "-password -refreshToken"
    );
    if (!admin) {
      console.error("Unauthorized request: Admin not found");
      throw new ApiError(401, "Unauthorized request: Admin not found");
    }

    req.admin = admin; // Attach admin to the request object
    next();
  } catch (error) {
    console.error("Error in adminVerifyJWT middleware:", error);
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Unauthorized request: Token expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Unauthorized request: Invalid token");
    } else {
      throw new ApiError(401, "Unauthorized request");
    }
  }
});
