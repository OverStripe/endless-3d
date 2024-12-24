// Game Variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScore = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

let gameRunning = false;
let gameOver = false;
let score = 0;

// Player Object
const player = {
    x: 50,
    y: 300,
    width: 50,
    height: 50,
    speed: 5,
    velocityY: 0,
    gravity: 0.5,
    jumping: false,
    sprite: new Image()
};
player.sprite.src = 'assets/bike.png';

// Background
const background = {
    image: new Image(),
    x: 0,
    speed: 2
};
background.image.src = 'assets/background.png';

// Obstacles
const obstacles = [];
let obstacleTimer = 0;
const obstacleInterval = 100;

// Power-ups
const powerUps = [];
let powerUpTimer = 0;
const powerUpInterval = 5000;

// Handle Player Movement
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !player.jumping && gameRunning) {
        player.jumping = true;
        player.velocityY = -10;
    } else if (e.code === 'Space' && !gameRunning) {
        startGame();
    }
});

// Start Game
function startGame() {
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    gameRunning = true;
    gameOver = false;
    score = 0;
    obstacles.length = 0;
    powerUps.length = 0;
    gameLoop();
}

// Restart Game
restartButton.addEventListener('click', startGame);

// Game Loop
function gameLoop() {
    if (gameOver) {
        gameOverScreen.style.display = 'block';
        finalScore.innerText = score;
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background Scrolling
    background.x -= background.speed;
    if (background.x <= -canvas.width) background.x = 0;
    ctx.drawImage(background.image, background.x, 0, canvas.width, canvas.height);
    ctx.drawImage(background.image, background.x + canvas.width, 0, canvas.width, canvas.height);

    // Draw Player
    ctx.drawImage(player.sprite, player.x, player.y, player.width, player.height);

    // Gravity
    if (player.jumping) {
        player.y += player.velocityY;
        player.velocityY += player.gravity;
        if (player.y >= 300) {
            player.y = 300;
            player.jumping = false;
        }
    }

    // Obstacles
    if (obstacleTimer % obstacleInterval === 0) {
        obstacles.push({
            x: canvas.width,
            y: 330,
            width: 30,
            height: 30,
            color: 'green'
        });
    }
    obstacleTimer++;

    obstacles.forEach((obstacle, index) => {
        obstacle.x -= 5;

        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            gameOver = true;
        }

        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            score++;
            document.getElementById('score').innerText = `Score: ${score}`;
        }
    });

    // Power-ups
    if (powerUpTimer % powerUpInterval === 0) {
        powerUps.push({
            x: canvas.width,
            y: 250,
            width: 20,
            height: 20,
            color: 'yellow'
        });
    }
    powerUpTimer++;

    powerUps.forEach((powerUp, index) => {
        powerUp.x -= 4;
        ctx.fillStyle = powerUp.color;
        ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);

        if (
            player.x < powerUp.x + powerUp.width &&
            player.x + player.width > powerUp.x &&
            player.y < powerUp.y + powerUp.height &&
            player.y + player.height > powerUp.y
        ) {
            score += 5;
            powerUps.splice(index, 1);
        }
    });

    requestAnimationFrame(gameLoop);
}
