let showPath = false;
let showHint = false;

function toggleShowPath() {
    showPath = !showPath;
}

function toggleHint() {
    showHint = !showHint;
}

//----------- Maze Generation Algorithm ------------------
let size = 5;
var maze = [];
var cellList = [];
const EDGE_MAP = ["t", "r", "b", "l"]; // Maps an integer to an edge name

// param: size of maze to build
function buildMaze(size) {
    cellList = []; // Holds the queue of cells to be worked with as [row, col] of cell

    //initialize maze with size, all cells with all walls
    maze = [];
    for(let row = 0; row < size; row++) {
        maze.push([]);
        for(let col = 0; col < size; col++) {
            maze[row].push({
                x: col,
                y: row,
                edges: {
                    t: null,
                    r: null,
                    b: null,
                    l: null
                },
                visited: false,
            });
        }
    }

    //Starter cell
    maze[0][0].visited = true;
    addAjacentCells(maze[0][0], size); // Add all valid adjacent cells
    let wall = getRandomInt();
    while(isBorderWall(maze[0][0], EDGE_MAP[wall], size)) {
        wall = getRandomInt();
    }

    maze[0][0].edges[EDGE_MAP[wall]] = true;

    //Prim's algorithm
    while(cellList.length !== 0) {
        // get a random item from cellList
        let cell = cellList.splice(getRandomInt(cellList.length), 1)[0]; //gets an unvisited cellobject from maze
        addAjacentCells(cell, size); // add all valid adjacent cells

        let wallName = getValidWall(cell, size);

        // add adjacency to both cells (EX: [0,1].left = [0,0]; [0,0].right = [0,1])
        let adjacent = getConnectingAdjacent(cell, wallName); // gets an array of [newCell, newCell's shared wall]
        maze[cell.y][cell.x].edges[wallName] = adjacent[0];
        maze[adjacent[0].y][adjacent[0].x].edges[adjacent[1]] = maze[cell.y][cell.x];
    }

    // return maze;
};

// random number generation to whole numbers
// defaults to 0,1,2,3 corresponding to edges of a cell
function getRandomInt(max = 4) {
    return Math.floor(Math.random() * Math.floor(max));
}

// uses the wallname to determine which adjacent cell to assign
// returns [newCell, newCellAdjacenctWall]
function getConnectingAdjacent(cell, wallName) {
    if(wallName === 't') return [maze[cell.y - 1][cell.x], 'b'];
    if(wallName === 'b') return [maze[cell.y + 1][cell.x], 't'];
    if(wallName === 'r') return [maze[cell.y][cell.x + 1], 'l'];
    if(wallName === 'l') return [maze[cell.y][cell.x - 1], 'r'];
}

//returns the in-maze adjacent cells to the current cell
function getValidAdjacents(cell, size) {
    let validCells = [];

    if(cell.y !== 0) validCells.push(maze[cell.y - 1][cell.x]); // first row, remove negative row
    if(cell.y !== size - 1) validCells.push(maze[cell.y + 1][cell.x]);
    if(cell.x !== 0) validCells.push(maze[cell.y][cell.x - 1]);
    if(cell.x !== size - 1) validCells.push(maze[cell.y][cell.x + 1]);

    return validCells;
}

function isCellInMaze(cell) {
    for(var item in cell.edges) {
        if(cell.edges[item] !== null) return true;
    }
    return false;
}

// adds all the adjacent cells that are valid and not in List already
function addAjacentCells(originalCell, size) {
    let addThese = getValidAdjacents(originalCell, size);
    // add to cellList if not already there
    addThese.forEach((cell, i) => {
        // console.log(cell);
        if(!cellList.includes(cell) && !isCellInMaze(cell)) cellList.push(cell);
    });
}

// checks if a wall is a border wall
function isBorderWall(cell, wallName, size) {
    if(cell.y === 0) { //if top row, top border bad
        if(wallName === 't') return true;
    }
    if(cell.y === size - 1) { //if bottom row, bottom border bad
        if(wallName === 'b') return true;
    }
    if(cell.x === 0) { //left column, left border bad
        if(wallName === 'l') return true;
    }
    if(cell.x === size - 1) { //right column, right border bad
        if(wallName === 'r') return true;
    }
    return false;
}

//tests if a cell's wall connects to a cell that is part of the maze (adjacent cell has a non-null edge)
function isAdjacentInMaze(cell, wall) {
    let adjacent = getConnectingAdjacent(cell, EDGE_MAP[wall])[0]; //get adjacent cell
    return isCellInMaze(adjacent);
}

// returns an wallname to current cell that connects it to the maze
function getValidWall(cell, size) {
    // console.log(cell);
    var wall = getRandomInt();
    // VALID = not a border wall, adds cell to maze
    while(isBorderWall(cell, EDGE_MAP[wall], size) || !isAdjacentInMaze(cell, wall)) {
        wall = getRandomInt();
    }
    return EDGE_MAP[wall];
}



