const etl = require('etl');
const fs = require('fs');
const path = require('path');
const JSONStream = require('JSONStream');
const { Pharmacies, OpeningHours, Masks, sequelize } = require('../models');
const logger = require('../config/logger');
const { DAYS_OF_WEEK } = require('../utils/constants');

function generateDayRange(startDay, endDay) {
  const startIndex = DAYS_OF_WEEK.indexOf(startDay);
  const endIndex = DAYS_OF_WEEK.indexOf(endDay);
  if (startIndex <= endIndex) {
    return DAYS_OF_WEEK.slice(startIndex, endIndex + 1);
  }
  // Handle cases when the range crosses the weekend.
  return DAYS_OF_WEEK.slice(startIndex).concat(DAYS_OF_WEEK.slice(0, endIndex + 1));
}

async function parseOpeningHours(openingHours, pharmacy) {
  const openingHourData = [];
  const pattern =
    /((?:Mon|Tue|Wed|Thur|Fri|Sat|Sun)(?: - (?:Mon|Tue|Wed|Thur|Fri|Sat|Sun))?(?:, (?:Mon|Tue|Wed|Thur|Fri|Sat|Sun))*) (\d{2}:\d{2}) - (\d{2}:\d{2})/g;
  let match;
  // eslint-disable-next-line no-cond-assign
  while ((match = pattern.exec(openingHours))) {
    const days = match[1];
    const openingTime = match[2];
    const closingTime = match[3];
    if (days.includes('-')) {
      const dayRange = days.split(' - ');
      const dayRangeList = generateDayRange(dayRange[0], dayRange[1]);
      dayRangeList.forEach((day) => {
        openingHourData.push({
          pharmacy_id: pharmacy.id,
          day_of_week: day,
          opening_time: openingTime,
          closing_time: closingTime
        });
      });
    } else if (days.includes(',')) {
      const dayList = days.split(', ');
      dayList.forEach((day) => {
        openingHourData.push({
          pharmacy_id: pharmacy.id,
          day_of_week: day,
          opening_time: openingTime,
          closing_time: closingTime
        });
      });
    }
  }
  return openingHourData;
}

async function parseMasks(masks, pharmacy) {
  return masks.map((mask) => {
    return {
      name: mask.name,
      price: mask.price,
      pharmacy_id: pharmacy.id
    };
  });
}

let hasErrorOccurred = false;
async function processPharmacy(pharmacyData) {
  const t = await sequelize.transaction();
  try {
    const pharmacy = await Pharmacies.create(
      {
        name: pharmacyData.name,
        cash_balance: pharmacyData.cashBalance
      },
      { transaction: t }
    );

    const openingHourData = await parseOpeningHours(pharmacyData.openingHours, pharmacy);
    await OpeningHours.bulkCreate(openingHourData, { transaction: t });

    const maskData = await parseMasks(pharmacyData.masks, pharmacy);
    await Masks.bulkCreate(maskData, { transaction: t });

    await t.commit();
  } catch (error) {
    await t.rollback();
    logger.error('Error saving to DB:', error);
    hasErrorOccurred = true;
  }
}

fs.createReadStream(path.join(__dirname, '../../data/pharmacies.json'))
  .pipe(JSONStream.parse('*'))
  .pipe(etl.map(processPharmacy))
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
