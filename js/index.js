// Game Constants for importing sound effects

const foodSound = new Audio("music/food.mp3");
const gameOverSound = new Audio("music/gameover.mp3");
const moveSound = new Audio("music/move.mp3");

// variables diclearations

let lastPaintTime = 0;
let boardBody = document.getElementById("board");
let inputDir = { x: 0, y: 0 };
let isGameEnd = false;

const gridComputedStyle = window.getComputedStyle(boardBody);

// get number of grid rows
const gridRowCount = gridComputedStyle
  .getPropertyValue("grid-template-rows")
  .split(" ").length;

// get number of grid columns
const gridColumnCount = gridComputedStyle
  .getPropertyValue("grid-template-columns")
  .split(" ").length;



// Game classes

class Popup {
  constructor() {
    this.popup = `<div class="selectBox">
                              <div class="tittle"><p><span style="margin-right:6px"><i class="fa-duotone fa-solid fa-gear"></i></span>Setting</p></div>
                              <div class="items-container">
                              
                              <div class="heading"><p>Select Snake</p></div>
                              <div class="snake-select">
                                <img src="./img/snake-head.svg" id="snake-item" class="selection-img" loading="lazy" alt="snake-01">
                                <img src="./img/snake-head-green.svg" id="snake-item" class="selection-img" loading="lazy" alt="snake-02">
                                <img src="./img/snake-head-purple.svg" id="snake-item" class="selection-img" loading="lazy" alt="snake-03">
                                <div class="line"></div>
                              </div>
                              <div class="heading"><p>Select Speed</p></div>
                              <div class="speed-select">
                                <img src="./img/turtle.png" id="speed-item" class="selection-img " loading="lazy" alt="snake-01">
                                <img src="./img/rabbit.png" id="speed-item" class="selection-img " loading="lazy" alt="snake-02">
                                <img src="./img/cheetah.png" id="speed-item" class="selection-img " loading="lazy" alt="snake-03">
                                <div class="line2"></div>
                              </div>
                              
                              </div>
                              </div>`;
    this.modal = document.getElementsByTagName("dialog")[0];
    this.line1 = null;
    this.line2 = null;
  }
  showMessage = (mesg) => {
    let element = document.createElement("div");
    element.setAttribute("id", "msg-popup");
    element.innerHTML = `<p class="msg">${mesg}</p>`;

    this.modal.appendChild(element);
    setTimeout(() => {
      this.modal.removeChild(element);
    }, 1200);
  };
  saveSettings(item, setting) {
    localStorage.setItem(item, setting);
    this.showMessage(
      `<i class="fa-regular fa-circle-check green"></i>  item selected and setting saved `
    );
  }
  saveSlectionCoordinates(item, element, name) {
    const rect = item.getBoundingClientRect();
    const containerRect = element.getBoundingClientRect();
    const offsetX = rect.left - containerRect.left;
    const offsetY = rect.top - containerRect.top;

    const coordinates = {
      offsetX: offsetX,
      offsetY: offsetY,
    };
    const Jsoncoordinates = JSON.stringify(coordinates);
    localStorage.setItem(name, Jsoncoordinates);
  }
  settingLineStyle() {
    let slectionWidth = document.querySelectorAll(".selection-img")[0].getBoundingClientRect().width;
    this.line1.style.width = `${slectionWidth+5}px`;
    this.line2.style.width = `${slectionWidth+5}px`;
    this.line1.style.height = `${this.line1.getBoundingClientRect().width}px`;
    this.line2.style.height = `${this.line2.getBoundingClientRect().width}px`;
    let data = [
      localStorage.getItem("offset1"),
      localStorage.getItem("offset2"),
    ];
    if (localStorage.getItem("offset1")) {
      let offset1 = JSON.parse(data[0]);
      let offset2 = JSON.parse(data[1]);
      this.line1.style.transform = `translate(${offset1["offsetX"]}px, ${offset1["offsetY"]}px)`;
      this.line2.style.transform = `translate(${offset2["offsetX"]}px, ${offset2["offsetY"]}px)`;
    }
  }

