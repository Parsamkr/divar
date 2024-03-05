const express = require("express");
const dotenv = require("dotenv");
const SwaggerConfig = require("./src/config/swagger.config");
const mainRouter = require("./src/app.route");
const notFoundHandler = require("./src/common/exception/not-found.handler");
const allExceptionHandler = require("./src/common/exception/all-exception.handler");
dotenv.config();

async function main() {
  const app = express();
  const port = process.env.PORT;
  require("./src/config/mongoose.config");
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  SwaggerConfig(app);
  app.use(mainRouter);
  notFoundHandler(app);
  allExceptionHandler(app);
  app.listen(3000, () => {
    console.log(`server: http://localhost:${port}`);
  });
}

main();
