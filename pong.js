const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;
const paddleSpeed = 4;
const ballSpeed = 4;

// Paddle og ball
const leftPaddle = { x: 0, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, dy: 0 };
const rightPaddle = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, dy: 0 };
const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: ballSize / 2, dx: ballSpeed, dy: ballSpeed };

// Poengsystem
let leftScore = 0;
let rightScore = 0;
let winnerMessage = ""; // For å vise hvilken side som vant
let gamePaused = false; // Variabel for å pause spillet etter et mål

// Tegn paddle, ball, poeng og beskjed
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Venstre paddle (rød)
    ctx.fillStyle = 'red';
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);

    // Høyre paddle (rød)
    ctx.fillStyle = 'red';
    ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

    // Ball (rød)
    if (!gamePaused) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }

    // Poeng
    ctx.font = '24px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText('Venstre: ' + leftScore, canvas.width / 4, 30);
    ctx.fillText('Høyre: ' + rightScore, 3 * canvas.width / 4, 30);

    // Beskjed utenfor boksen
    ctx.font = '18px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText('Venstre bruker W & S. Høyre bruker Pil opp og Pil ned', canvas.width / 2, canvas.height - 10);

    // Vise vinnerbeskjed hvis ballen har truffet en vegg
    if (winnerMessage) {
        ctx.font = '30px Arial';
        ctx.fillStyle = '#fff';
        ctx.fillText(winnerMessage, canvas.width / 2, canvas.height / 2);
    }
}

// Oppdater ballposisjon og håndter poeng
function update() {
    if (gamePaused) return; // Hvis spillet er pauset, ikke oppdater

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Kollisjon med toppen og bunnen av skjermen
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    // Kollisjon med paddles
    if (ball.x - ball.radius < leftPaddle.x + leftPaddle.width && ball.y > leftPaddle.y && ball.y < leftPaddle.y + leftPaddle.height) {
        ball.dx *= -1;
    }

    if (ball.x + ball.radius > rightPaddle.x && ball.y > rightPaddle.y && ball.y < rightPaddle.y + rightPaddle.height) {
        ball.dx *= -1;
    }

    // Ball utenfor skjermen - bestem vinner
    if (ball.x - ball.radius < 0) {
        rightScore++; // Høyre spiller vinner
        displayWinnerMessage('Høyre side vant!');
    }

    if (ball.x + ball.radius > canvas.width) {
        leftScore++; // Venstre spiller vinner
        displayWinnerMessage('Venstre side vant!');
    }

    // Oppdater paddleposisjoner
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;

    // Begrensning av paddle-bevegelser
    if (leftPaddle.y < 0) leftPaddle.y = 0;
    if (leftPaddle.y + leftPaddle.height > canvas.height) leftPaddle.y = canvas.height - leftPaddle.height;
    if (rightPaddle.y < 0) rightPaddle.y = 0;
    if (rightPaddle.y + rightPaddle.height > canvas.height) rightPaddle.y = canvas.height - rightPaddle.height;
}

// Tilbakestill ballen til midten etter 5 sekunder og fjern meldingen
function resetBall() {
    setTimeout(() => {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
        ball.dy = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
        winnerMessage = ""; // Fjern vinnerbeskjed
        gamePaused = false; // Fortsett spillet
    }, 5000); // 5 sekunder pause før spillet starter igjen
}

// Vis vinnerbeskjed og paus spill
function displayWinnerMessage(message) {
    winnerMessage = message;
    gamePaused = true; // Pause spillet
    resetBall(); // Tilbakestill ballen etter 5 sekunder
}

// Kontroller paddle-bevegelser (W/S for venstre, pil opp/ned for høyre)
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'w':
            leftPaddle.dy = -paddleSpeed;
            break;
        case 's':
            leftPaddle.dy = paddleSpeed;
            break;
        case 'ArrowUp':
            rightPaddle.dy = -paddleSpeed;
            break;
        case 'ArrowDown':
            rightPaddle.dy = paddleSpeed;
            break;
    }
});

document.addEventListener('keyup', function(event) {
    switch(event.key) {
        case 'w':
        case 's':
            leftPaddle.dy = 0;
            break;
        case 'ArrowUp':
        case 'ArrowDown':
            rightPaddle.dy = 0;
            break;
    }
});

// Spill loop
function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
}

gameLoop();
