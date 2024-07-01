const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const PADDLE_WIDTH = 60;
const PADDLE_HEIGHT = 10;
const PADDLE_Y_OFFSET = 30;
const BALL_RADIUS = 10;
const BRICK_WIDTH = 36;
const BRICK_HEIGHT = 8;
const BRICK_SEP = 4;
const NBRICKS_PER_ROW = 10;
const NBRICK_ROWS = 10;
const BRICK_Y_OFFSET = 70;
const NTURNS = 3;

let paddleX = (canvas.width - PADDLE_WIDTH) / 2;
let rightPressed = false;
let leftPressed = false;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let dx = 2;
let dy = -4;
let brickRowCount = 10;
let brickColumnCount = 10;
let bricks = [];
let lives = NTURNS;

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - PADDLE_WIDTH / 2;
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - PADDLE_Y_OFFSET - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (BRICK_WIDTH + BRICK_SEP) + BRICK_SEP;
                const brickY = r * (BRICK_HEIGHT + BRICK_SEP) + BRICK_Y_OFFSET;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
                ctx.fillStyle = getBrickColor(r);
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function getBrickColor(row) {
    if (row < 2) return 'red';
    if (row < 4) return 'orange';
    if (row < 6) return 'yellow';
    if (row < 8) return 'green';
    return 'cyan';
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (ballX > b.x && ballX < b.x + BRICK_WIDTH && ballY > b.y && ballY < b.y + BRICK_HEIGHT) {
                    dy = -dy;
                    b.status = 0;
                    if (--brickRowCount === 0) {
                        alert('YOU WIN, CONGRATULATIONS!');
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    if (ballX + dx > canvas.width - BALL_RADIUS || ballX + dx < BALL_RADIUS) {
        dx = -dx;
    }
    if (ballY + dy < BALL_RADIUS) {
        dy = -dy;
    } else if (ballY + dy > canvas.height - BALL_RADIUS) {
        if (ballX > paddleX && ballX < paddleX + PADDLE_WIDTH) {
            dy = -dy;
        } else {
            if (--lives === 0) {
                alert('GAME OVER');
                document.location.reload();
            } else {
                ballX = canvas.width / 2;
                ballY = canvas.height - 30;
                dx = 3;
                dy = -3;
                paddleX = (canvas.width - PADDLE_WIDTH) / 2;
            }
        }
    }

    if (rightPressed && paddleX < canvas.width - PADDLE_WIDTH) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    ballX += dx;
    ballY += dy;
    requestAnimationFrame(draw);
}

draw();
// Variables to keep track of score and lives
let score = 0;
let lives = NTURNS;

// Function to draw the score on the canvas
function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText('Score: ' + score, 8, 20);
}

// Function to draw the lives remaining on the canvas
function drawLives() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
}

// Function to detect collision with the bricks
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (ballX > b.x && ballX < b.x + BRICK_WIDTH && ballY > b.y && ballY < b.y + BRICK_HEIGHT) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score === brickRowCount * brickColumnCount) {
                        alert('YOU WIN, CONGRATULATIONS!');
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// Main draw function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    // Bounce off the left and right walls
    if (ballX + dx > canvas.width - BALL_RADIUS || ballX + dx < BALL_RADIUS) {
        dx = -dx;
    }
    // Bounce off the top wall
    if (ballY + dy < BALL_RADIUS) {
        dy = -dy;
    }
    // Detect collision with the paddle
    else if (ballY + dy > canvas.height - BALL_RADIUS) {
        if (ballX > paddleX && ballX < paddleX + PADDLE_WIDTH) {
            dy = -dy;
        } else {
            lives--;
            if (!lives) {
                alert('GAME OVER');
                document.location.reload();
            } else {
                ballX = canvas.width / 2;
                ballY = canvas.height - 30;
                dx = 3;
                dy = -3;
                paddleX = (canvas.width - PADDLE_WIDTH) / 2;
            }
        }
    }

    // Move the paddle
    if (rightPressed && paddleX < canvas.width - PADDLE_WIDTH) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    ballX += dx;
    ballY += dy;
    requestAnimationFrame(draw);
}

// Initialize the game
draw();
