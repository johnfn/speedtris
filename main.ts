// 9:42PM
// 10:48PM

// Type definitions

/**
 * Stopped, Moving, Empty.
 */
type TetrisCell = "X" | "O" | ".";

interface ActivePiece {
    piece: TetrisCell[][];

    x: number;
    y: number;
}

const pieces: TetrisCell[][][] = [
    [ "X...",
      "X...",
      "X...",
      "X...",
    ],
    [ ".X..",
      ".XX.",
      ".X..",
      "....",
    ],
    [ ".X..",
      ".XX.",
      "..X.",
      "....",
    ],
    [ "..X.",
      ".XX.",
      ".X..",
      "....",
    ],
    [ "....",
      ".XX.",
      ".XX.",
      "....",
    ],
] as any // satisfy the type checker!;

const main = document.getElementById("main") as HTMLDivElement;
const indicator = document.getElementById("indicator") as HTMLDivElement;
let grid: HTMLSpanElement[][] = [];
let activePiece: ActivePiece = undefined;
let staticPieces: TetrisCell[][] = [];
let width = 5;
let height = 20;
let score = 0;

let html = "";
let keyStates: boolean[] = [];

document.onkeydown = function(evt: any) {
    evt = evt || window.event;
    const charCode = evt.keyCode || evt.which;

    console.log(charCode);

    keyStates[charCode] = true;
};

document.onkeyup = function(evt: any) {
    evt = evt || window.event;
    const charCode = evt.keyCode || evt.which;

    keyStates[charCode] = false;
};

// Build up a really crappy view for our data

for (let i = 0; i < height; i++) {
    html += `<div id='row${i}'>`;

    for (let j = 0; j < width; j++) {
        html += `<span class="grid" id='${i},${j}'>.</span>`;
    }

    html += `</div>`;
}

main.innerHTML = html;

// build up grid

for (let i = 0; i < height; i++) {
    grid.push([]);
    staticPieces.push([]);

    for (let j = 0; j < width; j++) {
        grid[i][j] = document.getElementById(i + "," + j);
        staticPieces[i][j] = ".";
    }
}

function iteratePiecePositions(piece: TetrisCell[][]): { pieceX: number, pieceY: number }[] {
    let result: { pieceX: number, pieceY: number}[] = [];

    for (let i = 0; i < activePiece.piece.length; i++) {
        for (let j = 0; j < activePiece.piece[i].length; j++) {
            if (activePiece.piece[i][j] !== "X") {
                continue;
            }

            result.push({ pieceX: i + activePiece.x, pieceY: j + activePiece.y })
        }
    }

    return result;
}

function clone(piece: TetrisCell[][]): TetrisCell[][] {
    return piece.map(x => x.slice(0));
}

function rotateActivePiece(): void {
    let newPiece = [];

    for (let i = 0; i < 4; i++) {
        newPiece.push([]);

        for (let j = 0; j < 4; j++) {
            newPiece[i][j] = activePiece.piece[4 - j - 1][i];
        }
    }

    activePiece.piece = newPiece;
}

function updateGrid(): void {
    if (activePiece === undefined) {
        activePiece = {
            piece: clone(pieces[Math.floor(Math.random() * pieces.length)]),
            x: 0,
            y: 0,
        };

        return;
    }

    // I flipped x and y :(
    activePiece.x += 1;

    // W 87
    // A 65
    // S 83
    // D 68

    const previousY = activePiece.y;

    if (keyStates[87]) { }
    if (keyStates[65]) { activePiece.y -= 1; }
    if (keyStates[68]) { activePiece.y += 1; }
    if (keyStates[83]) { rotateActivePiece(); }

    let frozen = false;
    let outOfBounds = false;

    for (const { pieceX, pieceY } of iteratePiecePositions(activePiece.piece)) {
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

        for (const { pieceX, pieceY } of iteratePiecePositions(activePiece.piece)) {
            staticPieces[pieceX][pieceY] = "X";
        }

        activePiece = undefined;
    }

    if (outOfBounds) {
        activePiece.y = previousY;
    }
}

function removeFullLines(): void {
    for (let i = height - 1; i >= 0; i--) {
        let isFullLine = true;

        for (let j = 0; j < width; j++) {
            if (staticPieces[i][j] !== "X") {
                isFullLine = false;

                break;
            }
        }

        if (!isFullLine) {
            continue;
        }

        // move above lines down one

        for (let k = i - 1; k >= 0; k--) {
            for (let l = 0; l < width; l++) {
                staticPieces[k + 1][l] = staticPieces[k][l];
            }
        }

        ++score;
    }
}

function renderGrid(): void {
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            grid[i][j].innerText = staticPieces[i][j];
        }
    }

    if (!activePiece) {
        return;
    }

    // render active piece

    for (const { pieceX, pieceY } of iteratePiecePositions(activePiece.piece)) {
        grid[pieceX][pieceY].innerText = "X";
    }
}

const interval = setInterval(() => {
    updateGrid();
    removeFullLines();
    renderGrid();
}, 150);