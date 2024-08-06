import mongoose from "mongoose";

const returnPolicySchema = new mongoose.Schema({
      ReturnPolicy: {
            type: String,
            required: true
      },

}, { timestamps: true });

export const ReturnPolicyModal = mongoose.model('ReturnPolicy', returnPolicySchema);


