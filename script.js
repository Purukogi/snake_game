/*-------------------VARIABLE DECLARATIONS--------------------*/

let snakeHead_elem = document.getElementById("snakeHead");
let playArea_elem = document.getElementById("playArea");
//stocks the x and y position and the div of each piece of the body
let snakeBody = [];
//stocks the x and y position and the div of the apple
let appleCoord = {};
//position of the snake head
let headX = 240;
let headY = 240;
//moving direction
let speedX = 0;
let speedY = 0;
let speedIncrease = 0;
let snakeLength = 3;
let gameStarted = false;
let scoreTable = [0, 0, 0, 0, 0];
let scoreBoard_elem = document.getElementById("scoreBoard");
let currentScore_elem = document.getElementById("currentScore");
let onOffBottomDiv_elems = document.getElementsByClassName("onOffBottomDiv");
let borderRules_elem = document.getElementById("borderRules");
let speedRules_elem = document.getElementById("speedRules");
let playAreaBorder_elem = document.getElementById("playAreaBorder");


// -- title zone
const shadesOfGreen = [
	"#1E5631",
	 "#A4DE02",
	 "#76BA1B",
	 "#4C9A2A",
	 "#ACDF87",
	 "#68BB59"
];
const gameTitle = document.getElementsByTagName("h1");

/*-----------------------------MAIN--------------------------*/


addButtonsEvent();
setButtonStatus();
setSpeedRules();
updateScore();
printScoreboard();
setTransitionStyle();
setWarpBorder();

window.addEventListener("keydown", onKeyDown);

/*gameplay loop
makes snake moves and checks for game events*/
let intervalId = setInterval(gameLoop, 100);
gameTitle.forEach(shuffleGreen());

/*--------------------------FUNCTIONS-----------------------------*/

//dictates what happens when user presses a key
function onKeyDown(event){
    //temporarily disabling the user input to avoid sharp u-turns into yourself
    window.removeEventListener("keydown", onKeyDown);

    //if clause to avoid game over on non arrow keys pressed
    if(event.keyCode >= 37 && event.keyCode <= 40){
        //sets up the game for first user input
        if(!gameStarted){
            gameSetUp(event);
            gameStarted = true;
        }
        /*once game has started the event listener just updates the moving direction
        based on user input
        */        
        getDirection(event);
    }

    /*restoring user's ability to input
    restoring speed is based on gamespeed
    */
    setTimeout(() => {
        window.addEventListener("keydown", onKeyDown);
    }, Math.max((100 - speedIncrease)/2, 0));
}

/*sets snake moving direction depending on last key pressed
the if clause prevents u-turning directly into the snake*/
function getDirection(event){
    switch(event.keyCode){
        case 37:
            if(speedX === 10){
                break;
            }
            speedX = -10;
            speedY = 0;
            break;
        case 38:
            if(speedY === 10){
                break;
            }
            speedX = 0;
            speedY = -10;
            break;
        case 39:
            if(speedX === -10){
                break;
            }
            speedX = 10;
            speedY = 0;
            break;
        case 40:
            if(speedY === -10){
                break;
            }
            speedX = 0;
            speedY = 10
            break;
        default:
            console.log("invalid input");
            break;   
    }
}


/*gets the direction selected by the user
creates 3 initial parts of the body of the snake in that direction
places an apple randomly*/
function gameSetUp(event){

    getDirection(event);

    for(let i = 0; i < snakeLength; i++){        
        /*creates the initial body pieces and adds it to the array of body pieces
        then sets style for the new piece
        might be able to replace the if statement with css as well*/
        let snakeBodyPiece = document.createElement("div");
        snakeBody[i] = {"xPos" : 240 - (i + 1)*speedX, "yPos" : 240 - (i + 1)*speedY, "piece" : snakeBodyPiece};
        snakeBodyPiece.classList.add("snakeBodyClass")
        snakeBodyPiece.style.top = snakeBody[i].yPos+"px";
        snakeBodyPiece.style.left = snakeBody[i].xPos+"px";
        if(i%2 === 0){
            snakeBodyPiece.style.backgroundColor = "rgb(4, 207, 4)";
        }else{
            snakeBodyPiece.style.backgroundColor = "rgb(0,120,0)";
        }      
        playArea_elem.appendChild(snakeBodyPiece);
    }

	placeApple();
}

