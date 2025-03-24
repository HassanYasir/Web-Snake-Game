let popup = `<div class="selectBox">
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

export let pause = false;
let modal = document.getElementsByTagName("dialog")[0];


export const showEndingPopup = ()=>{

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
      targetBox.innerHTML = popup;
    
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

  
