// variables

window.inputDir = { x: 0, y: 0};

const moveSound = new Audio('music/move.mp3');
let boardBody = document.getElementById("board");

// functions


// for touch controles


let startX, startY, endX, endY;
const threshold = 4 // Minimum distance to consider a swipe
export function touchStartHandler(e) {
  const touch = e.touches[0];
  startX = touch.pageX;
//   console.log(touch);
  startY = touch.pageY;
  e.preventDefault();
}
export function touchEndHandler(e) {
  const touch = e.changedTouches[0];
  endX = touch.pageX;
  endY = touch.pageY;
  handleSwipe();
}
boardBody.addEventListener('touchstart', touchStartHandler);

boardBody.addEventListener('touchmove',touchEndHandler);

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

    moveSound.play();
      
    if(key === "ArrowUp" && window.inputDir.y !== 1){  
        window.inputDir.x = 0;
        window.inputDir.y = -1;
        
    }
    if(key === "ArrowDown" && window.inputDir.y !== -1){  
        window.inputDir.x = 0;
        window.inputDir.y = 1;
        
    }
    if(key === "ArrowLeft" && window.inputDir.x !== 1){  
        window.inputDir.x = -1;
        window.inputDir.y = 0;
        
    }
    if(key === "ArrowRight" && window.inputDir.x !== -1){  
        window.inputDir.x = 1;
        window.inputDir.y = 0;
        
    }
          
}
  
