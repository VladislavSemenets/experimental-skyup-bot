const dotenv = require('dotenv');
const config = {};

if (process.env.NODE_ENV !== 'production' &&
    process.env.NODE_ENV !== 'test'
) {
    dotenv.config({ path: '.env' });
} else {
    dotenv.config({ path: '.env.example', silent: true });
}

config.port = process.env.PORT || 3000;
config.secret = process.env.APP_SECRET || 'keyboard cat';
config.accountSid = process.env.TWILIO_ACCOUNT_SID;
config.authToken = process.env.TWILIO_AUTH_TOKEN;
config.sendingNumber = process.env.TWILIO_NUMBER;

const requiredConfig = [config.accountSid, config.authToken, config.sendingNumber];
const isConfigured = requiredConfig.every(configValue => configValue || false);

if (!isConfigured) {
    throw new Error('TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_NUMBER must be set.');
}

module.exports = config;
