const mongoose = require("mongoose");

const PaletteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "New Palette"
    },
    colors: { 
      type: [String], 
      required: true, 
      validate: [arr => arr.length > 0, 'Palette must have at least one color.']
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
