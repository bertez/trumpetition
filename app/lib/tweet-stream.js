const Twit = require('twit');

module.exports = (app) => {

    const Twitter = new Twit(app.locals.config.twitter);
    const io = app.locals.config.io;

    const favorable_ht = ['maga', 'makeamericagreatagain', 'donaldtrump', 'americafirst', 'buildthewall'];
    const unfavorable_ht = ['notmypresident'];

    const stream = Twitter.stream('statuses/filter', {
        track: [...favorable_ht, ...unfavorable_ht]
    });

    stream.on('tweet', (msg) => {
        if (new RegExp(favorable_ht.join('|')).test(msg.text)) {
            return io.emit('add', msg);
        }

        if (new RegExp(unfavorable_ht.join('|')).test(msg.text)) {
            return io.emit('delete', msg);
        }
    });

    return stream;
};
