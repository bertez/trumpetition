'use strict';

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
    env: 'production',
    secret: process.env.SECRET,
    twitter: {
        consumer_key: process.env.TW_KEY,
        consumer_secret: process.env.TW_SECRET,
        access_token: process.env.TW_TOKEN,
        access_token_secret: process.env.TW_TOKEN_SECRET
    },
    productionDB: process.env.PRODUCTION_DB
};