// --------------- Shortest Path Alg ------------------
let shortestPath = [];

function getShortestPath() {
    shortestPath = [];
    let queue = [];
    let first = maze[0][0];
    first.parent = null; // flag for parent recursion
    queue.push(first) //push starting cell to queue

    let cell = first;
    let index = 0
    while(queue.length < (size * size)) {
        //add current cell's neighbors to the queue (add all neighbors before moving to next cell)
        // keep track of predecessor of cellList
        for(edge in cell.edges) {
            let child = cell.edges[edge];
            if(child && !queue.includes(child)) {
                child.parent = cell;
                queue.push(child);
            }
        }
        index += 1;
        cell = queue[index];
        // start at ending cell maze[size-1][size-1], add predecessors back to 0,0
    }
    console.log(queue);
    // get solution; find index of goal, add parents backward to 0,0
    let goalIndex = queue.length;
    for(x in queue) {
        if(queue[x].x == (size - 1) && queue[x].y == (size - 1)) goalIndex = x;
    }

    console.log(`index (x,y): ${queue[goalIndex].x}, ${queue[goalIndex].y}`);
    shortestPath.push(queue[goalIndex]); //add goal to solution stack
    cell = queue[goalIndex];

    while(cell.parent !== null) {
        shortestPath.push(cell.parent);
        cell = cell.parent;
    }
}

function cellInShortest(cell) {
    for(item in shortestPath) {
        if(shortestPath[item].x == cell.y && shortestPath[item].y == cell.x) {
            return true;
        }
    }
    return false;
}

// ---------------- Rendering ----------------------
let backgroundSrc = 'media/northern-lights.png';
let charSource = 'media/yellow-char.png';
// let context = context;
// let size = size;
// let maze = context;

const COORD_SIZE = 600;

let imgBackground = new Image();
imgBackground.isReady = false;
imgBackground.onload = function() {
    this.isReady = true;
    console.log("Background loaded");
}
imgBackground.src = backgroundSrc;

let imgBreadcrum = new Image();
imgBreadcrum.isReady = false;
imgBreadcrum.onload = function() {
    this.isReady = true;
    console.log("Background loaded");
}
imgBreadcrum.src = 'media/orange-circle.png';

let imgPath = new Image();
imgPath.isReady = false;
imgPath.onload = function() {
    this.isReady = true;
    console.log("Background loaded");
}
imgPath.src = 'media/yellow-ring.png';

// Init backgroundimage for tiled graphics
let imgFloor = new Image();
imgFloor.isReady = false;
imgFloor.onload = function() {
    this.isReady = true;
    console.log("Image floor loaded");
}
imgFloor.src = 'media/floor.png';


// Draws the cell walls, if any
// Params:
//    cell: a cell object from the maze to render
function drawCell(cell) { //!!!TODO: check that coord transforms are correct for maze access (my row may be his column in how he built the maze example)

    // used for drawing in tiled images, breadcrumb, hint items
    if(cell.visited) {
        if(imgBreadcrum.isReady) {
            context.drawImage(imgBreadcrum,
                cell.y * (COORD_SIZE / size), cell.x * (COORD_SIZE / size),
                COORD_SIZE / size, COORD_SIZE / size) - 20;
            // COORD_SIZE / size - 5, COORD_SIZE / size - 5);
        }
    }

    // shortest path indicators
    if(showPath && cellInShortest(cell)) {
        if(imgPath.isReady) {
            context.drawImage(imgPath,
                cell.y * (COORD_SIZE / size), cell.x * (COORD_SIZE / size),
                COORD_SIZE / size, COORD_SIZE / size) - 20;
        }
    }

    if(cell.edges.t === null) {
        context.moveTo(cell.x * (COORD_SIZE / size), cell.y * (COORD_SIZE / size));
        context.lineTo((cell.x + 1) * (COORD_SIZE / size), cell.y * (COORD_SIZE / size));
        //context.stroke();
    }

    if(cell.edges.b === null) {
        context.moveTo(cell.x * (COORD_SIZE / size), (cell.y + 1) * (COORD_SIZE / size));
        context.lineTo((cell.x + 1) * (COORD_SIZE / size), (cell.y + 1) * (COORD_SIZE / size));
        //context.stroke();
    }

    if(cell.edges.r === null) {
        context.moveTo((cell.x + 1) * (COORD_SIZE / size), cell.y * (COORD_SIZE / size));
        context.lineTo((cell.x + 1) * (COORD_SIZE / size), (cell.y + 1) * (COORD_SIZE / size));
        //context.stroke();
    }

    if(cell.edges.l === null) {
        context.moveTo(cell.x * (COORD_SIZE / size), cell.y * (COORD_SIZE / size));
        context.lineTo(cell.x * (COORD_SIZE / size), (cell.y + 1) * (COORD_SIZE / size));
        //context.stroke();
    }

    // Can do all the moveTo and lineTo commands and then render them all with a single .stroke() call.
    context.strokeStyle = 'rgb(255, 255, 255)';
}

