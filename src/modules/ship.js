export default function createShip(length) {
  if (!Number.isInteger(length) || !(length > 0) || !(length <= 10)) {
    throw new Error("Length must be a positive integer that is less than 10");
  }
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
