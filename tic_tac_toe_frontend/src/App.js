import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * Modern, minimal Tic Tac Toe game UI.
 * - Uses light theme by default, with theme toggle.
 * - Responsive and accessible.
 * - Primary: #1976d2, Secondary: #424242, Accent: #ffeb3b
 * - Two-player turn-based logic (local "X" and "O")
 * - Shows win/draw/in-progress status, and restart button.
 */

// Constants for the game logic
const PLAYER_X = "X";
const PLAYER_O = "O";
const EMPTY = null;

const COLORS = {
  primary: "#1976d2",
  secondary: "#424242",
  accent: "#ffeb3b"
};

// Returns winner ("X"/"O") or null
// PUBLIC_INTERFACE
function checkWinner(squares) {
  /** Returns "X", "O" if either has won, or null if not. */
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // columns
    [0,4,8],[2,4,6]          // diagonals
  ];
  for (let [a,b,c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function isBoardFull(squares) {
  /** Returns true if all squares are filled */
  return squares.every(cell => cell !== EMPTY);
}

// PUBLIC_INTERFACE
function TicTacToeBoard({ squares, onClick, isGameOver }) {
  /** 
   * The visual game board.
   * @param {array} squares - 9-element array, each is "X", "O", or null.
   * @param {function} onClick - Called with cell index when cell is clicked.
   * @param {boolean} isGameOver - disables board interaction if true.
   */
  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
      {squares.map((cell, idx) => (
        <button
          key={idx}
          className="ttt-cell"
          data-testid={`cell-${idx}`}
          onClick={() => {!isGameOver && !cell && onClick(idx);}}
          disabled={Boolean(cell) || isGameOver}
          aria-label={`Cell ${idx + 1}${cell ? `: ${cell}` : ''}`}
        >
          <span className="ttt-marker">{cell}</span>
        </button>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /**
   * React root for the game.
   * - Handles board state, current player, status message, and reset.
   * - Theme toggle retained.
   */
  const [squares, setSquares] = useState(Array(9).fill(EMPTY));
  const [isXNext, setIsXNext] = useState(true);
  const [theme, setTheme] = useState('light');

  // Effect to apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const winner = checkWinner(squares);
  const isDraw = !winner && isBoardFull(squares);
  const isGameOver = !!winner || isDraw;

  // PUBLIC_INTERFACE
  const handleCellClick = (idx) => {
    /** Handle user clicking a cell. */
    if (squares[idx] || isGameOver) return;
    const next = squares.slice();
    next[idx] = isXNext ? PLAYER_X : PLAYER_O;
    setSquares(next);
    setIsXNext(!isXNext);
  };

  // PUBLIC_INTERFACE
  const restartGame = () => {
    setSquares(Array(9).fill(EMPTY));
    setIsXNext(true);
  };

  // UI status message
  let statusText;
  if (winner) statusText = `Player ${winner} wins!`;
  else if (isDraw) statusText = "It's a draw!";
  else statusText = `Player ${isXNext ? PLAYER_X : PLAYER_O}'s turn`;

  return (
    <div className="App">
      <header className="ttt-header">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>
      <main className="ttt-main">
        <TicTacToeBoard
          squares={squares}
          onClick={handleCellClick}
          isGameOver={isGameOver}
        />
        <div className="ttt-status" role="status" aria-live="polite">
          {statusText}
        </div>
        <button
          className="ttt-reset-btn"
          onClick={restartGame}
          aria-label="Restart game"
        >
          Reset
        </button>
      </main>
      <footer className="ttt-footer">
        <span>Minimal React Tic Tac Toe &middot; <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">Learn React</a></span>
      </footer>
    </div>
  );
}

export default App;
