const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");
let score = 0;
let food = {};
let scoreDisplay = document.getElementById("score");

let isMobile = window.innerWidth < 768;
const grid = isMobile ? 15 : 20;
canvas.width = isMobile ? 300 : 600;
canvas.height = isMobile ? 400 : 400;


const Maze = [];
let unit = grid * 2;

for (let x = 10 * grid; x <= 18 * grid; x += unit) {
    Maze.push({ x: x, y: 10 * grid });
}
for (let i = 5 * grid; i <= 9 * grid; i += grid) {
    Maze.push({ x: i, y: i });
}
for (let i = 0; i <= 4 * grid; i += grid) {
    Maze.push({ x: 19 * grid + i, y: 9 * grid - i });
}
for (let i = 0; i <= 4 * grid; i += grid) {
    Maze.push({ x: 9 * grid - i, y: 11 * grid + i });
}
for (let i = 0; i <= 4 * grid; i += grid) {
    Maze.push({ x: 19 * grid + i, y: 11 * grid + i });
}




const snake = [{ x: 20, y: 20 }];
let interval = 200;
let intervalId;

function PauseGame() {

    clearInterval(intervalId);

}

function fast() {
    PauseGame();
    intervalId = setInterval(Move, interval / 2)
}

function generateFood() {
    food.x = Math.floor(Math.random() * (canvas.width / grid)) * grid;
    food.y = Math.floor(Math.random() * (canvas.height / grid)) * grid;
    if (Maze.some(block => block.x === food.x && block.y === food.y) ||
        snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        generateFood();
    }
}


function drawSnake() {
    ctx.fillStyle = "lIME";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, grid, grid);
    });
}



function drawFood() {
    ctx.fillStyle = "Red";
    ctx.fillRect(food.x, food.y, grid, grid);

}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    drawSnake();
    drawFood();
}
let direction = 'right';

document.addEventListener('keydown', (event) => {
    event.preventDefault();
    switch (event.key) {

        case 'ArrowUp':
            if (direction !== 'down') {
                direction = 'up';
            }
            break;
        case 'ArrowDown':
            if (direction !== 'up') {
                direction = 'down';
            }
            break;
        case 'ArrowLeft':
            if (direction !== 'right') {
                direction = 'left';
            }
            break;
        case 'ArrowRight':
            if (direction !== 'left') {
                direction = 'right';
            }
            break;

    }
});

function Move() {
    let head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
        case 'up':
            head.y -= grid;
            break;
        case 'down':
            head.y += grid;
            break;
        case 'left':
            head.x -= grid;
            break;
        case 'right':
            head.x += grid;
            break;
    }

    snake.unshift(head);

    for (i = 1; i < snake.length; i++) {
        if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
            gameOver();

        }
    }
    for (i = 0; i < Maze.length; i++) {
        if (head.x === Maze[i].x && head.y === Maze[i].y) {
            gameOver();

        }

    }

    if (head.x === food.x && head.y === food.y) {

        generateFood();
        score += 1;

        console.log(score);
        scoreDisplay.innerHTML = "Score = " + score;


    } else {

        snake.pop();
    }


    if (head.x < 0) {
        head.x = canvas.width;
    }
    if (head.y < 0) {
        head.y = canvas.height;
    }
    if (head.x > canvas.width) {
        head.x = 0;
    }
    if (head.y > canvas.height) {
        head.y = 0;
    }

    draw();
}


intervalId = setInterval(Move, interval);

function drawMaze() {
    ctx.fillStyle = "white";
    Maze.forEach(block => {
        ctx.fillRect(block.x, block.y, grid, grid);
    });
}

function gameOver() {
    console.log("Game over");
    alert("Game Over");
    window.location.reload();
}
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', e => {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});

canvas.addEventListener('touchmove', e => {
    e.preventDefault(); // disable scroll
}, { passive: false });

canvas.addEventListener('touchend', e => {
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && direction !== 'left') direction = 'right';
        else if (deltaX < 0 && direction !== 'right') direction = 'left';
    } else {
        if (deltaY > 0 && direction !== 'up') direction = 'down';
        else if (deltaY < 0 && direction !== 'down') direction = 'up';
    }
});

generateFood();
draw();