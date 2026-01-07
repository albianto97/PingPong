export function validateSet(
  player1Points: number | null,
  player2Points: number | null,
  maxPoints: number
): boolean {
  if (player1Points == null || player2Points == null) return false;
  if (player1Points < 0 || player2Points < 0) return false;
  if (player1Points === player2Points) return false;

  const max = Math.max(player1Points, player2Points);
  const min = Math.min(player1Points, player2Points);

  // Caso standard: 11–x o 21–x
  if (max === maxPoints && min <= maxPoints - 2) {
    return true;
  }

  // Caso vantaggi: 12–10, 22–20, ecc.
  if (max > maxPoints && max - min === 2) {
    return true;
  }

  return false;
}

