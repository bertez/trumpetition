'use strict';

/**
 * ENV variables:
 *
 *  - HOST
 *  - PORT
 *
 *  - NODE_ENV
 *  - SECRET
 *  - LOCALES (ex. "es gl")
 *  - DEFAULT_LOCALE
 *  - NAME
 *  - EMAIL
 *  - URL
 *  - DESCRIPTION
 *  - IMAGE
 *  - TW_KEY
 *  - TW_SECRET
 *  - TW_TOKEN
 *  - TW_TOKEN_SECRET
 *  - PRODUCTION_DB
 *
 */

/**

 */

const express = require('express');

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 8080;


/**
 * Server module
 */

module.exports.startServer = function() {
    const app = express();

    app.locals.config = require('./config');

    // const db = require('./config/db');
    // db.connect(app.locals.config.env);
    // app.locals.config.db = db;

    /**
     * Bottstrap App
     */

    require('./config/express')(app);
    require('./app/routes')(app);

    /**
     * Start streaming
     */


    /**
     * Server
     */
    let stream;

    const serve = () => {
        const server = app.listen(port /*, host*/ );
        const io = require('socket.io')(server);

        app.locals.config.io = io;

        stream = require('./app/lib/tweet-stream')(app);

        console.warn(`App listening on ${host}:${port}`);
    };

    /**
     * Cleanup
     */

    const handleExit = () => {
        console.warn('Cleaning up');
        stream.stop();
        process.kill(process.pid, 'SIGINT');
        // db.close().then(() => process.kill(process.pid, 'SIGINT'));
    };

    process.once('SIGINT', handleExit);

    serve();
};


if (require.main === module) {
    module.exports.startServer();
}
