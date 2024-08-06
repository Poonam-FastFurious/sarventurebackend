// controllers/testimonial.controller.js

import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { uploadOnCloudinary } from "../../utils/Cloudinary.js";
import { Testimonial } from "./Testimonial.modal.js";

const createTestimonial = async (req, res) => {
  try {
    if (!req.body) {
      throw new ApiError(400, "Request body is missing or empty");
    }

    const { name, message, rating, email } = req.body;

    if (![name, message, email].every((field) => field?.trim()) || !rating) {
      throw new ApiError(400, "Name, message, rating, and email are required");
    }

    const existingTestimonial = await Testimonial.findOne({ email });
    if (existingTestimonial) {
      throw new ApiError(409, "Testimonial from this email already exists");
    }

    const imageLocalPath = req.files?.photoUrl?.[0]?.path;

    if (imageLocalPath) {
      const image = await uploadOnCloudinary(imageLocalPath);
      if (!image) {
        throw new ApiError(400, "Failed to upload image");
      }
      photoUrl = image.url;
    }

    const testimonial = await Testimonial.create({
      name,
      message,
      rating,
      email,
      photoUrl,
    });

    const { _id: _, ...createdTestimonial } = testimonial.toObject();

    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          createdTestimonial,
          "Testimonial created successfully"
        )
      );
  } catch (error) {
    console.error("Error during testimonial creation:", error);

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
const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();

    if (!testimonials || testimonials.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No testimonials found",
      });
    }

    // Log testimonials to check if _id is present

    // Mapping testimonials to remove _id and converting to plain JS objects
    const formattedTestimonials = testimonials.map((testimonial) => {
      const { ...testimonialObj } = testimonial.toObject();
      return testimonialObj;
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          formattedTestimonials,
          "Successfully retrieved testimonials"
        )
      );
  } catch (error) {
    console.error("Error while fetching testimonials:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.body;

    const deletedTestimonial = await Testimonial.findByIdAndDelete(id);

    if (!deletedTestimonial) {
      throw new ApiError(404, "Testimonial not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Testimonial deleted successfully"));
  } catch (error) {
    console.error("Error during testimonial deletion:", error);

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
export { createTestimonial, getAllTestimonials, deleteTestimonial };
