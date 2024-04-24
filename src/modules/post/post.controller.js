const autoBind = require("auto-bind");
const postService = require("./post.service");
const { postMessage } = require("./post.messages");
const httpCodes = require("http-codes");
const CategoryModel = require("../category/category.model");
const createHttpError = require("http-errors");
const { Types } = require("mongoose");
const { getAddress } = require("../../common/utils/api");
const {
  removePropertyInObject,
  decodeInObject,
} = require("../../common/utils/functions");
require("dotenv").config();

class postController {
  #service;
  success_message;
  constructor() {
    autoBind(this);
    this.#service = postService;
  }

  async createPostPage(req, res, next) {
    try {
      let { slug } = req.query;
      let showBack = false;
      let options;
      let match = { parent: null };
      let category;
      if (slug) {
        slug = slug.trim();
        category = await CategoryModel.findOne({ slug });
        if (!category) throw createHttpError.NotFound(postMessage.notFound);
        options = await this.#service.getCategoryOptions(category._id);
        if (options.length == 0) options = null;
        showBack = true;
        match = { parent: category._id };
      }
      const categories = await CategoryModel.aggregate([{ $match: match }]);

      res.render("./pages/panel/create-post.ejs", {
        categories,
        showBack,
        options,
        category: category?._id.toString(),
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      console.log(req.body, req.files);
      const userId = req.user._id;
      const images = req?.files?.map((image) => image?.path?.slice(7));
      const {
        title_post: title,
        description: content,
        category,
        lat,
        lng,
        amount,
      } = req.body;

      // delete values from body to make an object of options that should be saved
      const options = removePropertyInObject(req.body, [
        "title_post",
        "description",
        "category",
        "lat",
        "lng",
        "images",
        "amount",
      ]);
      // decode options
      decodeInObject(options);
      // get detail of the address from map.ir
      const { address, province, city, district } = await getAddress(lat, lng);

      await this.#service.create({
        title,
        content,
        coordinate: [lat, lng],
        category: new Types.ObjectId(category),
        images,
        options,
        address,
        province,
        city,
        district,
        userId,
        amount,
      });

      this.success_message = postMessage.created;
      return res.redirect("/post/my");

      // return res
      //   .status(httpCodes.CREATED)
      //   .json({ meesage: postMessage.created });
    } catch (error) {
      next(error);
    }
  }

  async findMyPosts(req, res, next) {
    try {
      const userId = req.user._id;
      const posts = await this.#service.findMyPosts(userId);
      res.render("./pages/panel/posts.ejs", {
        posts,
        count: posts.length,
        success_message: this.success_message,
      });
      this.success_message = null;
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      const { id } = req.params;
      await this.#service.remove(id);

      this.success_message = postMessage.deleted;
      return res.redirect("/post/my");

      // res.status(200).json(postMessage.deleted);
    } catch (error) {
      next(error);
    }
  }

  async showPost(req, res, next) {
    try {
      const { id } = req.params;
      const post = await this.#service.checkExist(id);

      res.locals.layout = "./layouts/website/main.ejs";
      res.render("./pages/home/post.ejs", { post });

      // res.status(200).json(postMessage.deleted);
    } catch (error) {
      next(error);
    }
  }

  async postList(req, res, next) {
    try {
      // const query = req.query;
      // const posts = await this.#service.findAll(query);

      // res.locals.layout = "./layouts/website/main.ejs";
      // res.render("./pages/home/index.ejs", { posts });

      const options = req.query; // Assuming options are passed as query parameters
      const cursor = await this.#service.findAll(options);

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // Keep the connection open by sending a comment every 20 seconds
      const keepAliveInterval = setInterval(() => {
        res.write(": keep-alive\n\n");
      }, 20000);

      cursor.on("data", (doc) => {
        res.write(`data: ${JSON.stringify(doc)}\n\n`);
      });

      cursor.on("end", () => {
        clearInterval(keepAliveInterval);
        res.end();
      });

      // Handle client closing connection
      req.on("close", () => {
        clearInterval(keepAliveInterval);
        res.end();
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new postController();
