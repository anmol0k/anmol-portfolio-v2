import mongoose, {
  Schema,
  models,
} from "mongoose";

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    category: {
      type: String,
      default: "",
    },

    year: {
      type: String,
      default: "",
    },

    shortDescription: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    technologies: {
      type: [String],
      default: [],
    },

    thumbnail: {
      type: String,
      default: "",
    },

    thumbnailPublicId: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    imagePublicIds: {
      type: [String],
      default: [],
    },

    liveUrl: {
      type: String,
      default: "",
    },

    githubUrl: {
      type: String,
      default: "",
    },

    featured: {
      type: Boolean,
      default: false,
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

const Project =
  models.Project ||
  mongoose.model(
    "Project",
    ProjectSchema
  );

export default Project;