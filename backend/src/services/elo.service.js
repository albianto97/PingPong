exports.calculateElo = (ratingA, ratingB, resultA, k = 32) => {
    const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
    const expectedB = 1 / (1 + Math.pow(10, (ratingA - ratingB) / 400));

    const newRatingA = ratingA + k * (resultA - expectedA);
    const newRatingB = ratingB + k * ((1 - resultA) - expectedB);

    return {
        newRatingA: Math.round(newRatingA),
        newRatingB: Math.round(newRatingB)
    };
};
