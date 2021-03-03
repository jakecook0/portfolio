// let MazeGame = {}; //init MazeGame object

MazeGame.main = (function(graphics, input, mazeGeneration) {
    'use strict';

    let size = 5; //init size of 5, changeable by button clicks
    let context = null;
    let canvas = null;
    let maze = null;
    let renderer = null;
    let inputBuffer = {};

    let lastTimeStamp = performance.now();

    // button activators
    function newMazeWithSize(newSize) {
        size = newSize
        maze = mazeGeneration.MazeGeneration.buildMaze(newSize);
        renderer = graphics.graphics(context, maze, size);
        // graphics.setSize(newSize);
        // graphics.setMaze(maze);
    }

    function moveCharacter(key, character) {
        if(key === 'ArrowDown') {
            if(character.location.edges.s) {
                character.location = character.location.edges.s;
            }
        }
        if(key == 'ArrowUp') {
            if(character.location.edges.n) {
                character.location = character.location.edges.n;
            }
        }
        if(key == 'ArrowRight') {
            if(character.location.edges.e) {
                character.location = character.location.edges.e;
            }
        }
        if(key == 'ArrowLeft') {
            if(character.location.edges.w) {
                character.location = character.location.edges.w;
            }
        }
    }

    // renders all visual items:
    //    maze walls, images, player tokens/sprites
    function render() {
        //clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        //render maze components
        renderMaze(); // render cells/walls
        graphics.renderCharacter(graphics.myChar); //render player character (pass anonymous character function)
        //TODO: render breadcrumbs
    }

    //process all player inputs
    function processInput(elapsedTime) {
        for(input in inputBuffer) {
            moveCharacter(inputBuffer[input], graphics.myChar);
        }
        inputBuffer = {};
        console.log('Processing input, elapsed time: ${elapsedTime}')
    }

    function update(elapsedTime) {
        // update timer
        // update current score
        // update breadcrumb locations
        // update highscores if game finished
        console.log("Does Nothing, nothing at all...");
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
            inputBuffer[event.key] = event.key;
        });

        // create maze and render objects
        maze = mazeGeneration.MazeGeneration.buildMaze(size);
        renderer = graphics.Graphics(context, maze, size)
        // graphics.setSize(size);
        // graphics.setContext(context);

        requestAnimationFrame(gameLoop); //start RAF
    }

    initialize();

}(MazeGame.graphics, MazeGame.input, MazeGame.mazeGeneration));
