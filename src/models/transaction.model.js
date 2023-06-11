module.exports = (sequelize, Sequelize) => {
  return sequelize.define(
    'Transactions',
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
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      mask_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Masks',
          key: 'id'
        }
      },
      transaction_amount: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      transaction_date: {
        type: Sequelize.DATE,
        allowNull: false
      }
    },
    {
      modelName: 'Transactions',
      freezeTableName: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      defaultScope: {
        attributes: { exclude: ['created_at', 'updated_at'] }
      }
    }
  );
};
