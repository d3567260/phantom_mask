const { DAYS_OF_WEEK } = require('../../utils/constants');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('OpeningHours', {
      id: {
        type: Sequelize.INTEGER,
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
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('OpeningHours');
  }
};
