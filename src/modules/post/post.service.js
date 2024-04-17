const postModel = require("./post.model");
const { postMessage } = require("./post.messages");
const autoBind = require("auto-bind");
const optionModel = require("../option/option.model");
const { isValidObjectId, Types } = require("mongoose");
const createHttpError = require("http-errors");
const CategoryModel = require("../category/category.model");

class postService {
  #model;
  #optionModel;
  #categoryModel;
  constructor() {
    autoBind(this);
    this.#model = postModel;
    this.#optionModel = optionModel;
    this.#categoryModel = CategoryModel;
  }

  async getCategoryOptions(categoryId) {
    const options = await this.#optionModel.find({ category: categoryId });
    return options;
  }

  async create(dto) {
    return await this.#model.create(dto);
  }

  async findMyPosts(userId) {
    if (userId && isValidObjectId(userId))
      return await this.#model.find({ userId });
    throw new createHttpError.BadRequest(postMessage.requestNotValid);
  }

  async findAll(options) {
    let { category, search } = options;
    let query = {};
    if (category) {
      const result = await this.#categoryModel.findOne({ slug: category });
      let categories = await this.#categoryModel.find(
        {
          parents: result._id,
        },
        { _id: 1 }
      );
      categories = categories.map((item) => item._id);
      if (result) {
        query["category"] = { $in: [result._id, ...categories] };
      } else {
        return [];
      }
    }
    if (search) {
      search = new RegExp(search, "ig");
      query["$or"] = [{ title: search }, { description: search }];
    }
    console.log(query);
    const posts = await this.#model.find(query, {}, { sort: { _id: -1 } });
    return posts;
  }

  async remove(postId) {
    await this.checkExist(postId);
    await this.#model.deleteOne({ _id: postId });
  }

  async checkExist(postId) {
    if (!postId || !isValidObjectId(postId))
      throw new createHttpError.BadRequest(postMessage.requestNotValid);
    const [post] = await this.#model.aggregate([
      { $match: { _id: new Types.ObjectId(postId) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      { $addFields: { userMobile: "$user.mobile" } },
      {
        $project: {
          user: 0,
        },
      },
    ]);
    if (!post) throw new createHttpError.NotFound(postMessage.notFound);
    return post;
  }
}

module.exports = new postService();
