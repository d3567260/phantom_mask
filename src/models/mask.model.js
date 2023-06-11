module.exports = (sequelize, Sequelize) => {
  return sequelize.define(
    'Masks',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      pharmacy_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Pharmacies',
          key: 'id'
        }
      }
    },
    {
      modelName: 'Masks',
      freezeTableName: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      defaultScope: {
        attributes: { exclude: ['created_at', 'updated_at'] }
      }
    }
  );
};