  selectionMovementHandler(items, parentElem, slectionElem) {
    items.forEach((item) => {
      item.addEventListener("click", () => {
        const rect = item.getBoundingClientRect();
        const containerRect = parentElem.getBoundingClientRect();

        const offsetX = rect.left - containerRect.left;
        const offsetY = rect.top - containerRect.top;
        console.log(offsetX);
        console.log(offsetY);

        slectionElem.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      });
    });
  }

  showEndingPopup() {
    this.modal.showModal();
    isGameEnd = true;

    let playButton = document.getElementById("play");
    let exitButton = document.getElementById("exit");
    let selectButton = document.getElementById("select");
    // event listners
    // button1 event listner
    playButton.addEventListener("click", () => {
      this.modal.close();
      window.location.reload();
    });
    // button 2 event listner
    selectButton.addEventListener("click", () => {
      let targetBox = document.getElementById("preview");
      targetBox.innerHTML = this.popup;
      this.line1 = document.querySelector(".line");
      this.line2 = document.querySelector(".line2");
      // let SnakeBox = "";
      // let SpeedBox = "";
      // localStorage.getItem("Snake")?SnakeBox=localStorage.getItem("Snake"):SnakeBox="";
      // localStorage.getItem("Speed")?SpeedBox=localStorage.getItem("Speed"):SpeedBox="";

      let selectSnake = document.querySelector(".snake-select");
      let selectSpeed = document.querySelector(".speed-select");
      let Snakeitems = document.querySelectorAll("#snake-item");
      let Speeditems = document.querySelectorAll("#speed-item");

      this.settingLineStyle();

      this.selectionMovementHandler(Snakeitems, selectSnake, this.line1);
      this.selectionMovementHandler(Speeditems, selectSpeed, this.line2);

      selectSnake.addEventListener("click", (elem) => {
        let item = elem.target;

        this.saveSlectionCoordinates(item, selectSnake, "offset1");
        this.saveSettings("Snake", item.getAttribute("src"));
      });

      selectSpeed.addEventListener("click", (elem) => {
        let item = elem.target;
        let speedSetting = 6;

        switch (item.getAttribute("src")) {
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
        this.saveSlectionCoordinates(item, selectSpeed, "offset2");
        this.saveSettings("Speed", speedSetting);
      });
    });
    // button 3 event listner
    exitButton.addEventListener("click", () => {
      window.close();
    });
  }
}
const popup = new Popup();
class Snake {
  constructor(coordinatesObjects) {
    this.coordinates = [...coordinatesObjects];
    this.head = null;
    this.snakeSegments = null;
  }

