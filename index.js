let board;
const game = new Chess();
const whiteSquareGrey = '#a9a9a9';
const blackSquareGrey = '#696969';

function removeGraySquares() {
  $('#board1 .square-55d63').css('background', '');
}

function graySquare(square) {
  const $square = $('#board1 .square-' + square);
  const background = $square.hasClass('black-3c85d')
    ? blackSquareGrey
    : whiteSquareGrey;
  $square.css('background', background);
}

function onDragStart(source, piece, position, orientation) {
  if (game.game_over()) return false;

  if (piece.search(/^b/) !== -1) return false;
}

function makeRandomMove() {
  const possibleMoves = game.moves();

  if (possibleMoves.length === 0) return;

  var randomIdx = Math.floor(Math.random() * possibleMoves.length);
  game.move(possibleMoves[randomIdx]);
  board.position(game.fen());
}

function onDrop(source, target) {
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q',
  });

  if (move === null) return 'snapback';

  setTimeout(makeRandomMove, 500);
}

function onMouseoverSquare(square, piece) {
  console.log('mouse over square');

  const moves = game.moves({
    square,
    verbose: true,
  });

  if (moves.length == 0) return;

  graySquare(square);

  for (var i = 0; i < moves.length; i++) {
    graySquare(moves[i].to);
  }
}

function onMouseoutSquare(square, piece) {
  removeGraySquares();
}

function onSnapEnd() {
  board.position(game.fen());
}

const config = {
  draggable: true,
  position: 'start',
  onDragStart,
  onDrop,
  onMouseoverSquare,
  onMouseoutSquare,
  onSnapEnd,
};

board = ChessBoard('board1', config);

console.log('sheeeeeesh');
console.log('pp');
