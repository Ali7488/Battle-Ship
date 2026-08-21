# Battleship

A browser-based implementation of Battleship built with modular JavaScript. The project separates game rules and state from DOM rendering, supports both local multiplayer and computer opponents, and includes 64 Jest test cases across the domain layer.

[Live Demo](https://ali7488.github.io/Battle-Ship/)

## Features

- Human-versus-computer and human-versus-human game modes
- Manual fleet placement with horizontal and vertical orientations
- Validation for out-of-bounds and overlapping ship placements
- Randomized computer fleet placement
- Hit, miss, sunk, repeated-attack, and win-state handling
- Turn switching that ignores invalid repeated attacks
- Privacy handoff screen between local human players
- Restart flow after a winner is declared
- Responsive browser interface generated from application state

## Built With

- JavaScript modules
- HTML and CSS
- Webpack
- Jest
- Babel
- ESLint
- Prettier

## Design

The project keeps domain logic independent from the DOM so the rules can be tested without rendering a browser interface.

| Module              | Responsibility                                                             |
| ------------------- | -------------------------------------------------------------------------- |
| `ship.js`           | Tracks ship length, hits, and sunk state                                   |
| `gameboard.js`      | Owns the 10×10 board, placement rules, attacks, and fleet status           |
| `players.js`        | Creates human boards and randomized computer fleets                        |
| `turnLogic.js`      | Coordinates human and computer attacks                                     |
| `gameController.js` | Owns placement phases, turns, modes, winner state, and the public game API |
| `renderPage.js`     | Renders grids, placement controls, handoff screens, and winners            |
| `eventHandlers.js`  | Converts user actions into controller calls and re-renders the UI          |

## Testing

The repository contains 64 Jest test cases across five files. They cover:

- Ship validation, hits, and sinking
- Board creation and reset behavior
- Horizontal and vertical placement
- Invalid and overlapping placements
- Attack results and repeated attacks
- Randomized computer fleets
- Human and computer turn logic
- Placement-to-gameplay transitions
- Human-versus-human and human-versus-computer controller flows

```bash
npm test
npm run test:coverage
```

## Getting Started

```bash
git clone https://github.com/Ali7488/Battle-Ship.git
cd Battle-Ship
npm install
npm run dev
```

The development server opens the application on port `8080`.

## Available Scripts

| Command                 | Purpose                                   |
| ----------------------- | ----------------------------------------- |
| `npm run dev`           | Start the Webpack development server      |
| `npm run build`         | Create a production bundle in `dist/`     |
| `npm test`              | Run the Jest test suite                   |
| `npm run test:watch`    | Run Jest in watch mode                    |
| `npm run test:coverage` | Generate Jest coverage output             |
| `npm run lint`          | Run ESLint                                |
| `npm run format`        | Format files with Prettier                |
| `npm run deploy`        | Build and publish `dist/` to GitHub Pages |

## Current Limitations

- The computer opponent selects valid targets randomly; it does not use a hunt-and-target strategy.
- The game does not persist progress after a refresh.
- Multiplayer is local to one device; there is no networked play.

## Acknowledgements

This project was created as part of [The Odin Project](https://www.theodinproject.com/) JavaScript curriculum.
