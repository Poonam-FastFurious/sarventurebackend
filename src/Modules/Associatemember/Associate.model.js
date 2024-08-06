import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AssociateMemberSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      required: true,
    },
    image: {
      // New field for storing the image URL
      type: String,
      required: true, // Set to true if the image is required
    },
  },
  { timestamps: true }
);

export const AssociateMember = mongoose.model(
  "AssociateMember",
  AssociateMemberSchema
);
