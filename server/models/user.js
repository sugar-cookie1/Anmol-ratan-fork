import { Schema, model } from "mongoose"

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isAllowed: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

export const User = model("User", userSchema)
