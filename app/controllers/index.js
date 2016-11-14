'use strict';


// const wrap = require('co-express');

/**
 * Home
 */


module.exports = (app) => {

    return {
        index: (req, res) => {
            return res.render('home', {
                layout: 'main',
                app: 'home',
                meta: {
                    title: 'Intro'
                }
            });
        },
        wall: (req, res) => {
            return res.render('wall', {
                layout: 'main',
                app: 'wall',
                meta: {
                    title: 'The wall'
                }
            });
        }
    };


};
