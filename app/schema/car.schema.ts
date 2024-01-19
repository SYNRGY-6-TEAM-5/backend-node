/**
 * @openapi
 * components:
 *   schema:
 *     Car:
 *       type: object
 *       required:
 *         - plate
 *         - manufacture
 *         - image
 *         - model
 *         - type
 *         - description
 *         - transmission
 *         - capacity
 *         - rentPerDay
 *         - availableAt
 *         - available
 *         - year
 *         - options
 *         - specs
 *       properties:
 *         car_id:
 *           type: integer
 *           description: The ID of the car.
 *         plate:
 *           type: string
 *           minLength: 1
 *           maxLength: 10
 *           description: The plate of the car.
 *         manufacture:
 *           type: string
 *           minLength: 1
 *           maxLength: 20
 *           description: The manufacture of the car.
 *         image:
 *           type: string
 *           description: The image of the car.
 *         model:
 *           type: string
 *           minLength: 1
 *           maxLength: 20
 *           description: The model of the car.
 *         type:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           description: The type of the car.
 *         description:
 *           type: string
 *           description: Description of the car.
 *         transmission:
 *           type: string
 *           minLength: 1
 *           maxLength: 20
 *           description: The transmission of the car.
 *         capacity:
 *           type: number
 *           description: The capacity of the car.
 *         rentPerDay:
 *           type: string
 *           description: The rent per day of the car.
 *         availableAt:
 *           type: string
 *           description: Date when the car is available.
 *         available:
 *           type: boolean
 *           description: Availability status of the car.
 *         year:
 *           type: number
 *           maxLength: 4
 *           description: The year of the car.
 *         options:
 *           type: object
 *           description: Additional options of the car.
 *         specs:
 *           type: object
 *           description: Specifications of the car.
 *     CarResponse:
 *        type: object
 *        properties:
 *          car_id:
 *            type: integer
 *            description: The ID of the car.
 *          plate:
 *            type: string
 *            minLength: 1
 *            maxLength: 10
 *            description: The plate of the car.
 *          manufacture:
 *            type: string
 *            minLength: 1
 *            maxLength: 20
 *            description: The manufacture of the car.
 *          image:
 *            type: string
 *            description: The image of the car.
 *          model:
 *            type: string
 *            minLength: 1
 *            maxLength: 20
 *            description: The model of the car.
 *          type:
 *            type: string
 *            minLength: 1
 *            maxLength: 100
 *            description: The type of the car.
 *          description:
 *            type: string
 *            description: Description of the car.
 *          transmission:
 *            type: string
 *            minLength: 1
 *            maxLength: 20
 *            description: The transmission of the car.
 *          capacity:
 *            type: number
 *            description: The capacity of the car.
 *          rentPerDay:
 *            type: string
 *            description: The rent per day of the car.
 *          availableAt:
 *            type: string
 *            description: Date when the car is available.
 *          available:
 *            type: boolean
 *            description: Availability status of the car.
 *          year:
 *            type: number
 *            maxLength: 4
 *            description: The year of the car.
 *          options:
 *            type: object
 *            description: Additional options of the car.
 *          specs:
 *            type: object
 *            description: Specifications of the car.
 *          created_by:
 *            type: integer
 *            description: ID of the user who created the car entry.
 *          updated_by:
 *            type: integer
 *            description: ID of the user who last updated the car entry.
 *     CarUpload:
 *       type: object
 *       required:
 *         - image
 *       properties:
 *         image:
 *           type: string
 *           format: binary
 *           description: The image of the car.
 *     CarUploadResponse:
 *        type: object
 *        properties:
 *          image:
 *            type: string
 *            description: The image of the car.
 *
 */
