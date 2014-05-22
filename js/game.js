var paper;
var pieces;
var grid;

var total_moves = 0;

var mxBefore, mxAfter, myBefore, myAfter;

var currPiece;

var config = (function () {
    var CELL_SIZE = 100;
    var ROWS = 5 + 4;
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

$(function () {
    init();
});

function init() {
    paper = Raphael("klotski", config.get("WIDTH"), config.get("HEIGHT"));
    paper.rect(0, 0, config.get("WIDTH"), config.get("HEIGHT")).attr({fill: "rgb(60, 60, 60)"});
    initGrid();
    initPieces();
}

function initGrid() {
    grid = new Array(config.get("ROWS"));

    for (var i = 0; i < grid.length; i++) {
        grid[i] = new Array(config.get("COLS"));
    }

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

    dir = 0;
}

function initPieces() {
    var big_s_c = "rgb(200, 10, 10)";
    var wide_c = "rgb(0, 50, 200)";
    var small_s_c = "rgb(0, 150, 60)";
    var tall_c = "rgb(20, 120, 120)";

    pieces = {
        "big_s": new Piece("big_s", 1, 0, config.get("BIG_SQUARE")["WIDTH"], config.get("BIG_SQUARE")["HEIGHT"], big_s_c),
        "small_s": {
            0: new Piece("small_s", 0, 4, config.get("CELL_SIZE"), config.get("CELL_SIZE"), small_s_c),
            1: new Piece("small_s", 1, 3, config.get("CELL_SIZE"), config.get("CELL_SIZE"), small_s_c),
            2: new Piece("small_s", 2, 3, config.get("CELL_SIZE"), config.get("CELL_SIZE"), small_s_c),
            3: new Piece("small_s", 3, 4, config.get("CELL_SIZE"), config.get("CELL_SIZE"), small_s_c)
        },
        "tall": {
            0: new Piece("tall", 0, 0, config.get("TALL_RECT")["WIDTH"], config.get("TALL_RECT")["HEIGHT"], tall_c),
            1: new Piece("tall", 0, 2, config.get("TALL_RECT")["WIDTH"], config.get("TALL_RECT")["HEIGHT"], tall_c),
            2: new Piece("tall", 3, 0, config.get("TALL_RECT")["WIDTH"], config.get("TALL_RECT")["HEIGHT"], tall_c),
            3: new Piece("tall", 3, 2, config.get("TALL_RECT")["WIDTH"], config.get("TALL_RECT")["HEIGHT"], tall_c)
        },
        "wide": new Piece("wide", 1, 2, config.get("WIDE_RECT")["WIDTH"], config.get("WIDE_RECT")["HEIGHT"], wide_c)
    };
}

function setValueGrid(startRow, startCol, w, h, val) {
    for (var i = startRow; i < startRow + h; i++) {
        for (var j = startCol; j < startCol + w; j++) {
            grid[i][j] = val;
        }
    }
}

function printGrid() {
    for (var i = 0; i < config.get("ROWS"); i++) {
        var temp = "| ";
        for (var j = 0; j < config.get("COLS"); j++) {
            temp += grid[i][j] + " | ";
        }
        console.log(temp);
    }
}

function getDirection(theta) {
    var dir;
    if (theta > 60 && theta < 120)
        dir = "E";
    else if (theta > 120 && theta < 150)
        dir = "NE";
    else if ((theta > 150 && theta <= 180) || (theta < -150 && theta > -180))
        dir = "N";
    else if (theta > -150 && theta < -120)
        dir = "NW";
    else if (theta > -120 && theta < -60)
        dir = "W";
    else if (theta > -60 && theta < -30)
        dir = "SW";
    else if ((theta > -30 && theta <= 0) || (theta >= 0 && theta < 30))
        dir = "S";
    else if (theta > 30 && theta < 60)
        dir = "SE";

    return dir;
}

$(document).mousedown(function (evt) {
    evt.preventDefault();

    mxBefore = evt.clientX;
    myBefore = evt.clientY;
});

$(document).mouseup(function (evt) {
    mxAfter = evt.clientX;
    myAfter = evt.clientY;

    var deltaX = mxAfter - mxBefore;
    var deltaY = myAfter - myBefore;
    var theta = Math.atan2(deltaX, deltaY) * 180 / Math.PI;

    if (deltaX != 0 || deltaY != 0) {
        var dir = getDirection(theta);

        var dist;
        if (Math.abs(deltaX) > 150 || Math.abs(deltaY) > 150) {
            dist = 2;
        } else {
            dist = 1;
        }

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

function Piece(id, x, y, w, h, c) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.animating;
    this.animating = false;
    var _this = this;
    this.rect = paper.rect((x * config.get("CELL_SIZE")) + config.get("OFFSET"), (y * config.get("CELL_SIZE")) + config.get("OFFSET"),
            w - config.get("OFFSET") * 2, h - config.get("OFFSET") * 2)
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


// fix
Piece.prototype.canMove = function (dir, dist) {
    if (this.id != "small_s" && (dir == "NE" || dir == "NW" || dir == "SW" || dir == "SE"))
        return false;

    var r = this.y;
    var c = this.x;

    var tempr = 1;
    var tempc = 1;

    var _r = 0, _c = 0;

    var dim = this.getUnitWidthHeight();

//    console.log("dir: " + dir + ", dist: " + dist);


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


    if (r + _r > 4 || r + _r < 0 || c + _c > 3 || c + _c < 0) {
        return false;
    }

    if (this.id == "small_s" && (dir == "NE" || dir == "NW" || dir == "SW" || dir == "SE")) {
        if (grid[r + _r][c + _c] == config.get("VALID")) {
            if (grid[r + _r][c] == config.get("VALID") || grid[r][c + _c] == config.get("VALID")) {
                return true;
            }
        }
        return false;
    }
//    console.log("r: " + r);


    for (var i = r; i < r + tempr; i++) {
        for (var j = c; j < c + tempc; j++) {
            if (this.id == "big_s") {
                if (grid[i + _r][j + _c] != config.get("VALID") && grid[i + _r][j + _c] != config.get("WIN")) {
//                    console.log("test1");
                    return false;
                }
            } else {
                if (grid[i + _r][j + _c] != config.get("VALID")) {
//                    console.log("test2");
//                    console.log("var: " + (i + _r));
//                    console.log("var2: " + i + ", " + j);
                    return false;
                }
            }
        }
    }


    return true;
}

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

    this.moveTo(this.x + _x, this.y + _y);
}

Piece.prototype.moveTo = function (x, y) {
    this.animating = true;
    this.x = x;
    this.y = y;
    var _this = this;

    var currColor = this.rect.attr("fill");

    this.rect.animate({x: (x * config.get("CELL_SIZE")) + config.get("OFFSET"),
            y: (y * config.get("CELL_SIZE")) + config.get("OFFSET"), fill: "yellow"}, 300, "<>",
        function () {
            _this.x = Math.floor(this.attr('x') / config.get("CELL_SIZE"));
            _this.y = Math.floor(this.attr('y') / config.get("CELL_SIZE"));
            var dim = _this.getUnitWidthHeight();
            setValueGrid(_this.y, _this.x, dim.w, dim.h, config.get("INVALID"));
            _this.rect.animate({fill: currColor}, 100, "<>", function () {
                _this.animating = false;
            });

            total_moves++;

            $("#total_moves").text("Total Moves: " + total_moves);
        });
}
