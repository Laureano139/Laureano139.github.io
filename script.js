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

document.addEventListener('DOMContentLoaded', (event) => {
    const projectsWrapper = document.querySelector('.projects-wrapper');
    const leftBtn = document.querySelector('.left-btn');
    const rightBtn = document.querySelector('.right-btn');
    let currentIndex = 0;

    function updateSliderPosition() {
        projectsWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    leftBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSliderPosition();
        }
    });

    rightBtn.addEventListener('click', () => {
        if (currentIndex < projectsWrapper.children.length - 1) {
            currentIndex++;
            updateSliderPosition();
        }
    });
});

document.addEventListener('DOMContentLoaded', (event) => {
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalVideoContainer = document.getElementById('modalVideoContainer');
    const closeBtn = document.querySelector('.close-btn');
    const projectLinks = document.querySelectorAll('.project a');

    projectLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const projectDetails = [
                {
                    title: 'React To-Do-List',
                    description: 'A simple to-do list website using React. This project was created to learn the basics of React, including component-based architecture, state management, and JSX syntax.',
                    image: 'images/reacttodolist.png',
                    githubLink: 'https://github.com/Laureano139/React-Learning-My-To-Do-List'
                },
                // Outros projetos...
            ];

            modalTitle.innerText = projectDetails[index].title;
            modalDescription.innerText = projectDetails[index].description;
            modalVideoContainer.innerHTML = `
                <img src="${projectDetails[index].image}" alt="${projectDetails[index].title}" style="width: 100%; height: auto; border-radius: 10px; margin-bottom: 20px;">
                <a href="${projectDetails[index].githubLink}" target="_blank" class="github-btn">Visit on GitHub</a>
            `;

            modal.style.display = 'flex';
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', (event) => {
    const projectsWrapper = document.querySelector('.projects-wrapper');
    let isDown = false;
    let startX;
    let scrollLeft;

    projectsWrapper.addEventListener('mousedown', (e) => {
        isDown = true;
        projectsWrapper.classList.add('active');
        startX = e.pageX - projectsWrapper.offsetLeft;
        scrollLeft = projectsWrapper.scrollLeft;
    });

    projectsWrapper.addEventListener('mouseleave', () => {
        isDown = false;
        projectsWrapper.classList.remove('active');
    });

    projectsWrapper.addEventListener('mouseup', () => {
        isDown = false;
        projectsWrapper.classList.remove('active');
    });

    projectsWrapper.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - projectsWrapper.offsetLeft;
        const walk = (x - startX) * 2;
        projectsWrapper.scrollLeft = scrollLeft - walk;
    });

    projectsWrapper.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - projectsWrapper.offsetLeft;
        scrollLeft = projectsWrapper.scrollLeft;
    });

    projectsWrapper.addEventListener('touchend', () => {
        isDown = false;
    });

    projectsWrapper.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - projectsWrapper.offsetLeft;
        const walk = (x - startX) * 2;
        projectsWrapper.scrollLeft = scrollLeft - walk;
    });
});
