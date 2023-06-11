module.exports = (sequelize, Sequelize) => {
  return sequelize.define(
    'Users',
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
      cash_balance: {
        type: Sequelize.DECIMAL,
        allowNull: false
      }
    },
    {
      modelName: 'Users',
      freezeTableName: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      defaultScope: {
        attributes: { exclude: ['created_at', 'updated_at'] }
      }
    }
  );
};
