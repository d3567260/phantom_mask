const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const pharmacyService = require('../services/pharmacy.service');

const getPharmacies = catchAsync(async (req, res) => {
  const options = pick(req.query, [
    'daysOfWeek',
    'openingTime',
    'closingTime',
    'minItemCount',
    'maxItemCount',
    'minPrice',
    'maxPrice',
    'keywords'
  ]);
  const result = await pharmacyService.getPharmacies(options);
  res.send(result);
});

const getPharmacyMasks = catchAsync(async (req, res) => {
  const { pharmacyId } = pick(req.params, ['pharmacyId']);
  const options = pick(req.query, ['sortBy']);
  const result = await pharmacyService.getPharmacyMasks(pharmacyId, options);
  res.send(result);
});

module.exports = {
  getPharmacies,
  getPharmacyMasks
};
