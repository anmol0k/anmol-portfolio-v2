import mongoose, { Schema, models } from "mongoose";

const EducationSchema = new Schema(
  {
    degree: {
      type: String,
      required: true,
      trim: true,
    },

    institution: {
      type: String,
      required: true,
      trim: true,
    },

    period: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      default: "",
    },

    score: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    subjects: {
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

const Education =
  models.Education ||
  mongoose.model("Education", EducationSchema);

export default Education;