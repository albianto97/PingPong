function nextPowerOfTwo(n) {
    return Math.pow(2, Math.ceil(Math.log2(n)));
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

module.exports = { nextPowerOfTwo, shuffle };
