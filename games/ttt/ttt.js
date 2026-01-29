
// SETUP AND DRAWING LOGIC

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

var playerColors = ["red", "blue"];
var highlightColors = ["#FF000044", "#0000FF44"];

function rect(bcolor, x, y, w, h, strokeWidth) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.strokeStyle = bcolor;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
    ctx.closePath();
}

function drawWhiteBG() {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0,0,500, 500);
}

function drawGrid() {
    drawWhiteBG();
    // the big square on the outside
    rect("black", 100, 100, 300, 300, 5);
    // double for loop to draw the small boxes
    for (i = 1; i <= 3; i++) {
        for (j = 1; j <= 3; j++) {
            rect("black", 100*i, 100*j, 100, 100, 3);
        }
    }

}

function drawArrows() {
    if (gameMode == gameModes[0]) return;
    if (gameMode == gameModes[1]) {
        // cylinder
        drawArrow("green", [100,300], [100,200], "up");
        drawArrow("green", [400,300], [400,200], "up");
    }
    if (gameMode == gameModes[2]) {
        // mobius
        drawArrow("green", [100,200], [100,300], "down");
        drawArrow("green", [400,300], [400,200], "up");
    }
    if (gameMode == gameModes[3]) {
        // torus
        drawArrow("green", [100,300], [100,200], "up");
        drawArrow("green", [400,300], [400,200], "up");
        drawArrow("purple", [200,100], [300,100], "right");
        drawArrow("purple", [200,400], [300,400], "right");
    }
    if (gameMode == gameModes[4]) {
        // klein
        drawArrow("green", [100,200], [100,300], "down");
        drawArrow("green", [400,300], [400,200], "up");
        drawArrow("purple", [200,100], [300,100], "right");
        drawArrow("purple", [200,400], [300,400], "right");
    }
    if (gameMode == gameModes[5]) {
        // klein
        drawArrow("green", [100,200], [100,300], "down");
        drawArrow("green", [400,300], [400,200], "up");
        drawArrow("purple", [200,100], [300,100], "right");
        drawArrow("purple", [300,400], [200,400], "left");
    }

}

function drawArrow(color, start, end, facing) {
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);

    if (facing==="up") {
        ctx.lineTo(end[0]+12, end[1]+12);
        ctx.moveTo(end[0], end[1]);
        ctx.lineTo(end[0]-12, end[1]+12);
    }
    if (facing==="down") {
        ctx.lineTo(end[0]+12, end[1]-12);
        ctx.moveTo(end[0], end[1]);
        ctx.lineTo(end[0]-12, end[1]-12);
    }
    if (facing==="right") {
        ctx.lineTo(end[0]-12, end[1]-12);
        ctx.moveTo(end[0], end[1]);
        ctx.lineTo(end[0]-12, end[1]+12);
    }
    if (facing==="left") {
        ctx.lineTo(end[0]+12, end[1]-12);
        ctx.moveTo(end[0], end[1]);
        ctx.lineTo(end[0]+12, end[1]+12);
    }


    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.closePath();
}

function highlightCell(color, bx, by) {
    ctx.fillStyle = color;
    ctx.fillRect(BoardCoordtoCanvasCoord(bx),BoardCoordtoCanvasCoord(by),100, 100);
}



function drawWinnerText(txt) {
    ctx.fillStyle = "black";
    ctx.font = "50px Arial";
    ctx.fillText(txt,20,70);
}

function drawGamemode() {
    ctx.fillStyle = "black";
    ctx.font = "50px Arial";
    ctx.fillText(gameMode,20,470);
}

// Arguments are in game board coords [0][0]...[2][2]
function drawX(color, x, y) {
    // convert game board coords to canvas drawing coords
    x = BoardCoordtoCanvasCoord(x);
    x += 50;
    y = BoardCoordtoCanvasCoord(y);
    y += 50;

    ctx.beginPath();

    ctx.moveTo(x,y);
    ctx.lineTo(x+30,y+30);
    ctx.moveTo(x,y);
    ctx.lineTo(x-30,y-30);
    ctx.moveTo(x,y);
    ctx.lineTo(x-30,y+30);
    ctx.moveTo(x,y);
    ctx.lineTo(x+30,y-30);

    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.closePath();
}

