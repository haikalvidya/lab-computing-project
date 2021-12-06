// First Gamestart
function gameStart() {
	window.game = new Game(4);
  window.game.initBoard();
	window.game.initTile();
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
  this.animationPosition(true);
}


// tile set position
Tile.prototype.setPosition = function(getX, getY) {
  this.x = getX;
  this.y = getY;
  this.game.board[getX][getY].tilesArray.push(this);
}
// tile remover for old position
Tile.prototype.removePosition = function(getX, getY) {
  this.game.board[getX][getY].tilesArray.pop();
}

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
    theNext = this.y > 0 ? this.game.board[this.x][this.y - 1] : false;
    nextPosArray.push(this.x, this.y - 1);
  } else if (direction === "right") {
	  theNext = this.x > 0 ? this.game.board[this.x - 1][this.y] : false;
	  nextPosArray.push(this.x - 1, this.y);
  } else if (direction === "left") {
	  theNext = this.x < 0 ? this.game.board[this.x + 1][this.y] : false;
	  nextPosArray.push(this.x + 1, this.y);
  } else if (direction === "down") {
	  theNext = this.y < 0 ? this.game.board[this.x][this.y + 1] : false;
	  nextPosArray.push(this.x, this.y + 1);
  }

  // check empty with the next gameboard
  isNextEmpty = theNext && theNext.tilesArray.length === 0;

  // check is match from the next tiles array length and value prop of array
  isMatch = theNext && theNext.tilesArray.length === 1 && 
  theNext.tilesArray[0].valueProp === this.valueProp;

  // for removing old position tile
  var getOldX = this.x;
  var getOldY = this.y;

  // to check if tile can move
  if (theFlag) {
    return isNextEmpty || isMatch ? true : false;
  } else if (isNextEmpty || isMatch) {
    // set postion next position tile from array
    this.setPosition(nextPosArray[0], nextPosArray[1]);

    // remove old position
    this.removePosition(getOldX, getOldY)

    // not continue if a tile has matched then merged the tile
    if (!isNextMatch) {
      this.move(direction);
    }
  }

}

// Animation of tile
Tile.prototype.animationPosition = function (initFlag) {
  var animationDuration = 175;
  // jquery things to tell the browser only exec the script once the html doc has been fully parsed
  var getPromise = $.Deferred();

  var fromLeft = this.x * (100 / this.game.rows);
  var fromTop = this.y * (100 / this.game.columns);

  if (initFlag){
    this.el.addClass("initialize");
  } else {
    this.el.removeClass("initialize");
  }

  if (initalizeFlag) {
    // set animation position and window settimeout animationduration + 50
    this.el.addClass("animate");
    this.el.attr({
      "data-x": fromLeft,
      "data-y": fromTop
    });

    window.setTimeout(resolvePromise, animationDuration + 50);
  } else {
    // set animation position and window settimeout animationduration
    getPromise.resolve();
    this.el.removeClass("animate");
    this.el.removeClass("initialize");

    window.setTimeout(resolvePromise, animationDuration);
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
