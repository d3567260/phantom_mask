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
