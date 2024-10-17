/** @type {HTMLCanvasElement} */ // <-- help vs code with IntelliSense for Canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var running = false;
var controlButton = document.getElementById("controlButton");
var slider = document.getElementById("timeSlider");
var totalBlack = 0;

let table = Array.from({ length: 25 }, (e) => Array(25).fill(0));
let tempTable = Array.from({ length: 25 }, (e) => Array(25).fill(0));



//Takes in table pos and draws a white pixel at the table pos
function drawWhitePixel(x, y) {
  ctx.fillStyle = "White";
  ctx.fillRect(tablePosToScreenPos(x), tablePosToScreenPos(y), 20, 20);
}
//Takes in table pos and draws a black pixel at the table pos
function drawBlackPixel(x, y) {
  ctx.fillStyle = "Black";
  ctx.fillRect(tablePosToScreenPos(x),tablePosToScreenPos(y),20,20);
}

//Convert from mousePos on screen to pixel location in 2d array
function screenPosToTablePos(x) {
  return Math.floor(x / 25);
}
//Opposite of above
function tablePosToScreenPos(x) {
  return Math.floor(x * 25);
}

//Checks surrounding cells and processes the logic
function checkSuroundingCells(x, y) {

  //y
  for (var i = -1; i <= 1; i++) {
    //x
    for (var j = -1; j <= 1; j++) {
      if (table[y + i][x + j] == 1) {
        totalBlack++;
      }
    }
  }

  //Logic


  //alive cell
  if (table[y][x] == 1) {
    totalBlack--;
    if (totalBlack <= 1 || totalBlack >= 4) {
      tempTable[y][x] = 0; //Kill the cell
    } else {
      tempTable[y][x] = 1; //Keep cell alive
    }

    //dead cell
  } else {
    if (totalBlack == 3) {
      tempTable[y][x] = 1;
    } else {
      tempTable[y][x] = 0;
    }
  }
  totalBlack = 0;
}

//Applys the changes from the checkSuroundingCells along with reseting the temp table
function applyChanges(){
  for (var y = 0; y < 25; y++) {
    for (var x = 0; x < 25; x++) {
      table[y][x] = tempTable[y][x];
      tempTable[y][x] = 0;
      if(table[y][x] == 1){
        drawBlackPixel(x,y);
      } else {
        drawWhitePixel(x,y);
      }
    }
  }
}

function clearAll(){
  for(var y = 0; y < 25; y++){
    for(var x = 0; x < 25; x++){
      table[y][x] = 0
      tempTable[y][x] = 0;
      drawWhitePixel(x,y);
    }
  }
}
//Runs the game when button is clicked
function runControl() {
  if (running) {
    controlButton.innerHTML = "Run";
    controlButton.style.backgroundColor = "lime";
    running = false;
  } else {
    controlButton.innerHTML = "Stop";
    controlButton.style.backgroundColor = "red";
    running = true;

    
    var runLogic = setInterval(function () {

      if (!running) {
        clearInterval(runLogic);
      }

      //Check interate across the board
      for (var x = 1; x < 24; x++) {
        for (var y = 1; y < 24; y++) {
          checkSuroundingCells(x, y);
        }
      }
      applyChanges();
    }, Math.abs(slider.value));

  }
}


//Logic
/*
Dead Cell - > Alive Cell (3live neighbors)
Alive Cell -> Dead Cell (less than 2 or more than 3 neighbors)
Alive Cell -> Alive Cell (2 or more neighbors)

1.Scan table and process logic to store results on temp table
2.Iterate through temp table and set table to temptable along with drawing black/white pixels

*/


//Draw board
for (var x = 0; x < 25; x++) {
  for (var y = 0; y < 25; y++) {
    drawWhitePixel(x, y);
    table[y][x] = 0; //Have to do backward for table 2d array
  }
}

//Place or remove Alive Cell
canvas.onclick = function (event) {
  var rect = event.target.getBoundingClientRect();

  //Note: -4 for the border           V
  var x = event.clientX - rect.left - 4; //x position within the element.
  var y = event.clientY - rect.top - 4; //y position within the element.

  if(table[screenPosToTablePos(y)][screenPosToTablePos(x)] == 0){
  drawBlackPixel(screenPosToTablePos(x), screenPosToTablePos(y));
  table[screenPosToTablePos(y)][screenPosToTablePos(x)] = 1;
  } else {
    drawWhitePixel(screenPosToTablePos(x), screenPosToTablePos(y));
  table[screenPosToTablePos(y)][screenPosToTablePos(x)] = 0;
  }

};
