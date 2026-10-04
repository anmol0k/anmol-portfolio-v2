import mongoose, {
  Schema,
  models,
} from "mongoose";

const TestimonialSchema =
  new Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      designation: {
        type: String,
        default: "",
        trim: true,
      },

      company: {
        type: String,
        default: "",
        trim: true,
      },

      image: {
        type: String,
        default: "",
      },

      imagePublicId: {
        type: String,
        default: "",
      },

      comment: {
        type: String,
        required: true,
        trim: true,
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

const Testimonial =
  models.Testimonial ||
  mongoose.model(
    "Testimonial",
    TestimonialSchema
  );

export default Testimonial;