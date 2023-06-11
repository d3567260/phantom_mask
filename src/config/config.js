const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().required().description('server port'),
    SEQUELIZE_DIALECT: Joi.string().required().description('sequelize dialect'),
    SEQUELIZE_HOST: Joi.string().required().description('sequelize host'),
    SEQUELIZE_PORT: Joi.number().required().description('sequelize port'),
    SEQUELIZE_USERNAME: Joi.string().required().description('sequelize username'),
    SEQUELIZE_PASSWORD: Joi.string().required().description('sequelize password'),
    SEQUELIZE_DATABASE_DEVELOPMENT: Joi.string().required().description('sequelize database development'),
    SEQUELIZE_DATABASE_TEST: Joi.string().required().description('sequelize database test'),
    SEQUELIZE_DATABASE_PRODUCTION: Joi.string().required().description('sequelize database production'),
    SEQUELIZE_MAX_POOL: Joi.number().default(5).description('maximum number of connection in pool'),
    SEQUELIZE_MIN_POOL: Joi.number().default(0).description('minimum number of connection in pool'),
    SEQUELIZE_IDLE: Joi.number()
      .default(10000)
      .description('the maximum time, in milliseconds, that a connection can be idle before being released')
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  sequelize: {
    host: envVars.SEQUELIZE_HOST,
    port: envVars.SEQUELIZE_PORT,
    username: envVars.SEQUELIZE_USERNAME,
    password: envVars.SEQUELIZE_PASSWORD,
    databaseDevelopment: envVars.SEQUELIZE_DATABASE_DEVELOPMENT,
    databaseTest: envVars.SEQUELIZE_DATABASE_TEST,
    databaseProduction: envVars.SEQUELIZE_DATABASE_PRODUCTION,
    dialect: envVars.SEQUELIZE_DIALECT,
    pool: {
      max: envVars.SEQUELIZE_MAX_POOL,
      min: envVars.SEQUELIZE_MIN_POOL,
      idle: envVars.SEQUELIZE_IDLE
    }
  }
};
