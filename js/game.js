var paper;
var pieces;
var grid;

var dir;

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
    pieces = {
        "big_s": new Piece("big_s", 1, 0, config.get("BIG_SQUARE")["WIDTH"], config.get("BIG_SQUARE")["HEIGHT"], "red"),
        "small_s": {
            0: new Piece("small_s", 0, 4, config.get("CELL_SIZE"), config.get("CELL_SIZE"), "green"),
            1: new Piece("small_s", 1, 3, config.get("CELL_SIZE"), config.get("CELL_SIZE"), "green"),
            2: new Piece("small_s", 2, 3, config.get("CELL_SIZE"), config.get("CELL_SIZE"), "green"),
            3: new Piece("small_s", 3, 4, config.get("CELL_SIZE"), config.get("CELL_SIZE"), "green")
        },
        "tall": {
            0: new Piece("tall", 0, 0, config.get("TALL_RECT")["WIDTH"], config.get("TALL_RECT")["HEIGHT"], "orange"),
            1: new Piece("tall", 0, 2, config.get("TALL_RECT")["WIDTH"], config.get("TALL_RECT")["HEIGHT"], "orange"),
            2: new Piece("tall", 3, 0, config.get("TALL_RECT")["WIDTH"], config.get("TALL_RECT")["HEIGHT"], "orange"),
            3: new Piece("tall", 3, 2, config.get("TALL_RECT")["WIDTH"], config.get("TALL_RECT")["HEIGHT"], "orange")
        },
        "wide": new Piece("wide", 1, 2, config.get("WIDE_RECT")["WIDTH"], config.get("WIDE_RECT")["HEIGHT"], "blue")
//        "empty": {
//            0: new Piece("empty", 1, 4, config.get("CELL_SIZE"), config.get("CELL_SIZE"), "black"),
//            1: new Piece("empty", 2, 4, config.get("CELL_SIZE"), config.get("CELL_SIZE"), "black")
//        }
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

        if (currPiece != null) {
            if (currPiece.canMove(dir))
                currPiece.move(dir);

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

Piece.prototype.canMove = function (dir) {
    if (this.id != "small_s" && (dir == "NE" || dir == "NW" || dir == "SW" || dir == "SE"))
        return false;

    var r = this.y;
    var c = this.x;

    var r_count = 0;
    var c_count = 0;

    var _r = 0, _c = 0;

    var dim = this.getUnitWidthHeight();

    switch (dir) {
        case "E":
            r_count = dim.h;
            c_count++;
            _c = dim.w;
            break;
        case "NE":
            _r = -1;
            _c = 1;
            break;
        case "N":
            r_count++;
            c_count = dim.w;
            _r--;
            break;
        case "NW":
            _r = -1;
            _c = -1;
            break;
        case "W":
            r_count = dim.h;
            c_count++;
            _c--;
            break;
        case "SW":
            _r = 1;
            _c = -1;
            break;
        case "S":
            r_count++;
            c_count = dim.w;
            _r = dim.h;
            break;
        case "SE":
            _r = 1;
            _c = 1;
            break;
    }

    if (this.id == "small_s" && (dir == "NE" || dir == "NW" || dir == "SW" || dir == "SE")) {
        if (grid[r + _r][c + _c] == config.get("VALID")) {
            if (grid[r + _r][c] == config.get("VALID") || grid[r][c + _c] == config.get("VALID"))
                return true;
        }
        return false;
    }

    for (var i = r; i < r + r_count; i++) {
        for (var j = c; j < c + c_count; j++) {
            if (i + _r > 4 || i + _r < 0 || j + _c > 3 || j + _c < 0)
                return false;
            else if (grid[i + _r][j + _c] == config.get("INVALID"))
                return false;
        }
    }

    return true;
}

Piece.prototype.move = function (dir) {
    var dim = this.getUnitWidthHeight();

    setValueGrid(this.y, this.x, dim.w, dim.h, config.get("VALID"));

    switch (dir) {
        case "E":
            this.moveTo(this.x + 1, this.y);
            break;
        case "NE":
            this.moveTo(this.x + 1, this.y - 1);
            break;
        case "N":
            this.moveTo(this.x, this.y - 1);
            break;
        case "NW":
            this.moveTo(this.x - 1, this.y - 1);
            break;
        case "W":
            this.moveTo(this.x - 1, this.y);
            break;
        case "SW":
            this.moveTo(this.x - 1, this.y + 1);
            break;
        case "S":
            this.moveTo(this.x, this.y + 1);
            break;
        case "SE":
            this.moveTo(this.x + 1, this.y + 1);
            break;
    }
}

Piece.prototype.moveTo = function (x, y) {
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
        });
}
