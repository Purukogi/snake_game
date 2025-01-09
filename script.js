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
let snakeLength = 3;
let gameStarted = false;
let scoreTable = [0, 0, 0, 0, 0];
let scoreBoard_elem = document.getElementById("scoreBoard");
let smoothTransitionNo_elem = document.getElementById("smoothTransitionNo");
let smoothTransitionYes_elem = document.getElementById("smoothTransitionYes");
let warpBorderNo_elem = document.getElementById("warpBorderNo");
let warpBorderYes_elem = document.getElementById("warpBorderYes");

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
updateScore();
printScoreboard();
setTransitionStyle();
setWarpBorder();

smoothTransitionYes_elem.addEventListener("click", () => {
    localStorage.setItem("transitionStyle", "smooth");
    setTransitionStyle();
    });
smoothTransitionNo_elem.addEventListener("click", () => {
    localStorage.setItem("transitionStyle", "classic");
    setTransitionStyle();
    });
warpBorderYes_elem.addEventListener("click", () => {
    localStorage.setItem("warpBorder", "warp");
    setWarpBorder();
});
warpBorderNo_elem.addEventListener("click", () => {
    localStorage.setItem("warpBorder", "noWarp");
    setWarpBorder();
});

window.addEventListener("keydown", onKeyDown);

/*makes the snake move by repeating instructions every 100ms*/
let intervalId = setInterval(() => {
    if(gameStarted){  
        /*this moves the head
        then moves each part of the body by saving the position of the previous piece
        and moving the next one onto it*/
        let tmpHeadX = headX;
        let tmpHeadY = headY;
        headX += speedX;
        headY += speedY;
        snakeHead_elem.style.left = headX + "px";
        snakeHead_elem.style.top = headY + "px";
        
        if(selfIntersect() || isOutside()){
            window.alert("Game over! Your score: " + (snakeLength - 3));
            clearInterval(intervalId);
            updateScore(snakeLength - 3);                
            window.location.reload();
        }

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

        //checks if the head is on an apple
        if(headX === appleCoord.appleX && headY === appleCoord.appleY){
            eatApple();
        }

    }
}, 100);
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

    //restoring user's ability to input
    setTimeout(() => {
        window.addEventListener("keydown", onKeyDown);
    }, 70);
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


/*place an apple randomly on the play area*/
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

/*when the head touches an apple, adds another piece to the body
then increases the length of the snake and places another apple*/
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
	placeApple();
}

/*checks if the head ever touches the body*/
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
    }else{
        if(localStorage.getItem("transitionStyle") === "smooth"){
            smoothTransitionYes_elem.checked = "checked";
            let transitionStyle_elem = document.getElementById("transitionStyle");
            transitionStyle_elem.innerText = "#playArea div {transition: 0.2s;}";
        }else{
            smoothTransitionNo_elem.checked = "checked";
            let transitionStyle_elem = document.getElementById("transitionStyle");
            transitionStyle_elem.innerText = "#playArea div {transition: 0s;}";
        }
    }
}

function setWarpBorder() {
    if(localStorage.getItem("warpBorder") === null){
        localStorage.setItem("warpBorder", "noWarp");
    }else{
        if(localStorage.getItem("warpBorder") === "warp"){
            warpBorderYes_elem.checked = "checked";
        }else{
            warpBorderNo_elem.checked = "checked";            
        }
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
