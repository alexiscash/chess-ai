let board;
const game = new Chess();

function makeRandomMove() {
  const possibleMoves = game.moves();

  if (game.game_over()) return;

  const randomIndex = Math.floor(Math.random() * possibleMoves.length);
  game.move(possibleMoves[randomIndex]);
  board.position(game.fen());

  setTimeout(makeRandomMove, 500);
}

setTimeout(makeRandomMove, 500);

board = ChessBoard('board1', 'start');

console.log('sheeeeeeeeeeesh');
