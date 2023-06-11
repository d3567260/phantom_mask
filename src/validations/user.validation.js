const Joi = require('joi');

const getTopBuyers = {
  query: Joi.object().keys({
    startDate: Joi.date(),
    endDate: Joi.date(),
    limit: Joi.number().integer()
  })
};

module.exports = {
  getTopBuyers
};
