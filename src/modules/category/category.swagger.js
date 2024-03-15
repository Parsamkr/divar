/**
 * @swagger
 * tags:
 *  name: Category
 *  description: Category Module and Routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          createCategory:
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
 *          -   Category
 *      requestBody:
 *          content :
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/createCategory"
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/createCategory"
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
 *          -   Category
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
 *          -   Category
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
