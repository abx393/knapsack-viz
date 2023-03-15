async function drawLine(xLeft, yTop, axLeft, ayTop, lineId, props) {
    let thickness = props.thickness;
    let color = props.color;
    let length = Math.sqrt(((axLeft-xLeft) * (axLeft-xLeft)) + ((ayTop-yTop) * (ayTop-yTop)));
    // center
    let cx = ((xLeft + axLeft) / 2) - (length / 2);
    let cy = ((yTop + ayTop) / 2) - (thickness / 2);
    // angle
    let angle = Math.atan2((yTop-ayTop),(xLeft-axLeft))*(180/Math.PI);
    // make hr

    let line = document.createElement("div");
    line.setAttribute("id", lineId);
    line.style.padding = "0px";
    line.style.margin = "0px";
    line.style.height = thickness + "px"; //("style", "padding:0px; margin:0px; height:" + thickness + "px");
    line.style.backgroundColor =  color;
    line.style.lineHeight =  "1px";
    line.style.position =  "absolute";
    line.style.left =  cx + "px";
    line.style.top =  cy + "px";
    line.style.width =  length + "px";
    line.style.transform = "rotate(" + angle + "deg)";
    document.getElementsByClassName('tableAndKnapsack')[0].appendChild(line);
}

async function removeLineIfExists(lineId) {
    let e = document.getElementById(lineId);
    if (e !== null) {
        document.getElementsByClassName('tableAndKnapsack')[0].removeChild(e);
    }
}

function updateKnapsackText(clickable) {
    let knapsack_text = clickable ? document.getElementById("knapsack_text") : document.getElementById("aknapsack_text");
    knapsack_text.innerHTML = `<b>Highest value so far: ${clickable ? bestVal : abestVal}</b> <br>
  Maximum weight: ${weightLimit}<br>
  Current weight: ${getKnapsackWeight(clickable)}<br>
  Current value: ${getKnapsackValue(clickable)}`;
}

function putOutside(item, clickable) {
    let outside;
    if (clickable) {
        let outside0 = document.getElementById("outside0");
        let outside1 = document.getElementById("outside1");
        let outside0weight = 0;
        let outside1weight = 0;
        for (let i = 0; i < outside0.children.length; i++) {
            outside0weight += parseInt(outside0.children.item(i).getAttribute("weight"));
        }
        for (let i = 0; i < outside1.children.length; i++) {
            outside1weight += parseInt(outside1.children.item(i).getAttribute("weight"));
        }
        if (outside0weight < outside1weight) {
            outside0.appendChild(item);
        } else {
            outside1.appendChild(item);
        }
    } else {
        outside = document.getElementById("aoutside");
        outside.appendChild(item);
        item.style.width = 130 + "px";
        item.style.fontSize = "small";
    }

    if (clickable) {
        item.setAttribute("onClick", "putInside(this, true)");
    }
    updateKnapsackText(clickable);
}
