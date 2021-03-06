var paper;
var pieces;
var grid;
var win = false;
var canReset = true;

var big_s_c = "rgb(200, 10, 10)";
var wide_c = "rgb(0, 50, 200)";
var small_s_c = "rgb(0, 150, 60)";
var tall_c = "rgb(20, 120, 120)";

var total_moves = 0;

var mxBefore, mxAfter, myBefore, myAfter;

var currPiece;

// holds all of the contstants values
var config = (function () {
    var CELL_SIZE = 100;
    var ROWS = 9;
    var COLS = 4;

    var constants = {
        "VALID": 0,
        "WIN": 2,
        "INVALID": 1,
        "ROWS": ROWS,
        "COLS": COLS,
        "OFFSET": 1,
        "CELL_SIZE": CELL_SIZE,
        "WIDTH": CELL_SIZE * 4,
        "HEIGHT": CELL_SIZE * 5,
        "TALL_RECT": {"WIDTH": CELL_SIZE, "HEIGHT": CELL_SIZE * 2},
        "WIDE_RECT": {"WIDTH": CELL_SIZE * 2, "HEIGHT": CELL_SIZE},
        "BIG_SQUARE": {"WIDTH": CELL_SIZE * 2, "HEIGHT": CELL_SIZE * 2}
    }

    return {
        get: function (name) {
            return constants[name];
        }
    }
})();


// automatically gets called when the page loads
$(function () {
    init();
});

/*
 *   Initializes RaphaelJS and saves it to "paper"
 *   Initializes and resets the grid, which is a 2D array
 *   Initializes pieces array which holds all of the Piece objects.
 */
function init() {
    paper = Raphael("klotski", config.get("WIDTH"), config.get("HEIGHT") + 10);
    paper.rect(0, 0, config.get("WIDTH"), config.get("HEIGHT"), 5).attr({fill: "#330e04"});
    paper.rect(config.get("CELL_SIZE"), config.get("HEIGHT"), config.get("CELL_SIZE") * 2, 10, 5).attr({fill: "red"});
    grid = new Array(config.get("ROWS"));
    for (var i = 0; i < grid.length; i++) {
        grid[i] = new Array(config.get("COLS"));
    }
    resetGrid();
    initPieces();
//    testWin();
}

// resets the grid to the initial game state
function resetGrid() {
    for (var i = 0; i < config.get("ROWS") - 4; i++) {
        for (var j = 0; j < config.get("COLS"); j++) {
            grid[i][j] = config.get("INVALID");
        }
    }

    grid[4][1] = config.get("VALID");
    grid[4][2] = config.get("VALID");

    grid[5][0] = config.get("INVALID");
    grid[5][1] = config.get("WIN");
    grid[5][2] = config.get("WIN");
    grid[5][3] = config.get("INVALID");

    grid[6][0] = config.get("INVALID");
    grid[6][1] = config.get("WIN");
    grid[6][2] = config.get("WIN");
    grid[6][3] = config.get("INVALID");

    grid[7][0] = config.get("INVALID");
    grid[7][1] = config.get("WIN");
    grid[7][2] = config.get("WIN");
    grid[7][3] = config.get("INVALID");

    grid[8][0] = config.get("INVALID");
    grid[8][1] = config.get("WIN");
    grid[8][2] = config.get("WIN");
    grid[8][3] = config.get("INVALID");
}

// for developing && testing purposes only
function testWin() {
    for (var i = 0; i < pieces.length; i++) {
        pieces[i].rect.remove();
    }

    grid[0][1] = config.get("VALID");
    grid[0][2] = config.get("VALID");
    pieces[0] = new Piece("big_s", 1, 3, config.get("BIG_SQUARE")["WIDTH"], config.get("BIG_SQUARE")["HEIGHT"], big_s_c);
    pieces[1] = new Piece("small_s", 0, 4, config.get("CELL_SIZE"), config.get("CELL_SIZE"), small_s_c);
    pieces[2] = new Piece("small_s", 1, 2, config.get("CELL_SIZE"), config.get("CELL_SIZE"), small_s_c);
    pieces[3] = new Piece("small_s", 2, 2, config.get("CELL_SIZE"), config.get("CELL_SIZE"), small_s_c);
    pieces[4] = new Piece("small_s", 3, 4, config.get("CELL_SIZE"), config.get("CELL_SIZE"), small_s_c);
    pieces[5] = new Piece("tall", 0, 0, config.get("TALL_RECT")["WIDTH"], config.get("TALL_RECT")["HEIGHT"], tall_c);
    pieces[6] = new Piece("tall", 0, 2, config.get("TALL_RECT")["WIDTH"], config.get("TALL_RECT")["HEIGHT"], tall_c);
    pieces[7] = new Piece("tall", 3, 0, config.get("TALL_RECT")["WIDTH"], config.get("TALL_RECT")["HEIGHT"], tall_c);
    pieces[8] = new Piece("tall", 3, 2, config.get("TALL_RECT")["WIDTH"], config.get("TALL_RECT")["HEIGHT"], tall_c);
    pieces[9] = new Piece("wide", 1, 1, config.get("WIDE_RECT")["WIDTH"], config.get("WIDE_RECT")["HEIGHT"], wide_c);
}

