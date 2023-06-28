const { Schema, model } = require("mongoose");

const videoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
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

const Video = model("video", videoSchema);

module.exports = Video;