function drawO(color, x, y) {
    // convert game board coords to canvas drawing coords
    x = BoardCoordtoCanvasCoord(x);
    x += 50;
    y = BoardCoordtoCanvasCoord(y);
    y += 50;

    ctx.beginPath();

    // ctx.moveTo(x,y);
    ctx.arc(x, y, 35, 0, 2*Math.PI);

    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.closePath();

}

// uses board state to draw the X's and O's onto the canvas
function drawXOs() {
    for (i = 0; i <= 2; i++) {
        for (j = 0; j <= 2; j++) {
            // rect("black", 100*i, 100*j, 100, 100, 3);
            if (board[i][j] == 1) {
                drawX(playerColors[0], i, j);
            } else if (board[i][j] == -1) {
                drawO(playerColors[1], i, j);
            }
        }
    }
}


// coordinate conversion functions


// Map a click coordinate (CSS pixels) to board index 0..2.
// Use the canvas element's displayed size so clicks match visuals
// `axis` is 'x' or 'y' depending on which coordinate is being converted.
function CanvasCoordtoBoardCoord(c, axis = 'x') {
    const rect = canvas.getBoundingClientRect();
    const size = (axis === 'x') ? rect.width : rect.height;

    // scale the click coordinate to the 0..500 logical grid
    const scaled = c * (500 / size);
    let idx = Math.trunc(scaled / 100);
    idx--;
    if (idx < 0) return -1;
    return idx;
}

function BoardCoordtoCanvasCoord(c) {
    c++;
    c*=100;
    return c;
}

// -------------------------------------------------------------------------------------------
// GAME LOGIC


var gameModes = ["Plane", "Cylinder", "Mobius", "Torus", "Klein", "Projective"];
var gameMode = gameModes[0]; // default to plane mode
var numplayers = 2; // should only ever be 2 or 1
var aiDifficulties = ["random", "normal", "demon"];
var aiDifficulty = aiDifficulties[0];


var gameOver = false;

var board = [[0,0,0],[0,0,0],[0,0,0]];

// Used to determine which tile to place
var turnCount = 0;

function getTurn() {
    return (turnCount % 2 == 0 ? 0 : 1);
}

function setPlayerMode(num) {
    numplayers = (num>=2 ? 2 : 1);

    // styling of the button elements
    if (numplayers == 2) {
        document.getElementById("2p").classList.add("selected");
        document.getElementById("1p").classList.remove("selected");
        document.getElementById("aiDifficulty").style.display = "none";
    } else if (numplayers == 1) {
        document.getElementById("1p").classList.add("selected");
        document.getElementById("2p").classList.remove("selected");
        document.getElementById("aiDifficulty").style.display = "block";
    }
}

function setAiDifficulty(num) {
    aiDifficulty = aiDifficulties[num];
    if (num == 0) {
        document.getElementById("random").classList.add("selected");
        document.getElementById("normal").classList.remove("selected");
        document.getElementById("demon").classList.remove("selected");
    }
    else if (num == 1) {
        document.getElementById("random").classList.remove("selected");
        document.getElementById("normal").classList.add("selected");
        document.getElementById("demon").classList.remove("selected");
    } else if (num == 2) {
        document.getElementById("random").classList.remove("selected");
        document.getElementById("normal").classList.remove("selected");
        document.getElementById("demon").classList.add("selected");
    }

}


// Ex: given 9 -> [2,2] or 7 -> [0,2]
function getCoords(num) {
    num--; // makes it go to 0-indexing
    var column = num % 3;
    var row = Math.trunc(num / 3);
    return [column, row];
}


const planeWins = [
    // diagonals
    [1,5,9],
    [7,5,3],
    // horizontal lines
    [1,2,3],
    [4,5,6],
    [7,8,9],
    // vertical lines
    [1,4,7],
    [2,5,8],
    [3,6,9],
];

const cylinderWins = [
    // extra "diagonals" that now exists
    // pos slope
    [8,6,1],
    [9,4,2],
    //neg slope
    [2,6,7],
    [3,4,8]
];

const mobiusWins = [
    // New horizontal wins with the twist
    [9,1,2],
    [2,3,7],
    [3,7,8],
    [8,9,1],
    // new " twisted diagonals"
    [1,2,6],
    [2,3,4],
    [7,8,6],
    [4,8,9]
];

