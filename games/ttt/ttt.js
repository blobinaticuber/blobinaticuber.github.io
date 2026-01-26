
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
        // console.log("game mode: " + gameMode);
        // draw cylinder arrows
        // (2 arrows on the left and right side pointing up)
        drawArrow("green", [100,300], [100,200], "up");
        drawArrow("green", [400,300], [400,200], "up");
    }
    if (gameMode == gameModes[2]) {
        // mobius
        drawArrow("green", [100,200], [100,300], "down");
        drawArrow("green", [400,300], [400,200], "up");
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

function CanvasCoordtoBoardCoord(c) {
    // scale the click coordinate to be based on a 500x500 grid
    c/=(canvas.height/500);
    c-=50;
    if (c<0) return -1;
    c=Math.trunc(c/100);
    return c;
}

function BoardCoordtoCanvasCoord(c) {
    c++;
    c*=100;
    return c;
}

// -------------------------------------------------------------------------------------------
// GAME LOGIC


var gameModes = ["Plane", "Cylinder", "Mobius"];
var gameMode = gameModes[0]; // default to plane mode

var board = [[0,0,0],[0,0,0],[0,0,0]];

// Used to determine which tile to place
var clickCount = 0;


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


// Takes an array of 3 board spots that are in a line i.e [1,5,9]
// returns the sum of the board of those positions
function lineScore(arr) {
    var first = getCoords(arr[0]);
    var second = getCoords(arr[1]);
    var third = getCoords(arr[2]);
    return (board[first[0]][first[1]] + board[second[0]][second[1]] + board[third[0]][third[1]]);
}

function searchForWin() {
    // searches for wins

    // search through normal Plane win conditions
    for (line=0; line<planeWins.length; line++) {
        var lineSum = lineScore(planeWins[line]);
        if (Math.abs(lineSum) == 3) {
            winningLine = planeWins[line];
            gameEnds(lineSum, winningLine);
            return;
        }
    }

    // search through Cylinder win conditions
    if (gameMode == gameModes[1]) {
        for (line=0; line<cylinderWins.length; line++) {
            var lineSum = lineScore(cylinderWins[line]);
            if (Math.abs(lineSum) == 3) {
                winningLine = cylinderWins[line];
                gameEnds(lineSum, winningLine);
                return;
            }
        }
    }

    // search through Mobius win conditions
    if (gameMode == gameModes[2]) {
        for (line=0; line<mobiusWins.length; line++) {
            var lineSum = lineScore(mobiusWins[line]);
            if (Math.abs(lineSum) == 3) {
                winningLine = mobiusWins[line];
                gameEnds(lineSum, winningLine);
                return;
            }
        }
    }


    // check to see if the board is filled up for a tie
    const isGridFull = () => board.every(row => !row.includes(0));
    if (isGridFull()) {
        winningLine = [0,0,0];
        gameEnds(0, winningLine);
    }
}

function gameEnds(linescore, winArray) {
    // disable clicking on canvas
    canvas.removeEventListener('click', handleClick);

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
function isEmpty(x,y) {
    return (board[x][y] == 0);
}

canvas.addEventListener('click', handleClick );

function resetGame() {
    canvas.addEventListener('click', handleClick );
    clickCount = 0;
    console.log(`reset game. Game mode is ${gameMode}`);
    board = [[0,0,0],[0,0,0],[0,0,0]];

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    drawEverything();
}

function showNewGame() {
    const menu = document.getElementById("newGameMenu");
    if (menu.style.display===("none")) {
        menu.style.display = "block";
    } else {
        menu.style.display = "none";
    }
}

function newPlane() {
    showNewGame();
    gameMode = gameModes[0];
    resetGame();

}

function newCylinder() {
    showNewGame();
    gameMode = gameModes[1];
    resetGame();
}

function newMobius() {
    showNewGame();
    gameMode = gameModes[2];
    resetGame();
}


function validateClickCoords(x,y) {
    return (CanvasCoordtoBoardCoord(x)>=0 && CanvasCoordtoBoardCoord(x) <=2 && CanvasCoordtoBoardCoord(y)>=0 && CanvasCoordtoBoardCoord(y)<=2);
}

function handleClick(event) {

    const x = event.offsetX;
    const y = event.offsetY;
    const bx = CanvasCoordtoBoardCoord(x);
    const by = CanvasCoordtoBoardCoord(y);
    // debug print out the coordinates
    // console.log(`Clicked at coordinates: X=${x}, Y=${y}`);
    // console.log(`Clicked at board coordinates: X=${bx}, Y=${by}`);
    if (validateClickCoords(x,y) && isEmpty(bx,by)) {
        if (clickCount%2==0) {
            board[bx][by] = 1;
            drawX(playerColors[0], bx, by);
        }
        else {
            board[bx][by] = -1;
            drawO(playerColors[1], bx, by);
        }
        searchForWin();
        clickCount++;
    }


}

const scale = window.devicePixelRatio || 1;

function resize() {
    // Get the visual size from CSS
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.9;

    // Set the internal resolution
    canvas.width = Math.floor(size * scale);
    canvas.height = Math.floor(size * scale);

    // Scale the drawing context so 1 unit = 1 CSS pixel
    ctx.scale(scale, scale);

    renderGame();
}

window.addEventListener('resize', resize);
resize();


function renderGame() {
    // scale the canvas drawingsto fill the current canvas width and height (epic)
    ctx.scale(canvas.width/500, canvas.height/500);
    drawEverything();
}

function drawEverything() {
    drawGrid();
    drawArrows();
    drawXOs();
    drawGamemode();
}