function gameLoop() {
    if(gameStarted){  
        /*this moves the head
        then moves each part of the body by saving the position of the previous piece
        and moving the next one onto it*/
        let tmpHeadX = headX;
        let tmpHeadY = headY;
        headX += speedX;
        headY += speedY;        
        
        if(isOutside()) {
            if(localStorage.getItem("warpBorder") === "noWarp"){
                gameOver();
            }else{
                warpHead();                
            }
        }
        snakeHead_elem.style.left = headX + "px";
        snakeHead_elem.style.top = headY + "px";
        
        

        //this moves the body       
        for(let i = 0; i < snakeLength; i++){
            let tmpX = snakeBody[i].xPos;
            let tmpY = snakeBody[i].yPos;
            snakeBody[i].xPos = tmpHeadX;
            snakeBody[i].yPos = tmpHeadY;
            tmpHeadX = tmpX;
            tmpHeadY = tmpY;
            snakeBody[i].piece.style.left = snakeBody[i].xPos + "px";
            snakeBody[i].piece.style.top = snakeBody[i].yPos + "px";
        }

        if(selfIntersect()){            
            gameOver();
        }

        if(headX === appleCoord.appleX && headY === appleCoord.appleY){
            eatApple();
            if(localStorage.getItem("speedIncrease") === "increase"){
                if(snakeLength % 25 === 3) {
                    increaseSpeed();            
                }
            }
        }

        
    }
}


function placeApple() {
    
    /*this checks that the apple does not spawn on the snake
    the offset is here to make sure the apple is aligned with the head*/
    let appleOnSnake = false;
    let randX = 0;
    let randY = 0;
    do{
        appleOnSnake = false;
        randX = Math.floor(490*Math.random());
        randX = randX - (randX%10);
        randY = Math.floor(490*Math.random());
        randY = randY - (randY%10);
        snakeBody.forEach( (piece) => {
            appleOnSnake |= randX === piece.xPos && randY === piece.yPos;
        });
    }while(appleOnSnake)
    
    apple = document.createElement("div");
    appleCoord = {"appleX" : randX, "appleY" : randY, "apple" : apple};
    appleCoord.apple.style.left = appleCoord.appleX + "px";
    appleCoord.apple.style.top = appleCoord.appleY + "px";
    apple.classList.add("apple");
    playArea_elem.appendChild(appleCoord.apple);
}

function eatApple(){

    /*creates the new piece and adds it to the array of body pieces*/
    newPieceX = snakeBody[snakeLength - 1].xPos;
    newPieceY = snakeBody[snakeLength - 1].yPos;
    newPieceDiv = document.createElement("div");
    newPiece = {"xPos": newPieceX, "yPos": newPieceY, "piece": newPieceDiv};
    snakeBody.push(newPiece);

    /*sets style for the new piece
    might be able to replace the if statement with css as well*/
    newPieceDiv.classList.add("snakeBodyClass");
    newPieceDiv.style.top = snakeBody[snakeLength].yPos+"px";
    newPieceDiv.style.left = snakeBody[snakeLength].xPos+"px";
    if(snakeLength%2 === 0){
        newPieceDiv.style.backgroundColor = "rgb(4, 207, 4)";
    }else{
        newPieceDiv.style.backgroundColor = "rgb(0,120,0)";
    }     

	playArea_elem.appendChild(newPieceDiv);

    snakeLength++;
    appleCoord.apple.style.display = "none";
    currentScore_elem.lastElementChild.innerText = snakeLength - 3;
    placeApple();
	
}


function selfIntersect() {

    let isTouching = false;
    snakeBody.forEach( (piece) => {
        isTouching |= headX === piece.xPos && headY === piece.yPos;
    });
    return isTouching;
}

function isOutside(){
    return (headX < 0 || headX > 490 || headY < 0 || headY > 490);
}

function increaseSpeed() {
    speedIncrease += 10;    
    clearInterval(intervalId);
    intervalId = setInterval(gameLoop, Math.max((100 - speedIncrease), 0));
}

function updateScore(score){
    if(localStorage.getItem("scoreTable") !== null){
        scoreTable = localStorage.getItem("scoreTable");
        scoreTable = JSON.parse(scoreTable);
    }
    scoreTable.push(score);
    scoreTable = scoreTable.sort((a, b) => b - a);
    if(scoreTable.length > 5){
        scoreTable.pop();
    }
    localStorage.setItem("scoreTable", JSON.stringify(scoreTable));
}

