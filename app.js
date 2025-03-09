let gstart = true;
let started = false;
let flagArr =[];
let arrBomb = [];
let open =0;
let bomNo = 20;
let flagNo;

//Refresh Button
let refresh = document.querySelector(".refresh");
refresh.addEventListener("click",()=>{
   let grid = document.querySelector('.gamebox');
   if(grid.classList.contains("winborder") || grid.classList.contains("endborder")){
      grid.classList.remove(grid.classList[grid.classList.length-1]);
   }
   gstart = true;
   started=false;
   arrBomb = [];
   flagArr = [];
   open =0;
   for(let i=0;i<16;i++){
      for(let j =0;j<16;j++){
         let box = document.querySelector(`.r${i}c${j}`);
         for (let i = box.children.length - 1; i >= 0; i--) {
            box.removeChild(box.children[i]);
         }

         const classListArray = Array.from(box.classList);
         for (let i = 2; i < classListArray.length; i++) {
           box.classList.remove(classListArray[i]);
         }
      }
   }
   flagNo = bomNo;
   updateFlag();
});


//Making the grid
let grid = document.querySelector(".gamebox");
let row = 0;
let col = 0;
for(let i =0;i<16;i++){
   for(let j=0;j<16;j++){
      let cube = document.createElement('div');
      cube.classList.add("cube");
      cube.classList.add(`r${i}c${j}`);
      grid.append(cube);
      row++;
      col++;
   }
}

//Main code for Game
//adding event listner to boxes
for(let i=0;i<16;i++){
   for(let j=0;j<16;j++){
      let a = document.querySelector(`.r${i}c${j}`);
      //For normal Click
      a.addEventListener("click",()=>{
         if(started==false && gstart==true){
            started =true;
            formTable(i,j);
            show(i,j);
         }else if (started==true){
            if(!a.classList.contains("uncover") && !a.classList.contains("flagg")){
               show(i,j);
            }
         }
      });
      //for Right Click Flag
      a.addEventListener('contextmenu', function(event) {
         event.preventDefault();
         if(started == true && !a.classList.contains("uncover")){
            if(a.classList.contains("flagg")){
               let Child = a.children;
               let img = Child[0];
               img.remove();
               a.classList.remove("flagg");
               flagArr.pop([i,j]);
               flagNo++;
               updateFlag();
            }else{
               let flag = document.createElement('img');
               flag.classList.add("flag");
               a.prepend(flag);
               a.classList.add("flagg"); 
               flagArr.push([i,j]);
               flagNo--;
               updateFlag();
            }
         }
      });
      //For long click Flag
      let holdTimer;
      const holdDuration = 500;
      a.addEventListener('mousedown', function(event) {
         event.preventDefault();
         holdTimer = setTimeout(() => {
            if(started == true && !a.classList.contains("uncover")){
               if(a.classList.contains("flagg")){
                  let Child = a.children;
                  let img = Child[0];
                  img.remove();
                  a.classList.remove("flagg");
                  flagArr.pop([i,j]);
                  flagNo++;
                  updateFlag();
               }else{
                  let flag = document.createElement('img');
                  flag.classList.add("flag");
                  a.prepend(flag);
                  a.classList.add("flagg"); 
                  flagArr.push([i,j]);
                  flagNo--;
                  updateFlag();
               }
            }
            holdTimer = null; // Reset the timer
         }, holdDuration);
       });
   
       a.addEventListener('mouseup', function(event) {
         clearTimeout(holdTimer); // Cancel the timer if the mouse is released
         holdTimer = null;
       });
   
       a.addEventListener('mouseleave', function(event) {
         clearTimeout(holdTimer); // Cancel the timer if the mouse leaves the div
         holdTimer = null;
       });
   }
}

//Forming table at Start
function formTable (i,j){
   let close = [[i,j],[i-1,j-1],[i-1,j],[i-1,j+1],[i,j-1],[i,j+1],[i+1,j-1],[i+1,j],[i+1,j+1]];
   creatBomb(close,arrBomb);
   //Apply bomb on prticular Locations
   for(let i =0;i<arrBomb.length;i++){
      let c = document.querySelector(`.r${arrBomb[i][0]}c${arrBomb[i][1]}`);
      let bom = document.createElement('img');
      bom.classList.add("bomb");
      c.appendChild(bom);
      c.classList.add("boom");
   }
   applyNumbers();
   coverAll();
   flagNo = bomNo;
   updateFlag();
}

//To Generate random Bomb Location
function creatBomb(close,arrBomb){
   let count =0;
   while(count<bomNo){
      let a = Math.floor(Math.random() * 16);
      let b = Math.floor(Math.random() * 16);
      let check = true;
      for(let i=0;i<close.length;i++){
         if(a==close[i][0]&&b==close[i][1]){
            check = false;
         }
      }
      for(let i=0;i<arrBomb.length;i++){
         if(a==arrBomb[i][0]&&b==arrBomb[i][1]){
            check = false;
         }
      }
      if(check){
         arrBomb.push([a,b]);
         count++;
      }
   }
}

