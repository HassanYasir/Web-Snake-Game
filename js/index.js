// Game Constants & Variables
let inputDir = { x: 0, y: 0, position: "" };
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let speed = 6;
let score = 0;
let isRunning = false;
let gameEnd = false;
let hiscoreval;
let modal = document.getElementsByTagName("dialog")[0];
let lastPaintTime = 0;
let snakeArr = [
    { x: 13, y: 15 }
];

let food = { x: 6, y: 7 };
let boardBody = document.getElementById("board");

// Game Functions




function main(ctime) {

  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
      return;
  }
  lastPaintTime = ctime;
  gameEngine();
    
}


// for touch controles
let startX, startY, endX, endY;
const threshold = 30; // Minimum distance to consider a swipe
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



// function for showing ending menue
const showEndingPopup = ()=>{
    
    
    modal.showModal();
    
    let playButton = document.getElementById("play");
    let exitButton = document.getElementById("exit");
    playButton.addEventListener("click",()=>{
        modal.close();
        window.location.reload();
        
    });
    
    exitButton.addEventListener("click",()=>{

        window.close();
    });
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
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        isRunning = false;
        return true;
    }

    return false;
}

function gameEngine() {


    // Part 1: Updating the snake array & Food
    if (isCollide(snakeArr)) {
        
        inputDir = { x: 0, y: 0 };
        snakeArr = [{ x: 13, y: 15 }];
        gameEnd = true;
        
        score = 0;
        scoreBox.innerHTML =  score;
        gameOverSound.play();
        // alert("Game Over. Press any key to play again!");
        boardBody.removeEventListener('touchstart', touchStartHandler);
        boardBody.removeEventListener('touchend',touchEndHandler);
        showEndingPopup();
    }

    // If you have eaten the food, increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = hiscoreval;
        }
        scoreBox.innerHTML =  score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) }
    }

    // Moving the snake
    

    for (let i = snakeArr.length - 2; i >= 0; i--) {
      isRunning = true;
      snakeArr[i + 1] = { ...snakeArr[i] };

    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and Food
    // Display the snake
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {

        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
        }

        else {
            snakeElement.classList.add('snake');

        }
        
        // logic for snake turning effect
        
        board.appendChild(snakeElement);

        
        switch (inputDir.position) {
            case "up":
                if(snakeElement.classList.contains("head")){

                    snakeElement.style.transform = 'rotate(-90deg)';
                }
                

                break;
            case "down":
                
                if(snakeElement.classList.contains("head")){
                    snakeElement.style.transform = 'rotate(90deg)';
                    
                }else{
                    
                    snakeElement.style.transform = 'rotate(180deg)';
                    
                }
                
 

                break;
            case "left":

                
                if(snakeElement.classList.contains("head")){
                    ["grid-row-start"]
                    snakeElement.style.transform = 'rotate(180deg)';
                    
                }else{
                    snakeElement.style.transform = 'rotate(-90deg)';
                }
                
                

                break;
            case "right":
                if (snakeElement.classList.contains("head")) {
                    
                }else{
                    
                    snakeElement.style.transform = 'rotate(90deg)';
                    
                }
                
                break;
        }


    });
    // Display the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
    let boxes = snakeArr.length>=2?document.querySelectorAll(".snake"):["",""];
    let Lastbox = boxes[boxes.length -1];
    Lastbox != ""?Lastbox.classList.add("tail"):Lastbox;
    let head = document.querySelector(".head");

    if(snakeArr.length > 2){
        let tailColumnStyle = Lastbox.style["grid-column-start"];
        let tailRowStyle = Lastbox.style["grid-row-start"];
        let bodyColumnStyle = boxes[boxes.length-2].style["grid-column-start"];
        let bodyRowStyle = boxes[boxes.length-2].style["grid-row-start"];

        if (tailColumnStyle === bodyColumnStyle && inputDir.position === "right") {
            Lastbox.style.transform = "rotate(360deg)";
          }
          if (tailColumnStyle === bodyColumnStyle && inputDir.position === "left") {
            Lastbox.style.transform = "rotate(-360deg)";
          }
          if (
            tailColumnStyle === bodyColumnStyle &&
            parseInt(tailRowStyle) === parseInt(bodyRowStyle) - 1 &&
            inputDir.position === "left"
          ) {
            Lastbox.style.transform = "rotate(-180deg)";
          }
          if (
            tailColumnStyle === bodyColumnStyle &&
            parseInt(tailRowStyle) === parseInt(bodyRowStyle) - 1 &&
            inputDir.position === "right"
          ) {
            Lastbox.style.transform = "rotate(180deg)";
          }
          if (tailRowStyle === bodyRowStyle && inputDir.position === "up") {
            Lastbox.style.transform = "rotate(-90deg)";
          }
          if (tailRowStyle === bodyRowStyle && inputDir.position === "down") {
            Lastbox.style.transform = "rotate(90deg)";
          }
          if (
            tailRowStyle === bodyRowStyle &&
            parseInt(tailColumnStyle) ===
              parseInt(boxes[boxes.length - 2].style["grid-column-start"]) - 1 &&
            inputDir.position === "up"
          ) {
            Lastbox.style.transform = "rotate(90deg)";
          }
          if (
            tailRowStyle === bodyRowStyle &&
            parseInt(tailColumnStyle) ===
              parseInt(boxes[boxes.length - 2].style["grid-column-start"]) + 1 &&
            inputDir.position === "down"
          ) {
            Lastbox.style.transform = "rotate(-90deg)";
          }
          if (
            parseInt(tailRowStyle) === parseInt(bodyRowStyle) - 1 &&
            parseInt(boxes[0].style["grid-row-start"]) ===
              parseInt(head.style["grid-row-start"]) + 1
          ) {
            Lastbox.style.transform = "rotate(180deg)";
          }
          if (
            parseInt(tailRowStyle) ===
              parseInt(boxes[boxes.length - 2].style["grid-row-start"]) + 1 &&
            parseInt(boxes[0].style["grid-row-start"]) ===
              parseInt(head.style["grid-row-start"]) - 1
          ) {
            Lastbox.style.transform = "rotate(360deg)";
          }
          if (
            parseInt(tailColumnStyle) ===
              parseInt(boxes[boxes.length - 2].style["grid-column-start"]) - 1 &&
            parseInt(boxes[0].style["grid-column-start"]) ===
              parseInt(head.style["grid-column-start"]) + 1
          ) {
            Lastbox.style.transform = "rotate(90deg)";
          }
          if (
            parseInt(tailColumnStyle) ===
              parseInt(boxes[boxes.length - 2].style["grid-column-start"]) + 1 &&
            parseInt(boxes[0].style["grid-column-start"]) ===
              parseInt(head.style["grid-column-start"]) - 1
          ) {
            Lastbox.style.transform = "rotate(-90deg)";
          }
        
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
        inputDir = { x: 0, y: 0, position: "" };

        break;
}

}

window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    inputDir = { x: 0, y: 1 } // Start the game
    moveSound.play();
    
    handleControl(e.key)
    

});


// for endingpopup events 

