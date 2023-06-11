const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user.service');

const getTopBuyers = catchAsync(async (req, res) => {
  const options = pick(req.query, ['startDate', 'endDate', 'limit']);
  const result = await userService.getTopBuyers(options);
  res.send(result);
});

module.exports = {
  getTopBuyers
};
