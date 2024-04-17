/**
 * @swagger
 * tags:
 *  name: Post
 *  description: Post Module and Routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          createPost:
 *              type: object
 *              required:
 *                  -   name
 *                  -   slug
 *                  -   icon
 *              properties:
 *                  name:
 *                      type: string
 *                  slug:
 *                      type: string
 *                  icon:
 *                      type: string
 *                  parent:
 *                      type: string
 * */

/**
 * @swagger
 *
 * /category:
 *  post:
 *      summary: create new category
 *      tags:
 *          -   Post
 *      requestBody:
 *          content :
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/createPost"
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/createPost"
 *      responses:
 *          200:
 *              description: success
 *          500:
 *              description: internalServerError
 */

/**
 * @swagger
 *
 * /category:
 *  get:
 *      summary: get all categories
 *      tags:
 *          -   Post
 *      responses:
 *          200:
 *              description: success
 *          500:
 *              description: internalServerError
 */

/**
 * @swagger
 *
 * /category/{id}:
 *  delete:
 *      summary: delete category by id
 *      tags:
 *          -   Post
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
