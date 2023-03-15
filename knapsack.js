"use strict";
let weights = [3, 1, 4, 3, 5, 5, 3, 1, 2, 3];
let vals = [10, 2, 3, 4, 9, 2, 7, 6, 9, 5];
let numItems = weights.length;
let weightLimit = 10;

let bestVal = 0;
let abestVal = 0;
let outsideSet = new Set();

(function(){


let row = 1;
let col = 0;
let maxValue = null;
let used = null;
let waiting_time = 5000;
let animationRuns;

window.addEventListener("load", knapsackInit);

async function playAlgorithm() {
    if (animationRuns) {
        return;
    }
    let slider = document.getElementById("myRange");

    animationRuns = true;
    while (knapsackStep()) {
        waiting_time = 5000 / slider.value;
        console.log("waiting_time " + waiting_time);
        if (animationRuns) {
            await sleep(waiting_time); 
        } else {
            break;
        }
    }
}

async function pauseAlgorithm() {
    animationRuns = false;
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms)); 
}

function knapsackInit() {
    initTableWeightsValuesCol();
    // create 2d array (weightLimit+1) x (numItems+1)
    maxValue = new Array(numItems + 1);
    for (let i = 0; i <= numItems; i++) {
        maxValue[i] = new Array(weightLimit + 1).fill(0);
    }
    used = new Array(numItems + 1);
    for (let i = 0; i <= numItems; i++) {
        used[i] = new Array(weightLimit + 1).fill(0);
    }


    for (let i = 0; i <= numItems; i++) {
        for (let j = 0; j < maxValue[i].length; j++) {
            document.getElementById(i + ',' + j).innerHTML = maxValue[i][j];
        }
    }
    document.getElementById("start").onclick = playAlgorithm;
    document.getElementById("step").onclick = knapsackStep;
    document.getElementById("pause").onclick = pauseAlgorithm;
    document.getElementById("reset").onclick = resetAnimation;
}


function initTableWeightsValuesCol() {
    document.getElementById("w0").innerHTML = "-";
    console.log("initTableWeightsCol");
    for (let i = 1; i <= 10; i++) {
        document.getElementById("w" + i).innerHTML = weights[i-1];
        document.getElementById("v" + i).innerHTML = vals[i-1];
    }
}

function resetAnimation() {
    knapsackInit();

    removeLineIfExists("topZoomLine");
    removeLineIfExists("bottomZoomLine");

    let cells = document.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; i++) {
        cells[i].style.borderWidth = "1px";
        cells[i].style.backgroundColor = "white";
    }

    row = 1;
    col = 0;
    abestVal = 0;
    let numChildren = document.getElementById('ainside').childElementCount;
    for (let i = 0; i < numChildren; i++) {
        putOutside(document.getElementById('ainside').firstChild, false);
    }
    updateKnapsackText(false);

    animationRuns = false;
}


async function knapsackStep() {
    console.log('maxValue.length ' + maxValue.length);
    console.log('maxValue[0].length ' + maxValue[0].length);

    if (row >= maxValue.length) {
        console.log("check");
        return false;
    }
    console.log("row " + row);
    console.log("col " + col);

    let cells = document.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; i++) {
        cells[i].style.borderWidth = "1px";
    }

    removeLineIfExists("topZoomLine");
    removeLineIfExists("bottomZoomLine");

    if (weights[row - 1] > col) {
        maxValue[row][col] = maxValue[row - 1][col];
        used[row][col] = 0;
    } else if (maxValue[row-1][col] > maxValue[row - 1][col - weights[row - 1]] + vals[row - 1]) {
        maxValue[row][col] = maxValue[row - 1][col];
        used[row][col] = 0;
    } else {
        maxValue[row][col] = maxValue[row - 1][col - weights[row - 1]] + vals[row - 1];
        used[row][col] = 1;
    }

    let rowM = row;
    let colM = col;
    let chosenIndices = [];
    let chosenVals = [];
    while (rowM > 0 && colM > 0) {
        if (used[rowM][colM] == 1) {
            chosenIndices.push(rowM-1);
            chosenVals.push({
                'value': vals[rowM-1],
                'weight': weights[rowM-1]
            });
            colM -= weights[rowM-1];
        }
        rowM--;
    }


    document.getElementById(row + ',' + col).innerHTML = maxValue[row][col];

    let cell = document.getElementById(row + ',' + col);
    cell.style.backgroundColor = "#90EE90";
    cell.style.borderColor = "black";
    cell.style.borderWidth = "5px";
    let rect = cell.getBoundingClientRect();
    let xLeft = rect.left + window.pageXOffset;
    let yTop = rect.top + window.pageYOffset;
    let xRight = xLeft + (rect.width || cell.offsetWidth);
    let yBot = yTop + (rect.height || cell.offsetHeight);

    let knapsack = document.getElementById('aknapsack');
    let arect = knapsack.getBoundingClientRect();
    let axLeft = arect.left + window.pageXOffset;
    let ayTop = arect.top + window.pageYOffset;
    let axRight = axLeft + (arect.width || knapsack.offsetWidth);
    let ayBot = ayTop + (arect.height || knapsack.offsetHeight);

    drawLine(xLeft, yTop, axLeft, ayTop, "topZoomLine", {"color": "black", thickness: 5});
    drawLine(xLeft, yBot, axLeft, ayBot, "bottomZoomLine", {"color": "black", thickness: 5});

    let prevCellNotUsed = document.getElementById((row-1) + "," + col);
    prevCellNotUsed.style.borderWidth = "5px";
    prevCellNotUsed.style.borderColor = "gray";

    if (col - weights[row-1] >= 0) {
        let prevCellUsed = document.getElementById((row-1) + "," + (col-weights[row-1]));
        prevCellUsed.style.borderWidth = "5px";
        prevCellUsed.style.borderColor = "gray";
    }

    if (col < maxValue[0].length - 1) {
        col++;
    } else {
        col = 0;
        row++;
    }

    for (let i = 0; i < numItems; i++) {
        let aitemId = "aitem" + i;
        let aitem = document.getElementById(aitemId);
        if (!chosenIndices.includes(i)) {
            if (!outsideSet.has(aitem)) {
                putOutside(aitem, false);
                outsideSet.add(aitem);
            }
        }
    }

    for (let i = 0; i < chosenIndices.length; i++) {
        let aitemId = "aitem" + chosenIndices[i];
        let aitem = document.getElementById(aitemId);
        if (outsideSet.has(aitem)) {
            putInside(aitem, false);
            outsideSet.delete(aitem);
        }
    }

    return true;
}

})();