  isCollide() {
    // If you bump into yourself
    for (let i = 1; i < this.coordinates.length; i++) {
      if (
        this.coordinates[i].x === this.coordinates[0].x &&
        this.coordinates[i].y === this.coordinates[0].y
      ) {
        return true;
      }
    }
    // If you bump into the wall
    if (
      this.coordinates[0].x >= gridRowCount ||
      this.coordinates[0].x <= 0 ||
      this.coordinates[0].y >= gridRowCount ||
      this.coordinates[0].y <= 0
    ) {
      return true;
    }

    return false;
  }
  changeSnakeColor(opt) {
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

  create(x, y, index) {
    let snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = y;
    snakeElement.style.gridColumnStart = x;
    if (index === 0) {
      snakeElement.classList.add("head");
      snakeElement.id = "snake";
      if (localStorage.getItem("Snake")) {
        // setting the head of the snake according to settings
        let opt = localStorage.getItem("Snake");
        snakeElement.style.backgroundImage = `url("${opt}")`;
      }
    } else {
      snakeElement.classList.add("snake");
      snakeElement.id = "snake";
      if (localStorage.getItem("Snake")) {
        // setting the color of the snake according to settings
        let opt = localStorage.getItem("Snake");
        let color = this.changeSnakeColor(opt);
        snakeElement.style.backgroundColor = color;
      }
      if (index === this.coordinates.length - 1) {
        snakeElement.classList.add("tail");
      }
    }

    return snakeElement;
  }

  changeHeadDir() {
    this.head = document.querySelector(".head");
    this.snakeSegments = document.querySelectorAll("#snake");

    if (!(this.snakeSegments.length >= 2)) {
      if (inputDir.y === -1) {
        this.head.style.transform = "rotate(-90deg)";
      } else if (inputDir.y === 1) {
        this.head.style.transform = "rotate(90deg)";
      } else if (inputDir.x === -1) {
        this.head.style.transform = "rotate(180deg)";
      }
    } else {
      let headColumnStyle = this.head.style["grid-column-start"];
      let headRowStyle = this.head.style["grid-row-start"];
      let secondElem = this.snakeSegments[1];
      let bodyColumnStyle = secondElem.style["grid-column-start"];
      let bodyRowStyle = secondElem.style["grid-row-start"];

      let positionX = parseInt(headColumnStyle) - parseInt(bodyColumnStyle);
      let positionY = parseInt(headRowStyle) - parseInt(bodyRowStyle);

      if (positionX > 0) {
        this.head.style.transform = "rotate(-360deg)";
      }
      if (positionX > 0) {
        //no need to do any thing.
      }
      if (positionY < 0) {
        this.head.style.transform = "rotate(-90deg)";
      }
      if (positionY > 0) {
        this.head.style.transform = "rotate(90deg)";
      }
    }
  }
  changeTailDir() {
    let Lastseg = this.snakeSegments[this.snakeSegments.length - 1];
    // Lastseg.classList.add("tail");
    let tailColumnStyle = Lastseg.style["grid-column-start"];
    let tailRowStyle = Lastseg.style["grid-row-start"];
    let bodyColumnStyle =
      this.snakeSegments[this.snakeSegments.length - 2].style[
        "grid-column-start"
      ];
    let bodyRowStyle =
      this.snakeSegments[this.snakeSegments.length - 2].style["grid-row-start"];

    let positionX = parseInt(tailColumnStyle) - parseInt(bodyColumnStyle);
    let positionY = parseInt(tailRowStyle) - parseInt(bodyRowStyle);

    if (positionX > 0) {
      Lastseg.style.transform = "rotate(270deg)";
    }
    if (positionX < 0) {
      Lastseg.style.transform = "rotate(90deg)";
    }
    if (positionY > 0) {
      Lastseg.style.transform = "rotate(360deg)";
    }
    if (positionY < 0) {
      Lastseg.style.transform = "rotate(-180deg)";
    }
  }
}

class food {
  constructor() {
    this.coordinates = { x: 6, y: 7 };
  }

