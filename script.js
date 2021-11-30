// First Gamestart
function gameStart() {
	window.game = new Game(4);
	window.game.initialize();
}
$(document).ready(gameStart);

// THe Game Board
function Game(size) {
  this.rows = size;
  this.columns = size;
  // board 2d array, with grid cell object
  this.board = [];
  this.boardFlatten = function () {
    return _.flatten(this.board);
  };
  // score biard
  this.score = 0;
  $('[data-js="score"]').html(this.score.toString());

  // check whether any tile movement is in progress
  this.moveInProgress = false;
}

