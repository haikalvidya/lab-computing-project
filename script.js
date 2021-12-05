// First Gamestart
function gameStart() {
	window.game = new Game(4);
	window.game.initialize();
}
$(document).ready(gameStart);

/*
* TILE SECTION
*/

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
  this.canMove = false;

  // getter or setter for value, default value is 2
  this.valueProp = 2;
  Object.defineProperties(this, {
    value: {
      get: function() {
        return this.valueProp;
      }, set: function(value) {
        this.valueProp = val;
        this.elm.find(".tile_number").html(this.valueProp).valueattr("data-value", value);
      }
    }
  });
}

// init tile
Tile.prototype.initialize = function () {
  var theTile = $.parseHTML($("#template_tile").html());
  this.el = $(theTile);
  this.el.
  find(".tile_number").
  html(this.valueProp).
  attr("data-value", 2);
  this.setPosition(this.x, this.y);
  this.el.appendTo(".tile-container");
  // TODO add animation in initialization
}


// tile set position
Tile.prototype.setPosition = function(getX, getY) {
  this.x = getX;
  this.y = getY;
  this.game.board[getX][getY].tilesArray.push(this);
}

// TODO remove old set position
// the idea : poping up the value from arrat board[getx][gety]
// for andangsudrajad

// remove old set position
Tile.prototype.removePosition = function(getX, getY) {

}


// TODO add move logic of this game
// the idea :

// move logic of 2048 game
Tile.prototype.move = function (theFlag, theDirection) {
  var theNext;
  var isMatch;
  var isNextEmpty;
  var nextPosArray = [];
  var direction = theDirection.toLowerCase();

  // checking next position
  // if UP: check next position
  if (direction === "up") {
    getNext = this.y > 0 ? this.game.board[this.x][this.y - 1] : false;
    nextPosArray.push(this.x, this.y - 1);
  } else if (direction === "right") {
	  getNext = this.x > 0 ? this.game.board[this.x - 1][this.y] : false;
	  nextPosArray.push(this.x - 1, this.y);
  } else if (direction === "left") {
	  getNext = this.x < 0 ? this.game.board[this.x + 1][this.y] : false;
	  nextPosArray.push(this.x + 1, this.y);
  } else if (direction === "down") {
	  getNext = this.y < 0 ? this.game.board[this.x][this.y + 1] : false;
	  nextPosArray.push(this.x, this.y + 1);
  }
  // sub TODO lanjutin ifnya right, left, down
  // for shadifa


  // sub TODO check if next position contains match or is empty
  // for dwija
  isMatch =

  var getX = this.x;
  var getY = this.y;
  isNextEmpty = getNext.tilesArray.length == 0 && getNext;

  // sub TODO check only mode, to check if tile can move
  if (theFlag) {
    return isNextEmpty || isNextEmpty ? true : false;
  } else if () {
    // set postion next post array
    // for andangsudrajad

    // remove old position
    // for dwija

    // not continue if a tile has matched then merged the tile
    // for shadif
  }

}

// TODO animation of tile to some position

// Animation of tile
Tile.prototype.animationPosition = function (initFlag) {
  var animationDuration = 175;
  var getPromise = $.Deferred();

  var fromLeft = this.x * (100 / this.game.rows);
  var fromTop = this.y * (100 / this.game.columns);

  if (initFlag){
    this.el.addClass("initialize");
  } else {
    this.el.removeClass("initialize");
  }

  function setPosition() {
    this.el.addClass("animate");
    this.el.attr({
      "data-x": fromLeft,
      "data-y": fromTop
    });
  }

  function resolvePromise() {
    getPromise.resolve();
    this.el.removeClass("animate");
    this.el.removeClass("initialize");
  }

  if (initalizeFlag) {
    // sub TODO set position and window settimeout animationduration + 50
    // for raihan romzi

  } else {
    // sub TODO set position and window settimeout animationduration
    // for andang sudrajad
    
  }
  return getPromise;
}


/* -------------------------------------------------------------
* GAME BOARD SECTION
*/

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

// init tiles
Game.prototype.initTile = function () {
  var emptyCell = this.getRandomEmptyCell();
  var tile = new Tile(emptyCell.x, emptyCell.y, game);
};

// TODO function init game
// idea: run all init game

// run all init
Game.prototype.initialize = function () {
  this.initBoard();
  this.initTile();
};

// Case for Game is Won
Game.prototype.gameWon = function() {
  alert("You won!");
};

// CAse for game is lost
Game.prototype.gameLost = function() {
  alert("Your are a loser.");
};

// TODO Checking is game over or not
// idea : checking each value of array any 2048 or not,
//        and check move possiblity (any tile can move or no empty cells)

// check game over or not

// method get emtpy cells
Game.prototype.getEmptyCells = function () {
  var theemptyCells = _.filter(this.boardFlatten(), function (value) {
    return !value.tilesArray.length;
  });
  return theemptyCells;
};

// get random idx empty cell
Game.prototype.getRandomEmptyCell = function() {
  var emptyGridCells = this.getEmptyCells();
  var random = Math.floor(Math.random() * Math.floor(emptyGridCells.length));
  return emptyGridCells[random];
}

// TODO method for merge tiles logic
// idea : 

// merge tiles logic
