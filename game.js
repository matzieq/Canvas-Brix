console.log("Dupa");

var canvas = document.querySelector("#gameCanvas");
var canvasContext = canvas.getContext('2d');

var framesPerSecond = 30;

var ballX = 75;
var ballSpeedX = 5;
var ballY = 75;
var ballSpeedY = 7;

setInterval(update, 1000 / framesPerSecond);



function update() {
	moveStuff();
	drawStuff();
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
        ballSpeedY *= -1;
    }
    
    if (ballY < 0) {
        ballSpeedY *= -1;
    }
}
    
function drawStuff() {
    
    colorRect(0, 0, canvas.width, canvas.height, '#000');  
    colorCircle(ballX, ballY, 10, '#fff');
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