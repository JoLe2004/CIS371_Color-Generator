const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(v);
        },
        message: () => `Password must be at least 8 characters long, contain a number and an uppercase letter.`,
      },
    },
    palettes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Palette",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
