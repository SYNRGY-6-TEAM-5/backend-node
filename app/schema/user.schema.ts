/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - first_name
 *        - last_name
 *        - email
 *        - password
 *      properties:
 *        first_name:
 *          type: string
 *          default: Jane
 *        last_name:
 *          type: string
 *          default: Doe
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        password:
 *          type: string
 *          default: stringPassword123
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        user_id:
 *          type: string
 *        first_name:
 *          type: string
 *        last_name:
 *          type: string
 *        email:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 *    LoginUserInput:
 *         type: object
 *         required:
 *           - email
 *           - password
 *         properties:
 *           email:
 *             type: string
 *             default: test224@email.com
 *           password:
 *             type: string
 *             default: testpassword
 *    LoginUserResponse:
 *         type: object
 *         properties:
 *           user_id:
 *             type: string
 *           email:
 *             type: string
 */