// initializes the pieces array by creating and adding all the Piece objects needed
function initPieces() {
    pieces = new Array(10);

    pieces[0] = new Piece("big_s", 1, 0, config.get("BIG_SQUARE")["WIDTH"], config.get("BIG_SQUARE")["HEIGHT"], big_s_c);
    pieces[1] = new Piece("small_s", 0, 4, config.get("CELL_SIZE"), config.get("CELL_SIZE"), small_s_c);
    pieces[2] = new Piece("small_s", 1, 3, config.get("CELL_SIZE"), config.get("CELL_SIZE"), small_s_c);
    pieces[3] = new Piece("small_s", 2, 3, config.get("CELL_SIZE"), config.get("CELL_SIZE"), small_s_c);
    pieces[4] = new Piece("small_s", 3, 4, config.get("CELL_SIZE"), config.get("CELL_SIZE"), small_s_c);
    pieces[5] = new Piece("tall", 0, 0, config.get("TALL_RECT")["WIDTH"], config.get("TALL_RECT")["HEIGHT"], tall_c);
    pieces[6] = new Piece("tall", 0, 2, config.get("TALL_RECT")["WIDTH"], config.get("TALL_RECT")["HEIGHT"], tall_c);
    pieces[7] = new Piece("tall", 3, 0, config.get("TALL_RECT")["WIDTH"], config.get("TALL_RECT")["HEIGHT"], tall_c);
    pieces[8] = new Piece("tall", 3, 2, config.get("TALL_RECT")["WIDTH"], config.get("TALL_RECT")["HEIGHT"], tall_c);
    pieces[9] = new Piece("wide", 1, 2, config.get("WIDE_RECT")["WIDTH"], config.get("WIDE_RECT")["HEIGHT"], wide_c);
}

// sets the given value to given space(s) in the grid (from startRow to startRow + h and startCol to startCol + w
function setValueGrid(startRow, startCol, w, h, val) {
    for (var i = startRow; i < startRow + h; i++) {
        for (var j = startCol; j < startCol + w; j++) {
            grid[i][j] = val;
        }
    }
}

// prints the grid to the javascript console -- for testing only
function printGrid() {
    for (var i = 0; i < config.get("ROWS"); i++) {
        var temp = "| ";
        for (var j = 0; j < config.get("COLS"); j++) {
            temp += grid[i][j] + " | ";
        }
        console.log(temp);
    }
}

// determines and retuns a direction based on the angle theta that gets passed in
function getDirection(theta) {
    var dir;
    if (theta > 70 && theta < 110)
        dir = "E";
    else if (theta > 110 && theta < 160)
        dir = "NE";
    else if ((theta > 160 && theta <= 180) || (theta < -160 && theta > -180))
        dir = "N";
    else if (theta > -160 && theta < -110)
        dir = "NW";
    else if (theta > -110 && theta < -70)
        dir = "W";
    else if (theta > -70 && theta < -20)
        dir = "SW";
    else if ((theta > -20 && theta <= 0) || (theta >= 0 && theta < 20))
        dir = "S";
    else if (theta > 20 && theta < 70)
        dir = "SE";

    return dir;
}

/*
 *  mousedown event handler
 *  sets the initial mousepressed (x,y) point
 */
$(document).mousedown(function (evt) {
    evt.preventDefault();

    mxBefore = evt.clientX;
    myBefore = evt.clientY;
});

/*
 *  mouseup event handler
 *  sets the (x,y) point where the mouse button was released
 *  figures out the angle theta
 *  gets the direction
 *  determines the distance of travel for the piece
 *  checks to see if that would be valid move and moves accordingly
 */
