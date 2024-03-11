const { Schema, Types, model } = require("mongoose");

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: false, index: true },
    icon: { type: String, required: true },
    parent: { type: Types.ObjectId, ref: "Category", required: false },
    parents: {
      type: [Types.ObjectId],
      ref: "Category",
      required: false,
      default: [],
    },
  },
  { toJSON: { virtuals: true }, versionKey: false, id: false }
);

categorySchema.virtual("children", {
  ref: "category",
  localField: "_id",
  foreignField: "parent",
});

function autoPopulate(next) {
  this.populate([{ path: "children" }]);
  next();
}

categorySchema.pre("find", autoPopulate).pre("findOne", autoPopulate);

const CategoryModel = model("category", categorySchema);

module.exports = CategoryModel;
