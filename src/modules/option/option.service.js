const optionModel = require("./option.model");
const { optionMessage } = require("./option.messages");
const autoBind = require("auto-bind");
const createHttpError = require("http-errors");
const { default: slugify } = require("slugify");
const categoryService = require("../category/category.service");
const { isTrue, isFalse } = require("../../common/utils/functions");
const { isValidObjectId } = require("mongoose");

class optionService {
  #model;
  #categoryService;
  constructor() {
    autoBind(this);
    this.#model = optionModel;
    this.#categoryService = categoryService;
  }

  async create(optionDto) {
    const category = await this.#categoryService.checkExistById(
      optionDto.category
    );
    optionDto.category = category._id;
    await this.alreadyExistByCategoryAndKey(optionDto.key, category._id);
    optionDto.key = slugify(optionDto.key, {
      trim: true,
      replacement: "_",
      lower: true,
    });

    if (optionDto?.enum && typeof optionDto.enum === "string") {
      optionDto.enum = optionDto.enum.split(",");
    } else if (!Array.isArray(optionDto.enum)) optionDto.enum = [];
    if (isTrue(optionDto?.required)) optionDto.required = true;
    if (isFalse(optionDto?.required)) optionDto.required = false;
    const option = await this.#model.create(optionDto);
    return option;
  }

  async update(id, optionDto) {
    const option = await this.checkExistById(id);

    if (optionDto?.category && isValidObjectId(optionDto.category)) {
      const category = await this.#categoryService.checkExistById(
        optionDto.category
      );
      optionDto.category = category._id;
    } else {
      delete optionDto.category;
    }

    if (optionDto?.key) {
      optionDto.key = slugify(optionDto.key, {
        trim: true,
        replacement: "_",
        lower: true,
      });
      let categoryId = option.category;
      if (optionDto.category) categoryId = optionDto.category;
      await this.alreadyExistByCategoryAndKey(optionDto.key, categoryId);
    }

    if (optionDto?.enum && typeof optionDto.enum === "string") {
      optionDto.enum = optionDto.enum.split(",");
    } else if (Array.isArray(optionDto.enum)) delete optionDto.enum;

    if (isTrue(optionDto?.required)) optionDto.required = true;
    else if (isFalse(optionDto?.required)) optionDto.required = false;
    else delete optionDto.required;
    return await this.#model.updateOne({ _id: id }, { $set: optionDto });
  }

  async find() {
    const options = await this.#model
      .find({}, { __v: 0 }, { sort: { _id: -1 } })
      .populate([{ path: "category", select: { name: 1, slug: 1 } }]);
    return options;
  }

  async findById(id) {
    return await this.checkExistById(id);
  }

  async removeById(id) {
    await this.checkExistById(id);
    return await this.#model.deleteOne({ _id: id });
  }

  async findByCatgeoryId(categoryId) {
    const options = await this.#model
      .find({ category: categoryId }, { __v: 0 }, { sort: { _id: -1 } })
      .populate([{ path: "category", select: { name: 1, slug: 1 } }]);
    return options;
  }

  async findByCategorySlug(slug) {
    const options = await this.#model.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $addFields: {
          categorySlug: "$category.slug",
          categoryName: "$category.name",
          categoryIcon: "$category.icon",
        },
      },
      {
        $project: {
          category: 0,
          __v: 0,
        },
      },
      { $match: { categorySlug: slug } },
    ]);
    return options;
  }

  async checkExistById(id) {
    const option = await this.#model.findById(id, { __v: 0 });
    if (!option) throw new createHttpError.NotFound(optionMessage.notFound);
    return option;
  }

  async alreadyExistByCategoryAndKey(key, category) {
    const isExist = await this.#model.findOne({ category, key });
    if (isExist)
      throw new createHttpError.Conflict(optionMessage.alreadyExistOption);
    return null;
  }
}

module.exports = new optionService();
