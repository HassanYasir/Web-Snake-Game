// Game Constants & Variables

const foodSound = new Audio("music/food.mp3");
const gameOverSound = new Audio("music/gameover.mp3");

// DOM elements variables

let hiscoreBox = document.getElementById("hiscoreBox");
let scoreBox = document.getElementById("scoreBox");

// importing functions from files

import {showEndingPopup } from "./popup.js";
import {
  touchStartHandler,
  touchEndHandler,
  handleControl,
} from "./controls.js";
// variables diclearations

let foodElement;

// locic for setting speed according to localstorage data

let speed = 6;
if (localStorage.getItem("Speed")) {
  speed = localStorage.getItem("Speed");
}
let score = 0;
export let gameEnd = false;
let hiscoreval;

let lastPaintTime = 0;

let food = { x: 6, y: 7 };
let boardBody = document.getElementById("board");

const gridComputedStyle = window.getComputedStyle(boardBody);

// get number of grid rows
const gridRowCount = gridComputedStyle
  .getPropertyValue("grid-template-rows")
  .split(" ").length;

// get number of grid columns
const gridColumnCount = gridComputedStyle
  .getPropertyValue("grid-template-columns")
  .split(" ").length;

let snakeArr = [{ x: gridRowCount - 3, y: gridRowCount - 2 },
  { x: gridRowCount - 4, y: gridRowCount - 2 }
];

// Game Functions

function resetGame() {
  window.inputDir = { x: 0, y: 0 };
  snakeArr = [{ x: gridRowCount - 3, y: gridRowCount - 2 },
    { x: gridRowCount - 4, y: gridRowCount - 2 }
  ];
  gameEnd = true;
  score = 0;
  scoreBox.innerHTML = score;
  gameOverSound.play();

  boardBody.removeEventListener("touchstart", touchStartHandler);
  boardBody.removeEventListener("touchmove", touchEndHandler);
  showEndingPopup();
}

function localStorageHasData(data){
  if (localStorage.getItem(data)) {
    let finalData = localStorage.getItem(data);
    return finalData;
  }
}

function changeTailDir(box, positionX, positionY) {
  if (positionX > 0) {
    box.style.transform = "rotate(270deg)";
  }
  if (positionX < 0) {
    box.style.transform = "rotate(90deg)";
  }
  if (positionY > 0) {
    box.style.transform = "rotate(360deg)";
  }
  if (positionY < 0) {
    box.style.transform = "rotate(-180deg)";
  }
}

function changeHeadDir(head) {
  if (window.inputDir.y === -1) {
    head.style.transform = "rotate(-90deg)";

  }else if (window.inputDir.y === 1) {
    head.style.transform = "rotate(90deg)";

  }else if (window.inputDir.x === -1) {
    head.style.transform = "rotate(180deg)";

  }
  
}

function changeSnakeColor(opt) {
  let color;
  switch (opt) {
    case "./img/snake-head.svg":
      color = "#5876ba";
      break;
    case "./img/snake-head-purple.svg":
      color = "#7a49e5";
      break;
    case "./img/snake-head-green.svg":
      color = "#00a76b";
      break;
  }
  return color;
}

// function for creating snake element
function createSnakeElement(index,x,y){
  let snakeElement = document.createElement("div");
  snakeElement.style.gridRowStart = y;
  snakeElement.style.gridColumnStart = x;

  if (index === 0) {
    snakeElement.classList.add("head");
    snakeElement.id = "snake";
    
    let opt = localStorageHasData("Snake");

    // if localstorage does not have the setting data then setting the default image to head
    if(!opt){
      snakeElement.style.backgroundImage = `url("./img/snake-head.svg")`;
    }else{
      
      snakeElement.style.backgroundImage = `url("${opt}")`;
    }
    
  } else {
    if(index === snakeArr.length-1){
      snakeElement.classList.add("tail");
      snakeElement.classList.add("snake");
    }else{
      snakeElement.classList.add("snake");
      
    }
    snakeElement.id = "snake";

    // changing snake color according to setting
    let opt = localStorageHasData("Snake");
    let color = changeSnakeColor(opt);
    snakeElement.style.backgroundColor = color;
  }
  return snakeElement;
}


function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }
  lastPaintTime = ctime;
  gameEngine();
}

// for generating random values
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function foodEaten() {
  foodSound.play();
  score += 1;
  scoreBox.innerHTML = score;
  if (score > hiscoreval) {
    hiscoreval = score;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
    hiscoreBox.innerHTML = hiscoreval;
  }
  let m = 4;
  let max = gridColumnCount - m;
  food = { x: getRandomInt(m, max), y: getRandomInt(m, max) };
}

function isCollide(snake) {
  // If you bump into yourself
  for (let i = 1; i < snakeArr.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      

      return true;
    }
  }
  // If you bump into the wall
  if (
    snake[0].x >= gridRowCount ||
    snake[0].x <= 0 ||
    snake[0].y >= gridRowCount ||
    snake[0].y <= 0
  ) {
    
    return true;
  }

  return false;
}

function gameEngine() {
  //function variables
  let boxes;
  if(window.inputDir.x !== 0 || window.inputDir.y !== 0 ){
    let snakeHead = {
      x: snakeArr[0].x + window.inputDir.x,
      y: snakeArr[0].y + window.inputDir.y
    }
    snakeArr.unshift(snakeHead);
  
    // If you have eaten the food, increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
      foodEaten();
    }else{
      snakeArr.pop();
    }
  
  }

  // checking the collision and reseting the game
  if (isCollide(snakeArr)) {
    resetGame();
  }

  // Display the snake and Food
  // Display the snake
  boardBody.innerHTML = "";
  snakeArr.forEach((e, index) => {
    let snakeElement = createSnakeElement(index,e.x,e.y);
    //appanding snake element
    boardBody.appendChild(snakeElement);
    // logic for snake rotating of snake head

    boxes = document.querySelectorAll("#snake");
    let head = document.querySelector(".head");
    changeHeadDir(head);
  });
  // Display the food
  foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  boardBody.appendChild(foodElement);

  // logic for handling sanke head and tail

  if (snakeArr.length >= 2) {
    let Lastbox = boxes[boxes.length - 1];
    
    let tailColumnStyle = Lastbox.style["grid-column-start"];
    let tailRowStyle = Lastbox.style["grid-row-start"];
    let bodyColumnStyle = boxes[boxes.length - 2].style["grid-column-start"];
    let bodyRowStyle = boxes[boxes.length - 2].style["grid-row-start"];

    let positionX = parseInt(tailColumnStyle) - parseInt(bodyColumnStyle);
    let positionY = parseInt(tailRowStyle) - parseInt(bodyRowStyle);
    changeTailDir(Lastbox, positionX, positionY);
  }
}

// setting the highscore according to data in localStorage

let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
  hiscoreval = 0;
  localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
  hiscoreval = JSON.parse(hiscore);
  hiscoreBox.innerHTML = hiscore;
}

window.requestAnimationFrame(main);

window.addEventListener("keydown", (e) => {
  handleControl(e.key);
});

// for endingpopup events
