const { Schema, Types, model } = require("mongoose");

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    userId: { type: Types.ObjectId, required: true },
    amount: { type: Number, required: true, default: 0 },
    content: { type: String, required: true },
    category: { type: Types.ObjectId, ref: "category", required: true },
    province: { type: String, required: false },
    city: { type: String, required: false },
    district: { type: String, required: false },
    address: { type: String, required: false },
    coordinate: { type: [Number], required: true },
    images: { type: [String], required: false, default: [] },
    options: { type: {}, default: {} },
  },
  { timestamps: true }
);

const postModel = model("post", postSchema);
module.exports = postModel;
