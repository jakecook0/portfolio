// Handles the maze generation algorithm
// Uses Prim's method

MazeGame.graphics = (function() {
    'use strict';

    function Graphics(context, maze, size = 5) {
        let backgroundSrc = '../media/lights.jpg'
        let charSource = '../media/character.png'
        // let context = context;
        // let size = size;
        // let maze = context;

        const COORD_SIZE = 1000;

        // Init backgroundimage for tiled graphics
        let imgFloor = new Image();
        imgFloor.isReady = false;
        imgFloor.onload = function() {
            this.isReady = true;
            console.log("Image floor loaded");
        }
        imgFloor.src = 'cell_image.png';


        // Draws the cell walls, if any
        // Params:
        //    cell: a cell object from the maze to render
        function drawCell(cell) { //!!!TODO: check that coord transforms are correct for maze access (my row may be his column in how he built the maze example)

            //used for drawing in tiled images
            // if(imgFloor.isReady) {
            //     context.drawImage(imgFloor,
            //         cell.x * (COORD_SIZE / size), cell.y * (COORD_SIZE / size),
            //         // COORD_SIZE / size + 0.5, COORD_SIZE / size + 0.5);
            //         COORD_SIZE / size, COORD_SIZE / size);
            // }

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
            context.stroke();
        }

        // Get the paths for all cell walls
        // Draws all cells
        function renderMaze() {
            //render the cells
            context.beginPath();
            for(let row = 0; row < size; row++) {
                for(let col = 0; col < size; col++) {
                    drawCell(maze[row][col]);
                }
            }
            context.closePath();
            context.strokStyle = 'rgb(255, 255, 255)';
            context.lineWidth = 7;
            context.stroke(); //draw all the cells/walls in one stroke

        }

        // renders the character to the top left corner to start
        function renderCharacter(character) {
            if(character.image.isReady) {
                context.drawImage(character.image, character.location.x * (COORD_SIZE / size), character.location.y * (COORD_SIZE / size))
            }
        }

        // anonyomous function fo rendering character to canvas
        let myChar = function(location) {
            let image = new Image();
            image.isReady = false;
            image.onload = function() {
                this.isReady = true;
            }
            image.src = charSource;
            return {
                location: location,
                image: image
            };
        }(maze[0][0]);

        function setContext(newContext) {
            context = newContext;
        }

        function setSize(mazeSize) {
            size = mazeSize
        }

        function setMaze(newMaze) {
            maze = newMaze;
        }
    }

    return {
        Graphics: Graphics
    }

})
