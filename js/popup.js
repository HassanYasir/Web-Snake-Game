let popup = `<div class="selectBox">
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
                              </div>`

import {localStorageHasData} from "./index.js";                             

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
function selectionMovementHandler(items,parentElem,slectionElem){
  items.forEach((item => {
    item.addEventListener('click', () => {
      const rect = item.getBoundingClientRect();
      const containerRect = parentElem.getBoundingClientRect();

      const offsetX = rect.left - containerRect.left;
      const offsetY = rect.top - containerRect.top;


      slectionElem.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
  }));
}


let modal = document.getElementsByTagName("dialog")[0];


export const showEndingPopup = ()=>{


  // function for handling selection of setting items eg snake and speed

  function saveSettings(item,setting){
    localStorage.setItem(item, setting);
    showPopUp(`<i class="fa-regular fa-circle-check green"></i>  item selected and setting saved `);
  }

  function saveSlectionCoordinates(item,element,settings){
    const rect = item.getBoundingClientRect();
    const containerRect = element.getBoundingClientRect();
    const offsetX = rect.left - containerRect.left;
    const offsetY = rect.top - containerRect.top;

    const coordinates = {
      "offsetX" : offsetX,
      "offsetY" : offsetY
    }
    const Jsoncoordinates = JSON.stringify(coordinates);
    // localStorage.setItem(settings, Jsoncoordinates);
    saveSettings(settings,Jsoncoordinates);

  }

  function settingLineStyle(line1,line2){
    let slectionWidth = document.querySelectorAll(".selection-img")[0].getBoundingClientRect().width;
    line1.style.width = `${slectionWidth+5}px`;
    line2.style.width = `${slectionWidth+5}px`;
    line1.style.height = `${line1.getBoundingClientRect().width}px`;
    line2.style.height = `${line2.getBoundingClientRect().width}px`;
    
    if(localStorageHasData("offset1") || localStorageHasData("offset2")){

      let offset1 = JSON.parse(localStorageHasData("offset1"));
      let offset2 = JSON.parse(localStorageHasData("offset2"));
      line1.style.transform = `translate(${offset1["offsetX"]}px, ${offset1["offsetY"]}px)`;
      line2.style.transform = `translate(${offset2["offsetX"]}px, ${offset2["offsetY"]}px)`;
    }
  }

    modal.showModal();

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

      let selectSnake = document.querySelector(".snake-select");
      let selectSpeed = document.querySelector(".speed-select");
      let Snakeitems = document.querySelectorAll("#snake-item");
      let Speeditems = document.querySelectorAll("#speed-item");
      let line1 = document.querySelector(".line");
      let line2 = document.querySelector(".line2");

      settingLineStyle(line1,line2);

      selectionMovementHandler(Snakeitems,selectSnake,line1);
      selectionMovementHandler(Speeditems,selectSpeed,line2);
      
      selectSnake.addEventListener("click",(elem)=>{
        let item = elem.target;
        
        saveSlectionCoordinates(item,selectSnake,"offset1");
        saveSettings("Snake",item.getAttribute("src")) 
      });


    selectSpeed.addEventListener("click",(elem)=>{

      
      let item = elem.target;
      let speedSetting = 6;
      
      
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
      saveSlectionCoordinates(item,selectSpeed,"offset2");
      saveSettings("Speed",speedSetting);
    });


      
  });
    exitButton.addEventListener("click",()=>{

        window.close();
    });
}

  
