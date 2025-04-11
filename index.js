import {
  pawnEvalWhite,
  pawnEvalBlack,
  knightEval,
  bishopEvalWhite,
  bishopEvalBlack,
  rookEvalWhite,
  rookEvalBlack,
  evalQueen,
  kingEvalBlack,
  kingEvalWhite,
} from './pieceValues.js';

let board;
const game = new Chess();
const whiteSquareGrey = '#a9a9a9';
const blackSquareGrey = '#696969';

function minimaxRoot(depth, game, isMaximisingPlayer) {
  const newGameMoves = game.ugly_moves();
  let bestMove = -9999;
  let bestMoveFound;

  newGameMoves.forEach((newMove) => {
    game.ugly_move(newMove);

    const value = minimax(depth - 1, game, -10000, 10000, !isMaximisingPlayer);
    game.undo();
    if (value >= bestMove) {
      bestMove = value;
      bestMoveFound = newMove;
    }
  });

  return bestMoveFound;
}

function minimax(depth, game, alpha, beta, isMaximisingPlayer) {
  if (depth === 0) {
    return -evaluateBoard(game.board());
  }

  let newGameMoves = game.ugly_moves();

  if (isMaximisingPlayer) {
    const bestMove = -9999;
    for (let i = 0; i < newGameMoves.length; i++) {
      game.ugly_move(newGameMoves[i]);
      bestMove = Math.max(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
      game.undo();
      alpha = Math.max(alpha, bestMove);
      if (beta <= alpha) {
        return bestMove;
      }
    }
    return bestMove;
  } else {
    const bestMove = 9999;
    for (let i = 0; i < newGameMoves.length; i++) {
      game.ugly_move(newGameMoves[i]);
      bestMove = Math.min(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
      game.undo();
      beta = Math.min(beta, bestMove);
      if (beta <= alpha) {
        return bestMove;
      }
    }
    return bestMove;
  }
}

function evaluateBoard(board) {
  let totalEvaluation = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i, j);
    }
  }
  return totalEvaluation;
}

function getPieceValue(piece, x, y) {
  if (piece === null) {
    return 0;
  }
  function getAbsoluteValue(piece, isWhite, x, y) {
    if (piece.type === 'p') {
      return 10 + (isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x]);
    } else if (piece.type === 'r') {
      return 50 + (isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x]);
    } else if (piece.type === 'n') {
      return 30 + knightEval[y][x];
    } else if (piece.type === 'b') {
      return 30 + (isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x]);
    } else if (piece.type === 'q') {
      return 90 + evalQueen[y][x];
    } else if (piece.type === 'k') {
      return 900 + (isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x]);
    }
    throw 'Unknown piece type: ' + piece.type;
  }

  const absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x, y);
  return piece.color === 'w' ? absoluteValue : -absoluteValue;
}

function removeGraySquares() {
  $('#board1 .square-55d63').css('background', '');
}

function graySquare(square) {
  const $square = $('#board1 .square-' + square);
  const background = $square.hasClass('black-3c85d') ? blackSquareGrey : whiteSquareGrey;
  $square.css('background', background);
}

function onDragStart(source, piece, position, orientation) {
  if (game.game_over()) return false;

  if (piece.search(/^b/) !== -1) return false;
}

// function makeRandomMove() {
//   const possibleMoves = game.moves();

//   if (possibleMoves.length === 0) return;

//   const randomIdx = Math.floor(Math.random() * possibleMoves.length);
//   game.move(possibleMoves[randomIdx]);
//   board.position(game.fen());
// }

function makeBestMove() {
  const bestMove = minimaxRoot(3, game, true);
  game.ugly_move(bestMove);
  board.position(game.fen());
}

function onDrop(source, target) {
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q',
  });

  if (move === null) return 'snapback';

  setTimeout(makeBestMove, 250);
}

function onMouseoverSquare(square, piece) {
  const moves = game.moves({
    square,
    verbose: true,
  });

  if (moves.length == 0) return;

  graySquare(square);

  for (let i = 0; i < moves.length; i++) {
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

$('.undo').on('click', () => {
  game.undo();
  game.undo();
  board.position(game.fen());
});
