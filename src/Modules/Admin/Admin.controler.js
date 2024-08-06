import crypto from "crypto";
import { asyncHandler } from "../../utils/asyncHandler.js";
import connectDB from "../../db/index.js";
import { Admin } from "./Admin.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import sendEmail from "../../utils/Sendemail.js";

const initializeAdmin = asyncHandler(async (req, res) => {
  try {
    await connectDB();
    const admin = await Admin.findOne({ isAdmin: true });

    if (!admin) {
      const adminuser = new Admin({
        username: "admin",
        password: "admin@123",
        email: "admin@gmail.com",
        profilePhoto:
          "https://themesbrand.com/velzon/html/master/assets/images/users/avatar-1.jpg",
      });
      await adminuser.save();
      console.log("admin created");
    } else {
      console.log("admin already exists");
    }
  } catch (error) {
    console.log("database connection failed in initialize admin", error);
    throw new ApiError(500, "Database connection failed", error.message);
  }
});

export { initializeAdmin };
const loginAdmin = async (req, res) => {
  const generateAccessAndRefereshTokens = async (userId) => {
    try {
      const admin = await Admin.findById(userId);
      const accessToken = admin.generateAccessToken();
      const refreshToken = admin.generateRefreshToken();

      admin.refreshToken = refreshToken;
      admin.loginTime = new Date();
      await admin.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(
        500,
        "Something went wrong while generating refresh and access token"
      );
    }
  };

  try {
    const { email, username, password } = req.body;

    if (!username && !email) {
      throw new ApiError(400, "Username or email is required");
    }

    // Find the user by username or email
    const admin = await Admin.findOne({ $or: [{ username }, { email }] });

    if (!admin) {
      throw new ApiError(404, "Admin does not exist");
    }

    // Check if user status is true

    // Validate password
    const isPasswordValid = await admin.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      admin._id
    );

    // Fetch logged-in user data (excluding password and refreshToken)
    const loggedInUser = await Admin.findById(admin._id).select(
      "-password -refreshToken"
    );
    admin.loginstatus = true;
    await admin.save({ validateBeforeSave: false });
    // Set options for cookies
    const options = {
      httpOnly: true,
      secure: true,
    };

    // Send response with cookies and logged-in user data
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken, refreshToken },
          "User logged in successfully"
        )
      );
  } catch (error) {
    console.error("Error during login:", error);

    // Handle specific errors
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }

    // Handle other unexpected errors
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const logoutAdmin = async (req, res) => {
  try {
    // Assuming you have the admin ID available in the request body or query parameters
    const adminId = req.body.adminId || req.query.adminId; // Modify this according to how the admin ID is sent in your request

    if (!adminId) {
      throw new ApiError(400, "Admin ID is required");
    }

    // Find the admin by ID
    const admin = await Admin.findById(adminId);

    if (!admin) {
      throw new ApiError(404, "Admin not found");
    }

    // Set login status to false
    admin.loginstatus = false;
    await admin.save({ validateBeforeSave: false });

    // Clear cookies (optional)
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res
      .status(200)
      .json({ success: true, message: "Admin logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);

    // Handle specific errors
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }

    // Handle other unexpected errors
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const getAdminDetails = async (req, res) => {
  connectDB();
  try {
    const adminId = req.query.adminId; // Extract adminId from query params
    if (!adminId) {
      throw new ApiError(400, "Admin ID is required in query params");
    }

    // Fetch admin details from the database based on the adminId
    const admin = await Admin.findById(adminId);

    if (!admin) {
      throw new ApiError(404, "Admin not found");
    }

    const adminDetails = {
      firstName: admin.firstName || "", // If firstName is null or undefined, assign an empty string
      lastName: admin.lastName || "",
      phoneNumber: admin.phoneNumber || "",
      email: admin.email || "",
      loginTime: admin.loginTime || null, // You can set a default value for dates as needed
      designation: admin.designation || "",
      website: admin.website || "",
      city: admin.city || "",
      country: admin.country || "",
      zipCode: admin.zipCode || "",
      username: admin.username || "",
      profilePhoto: admin.profilePhoto || "",
      portfolioLink: admin.portfolioLink || "",
      loginHistory: admin.loginHistory || [],
      isAdmin: admin.isAdmin,
    };

    // Send admin details in the response
    res.json(
      new ApiResponse(200, adminDetails, "Admin details retrieved successfully")
    );
  } catch (error) {
    console.error("Error fetching admin details:", error);

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }

    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
const updateAdmin = async (req, res) => {
  const {
    adminId,
    firstName,
    lastName,
    phoneNumber,
    email,
    designation,
    website,
    city,
    country,
    zipCode,
    username,
    profilePhoto,
    portfolioLink,
  } = req.body;

  try {
    if (!adminId) {
      return res.status(400).json({ error: "admin id are required" });
    }

    const admin = await Admin.findByIdAndUpdate(
      adminId,
      {
        $set: {
          firstName,
          lastName,
          phoneNumber,
          email,
          designation,
          website,
          city,
          country,
          zipCode,
          username,
          profilePhoto,
          portfolioLink,
        },
      },
      { new: true }
    ).select("-password");

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    return res
      .status(200)
      .json({ message: "Account details updated successfully", admin });
  } catch (error) {
    console.error("Error updating account details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const changeAdminPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!req.admin) {
      throw new ApiError(401, "Unauthorized request: Token expired");
    }

    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      throw new ApiError(404, "Admin not found");
    }

    const isPasswordCorrect = await admin.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
      throw new ApiError(400, "Invalid old password");
    }

    admin.password = newPassword;
    await admin.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Error during password change:", error);

    // Handle specific errors
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }

    // Handle other unexpected errors
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const verifyPassword = asyncHandler(async (req, res) => {
  const generateAccessAndRefreshTokens = async (userId) => {
    try {
      const admin = await Admin.findById(userId);
      const accessToken = admin.generateAccessToken();
      const refreshToken = admin.generateRefreshToken();

      admin.refreshToken = refreshToken;
      admin.loginTime = new Date();
      await admin.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(
        500,
        "Something went wrong while generating refresh and access token"
      );
    }
  };

  try {
    const { password } = req.body;

    // Validate input
    if (!password) {
      throw new ApiError(400, "Password is required");
    }

    // Find the admin (assuming there's only one admin)
    const admin = await Admin.findOne({ isAdmin: true });

    if (!admin) {
      throw new ApiError(404, "Admin not found");
    }

    // Validate password
    const isPasswordValid = await admin.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid password");
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      admin._id
    );

    // Fetch logged-in admin data (excluding password and refreshToken)
    const loggedInAdmin = await Admin.findById(admin._id).select(
      "-password -refreshToken"
    );
    admin.loginstatus = true;
    await admin.save({ validateBeforeSave: false });

    // Set options for cookies
    const cookieOptions = {
      httpOnly: true,
      secure: true, // Ensure cookies are secure in production
    };

    // Send response with cookies and logged-in admin data
    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { admin: loggedInAdmin, accessToken, refreshToken },
          "Password is correct, tokens generated successfully"
        )
      );
  } catch (error) {
    console.error("Error during password verification:", error);

    // Handle specific errors
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }

    // Handle other unexpected errors
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      throw new ApiError(404, "Admin with this email does not exist");
    }

    const resetToken = admin.generatePasswordResetToken();
    await admin.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/admin/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't request this, please ignore this email.`;

    await sendEmail({
      email: admin.email,
      subject: "Your password reset token (valid for 10 minutes)",
      message,
    });

    res.status(200).json(new ApiResponse(200, "Token sent to email!", true));
  } catch (error) {
    console.error("Error during forgot password:", error);

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const admin = await Admin.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!admin) {
      throw new ApiError(400, "Token is invalid or has expired");
    }

    admin.password = password;
    admin.passwordResetToken = undefined;
    admin.passwordResetExpires = undefined;
    await admin.save();

    res
      .status(200)
      .json(new ApiResponse(200, "Password has been reset!", true));
  } catch (error) {
    console.error("Error during password reset:", error);

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export {
  loginAdmin,
  logoutAdmin,
  getAdminDetails,
  updateAdmin,
  changeAdminPassword,
  verifyPassword,
  forgotPassword,
  resetPassword,
};
