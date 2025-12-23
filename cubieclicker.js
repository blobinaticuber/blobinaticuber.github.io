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




const totalCubes = 43252003274489856000n;
var cubesSolved = 0n;

// time in seconds it takes to solve a cube
var solveTime = 5;

var numFriends = 0;



// name, desc, src, cost, func, id
const cubella_cubingGuide = {
    title: "Expert Cubing Guide",
    desc: "Speeds up solve time by 5%",
    imgsrc: "images/cubieclicker/instructions.png",
    divID: "cubing101",
    func: cubing101Clicked,
    cost: 2,
    maxUses: 8
};

const cubella_friend = {
    title: "Hire a friend",
    desc: "You teach your friend to solve just as fast as you",
    imgsrc: "images/cubieclicker/friend.png",
    divID: "friend",
    func: hireFriendClicked,
    cost: 10,
    maxUses: 10
};

var cubellaUpgrades = [cubella_cubingGuide, cubella_friend];

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
    // remove magic package and show cube and cubella
    var subbody = document.getElementById("subbody");
    var pkg = document.getElementById("magicPackage");
    subbody.removeChild(pkg);

    document.getElementById("cubeCounter").after(cubeButton());

    var r = document.getElementById("rightsubbody");
    r.appendChild(cubella());
    updateCubellaItemState();
}

// makes cubella store UI on the right
function cubella() {
    var d = divClasses("frosted");
    d.appendChild(pTag("Cubella - Level 1"));

    var d2 = divClasses("flexbox center");

    var cubellaImg = document.createElement("img");
    cubellaImg.src = "images/cubieclicker/cubella_0.png";
    cubellaImg.width = 200;
    cubellaImg.height = 200;
    d2.appendChild(cubellaImg);
    d2.appendChild(pTag("I am Cubella! My magical powers will increase based on how many cubes you have solved! I have a few ideas to speed up the process:"));
    d.appendChild(d2);

    // adds each cubella upgrade to the div
    for (var i = 0; i < cubellaUpgrades.length; i++) {
        d.appendChild(addCubellaItem(cubellaUpgrades[i].title, cubellaUpgrades[i].desc, cubellaUpgrades[i].imgsrc, cubellaUpgrades[i].cost, cubellaUpgrades[i].func, cubellaUpgrades[i].divID));
    }

    return d;
}

function formatCost(cost) {
    return (cost > 1 ? `Cost: scrambles ${cost} cubes` : `Cost: scrambles ${cost} cube`);
}

function cubing101Clicked() {
    if (cubesSolved >= BigInt(cubellaUpgrades[0].cost)) {
        solveTime *= 0.95;

        document.getElementById("solveTimeDisplay").innerHTML = `Solve time: ${Math.trunc(solveTime * 10) / 10}s`;
        cubesSolved = cubesSolved - 2n;
        updateCubeCount();
    }
}

function hireFriendClicked() {
    if (cubesSolved >= BigInt(cubellaUpgrades[1].cost)) {
        if (numFriends == 0) {
            // initial setup (add automations menu)
            var l = document.getElementById("leftsubbody");
            l.appendChild(automations());
            document.getElementById("automations").appendChild(friendAutomation());
        }
        numFriends++;
        cubesSolved = cubesSolved - BigInt(cubellaUpgrades[1].cost);
        updateCubeCount();
        updateFriendAutomation();
        addCubesFromFriends();
    }
}

function automations() {
    var d = divClasses("frosted");
    d.id = "automations";
    d.appendChild(pTag("Automations"));

    return d;
}

function friendAutomation() {
    var d = divClasses("frosted");
    d.appendChild(pTag("Friends"));

    var d2 = divClasses("flexbox");

    var i = document.createElement("img");
    i.src = "images/cubieclicker/friend.png";
    i.width = 100;
    i.height = 100;
    d2.appendChild(i);

    var p = pTag(`${numFriends} friends, solving ${numFriends/solveTime} cubes per second`);
    p.id = "friendAutomationCount";

    d2.appendChild(p);
    d.appendChild(d2);
    return d;
}

function updateFriendAutomation() {
    var f = document.getElementById("friendAutomationCount");
    f.innerText = `${numFriends} friends, solving ${numFriends/solveTime} cubes per second`;
}

function addCubesFromFriends() {
    cubesSolved = cubesSolved + BigInt(1);
    updateCubeCount();
    update333Image();
    setTimeout(addCubesFromFriends, solveTime*1000/numFriends);
}

function addCubellaItem(name, desc, src, cost, func, id) {
    var d = divClasses("frosted");
    d.appendChild(pTag(name));
    d.id = id;

    var d2 = divClasses("flexbox");

    var i = document.createElement("img");
    i.src = src;
    i.width = 100;
    i.height = 100;
    d.onclick = func;
    d2.appendChild(i);

    var d3 = divClasses();
    d3.appendChild(pTag(desc));
    d3.appendChild(pTag(formatCost(cost)));
    d2.appendChild(d3);
    d.appendChild(d2);
    return d;
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

function updateCubellaItemState() {
    // update the cubella upgrade divs
    for (var i = 0; i < cubellaUpgrades.length; i++) {
        if (cubesSolved >= cubellaUpgrades[i].cost) {
            document.getElementById(cubellaUpgrades[i].divID).classList.remove("tooexpensive");
            document.getElementById(cubellaUpgrades[i].divID).classList.add("canbuy");
        } else {
            document.getElementById(cubellaUpgrades[i].divID).classList.remove("canbuy");
            document.getElementById(cubellaUpgrades[i].divID).classList.add("tooexpensive");
        }
    }
}

function updateCubeCount() {
    var v = document.getElementById("cubeCount");
    v.innerText = (`${bigIntFormat(cubesSolved)}`);

    updateCubellaItemState();
}

function cubeButton() {
    var d = divClasses("center frosted");

    var timerdiv = document.createElement("div");
    timerdiv.id = "timerDiv";
    var timerprogress = document.createElement("div");
    timerprogress.id = "timerBar";

    timerdiv.appendChild(timerprogress);
    d.appendChild(timerdiv);

    var st = pTag(`Solve time: ${solveTime}s`);
    st.id = "solveTimeDisplay"
    d.appendChild(st);

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
    // disable clicking on the cube during a solve
    document.getElementById("cubeimg").onclick = null;

    const s = solveTime;

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
            w += 1/s/60*100;
            tb.style.width = w + '%';
        }
    }
}
