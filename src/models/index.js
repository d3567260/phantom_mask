const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config/config');
const sequelizeConfig = require('./config/config')[config.env];

const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize({ ...sequelizeConfig, logging: false });

// eslint-disable-next-line security/detect-non-literal-fs-filename
fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-9) === '.model.js';
  })
  .forEach((file) => {
    // eslint-disable-next-line global-require,import/no-dynamic-require,security/detect-non-literal-require
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Pharmacies.hasMany(db.OpeningHours, {
  foreignKey: 'pharmacy_id'
});
db.OpeningHours.belongsTo(db.Pharmacies, {
  foreignKey: 'pharmacy_id'
});
db.Pharmacies.hasMany(db.Masks, {
  foreignKey: 'pharmacy_id'
});
db.Masks.belongsTo(db.Pharmacies, {
  foreignKey: 'pharmacy_id'
});
db.Users.hasMany(db.Transactions, {
  foreignKey: 'user_id'
});
db.Transactions.belongsTo(db.Users, {
  as: 'User',
  foreignKey: 'user_id'
});
db.Pharmacies.hasMany(db.Transactions, {
  foreignKey: 'pharmacy_id'
});
db.Transactions.belongsTo(db.Pharmacies, {
  foreignKey: 'pharmacy_id'
});
db.Masks.hasMany(db.Transactions, {
  foreignKey: 'mask_id'
});
db.Transactions.belongsTo(db.Masks, {
  foreignKey: 'mask_id'
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
