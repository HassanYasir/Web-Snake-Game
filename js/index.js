// Game Constants & Variables
let inputDir = { x: 0, y: 0, position: "" };
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');

// locic for setting speed according to localstorage data
let pause = false;
let speed = 6;
if(localStorage.getItem("Speed")){
  speed = localStorage.getItem("Speed");
}
let score = 0;
let isRunning = false;
let gameEnd = false;
let hiscoreval;
let modal = document.getElementsByTagName("dialog")[0];
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

const showPopUp = (mesg) =>{
  let parentElem = document.getElementsByTagName("dialog")[0];
  let element = document.createElement("div");
  element.setAttribute("id","msg-popup");
  element.innerHTML = `<p class="msg">${mesg}</p>`

  parentElem.appendChild(element);
  setTimeout(()=>{
    parentElem.removeChild(element);
  },1200);
  

}


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
const threshold = 6 // Minimum distance to consider a swipe
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

  let snakeSelectionPos = {
    left:23.8,
    right:23.8
  };
  let speedSelectionPos = {
    left:27.6,
    right:27.6
  };
  if(window.innerWidth <= 740){
    speedSelectionPos = {
      left:30.6,
      right:18
    };
    snakeSelectionPos = {
      left:26,
      right:13.7
    };
  }
  // function for handling selection of setting items eg snake and speed
  function handleSelection(elem,mycase,selection,left,right){
    switch(elem){
      case mycase[0]:
        selection.style.left = `${left}%`;
        selection.style.right = "";
        break;
      case mycase[1]:
        selection.style.right = "";
        selection.style.left = "";
        break;
      case mycase[2]:
        selection.style.right = `${right}%`;
        selection.style.left = "";
        break;
      case "":
        selection.style.left = `${right}%`;
        selection.style.right = "";
        break;
    }
  }
  function saveSettings(item,setting){
    localStorage.setItem(item, setting);
    showPopUp(`item selected and setting saved `);
  }

    modal.showModal();
    showPopUp("hello to you");
    pause = true;
    let playButton = document.getElementById("play");
    let exitButton = document.getElementById("exit");
    let selectButton = document.getElementById("select");
    playButton.addEventListener("click",()=>{
        modal.close();
        window.location.reload();
        
    });


    selectButton.addEventListener("click",()=>{
      let targetBox = document.getElementById("preview");
      targetBox.innerHTML = `<div class="selectBox">
                              <div class="tittle"><p><span style="margin-right:6px"><i class="fa-duotone fa-solid fa-gear"></i></span>Setting</p></div>
                              <div class="items-container">
                              
                              <div class="heading"><p>Select Snake</p></div>
                              <div class="snake-select">
                                <img src="./img/snake-head.svg" class="selection-img" loading="lazy" alt="snake-01">
                                <img src="./img/snake-head-green.svg" class="selection-img" loading="lazy" alt="snake-02">
                                <img src="./img/snake-head-red.svg" class="selection-img" loading="lazy" alt="snake-03">
                                <div class="line"></div>
                              </div>
                              <div class="heading"><p>Select Speed</p></div>
                              <div class="speed-select">
                                <img src="./img/turtle.png" class="selection-img w-16" loading="lazy" alt="snake-01">
                                <img src="./img/rabbit.png" class="selection-img w-16" loading="lazy" alt="snake-02">
                                <img src="./img/cheetah.png" class="selection-img w-16" loading="lazy" alt="snake-03">
                                <div class="line2"></div>
                              </div>
                              
                              </div>
                              </div>`
    
    let SnakeBox = "";                          
    let SpeedBox = "";                          
    localStorage.getItem("Snake")?SnakeBox=localStorage.getItem("Snake"):SnakeBox="";
    localStorage.getItem("Speed")?SpeedBox=localStorage.getItem("Speed"):SpeedBox="";
    

      
    let selectSnake = document.querySelector(".snake-select");
    let selectSpeed = document.querySelector(".speed-select");
    let line1 = document.querySelector(".line");
    let line2 = document.querySelector(".line2");

    line1.style.height = `${line1.getBoundingClientRect().width}px`;
    line2.style.height = `${line2.getBoundingClientRect().width}px`;
    let snakeCaseArr = ["./img/snake-head.svg","./img/snake-head-green.svg","./img/snake-head-red.svg"];
    let speedCaseArr = ["3","6","9"];
    handleSelection(SnakeBox,snakeCaseArr,line1,snakeSelectionPos.left,snakeSelectionPos.right);
    handleSelection(SpeedBox,speedCaseArr,line2,speedSelectionPos.left,speedSelectionPos.right);

    selectSnake.addEventListener("click",(elem)=>{

      
      let item = elem.target;
      let snakeCaseArr = ["snake-01","snake-02","snake-03"];
      
      handleSelection(item.getAttribute("alt"),snakeCaseArr,line1,snakeSelectionPos.left,snakeSelectionPos.right);
      
      saveSettings("Snake",item.getAttribute("src"));
    });
    selectSpeed.addEventListener("click",(elem)=>{

      let btn = document.getElementById("store-btn");
      let item = elem.target;
      let speedCaseArr = ["snake-01","snake-02","snake-03"];
      let speedSetting = 6;
      
      handleSelection(item.getAttribute("alt"),speedCaseArr,line2,speedSelectionPos.left,speedSelectionPos.right);
      switch(item.getAttribute("src")){
        case "./img/turtle.png":
          speedSetting = 3;
          break;
        case "./img/rabbit.png":
          speedSetting = 6;
          break;
        case "./img/cheetah.png":
          speedSetting = 9;
          break;
          

      }
      saveSettings("Speed",speedSetting);
    });


      
  });
    exitButton.addEventListener("click",()=>{

        window.close();
    });
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
            if(localStorage.getItem("Snake")){
              let opt = localStorage.getItem("Snake")
              snakeElement.style.backgroundImage = `url("${opt}")`;
    
            }
        }

        else {
            snakeElement.classList.add('snake');
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

    // logic for handling sanke head and tail
    
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
        inputDir = { x: 0, y: -1, position: "up" };

        break;
  }
  

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