//To Add Numbers in Grid
function applyNumbers(){
   for(let i=0;i<16;i++){
      for(let j =0;j<16;j++){
         let box = document.querySelector(`.r${i}c${j}`);
         if(!box.classList.contains("boom")){
            let close = [[i-1,j-1],[i-1,j],[i-1,j+1],[i,j-1],[i,j+1],[i+1,j-1],[i+1,j],[i+1,j+1]];
            let count =0;
            for(let k = 0;k<close.length;k++){
               if(close[k][0]>=0 && close[k][0]<16 && close[k][1]>=0&& close[k][1]<16){
                  let a = document.querySelector(`.r${close[k][0]}c${close[k][1]}`);
                  if(a.classList.contains("boom")){
                     count++;
                  }
               }
            }
            addNum(box,count);
         }
      }
   }
}

//To add Numbers with Colour
function addNum(obj,count){
   if(count == 0){
      obj.classList.add("zero");
   }else{
      let num = document.createElement('p');
      num.classList.add("number");
      num.innerText=`${count}`;
      obj.appendChild(num);
      if(count==1){
         num.classList.add("blue");
      }
      if(count==2){
         num.classList.add("green")
      }
      if(count==3){
         num.classList.add("red");
      }
      if(count==4){
         num.classList.add("darkblue");
      }
      if(count==5){
         num.classList.add("darkred");
      }
      if(count==6){
         num.classList.add("teal");
      }
      if(count==7){
         num.classList.add("voilet");
      }
   }
}

//To Hide all blocks
function coverAll(){
   for(let i =0;i<16;i++){
      for (let j =0;j<16;j++){
         let box = document.querySelector(`.r${i}c${j}`);
         let Ele = box.children;
         if(Ele[0]!= null){
            Ele[0].classList.add("cover");
         }
      }
   }
}

//Work of Click if game Started
function show(i,j){
   let box = document.querySelector(`.r${i}c${j}`);
   if(box.classList.contains("zero")){
      uncover(i,j);
      let close = [[i-1,j-1],[i-1,j],[i-1,j+1],[i,j-1],[i,j+1],[i+1,j-1],[i+1,j],[i+1,j+1]];
      for(let k = 0;k<close.length;k++){
         if(close[k][0]>=0 && close[k][0]<16 && close[k][1]>=0&& close[k][1]<16){
            let a = document.querySelector(`.r${close[k][0]}c${close[k][1]}`);
            if(!a.classList.contains("uncover")){
               show(close[k][0],close[k][1]);
            }
         }
      }
   }
   else if (box.classList.contains("boom")){
      endGame(i,j);
   }else{
      uncover(i,j);
   }
}

//To undo Cover 
function uncover(i,j){
   let box = document.querySelector(`.r${i}c${j}`);
   if(!box.classList.contains("boom")){
      open++;
      if(open>=(256-bomNo)){
         Win();
      }
   }
   box.classList.add("uncover");
   let Ele = box.children;
   if(Ele[0]!= null){
      Ele[0].classList.remove("cover");
   }
}



//To End the Game if Loose
function endGame(i,j){
   let grid = document.querySelector('.gamebox');
   grid.classList.add("endborder");
   started = false;
   gstart = false;
   let box = document.querySelector(`.r${i}c${j}`);
   box.classList.add("end");
   for(let i=0;i<arrBomb.length;i++){
      let b = document.querySelector(`.r${arrBomb[i][0]}c${arrBomb[i][1]}`);
      if(!b.classList.contains("flagg")){
         uncover(arrBomb[i][0],arrBomb[i][1]);
      }
   }
   for(let i=0;i<flagArr.length;i++){
      let b = document.querySelector(`.r${flagArr[i][0]}c${flagArr[i][1]}`);
      if(!b.classList.contains("boom")&&b.classList.contains("flagg")){
         b.classList.add("bgreen");
      }
   }
}

//Wining Condition
function Win(){
   console.log("you Win");
   gstart = false;
   started = false;
   let grid = document.querySelector('.gamebox');
   grid.classList.add("winborder");
}

//Bomb count 


//Flag count
function updateFlag(){
   let flag = document.querySelector(".fcount");
   flag.innerText = `${flagNo}`;
}

//Level Upgrading
let lev = document.querySelector(".level");
levArr = ["Easy","Mediuam","Hard"];
let currLevel = 0;
lev.addEventListener("click",function(){
   if(currLevel==2){
      currLevel =0;
   }else{
      currLevel++;
   }
   let clev = document.querySelector(".tlev");
   clev.innerText = levArr[currLevel];
   if(currLevel==0){
      bomNo = 20;
      UpdateBomb();
      flagNo = bomNo;
      updateFlag();
   }else if(currLevel==1){
      bomNo = 40;
      UpdateBomb();
      flagNo = bomNo;
      updateFlag();
   }else{
      bomNo = 60;
      UpdateBomb();
      flagNo = bomNo;
      updateFlag();
   }
});

//Update bomb Count
function UpdateBomb(){
   let bom = document.querySelector(".bcount");
   bom.innerText = `${bomNo}`;
}

//Help
let help = document.querySelector(".help");
help.addEventListener("click",function(){
   alert('1) Uncover all squares without exploding any mine. 2) Add flag by right click or click and hold. 3) Numbers indicates its surrounding mines');
});
