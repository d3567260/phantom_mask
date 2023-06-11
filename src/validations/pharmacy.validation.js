const Joi = require('joi');
const { DAYS_OF_WEEK } = require('../utils/constants');

const getPharmacies = {
  query: Joi.object().keys({
    daysOfWeek: Joi.array().items(Joi.string().valid(...DAYS_OF_WEEK)),
    openingTime: Joi.string()
      .max(5)
      .regex(/^\d{2}:\d{2}$/)
      .description('hh:mm'),
    closingTime: Joi.string()
      .max(5)
      .regex(/^\d{2}:\d{2}$/)
      .description('hh:mm'),
    minItemCount: Joi.number().integer(),
    maxItemCount: Joi.number().integer(),
    minPrice: Joi.number(),
    maxPrice: Joi.number(),
    keywords: Joi.string()
  })
};

const getPharmacyMasks = {
  params: Joi.object().keys({
    pharmacyId: Joi.number().integer()
  }),
  query: Joi.object().keys({
    sortBy: Joi.string()
      .pattern(/^[name|price]+:(asc|desc)$/)
      .description('e.g., name:asc')
  })
};

module.exports = {
  getPharmacies,
  getPharmacyMasks
};
