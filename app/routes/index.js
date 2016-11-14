'use strict';

const path = require('path');

module.exports = (app) => {

    /**
     * Controllers
     */
    const controllers = require(path.join(app.locals.config.root, 'app/controllers/'))(app);

    /**
     * Public
     */
    app.get('/', controllers.index);
    app.get('/wall', controllers.wall);


    /**
     * Error Handling
     */
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    if (app.get('env') === 'development') {
        app.use(function(err, req, res) {
            res.status(err.status || 500);
            return res.render('error', {
                layout: 'simple',
                message: err.message,
                error: err.stack
            });
        });
    }

    app.use(function(err, req, res) {
        res.status(err.status || 500);
        return res.render('error', {
            layout: 'simple',
            message: err.message
        });
    });
};
