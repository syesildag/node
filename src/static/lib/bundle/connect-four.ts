const rows = 6;
const cols = 7;
let board: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
let currentPlayer = 1;
const boardElement = document.getElementById('board')!;
const messageElement = document.getElementById('message')!;
const resetButton = document.getElementById('reset')!;

function createBoard() {
   boardElement.innerHTML = '';
   for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
         const cell = document.createElement('div');
         cell.classList.add('cell');
         cell.dataset.column = c.toString();
         cell.addEventListener('click', () => handleClick(c));
         boardElement.appendChild(cell);
      }
   }
}

function handleClick(column: number) {
   const row = findEmptyRow(column);
   if (row === -1) return;

   board[row][column] = currentPlayer;
   animatePiece(column, row, currentPlayer === 1 ? 'red' : 'yellow');

   if (checkWin(row, column)) {
      messageElement.textContent = `Player ${currentPlayer} wins!`;
      boardElement.style.pointerEvents = 'none';
   } else if (board.flat().every(cell => cell !== 0)) {
      messageElement.textContent = 'Draw!';
   } else {
      currentPlayer = 3 - currentPlayer;
      messageElement.textContent = `Player ${currentPlayer}'s turn`;
   }
}

function findEmptyRow(column: number): number {
   for (let r = rows - 1; r >= 0; r--) {
      if (board[r][column] === 0) {
         return r;
      }
   }
   return -1;
}

function animatePiece(column: number, row: number, color: string) {
   const cell = boardElement.children[row * cols + column] as HTMLElement;
   const piece = document.createElement('div');
   piece.classList.add('piece', color);
   piece.style.top = '-85px';
   cell.appendChild(piece);

   setTimeout(() => {
      piece.style.top = '0px';
   }, 10);
}

function checkWin(row: number, column: number): boolean {
   const directions = [
      [[0, 1], [0, -1]],   // Horizontal
      [[1, 0], [-1, 0]],   // Vertical
      [[1, 1], [-1, -1]],  // Diagonal \
      [[1, -1], [-1, 1]]   // Diagonal /
   ];

   for (const direction of directions) {
      let count = 1;

      for (const [dr, dc] of direction) {
         let r = row + dr;
         let c = column + dc;
         while (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === currentPlayer) {
            count++;
            r += dr;
            c += dc;
         }
      }

      if (count >= 4) return true;
   }
   return false;
}

function resetGame() {
   board = Array.from({ length: rows }, () => Array(cols).fill(0));
   currentPlayer = 1;
   messageElement.textContent = `Player ${currentPlayer}'s turn`;
   boardElement.style.pointerEvents = 'auto';
   createBoard();
}

resetButton.addEventListener('click', resetGame);
createBoard();