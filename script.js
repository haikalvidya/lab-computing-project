// First Gamestart
function gameStart() {
	window.game = new Game(4);
  $(".grid").empty();
  $(".tile-container").empty();
  window.game.initBoard();
	window.game.initTile();
  window.game.initMoveEventListener();
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

  // getter or setter for value, default value is 2
  this.valueProp = 2;
  Object.defineProperties(this, {
    value: {
      get: function() {
        return this.valueProp;
      }, set: function(value) {
        this.valueProp = value;
        this.elm.
        find(".tile_number").html(this.valueProp).attr("data-value", value);
      }
    }
  });

  // init tile
  this.initialize();
}

// init tile
Tile.prototype.initialize = function () {
  var theTile = $.parseHTML($("#template_tile").html());
  this.elm = $(theTile);
  this.elm.find(".tile_number").html(this.valueProp).attr("data-value", 2);
  this.setPosition(this.x, this.y);
  this.elm.appendTo(".tile-container");
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
Tile.prototype.move = function (theDirection, theFlag) {
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
	  theNext = this.x < 3 ? this.game.board[this.x + 1][this.y] : false;
	  nextPosArray.push(this.x + 1, this.y);
  } else if (direction === "left") {
	  theNext = this.x > 0 ? this.game.board[this.x - 1][this.y] : false;
	  nextPosArray.push(this.x - 1, this.y);
  } else if (direction === "down") {
	  theNext = this.y < 3 ? this.game.board[this.x][this.y + 1] : false;
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
    if (!isMatch) {
      this.move(direction);
    }
  }

}

// Animation of tile
Tile.prototype.animationPosition = function (initFlag) {
  var animationDuration = 175;
  // jquery things to tell the browser only exec the script once the html doc has been fully parsed
  var self = this;
  var getPromise = $.Deferred();

  var fromLeft = this.x * (100 / this.game.rows);
  var fromTop = this.y * (100 / this.game.columns);

  if (initFlag){
    this.elm.addClass("initialize");
  } else {
    this.elm.removeClass("initialize");
  }

  if (initFlag) {
    // set animation position and window settimeout animationduration + 50
    self.elm.addClass("animate");
    self.elm.attr({
      "data-x": fromLeft,
      "data-y": fromTop
    });

    window.setTimeout(function() {
      getPromise.resolve();
      self.elm.removeClass("animate");
      self.elm.removeClass("initialize");
    }, animationDuration + 50);
  } else {
    // set animation position and window settimeout animationduration
    self.elm.addClass("animate");
    self.elm.attr({
      "data-x": fromLeft,
      "data-y": fromTop
    });

    window.setTimeout(function() {
      getPromise.resolve();
      self.elm.removeClass("animate");
      self.elm.removeClass("initialize");
    }, animationDuration);
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
  
  // score biard
  this.score = 0;
  $('[data-js="score"]').html(this.score.toString());

  // flatten an 2d array
  this.boardFlatten = function () {
    return _.flatten(this.board);
  };

  // check whether any tile movement is in progress
  this.moveInProgress = false;
}

// Initialize grid board
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
      var row = this.board[x];
      row.push(gridObj);
    }
  }
};

// init tiles
Game.prototype.initTile = function () {
  this.isGameOver();
  var emptyCell = this.getRandomEmptyCell();
  var tile = new Tile(emptyCell.x, emptyCell.y, game);
  // checking game over
  this.isGameOver();
};

// Case for Game is Won
Game.prototype.gameWon = function() {
  alert("You won!");
};

// CAse for game is lost
Game.prototype.gameLost = function() {
  alert("Your are a loser.");
};

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

// check game over or not
Game.prototype.isGameOver = function () {
  var theGameBoard = this.boardFlatten();
  var isAnyTileMove = false;
  var emptyCells = false;
  var is2048 = false;

  // case if game is over
  // check if there are empty cells
  if (this.getEmptyCells().length > 0) {
    emptyCells = true;
  }

  // check if the tiles any 2048
  theGameBoard.forEach((value, index, array) => {
    value.tilesArray.forEach((value, index, array) => {
      if (value.valueProp === 2048) {
        is2048 = true;
      }
    });
  });
  // Check if move possible
  theGameBoard.forEach((value, index, array) => {
    value.tilesArray.forEach((value, index, array) => {
      // checking move
      if (
        value.move("up", true) ||
        value.move("right", true) ||
        value.move("down", true) ||
        value.move("left", true))
      {
        isAnyTileMove = true;
      }
    });
  });

  // if game won
  if (is2048) {
    this.gameWon();
    return true;
  } else if (!emptyCells && !isAnyTileMove) {
    // if no empty cells or there is no tile can move
    // the game is lost
    this.gameLost();
    return true;
  } else {
    // if there is still a tile can move or an empty tile
    return false;
  }
};

