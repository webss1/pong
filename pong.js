const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Konstanter
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 10;
const PADDLE_SPEED = 4;
const BALL_SPEED_X = 5;
const BALL_SPEED_Y = 3;

let gameMode = '2'; // Standard til 2 spillere

function startGame(mode) {
    gameMode = mode;
    document.querySelector('.menu').style.display = 'none';
    requestAnimationFrame(gameLoop);
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = BALL_SPEED_X * (Math.random() > 0.5 ? 1 : -1);
    ball.speedY = BALL_SPEED_Y * (Math.random() > 0.5 ? 1 : -1);
}

const paddle = {
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    x: 0,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    speed: PADDLE_SPEED
};

const paddle2 = {
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    x: canvas.width - PADDLE_WIDTH,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    speed: PADDLE_SPEED
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: BALL_SIZE,
    speedX: BALL_SPEED_X,
    speedY: BALL_SPEED_Y
};

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Tegn padlene
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);

    // Tegn ballen
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function update() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Kollisjon med tak og gulv
    if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
        ball.speedY = -ball.speedY;
    }

    // Kollisjon med padlene
    if (
        ball.x - ball.size < paddle.x + paddle.width &&
        ball.y > paddle.y &&
        ball.y < paddle.y + paddle.height ||
        ball.x + ball.size > paddle2.x &&
        ball.y > paddle2.y &&
        ball.y < paddle2.y + paddle2.height
    ) {
        ball.speedX = -ball.speedX;
    }

    // Ball ut av spillområdet
    if (ball.x - ball.size < 0 || ball.x + ball.size > canvas.width) {
        resetBall();
    }

    // Spiller 1 bevegelse (venstre padle)
    if (upPressed && paddle.y > 0) {
        paddle.y -= paddle.speed;
    }
    if (downPressed && paddle.y < canvas.height - paddle.height) {
        paddle.y += paddle.speed;
    }

    // Spiller 2 bevegelse (høyre padle)
    if (wPressed && paddle2.y > 0) {
        paddle2.y -= paddle.speed;
    }
    if (sPressed && paddle2.y < canvas.height - paddle2.height) {
        paddle2.y += paddle.speed;
    }

    // Enkel AI for 1-spiller modus
    if (gameMode === '1') {
        if (ball.y > paddle2.y + paddle2.height / 2) {
            paddle2.y += paddle2.speed;
        } else {
            paddle2.y -= paddle2.speed;
        }
        paddle2.y = Math.max(Math.min(paddle2.y, canvas.height - paddle2.height), 0);
    }
}

function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
}

// Kontroller input
let upPressed = false;
let downPressed = false;
let wPressed = false;
let sPressed = false;

document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'ArrowUp':
            upPressed = true;
            break;
        case 'ArrowDown':
            downPressed = true;
            break;
        case 'KeyW':
            wPressed = true;
            break;
        case 'KeyS':
            sPressed = true;
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'ArrowUp':
            upPressed = false;
            break;
        case 'ArrowDown':
            downPressed = false;
            break;
        case 'KeyW':
            wPressed = false;
            break;
        case 'KeyS':
            sPressed = false;
            break;
    }
});

resetBall();

