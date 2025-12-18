import { getScrambles, genImages, setSeed, getSeed } from 'https://esm.sh/cubicdb-module';



// -------------------------------------------------------------------------------------------
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



// -------------------------------------------------------------------------------------------
// CODE FOR THE UI stuff

function pTag(str) {
    var text = document.createElement("p");
    text.innerText = str;
    return text;
}

function h1Tag(str) {
    var text = document.createElement("h1");
    text.innerText = str;
    return text;
}

function divClasses(cl) {
    var d = document.createElement("div");
    d.classList = cl;
    return d;
}



// -------------------------------------------------------------------------------------------
// CODE FOR THE GAME LOGIC



const totalCubes = 43252003274489856000n;
var cubesSolved = 0n;

// time in seconds it takes to solve a cube
var solveTime = 45;

var canSolve = false;

const btn = document.getElementById('start-game-btn');
btn.addEventListener('click', startGame);

function startGame() {
    document.getElementById("intro-text").remove();

    var subbody = document.getElementById("subbody");
    subbody.appendChild(cubeCountDisplay());
    subbody.appendChild(magicPackage());
}

function magicPackage() {
    var d = divClasses("frosted");
    d.appendChild(pTag("Magical Package"));
    d.id = "magicPackage";

    var d2 = divClasses("flexbox center");

    var boximg = document.createElement("img");
    boximg.id = "boximg";
    boximg.onclick = magicPackageClicked;
    boximg.src = "images/cubieclicker/magicpackage.png";
    d2.appendChild(boximg);
    d.appendChild(d2);
    return d;
}

function magicPackageClicked() {
    // remove magic package and show cube
    var subbody = document.getElementById("subbody");
    var pkg = document.getElementById("magicPackage");
    subbody.removeChild(pkg);
    subbody.appendChild(cubeButton());
    // don't let them click the cube yet because they don't know how to solve it
    // show the inventory of the package
    subbody.appendChild(packageInventory());
}

function packageInventory() {
    var d = divClasses("frosted");
    d.id = "packageInventory";
    d.appendChild(pTag("Contents of Magical package"));

    var d2 = divClasses("flexbox center");

    var d3 = divClasses("frosted");
    d3.appendChild(pTag("Instruction manual"));
    d3.id = "instructionManualContainer";
    var instructionManualImg = document.createElement("img");
    instructionManualImg.onclick = instructionManualClicked;
    instructionManualImg.src = "images/cubieclicker/instructions.png";
    d3.appendChild(instructionManualImg);
    d3.appendChild(pTag("- Teaches you how to solve"));

    d2.appendChild(d3);

        // d2.appendChild(pTag("Magical Crystal"));
        // d2.appendChild(pTag("Instruction manual"));

    d.appendChild(d2);
    return d;
}

function instructionManualClicked() {
    // remove manual from package contents
    document.getElementById("instructionManualContainer").remove();
    // remove block on solve
    canSolve = true;
}

// convert bigInt into readable number with commas
function bigIntFormat(bi) {
    var str = bi.toString();
    str = str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str;
}

// HTML element that displays the cube count
function cubeCountDisplay() {
    var d = divClasses("frosted");
    d.appendChild(pTag("Rubik's Cubes solved"));

    var d2 = divClasses("flexbox center");

    var num = h1Tag(`${bigIntFormat(cubesSolved)}`);
    num.id = "cubeCount";
    d2.appendChild(num);
    d2.appendChild(pTag(`/ ${bigIntFormat(totalCubes)}`));
    d.appendChild(d2);
    return d;
}

function updateCubeCount() {
    var v = document.getElementById("cubeCount");
    v.innerText = (`${bigIntFormat(cubesSolved)}`);
}

function cubeButton() {
    var d = document.createElement("div");
    d.classList = "flexbox center frosted";
    var cubeimg = document.createElement("div");
    cubeimg.id = "cubeimg";
    cubeimg.onclick = cubeClicked;
    cubeimg.appendChild(newScrambled333Image());
    d.appendChild(cubeimg);
    return d;
}

function newScrambled333Image() {
    var scrambles = getScrambles([
        { scrambler: "333", image: true},
    ]);
    var svgString = scrambles[0].image;
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
    const svgElement = svgDoc.documentElement;
    return svgElement;
}

function update333Image() {
    document.getElementById("cubeimg").replaceChildren();
    document.getElementById("cubeimg").appendChild(newScrambled333Image());
}


function cubeClicked() {
    if (canSolve) {
        cubesSolved = cubesSolved + 1n;
        updateCubeCount();
        update333Image();
    }
}
