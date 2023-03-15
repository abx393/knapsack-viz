
window.onload=()=>{
  var slider = document.getElementById("myRange");
  var output = document.getElementById("demo");
  output.innerHTML += slider.value; // Display the default slider value
  
  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function() {
    output.innerHTML = this.value;
  }
  setItems();
  updateKnapsackText(true);
  updateKnapsackText(false);
  drawRecursionTree();
}

function setItems() {
  for (let i = 0; i < weights.length; i++) {
    let item = document.getElementById("item" + i);
    item.setAttribute("weight", "" + weights[i]);
    item.setAttribute("value", "" + vals[i]);
    item.innerHTML = "Weight: " + weights[i] + ", Value: " + vals[i];
    item.style.height = 40 * parseInt(item.getAttribute("weight")) - 4 + "px";
    // let randomColor = Math.floor(Math.random()*16777215).toString(16);
    item.style.backgroundColor = colorPicker(vals[i]);

    let aitem = document.getElementById("aitem" + i);
    outsideSet.add(aitem);
    aitem.setAttribute("weight", "" + weights[i]);
    aitem.setAttribute("value", "" + vals[i]);
    aitem.innerHTML = "Weight: " + weights[i] + ", Value: " + vals[i];
    aitem.style.height = 40 * parseInt(aitem.getAttribute("weight")) - 4 + "px";
    aitem.style.backgroundColor = colorPicker(vals[i]);
  }
}

function putInside(item, clickable) {
  let item_weight = parseInt(item.getAttribute("weight"));
  if (getKnapsackWeight(clickable) + item_weight <= weightLimit) {
    let inside;
    if (clickable) {
      inside = document.getElementById("inside");
    } else {
      inside = document.getElementById("ainside");
    }
    inside.insertBefore(item, inside.firstChild);
    if (clickable) {
      item.setAttribute("onClick", "putOutside(this, true)");
    } else {
      item.style.width = 280 + "px";
      item.style.fontSize = "medium";
    }
  }
  let currValue = getKnapsackValue(clickable);
  if (clickable) {
    if (currValue > bestVal) {
      bestVal = currValue;
      updateKnapsackText(true);
    }
  } else {
    if (currValue > abestVal) {
      abestVal = currValue;
      updateKnapsackText(false);
    }
  }
}


function getKnapsackWeight(clickable) {
  let children;
  if (clickable) {
    children = document.getElementById("inside").childNodes;
  }  else {
    children = document.getElementById("ainside").childNodes;
  }
  let weight = 0;
  for (let i = 0; i < children.length; i++) {
    weight += parseInt(children.item(i).getAttribute("weight"));
  }
  return weight;
}

function getKnapsackValue(clickable) {
  let children;
  if (clickable) {
    children = document.getElementById("inside").childNodes;
  }  else {
    children = document.getElementById("ainside").childNodes;
  }
  let value = 0;
  for (let i = 0; i < children.length; i++) {
    value += parseInt(children.item(i).getAttribute("value"));
  }
  return value;
}

function colorPicker(size) {
  let rgbDark = [42, 103, 105];
  let rgbLight = [153, 220, 222]; 

  let ratio = size / 9;
  let red = rgbLight[0] - Math.round((rgbLight[0] - rgbDark[0]) * ratio);
  let green = rgbLight[1] - Math.round((rgbLight[1] - rgbDark[1]) * ratio);
  let blue = rgbLight[2] - Math.round((rgbLight[2] - rgbDark[2]) * ratio);
  let rgbToString = "rgb(" + red + ", " + green + ", " + blue + ")"; 
  return rgbToString; 
}

function selectJs() {
  let jsButton = document.getElementById("jsButton");
  let javaButton = document.getElementById("javaButton");
  let pythonButton =document.getElementById("pythonButton");

  let jsCode = document.getElementById("jsCode");
  let javaCode = document.getElementById("javaCode");
  let pythonCode = document.getElementById("pythonCode");

  jsCode.style.display = "block";
  javaCode.style.display = "none";
  pythonCode.style.display = "none";

  jsButton.style.backgroundColor = "orange";
  javaButton.style.backgroundColor = "cadetblue";
  pythonButton.style.backgroundColor = "cadetblue";
}

function selectJava() {
  let jsButton = document.getElementById("jsButton");
  let javaButton = document.getElementById("javaButton");
  let pythonButton =document.getElementById("pythonButton");

  let jsCode = document.getElementById("jsCode");
  let javaCode = document.getElementById("javaCode");
  let pythonCode = document.getElementById("pythonCode");

  jsCode.style.display = "none";
  javaCode.style.display = "block";
  pythonCode.style.display = "none";

  jsButton.style.backgroundColor = "cadetblue";
  javaButton.style.backgroundColor = "orange";
  pythonButton.style.backgroundColor = "cadetblue";
}

function selectPython() {
  let jsButton = document.getElementById("jsButton");
  let javaButton = document.getElementById("javaButton");
  let pythonButton =document.getElementById("pythonButton");

  let jsCode = document.getElementById("jsCode");
  let javaCode = document.getElementById("javaCode");
  let pythonCode = document.getElementById("pythonCode");

  jsCode.style.display = "none";
  javaCode.style.display = "none";
  pythonCode.style.display = "block";

  jsButton.style.backgroundColor = "cadetblue";
  javaButton.style.backgroundColor = "cadetblue";
  pythonButton.style.backgroundColor = "orange";
}
