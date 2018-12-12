console.log("Dupa");

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

setInterval(update, 1000 / framesPerSecond);

canvas.addEventListener('mousemove', handleMouse);

function handleMouse (event) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    mouseX = event.clientX - rect.left - root.scrollLeft;
    mouseY = event.clientY - rect.top - root.scrollTop;
    
    paddleX = mouseX - PADDLE_WIDTH / 2;
    // paddleY = mouseY - rect.top - root.scrollTop;
}

function update() {
	moveStuff();
	drawStuff();
}

function resetBall () {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function moveStuff() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    
    if (ballX > canvas.width) {
        ballSpeedX *= -1;
    }
    
    if (ballX < 0) {
        ballSpeedX *= -1;
    }
    if (ballY > canvas.height) {
        resetBall();
        // ballSpeedY *= -1;
    }
    
    if (ballY < 0) {
        ballSpeedY *= -1;
    }
    
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
    }
        
}
    
function drawStuff() {
    
    colorRect(0, 0, canvas.width, canvas.height, '#000');  
    colorCircle(ballX, ballY, 10, '#fff');
    colorRect(paddleX, canvas.height - PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS);
    colorText(mouseX + ', ' + mouseY, mouseX, mouseY, '#fff');
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