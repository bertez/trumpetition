const Redis = require('ioredis');
const config = require('./');

const state = {
    db: null
};

const connect = (mode) => {
    const db = new Redis();

    if (config.env === 'production') {
        db.select(config.productionDB);
    }

    state.db = db;
};

const get = () => {
    return state.db;
};

const close = () => {
    return state.db.quit();
};

module.exports = { connect, get, close };
