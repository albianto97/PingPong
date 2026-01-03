module.exports = function validateSet(set, rules) {
    const { player1Points, player2Points } = set;
    const { maxPoints } = rules;

    if (
        typeof player1Points !== 'number' ||
        typeof player2Points !== 'number'
    ) return false;

    if (player1Points === player2Points) return false;

    const max = Math.max(player1Points, player2Points);
    const min = Math.min(player1Points, player2Points);

    if (max < maxPoints) return false;
    if (max - min < 2) return false;

    return !(max === maxPoints && min > maxPoints - 2);


};