$(document).mouseup(function (evt) {
    mxAfter = evt.clientX;
    myAfter = evt.clientY;

    var deltaX = mxAfter - mxBefore;
    var deltaY = myAfter - myBefore;
    var theta = Math.atan2(deltaX, deltaY) * 180 / Math.PI;

    if (deltaX != 0 || deltaY != 0) {
        var dir = getDirection(theta);

        var dist;
        if (Math.abs(deltaX) > 150 || Math.abs(deltaY) > 150)
            dist = 2;
        else
            dist = 1;

        if (currPiece != null && currPiece.animating == false) {
            if (dist == 2) {
                if (currPiece.canMove(dir, dist - 1)) {
                    if (currPiece.canMove(dir, dist))
                        currPiece.move(dir, dist);
                    else
                        currPiece.move(dir, dist - 1);

                }
            } else {
                if (currPiece.canMove(dir, dist))
                    currPiece.move(dir, dist);
            }

            currPiece = null;
        }
    }
});

// Piece object
function Piece(id, x, y, w, h, c) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.init_x = x;
    this.init_y = y;
    this.init_c = c;
    this.width = w;
    this.height = h;
    this.animating;
    this.animating = false;
    var _this = this;
    this.rect = paper.rect((x * config.get("CELL_SIZE")) + config.get("OFFSET"), (y * config.get("CELL_SIZE")) + config.get("OFFSET"),
            w - config.get("OFFSET") * 2, h - config.get("OFFSET") * 2, 5)
        .mousedown(function (evt) {
            currPiece = _this;
        })
        .hover(function () {
            this.animate({stroke: "white"}, 300, "<>");
        }, function () {
            this.animate({stroke: "black"}, 300, "<>");
        })
        .attr({fill: c, stroke: "black", "stroke-width": 2});

    this.rect.node.id = id;
}

// returns the width and height in unit form for a particular piece
Piece.prototype.getUnitWidthHeight = function () {
    var _w, _h;

    switch (this.id) {
        case "big_s":
            _w = 2;
            _h = 2;
            break;
        case "small_s":
            _w = 1;
            _h = 1;
            break;
        case "tall":
            _w = 1;
            _h = 2;
            break;
        case "wide":
            _w = 2;
            _h = 1;
            break;
    }

    return {w: _w, h: _h};
}

// determines whether the piece can move a distance dist in the direction dir
Piece.prototype.canMove = function (dir, dist) {
    if (this.id != "small_s" && (dir == "NE" || dir == "NW" || dir == "SW" || dir == "SE"))
        return false;

    var r = this.y;
    var c = this.x;

    var tempr = 1;
    var tempc = 1;

    var _r = 0, _c = 0;

    var dim = this.getUnitWidthHeight();

    switch (dir) {
        case "E":
            _c = dist;
            tempr = dim.h;
            c += (dim.w - 1);
            break;
        case "NE":
            _r = -1;
            _c = 1;
            break;
        case "N":
            _r = -dist;
            tempc = dim.w;
            break;
        case "NW":
            _r = -1;
            _c = -1;
            break;
        case "W":
            _c = -dist;
            tempr = dim.h;
            break;
        case "SW":
            _r = 1;
            _c = -1;
            break;
        case "S":
            _r = dist;
            r += (dim.h - 1);
            tempc = dim.w;
            break;
        case "SE":
            _r = 1;
            _c = 1;
            break;
    }

    if ((c + _c > 3 || c + _c < 0)) {
        return false;
    } else {
        if (this.id != "big_s" && (r + _r > 4 || r + _r < 0)) {
            return false;
        } else if (r + _r < 0) {
            return false;
        }
    }

    if (this.id == "small_s" && (dir == "NE" || dir == "NW" || dir == "SW" || dir == "SE")) {
        if (grid[r + _r][c + _c] == config.get("VALID")) {
            if (grid[r + _r][c] == config.get("VALID") || grid[r][c + _c] == config.get("VALID")) {
                return true;
            }
        }
        return false;
    }

    for (var i = r; i < r + tempr; i++) {
        for (var j = c; j < c + tempc; j++) {
            if (this.id == "big_s") {
                if (grid[i + _r][j + _c] != config.get("VALID") && grid[i + _r][j + _c] != config.get("WIN")) {
                    return false;
                }
            } else {
                if (grid[i + _r][j + _c] != config.get("VALID")) {
                    return false;
                }
            }
        }
    }


    return true;
}

