const categoryModel = require("./category.model");
const { categoryMessage } = require("./category.messages");
const autoBind = require("auto-bind");
const { isValidObjectId, Types } = require("mongoose");
const createHttpError = require("http-errors");
const { default: slugify } = require("slugify");
const optionModel = require("../option/option.model");

class categoryService {
  #model;
  #optionModel;
  constructor() {
    autoBind(this);
    this.#model = categoryModel;
    this.#optionModel = optionModel;
  }
  async create(categoryDto) {
    if (categoryDto?.parent && isValidObjectId(categoryDto.parent)) {
      const existCategory = await this.checkExistById(categoryDto.parent);
      categoryDto.parent = existCategory._id;
      categoryDto.parents = [
        ...new Set(
          [existCategory._id.toString()]
            .concat(existCategory.parents.map((id) => id.toString()))
            .map((id) => new Types.ObjectId(id))
        ),
      ];
    }
    if (categoryDto?.slug) {
      categoryDto.slug = slugify(categoryDto.slug);
      await this.alreadyExistBySlug(categoryDto.slug);
    } else {
      categoryDto.slug = slugify(categoryDto.name);
    }
    const category = await this.#model.create(categoryDto);
    return category;
  }

  async find() {
    return this.#model
      .find({ parent: { $exists: false } })
      .populate([{ path: "children" }]);
  }

  async remove(id) {
    await this.checkExistById(id);
    await this.#optionModel.deleteMany({ category: id }).then(async () => {
      await this.#model.deleteOne({ _id: id });
    });
    await this.#model.updateMany(
      { parent: id },
      { $unset: { parent: "" }, $set: { parents: [] } }
    );
    return true;
  }

  async checkExistById(id) {
    const category = await this.#model.findById(id);
    if (!category) throw new createHttpError.NotFound(categoryMessage.notFound);
    return category;
  }

  async checkExistBySlug(slug) {
    const category = await this.#model.findOne({ slug });
    if (!category) throw new createHttpError.NotFound(categoryMessage.notFound);
    return category;
  }

  async alreadyExistBySlug(slug) {
    const category = await this.#model.findOne({ slug });

    if (category)
      throw new createHttpError.Conflict(categoryMessage.alreadyExistCategory);
    return category;
  }
}

module.exports = new categoryService();
