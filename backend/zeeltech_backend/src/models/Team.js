const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const TeamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    position: {
      type: String,
      required: true,
    },

    imgUrl: {
      type: String,
      required: true,
    },

    socialLinks: {
      linkedin: { type: String, default: "" },
      instagram: { type: String, default: "" },
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    isVisible: {
      type: Boolean,
      default: true,
    },
    bio: {
      type: String,
      maxLength: 1000,
    },

    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
  },
  { timestamps: true },
);

const Team = model("Team", TeamSchema);
module.exports = Team;
