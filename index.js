document.addEventListener("DOMContentLoaded", function () {
    const blockSize = 25;
    const rows = 20;
    const cols = 20;
    let board, context;
    let snakeX = blockSize * 5;
    let snakeY = blockSize * 5;
    let velocityX = 0;
    let velocityY = 0;
    let snakeBody = [];
    let foodX, foodY;
    let obstacles = []; // Novo: Array para armazenar a posição dos obstáculos
    let gameOver = false;
    let score = 0;
    let speed = 1; // Novo: Velocidade inicial da cobra

    function init() {
        board = document.getElementById("board");
        board.height = rows * blockSize;
        board.width = cols * blockSize;
        context = board.getContext("2d");
        placeFood();
        generateObstacles(); // Novo: Gera obstáculos
        document.addEventListener("keyup", changeDirection);
        setInterval(update, 1000 / 10);
    }

    function update() {
        if (gameOver) {
            return;
        }

        clearBoard();
        drawObstacles(); // Novo: Desenha os obstáculos
        drawFood();
        moveSnake();
        drawSnake();
        checkCollisions();
    }

    function clearBoard() {
        context.fillStyle = "black";
        context.fillRect(0, 0, board.width, board.height);
    }

    function drawFood() {
        context.fillStyle = "red";
        context.fillRect(foodX, foodY, blockSize, blockSize);
    }

    function drawObstacles() {
        context.fillStyle = "gray";
        for (let i = 0; i < obstacles.length; i++) {
            context.fillRect(obstacles[i][0], obstacles[i][1], blockSize, blockSize);
        }
    }

    function moveSnake() {
        const newHead = [snakeX + velocityX * blockSize, snakeY + velocityY * blockSize];
        snakeBody.unshift([snakeX, snakeY]);
        if (snakeX === foodX && snakeY === foodY) {
            placeFood();
            score += 1;
            speed += 0.1; // Novo: Aumenta a velocidade quando come uma comida
            updateScore();
        } else {
            snakeBody.pop();
        }
        snakeX = newHead[0];
        snakeY = newHead[1];

        // Novo: Permite que a cobra atravesse as paredes
        if (snakeX < 0) snakeX = cols * blockSize - blockSize;
        if (snakeX >= cols * blockSize) snakeX = 0;
        if (snakeY < 0) snakeY = rows * blockSize - blockSize;
        if (snakeY >= rows * blockSize) snakeY = 0;
    }

    function drawSnake() {
        context.fillStyle = "lime";
        context.fillRect(snakeX, snakeY, blockSize, blockSize);

        context.fillStyle = "lime";
        for (let i = 0; i < snakeBody.length; i++) {
            context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
        }
    }

    function generateObstacles() {
        // Novo: Gera aleatoriamente obstáculos na tela
        for (let i = 0; i < 5; i++) {
            const obstacleX = Math.floor(Math.random() * cols) * blockSize;
            const obstacleY = Math.floor(Math.random() * rows) * blockSize;
            obstacles.push([obstacleX, obstacleY]);
        }
    }

    function gameOverHandler() {
        gameOver = true;
        alert("Game Over. Your Score: " + score);
        location.reload();
    }

    function checkCollisions() {
        // Novo: Verifica colisões com obstáculos
        if (obstacles.some(obstacle => obstacle[0] === snakeX && obstacle[1] === snakeY)) {
            gameOverHandler();
        }

        // Restante do código permanece igual
        if (
            snakeX < 0 || snakeX >= cols * blockSize ||
            snakeY < 0 || snakeY >= rows * blockSize ||
            snakeBody.some(part => part[0] === snakeX && part[1] === snakeY)
        ) {
            gameOverHandler();
        }
    }

    function changeDirection(e) {
        switch (e.code) {
            case "ArrowUp":
            case "KeyW":
                if (velocityY !== 1) {
                    velocityX = 0;
                    velocityY = -1;
                }
                break;
            case "ArrowDown":
            case "KeyS":
                if (velocityY !== -1) {
                    velocityX = 0;
                    velocityY = 1;
                }
                break;
            case "ArrowLeft":
            case "KeyA":
                if (velocityX !== 1) {
                    velocityX = -1;
                    velocityY = 0;
                }
                break;
            case "ArrowRight":
            case "KeyD":
                if (velocityX !== -1) {
                    velocityX = 1;
                    velocityY = 0;
                }
                break;
        }
    }

    function placeFood() {
        foodX = Math.floor(Math.random() * cols) * blockSize;
        foodY = Math.floor(Math.random() * rows) * blockSize;
    }

    function updateScore() {
        document.getElementById('score').innerText = 'Score: ' + score;
    }

    init();
});