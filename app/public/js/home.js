import 'babel-polyfill';

import $ from 'jquery';

const $lines = $('.panel').find('p');
const $video = $('video');

let current = 0;

function start() {
    const i = setInterval(() => {
        $lines.prop('hidden', true);
        const $l = $lines.eq(current);
        current++;
        if ($l.length) {
            $l.prop('hidden', false);
        } else {
            clearInterval(i);
        }
    }, 7000);
}

$video.on('ended', () => {
    location = '/wall';
});

start();