  create() {
    let foodElement = document.createElement("div");
    foodElement.style.gridRowStart = this.coordinates.y;
    foodElement.style.gridColumnStart = this.coordinates.x;
    foodElement.classList.add("food");
    return foodElement;
  }
}

class Game {
  constructor() {
    // creating variables that are going to used
    this.hiscoreBox = document.getElementById("hiscoreBox");
    this.scoreBox = document.getElementById("scoreBox");
    this.hiscoreval = 0;

    // setting speed according to the setting stored
    if (localStorage.getItem("Speed")) {
      this.speed = localStorage.getItem("Speed");
    } else {
      this.speed = 6;
    }

    // game key elements
    this.score = 0;
    this.food = new food();
    this.snake = new Snake([{ x: gridRowCount - 3, y: gridRowCount - 2 },
      {x: gridRowCount - 4, y: gridRowCount - 2 }
    ]);
    this.hiscoreval = null;
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  foodEaten() {
    foodSound.play();
    this.score += 1;
    this.scoreBox.innerHTML = this.score;
    if (this.score > this.hiscoreval) {
      this.hiscoreval = this.score;
      localStorage.setItem("hiscore", JSON.stringify(this.hiscoreval));
      this.hiscoreBox.innerHTML = this.hiscoreval;
    }
    let m = 4;
    let max = gridColumnCount - m;
    this.food.coordinates = {
      x: this.getRandomInt(m, max),
      y: this.getRandomInt(m, max),
    };
  }

  resetGame() {
    inputDir = { x: 0, y: 0 };
    this.snake.coordinates =[{ x: gridRowCount - 3, y: gridRowCount - 2 },
      {x: gridRowCount - 4, y: gridRowCount - 2 }
    ];

    this.score = 0;
    this.scoreBox.innerHTML = this.score;
    gameOverSound.play();

    boardBody.removeEventListener("touchstart", touchStartHandler);
    boardBody.removeEventListener("touchmove", touchEndHandler);

    popup.showEndingPopup();
  }

  engine() {
    if(inputDir.x !== 0 || inputDir.y !== 0){
      let Head = {
        x: this.snake.coordinates[0].x + inputDir.x,
        y: this.snake.coordinates[0].y + inputDir.y,
      };
      this.snake.coordinates.unshift(Head);
  
      // If you have eaten the food, increment the score and regenerate the food
      if (
        this.snake.coordinates[0].y === this.food.coordinates.y &&
        this.snake.coordinates[0].x === this.food.coordinates.x
      ) {
        this.foodEaten();
      } else {
        this.snake.coordinates.pop();
      }
    }


    // Part 1: Updating the snake array & Food
    if (this.snake.isCollide()) {
      this.resetGame();
    }

    // Part 2: Display the snake and Food
    // Display the snake
    boardBody.innerHTML = "";
    this.snake.coordinates.forEach((e, index) => {
      // creating a snake according to each snake coordinates
      let snakeElement = this.snake.create(e.x, e.y, index);
      //appanding snake element
      boardBody.appendChild(snakeElement);

      // changing the direction of the snake head according to direction
      this.snake.changeHeadDir();
    });
    // Display the food
    let foodElement = this.food.create();
    boardBody.appendChild(foodElement);

    // logic for changing the direction of  tail according to direction

    if (this.snake.coordinates.length >= 2) {
      // changing the position of tail according to direction
      this.snake.changeTailDir();
    }
  }
  sethighscore() {
    let hiscore = localStorage.getItem("hiscore");
  
    if (hiscore === null) {
      this.hiscoreval = 0;
      localStorage.setItem("hiscore", JSON.stringify(this.hiscoreval));
    } else {
      this.hiscoreval = JSON.parse(hiscore);
      this.hiscoreBox.innerHTML = hiscore;
    }
  }
}

// creating game object
const game = new Game();

function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000 < 1 / game.speed) {
    return;
  }
  lastPaintTime = ctime;
  game.engine();
}

// setting highscore
game.sethighscore();

window.requestAnimationFrame(main);

// controlles related part


function handleControll(key) {
  if(!isGameEnd){
    moveSound.play();
    if (key === "ArrowUp" && inputDir.y !== 1) {
      inputDir = { x: 0, y: -1 };
    }
    if (key === "ArrowDown" && inputDir.y !== -1) {
      inputDir = { x: 0, y: 1 };
    }
    if (key === "ArrowLeft" && inputDir.x !== 1) {
      inputDir = { x: -1, y: 0 };
    }
    if (key === "ArrowRight" && inputDir.x !== -1) {
      inputDir = { x: 1, y: 0 };
    }
  }

}


// touch controlles related functions

let startX,startY,endX,endY;
const threshold = 4 ;

function touchStartHandler(e) {
  const touch = e.touches[0];
  startX = touch.pageX;

  startY = touch.pageY;
  e.preventDefault();
}


function touchEndHandler(e) {
  const touch = e.changedTouches[0];
  endX = touch.pageX;
  endY = touch.pageY;
  
  
  const deltaX = endX - startX;
  const deltaY = endY - startY;

  // Determine swipe direction
  if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX > 0) {
              
              handleControll("ArrowRight");
              
          } else {
          
              handleControll("ArrowLeft");
          }
      } else {
          if (deltaY > 0) {
              
              handleControll("ArrowDown");
          } else {
             
              handleControll("ArrowUp");
          }
      }
  }
}


// attching eventListner for touch controlles

boardBody.addEventListener('touchstart', touchStartHandler);

boardBody.addEventListener('touchmove',touchEndHandler);
// attching eventListner for keyboard controlles

document.addEventListener("keydown", (e) => {

  handleControll(e.key);
});

