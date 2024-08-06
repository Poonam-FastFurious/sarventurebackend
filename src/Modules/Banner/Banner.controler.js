import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../../utils/Cloudinary.js";
import { Banner } from "./Banner.model.js";

const uploadBanner = asyncHandler(async (req, res) => {
  try {
    if (!req.body) {
      throw new ApiError(400, "Request body is missing or empty");
    }

    const { title, link, type, status } = req.body;

    if (![title, link, status].every((field) => field?.trim())) {
      throw new ApiError("All fields are required");
    }

    const imageLocalPath = req.files?.image[0]?.path;
    if (!imageLocalPath) {
      throw new Error("Image file is required");
    }

    const uploadedImage = await uploadOnCloudinary(imageLocalPath);
    if (!uploadedImage) {
      throw new Error("Failed to upload image");
    }

    const banner = await Banner.create({
      image: uploadedImage.url,
      title,
      link,
      type,
      status,
    });

    return res.status(201).json({
      success: true,
      data: banner,
      message: "Banner uploaded successfully",
    });
  } catch (error) {
    console.error("Error during banner upload:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
const editBanner = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    const { title, details, link, type, status } = req.body;

    // Find the banner by id
    const banner = await Banner.findById(id);
    if (!banner) {
      return res
        .status(404)
        .json({ success: false, message: "Banner not found" });
    }

    // Update banner fields
    if (title) banner.title = title;
    if (details) banner.details = details;
    if (link) banner.link = link;
    if (status) banner.status = status;
    if (type) banner.type = type;

    // If image is being updated
    if (req.files && req.files.image) {
      const imageLocalPath = req.files.image[0].path;
      const uploadedImage = await uploadOnCloudinary(imageLocalPath);
      if (!uploadedImage) {
        throw new Error("Failed to upload image");
      }
      banner.image = uploadedImage.url;
    }

    // Save the updated banner
    await banner.save();

    return res.json({
      success: true,
      data: banner,
      message: "Banner updated successfully",
    });
  } catch (error) {
    console.error("Error during banner edit:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});
const deleteBanner = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body; // Assuming id is passed as a query parameter

    console.log("Deleting banner with ID:", id);

    // Find the banner by id and delete it
    const deletedBanner = await Banner.findByIdAndDelete(id);

    if (!deletedBanner) {
      console.log("Banner not found with ID:", id);
      return res
        .status(404)
        .json({ success: false, message: "Banner not found" });
    }

    console.log("Banner deleted successfully with ID:", id);

    return res.json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.error("Error during banner deletion:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

const getallbanner = asyncHandler(async (req, res) => {
  const banner = await Banner.find();

  return res.json({
    success: true,
    data: banner,
  });
});
export { uploadBanner, editBanner, deleteBanner, getallbanner };
