export function humanPlayTurn(row, col, opponent) {
  const attackStatus = opponent.receiveAttack(row, col);
  return attackStatus;
}

export function computerPlayTurn(opponent) {
  let row, col, attackStatus;

  do {
    row = Math.floor(Math.random() * 10);
    col = Math.floor(Math.random() * 10);
    attackStatus = opponent.receiveAttack(row, col);
  } while (attackStatus === "already-attacked");

  return { row, col, attackStatus };
}
