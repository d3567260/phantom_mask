const express = require('express');
const validate = require('../../middlewares/validate');
const pharmacyValidation = require('../../validations/pharmacy.validation');
const pharmacyController = require('../../controllers/pharmacy.controller');

const router = express.Router();

router.route('/').get(validate(pharmacyValidation.getPharmacies), pharmacyController.getPharmacies);
router
  .route('/:pharmacyId/masks')
  .get(validate(pharmacyValidation.getPharmacyMasks), pharmacyController.getPharmacyMasks);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Pharmacies
 */

/**
 * @swagger
 * /pharmacies:
 *   get:
 *     summary: Get a list of pharmacies
 *     tags: [Pharmacies]
 *     parameters:
 *       - in: query
 *         name: keywords
 *         schema:
 *           type: string
 *         description: Keywords
 *       - in: query
 *         name: daysOfWeek
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [Mon, Tue, Wed, Thur, Fri, Sat, Sun]
 *           explode: true
 *         description: Days of the week (e.g., ["Mon", "Tue"])
 *       - in: query
 *         name: openingTime
 *         schema:
 *           type: string
 *           pattern: '^\d{2}:\d{2}$'
 *         description: The opening time in the format hh:mm
 *       - in: query
 *         name: closingTime
 *         schema:
 *           type: string
 *           pattern: '^\d{2}:\d{2}$'
 *         description: The closing time in the format hh:mm
 *       - in: query
 *         name: minItemCount
 *         schema:
 *           type: integer
 *         description: The minimum item count
 *       - in: query
 *         name: maxItemCount
 *         schema:
 *           type: integer
 *         description: The maximum item count
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: The minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: The maximum price
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pharmacy'
 */

/**
 * @swagger
 * /pharmacies/{pharmacyId}/masks:
 *   get:
 *     summary: Get masks of a specific pharmacy
 *     tags: [Pharmacies]
 *     parameters:
 *       - in: path
 *         name: pharmacyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the pharmacy
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by field:desc/asc (e.g., name:asc)
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the pharmacy.
 *                 name:
 *                   type: string
 *                   description: The name of the pharmacy.
 *                 cash_balance:
 *                   type: number
 *                   format: float
 *                   description: The cash balance of the pharmacy.
 *                 Masks:
 *                   type: array
 *                   description: The masks sold by the pharmacy.
 *                   items:
 *                     $ref: '#/components/schemas/Mask'
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: Pharmacy not found
 *       500:
 *         description: Internal server error
 */
