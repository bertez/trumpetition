'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const merge = require('merge');
const rimraf = require('gulp-rimraf');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const stylecow = require('gulp-stylecow');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cached');
const browserSync = require('browser-sync').create();
const nodemon = require('gulp-nodemon');
const webpack = require('webpack');
const runSequence = require('run-sequence');


const webpackConfig = require('./webpack.config.js');

// Public folders
const publicFolders = {
    css: './dist/css',
    fonts: './dist/fonts',
    img: './dist/img',
    js: './dist/js',
    media: 'dist/media'
};

/**
 * Media
 */

const mediaToProcess = {
    input: 'app/public/media/**/**',
    output: publicFolders.media
};

gulp.task('media', function() {
    return gulp.src(mediaToProcess.input)
        .pipe(gulp.dest(mediaToProcess.output));
});


/**
 * Fonts
 */
const fontsToProcess = {
    input: ['./app/public/web_modules/font-awesome/fonts/**/**', './app/public/fonts/**.*'],
    output: publicFolders.fonts
};

gulp.task('fonts', function() {
    return gulp.src(fontsToProcess.input)
        .pipe(gulp.dest(fontsToProcess.output));
});


/**
 * CSS
 */
const styleToProcess = {
    input: './app/public/scss/style.scss',
    output: publicFolders.css
};

const styleCowOptions = {
    'support': {
        'explorer': 10,
        'firefox': 30,
        'chrome': 35,
        'safari': 7,
        'opera': 22,
        'android': 4,
        'ios': 6
    },
    'plugins': [
        'fixes',
        'prefixes',
        'rem',
        'flex'
    ]
};


gulp.task('css:dev', function() {
    return gulp.src(styleToProcess.input)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(stylecow(merge({}, styleCowOptions, {
            code: 'normal'
        })))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(styleToProcess.output))
        .pipe(browserSync.stream());
});

gulp.task('css:prod', function() {
    return gulp.src(styleToProcess.input)
        .pipe(sass().on('error', sass.logError))
        .pipe(stylecow(merge({}, styleCowOptions, {
            code: 'minify'
        })))
        .pipe(gulp.dest(styleToProcess.output));
});


/**
 * Images
 */
const imagesToProcess = {
    input: './app/public/img/**/*.{jpg,png,gif,svg,ico}',
    output: publicFolders.img
};

gulp.task('images', function() {
    return gulp.src(imagesToProcess.input)
        .pipe(cache('img'))
        .pipe(imagemin())
        .pipe(gulp.dest(imagesToProcess.output));
});


/**
 * Js
 */
gulp.task('webpack:prod', function(callback) {

    let buildConfig = Object.create(webpackConfig);

    buildConfig.plugins = buildConfig.plugins.concat(
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            },
            'PRODUCTION': true,
            'DEVELOPMENT': false
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            },
            sourceMap: false
        })
    );

    webpack(buildConfig, function(err, stats) {
        if (err) {
            throw new gutil.PluginError('webpack:prod', err);
        }

        gutil.log('[webpack:prod]', stats.toString({
            colors: true
        }));

        return callback();
    });
});

const myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = 'sourcemap';
// myDevConfig.debug = true;

myDevConfig.plugins = myDevConfig.plugins.concat(
    new webpack.DefinePlugin({
        'PRODUCTION': false,
        'DEVELOPMENT': true
    })
);

var devCompiler = webpack(myDevConfig);

gulp.task('webpack:dev', function(callback) {
    devCompiler.run(function(err, stats) {
        if (err) {
            throw new gutil.PluginError('webpack:dev', err);
        }

        gutil.log('[webpack:dev]', stats.toString({
            colors: true
        }));

        return callback();
    });
});

/**
 * Extra watchers
 */
gulp.task('webpack:watch', ['webpack:dev'], function() {
    return browserSync.reload();
});


/**
 * Dev server && Watching
 */
const BROWSER_SYNC_RELOAD_DELAY = 500;

gulp.task('nodemon', function(cb) {
    let called = false;
    return nodemon({
            script: 'server.js',
            ignore: ['./dist/**/*.*', './app/public/**/*.*'],
            env: {
                NODE_ENV: 'development',
                PORT: 8080
            },
            signal: 'SIGINT'
        })
        .on('start', function onStart() {
            if (!called) {
                cb();
            }
            called = true;
        })
        .on('restart', function onRestart() {
            setTimeout(function reload() {
                browserSync.reload({
                    stream: false
                });
            }, BROWSER_SYNC_RELOAD_DELAY);
        });
});

const watchFiles = {
    css: './app/public/scss/**/*.scss',
    templates: './app/views/**/*.hbs',
    js: ['./app/public/js/**/*.*', './webpack.config.js'],
    img: imagesToProcess.input,
    media: 'app/public/media/**/*.*',
    fonts: './app/public/web_modules/font-awesome/fonts/**/**'
};

gulp.task('dev-server', function(callback) {
    browserSync.init({
        proxy: 'http://localhost:8080',
        open: false
    });

    gulp.watch(watchFiles.css, ['css:dev']);
    gulp.watch(watchFiles.img, ['images']);
    gulp.watch(watchFiles.media, ['media']);
    gulp.watch(watchFiles.fonts, ['fonts']);
    gulp.watch(watchFiles.js, ['webpack:watch']);
    gulp.watch(watchFiles.templates).on('change', browserSync.reload);

    return callback();
});

/**
 * Wipe workspace
 */
gulp.task('wipe', function() {
    return gulp.src('dist')
        .pipe(rimraf());
});

/**
 * Development task
 */
gulp.task('dev', function() {
    return runSequence('wipe', ['images', 'media', 'fonts', 'css:dev', 'webpack:dev'], 'nodemon', 'dev-server');
});

/**
 * Default task
 */
gulp.task('default', function() {
    return runSequence('wipe', ['fonts', 'images', 'media', 'css:prod', 'webpack:prod']);
});
