import mongoose, {
  Schema,
  models,
} from "mongoose";

const AchievementSchema =
  new Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      issuer: {
        type: String,
        required: true,
        trim: true,
      },

      year: {
        type: String,
        default: "",
      },

      type: {
        type: String,
        default: "",
      },

      status: {
        type: String,
        default: "",
      },

      description: {
        type: String,
        default: "",
      },

      tags: {
        type: [String],
        default: [],
      },

      image: {
        type: String,
        default: "",
      },

      imagePublicId: {
        type: String,
        default: "",
      },

      credentialUrl: {
        type: String,
        default: "",
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

const Achievement =
  models.Achievement ||
  mongoose.model(
    "Achievement",
    AchievementSchema
  );

export default Achievement;