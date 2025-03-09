import { Chess } from "chess.js";
import getWorkerURL from "../../../utils/workerURL";

const boardElement = document.getElementById("board")!;
const messageElement = document.getElementById("message")!;
const resetButton = document.getElementById("reset")!;

const chess = new Chess();
let selectedCell: HTMLElement | null = null;

const worker = new Worker(getWorkerURL("https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.0/stockfish.min.js"));

// Initial board setup
function createBoard() {
   boardElement.innerHTML = "";
   const board = chess.board();
   board.forEach((row, rIdx) => {
      row.forEach((cell, cIdx) => {
         const cellElement = document.createElement("div");
         cellElement.className = `cell ${(rIdx + cIdx) % 2 === 0 ? "white" : "black"}`;
         cellElement.dataset.position = `${"abcdefgh"[cIdx]}${8 - rIdx}`;
         cellElement.textContent = cell ? getPieceSymbol(cell) : "";
         cellElement.addEventListener("click", () => onCellClick(cellElement));
         boardElement.appendChild(cellElement);
      });
   });
   messageElement.textContent = chess.turn() === "w" ? "White's turn" : "Black's turn";
}

// Get Unicode chess symbols
function getPieceSymbol(piece: { color: string; type: string }): string {
   const symbols: { [key: string]: string } = {
      pw: "♙", nw: "♘", bw: "♗", rw: "♖", qw: "♕", kw: "♔",
      pb: "♟", nb: "♞", bb: "♝", rb: "♜", qb: "♛", kb: "♚"
   };
   return symbols[piece.type + piece.color];
}

// Handle cell click events
function onCellClick(cell: HTMLElement) {
   if (selectedCell) {
      const from = selectedCell.dataset.position!;
      const to = cell.dataset.position!;
      const move = from === to ? false : chess.move({ from, to, promotion: "q" });

      if (move) {
         createBoard();
         if (!chess.isGameOver()) makeAIMove();
      } else {
         selectedCell.classList.remove("highlight");
      }
      selectedCell = null;
   } else if (cell.textContent && cell.textContent !== "") {
      selectedCell = cell;
      cell.classList.add("highlight");
   }
}

// Reset the game
resetButton.addEventListener("click", () => {
   chess.reset();
   createBoard();
});

// AI move using Stockfish
function makeAIMove() {
   messageElement.textContent = "AI is thinking...";
   worker.postMessage("position fen " + chess.fen());
   worker.postMessage("go depth 5");
}

worker.onmessage = (e) => {
   const message = e.data;
   console.log(message);
   if (message.startsWith("bestmove")) {
      const move = message.split(" ")[1];
      if (move) {
         chess.move({ from: move.slice(0, 2), to: move.slice(2, 4), promotion: "q" });
         createBoard();
      }
   }
};

// Initialize board
createBoard();