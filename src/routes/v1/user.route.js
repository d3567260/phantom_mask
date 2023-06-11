const express = require('express');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router.route('/top-buyers').get(validate(userValidation.getTopBuyers), userController.getTopBuyers);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Users
 */

/**
 * @swagger
 * /users/top-buyers:
 *   get:
 *     summary: Get top buyers
 *     description: Retrieve a list of the users who bought the most masks.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: The start date of the period
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: The end date of the period
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Maximum number of users
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TopBuyer'
 */