const kleinWins = [
    // horizontal wins with the mobius twist
    [9,1,2],
    [2,3,7],
    [3,7,8],
    [8,9,1],
    // "twisted diagonals" from mobius
    [1,2,6],
    [2,3,4],
    [7,8,6],
    [4,8,9],
    // Actually new klein wins
    [7,2,6],
    [4,8,3],
    [1,8,6],
    [2,9,4],
    // triangles?
    [5,9,7],
    [5,1,3]
];

const projectiveWins = [
    // horizontal wins with the mobius twist
    [9,1,2],
    [2,3,7],
    [3,7,8],
    [8,9,1],
    // "twisted diagonals" from mobius
    [1,2,6],
    [2,3,4],
    [7,8,6],
    [4,8,9],
    // New vertical wins with the top mobius twist
    [9,1,4],
    [4,7,3],
    [6,9,1],
    [7,3,6],
    // New diagonal things
    [6,8,3],
    [9,2,6],
    [2,4,7],
    [1,4,8]
];


// Takes an array of 3 board spots that are in a line i.e [1,5,9]
// returns the sum of the board of those positions
function lineScore(brd, arr) {
    var first = getCoords(arr[0]);
    var second = getCoords(arr[1]);
    var third = getCoords(arr[2]);
    return (brd[first[0]][first[1]] + brd[second[0]][second[1]] + brd[third[0]][third[1]]);
}

function searchForWin(brd) {
    // searches for wins

    // search through normal Plane win conditions
    for (line=0; line<planeWins.length; line++) {
        var lineSum = lineScore(brd, planeWins[line]);
        if (Math.abs(lineSum) == 3) {
            winningLine = planeWins[line];
            return [true, lineSum, winningLine];
        }
    }

    // search through Cylinder/Torus win conditions
    if (gameMode == gameModes[1] || gameMode == gameModes[3]) {
        for (line=0; line<cylinderWins.length; line++) {
            var lineSum = lineScore(brd, cylinderWins[line]);
            if (Math.abs(lineSum) == 3) {
                winningLine = cylinderWins[line];
                return [true, lineSum, winningLine];
            }
        }
    }

    // search through Mobius win conditions
    if (gameMode == gameModes[2]) {
        for (line=0; line<mobiusWins.length; line++) {
            var lineSum = lineScore(brd, mobiusWins[line]);
            if (Math.abs(lineSum) == 3) {
                winningLine = mobiusWins[line];
                return [true, lineSum, winningLine];
            }
        }
    }

    if (gameMode == gameModes[4]) {
        for (line=0; line<kleinWins.length; line++) {
            var lineSum = lineScore(brd, kleinWins[line]);
            if (Math.abs(lineSum) == 3) {
                winningLine = kleinWins[line];
                return [true, lineSum, winningLine];
            }
        }
    }

    if (gameMode == gameModes[5]) {
        for (line=0; line<projectiveWins.length; line++) {
            var lineSum = lineScore(projectiveWins[line]);
            if (Math.abs(lineSum) == 3) {
                winningLine = projectiveWins[line];
                return [true, lineSum, winningLine];
            }
        }
    }


    // check to see if the board is filled up for a tie
    if (isGridFull(brd)) {
        winningLine = [0,0,0];
        return [true, 0, winningLine];
    }
    return [false, 0, [0,0,0]];
}

function isGridFull(brd) {
    return brd.every(row => !row.includes(0));
}

function gameEnds(linescore, winArray) {
    // disable clicking on canvas
    canvas.removeEventListener('click', handleClick);
    gameOver = true;

    if (linescore==3) {
        drawWinnerText("X wins");
        highlightLine(highlightColors[0], winArray);
    }
    else if (linescore==-3) {
        drawWinnerText("O wins");
        highlightLine(highlightColors[1], winArray);
    }
    else if (linescore==0) {
        drawWinnerText("Tie");
    }
}

function highlightLine(color, arr) {
    var first = getCoords(arr[0]);
    var second = getCoords(arr[1]);
    var third = getCoords(arr[2]);

    highlightCell(color, first[0], first[1]);
    highlightCell(color, second[0], second[1]);
    highlightCell(color, third[0], third[1]);
}



// returns true if the board space is empty (0)
function isEmpty(brd, x,y) {
    return (brd[x][y] == 0);
}

canvas.addEventListener('click', handleClick );

function resetGame() {
    canvas.addEventListener('click', handleClick );
    turnCount = 0;
    console.log(`reset game. Game mode is ${gameMode}`);
    board = [[0,0,0],[0,0,0],[0,0,0]];
    gameOver = false;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    drawEverything();
}

