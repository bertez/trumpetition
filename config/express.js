'use strict';

const path = require('path');

const pkg = require('../package.json');

const express = require('express');
const exphbs = require('express-handlebars');
const logger = require('morgan');

const i18n = require('i18n');


const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const session = require('express-session');


module.exports = function(app) {

    const env = app.locals.config.env;

    /**
     * Logger
     */

    if (env === 'development') {
        app.use(logger('dev'));
    }

    /**
     * Body parser
     */

    app.use(bodyParser.json());

    app.use(bodyParser.urlencoded({
        extended: true
    }));


    /**
     * Static
     */

    if (env === 'development') {
        app.use('/static', express.static(path.join(app.locals.config.root, 'dist')));
    }

    /**
     * Cookie
     */

    app.use(cookieParser());
    app.use(cookieSession({
        secret: app.locals.config.secret
    }));


    /**
     * Session
     */

    if (env === 'development') {
        app.use(session({
            secret: app.locals.config.secret,
            resave: true,
            saveUninitialized: true
        }));
    } else if (env === 'production') {
        const RedisStore = require('connect-redis')(session);
        app.use(session({
            store: new RedisStore({
                host: 'localhost',
                port: 6379
            }),
            secret: app.locals.config.secret,
            resave: true,
            saveUninitialized: true
        }));
    }

    /**
     * Init i18n
     */

    i18n.configure(app.locals.config.i18n);
    app.use(i18n.init);


    /**
     * views
     */

    app.set('views', path.join(app.locals.config.root, 'app/views'));

    const hbs = exphbs.create({
        extname: '.hbs',
        defaultLayout: 'main',
        layoutsDir: path.join(app.get('views'), 'layouts'),
        partialsDir: path.join(app.get('views'), 'partials'),
        helpers: {}
    });


    app.engine('.hbs', hbs.engine);
    app.set('view engine', '.hbs');

    /**
     * HTML minify
     */

    if(env === 'production') {
        const minifyHTML = require('express-minify-html');

        app.use(minifyHTML({
            override:      true,
            htmlMinifier: {
                removeComments:            true,
                collapseWhitespace:        true,
                collapseBooleanAttributes: true,
                removeAttributeQuotes:     true,
                removeEmptyAttributes:     true,
                minifyJS:                  true
            }
        }));
    }

    /**
     * Some default locals
     */

    app.use(function(req, res, next) {
        res.locals.site = app.locals.config.info;
        res.locals.pkg = pkg;

        hbs.handlebars.registerHelper('__', function() {
            return i18n.__.apply(req, arguments);
        });

        return next();
    });

};
