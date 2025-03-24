// Game Constants & Variables
let inputDir = { x: 0, y: 0, position: "" };
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');

// DOM elements variables

let hiscoreBox = document.getElementById("hiscoreBox");
let scoreBox = document.getElementById("scoreBox");

// importing functions from files

import {pause,showEndingPopup} from './popup.js';

// variables diclearations
let snakeElement;
let foodElement;

// locic for setting speed according to localstorage data

let speed = 6;
if(localStorage.getItem("Speed")){
  speed = localStorage.getItem("Speed");
}
let score = 0;
let isRunning = false;
let gameEnd = false;
let hiscoreval;

let lastPaintTime = 0;



let food = { x: 6, y: 7 };
let boardBody = document.getElementById("board");

const gridComputedStyle = window.getComputedStyle(boardBody);

// get number of grid rows
const gridRowCount = gridComputedStyle.getPropertyValue("grid-template-rows").split(" ").length;

// get number of grid columns
const gridColumnCount = gridComputedStyle.getPropertyValue("grid-template-columns").split(" ").length;

console.log(gridRowCount, gridColumnCount);


let snakeArr = [
  {x: gridRowCount-3, y: gridRowCount-2}
];

// Game Functions

function handleControl(key){
  switch (key) {

    case "ArrowUp":
        
        inputDir.x = 0;
        inputDir.y = -1;
        inputDir.position = "up";

        break;

    case "ArrowDown":

        inputDir.x = 0;
        inputDir.y = 1;
        inputDir.position = "down";
        break;

    case "ArrowLeft":

        inputDir.x = -1;
        inputDir.y = 0;
        inputDir.position = "left";
        break;

    case "ArrowRight":
      

        inputDir.x = 1;
        inputDir.y = 0;
        inputDir.position = "right";
        break;
    default:
        inputDir = { x: 0, y: -1, position: "up" };

        break;
  }
  

}



function changeTailDir(box,positionX,positionY){
  if(positionX > 0 ){
    box.style.transform = "rotate(270deg)";
  }
  if(positionX < 0 ){
    box.style.transform = "rotate(90deg)";
  }
  if(positionY > 0 ){
    box.style.transform = "rotate(360deg)";
  }
  if(positionY < 0 ){
    box.style.transform = "rotate(-180deg)";
  }
}


function changeHeadDir(head,boxes){
  if(!(boxes.length >= 2)){
    switch(inputDir.position){
      case "up":
        head.style.transform = 'rotate(-90deg)';
        break;
      case "down":
        head.style.transform = 'rotate(90deg)';
        break;
      case "left":
        head.style.transform = 'rotate(180deg)';
        break;
      case "right":
        
        break;
    }

  }else{
    let headColumnStyle = head.style["grid-column-start"];
    let headRowStyle = head.style["grid-row-start"];
    let secondElem = boxes[1];
    let bodyColumnStyle = secondElem.style["grid-column-start"];
    let bodyRowStyle = secondElem.style["grid-row-start"];

    let positionX = parseInt(headColumnStyle) - parseInt(bodyColumnStyle);
    let positionY = parseInt(headRowStyle) - parseInt(bodyRowStyle);

    if(positionX > 0){
      head.style.transform = 'rotate(-360deg)';
    }
    if(positionX > 0){
      // head.style.transform = 'rotate(-90deg)';
    }
    if(positionY < 0){
      head.style.transform = 'rotate(-90deg)';
    }
    if(positionY > 0){
      head.style.transform = 'rotate(90deg)';
    }
  }
}



function main(ctime) {

  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
      return;
  }
  lastPaintTime = ctime;
  gameEngine();
    
}





// function for showing ending menue
// for touch controles
let startX, startY, endX, endY;
const threshold = 2 // Minimum distance to consider a swipe
function touchStartHandler(e) {
  const touch = e.touches[0];
  startX = touch.pageX;
  console.log(touch);
  startY = touch.pageY;
  e.preventDefault();
}
function touchEndHandler(e) {
  const touch = e.changedTouches[0];
  endX = touch.pageX;
  endY = touch.pageY;
  moveSound.play();
  
  handleSwipe();
}
boardBody.addEventListener('touchstart', touchStartHandler);

