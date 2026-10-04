import mongoose, {
  Schema,
  models,
} from "mongoose";

const LoginRateLimitSchema =
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
        default: 0,
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

const LoginRateLimit =
  models.LoginRateLimit ||
  mongoose.model(
    "LoginRateLimit",
    LoginRateLimitSchema
  );

export default LoginRateLimit;