const autoBind = require("auto-bind");
const optionService = require("./option.service");
const { optionMessage } = require("./option.messages");
const httpCodes = require("http-codes");

class optionController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = optionService;
  }

  async create(req, res, next) {
    try {
      const {
        title,
        key,
        guide,
        enum: list,
        type,
        category,
        required,
      } = req.body;
      await this.#service.create({
        title,
        key,
        guide,
        enum: list,
        type,
        category,
        required,
      });
      return res
        .status(httpCodes.CREATED)
        .json({ meesage: optionMessage.created });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;

      const {
        title,
        key,
        guide,
        enum: list,
        type,
        category,
        required,
      } = req.body;
      await this.#service.update(id, {
        title,
        key,
        guide,
        enum: list,
        type,
        category,
        required,
      });
      return res.json({ meesage: optionMessage.updated });
    } catch (error) {
      next(error);
    }
  }

  async find(req, res, next) {
    try {
      const options = await this.#service.find();
      return res.json(options);
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const { id } = req.params;
      const option = await this.#service.findById(id);
      return res.json(option);
    } catch (error) {
      next(error);
    }
  }

  async removeById(req, res, next) {
    try {
      const { id } = req.params;
      await this.#service.removeById(id);
      return res.json({ message: optionMessage.deleted });
    } catch (error) {
      next(error);
    }
  }

  async findByCatgeoryId(req, res, next) {
    try {
      const { categoryId } = req.params;
      const options = await this.#service.findByCatgeoryId(categoryId);
      return res.json(options);
    } catch (error) {
      next(error);
    }
  }

  async findByCategorySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const options = await this.#service.findByCategorySlug(slug);
      return res.json(options);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new optionController();
