const { Op } = require('sequelize');
const { Users, Transactions, Sequelize } = require('../models');

const getTopBuyers = async (options) => {
  const { startDate, endDate, limit } = options;

  let dateFilter = {};

  if (startDate !== undefined && endDate !== undefined) {
    dateFilter = {
      transaction_date: {
        [Op.between]: [startDate, endDate]
      }
    };
  } else if (startDate !== undefined && endDate === undefined) {
    dateFilter = {
      transaction_date: {
        [Op.gte]: startDate
      }
    };
  } else if (startDate === undefined && endDate !== undefined) {
    dateFilter = {
      transaction_date: {
        [Op.lte]: endDate
      }
    };
  }

  return Transactions.findAll({
    attributes: [[Sequelize.literal(`SUM("Transactions"."transaction_amount")`), 'total_transaction_amount']],
    include: [
      {
        model: Users,
        as: 'User'
      }
    ],
    where: dateFilter,
    group: ['User.id'],
    order: [[Sequelize.literal('total_transaction_amount'), 'DESC']],
    limit
  });
};

module.exports = {
  getTopBuyers
};
