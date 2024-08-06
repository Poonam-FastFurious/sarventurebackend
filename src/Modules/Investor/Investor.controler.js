import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { Investor } from "./Investor.model.js";
import { uploadOnCloudinary } from "../../utils/Cloudinary.js";

const addOrUpdateInvestor = asyncHandler(async (req, res) => {
  try {
    const { title, contents, status } = req.body;

    // Validate required fields
    if (![title, contents, status].every((field) => field?.trim())) {
      throw new ApiError(400, "Title, Contents, and Status are required");
    }

    // Parse contents to ensure they are arrays
    let contentArray;
    try {
      contentArray = JSON.parse(contents);
    } catch (err) {
      throw new ApiError(400, "Contents must be a valid JSON array");
    }

    if (!Array.isArray(contentArray) || !contentArray.length) {
      throw new ApiError(400, "Contents must be a non-empty array");
    }

    // Handle document uploads
    const documents = [];
    if (req.files?.documents) {
      for (const file of req.files.documents) {
        const uploadedDocument = await uploadOnCloudinary(file.path);
        if (!uploadedDocument) {
          throw new ApiError(500, "Failed to upload document");
        }
        documents.push(uploadedDocument.url); // Save the document URL
      }
    }

    // Check if an investor with the same title already exists
    let investor = await Investor.findOne({ title });

    if (investor) {
      // Update existing investor
      investor.contents = [...investor.contents, ...contentArray];
      investor.documents = [...investor.documents, ...documents];
      investor.status = status;

      await investor.save();

      return res
        .status(200)
        .json(new ApiResponse(200, investor, "Investor updated successfully"));
    } else {
      // Create new investor
      investor = await Investor.create({
        title,
        contents: contentArray,
        status,
        documents,
      });

      if (!investor) {
        throw new ApiError(
          500,
          "Something went wrong while adding the investor"
        );
      }

      return res
        .status(201)
        .json(new ApiResponse(201, investor, "Investor added successfully"));
    }
  } catch (error) {
    console.error("Error during investor creation:", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});

const getAllInvestors = asyncHandler(async (req, res) => {
  try {
    const investors = await Investor.find();

    if (!investors) {
      throw new ApiError(404, "No investors found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, investors, "Investors retrieved successfully")
      );
  } catch (error) {
    console.error("Error during fetching investors:", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});
const deleteInvestor = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;

    // Validate that an ID was provided
    if (!id) {
      throw new ApiError(400, "Investor ID is required");
    }

    // Find and delete the investor
    const investor = await Investor.findByIdAndDelete(id);

    if (!investor) {
      throw new ApiError(404, "Investor not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Investor deleted successfully"));
  } catch (error) {
    console.error("Error during investor deletion:", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});

export { addOrUpdateInvestor, getAllInvestors, deleteInvestor };