function showNewGame() {
    const menu = document.getElementById("newGameMenu");
    if (menu.style.display===("none")) {
        menu.style.display = "block";
        if (numplayers == 2) {
            document.getElementById("2p").classList.add("selected");
        }
    } else {
        menu.style.display = "none";
    }
}

function newGame(n) {
    showNewGame();
    gameMode = gameModes[n];
    resetGame();
}

function insertPiece(brd, who, x, y) {
    if (who == 0) {
        brd[x][y] = 1;
        drawX(playerColors[0], x, y);
    } else if (who == 1) {
        brd[x][y] = -1;
        drawO(playerColors[1], x, y);
    }
}

function AIcanWin() {
    // brute force and see if adding O in any of the spots will result in O winning.
    // If so, then O should go in that spot

    let hypotheticalBoard = structuredClone(board);
    for (i = 0; i <= 2; i++) {
        for (j = 0; j <= 2; j++) {
            hypotheticalBoard = structuredClone(board);
            if (!isEmpty(hypotheticalBoard, i, j)) {
                insertPiece(hypotheticalBoard, getTurn(), i, j);
                let w = searchForWin(hypotheticalBoard);
                // if AI win found
                if (w[0]) {
                    return [i,j];
                }
            }
        }
    }
    return [false];
}

function getAImove() {
    let spot = [];
    // random moves
    if (aiDifficulty == aiDifficulties[0]) {
        spot = randomSpot();
        while (!isEmpty(board, spot[0], spot[1])) {
            spot = randomSpot();
        }
    }
    // normal difficulty
    if (aiDifficulty == aiDifficulties[1]) {
        if (AIcanWin()[0]) {
            spot = AIcanWin();
        } else {
            spot = randomSpot();
            while (!isEmpty(board, spot[0], spot[1])) {
                spot = randomSpot();
            }
        }
    }
    // demon difficulty
    if (aiDifficulty == aiDifficulties[2]) {
        spot = randomSpot();
        while (!isEmpty(board, spot[0], spot[1])) {
            spot = randomSpot();
        }
    }
    return spot;
}

function randomSpot() {
    return ([Math.floor(Math.random()*3), Math.floor(Math.random()*3)]);
}


function validateClickCoords(x,y) {
    return (CanvasCoordtoBoardCoord(x, 'x') >= 0 && CanvasCoordtoBoardCoord(x, 'x') <= 2 && CanvasCoordtoBoardCoord(y, 'y') >= 0 && CanvasCoordtoBoardCoord(y, 'y') <= 2);
}

function handleClick(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    const bx = CanvasCoordtoBoardCoord(x, 'x');
    const by = CanvasCoordtoBoardCoord(y, 'y');
    // debug print out the coordinates
    // console.log(`Clicked at coordinates: X=${x}, Y=${y}`);
    // console.log(`Clicked at board coordinates: X=${bx}, Y=${by}`);

    if (validateClickCoords(x,y) && isEmpty(board, bx,by)) {
        // 2-player mode
        if (numplayers == 2) {
            insertPiece(board, getTurn(), bx, by);
            w = searchForWin(board);
            if (w[0]) {
                gameEnds(w[1], w[2]);
            }
            turnCount++;
        }
        // 1-player mode
        else if (numplayers == 1) {
            // do x's turn
            insertPiece(board, getTurn(), bx, by);
            w = searchForWin(board);
            if (w[0]) {
                gameEnds(w[1], w[2]);
            }
            turnCount++;

            // do the computer's turn
            if (!isGridFull(board) && !gameOver) {
                let mv = getAImove();
                insertPiece(board, getTurn(), mv[0], mv[1]);
                w = searchForWin(board);
                if (w[0]) {
                    gameEnds(w[1], w[2]);
                }
                turnCount++;
            }
        }
    }
}



function resize() {
    const scale = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    // Get the visual size from CSS
    canvas.width = rect.width*scale;
    canvas.height = rect.height*scale;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    renderGame();
}

window.addEventListener('resize', resize);
resize();


function renderGame() {
    // scale the canvas drawings to fill the current canvas width and height (epic)
    ctx.setTransform(canvas.width/500, 0, 0, canvas.height/500, 0, 0);
    drawEverything();
}

function drawEverything() {
    drawGrid();
    drawArrows();
    drawXOs();
    drawGamemode();
}
