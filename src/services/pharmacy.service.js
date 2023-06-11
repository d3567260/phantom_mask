const { Op } = require('sequelize');
const httpStatus = require('http-status');
const { Pharmacies, Masks, OpeningHours, sequelize } = require('../models');
const ApiError = require('../utils/ApiError');

const searchPharmaciesAndMasks = async (keyword) => {
  const results = await Pharmacies.findAll({
    include: [
      {
        model: OpeningHours
      },
      {
        model: Masks
      }
    ],
    where: {
      [Op.or]: [
        sequelize.literal(`to_tsvector('simple', "Pharmacies"."name") @@ to_tsquery('simple', :keyword)`),
        sequelize.literal(`to_tsvector('simple', "Masks"."name") @@ to_tsquery('simple', :keyword)`)
      ]
    },
    order: sequelize.literal(`ts_rank(to_tsvector('simple', "Pharmacies"."name"), to_tsquery('simple', :keyword)) +
      ts_rank(to_tsvector('simple', "Masks"."name"), to_tsquery('simple', :keyword)) DESC`),
    replacements: { keyword }
  });

  return results;
};

const getPharmaciesByItemCountAndPriceRange = async (minItemCount, maxItemCount, minPrice, maxPrice) => {
  const subquery = await Pharmacies.findAll({
    attributes: ['id'],
    include: [
      {
        model: Masks,
        attributes: [],
        where: {
          price: {
            [Op.between]: [
              minPrice !== undefined ? minPrice : Number.MIN_SAFE_INTEGER,
              maxPrice !== undefined ? maxPrice : Number.MAX_SAFE_INTEGER
            ]
          }
        }
      }
    ],
    group: ['Pharmacies.id'],
    having: {
      [Op.and]: [
        minItemCount !== undefined ? sequelize.literal(`COUNT("Masks"."id") >= ${minItemCount}`) : {},
        maxItemCount !== undefined ? sequelize.literal(`COUNT("Masks"."id") <= ${maxItemCount}`) : {}
      ]
    }
  });

  const results = await Pharmacies.findAll({
    include: [
      {
        model: OpeningHours
      },
      {
        model: Masks,
        where: {
          price: {
            [Op.between]: [
              minPrice !== undefined ? minPrice : Number.MIN_SAFE_INTEGER,
              maxPrice !== undefined ? maxPrice : Number.MAX_SAFE_INTEGER
            ]
          }
        }
      }
    ],
    where: {
      id: {
        [Op.in]: subquery.map((item) => item.id)
      }
    }
  });

  return results;
};

const getPharmacies = async (options) => {
  const { daysOfWeek, openingTime, closingTime, minItemCount, maxItemCount, minPrice, maxPrice, keywords } = options;

  if (keywords) {
    return searchPharmaciesAndMasks(keywords);
  }

  if (daysOfWeek !== undefined || openingTime !== undefined || closingTime !== undefined) {
    const results = await Pharmacies.findAll({
      include: [
        {
          model: OpeningHours,
          where: {
            day_of_week: daysOfWeek,
            [Op.or]: [
              {
                opening_time: { [Op.lte]: openingTime },
                closing_time: { [Op.gte]: openingTime }
              },
              {
                opening_time: { [Op.lte]: closingTime },
                closing_time: { [Op.gte]: closingTime }
              },
              {
                opening_time: { [Op.gt]: sequelize.col('closing_time') },
                [Op.or]: [
                  {
                    opening_time: { [Op.lte]: openingTime },
                    closing_time: { [Op.lte]: openingTime }
                  },
                  {
                    opening_time: { [Op.gte]: closingTime },
                    closing_time: { [Op.gte]: closingTime }
                  }
                ]
              }
            ]
          }
        },
        {
          model: Masks
        }
      ]
    });

    return results;
  }

  if (minItemCount !== undefined || maxItemCount !== undefined || minPrice !== undefined || maxPrice !== undefined) {
    return getPharmaciesByItemCountAndPriceRange(minItemCount, maxItemCount, minPrice, maxPrice);
  }

  return [];
};

const parseSortQuery = (model, sortQuery) => {
  if (!sortQuery) {
    return [];
  }

  const sortFields = sortQuery.split(',');
  const sortCriteria = [];

  sortFields.forEach((field) => {
    const [sortField, sortOrder] = field.split(':');
    const order = sortOrder === 'desc' ? 'DESC' : 'ASC';
    sortCriteria.push([model, sortField, order]);
  });

  return sortCriteria;
};

const getPharmacyMasks = async (pharmacyId, options) => {
  const { sortBy } = options;
  const pharmacy = await Pharmacies.findByPk(pharmacyId, {
    include: [
      {
        model: Masks
      }
    ],
    order: parseSortQuery(Masks, sortBy)
  });

  if (pharmacy === null) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pharmacy not found');
  }

  return pharmacy;
};

module.exports = {
  getPharmacies,
  getPharmacyMasks
};
