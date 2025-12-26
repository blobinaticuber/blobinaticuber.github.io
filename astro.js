const stars1 = document.getElementById("stars");
const stars2 = document.getElementById("stars2");
const stars3 = document.getElementById("stars3");



function addStars(name) {

    var starstring = "";

    for (var i = 0; i < 100; i++) {
        var random1 = Math.trunc(Math.random()*window.innerWidth);
        var random2 = Math.trunc(Math.random()*4000);
        starstring += `${random1}px ${random2}px #FFF , `;
    }
    starstring = starstring.slice(0,-2);
    name.style.boxShadow = starstring;
}

addStars(stars1);
addStars(stars2);
addStars(stars3);
