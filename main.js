const express = require("express");
const dotenv = require("dotenv");
const SwaggerConfig = require("./src/config/swagger.config");
dotenv.config();
async function main() {
  const app = express();
  const port = process.env.PORT;
  require("./src/config/mongoose.config");
  SwaggerConfig(app);
  app.listen(3000, () => {
    console.log(`server: http://localhost:${port}`);
  });
}

main();
