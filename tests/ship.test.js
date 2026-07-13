import createShip from "../src/modules/ship.js";

test("Creates a ship object with length, number of times it has been hit, and whether it has been sunk", () => {
  const ship = createShip(3);
  const result = ship.getShip();
  expect(result).toEqual({ length: 3, hit: 0, sunk: false });

  expect(() => createShip(-3)).toThrow(
    "Length must be a positive integer that is less than 10",
  );
});

test("tests the hit function", () => {
  const ship = createShip(3);
  ship.hit();
  const result = ship.getShip();
  expect(result).toEqual({ length: 3, hit: 1, sunk: false });
});

test("checks whether the ship is sunk", () => {
  const ship = createShip(1);
  ship.hit();
  const result = ship.isSunk();
  expect(result).toBe(true);
});
