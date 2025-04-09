// variables

window.inputDir = { x: 0, y: 0, position: "" };

const moveSound = new Audio('music/move.mp3');
let boardBody = document.getElementById("board");

// functions


// for touch controles
// function for showing ending menue
// for touch controles
let startX, startY, endX, endY;
const threshold = 2 // Minimum distance to consider a swipe
export function touchStartHandler(e) {
  const touch = e.touches[0];
  startX = touch.pageX;
  console.log(touch);
  startY = touch.pageY;
  e.preventDefault();
}
export function touchEndHandler(e) {
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


// for keyboard controles

export function handleControl(key){
    switch (key) {
  
      case "ArrowUp":
          
          window.inputDir.x = 0;
          window.inputDir.y = -1;
          window.inputDir.position = "up";
  
          break;
  
      case "ArrowDown":
  
          window.inputDir.x = 0;
          window.inputDir.y = 1;
          window.inputDir.position = "down";
          break;
  
      case "ArrowLeft":
  
          window.inputDir.x = -1;
          window.inputDir.y = 0;
          window.inputDir.position = "left";
          break;
  
      case "ArrowRight":
        
  
          window.inputDir.x = 1;
          window.inputDir.y = 0;
          window.inputDir.position = "right";
          break;
      default:
          window.inputDir = { x: 0, y: -1, position: "up" };
  
          break;
    }
    
  
}
  
