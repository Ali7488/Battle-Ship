import gameController from "../modules/gameController.js";
import {
  startGame,
  renderGrid,
  renderPlacementControls,
  switchTurnScreen,
  displayWinner,
  restartGame,
} from "./renderPage.js";

export default function initEventHandlers() {
  //get HTML elements
  const homeScreen = document.getElementById("homeScreen");
  const gameScreen = document.getElementById("gameScreen");
  const passBtn = document.getElementById("passPlayer");
  const restartBtn = document.getElementById("restartGameBtn");

  //Initialize gameController
  let activeController;
  let gameMode;
  let selectedShipLength = null;
  let selectedOrientation = "horizontal";

  //choosing the gamemode
  homeScreen.addEventListener("click", (event) => {
    const clickedBtn = event.target.closest(".homeScreenBtn");
    if (!clickedBtn) return;

    const btnAction = clickedBtn.dataset.action;

    if (btnAction === "computer") {
      activeController = gameController("computer");
      gameMode = "computer";
    } else if (btnAction === "human") {
      activeController = gameController("human");
      gameMode = "human";
    } else return;

    selectedShipLength = null;
    selectedOrientation = "horizontal";

    startGame();

    const gameState = activeController.getGameState();
    renderGrid(gameState);
    renderPlacementControls(gameState, selectedShipLength, selectedOrientation);
  });

  gameScreen.addEventListener("click", (event) => {
    const shipOption = event.target.closest(".ship-option");

    if (shipOption) {
      selectedShipLength = Number(shipOption.dataset.length);

      renderPlacementControls(
        activeController.getGameState(),
        selectedShipLength,
        selectedOrientation,
      );
      return;
    }

    const rotateShipBtn = event.target.closest("#rotateShipBtn");

    if (rotateShipBtn) {
      selectedOrientation =
        selectedOrientation === "horizontal" ? "vertical" : "horizontal";

      renderPlacementControls(
        activeController.getGameState(),
        selectedShipLength,
        selectedOrientation,
      );
      return;
    }

    const clickedBtn = event.target.closest(".game-cell");
    if (!clickedBtn) return;

    const clickedGrid = clickedBtn.closest(".game-board");
    if (!clickedGrid) return;

    const clickedGridOwner = clickedGrid.dataset.player;
    const row = Number(clickedBtn.dataset.row);
    const col = Number(clickedBtn.dataset.col);
    const gameState = activeController.getGameState();

    if (gameState.phase === "placement") {
      if (clickedGridOwner !== gameState.currentPlacementPlayerId) return;

      if (selectedShipLength === null) {
        renderPlacementControls(
          gameState,
          selectedShipLength,
          selectedOrientation,
          "Select a ship before choosing its starting cell.",
        );
        return;
      }

      const previousPlacementPlayer = gameState.currentPlacementPlayerId;

      const placementResult = activeController.placeShip(
        selectedShipLength,
        row,
        col,
        selectedOrientation,
      );

      if (placementResult.placementStatus !== "placed") {
        renderPlacementControls(
          activeController.getGameState(),
          selectedShipLength,
          selectedOrientation,
          "That ship does not fit there or overlaps another ship.",
        );
        return;
      }

      selectedShipLength = null;

      const updatedState = activeController.getGameState();

      if (
        gameMode === "human" &&
        previousPlacementPlayer === "player1" &&
        updatedState.currentPlacementPlayerId === "player2"
      ) {
        switchTurnScreen();
        return;
      }

      renderGrid(updatedState);
      renderPlacementControls(
        updatedState,
        selectedShipLength,
        selectedOrientation,
      );
      return;
    }

    const currentPlayer = gameState.currentPlayerId;

    if (clickedGridOwner === currentPlayer) return;

    const result = activeController.playTurn(row, col);

    const attackStatus = result.attacks[0]?.attackStatus;

    if (attackStatus === "already-attacked") {
      return;
    }

    if (result.winner !== null) {
      displayWinner(result.winner);
      return;
    }

    if (gameMode === "human") {
      switchTurnScreen();
    } else {
      const updatedState = activeController.getGameState();
      renderGrid(updatedState);
    }
  });

  passBtn.addEventListener("click", () => {
    switchTurnScreen();

    const gameState = activeController.getGameState();
    renderGrid(gameState);
    renderPlacementControls(gameState, selectedShipLength, selectedOrientation);
  });

  restartBtn.addEventListener("click", () => {
    restartGame();
  });
}
