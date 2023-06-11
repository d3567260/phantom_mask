const { DAYS_OF_WEEK } = require('../utils/constants');

module.exports = (sequelize, Sequelize) => {
  return sequelize.define(
    'OpeningHours',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      pharmacy_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Pharmacies',
          key: 'id'
        }
      },
      day_of_week: {
        type: Sequelize.ENUM(DAYS_OF_WEEK),
        allowNull: false
      },
      opening_time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      closing_time: {
        type: Sequelize.TIME,
        allowNull: false
      }
    },
    {
      modelName: 'OpeningHours',
      freezeTableName: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      defaultScope: {
        attributes: { exclude: ['created_at', 'updated_at'] }
      }
    }
  );
};
