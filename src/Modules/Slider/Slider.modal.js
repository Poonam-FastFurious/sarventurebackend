import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema({
      sliderImage: {
            type: String,
            required: true
      },
      title: {
            type: String,
            required: true
      },
      details: {
            type: String,
            required: true
      },
      link: {
            type: String,
            required: true
      },

}, { timestamps: true });

export const Slider = mongoose.model('Slider', sliderSchema);
