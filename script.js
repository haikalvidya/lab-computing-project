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
  
  // flatten an 2d array
  this.boardFlatten = function () {
    return _.flatten(this.board);
  };
  // score biard
  this.score = 0;
  $('[data-js="score"]').html(this.score.toString());

  // check whether any tile movement is in progress
  this.moveInProgress = false;
}

// the Tile object
function Tile(x,y, game) {
  //curent postion
  this.x = x;
  this.y = y;

  // game now
  this.game = game;
  // jquery element
  this.elm;

  // variabel for indentify tile can move or not
  this.canMOve = false;

  // getter or setter for value, default value is 2
  this.valueProp = 2;
  Object.defineProperties(this, {
    value: {
      get: function() {
        return this.valueProp;
      }, set: function(value) {
        this.valueProp = val;
        this.elm.find(".tile_number").
        html(this.valueProp).valueattr("data-value", value);
      }
    }
  });
}

// tile set position
Tile.prototype.setPosition = function(getX, getY) {
  this.x = getX;
  this.y = getY;
  this.game.board[getX][getY].tilesArray.push(this);
}

// Initialize grid
Game.prototype.initBoard = function () {
  // returning grid cell for displaying
  function initGridCell(x, y) {
    var getGridCell = $.parseHTML($("#template_grid_cell").html());
    $(getGridCell).appendTo(".grid");
    return {
      x: x,
      y: y,
      tilesArray: [] 
		};

  }

  // create 2d array and push grid cell
  for (var x = 0; x < this.rows; x++) {
    var newArray = [];
    this.board.push(newArray);
    for (var y = 0; y < this.columns; y++) {
      var gridObj = initGridCell(x, y);
      var rowCell = this.board[x];
      rowCell.push(gridObj);
    }
  }
};

// Case for Game is Won
Game.prototype.gameWon = function() {
  alert("You won!");
};

// CAse for game is lost
Game.prototype.gameLost = function() {
  alert("Your are a loser.");
};

