export default function createShip(length) {
  let ship = { length, hit: 0, sunk: false };

  const getShip = () => {
    return ship;
  };

  const hit = () => {
    ship.hit++;
  };

  const isSunk = () => {
    if (ship.length === ship.hit) {
      return true;
    }

    return false;
  };

  return { getShip, hit, isSunk };
}