boardBody.addEventListener('touchend',touchEndHandler);

function handleSwipe() {
  const deltaX = endX - startX;
  const deltaY = endY - startY;

  // Determine swipe direction
  if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX > 0) {
              
              handleControl("ArrowRight");
              
          } else {
          
              handleControl("ArrowLeft");
          }
      } else {
          if (deltaY > 0) {
              
              handleControl("ArrowDown");
          } else {
             
              handleControl("ArrowUp");
          }
      }
  }
}
// for generating random values
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



function isCollide(snake) {
    // If you bump into yourself 
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            isRunning = false;
            
            return true;
        }
    }
    // If you bump into the wall
    if (snake[0].x >= gridRowCount || snake[0].x <= 0 || snake[0].y >= gridRowCount || snake[0].y <= 0) {
        isRunning = false;
        console.log("crashed",snake[0].x,snake[0].y);
        return true;
    }

    return false;
}

function gameEngine() {

  //function variables
  let boxes;


    // Part 1: Updating the snake array & Food
    if (isCollide(snakeArr)) {
        
        inputDir = { x: 0, y: 0 };
        snakeArr = [{ x: gridRowCount-3, y: gridRowCount-2}];
        gameEnd = true;
        
        score = 0;
        scoreBox.innerHTML =  score;
        gameOverSound.play();
        
        boardBody.removeEventListener('touchstart', touchStartHandler);
        boardBody.removeEventListener('touchend',touchEndHandler);
        showEndingPopup();
    }

    // If you have eaten the food, increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        scoreBox.innerHTML =  score;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = hiscoreval;
        }
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let m = 4;
        let max = gridColumnCount-m;
        food = { x: getRandomInt(m, max), y: getRandomInt(m, max) }
    }

    // Moving the snake
    if(!pause){
      
      for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
        isRunning = true;
  
      }
      snakeArr[0].x += inputDir.x;
      snakeArr[0].y += inputDir.y;
    }

    // Part 2: Display the snake and Food
    // Display the snake
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {

        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
            snakeElement.id = "snake";
            if(localStorage.getItem("Snake")){
              let opt = localStorage.getItem("Snake")
              snakeElement.style.backgroundImage = `url("${opt}")`;
    
            }
        }

        else {
            snakeElement.classList.add('snake');
            snakeElement.id = "snake";
            if(localStorage.getItem("Snake")){
              let opt = localStorage.getItem("Snake")
              switch(opt){
                case "./img/snake-head.svg":
                  snakeElement.style.backgroundColor = "#5876ba";
                  break;
                case "./img/snake-head-red.svg":
                  snakeElement.style.backgroundColor = "#D21404";
                  break;
                case "./img/snake-head-green.svg":
                  snakeElement.style.backgroundColor = "#00a76b";
                  break;
              }
    
            }

        }
        //appanding snake element
        board.appendChild(snakeElement);
        // logic for snake turning effect head        

        boxes =document.querySelectorAll("#snake");
        let head = document.querySelector(".head");
        changeHeadDir(head,boxes);


    });
    // Display the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);

    // logic for handling sanke head and tail
    
    

    

    if(snakeArr.length >= 2){
      let Lastbox = boxes[boxes.length -1];
      Lastbox.classList.add("tail");
      let tailColumnStyle = Lastbox.style["grid-column-start"];
      let tailRowStyle = Lastbox.style["grid-row-start"];
      let bodyColumnStyle = boxes[boxes.length-2].style["grid-column-start"];
      let bodyRowStyle = boxes[boxes.length-2].style["grid-row-start"];
      
      let positionX = parseInt(tailColumnStyle) - parseInt(bodyColumnStyle);
      let positionY = parseInt(tailRowStyle) - parseInt(bodyRowStyle);
      changeTailDir(Lastbox,positionX,positionY);

        
    }


}


// Main logic starts here






let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else {
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = hiscore;
}


window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
  
    if(!pause){
      
      inputDir = { x: 0, y: 1 } // Start the game
      moveSound.play();
      
      handleControl(e.key)
    }
    

});


// for endingpopup events 

