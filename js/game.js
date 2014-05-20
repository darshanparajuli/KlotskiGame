var paper;
var pieces;
var grid;

var dir; // 0, 1, 2, 3; 0: East; Counter-Clockwise

var ANIM_SPEED = 100;

var config = (function () {
    var CELL_SIZE = 50;
    var ROWS = 5 + 4;
    var COLS = 4;

    var constants = {
        "VALID": 0,
        "WIN": 2,
        "INVALID": 1,
        "ROWS": ROWS,
        "COLS": COLS,
        "OFFSET": 5,
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
    paper = Raphael("klotski", config.get("WIDTH") + config.get("OFFSET"), config.get("HEIGHT") + config.get("OFFSET"));
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
            1: new Piece("small_s", 1, 3, config.get("CELL_SIZE"), config.get("CELL_SIZE"), "blue"),
            2: new Piece("small_s", 2, 3, config.get("CELL_SIZE"), config.get("CELL_SIZE"), "brown"),
            3: new Piece("small_s", 3, 4, config.get("CELL_SIZE"), config.get("CELL_SIZE"), "darkred")
        },
        "tall": {
            0: new Piece("tall", 0, 0, config.get("TALL_RECT")["WIDTH"], config.get("TALL_RECT")["HEIGHT"], "red"),
            1: new Piece("tall", 0, 2, config.get("TALL_RECT")["WIDTH"], config.get("TALL_RECT")["HEIGHT"], "red"),
            2: new Piece("tall", 3, 0, config.get("TALL_RECT")["WIDTH"], config.get("TALL_RECT")["HEIGHT"], "red"),
            3: new Piece("tall", 3, 2, config.get("TALL_RECT")["WIDTH"], config.get("TALL_RECT")["HEIGHT"], "red")
        },
        "wide": new Piece("wide", 1, 2, config.get("WIDE_RECT")["WIDTH"], config.get("WIDE_RECT")["HEIGHT"], "red")
    };
}

function getUnitWidthHeight(piece) {
    var _w, _h;

    switch (piece.id) {
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

function setValueGrid(startRow, startCol, w, h, val) {
    for (var i = startRow; i < startRow + h; i++) {
        for (var j = startCol; j < startCol + w; j++) {
            grid[i][j] = val;
        }
    }
}

function Piece(id, x, y, w, h, c) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    var _this = this;
    this.rect = paper.rect((x * config.get("CELL_SIZE")) + config.get("OFFSET"), (y * config.get("CELL_SIZE")) + config.get("OFFSET"),
            w - config.get("OFFSET"), h - config.get("OFFSET"))
        .click(function (evt) {


            var dim = getUnitWidthHeight(_this);

            switch (dir) {
                case 0:
                    if (grid[_this.y][_this.x + dim.w] == config.get("VALID")) {
                        setValueGrid(_this.y, _this.x, dim.h, dim.w, config.get("VALID"));
                        _this.moveTo(_this.x + dim.w, _this.y);
                    } else {
                        if (grid[_this.y][_this.x - dim.w] == config.get("VALID")) {
                            setValueGrid(_this.y, _this.x, dim.h, dim.w, config.get("VALID"));
                            _this.moveTo(_this.x - dim.w, _this.y);
                        }
                        dir = 1;
                    }
                    break;
                case 1:
                    if (grid[_this.y][_this.x - dim.w] == config.get("VALID")) {
                        setValueGrid(_this.y, _this.x, dim.h, dim.w, config.get("VALID"));
                        _this.moveTo(_this.x - dim.w, _this.y);
                    } else {
                        if (grid[_this.y][_this.x + dim.w] == config.get("VALID")) {
                            setValueGrid(_this.y, _this.x, dim.h, dim.w, config.get("VALID"));
                            _this.moveTo(_this.x + dim.w, _this.y);
                        }
                        dir = 0;
                    }
                    break;
                case 2:
                    break;
                case 3:
                    break;
            }
        })
        .attr({fill: c, stroke: "black", "stroke-width": 3});
}

Piece.prototype.moveTo = function (x, y) {
    this.x = x;
    this.y = y;
    var _this = this;
    this.rect.animate({x: (x * config.get("CELL_SIZE")) + config.get("OFFSET"),
            y: (y * config.get("CELL_SIZE")) + config.get("OFFSET")}, ANIM_SPEED, "ease-in-out",
        function () {
            _this.x = Math.floor(this.attr('x') / config.get("CELL_SIZE"));
            _this.y = Math.floor(this.attr('y') / config.get("CELL_SIZE"));
            var dim = getUnitWidthHeight(_this);
            setValueGrid(_this.y, _this.x, dim.h, dim.w, config.get("INVALID"));
        });
}
