import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../../utils/Cloudinary.js";
import { Gallery } from "./Gallery.model.js"; // Import your Gallery model

const uploadGalleryImage = asyncHandler(async (req, res) => {
  try {
    if (!req.body) {
      throw new ApiError(400, "Request body is missing or empty");
    }

    const { title, status } = req.body;

    if (![title, status].every((field) => field?.trim())) {
      throw new ApiError(400, "All fields are required");
    }

    const imageLocalPath = req.files?.image[0]?.path;
    if (!imageLocalPath) {
      throw new ApiError(400, "Image file is required");
    }

    const uploadedImage = await uploadOnCloudinary(imageLocalPath);
    if (!uploadedImage) {
      throw new ApiError(500, "Failed to upload image");
    }

    const galleryItem = await Gallery.create({
      image: uploadedImage.url,
      title,
      status,
    });

    return res.status(201).json({
      success: true,
      data: galleryItem,
      message: "Image uploaded to gallery successfully",
    });
  } catch (error) {
    console.error("Error during gallery image upload:", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});
const getAllGalleryImages = asyncHandler(async (req, res) => {
  try {
    const galleryImages = await Gallery.find(); // Fetch all gallery images

    return res.status(200).json({
      success: true,
      data: galleryImages,
      message: "Gallery images retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving gallery images:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
const deleteGalleryImage = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body; // Assuming id is passed in the request body

    console.log("Deleting gallery image with ID:", id);

    // Find the gallery image by id and delete it
    const deletedGalleryImage = await Gallery.findByIdAndDelete(id);

    if (!deletedGalleryImage) {
      console.log("Gallery image not found with ID:", id);
      return res
        .status(404)
        .json({ success: false, message: "Gallery image not found" });
    }

    console.log("Gallery image deleted successfully with ID:", id);

    return res.json({
      success: true,
      message: "Gallery image deleted successfully",
    });
  } catch (error) {
    console.error("Error during gallery image deletion:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});
const editGalleryImage = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    const { title, status } = req.body;

    const galleryImage = await Gallery.findById(id);
    if (!galleryImage) {
      return res
        .status(404)
        .json({ success: false, message: "Gallery image not found" });
    }

    if (title) galleryImage.title = title;
    if (status) galleryImage.status = status;

    if (req.files && req.files.image) {
      const imageLocalPath = req.files.image[0].path;
      const uploadedImage = await uploadOnCloudinary(imageLocalPath);
      if (!uploadedImage) {
        throw new Error("Failed to upload image");
      }
      galleryImage.image = uploadedImage.url;
    }

    await galleryImage.save();

    return res.json({
      success: true,
      data: galleryImage,
      message: "Gallery image updated successfully",
    });
  } catch (error) {
    console.error("Error during gallery image edit:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});
export {
  uploadGalleryImage,
  getAllGalleryImages,
  deleteGalleryImage,
  editGalleryImage,
};
