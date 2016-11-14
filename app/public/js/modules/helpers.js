const divideNumberRandomParts = (number = 100, parts = 5) => {
    const random = [];

    for (let i = 0; i < parts; i++) {
        random.push(Math.random());
    }

    const sum = random.reduce((p, c) => p + c, 0);

    return random.map(r => (r / sum) * number);
};


module.exports = {
    divideNumberRandomParts
};