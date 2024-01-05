// Aguarda o carregamento do DOM antes de executar o código
document.addEventListener("DOMContentLoaded", function () {
    // Configurações do jogo
    const blockSize = 25; // Tamanho de cada bloco
    const rows = 20; // Número de linhas no tabuleiro
    const cols = 20; // Número de colunas no tabuleiro

    // Variáveis do jogo
    let board, context; // Elemento de tabuleiro e contexto de desenho
    let snakeX = blockSize * 5; // Posição inicial X da cabeça da cobra
    let snakeY = blockSize * 5; // Posição inicial Y da cabeça da cobra
    let velocityX = 0; // Velocidade inicial X da cobra
    let velocityY = 0; // Velocidade inicial Y da cobra
    let snakeBody = []; // Array que armazena as posições do corpo da cobra
    let foodX, foodY; // Posição da comida no tabuleiro
    let obstacles = []; // Array para armazenar as posições dos obstáculos
    let gameOver = false; // Flag para verificar se o jogo acabou
    let score = 0; // Pontuação do jogador
    let speed = 1; // Velocidade inicial da cobra

    // Função de inicialização do jogo
    function init() {
        // Obtém referências para o elemento de tabuleiro e seu contexto
        board = document.getElementById("board");
        board.height = rows * blockSize; // Define a altura do tabuleiro
        board.width = cols * blockSize; // Define a largura do tabuleiro
        context = board.getContext("2d");

        // Coloca a comida e gera obstáculos
        placeFood();
        generateObstacles();

        // Adiciona um ouvinte para o evento de pressionar teclas
        document.addEventListener("keyup", changeDirection);

        // Atualiza o estado do jogo em intervalos regulares
        setInterval(update, 1000 / 10);
    }

    // Função de atualização do jogo
    function update() {
        // Se o jogo acabou, retorna
        if (gameOver) {
            return;
        }

        // Limpa o tabuleiro, desenha obstáculos, comida, movimenta a cobra, a desenha e verifica colisões
        clearBoard();
        drawObstacles();
        drawFood();
        moveSnake();
        drawSnake();
        checkCollisions();
    }

    // Função para limpar o tabuleiro
    function clearBoard() {
        context.fillStyle = "black";
        context.fillRect(0, 0, board.width, board.height);
    }

    // Função para desenhar a comida na tela
    function drawFood() {
        context.fillStyle = "red";
        context.fillRect(foodX, foodY, blockSize, blockSize);
    }

    // Função para desenhar os obstáculos na tela
    function drawObstacles() {
        context.fillStyle = "gray";
        for (let i = 0; i < obstacles.length; i++) {
            context.fillRect(obstacles[i][0], obstacles[i][1], blockSize, blockSize);
        }
    }

    // Função para movimentar a cobra
    function moveSnake() {
        const newHead = [snakeX + velocityX * blockSize, snakeY + velocityY * blockSize];
        snakeBody.unshift([snakeX, snakeY]);

        // Se a cobra comeu a comida
        if (snakeX === foodX && snakeY === foodY) {
            placeFood();
            score += 1;
            speed += 0.1;
            updateScore();
        } else {
            snakeBody.pop(); // Remove a última parte do corpo
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

    // Função para desenhar a cobra na tela
    function drawSnake() {
        // Desenha a cabeça da cobra
        context.fillStyle = "lime";
        context.fillRect(snakeX, snakeY, blockSize, blockSize);

        // Desenha o corpo da cobra
        context.fillStyle = "lime";
        for (let i = 0; i < snakeBody.length; i++) {
            context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
        }
    }

    // Função para gerar obstáculos aleatórios
    function generateObstacles() {
        for (let i = 0; i < 5; i++) {
            const obstacleX = Math.floor(Math.random() * cols) * blockSize;
            const obstacleY = Math.floor(Math.random() * rows) * blockSize;
            obstacles.push([obstacleX, obstacleY]);
        }
    }

    // Função chamada quando o jogo termina
    function gameOverHandler() {
        gameOver = true;
        alert("Game Over. Your Score: " + score);
        location.reload(); // Recarrega a página para reiniciar o jogo
    }

    // Função para verificar colisões
    function checkCollisions() {
        // Verifica colisões com obstáculos
        if (obstacles.some(obstacle => obstacle[0] === snakeX && obstacle[1] === snakeY)) {
            gameOverHandler();
        }

        // Verifica colisões com as bordas do tabuleiro e o próprio corpo da cobra
        if (
            snakeX < 0 || snakeX >= cols * blockSize ||
            snakeY < 0 || snakeY >= rows * blockSize ||
            snakeBody.some(part => part[0] === snakeX && part[1] === snakeY)
        ) {
            gameOverHandler();
        }
    }

    // Função para alterar a direção da cobra com base nas teclas pressionadas
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

    // Função para posicionar a comida em uma posição aleatória no tabuleiro
    function placeFood() {
        foodX = Math.floor(Math.random() * cols) * blockSize;
        foodY = Math.floor(Math.random() * rows) * blockSize;
    }

    // Função para atualizar a pontuação exibida no HTML
    function updateScore() {
        document.getElementById('score').innerText = 'Score: ' + score;
    }

    // Inicia o jogo
    init();
});