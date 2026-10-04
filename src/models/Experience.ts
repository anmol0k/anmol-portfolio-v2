import mongoose, { Schema, models } from "mongoose";

const ExperienceSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    period: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    highlights: {
      type: [String],
      default: [],
    },

    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Experience =
  models.Experience ||
  mongoose.model("Experience", ExperienceSchema);

export default Experience;