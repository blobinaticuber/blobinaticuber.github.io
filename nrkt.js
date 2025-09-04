

var inputMoves = [];
// adds the move from the input buttons
function addInput(move) {
    inputMoves.push(move);
    console.log(inputMoves);
    document.getElementById("moves").innerHTML = inputMoves.join(" ");
}

function deleteInput() {
    inputMoves.splice(-1)
    console.log(inputMoves);
    document.getElementById("moves").innerHTML = inputMoves.join(" ");
    if (inputMoves.join(" ") == []) {
        document.getElementById("moves").innerHTML = "Click the buttons below to input moves."
    }
}

function start() {
    while (!areArraysEqual(inputMoves, checkForRepeatedTurns(inputMoves))) {
        inputMoves = checkForRepeatedTurns(inputMoves);
    }
        
    console.log(inputMoves);
}

function flip(myArray) {

}

function simplifyMoves(arr) {
    // see if there are 2 U's or R's in a row or stuff
}

function areArraysEqual(arr1, arr2) {
  // Check if lengths are different
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Iterate and compare elements
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  // If all checks pass, arrays are equal
  return true;
}

function checkForRepeatedTurns(a) {
    for (i = 0; i < a.length-1; i++) {
        // check all the possible cases for R move repeats
        if (a[i] === "R" && a[i+1] === "R") {
            a.splice(i, 2, "R2");
        }
        else if (a[i] === "R'" && a[i+1] === "R'") {
            a.splice(i, 2, "R2");
        }
        else if (a[i] === "R'" && a[i+1] === "R") {
            a.splice(i, 2);
        }
        else if (a[i] === "R" && a[i+1] === "R'") {
            a.splice(i, 2);
        }
        else if (a[i] === "R2" && a[i+1] === "R") {
            a.splice(i, 2, "R'");
        }
        else if (a[i] === "R2" && a[i+1] === "R'") {
            a.splice(i, 2, "R");
        }
        else if (a[i] === "R" && a[i+1] === "R2") {
            a.splice(i, 2, "R'");
        }
        else if (a[i] === "R'" && a[i+1] === "R2") {
            a.splice(i, 2, "R");
        }
        else if (a[i] === "R2" && a[i+1] === "R2") {
            a.splice(i, 2);
        }
        // check all the possible cases for U move repeats
        else if (a[i] === "U" && a[i+1] === "U") {
            a.splice(i, 2, "U2");
        }
        else if (a[i] === "U'" && a[i+1] === "U'") {
            a.splice(i, 2, "U2");
        }
        else if (a[i] === "U'" && a[i+1] === "U") {
            a.splice(i, 2);
        }
        else if (a[i] === "U" && a[i+1] === "U'") {
            a.splice(i, 2);
        }
        else if (a[i] === "U2" && a[i+1] === "U") {
            a.splice(i, 2, "U'");
        }
        else if (a[i] === "U2" && a[i+1] === "U'") {
            a.splice(i, 2, "U");
        }
        else if (a[i] === "U" && a[i+1] === "U2") {
            a.splice(i, 2, "U'");
        }
        else if (a[i] === "U'" && a[i+1] === "U2") {
            a.splice(i, 2, "U");
        }
        else if (a[i] === "U2" && a[i+1] === "U2") {
            a.splice(i, 2);
        }
        
    }
    return a;
}