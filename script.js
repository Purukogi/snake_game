let snakeHead_elem = document.getElementById("snakeHead");
let playArea_elem = document.getElementById("playArea");
let snakeBody = [];
let appleCoord = {};
let headX = 245;
let headY = 245;
let speedX = 0;
let speedY = 0;
let snakeLength = 3;
let gameStarted = false;
const shadesOfGreen = ["#1E5631", "#A4DE02", "#76BA1B", "#4C9A2A", "#ACDF87", "#68BB59"];


gameSetUp();

window.addEventListener("keydown", (event) => {
    gameStarted = true;
    getDirection(event);
});

let intervalId = setInterval(() => {
    if(gameStarted){        
        if(!(headX < 0 || headX > 490 || headY < 0 || headY > 490)){
            let tmpHeadX = headX;
            let tmpHeadY = headY;
            headX += speedX;
            headY += speedY;
            snakeHead_elem.style.left = headX + "px";
            snakeHead_elem.style.top = headY + "px";

            if(selfIntersect()){
                window.alert("Game over! Your score: " + snakeLength);
                clearInterval(intervalId);
                window.location.reload();
            }

                    
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

            if(headX === appleCoord.appleX && headY === appleCoord.appleY){
                eatApple();
            }

        }else{
            window.alert("Game over! Your score: " + snakeLength );
            clearInterval(intervalId);
            window.location.reload();
        }
    }
}, 100);





/*--------------------------FUNCTIONS-----------------------------*/

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

function gameSetUp(){

    for(let i = 0; i < snakeLength; i++){

        let snakeBodyPiece = document.createElement("div");
        snakeBody[i] = {"xPos" : 245 - (i+1)*10, "yPos" : headY, "piece" : snakeBodyPiece};
        snakeBodyPiece.style.position = "absolute";
        snakeBodyPiece.style.top = snakeBody[i].yPos+"px";
        snakeBodyPiece.style.left = snakeBody[i].xPos+"px";
        snakeBodyPiece.style.height = "10px";
        snakeBodyPiece.style.width = "10px";
        if(i%2 === 0){
            snakeBodyPiece.style.backgroundColor = "rgb(4, 207, 4)";
        }else{
            snakeBodyPiece.style.backgroundColor = "rgb(0,120,0)";
        }      
        playArea_elem.appendChild(snakeBodyPiece);
    }

    placeApple();

}

function placeApple() {

    let randX = Math.floor(490*Math.random());
    randX = randX - (randX%10) + 5;
    let randY = Math.floor(490*Math.random());
    randY = randY - (randY%10) + 5;
    apple = document.createElement("div");
    appleCoord = {"appleX" : randX, "appleY" : randY, "apple" : apple};
    appleCoord.apple.style.left = appleCoord.appleX + "px";
    appleCoord.apple.style.top = appleCoord.appleY + "px";
    apple.classList.add("apple");
    playArea_elem.appendChild(appleCoord.apple);
}

function eatApple(){

    newPieceX = snakeBody[snakeLength-1].xPos - speedX;
    newPieceY = snakeBody[snakeLength-1].yPos - speedY;
    newPieceDiv = document.createElement("div");
    newPiece = {"xPos": newPieceX, "yPos": newPieceY, "piece": newPieceDiv};
    snakeBody.push(newPiece);

    newPieceDiv.style.position = "absolute";
    newPieceDiv.style.top = snakeBody[snakeLength].yPos+"px";
    newPieceDiv.style.left = snakeBody[snakeLength].xPos+"px";
    newPieceDiv.style.height = "10px";
    newPieceDiv.style.width = "10px";
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

function selfIntersect() {

    let isTouching = false;

    snakeBody.forEach( (piece) => {
        isTouching |= headX === piece.xPos && headY === piece.yPos
    });


    return isTouching;
}
