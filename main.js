// 9:42PM
// 10:48PM
var pieces = [
    ["X...",
        "X...",
        "X...",
        "X...",
    ],
    [".X..",
        ".XX.",
        ".X..",
        "....",
    ],
    [".X..",
        ".XX.",
        "..X.",
        "....",
    ],
    ["..X.",
        ".XX.",
        ".X..",
        "....",
    ],
    ["....",
        ".XX.",
        ".XX.",
        "....",
    ],
]; // satisfy the type checker!;
var main = document.getElementById("main");
var indicator = document.getElementById("indicator");
var grid = [];
var activePiece = undefined;
var staticPieces = [];
var width = 5;
var height = 20;
var score = 0;
var html = "";
var keyStates = [];
document.onkeydown = function (evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    console.log(charCode);
    keyStates[charCode] = true;
};
document.onkeyup = function (evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    keyStates[charCode] = false;
};
// Build up a really crappy view for our data
for (var i = 0; i < height; i++) {
    html += "<div id='row" + i + "'>";
    for (var j = 0; j < width; j++) {
        html += "<span class=\"grid\" id='" + i + "," + j + "'>.</span>";
    }
    html += "</div>";
}
main.innerHTML = html;
// build up grid
for (var i = 0; i < height; i++) {
    grid.push([]);
    staticPieces.push([]);
    for (var j = 0; j < width; j++) {
        grid[i][j] = document.getElementById(i + "," + j);
        staticPieces[i][j] = ".";
    }
}
function iteratePiecePositions(piece) {
    var result = [];
    for (var i = 0; i < activePiece.piece.length; i++) {
        for (var j = 0; j < activePiece.piece[i].length; j++) {
            if (activePiece.piece[i][j] !== "X") {
                continue;
            }
            result.push({ pieceX: i + activePiece.x, pieceY: j + activePiece.y });
        }
    }
    return result;
}
function clone(piece) {
    return piece.map(function (x) { return x.slice(0); });
}
function rotateActivePiece() {
    var newPiece = [];
    for (var i = 0; i < 4; i++) {
        newPiece.push([]);
        for (var j = 0; j < 4; j++) {
            newPiece[i][j] = activePiece.piece[4 - j - 1][i];
        }
    }
    activePiece.piece = newPiece;
}
function updateGrid() {
    if (activePiece === undefined) {
        activePiece = {
            piece: clone(pieces[Math.floor(Math.random() * pieces.length)]),
            x: 0,
            y: 0
        };
        return;
    }
    // I flipped x and y :(
    activePiece.x += 1;
    // W 87
    // A 65
    // S 83
    // D 68
    var previousY = activePiece.y;
    if (keyStates[87]) { }
    if (keyStates[65]) {
        activePiece.y -= 1;
    }
    if (keyStates[68]) {
        activePiece.y += 1;
    }
    if (keyStates[83]) {
        rotateActivePiece();
    }
    var frozen = false;
    var outOfBounds = false;
    for (var _i = 0, _a = iteratePiecePositions(activePiece.piece); _i < _a.length; _i++) {
        var _b = _a[_i], pieceX = _b.pieceX, pieceY = _b.pieceY;
        if (pieceX >= height) {
            frozen = true;
            break;
        }
        if (pieceY >= width || pieceY < 0) {
            outOfBounds = true;
            break;
        }
        if (staticPieces[pieceX][pieceY] === "X") {
            frozen = true;
            break;
        }
    }
    if (frozen) {
        activePiece.x -= 1;
        if (activePiece.x <= 0) {
            indicator.innerHTML = "You lose!";
            clearInterval(interval);
            return;
        }
        for (var _c = 0, _d = iteratePiecePositions(activePiece.piece); _c < _d.length; _c++) {
            var _e = _d[_c], pieceX = _e.pieceX, pieceY = _e.pieceY;
            staticPieces[pieceX][pieceY] = "X";
        }
        activePiece = undefined;
    }
    if (outOfBounds) {
        activePiece.y = previousY;
    }
}
function removeFullLines() {
    for (var i = height - 1; i >= 0; i--) {
        var isFullLine = true;
        for (var j = 0; j < width; j++) {
            if (staticPieces[i][j] !== "X") {
                isFullLine = false;
                break;
            }
        }
        if (!isFullLine) {
            continue;
        }
        // move above lines down one
        for (var k = i - 1; k >= 0; k--) {
            for (var l = 0; l < width; l++) {
                staticPieces[k + 1][l] = staticPieces[k][l];
            }
        }
        ++score;
    }
}
function renderGrid() {
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            grid[i][j].innerText = staticPieces[i][j];
        }
    }
    if (!activePiece) {
        return;
    }
    // render active piece
    for (var _i = 0, _a = iteratePiecePositions(activePiece.piece); _i < _a.length; _i++) {
        var _b = _a[_i], pieceX = _b.pieceX, pieceY = _b.pieceY;
        grid[pieceX][pieceY].innerText = "X";
    }
}
var interval = setInterval(function () {
    updateGrid();
    removeFullLines();
    renderGrid();
}, 150);
