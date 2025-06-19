const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 10;
const PLAYER_X = 20;
const AI_X = canvas.width - PADDLE_WIDTH - 20;
const PADDLE_SPEED = 6;
const AI_SPEED = 5;
const BALL_SPEED = 5;

// Game objects
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;

// Keyboard input
let upArrowPressed = false;
let downArrowPressed = false;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: BALL_SPEED * (Math.random() < 0.5 ? 1 : -1),
    vy: BALL_SPEED * (Math.random() * 2 - 1),
};

// Score
let playerScore = 0;
let aiScore = 0;
let highScore = 0; // New high score variable

// Draw functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "32px Arial";
    ctx.fillText(text, x, y);
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
    ball.vy = BALL_SPEED * (Math.random() * 2 - 1);
}

function update() {
    // Move player paddle based on keyboard input
    if (upArrowPressed) {
        playerY -= PADDLE_SPEED;
    }
    if (downArrowPressed) {
        playerY += PADDLE_SPEED;
    }
    // Clamp player paddle within canvas
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));

    // Move ball
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Top and bottom wall collision
    if (ball.y - BALL_RADIUS < 0) {
        ball.y = BALL_RADIUS;
        ball.vy = -ball.vy;
    }
    if (ball.y + BALL_RADIUS > canvas.height) {
        ball.y = canvas.height - BALL_RADIUS;
        ball.vy = -ball.vy;
    }

    // Player paddle collision
    if (
        ball.x - BALL_RADIUS < PLAYER_X + PADDLE_WIDTH &&
        ball.y > playerY &&
        ball.y < playerY + PADDLE_HEIGHT
    ) {
        ball.x = PLAYER_X + PADDLE_WIDTH + BALL_RADIUS;
        ball.vx = -ball.vx;
        // Add some "english" based on where it hits the paddle
        let collidePoint = ball.y - (playerY + PADDLE_HEIGHT / 2);
        ball.vy = collidePoint * 0.2;
    }

    // AI paddle collision
    if (
        ball.x + BALL_RADIUS > AI_X &&
        ball.y > aiY &&
        ball.y < aiY + PADDLE_HEIGHT
    ) {
        ball.x = AI_X - BALL_RADIUS;
        ball.vx = -ball.vx;
        let collidePoint = ball.y - (aiY + PADDLE_HEIGHT / 2);
        ball.vy = collidePoint * 0.2;
    }

    // Left and right wall collision (score)
    if (ball.x - BALL_RADIUS < 0) {
        aiScore++;
        resetBall();
    }
    if (ball.x + BALL_RADIUS > canvas.width) {
        playerScore++;
        if (playerScore > highScore) {
            highScore = playerScore;
        }
        resetBall();
    }

    // AI paddle movement (basic AI)
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (ball.y < aiCenter - 10) {
        aiY -= AI_SPEED;
    } else if (ball.y > aiCenter + 10) {
        aiY += AI_SPEED;
    }
    // Clamp AI paddle within canvas
    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

function render() {
    // Clear
    drawRect(0, 0, canvas.width, canvas.height, "#222");

    // Draw net
    for (let i = 0; i < canvas.height; i += 32) {
        drawRect(canvas.width / 2 - 2, i, 4, 16, "#888");
    }

    // Draw paddles
    drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, "#fff");
    drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, "#fff");

    // Draw ball
    drawCircle(ball.x, ball.y, BALL_RADIUS, "#fff");

    // Draw scores
    drawText(playerScore, canvas.width / 4, 50, "#fff");
    drawText(aiScore, (canvas.width * 3) / 4, 50, "#fff");

    // Update high score display
    document.getElementById('highscore').innerText = 'High Score: ' + highScore;
}

// Keyboard input for player paddle
document.addEventListener('keydown', function(evt) {
    switch (evt.key) {
        case 'ArrowUp':
            upArrowPressed = true;
            break;
        case 'ArrowDown':
            downArrowPressed = true;
            break;
    }
});

document.addEventListener('keyup', function(evt) {
    switch (evt.key) {
        case 'ArrowUp':
            upArrowPressed = false;
            break;
        case 'ArrowDown':
            downArrowPressed = false;
            break;
    }
});

// Mouse movement for player paddle (optional, can be removed if only keyboard is desired)
canvas.addEventListener('mousemove', function(evt) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp within canvas
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Main game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Start
gameLoop();