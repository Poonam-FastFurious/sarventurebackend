import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { AssociateMember } from "./Associate.model.js";
import { User } from "../CTHUser/User.model.js";
import { uploadOnCloudinary } from "../../utils/Cloudinary.js";

const addAssociateMember = asyncHandler(async (req, res) => {
  try {
    const { firstName, experience, designation, status } = req.body;

    // Validate required fields
    if (
      ![firstName, experience, designation, status].every((field) =>
        field?.trim()
      )
    ) {
      throw new ApiError(
        400,
        "First Name, Experience, Designation, and Status are required"
      );
    }

    // Check if the user exists by first name
    const user = await User.findOne({ firstName });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Check if the user is already an associate member
    const existingAssociateMember = await AssociateMember.findOne({
      user: user._id,
    });
    if (existingAssociateMember) {
      throw new ApiError(409, "User is already an associate member");
    }

    // Handle image upload
    const imageLocalPath = req.files?.image[0]?.path;
    if (!imageLocalPath) {
      throw new ApiError(400, "Image file is required");
    }

    const uploadedImage = await uploadOnCloudinary(imageLocalPath);
    if (!uploadedImage) {
      throw new ApiError(500, "Failed to upload image");
    }

    // Create associate member object
    const associateMember = await AssociateMember.create({
      user: user._id,
      experience,
      designation,
      status,
      image: uploadedImage.url, // Save the image URL
    });

    // Fetch created associate member with user details
    const createdAssociateMember = await AssociateMember.findById(
      associateMember._id
    ).populate("user", "-refreshToken");

    if (!createdAssociateMember) {
      throw new ApiError(
        500,
        "Something went wrong while adding the associate member"
      );
    }

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          createdAssociateMember,
          "Associate member added successfully"
        )
      );
  } catch (error) {
    console.error("Error during associate member creation:", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});

const editAssociateMember = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const { experience, designation, status } = req.body;

  // Validate required fields
  if ([experience, designation, status].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Experience, Designation, and Status are required");
  }

  // Check if the associate member exists
  const associateMember = await AssociateMember.findById(id);
  if (!associateMember) {
    throw new ApiError(404, "Associate member not found");
  }

  // Update associate member details
  associateMember.experience = experience;
  associateMember.designation = designation;
  associateMember.status = status;

  // Save the updated associate member
  const updatedAssociateMember = await associateMember.save();

  // Fetch updated associate member with user details
  const populatedAssociateMember = await AssociateMember.findById(
    updatedAssociateMember._id
  ).populate("user", "-refreshToken");

  if (!populatedAssociateMember) {
    throw new ApiError(
      500,
      "Something went wrong while updating the associate member"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        populatedAssociateMember,
        "Associate member updated successfully"
      )
    );
});
const deleteAssociateMember = asyncHandler(async (req, res) => {
  const { id } = req.query;

  // Validate ID parameter
  if (!id) {
    throw new ApiError(400, "Associate member ID is required");
  }

  // Find the associate member by ID
  const associateMember = await AssociateMember.findById(id);
  if (!associateMember) {
    throw new ApiError(404, "Associate member not found");
  }

  // Delete the associate member
  await AssociateMember.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Associate member deleted successfully"));
});
const getAllAssociateMembers = asyncHandler(async (req, res) => {
  // Fetch all associate members with user details
  const associateMembers = await AssociateMember.find()
    .populate("user", "-refreshToken")
    .lean(); // Use lean for better performance

  if (!associateMembers.length) {
    return res
      .status(404)
      .json(new ApiResponse(404, [], "No associate members found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        associateMembers,
        "Associate members retrieved successfully"
      )
    );
});

export {
  addAssociateMember,
  editAssociateMember,
  deleteAssociateMember,
  getAllAssociateMembers,
};
