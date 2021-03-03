// Handles the maze generation algorithm
// Uses Prim's method

// requires a size for the maze to be generated (square grid)
MazeGame.mazeGeneration = (function() {
    'use strict';

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
                    x: row,
                    y: col,
                    edges: {
                        t: null,
                        r: null,
                        b: null,
                        l: null
                    },
                });
            }
        }

        console.log(maze);

        //Starter cell
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
            maze[cell.x][cell.y].edges[wallName] = adjacent[0];
            maze[adjacent[0].x][adjacent[0].y].edges[adjacent[1]] = maze[cell.x][cell.y];
        }

        return maze;
    };

    // random number generation to whole numbers
    // defaults to 0,1,2,3 corresponding to edges of a cell
    function getRandomInt(max = 4) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    // uses the wallname to determine which adjacent cell to assign
    // returns [newCell, newCellAdjacenctWall]
    function getConnectingAdjacent(cell, wallName) {
        if(wallName === 't') return [maze[cell.x - 1][cell.y], 'b'];
        if(wallName === 'b') return [maze[cell.x + 1][cell.y], 't'];
        if(wallName === 'r') return [maze[cell.x][cell.y + 1], 'l'];
        if(wallName === 'l') return [maze[cell.x][cell.y - 1], 'r'];
    }

    //returns the in-maze adjacent cells to the current cell
    function getValidAdjacents(cell, size) {
        let validCells = [];

        if(cell.x !== 0) validCells.push(maze[cell.x - 1][cell.y]); // first row, remove negative row
        if(cell.x !== size - 1) validCells.push(maze[cell.x + 1][cell.y]);
        if(cell.y !== 0) validCells.push(maze[cell.x][cell.y - 1]);
        if(cell.y !== size - 1) validCells.push(maze[cell.x][cell.y + 1]);

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
        if(cell.x === 0) { //if top row, top border bad
            if(wallName === 't') return true;
        }
        if(cell.x === size - 1) { //if bottom row, bottom border bad
            if(wallName === 'b') return true;
        }
        if(cell.y === 0) { //left column, left border bad
            if(wallName === 'l') return true;
        }
        if(cell.y === size - 1) { //right column, right border bad
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
}());
