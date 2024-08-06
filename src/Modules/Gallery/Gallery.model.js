import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true, // Ensure image URL is provided
    },
    title: {
      type: String,
      required: true, // Ensure title is provided
    },
    status: {
      type: String,
      enum: ["active", "inactive"], // Only allow these values
      default: "active", // Default status
    },
  },
  { timestamps: true }
); // Automatically manage createdAt and updatedAt fields

export const Gallery = mongoose.model("Gallery", gallerySchema);
