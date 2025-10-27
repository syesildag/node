import { Chess } from "chess.js";
import getWorkerURL from "../../../utils/workerURL";
import pawnSvg from '../../../svg/chess/pawn';
import knightSvg from '../../../svg/chess/knight';
import bishopSvg from '../../../svg/chess/bishop';
import rookSvg from '../../../svg/chess/rook';
import queenSvg from '../../../svg/chess/queen';
import kingSvg from '../../../svg/chess/king';

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
         cellElement.innerHTML = cell ? getPieceSymbol(cell) : "";
         cellElement.addEventListener("click", () => onCellClick(cellElement));
         boardElement.appendChild(cellElement);
      });
   });
   messageElement.textContent = chess.turn() === "w" ? "White's turn" : "Black's turn";
}

// Get chess piece symbols with real SVG chess piece icons
function getPieceSymbol(piece: { color: string; type: string }): string {
   const fillColor = piece.color === 'w' ? '#ffffff' : '#000000';
   const strokeColor = piece.color === 'w' ? '#000000' : '#ffffff';
   const fillBlack = piece.color === 'w' ? '#000000' : '#ffffff';

   const svgTemplates: { [key: string]: string } = {
      p: pawnSvg(fillColor, strokeColor, fillBlack),
      n: knightSvg(fillColor, strokeColor, fillBlack),
      b: bishopSvg(fillColor, strokeColor, fillBlack),
      r: rookSvg(fillColor, strokeColor, fillBlack),
      q: queenSvg(fillColor, strokeColor, fillBlack),
      k: kingSvg(fillColor, strokeColor, fillBlack),
   };

   return svgTemplates[piece.type] || '';
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
   } else if (cell.innerHTML && cell.innerHTML.trim() !== "") {
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
   worker.postMessage("go depth 6");
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