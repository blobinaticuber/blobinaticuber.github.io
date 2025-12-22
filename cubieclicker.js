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

function pCodeTag(str) {
    var p = document.createElement("p");
    var c = document.createElement("code");
    c.innerText = str;
    p.appendChild(c);
    return p;
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



var cubellaUnlocked = false;


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


    // subbody.appendChild(titleAndButtons());
    subbody.appendChild(cubeCountDisplay());
    subbody.appendChild(magicPackage());
}

function titleAndButtons() {
    var d3 = divClasses("flexbox space-between");
    var left = divClasses("flexbox center");
    left.appendChild(h1Tag("Cubie Clicker"));
    left.appendChild(pCodeTag("v0.0.3"));
    d3.appendChild(left);

    var right = divClasses("flexbox center");
    var d4 = divClasses("flexbox frosted");
    d4.appendChild(pTag("Settings"));
    right.appendChild(d4);
    var d5 = divClasses("flexbox frosted");
    d5.appendChild(pTag("About"));
    right.appendChild(d5);
    d3.appendChild(right);
    return d3;
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
    // subbody.appendChild(cubeButton());
    // don't let them click the cube yet because they don't know how to solve it
    // show the inventory of the package
    subbody.appendChild(packageInventory());
}

function instructionManual() {
    var d3 = divClasses("frosted");
    d3.appendChild(pTag("Instruction manual"));
    d3.id = "instructionManualContainer";
    var instructionManualImg = document.createElement("img");
    instructionManualImg.onclick = instructionManualClicked;
    instructionManualImg.src = "images/cubieclicker/instructions.png";
    d3.appendChild(instructionManualImg);
    d3.appendChild(pTag("- Teaches you how to solve"));
    return d3;
}

function CubeCreature() {
    var d3 = divClasses("frosted");
    d3.appendChild(pTag("Strange Creature"));
    d3.id = "cubeCreatureContainer";
    var cubellaImg = document.createElement("img");
    cubellaImg.onclick = CubeCreatureClicked;
    cubellaImg.src = "images/cubieclicker/cubella_0.png";
    cubellaImg.width = 200;
    cubellaImg.height = 200;
    d3.appendChild(cubellaImg);
    d3.appendChild(pTag("- ???????????????????"));
    return d3;
}

function CubeCreatureClicked() {
    cubellaUnlocked = true;
    document.getElementById("cubeCreatureContainer").remove();
    if (canSolve) {
        document.getElementById("packageInventory").remove();
    }

    var r = document.getElementById("rightsubbody");
    r.appendChild(cubella());
}

// makes cubella UI on the right
function cubella() {
    var d3 = divClasses("frosted");
    d3.appendChild(pTag("Cubella - Level 1"));
    var cubellaImg = document.createElement("img");
    cubellaImg.src = "images/cubieclicker/cubella_0.png";
    cubellaImg.width = 200;
    cubellaImg.height = 200;
    d3.appendChild(cubellaImg);
    return d3;
}

function packageInventory() {
    var d = divClasses("frosted");
    d.id = "packageInventory";
    d.appendChild(pTag("Contents of Magical package"));

    var d2 = divClasses("flexbox center");
    d2.appendChild(instructionManual());
    d2.appendChild(CubeCreature());

    d.appendChild(d2);
    return d;
}

function instructionManualClicked() {
    // remove manual from package contents
    document.getElementById("instructionManualContainer").remove();
    // show the rubik's cube clicker button
    document.getElementById("cubeCounter").after(cubeButton());
    // remove block on solve
    canSolve = true;

    if (cubellaUnlocked) {
        document.getElementById("packageInventory").remove();
    }
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
    d.id = "cubeCounter";

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
    var d = divClasses("center frosted");

    var timerdiv = document.createElement("div");
    timerdiv.style = "width:100%; height:24px; border-radius: 25px; border: 2px solid white;";
    var timerprogress = document.createElement("div");
    timerprogress.id = "timerBar";
    timerprogress.style = "width:0%; height:24px; background-color: #1c9124ff; border-radius: 25px;";

    timerdiv.appendChild(timerprogress);
    d.appendChild(timerdiv);

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
        // disable clicking on the cube during a solve
        document.getElementById("cubeimg").onclick = null;

        var tb = document.getElementById("timerBar");
        var w = 0;
        var id = setInterval(frame, 10);
        // call this every 10 milliseconds (0.01) seconds
        function frame() {
            if (w >= 100) {
            clearInterval(id);
            cubesSolved = cubesSolved + 1n;
            updateCubeCount();
            update333Image();
            document.getElementById("cubeimg").onclick = cubeClicked;
            tb.style.width = 0 + '%';
            } else {
            w += 1/solveTime/60*100;
            tb.style.width = w + '%';
            }
        }



    }
}
