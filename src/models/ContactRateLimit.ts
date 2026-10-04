import mongoose, {
  Schema,
  models,
} from "mongoose";

const ContactRateLimitSchema =
  new Schema(
    {
      key: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      count: {
        type: Number,
        default: 1,
      },

      windowStart: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );

const ContactRateLimit =
  models.ContactRateLimit ||
  mongoose.model(
    "ContactRateLimit",
    ContactRateLimitSchema
  );

export default ContactRateLimit;