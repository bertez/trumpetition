'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Load development config stored in dev.env.json
 */

const devConfig = path.join(__dirname, 'dev.env.json');

if (fs.existsSync(devConfig)) {
    const env = JSON.parse(fs.readFileSync(devConfig));
    for (let key of Object.keys(env)) {
        process.env[key] = env[key];
    }
}

module.exports = {
    i18n: {
        locales: process.env.LOCALES && process.env.LOCALES.split(' '),
        defaultLocale: process.env.DEFAULT_LOCALE
    },
    email: process.env.EMAIL,
    info: {
        name: process.env.NAME,
        url: process.env.URL,
        description: process.env.DESCRIPTION,
        image: process.env.IMAGE

    },
    url: process.env.URL,
    env: 'development',
    secret: process.env.SECRET,
    twitter: {
        consumer_key: process.env.TW_KEY,
        consumer_secret: process.env.TW_SECRET,
        access_token: process.env.TW_TOKEN,
        access_token_secret: process.env.TW_TOKEN_SECRET
    },
    productionDB: process.env.PRODUCTION_DB
};