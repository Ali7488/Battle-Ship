import gameController from "../modules/gameController.js";
import { startGame, renderGrid } from "./renderPage.js";

export default function initEventHandlers() {
  //get HTML elements
  const homeScreen = document.getElementById("homeScreen");

  //Initialize gameController
  let activeController;

  //choosing the gamemode
  homeScreen.addEventListener("click", (event) => {
    const clickedBtn = event.target.closest(".homeScreenBtn");
    if (!clickedBtn) return;

    const btnAction = clickedBtn.dataset.action;

    if (btnAction === "computer") {
      activeController = gameController("computer");
    } else if (btnAction === "human") {
      activeController = gameController("human");
    } else return;

    startGame();
    const gameState = activeController.getGameState();
    renderGrid(gameState);
  });
}