// merge tiles logic
Game.prototype.TilesMerge = function() {
  var theNewScore = this.score;
  var gameBoard = this.boardFlatten();

  // checking through all tiles
  gameBoard.forEach((value, index, array) => {
    if (value.tilesArray.length === 2) {
      // updating value from current valueprop
      value.tilesArray[0].value = value.tilesArray[0].valueProp * 2;
      // update score
      theNewScore += value.tilesArray[0].valueProp;
      // remove the second tile
      var p = value.tilesArray.pop();
      p.elm.remove();
    }
  });

  // updating score board html
  this.score = theNewScore;
  $('[data-js="score"]').html(this.score.toString());
};

// logic of tile move on board
Game.prototype.move = function (theDirection) {
  theDirection = theDirection.toLowerCase();
  var canAnyTileMoved = false;

  if(this.moveInProgress) {
    return false;
  }
  var gameBoard;

  // moving flatten array by ordering
  if (theDirection === "up") {
    gameBoard = _.orderBy(this.boardFlatten(), "y", "asc");
  } else if (theDirection === "down") {
    gameBoard = _.orderBy(this.boardFlatten(), "y", "desc");
  } else if (theDirection === "right") {
    gameBoard = _.orderBy(this.boardFlatten(), "x", "desc");
  } else if (theDirection === "left") {
    gameBoard = _.orderBy(this.boardFlatten(), "y", "asc");
  }

  // move all tiles on board with logic move of tile then see there is a any tile moved
  gameBoard.forEach((value, index, array) => {
    value.tilesArray.length ?
    value.tilesArray.forEach((value) => {
      if (value.move(theDirection, true)) {
        canAnyTileMoved = true;
        value.move(theDirection);
      }
    }) : false;
  });

  canAnyTileMoved ? this.moveAnimations(gameBoard) : false;
}

// event move listener
Game.prototype.initMoveEventListener = function() {
  // keyboard events for moving
  var self = this;
  $(document).
  off("keydown.move").
  on("keydown.move", function (event) {
    event.preventDefault();
    switch (event.which) {
    // for left
    case 37:
      self.move("left");
      break;
    // for up
    case 38:
      self.move("up");
      break;
    // for right
    case 39:
      self.move("right");
      break;
    // for down
    case 40:
      self.move("down");
      break;}
  });

  // touch event with hammer js
  window.hammertime && window.hammertime.destroy();
  window.hammertime = new Hammer(document.getElementById("touchGameboard"), {
    recognizers: [[Hammer.Swipe, { direction: Hammer.DIRECTION_ALL }]]
  });

  window.hammertime.
  on("swipeup", function (ev) {
    self.move("up");
  }).
  on("swipedown", function (ev) {
    self.move("down");
  }).
  on("swiperight", function (ev) {
    self.move("right");
  }).
  on("swipeleft", function (ev) {
    self.move("left");
  });

  // new game handler
  $('[data-js="newGame"]').
  off("click.newGame").
  on("click.newGame", window.gameStart);
}

Game.prototype.moveAnimations = function (gameBoard) {
  var promiseArray = [];
  
  if (this.moveInProgress) {
    return false;
  }
  
  this.moveInProgress = true;
  gameBoard.forEach(function (val, index, array) {
    val.tilesArray.forEach(function (val, index, array) {
      promiseArray.push(val.animationPosition());
    });
  });
  
  var self = this;
  $.when.apply($, promiseArray).then(function () {
    self.moveInProgress = false;
    self.TilesMerge();
    self.initTile();
  });
  if (promiseArray.length === 0) {
    self.moveInProgress = false;
    self.TilesMerge();
    self.initTile();
  }
};