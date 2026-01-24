
// SETUP AND DRAWING LOGIC

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#FFFFFF";
ctx.fillRect(0,0,canvas.clientWidth, canvas.clientHeight);

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
    ctx.fillRect(0,0,canvas.clientWidth, canvas.clientHeight);
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

// Arguments are in game board coords [0][0]...[2][2]
function drawX(color, x, y) {
    // convert game board coords to canvas drawing coords
    x = BoardCoordtoCanvasCoord(x);
    x += -50;
    y = BoardCoordtoCanvasCoord(y);
    y += -50;

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
    x += -50;
    y = BoardCoordtoCanvasCoord(y);
    y += -50;

    ctx.beginPath();

    // ctx.moveTo(x,y);
    ctx.arc(x, y, 35, 0, 2*Math.PI);

    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.closePath();

}

drawGrid();


function CanvasCoordtoBoardCoord(c) {
    c+=-100;
    if (c/100<0) return -1;
    c=Math.trunc(c/100);
    return c;
}

function BoardCoordtoCanvasCoord(c) {
    c++;
    c*=100;
    c+=100;
    return c;
}

// GAME LOGIC

var board = [[0,0,0],[0,0,0],[0,0,0]];

// returns true if the board space is empty (0)
function isEmpty(x,y) {
    return (board[y][x] == 0);
}

canvas.addEventListener('click', function(event) {
    handleClick(event);
}, false);

var clickCount = 0;

function resetGame() {
    clickCount = 0;
    console.log("reset game");
    board = [[0,0,0],[0,0,0],[0,0,0]];
    console.log(board);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    drawGrid();
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
            board[by][bx] = 1;
            drawX("red", bx, by);
        }
        else {
            board[by][bx] = -1;
            drawO("blue", bx, by);
        }
        clickCount++;
        console.log(board);
    }


}
