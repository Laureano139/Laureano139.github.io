document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById('snakeGame');
    const ctx = canvas.getContext('2d');
    const box = 20;
    const canvasSize = 200;
    const boxesPerRow = canvasSize / box;
    let snake;
    let direction;
    let food;
    let game;
    let score;
    let timer;
    let startTime;

    function initGame() {
        snake = [];
        snake[0] = { x: 5 * box, y: 5 * box };
        direction = '';
        food = spawnFood();
        score = 0;
        startTime = Date.now();
        document.getElementById('score').innerText = 'Score: 0';
        document.getElementById('timer').innerText = 'Time: 0s';
        clearInterval(game);
        clearInterval(timer);
        game = setInterval(draw, 100);
        timer = setInterval(updateTimer, 1000);
        document.body.classList.add('no-scroll'); // Adicionar classe no-scroll
    }

    function spawnFood() {
        let foodX, foodY;
        while (true) {
            foodX = Math.floor(Math.random() * boxesPerRow) * box;
            foodY = Math.floor(Math.random() * boxesPerRow) * box;
            if (!snake.some(segment => segment.x === foodX && segment.y === foodY)) {
                return { x: foodX, y: foodY };
            }
        }
    }

    function updateTimer() {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById('timer').innerText = `Time: ${elapsed}s`;
    }

    document.addEventListener('keydown', directionEvent);

    function directionEvent(event) {
        if (event.key === 'ArrowLeft' && direction !== 'RIGHT') {
            direction = 'LEFT';
            event.preventDefault();
        } else if (event.key === 'ArrowUp' && direction !== 'DOWN') {
            direction = 'UP';
            event.preventDefault();
        } else if (event.key === 'ArrowRight' && direction !== 'LEFT') {
            direction = 'RIGHT';
            event.preventDefault();
        } else if (event.key === 'ArrowDown' && direction !== 'UP') {
            direction = 'DOWN';
            event.preventDefault();
        }
    }

    function collision(head, array) {
        for (let i = 0; i < array.length; i++) {
            if (head.x === array[i].x && head.y === array[i].y) {
                return true;
            }
        }
        return false;
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = (i === 0) ? 'green' : 'white';
            ctx.fillRect(snake[i].x, snake[i].y, box, box);

            ctx.strokeStyle = 'red';
            ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        }

        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, box, box);

        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        if (direction === 'LEFT') snakeX -= box;
        if (direction === 'UP') snakeY -= box;
        if (direction === 'RIGHT') snakeX += box;
        if (direction === 'DOWN') snakeY += box;

        if (snakeX === food.x && snakeY === food.y) {
            food = spawnFood();
            score++;
            document.getElementById('score').innerText = `Score: ${score}`;
        } else {
            snake.pop();
        }

        let newHead = { x: snakeX, y: snakeY };

        if (snakeX < 0 || snakeY < 0 || snakeX >= canvasSize || snakeY >= canvasSize || collision(newHead, snake)) {
            clearInterval(game);
            clearInterval(timer);
            document.body.classList.remove('no-scroll'); // Remover classe no-scroll
        }

        snake.unshift(newHead);
    }

    let touchStartX = null;
    let touchStartY = null;

    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);

    function handleTouchStart(evt) {
        const firstTouch = evt.touches[0];
        touchStartX = firstTouch.clientX;
        touchStartY = firstTouch.clientY;
    }

    function handleTouchMove(evt) {
        if (!touchStartX || !touchStartY) {
            return;
        }

        const touchEndX = evt.touches[0].clientX;
        const touchEndY = evt.touches[0].clientY;

        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0 && direction !== 'RIGHT') {
                direction = 'LEFT';
            } else if (diffX < 0 && direction !== 'LEFT') {
                direction = 'RIGHT';
            }
        } else {
            if (diffY > 0 && direction !== 'DOWN') {
                direction = 'UP';
            } else if (diffY < 0 && direction !== 'UP') {
                direction = 'DOWN';
            }
        }

        touchStartX = null;
        touchStartY = null;
    }

    document.getElementById('playButton').addEventListener('click', () => {
        initGame();
    });
});