// Get the paths for all cell walls
// Draws all cells
function renderMaze() {
    // draw background image
    if(imgBackground.isReady) {
        context.drawImage(imgBackground, 0, 0, 800, 800);
    }

    //render the cells
    context.beginPath();
    for(let row = 0; row < size; row++) {
        for(let col = 0; col < size; col++) {
            drawCell(maze[row][col]);
        }
    }
    // context.closePath();
    context.strokStyle = 'rgb(255, 255, 255)';
    context.lineWidth = 7;
    context.stroke(); //draw all the cells/walls in one stroke

    // Draw a black border around the whole maze
    // context.beginPath();
    // context.moveTo(0, 0);
    // context.lineTo(COORD_SIZE - 1, 0);
    // context.lineTo(COORD_SIZE - 1, COORD_SIZE - 1);
    // context.lineTo(0, COORD_SIZE - 1);
    // context.closePath();
    // context.strokeStyle = 'rgb(0, 0, 0)';
    // context.stroke();

}

// renders the character to the top left corner to start
function renderCharacter(character) {
    if(character.image.isReady) {
        context.drawImage(character.image, character.location.x * (COORD_SIZE / size), character.location.y * (COORD_SIZE / size), COORD_SIZE / size, COORD_SIZE / size);
        // context.drawImage(character.image, 0, 0, COORD_SIZE / size, COORD_SIZE / size);
    }
}



// -------------------- Main gameloop --------------------
// let size = 5; //init size of 5, changeable by button clicks
let context = null;
let canvas = null;
let scoreAdded = false;
let timer = 0;
let inputBuffer = {};

let lastTimeStamp = performance.now();

// button activators
function newMazeWithSize(newSize) {
    size = newSize
    buildMaze(size);
    getShortestPath();
    showPath = false;
    myChar.location = maze[0][0];
    scoreAdded = false;
    timer = 0;

}

// player character movement control
function moveCharacter(key, character) {
    if(key === 'ArrowDown') {
        if(maze[character.location.y][character.location.x].edges.b) {
            character.location = character.location.edges.b;
        }
    }
    if(key == 'ArrowUp') {
        if(maze[character.location.y][character.location.x].edges.t) {
            character.location = character.location.edges.t;
        }
    }
    if(key == 'ArrowRight') {
        if(maze[character.location.y][character.location.x].edges.r) {
            character.location = character.location.edges.r;
        }
    }
    if(key == 'ArrowLeft') {
        if(maze[character.location.y][character.location.x].edges.l) {
            character.location = character.location.edges.l;
        }
    }
    //breadcrumb flag
    maze[character.location.x][character.location.y].visited = true;

    //shortest path update
    let top = shortestPath.pop();
    // let second = shortestPath.pop();
    if(myChar.location.x == top.x && myChar.location.y == top.y) {
        null
    } else {
        shortestPath.push(top);
        shortestPath.push(myChar.location)
    }
}

// renders all visual items:
//    maze walls, images, player tokens/sprites
function render() {
    //clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    //render maze components
    renderMaze(); // render cells/walls
    renderCharacter(myChar); //render player character (pass anonymous character function)
    //TODO: render breadcrumbs
}

//process all player inputs
function processInput(elapsedTime) {
    for(input in inputBuffer) {
        moveCharacter(inputBuffer[input], myChar);
    }
    inputBuffer = {};
    // console.log('Processing input, elapsed time: ${elapsedTime}')
}


function update(elapsedTime) {
    // update timer
    timer += elapsedTime;
    // update current score
    // update breadcrumb locations
    // update highscores if game finished
    if(myChar.location == maze[size - 1][size - 1] && !scoreAdded) {
        let hiScores = document.getElementById('highscores');
        let newScore = document.createElement('li');
        newScore.innerHTML = (timer / 1000).toFixed(2);
        hiScores.appendChild(newScore);
        scoreAdded = true;
    }
    // console.log("Does Nothing, nothing at all...");
}

function gameLoop(time) {
    // starts everything
    let elapsedTime = time - lastTimeStamp;
    lastTimeStamp = time;

    processInput(elapsedTime);
    update(elapsedTime);
    render();

    requestAnimationFrame(gameLoop);
}

console.log('Game initializing...');

function initialize() {
    canvas = document.getElementById('canvas-main');
    context = canvas.getContext('2d');

    window.addEventListener('keydown', function(event) {
        // console.log(`KEYDOWN: ${event.key}`);
        inputBuffer[event.key] = event.key;
    });

    // create maze
    buildMaze(size);
    getShortestPath();

    requestAnimationFrame(gameLoop); //start RAF
}

initialize();

// anonyomous function fo rendering character to canvas
let myChar = function(location) {
    let image = new Image();
    image.isReady = false;
    image.onload = function() {
        this.isReady = true; //TODO: change to true with a scaled image
    }
    image.src = charSource;
    return {
        location: location,
        image: image
    };
}(maze[0][0]);