// moves the piece to a distance dist in direction dir
Piece.prototype.move = function (dir, dist) {
    var dim = this.getUnitWidthHeight();

    setValueGrid(this.y, this.x, dim.w, dim.h, config.get("VALID"));

    var _x = 0;
    var _y = 0;

    switch (dir) {
        case "E":
            _x = dist;
            break;
        case "NE":
            _x = 1;
            _y = -1
            break;
        case "N":
            _y = -dist;
            break;
        case "NW":
            _x = _y = -1;
            break;
        case "W":
            _x = -dist;
            break;
        case "SW":
            _x = -1;
            _y = 1;
            break;
        case "S":
            _y = dist;
            break;
        case "SE":
            _x = _y = 1;
            break;
    }

    if (win == false && this.id == "big_s" && dir == "S" && this.x == 1 && this.y == 3) {
        win = true;
        this.moveTo(this.x, 5);
    } else {
        this.moveTo(this.x + _x, this.y + _y);
    }

    total_moves++;
}

// returns a random color
function getRandomColor() {
    var r = Math.random() * 150 + 50;
    var g = Math.random() * 150 + 50;
    var b = Math.random() * 150 + 50;

    return "rgb(" + r + "," + g + "," + b + ")";
}

// moves the piece to a location (x,y) which are in a unit form (i.e x: 0-3, y: 0-4)
Piece.prototype.moveTo = function (x, y) {
    this.animating = true;

    this.x = x;
    this.y = y;
    var _this = this;

    this.rect.animate({x: (x * config.get("CELL_SIZE")) + config.get("OFFSET"),
            y: (y * config.get("CELL_SIZE")) + config.get("OFFSET")}, 300, "<>",
        function () {
            _this.x = Math.floor(this.attr('x') / config.get("CELL_SIZE"));
            _this.y = Math.floor(this.attr('y') / config.get("CELL_SIZE"));
            var dim = _this.getUnitWidthHeight();
            setValueGrid(_this.y, _this.x, dim.w, dim.h, config.get("INVALID"));

            _this.animating = false;

            if (win == true) {
                win = false;

                canReset = false;

                winAnimation();
            }

            $("#total_moves").text("Total Moves: " + total_moves);
        });

}

// handles the animation when the player wins by sliding the big square thru the bottom
function winAnimation() {
    var overlay = paper.rect(0, 0, config.get("WIDTH"), config.get("HEIGHT")).attr({fill: "rgb(0, 0, 0)", opacity: 0});
    var label = paper.text(200, 250, "WIN\n\nTotal Moves: " + total_moves).attr({"font-size": 40, fill: "white", opacity: 0});
    var clickToPlay = paper.text(200, 400, "Click to play again!").attr({"font-size": 16, fill: "gray", opacity: 0});

    overlay.animate({opacity: 0.75}, 2000, "<>");
    label.animate({opacity: 1}, 3000, "<>", function () {
        clickToPlay.animate({opacity: 1}, 1000, "<>", function () {
            overlay.click(function () {
                clickToPlay.animate({opacity: 0}, 1000, "<>", function () {
                    clickToPlay.remove();
                });

                label.animate({opacity: 0}, 2000, "<>", function () {
                    label.remove();
                });

                overlay.animate({opacity: 0}, 2000, "<>", function () {
                    overlay.remove();
                });

                canReset = true;
                reset();
            });
        });
    });
}

// resets the game if it can be reset at that point
function reset() {
    if (canReset == false)
        return;

    for (var i = 0; i < pieces.length; i++) {
        pieces[i].x = pieces[i].init_x;
        pieces[i].y = pieces[i].init_y;
    }

    var t = 0;
    var interval = 30;

    var temp = function () {
        if (++t * interval >= 500) {
            for (var i = 0; i < pieces.length; i++) {
                pieces[i].rect.animate({fill: pieces[i].init_c}, 1000, "<>");
            }
            return;
        }
        for (var i = 0; i < pieces.length; i++) {
            pieces[i].rect.attr({fill: getRandomColor()});
        }

        setTimeout(temp, interval);
    }

    setTimeout(temp, interval);

    resetGrid();

    for (var i = 0; i < pieces.length; i++) {
        pieces[i].moveTo(pieces[i].x, pieces[i].y);
    }

    total_moves = 0;
}