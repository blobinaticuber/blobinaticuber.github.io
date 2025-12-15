// CODE FOR THE BACKGROUND EFFECT SET UP
const stickers1 = document.getElementById("stickers");

const cubeColours = ["#f1f1f1ff", "#ffff00", "#FF0000", "#00FF00", "#0000FF", "#FFA500"];

var stickersColours = [];
var stickerX = [];
var stickerY = [];
var stickerXvelocity = [];
var stickerYvelocity = [];

function initializeBG() {
    stickers1.style.boxShadow = "";
    var stickerstring = "";
    for (var i = 0; i < 30; i++) {
        stickerX[i] = Math.trunc(Math.random()*(window.innerWidth-200))+100;
        stickerY[i] = Math.trunc(Math.random()*(window.innerHeight-200))+100;
        stickerXvelocity[i] = Math.random()-0.5;
        stickerYvelocity[i] = Math.random()-0.5;
        stickersColours[i] = cubeColours[Math.trunc(Math.random()*cubeColours.length)];
        stickerstring += `${stickerX[i]}px ${stickerY[i]}px ${stickersColours[i]} , `;
    }
    stickerstring = stickerstring.slice(0,-2);
    stickers1.style.boxShadow = stickerstring;
}

function updateStickers() {
    stickers1.style.boxShadow = "";
    var stickerstring = "";
    for (var i = 0; i < 30; i++) {
        // invert velocity if goes off screen
        if (stickerX[i] + stickerXvelocity[i] > window.innerWidth-50 || stickerX[i] + stickerXvelocity[i] < 0) {
            stickerXvelocity[i] = -stickerXvelocity[i];
        }
        if (stickerY[i] + stickerYvelocity[i] > window.innerHeight-50 || stickerY[i] + stickerYvelocity[i] < 0) {
            stickerYvelocity[i] = -stickerYvelocity[i];
        }
        stickerX[i] += stickerXvelocity[i];
        stickerY[i] += stickerYvelocity[i];
        stickerstring += `${stickerX[i]}px ${stickerY[i]}px ${stickersColours[i]} , `;
    }
    stickerstring = stickerstring.slice(0,-2);
    stickers1.style.boxShadow = stickerstring;
}

initializeBG();
setInterval(updateStickers, 33);


// CODE FOR THE GAME LOGIC
