import mongoose, {
  Schema,
  models,
} from "mongoose";

const ProfileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    shortBio: {
      type: String,
      default: "",
    },

    about: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    resumeUrl: {
      type: String,
      default: "",
    },

    resumePublicId: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    profileImagePublicId: {
      type: String,
      default: "",
    },

    availability: {
      type: Boolean,
      default: true,
    },

    socialLinks: {
      github: {
        type: String,
        default: "",
      },

      linkedin: {
        type: String,
        default: "",
      },

      instagram: {
        type: String,
        default: "",
      },

      facebook: {
        type: String,
        default: "",
      },

      whatsapp: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Profile =
  models.Profile ||
  mongoose.model(
    "Profile",
    ProfileSchema
  );

export default Profile;