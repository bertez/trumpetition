import 'babel-polyfill';

import { random } from 'lodash';
import { divideNumberRandomParts } from 'helpers';
import $ from 'jquery';
import io from 'socket.io-client';

const socket = io();

document.querySelector('video').volume = 0.1;

// Build grid

const $grid = $('.grid');

function buildRows() {
    let row = 10;
    for (; row > 0; row--) {
        $grid.append(divideNumberRandomParts(100, 10).map(n => `<div data-row="${row}" data-empty style="width: ${n}vw"></div>`));
    }
}


buildRows();

for (const initial of $grid.find('div').filter((i, el) => $(el).data('row') < 6)) {
    $(initial).addClass('fill' + random(1, 4)).removeAttr('data-empty');
}

// Update grid
let currentRow = 5;

function getRandomEmptyBrik() {
    const $collection = $grid.find(`[data-row="${currentRow}"][data-empty]`);

    if (!$collection.length) {
        if (currentRow === 10) return false;

        currentRow++;
        return getRandomEmptyBrik();
    }

    return $collection.eq(random(0, $collection.length - 1));
}

function getRandomFilledBrik() {
    const $collection = $grid.find(`[data-row="${currentRow}"]:not([data-empty])`);

    if (!$collection.length) {
        if (currentRow === 1) return false;

        currentRow--;
        return getRandomFilledBrik();
    }

    return $collection.eq(random(0, $collection.length - 1));
}

function addRow(text) {
    const $brick = getRandomEmptyBrik();
    const audio = new Audio('/static/media/fired.mp3');
    audio.play();

    if (!$brick) {
        handleLose();
    } else {
        if ($brick.data('t')) clearTimeout($brick.removeClass().data('t'));
        $brick.removeAttr('data-empty').addClass('fill' + random(1, 4)).attr('data-text', text);
    }

}

function deleteRow() {
    const $brick = getRandomFilledBrik();
    const audio = new Audio('/static/media/brokeit.mp3');
    audio.play();

    if (!$brick) {
        handleWin();
    } else {
        $brick.attr('data-empty', '').addClass('broken' + random(1, 2)).removeAttr('data-text');
        const timeout = setTimeout(() => {
            $brick.removeClass();
        }, 500);

        $brick.data('t', timeout);
    }
}

//Tooltip
const $buffer = $('.buffer');
let bufferTimeout;

function handleLose() {
    console.warn('You fucking lose');
}

function handleWin() {
    console.warn('Winrar!');
}

function showBuffer(m, cl) {
    if (bufferTimeout) clearTimeout(bufferTimeout);
    $buffer.show().text(m).removeClass('positive negative').addClass(cl);

    bufferTimeout = setTimeout(() => $buffer.hide(), 2000);

}

socket.on('add', (msg) => {
    showBuffer(msg.text, 'positive');
    addRow(msg.text);
});

socket.on('delete', (msg) => {
    showBuffer(msg.text, 'negative');
    deleteRow();
});
