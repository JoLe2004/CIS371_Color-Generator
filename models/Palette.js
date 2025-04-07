const mongoose = require("mongoose");

const PaletteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "Palette"
    },
    colors: { 
      type: [String], 
      required: true 
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
  },
  {
    timestamps: true
  }
);

const Palette = mongoose.model("Palette", PaletteSchema);

module.exports = Palette;
