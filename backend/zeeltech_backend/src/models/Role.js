const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const roleSchema = new Schema(
  {
    title: {
      type: String,
      enum: ["superadmin", "editor", "contributor"],
      unique: true,
      default: "contributor",
    },
    permissions: {
      type: [
        {
          resource: {
            type: String,
            enum: [
              "posts",
              "users",
              "comments",
              "projects",
              "services",
              "testimonials",
            ],
            required: true,
          },

          actions: {
            type: [String],
            enum: ["create", "read", "update", "delete"],
            default: ["read"],
          },
        },
      ],

      default: []
    },

    description: {
      type: String,
      required: [true, "role must have a description"],
      trim: true,
    },
  },
  { timestamps: true },
);

const Role = model("Role", roleSchema);

module.exports = Role;
