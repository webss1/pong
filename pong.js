const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Konstanter
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 10;
const PADDLE_SPEED = 69;
const BALL_SPEED_X = 10;
const BALL_SPEED_Y = 10;

let gameMode = null; // Ingen spillmodus valgt ennå
let ballSpeedX = BALL_SPEED_X;
let ballSpeedY = BALL_SPEED_Y;
let paddleSpeed = PADDLE_SPEED;

const paddle = {
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    x: 0,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    speed: paddleSpeed
};

const paddle2 = {
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    x: canvas.width - PADDLE_WIDTH,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    speed: paddleSpeed
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: BALL_SIZE,
    speedX: ballSpeedX,
    speedY: ballSpeedY
};

function showMenu() {
    document.getElementById('menu').style.display = 'block';
}

function hideMenu() {
    document.getElementById('menu').style.display = 'none';
}

function showMessage(message) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    setTimeout(() => {
        messageDiv.style.display = 'none';
        resetBall();
    }, 2000); // Vis meldingen i 2 sekunder
}

document.getElementById('onePlayer').addEventListener('click', () => {
    gameMode = '1';
    setGameSpeeds(1);
    hideMenu();
    startGame();
});

document.getElementById('twoPlayers').addEventListener('click', () => {
    gameMode = '2';
    setGameSpeeds(2);
    hideMenu();
    startGame();
});

document.getElementById('redirectButton').addEventListener('click', () => {
    window.location.href = 'https://webss1.github.io/Snart-Helg/';
});

function setGameSpeeds(mode) {
    if (mode === '1') {
        ballSpeedX = BALL_SPEED_X * 3; // Øk ballhastigheten for 1 spiller
        ballSpeedY = BALL_SPEED_Y * 3;
        paddleSpeed = PADDLE_SPEED * 3; // Øk paddlehastigheten for 1 spiller
    } else {
        ballSpeedX = BALL_SPEED_X; // Normal ballhastighet for 2 spillere
        ballSpeedY = BALL_SPEED_Y;
        paddleSpeed = PADDLE_SPEED; // Normal paddlehastighet for 2 spillere
    }
    paddle.speed = paddleSpeed;
    paddle2.speed = paddleSpeed;
}

function startGame() {
    resetBall();
    requestAnimationFrame(gameLoop);
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = ballSpeedX * (Math.random() > 0.5 ? 1 : -1);
    ball.speedY = ballSpeedY * (Math.random() > 0.5 ? 1 : -1);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'red'; // Rød farge for paddlene
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);

    ctx.fillStyle = 'red'; // Rød farge for ballen
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function update() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
        ball.speedY = -ball.speedY;
    }

    if (
        (ball.x - ball.size < paddle.x + paddle.width &&
         ball.y > paddle.y &&
         ball.y < paddle.y + paddle.height) ||
        (ball.x + ball.size > paddle2.x &&
         ball.y > paddle2.y &&
         ball.y < paddle2.y + paddle2.height)
    ) {
        ball.speedX = -ball.speedX;
    }

    if (ball.x - ball.size < 0) {
        showMessage("Høyre siden vant");
    } else if (ball.x + ball.size > canvas.width) {
        showMessage("Venstre siden vant");
    }

    if (upPressed && paddle2.y > 0) {
        paddle2.y -= paddle2.speed;
    }
    if (downPressed && paddle2.y < canvas.height - paddle2.height) {
        paddle2.y += paddle2.speed;
    }

    if (wPressed && paddle.y > 0) {
        paddle.y -= paddle.speed;
    }
    if (sPressed && paddle.y < canvas.height - paddle.height) {
        paddle.y += paddle.speed;
    }

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

// Vis menyen når siden lastes
showMenu();

