const etl = require('etl');
const fs = require('fs');
const path = require('path');
const JSONStream = require('JSONStream');
const { Users, Transactions, Pharmacies, Masks, sequelize } = require('../models');
const logger = require('../config/logger');

let hasErrorOccurred = false;

const pharmacyCache = new Map();
const maskCache = new Map();

async function getPharmacy(name) {
  if (pharmacyCache.has(name)) {
    return pharmacyCache.get(name);
  }
  const pharmacy = await Pharmacies.findOne({ where: { name } });
  pharmacyCache.set(name, pharmacy);
  return pharmacy;
}

async function getMask(name) {
  if (maskCache.has(name)) {
    return maskCache.get(name);
  }
  const mask = await Masks.findOne({ where: { name } });
  maskCache.set(name, mask);
  return mask;
}

async function parsePurchaseHistories(purchaseHistories, user) {
  const transactionData = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const history of purchaseHistories) {
    // eslint-disable-next-line no-await-in-loop
    const [pharmacy, mask] = await Promise.all([getPharmacy(history.pharmacyName), getMask(history.maskName)]);
    if (!pharmacy) {
      throw new Error(`No pharmacy found with name: ${history.pharmacyName}`);
    }
    if (!mask) {
      throw new Error(`No mask found with name: ${history.maskName}`);
    }
    transactionData.push({
      pharmacy_id: pharmacy.id,
      user_id: user.id,
      mask_id: mask.id,
      transaction_amount: history.transactionAmount,
      transaction_date: history.transactionDate
    });
  }
  return transactionData;
}

async function processUser(userData) {
  const t = await sequelize.transaction();
  try {
    const user = await Users.create(
      {
        name: userData.name,
        cash_balance: userData.cashBalance
      },
      { transaction: t }
    );

    const transactionData = await parsePurchaseHistories(userData.purchaseHistories, user);
    await Transactions.bulkCreate(transactionData, { transaction: t });

    await t.commit();
  } catch (error) {
    await t.rollback();
    logger.error('Error saving to DB:', error);
    hasErrorOccurred = true;
  }
}

fs.createReadStream(path.join(__dirname, '../../data/users.json'))
  .pipe(JSONStream.parse('*'))
  .pipe(etl.map(processUser))
  .promise()
  .then(
    () => {
      if (!hasErrorOccurred) {
        logger.info('Saved to DB successfully');
        process.exit(0);
      } else {
        process.exit(1);
      }
    },
    (err) => {
      logger.error('Error reading file:', err);
      process.exit(1);
    }
  );