/*we separate print scoreboard and update score to avoid flashing when updating scores
*/
function printScoreboard(){
    scoreTable.forEach( score => {
        let scoreToAdd = document.createElement("li");
        scoreToAdd.innerText = score;
        scoreBoard_elem.appendChild(scoreToAdd);
    })
}

function setTransitionStyle(){
    if(localStorage.getItem("transitionStyle") === null){
        localStorage.setItem("transitionStyle", "classic");
        playArea_elem.classList.add("classicTransition");
    }else{
        if(localStorage.getItem("transitionStyle") === "smooth"){
            playArea_elem.classList.add("smoothTransition");
            playArea_elem.classList.remove("classicTransition");            
        }else{
            playArea_elem.classList.add("classicTransition");
            playArea_elem.classList.remove("smoothTransition"); 
        }
    }
}

function setWarpBorder() {
    if(localStorage.getItem("warpBorder") === null){
        localStorage.setItem("warpBorder", "noWarp");
    }else{
        if(localStorage.getItem("warpBorder") === "warp"){
            borderRules_elem.innerText = "Crossing a border teleports you to the other side.";
            playAreaBorder_elem.style.border = "5px dashed brown";
        }else{
            borderRules_elem.innerText = "You lose if you touch the border.";       
            playAreaBorder_elem.style.border = "5px solid brown";    
        }
    }
}

function setSpeedRules() {
    if(localStorage.getItem("speedIncrease") === null){
        localStorage.setItem("speedIncrease", "noIncrease");
    }else{
        if(localStorage.getItem("speedIncrease") === "increase"){
            speedRules_elem.innerText = "Speed increases every 25 apples.";
        }else{
            speedRules_elem.innerText = "Speed stays the same during the game.";     
        }
    }
}

function gameOver() {
    clearInterval(intervalId);
    window.alert("Game over! Your score: " + (snakeLength - 3));    
    updateScore(snakeLength - 3);                
    window.location.reload();
}

function warpHead(){
    if(headX < 0){
        headX = 490;
    }
    if(headX > 490){
        headX = 0;
    }
    if(headY < 0 ){
        headY = 490;
    }
    if(headY > 490){
        headY = 0;
    }
}

function addButtonsEvent(){
    for(let i = 0; i < onOffBottomDiv_elems.length; i ++){
        onOffBottomDiv_elems.item(i).addEventListener("click", () =>{ 
            swapButtonStatus(onOffBottomDiv_elems.item(i));
            updateUserPreference(onOffBottomDiv_elems.item(i));
        });
    }    
}

function swapButtonStatus(element) {    
    if(element.classList.contains("buttonOff")){
        element.classList.remove("buttonOff");
        element.lastElementChild.style.left = "16px";
        element.style.backgroundColor = "green";
    }else{
        element.classList.add("buttonOff");
        element.lastElementChild.style.left = "1px";
        element.style.backgroundColor = "grey";
    }    
}

function setButtonStatus(){
    if (localStorage.getItem("transitionStyle") === "smooth") {
        swapButtonStatus(onOffBottomDiv_elems.item(0));        
    }
    if (localStorage.getItem("warpBorder") === "warp") {
        swapButtonStatus(onOffBottomDiv_elems.item(1));        
    }
    if (localStorage.getItem("speedIncrease") === "increase") {
        swapButtonStatus(onOffBottomDiv_elems.item(2));        
    }
}

function updateUserPreference(element){
    switch (element.id) {
        case "offSwitchTransition":
            if (localStorage.getItem("transitionStyle") === "smooth") {
                localStorage.setItem("transitionStyle", "classic");        
            }else{
                localStorage.setItem("transitionStyle", "smooth");
            }
            setTransitionStyle();
            break;
        case "offSwitchWarp":
            if (localStorage.getItem("warpBorder") === "warp") {
                localStorage.setItem("warpBorder", "noWarp");        
            }else{
                localStorage.setItem("warpBorder", "warp");
            }
            setWarpBorder();
            break;
        case "offSwitchSpeed":
            if (localStorage.getItem("speedIncrease") === "increase") {
                localStorage.setItem("speedIncrease", "noIncrease");                      
            }else{
                localStorage.setItem("speedIncrease", "increase");                
            }
            setSpeedRules();
            break;     
        default:
            console.log("something went wrong updateUserPreference");            
            break;
    }
}


/* -----------------------------
   -      STYLE FUNCTIONS      -
   ----------------------------- */
//TODO : write function for letter going to green
function shuffleTitleGreen(title) {
	pass;
}
function redTitle() {
	pass;
}
