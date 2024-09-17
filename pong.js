const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Konstanter
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 10;
const PADDLE_SPEED = 4;
const BALL_SPEED_X = 5;
const BALL_SPEED_Y = 3;

let gameMode = null; // Ingen spillmodus valgt ennå

// Spiller valgmuligheter
function showMenu() {
    const menu = document.createElement('div');
    menu.classList.add('menu');
    menu.innerHTML = `
        <h1>Pong</h1>
        <button id="onePlayer">1 Spiller</button>
        <button id="twoPlayers">2 Spillere</button>
    `;
    document.body.appendChild(menu);

    document.getElementById('onePlayer').addEventListener('click', () => {
        gameMode = '1';
        startGame();
    });
    document.getElementById('twoPlayers').addEventListener('click', () => {
        gameMode = '2';
        startGame();
    });
}

// Start spillet
function startGame() {
    document.querySelector('.menu').style.display = 'none';
    resetBall();
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

    ctx.fillStyle = '#fff';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);

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

    if (ball.x - ball.size < 0 || ball.x + ball.size > canvas.width) {
        resetBall();
    }

    if (upPressed && paddle.y > 0) {
        paddle.y -= paddle.speed;
    }
    if (downPressed && paddle.y < canvas.height - paddle.height) {
        paddle.y += paddle.speed;
    }

    if (wPressed && paddle2.y > 0) {
        paddle2.y -= paddle.speed;
    }
    if (sPressed && paddle2.y < canvas.height - paddle2.height) {
        paddle2.y += paddle.speed;
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


