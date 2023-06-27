const { Schema, model } = require("mongoose");

const pokemonSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    isDone: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

const Pokemon = model("pokemon", pokemonSchema);

module.exports = Pokemon;