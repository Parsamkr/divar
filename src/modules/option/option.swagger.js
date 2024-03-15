/**
 * @swagger
 * tags:
 *  name: Option
 *  description: Option Module and Routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          createOption:
 *              type: object
 *              required:
 *                  -   title
 *                  -   key
 *                  -   category
 *                  -   type
 *              properties:
 *                  title:
 *                      type: string
 *                  key:
 *                      type: string
 *                  category:
 *                      type: string
 *                  guide:
 *                      type: string
 *                  required:
 *                      type: boolean
 *                  type:
 *                      type: string
 *                      enum:
 *                          -   number
 *                          -   string
 *                          -   boolean
 *                          -   array
 *                  enum:
 *                      type: array
 *                      items:
 *                          type: string
 *          updateOption:
 *              type: object
 *              properties:
 *                  title:
 *                      type: string
 *                  key:
 *                      type: string
 *                  category:
 *                      type: string
 *                  guide:
 *                      type: string
 *                  required:
 *                      type: boolean
 *                  type:
 *                      type: string
 *                      enum:
 *                          -   number
 *                          -   string
 *                          -   boolean
 *                          -   array
 *                  enum:
 *                      type: array
 *                      items:
 *                          type: string
 * */

/**
 * @swagger
 *
 * /option:
 *  post:
 *      summary: create new option for category
 *      tags:
 *          -   Option
 *      requestBody:
 *          content :
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/createOption"
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/createOption"
 *      responses:
 *          200:
 *              description: success
 *          500:
 *              description: internalServerError
 */

/**
 * @swagger
 *
 * /option/by-category/{categoryId}:
 *  get:
 *      summary: get all options of category
 *      tags:
 *          -   Option
 *      parameters:
 *          -   in: path
 *              name: categoryId
 *              type: string
 *      responses:
 *          200:
 *              description: success
 *          500:
 *              description: internalServerError
 */

/**
 * @swagger
 *
 * /option/by-category-slug/{slug}:
 *  get:
 *      summary: get option by slug
 *      tags:
 *          -   Option
 *      parameters:
 *          -   in: path
 *              name: slug
 *              type: string
 *      responses:
 *          200:
 *              description: success
 *          500:
 *              description: internalServerError
 */

/**
 * @swagger
 *
 * /option/{id}:
 *  get:
 *      summary: get option by id
 *      tags:
 *          -   Option
 *      parameters:
 *          -   in: path
 *              name: id
 *              type: string
 *      responses:
 *          200:
 *              description: success
 *          500:
 *              description: internalServerError
 */

/**
 * @swagger
 *
 * /option:
 *  get:
 *      summary: get all options
 *      tags:
 *          -   Option
 *      responses:
 *          200:
 *              description: success
 *          500:
 *              description: internalServerError
 */

/**
 * @swagger
 *
 * /option/{id}:
 *  delete:
 *      summary: delete option by id
 *      tags:
 *          -   Option
 *      parameters:
 *          -   in: path
 *              name: id
 *              type: string
 *      responses:
 *          200:
 *              description: success
 *          500:
 *              description: internalServerError
 */

/**
 * @swagger
 *
 * /option/{id}:
 *  put:
 *      summary: update option
 *      tags:
 *          -   Option
 *      requestBody:
 *          content :
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/updateOption"
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/updateOption"
 *      responses:
 *          200:
 *              description: success
 *          500:
 *              description: internalServerError
 */
