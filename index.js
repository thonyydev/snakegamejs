// Evento que é acionado quando o DOM (Document Object Model) é totalmente carregado
document.addEventListener("DOMContentLoaded", function () {
    // Tamanho de cada bloco no jogo
    const blockSize = 25;

    // Número de linhas e colunas no tabuleiro
    const rows = 20;
    const cols = 20;

    // Variáveis para o tabuleiro e contexto de desenho
    let board, context;

    // Posição inicial da cabeça da cobra
    let snakeX = blockSize * 5;
    let snakeY = blockSize * 5;

    // Velocidade inicial da cobra
    let velocityX = 0;
    let velocityY = 0;

    // Corpo da cobra (posições anteriores da cabeça)
    let snakeBody = [];

    // Posição da comida
    let foodX, foodY;

    // Array para armazenar a posição dos obstáculos
    let obstacles = [];

    // Sinaliza se o jogo acabou
    let gameOver = false;

    // Pontuação do jogador
    let score = 0;

    // Velocidade inicial da cobra
    let speed = 1;

    // Função de inicialização do jogo
    function init() {
        // Obtém o elemento do tabuleiro no DOM
        board = document.getElementById("board");

        // Define a altura e largura do tabuleiro
        board.height = rows * blockSize;
        board.width = cols * blockSize;

        // Obtém o contexto de desenho 2D
        context = board.getContext("2d");

        // Coloca a comida no tabuleiro
        placeFood();

        // Gera obstáculos no tabuleiro
        generateObstacles();

        // Adiciona um ouvinte de eventos para capturar pressionamentos de tecla
        document.addEventListener("keyup", changeDirection);

        // Define um intervalo para a função de atualização ser chamada a cada 100 milissegundos
        setInterval(update, 1000 / 10);
    }

    // Função de atualização do jogo
    function update() {
        // Verifica se o jogo acabou
        if (gameOver) {
            return;
        }

        // Limpa o tabuleiro antes de cada atualização
        clearBoard();

        // Desenha os obstáculos no tabuleiro
        drawObstacles();

        // Desenha a comida no tabuleiro
        drawFood();

        // Move a cobra
        moveSnake();

        // Desenha a cobra no tabuleiro
        drawSnake();

        // Verifica colisões com obstáculos e outras condições de término do jogo
        checkCollisions();
    }

    // Limpa o tabuleiro desenhando um fundo preto
    function clearBoard() {
        context.fillStyle = "black";
        context.fillRect(0, 0, board.width, board.height);
    }

    // Desenha a comida no tabuleiro
    function drawFood() {
        context.fillStyle = "red";
        context.fillRect(foodX, foodY, blockSize, blockSize);
    }

    // Desenha os obstáculos no tabuleiro
    function drawObstacles() {
        context.fillStyle = "gray";
        for (let i = 0; i < obstacles.length; i++) {
            context.fillRect(obstacles[i][0], obstacles[i][1], blockSize, blockSize);
        }
    }

    // Move a cobra
    function moveSnake() {
        // Calcula a nova posição da cabeça da cobra
        const newHead = [snakeX + velocityX * blockSize * speed, snakeY + velocityY * blockSize * speed];

        // Adiciona a posição atual da cabeça ao corpo da cobra
        snakeBody.unshift([snakeX, snakeY]);

        // Verifica se a cobra comeu a comida
        if (snakeX === foodX && snakeY === foodY) {
            // Coloca uma nova comida no tabuleiro
            placeFood();

            // Incrementa a pontuação
            score += 1;

            // Aumenta a velocidade quando come uma comida
            speed += 0.1;

            // Atualiza a pontuação exibida na tela
            updateScore();
        } else {
            // Remove a última posição do corpo da cobra se não comeu uma comida
            snakeBody.pop();
        }

        // Atualiza a posição da cabeça da cobra
        snakeX = newHead[0];
        snakeY = newHead[1];

        // Permite que a cobra atravesse as paredes do tabuleiro
        if (snakeX < 0) snakeX = cols * blockSize - blockSize;
        if (snakeX >= cols * blockSize) snakeX = 0;
        if (snakeY < 0) snakeY = rows * blockSize - blockSize;
        if (snakeY >= rows * blockSize) snakeY = 0;
    }

    // Desenha a cobra no tabuleiro
    function drawSnake() {
        context.fillStyle = "lime";

        // Desenha a cabeça da cobra
        context.fillRect(snakeX, snakeY, blockSize, blockSize);

        // Desenha o corpo da cobra
        for (let i = 0; i < snakeBody.length; i++) {
            context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
        }
    }

    // Gera obstáculos aleatoriamente no tabuleiro
    function generateObstacles() {
        for (let i = 0; i < 5; i++) {
            const obstacleX = Math.floor(Math.random() * cols) * blockSize;
            const obstacleY = Math.floor(Math.random() * rows) * blockSize;
            obstacles.push([obstacleX, obstacleY]);
        }
    }

    // Função chamada quando o jogo termina
    function gameOverHandler() {
        // Sinaliza o fim do jogo
        gameOver = true;

        // Exibe um alerta com a pontuação do jogador
        alert("Game Over. Your Score: " + score);

        // Recarrega a página para reiniciar o jogo
        location.reload();
    }

    // Verifica colisões com obstáculos e outras condições de término do jogo
    function checkCollisions() {
        // Verifica colisões com obstáculos
        if (obstacles.some(obstacle => obstacle[0] === snakeX && obstacle[1] === snakeY)) {
            gameOverHandler();
        }

        // Verifica outras condições de término do jogo
        if (
            snakeX < 0 || snakeX >= cols * blockSize ||
            snakeY < 0 || snakeY >= rows * blockSize ||
            snakeBody.some(part => part[0] === snakeX && part[1] === snakeY)
        ) {
            // Chama a função de término do jogo
            gameOverHandler();
        }
    }

    // Função chamada quando uma tecla é pressionada para alterar a direção da cobra
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

    // Coloca uma nova comida em uma posição aleatória do tabuleiro
    function placeFood() {
        foodX = Math.floor(Math.random() * cols) * blockSize;
        foodY = Math.floor(Math.random() * rows) * blockSize;
    }

    // Atualiza a pontuação exibida na tela
    function updateScore() {
        document.getElementById('score').innerText = 'Score: ' + score;
    }

    // Chama a função de inicialização do jogo
    init();
});