

var canvas = document.querySelector("#gameCanvas");
var canvasContext = canvas.getContext('2d');

var framesPerSecond = 30;

var ballX = 75;
var ballSpeedX = 5;
var ballY = 75;
var ballSpeedY = 7;

var PADDLE_WIDTH = 100;
var PADDLE_THICKNESS = 10;
var PADDLE_DIST_FROM_EDGE = 60;
var paddleX = 400;
var mouseX;
var mouseY;

var bricksLeft = 0;

var BRICK_W = 80;
var BRICK_H = 20;
// var BRICK_H = 40;
var BRICK_COLS = 10;
var BRICK_ROWS = 14;
// var BRICK_ROWS = 7;

var BRICK_GAP = 2;

var brickGrid = new Array(BRICK_COLS * BRICK_ROWS);
setInterval(update, 1000 / framesPerSecond);

canvas.addEventListener('mousemove', handleMouse);
brickReset();
resetBall();

function brickReset() {
    bricksLeft = 0;
    var i = 0
    for (i = 0; i < 3* BRICK_COLS; i++) {
        brickGrid[i] = false;
    }
    for (; i < BRICK_COLS * BRICK_ROWS; i++) {
        brickGrid[i] = true;
        bricksLeft++;
    }
}

function handleMouse (event) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    mouseX = event.clientX - rect.left - root.scrollLeft;
    mouseY = event.clientY - rect.top - root.scrollTop;
    
    paddleX = mouseX - PADDLE_WIDTH / 2;
    // ballX = mouseX;
    // ballY = mouseY;
    // ballSpeedX = 3;
    // ballSpeedY = -4;
}

function update() {
	moveStuff();
	drawStuff();
}

function resetBall () {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    
    if (ballX > canvas.width && ballSpeedX > 0.0) {
        ballSpeedX *= -1;
    }
    
    if (ballX < 0 && ballSpeedX < 0.0) {
        ballSpeedX *= -1;
    }
    if (ballY > canvas.height) {
        resetBall();
        brickReset();
    }
    
    if (ballY < 0 && ballSpeedY < 0.0) {
        ballSpeedY *= -1;
    }
}

function isBrickAtColRow(col, row) {
    if (col >= 0 && col < BRICK_COLS &&
        row >= 0 && row < BRICK_ROWS) {        
        var brickIndexUnderCoord = rowColToArrayIndex(col, row);
        return brickGrid[brickIndexUnderCoord];
    } else {
        return false;
    }

}

function handleBallAndBrick() {  
    var ballBrickCol = Math.floor(ballX / BRICK_W);
    var ballBrickRow = Math.floor(ballY / BRICK_H);
    var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);
    
    if (ballBrickCol >= 0 && ballBrickCol < BRICK_COLS &&
        ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS) {
            
        if (isBrickAtColRow(ballBrickCol, ballBrickRow)) {
            brickGrid[brickIndexUnderBall] = false;
            bricksLeft--;
            // console.log(bricksLeft);
            
            var prevBallX = ballX - ballSpeedX;
            var prevBallY = ballY - ballSpeedY;
            var prevBrickCol = Math.floor(prevBallX / BRICK_W);
            var prevBrickRow = Math.floor(prevBallY / BRICK_H);
            
            var bothTestsFailed = true;
            if (prevBrickCol !== ballBrickCol) {
                if (!isBrickAtColRow(prevBrickCol, ballBrickRow)) {                    
                    ballSpeedX *= -1;
                    bothTestsFailed = false;
                }
            }
            if (prevBrickRow !== ballBrickRow) {
                if (!isBrickAtColRow(ballBrickCol, prevBrickRow)) {
                    ballSpeedY *= -1;       
                    bothTestsFailed = false;
                }
            }
            
            if (bothTestsFailed) {
                ballSpeedX *= -1;
                ballSpeedY *= -1;
            }
        }
    }
}

function handleBallAndPaddle() {
    var paddleTopEdgeY = canvas.height - PADDLE_DIST_FROM_EDGE;
    var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
    var paddleLeftEdgeX = paddleX;
    var paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH;
    if (ballY > paddleTopEdgeY 
        && ballY < paddleBottomEdgeY 
        && ballX > paddleLeftEdgeX
        && ballX < paddleRightEdgeX) {
        ballSpeedY *= -1;
        
        var centerOfPaddleX = paddleX + PADDLE_WIDTH / 2;
        var ballDistFromPaddleCenter = ballX - centerOfPaddleX;
        ballSpeedX = ballDistFromPaddleCenter * 0.35;
        if (bricksLeft === 0) {
            brickReset();
        }
    }
}

function moveStuff() {
    moveBall();
    handleBallAndBrick();
    handleBallAndPaddle();      
}

function rowColToArrayIndex(col, row) {
    return col + BRICK_COLS * row;
}

function drawBricks() {
    for (var row = 0; row < BRICK_ROWS; row++) {        
        for (var col = 0; col < BRICK_COLS; col++) {
            var arrayIndex = rowColToArrayIndex(col, row);
            if (brickGrid[arrayIndex]) {
                colorRect(BRICK_W * col, BRICK_H * row, BRICK_W - BRICK_GAP, BRICK_H - BRICK_GAP, 'dodgerblue');            
            }
        }
    }
}
    
function drawStuff() {
    
    colorRect(0, 0, canvas.width, canvas.height, '#000');  
    colorCircle(ballX, ballY, 10, '#fff');
    colorRect(paddleX, canvas.height - PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS);
    
    drawBricks();
    var mouseBrickCol = Math.floor(mouseX / BRICK_W);
    var mouseBrickRow = Math.floor(mouseY / BRICK_H);
    var brickIndexUnderMouse = rowColToArrayIndex(mouseBrickCol, mouseBrickRow);
    colorText(mouseBrickCol + ', ' + mouseBrickRow + ":" + brickIndexUnderMouse, mouseX, mouseY, '#fff');
}

function colorRect(x, y, width, height, color) {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
}

function colorCircle(x, y, radius, color) {
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(x, y, radius, 0, Math.PI * 2, true);
    canvasContext.fill();  
}

function colorText(textToShow, textX, textY, color) {
    canvasContext.fillStyle = color;
    canvasContext.fillText(textToShow, textX, textY);
}