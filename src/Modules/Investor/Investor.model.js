import mongoose from "mongoose";
const Schema = mongoose.Schema;

const InvestorSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    contents: [
      {
        type: String,
        required: true,
      },
    ],
    documents: [
      {
        type: String, // Assuming documents are stored as URLs
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive"],
      required: true,
    },
  },
  { timestamps: true }
);

export const Investor = mongoose.model("Investor", InvestorSchema);
