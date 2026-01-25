
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


const planeWins = [
    // diagonals
    [[0,0],[1,1],[2,2]],
    [[0,2],[1,1],[2,0]],
    // horizontals
    [[0,0],[0,1],[0,2]],
    [[1,0],[1,1],[1,2]],
    [[2,0],[2,1],[2,2]],
    // verticals
    [[0,0],[1,0],[2,0]],
    [[0,1],[1,1],[2,1]],
    [[0,2],[1,2],[2,2]]
];

const cylinderWins = [
    // extra "diagonals" that now exists
    // pos slope
    [[0,2],[1,1],[2,0]],
    [[1,2],[2,1],[0,0]],
    [[2,2],[0,1],[1,0]],
    // neg slope
    [[2,2],[1,1],[0,0]],
    [[1,2],[0,1],[2,0]],
    [[0,2],[2,1],[1,0]]
];

const mobiusWins = [

];

function findWin() {
    // console.log(`searching ${gameModes[gameMode]} wins`);
    // searches for wins
    var potentialWinCoords = [[[]]];

    // search through normal Plane win conditions
    for (w=0; w<planeWins.length; w++) {
        // linescore is the sum of pieces in a winning line (3 means X win, -3 means O win, anything else is not a win)
        potentialWinCoords = planeWins[w];
        var linescore = board[planeWins[w][0][0]][planeWins[w][0][1]] + board[planeWins[w][1][0]][planeWins[w][1][1]] + board[planeWins[w][2][0]][planeWins[w][2][1]];
        if (Math.abs(linescore) == 3) {
            gameEnds(linescore, potentialWinCoords);
            return;
        }
        if (linescore == -3) {
            gameEnds(linescore, potentialWinCoords);
            return;
        }
    }

    // search through additional Cylinder win conditions
    if (gameMode == gameModes[1]) {
        for (w=0; w<cylinderWins.length; w++) {
            // linescore is the sum of pieces in a winning line (3 means X win, -3 means O win, anything else is not a win)
            potentialWinCoords = cylinderWins[w];
            var linescore = board[cylinderWins[w][0][0]][cylinderWins[w][0][1]] + board[cylinderWins[w][1][0]][cylinderWins[w][1][1]] + board[cylinderWins[w][2][0]][cylinderWins[w][2][1]];
            if (Math.abs(linescore) == 3) {
                gameEnds(linescore, potentialWinCoords);
                return;
            }
            if (linescore == -3) {
                gameEnds(linescore, potentialWinCoords);
                return;
            }
        }
    }


    // check to see if the board is filled up for a tie
    const isGridFull = () => board.every(row => !row.includes(0));
    if (isGridFull()) {
        gameEnds(0, potentialWinCoords);
    }
}

function gameEnds(state, winArray) {
    // disable clicking on canvas
    canvas.removeEventListener('click', handleClick);
    if (state==3) {
        drawWinnerText("X wins");
        highlightCell(highlightColors[0], winArray[0][0], winArray[0][1]);
        highlightCell(highlightColors[0], winArray[1][0], winArray[1][1]);
        highlightCell(highlightColors[0], winArray[2][0], winArray[2][1]);
    }
    else if (state==-3) {
        drawWinnerText("O wins");
        highlightCell(highlightColors[1], winArray[0][0], winArray[0][1]);
        highlightCell(highlightColors[1], winArray[1][0], winArray[1][1]);
        highlightCell(highlightColors[1], winArray[2][0], winArray[2][1]);
    }
    else if (state==0) {
        drawWinnerText("Tie");
    }
}

var board = [[0,0,0],[0,0,0],[0,0,0]];

// returns true if the board space is empty (0)
function isEmpty(x,y) {
    return (board[x][y] == 0);
}

canvas.addEventListener('click', handleClick );

var clickCount = 0;

function resetGame() {
    canvas.addEventListener('click', handleClick );
    clickCount = 0;
    console.log("reset game");
    board = [[0,0,0],[0,0,0],[0,0,0]];

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    drawGrid();
    drawArrows();
    drawGamemode();
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
    console.log(`Clicked at coordinates: X=${x}, Y=${y}`);
    console.log(`Clicked at board coordinates: X=${bx}, Y=${by}`);
    if (validateClickCoords(x,y) && isEmpty(bx,by)) {
        if (clickCount%2==0) {
            board[bx][by] = 1;
            drawX(playerColors[0], bx, by);
        }
        else {
            board[bx][by] = -1;
            drawO(playerColors[1], bx, by);
        }
        findWin();
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
    drawGrid();
    drawArrows();
    drawXOs();
    drawGamemode();
}
