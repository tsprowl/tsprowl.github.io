/*
game.js for Perlenspiel 3.3.x
Last revision: 2018-10-14 (BM)

Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
This version of Perlenspiel (3.3.x) is hosted at <https://ps3.perlenspiel.net>
Perlenspiel is Copyright © 2009-19 Worcester Polytechnic Institute.
This file is part of the standard Perlenspiel 3.3.x devkit distribution.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with the Perlenspiel devkit. If not, see <http://www.gnu.org/licenses/>.
*/

/*
This JavaScript file is a template for creating new Perlenspiel 3.3.x games.
By default, all event-handling function templates are COMMENTED OUT (using block-comment syntax), and are therefore INACTIVE.
Uncomment and add code to the event handlers required by your project.
Any unused event-handling function templates can be safely deleted.
Refer to the tutorials and documentation at <https://ps3.perlenspiel.net> for details.
*/

/*
The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these lines.
*/

/* jshint browser : true, devel : true, esversion : 5, freeze : true */
/* globals PS : true */

// Tyler Sprowl & Raul Arias Philippi
// Music is Awake by Tycho

var GAME = function() {

    var WIDTH = 10;
    var HEIGHT = 16;

    //var COLOR_BLOCKS_BLUE = 0xC9E9F6;

    var COLOR_GROUND = 0xFFFFFF;

    var block_x = 0;

    var blockShift;
    var goLeft = 0;
    var camera;


    var blockInMotion = false;

    var height = 15;

    var chaoticStupid = ["tgsprowl", "rjariasphilippi"];
    var DATABASE = "StackAttack";
    var blocksStacked = 0;
    var missesLeft = 3;
    var backgroundColor = 0x000000;
    var blockColor = 0xFFFFFF;


    var level = [
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2
    ];

    var draw_map = function (level) {
        var x, y, data;

        for (y = 0; y < HEIGHT; y += 1) {
            for (x = 0; x < WIDTH; x += 1) {
                data = level [(y * WIDTH) + x];
                if (data == 0) {
                    PS.color(x, y, backgroundColor);
                    PS.data(x, y, "not block");
                }
                if (data == 1) {
                    PS.color(x, y, 0x000000);
                }
                if (data == 2) {
                    PS.color(x, y, COLOR_GROUND);
                }
            }
        }
    };

    var exports = {
        blocksX: [],
        blocksY: [],
        counter: 0,
        bkgArray: [0x0c0000, 0x0D0000, 0x1A0000, 0x280000, 0x350000, 0x430000, 0x500000, 0x5D0000, 0x6B0000, 0x780000, 0x860000, 0x930000, 0xA10000, 0xAE0000, 0xBB0000, 0xC90000, 0xD60000, 0xE40000, 0xF10000, // black to red
                   0xFF0000, 0xFF0600, 0xFF0D00, 0xFF1400, 0xFF1A00, 0xFF2100, 0xFF2800, 0xFF2E00, 0xFF3500, 0xFF3C00, 0xFF4200, 0xFF4900, 0xFF5000, 0xFF5600, 0xFF5D00, 0xFF6400, 0xFF6A00, 0xFF7100, 0xFF7800, // red to orange
                   0xFF7F00, 0xFF8500, 0xFF8C00, 0xFF9300, 0xFF9900, 0xFFA000, 0xFFA700, 0xFFAE00, 0xFFB400, 0xFFBB00, 0xFFC200, 0xFFC900, 0xFFCF00, 0xFFD600, 0xFFDD00, 0xFFE400, 0xFFEA00, 0xFFF100, 0xFFF800, // orange to yellow
                   0xFFFF00, 0xF1F800, 0xE4F100, 0xD6EA00, 0xC9E400, 0xBBDD00, 0xAED600, 0xA1D000, 0x93C900, 0x86C200, 0x78BC00, 0x6BB500, 0x5DAE00, 0x50A800, 0x43A100, 0x359A00, 0x289400, 0x1A8D00, 0x0D8600, // yellow to green
                   0x008000, 0x00790D, 0x00721A, 0x006B28, 0x006535, 0x005E43, 0x005750, 0x00505D, 0x004A6B, 0x004378, 0x003C86, 0x003593, 0x002FA1, 0x0028AE, 0x0021BB, 0x001AC9, 0x0014D6, 0x000DE4, 0x0006F1, // green to blue
                   0x0000FF, 0x0300F8, 0x0700F1, 0x0B00EB, 0x0F00E4, 0x1300DE, 0x1700D7, 0x1B00D0, 0x1F00CA, 0x2300C3, 0x2700BD, 0x2B00B6, 0x2F00B0, 0x3300A9, 0x3700A2, 0x3B009C, 0x3F0095, 0x43008F, 0x470088, // blue to indigo
                   0x4B0082, 0x4D0088, 0x50008F, 0x530095, 0x55009C, 0x5800A2, 0x5B00A9, 0x5E00B0, 0x6000B6, 0x6300BD, 0x6600C3, 0x6900CA, 0x6B00D0, 0x6E00D7, 0x7100DE, 0x7400E4, 0x7600EB, 0x7900F1, 0x7C00F8, // indigo to violet
                   0x7F00FF, 0x7800F1, 0x7100E4, 0x6A00D6, 0x6400C9, 0x5D00BB, 0x5600AE, 0x5000A1, 0x490093, 0x420086, 0x3C0078, 0x35006B, 0x2E005D, 0x280050, 0x210043, 0x1A0035, 0x140028, 0x0D001A, 0x06000D], // violet to black

        blockCounter: 0,
        blockArray: [0xFFFFFF, 0xF1FFFF, 0xE4FFFF, 0xD6FFFF, 0xC9FFFF, 0xBBFFFF, 0xAEFFFF, 0xA1FFFF, 0x93FFFF, 0x86FFFF, 0x78FFFF, 0x6BFFFF, 0x5DFFFF, 0x50FFFF, 0x43FFFF, 0x35FFFF, 0x28FFFF, 0x1AFFFF, 0x0DFFFF, // white to blue
                     0x00FFFF, 0x00F8FF, 0x00F1FF, 0x00EAFF, 0x00E4FF, 0x00DDFF, 0x00D6FF, 0x00D0FF, 0x00C9FF, 0x00C2FF, 0x00BCFF, 0x00B5FF, 0x00AEFF, 0x00A8FF, 0x00A1FF, 0x009AFF, 0x0094FF, 0x008DFF, 0x0086FF, // blue to blue
                     0x0080FF, 0x0079FF, 0x0072FF, 0x006BFF, 0x0065FF, 0x005EFF, 0x0057FF, 0x0050FF, 0x004AFF, 0x0043FF, 0x003CFF, 0x0035FF, 0x002FFF, 0x0028FF, 0x0021FF, 0x001AFF, 0x0014FF, 0x000DFF, 0x0006FF, // blue to blue
                     0x0000FF, 0x0D06FF, 0x1A0DFF, 0x2814FF, 0x351AFF, 0x4321FF, 0x5028FF, 0x5D2EFF, 0x6B35FF, 0x783CFF, 0x8642FF, 0x9349FF, 0xA150FF, 0xAE56FF, 0xBB5DFF, 0xC964FF, 0xD66AFF, 0xE471FF, 0xF178FF, // blue to pink
                     0xFF7FFF, 0xFF85F1, 0xFF8CE4, 0xFF93D6, 0xFF99C9, 0xFFA0BB, 0xFFA7AE, 0xFFAEA1, 0xFFB493, 0xFFBB86, 0xFFC278, 0xFFC96B, 0xFFCF5D, 0xFFD650, 0xFFDD43, 0xFFE435, 0xFFEA28, 0xFFF11A, 0xFFF80D, // pink to yellow
                     0xFFFF00, 0xFBFF06, 0xF7FF0D, 0xF3FF13, 0xEFFF1A, 0xEBFF20, 0xE7FF27, 0xE3FF2E, 0xDFFF34, 0xDBFF3B, 0xD7FF41, 0xD3FF48, 0xCFFF4E, 0xCBFF55, 0xC7FF5C, 0xC3FF62, 0xBFFF69, 0xBBFF6F, 0xB7FF76, // yellow to green
                     0xB4FF7D, 0xB1FF76, 0xAEFF6F, 0xABFF69, 0xA9FF62, 0xA6FF5C, 0xA3FF55, 0xA0FF4E, 0x9EFF48, 0x9BFF41, 0x98FF3B, 0x95FF34, 0x93FF2E, 0x90FF27, 0x8DFF20, 0x8AFF1A, 0x88FF13, 0x85FF0D, 0x82FF06, // green to green
                     0x80FF00, 0x86FF0D, 0x8DFF1A, 0x94FF28, 0x9AFF35, 0xA1FF43, 0xA8FF50, 0xAEFF5D, 0xB5FF6B, 0xBCFF78, 0xC2FF86, 0xC9FF93, 0xD0FFA1, 0xD6FFAE, 0xDDFFBB, 0xE4FFC9, 0xEAFFD6, 0xF1FFE4, 0xF8FFF1], // green to white
        timeTick: 20,
        clickDelay: null,

    initLevel: function () {
            height = 15;
            backgroundColor = 0x000000;
            blocksStacked = 0;
            PS.gridSize(WIDTH, HEIGHT);
            PS.border(PS.ALL, PS.ALL, 0);
            PS.statusText("Build a tower!");
            PS.statusColor(0xFFFFFF);
            draw_map(level);
            levelCount = 1;
            GAME.missesLeft = 3;
            GAME.counter = 0;
            PS.gridColor(0x000000);
            GAME.blockCounter = 0;
            blockColor = GAME.blockArray[GAME.blockCounter];
            GAME.blockShift = PS.timerStart(GAME.timeTick, GAME.moveH);

        },



        moveH: function () {
            var nx = block_x;
            if (camera){
                PS.timerStop(camera);
                camera = null;
            }
            if (goLeft === 0) {
                var h = 1;
            } else if (goLeft === 1) {
                var h = -1;
            }
            if (nx < 1) {
                h = 1;
                goLeft = 0;
            } else if (nx >= WIDTH - 1) {
                h = -1;
                goLeft = 1;
            }

            nx = block_x + h;

            PS.color(block_x, 0, backgroundColor);

            PS.color(nx, 0, blockColor);

            block_x = nx;
        },


        tick: function () {
            "use strict";
            var i, y;

            i = 0;

            y = GAME.blocksY[i];


            // this first part deals with making the block fall
            if (y !== height - 1) {
                if ((y < height) && (PS.data(block_x, y + 1) !== 1)) {
                    PS.data(block_x, y, 0);
                    if (block_x > 0) {
                        PS.color(block_x, y, PS.color(block_x - 1, y));
                    }
                    else {
                        PS.color(block_x, y, PS.color(block_x + 1, y));
                    }
                    y += 1;
                    GAME.blocksY[i] = y;
                    if(camera){
                        PS.timerStop(camera);
                        camera = null;
                    }
                    if ((y < height) && (PS.data(block_x, y) !== 1)) {
                        PS.color(block_x, y, blockColor);
                        PS.data(block_x, y, 1);
                    }
                    blockInMotion = true;
                }
            }
            // this deals with stopping the block once it falls
            else {
                // if the block falls and it misses
                if ((y >= height - 1) && (PS.data(block_x, y + 1) !== 1)) {
                    if (blocksStacked >= 1) {
                        if((block_x >= 0) && (block_x < WIDTH - 1)){
                            PS.color(block_x, height - 1, (PS.color(block_x + 1, height - 1)));
                            PS.data(block_x, height - 1, 0);
                        }
                        else{
                            PS.color(block_x, height - 1, PS.color(block_x - 1, height - 1));
                            PS.data(block_x, height - 1, 0);
                        }
                        GAME.blocksY.splice(i, 1);
                        blockInMotion = false;
                        GAME.missesLeft -= 1;
                        if (GAME.missesLeft > 0) {
                            PS.statusText("Oops! Misses left: " + GAME.missesLeft);
                            GAME.blockShift = PS.timerStart(GAME.timeTick, GAME.moveH);
                        }
                        else{
                        //    PS.timerStop(blockShift);
                            PS.statusText("Game over! Stack size: " + blocksStacked);
                        }
                    }
                    else if (blocksStacked < 1){
                        GAME.blocksY.splice(i, 1);
                        PS.data(block_x, y, 1);
                        blockInMotion = false;
                        if (GAME.missesLeft > 0) {
                            GAME.blockShift = PS.timerStart(GAME.timeTick, GAME.moveH);
                            GAME.clickDelay = PS.timerStart(GAME.timeTick, GAME.letDrop);
                        }
                        height-=1;
                        blocksStacked+=1;
                        PS.statusText("Blocks stacked: " + blocksStacked);
                    }
                }
                else {
                    GAME.blocksY.splice(i, 1);

                    PS.data(block_x, y, 1);
                    height -= 1;
                    blockInMotion = false;
                    blocksStacked += 1;
                    if (GAME.blockCounter < GAME.blockArray.length){
                        blockColor = GAME.blockArray[GAME.blockCounter];
                        GAME.blockCounter += 1;
                    }
                    else{
                        GAME.blockCounter = 0;
                    }
                    PS.statusText("Blocks stacked: " + blocksStacked);

                    if ((blocksStacked % 10) === 0){
                        if (GAME.timeTick > 5 ){
                            GAME.timeTick -= 1;
                        }
                    }
                    //PS.debug("It's tick time Tim" + GAME.timeTick + "\n");
                    camera = PS.timerStart(1, GAME.shifting);
                    if (GAME.missesLeft > 0) {
                        GAME.blockShift = PS.timerStart(GAME.timeTick, GAME.moveH);
                        GAME.clickDelay = PS.timerStart(GAME.timeTick, GAME.letDrop);
                    }
                }

            }
        },

        shifting : function() {
            //PS.debug("no shift" + "\n");
            var diff = WIDTH - block_x - 1;
            if (height === 7){
                height+=1;

                // for redrawing the bottom row
                for (var i = 0; i < WIDTH; i++){
                        PS.color(i, 15, PS.color(i, 14));
                }



                for (var i = 0; i < WIDTH; i++){
                    for (var j = 14; j > 0; j--){
                        if (PS.data(i, j - 1) !== 1) { // if the bead above me isn't a block
                            if ((block_x >= 0) && (block_x < WIDTH - 1)){ // depending on the block_x
                                PS.color(i, j, PS.color(block_x + diff, j - 1)); // color me blank
                                PS.data(i, j, 0);
                            }
                            else {
                                if (i < 9) { // special edge case for the far right
                                PS.color(i, j, PS.color(block_x - 1, j - 1));
                                    PS.data(i, j, 0);
                                }
                                else{
                                    PS.color(i, j, PS.color(block_x - 1, j));
                                    PS.data(i, j, 0);
                                }
                            }
                        }
                        else if (PS.data(i, j) === 1){
                            PS.color(i, j, PS.color(i, j - 1));
                        }
                        else if (PS.data(i, 0) === 1){ // else if the block
                            if ((block_x >= 0) && (block_x < WIDTH - 1)){
                                PS.color(i, 1, PS.color(block_x + 1, 0)); //redraw colors underneath the block
                               // PS.data(i, 1, 1);
                            }
                            else{
                                PS.color(i, 1, PS.color(block_x - 1, 0));
                               // PS.data(i, 1, 1);
                            }
                        }
                    }
                }

                if (GAME.counter < GAME.bkgArray.length){
                    backgroundColor = GAME.bkgArray[GAME.counter];
                }
                else{
                    GAME.counter = 0;
                }
                // for redrawing the top row
                    for (var i = 0; i < WIDTH; i++) {
                            PS.color(i, 0, backgroundColor);
                            PS.data(i, 0, 0);
                         //   PS.debug("background color is " + backgroundColor + "\n");
                        //PS.debug(GAME.counter + "\n");
                    }

                GAME.counter+=1;
                // redraws ths block
                PS.color(block_x, 0, blockColor);
                    PS.data(block_x, 0, 1);
            }
        },


        letDrop: function() {
            if (GAME.clickDelay) {
                PS.timerStop(GAME.clickDelay);
                GAME.clickDelay = null;
            }
        }
    }


    return exports;
} ();


PS.init = function( system, options ) {
    "use strict"; // Do not remove this directive!

    PS.audioLoad("music", {
        autoplay:true,
        loop:true,
        lock:true,
        path:"audio/",
        volume:.5,
        fileTypes:["ogg", "mp3", "wav"]
    } );

    GAME.initLevel();
    PS.timerStart(10, GAME.tick);

};


PS.touch = function( x, y, data, options ) {
    "use strict"; // Do not remove this directive!


    if(GAME.blockShift) {
        if (GAME.clickDelay === null) {
            GAME.blocksX.push(x);
            GAME.blocksY.push(1);
            PS.color(x, y, GAME.blockColor);

            PS.timerStop(GAME.blockShift);
            GAME.blockShift = null;
        }
    }

    if (GAME.missesLeft === 0){
        GAME.initLevel();
    }
};


PS.shutdown = function( options ) {
};


