// privacyPolicyModel.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const termsandcondition = new Schema({
      version: {
            type: String,
            required: true,

      },
      effectiveDate: {
            type: Date,
            required: true,
      },
      sections: [{
            title: {
                  type: String,
                  required: true,
            },
            content: {
                  type: String,
                  required: true,
            },
      }],
      createdAt: {
            type: Date,
            default: Date.now,
      },
      updatedAt: {
            type: Date,
            default: Date.now,
      },
});

export const termscondition = mongoose.model('termscondition', termsandcondition);


