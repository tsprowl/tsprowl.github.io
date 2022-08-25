var GAME = ( function () {
	// By convention, constants are all upper-case

	var WIDTH = 13; // width of grid
	var HEIGHT = 15; // height of grid
	var PLAYABLE_HEIGHT = 13;

	var PLAYER_COLOR = PS.COLOR_WHITE;
	var OPPONENT_COLOR = PS.COLOR_BLACK;
	var BACKGROUND_COLOR = 0xA9A9A9;
	var playerX;
	var playerY;
	var opponentX;
	var opponentY;
	var playerCount;
	var opponentCount;
	var grayCount;
	var playerGo = 1;
	var opponentGo = 0;
	var turnCount = 1;
	var shortX;
	var shortY;
	var shortDistance = 500;
	var spawnX;
	var spawnY;
	var rowCounterPlayer = 0;
	var rowCounterOpponent = 12;
	var tieRowRight = 7;
	var tieRowLeft = 6;
	var turnsLeft = 12;
	var levelCount = 1;
	var nextLevel = 0;
	var beadCount;
	var playerPercent = Math.round((8/17) * 11);
	var click_id = "";

	var initImitation = function () {
			//PS.gridSize(WIDTH, HEIGHT);
			PS.border(PS.ALL, PS.ALL, 0);
			PS.border(PS.ALL, 13, 1);
			PS.borderColor(PS.ALL, 13, 0x383838);
			PS.gridColor(0x383838 );
			PS.statusText( "Extrusion" );
			PS.statusColor( PS.COLOR_WHITE );
			PS.color(PS.ALL, PS.ALL, BACKGROUND_COLOR);
		playerPercent = Math.round((8/17) * 11);
		PS.color(0, 14, 0x383838);
		PS.color(12, 14, 0x383838);
			PS.color(PS.ALL, 13, PLAYER_COLOR);
			playerGo = 1;
			beadSpawn(PLAYER_COLOR, 8);
			beadSpawn(OPPONENT_COLOR, 9);
			turnsLeft = 12;
			nextLevel = 0;
			PS.timerStop(winning);
			turnCount = 1;
			levelCount = 2;
			beadCount = 17;
			percentWin();
			PS.timerStop(transition1);
			transition2 = PS.timerStart(15, transitionExperience);
			rowCounterPlayer = 0;
		};

	var initExperience = function () {
		PS.border(PS.ALL, PS.ALL, 0);
		PS.border(PS.ALL, 13, 1);
		PS.borderColor(PS.ALL, 13, 0x383838);
		PS.gridColor(0x383838 );
		PS.statusText( "Extrusion" );
		PS.statusColor( PS.COLOR_WHITE );
		PS.color(PS.ALL, PS.ALL, BACKGROUND_COLOR);
		playerPercent = Math.round((8/17) * 11);
		PS.color(0, 14, 0x383838);
		PS.color(12, 14, 0x383838);
		PS.color(PS.ALL, 13, PLAYER_COLOR);
		playerGo = 1;
		beadSpawn(PLAYER_COLOR, 8);
		beadSpawn(OPPONENT_COLOR, 9);
		turnsLeft = 12;
		nextLevel = 0;
		PS.timerStop(winning);
		turnCount = 1;
		levelCount = 3;
		beadCount = 17;
		percentWin();
		PS.timerStop(transition2);
		rowCounterPlayer = 0;
	}


	Math.getDistance = function( x1, y1, x2, y2 ) {

		var xs = x2 - x1,
			ys = y2 - y1;

		xs *= xs;
		ys *= ys;

		return Math.sqrt( xs + ys );
	};


	// finds the nearest bead given an x and y coordinate

	var nearestMove = function (x, y) {
		var i;
		var j;
		var distance;

		for (i = 0; i < WIDTH; i += 1){
			for (j = 0; j < PLAYABLE_HEIGHT; j += 1){
				if ((PS.color(i, j) === OPPONENT_COLOR)){
					distance = Math.abs(Math.getDistance(x, y, i, j));
					if (distance < shortDistance){
						shortDistance = distance;
						shortX = i;
						shortY = j;
					}
				}
			}
		}
	};



	// spawns 8 beads of a given color at random locations on the grid

	var beadSpawn = function (color, numBeads) {
		var i;
		for (i = 0; i < numBeads; i += 1){
			spawnX = Math.floor(Math.random() * 13);
			spawnY = Math.floor(Math.random() * 13);
			if ((PS.color(spawnX, spawnY) === OPPONENT_COLOR) || (PS.color(spawnX, spawnY) === PLAYER_COLOR)){
				i -= 1;
			}
			else (PS.color(spawnX, spawnY, color));
		}
	};

	// draws the starburst caused by each person's turn

	var drawStarburst = function (x, y, color) {
		PS.fade(PS.ALL, PS.ALL, 0);
		if (x < 12){
			PS.color(x + 1, y, color);
		}
		if (x > 0){
			PS.color(x - 1, y, color);
		}
		if ( y < 12){
			PS.color(x, y + 1, color);
		}
		if ( y > 0){
			PS.color(x, y - 1, color);
		}
	};

	// controls the opponents movement for level 1

	var opponentClick1 = function () {
		opponentX = 12 - playerX;
		opponentY = 12 - playerY;
		if (opponentTurn){
			PS.timerStop(opponentTurn);
			opponentTurn = null;
		}
		if ( opponentGo === 1 ) {
			if ( PS.color( opponentX, opponentY ) === OPPONENT_COLOR ) {
				PS.audioPlay("opponentClick", {
					loop:false,
					lock:true,
					path:"audio/",
					fileTypes:["ogg", "mp3", "wav"]
				} );
				drawStarburst(opponentX, opponentY, OPPONENT_COLOR);
				colorCount();
				turnCount += 1;
				win();
				opponentGo = 0;
				if (turnCount < 14) {
					playerGo = 1;
				}
			}
			else {
				nearestMove(opponentX, opponentY);
				drawStarburst(shortX,shortY, OPPONENT_COLOR);
				PS.audioPlay("opponentClick", {
					loop:false,
					lock:true,
					path:"audio/",
					fileTypes:["ogg", "mp3", "wav"]
				} );
				colorCount();
				turnCount += 1;
				win();
				opponentGo = 0;
				if (turnCount < 14) {
					playerGo = 1;
				}
				shortDistance = 500;
			}
		}
	};

	// controls the opponents movement for level 3

	var opponentClick2 = function () {
		if (opponentTurn2){
			PS.timerStop(opponentTurn2);
			opponentTurn2 = null;
		}
		if ( opponentGo === 1 ) {
			if ( PS.color(12 - playerX, playerY ) === OPPONENT_COLOR ) {
				PS.audioPlay("opponentClick", {
					loop:false,
					lock:true,
					path:"audio/",
					fileTypes:["ogg", "mp3", "wav"]
				} );
				drawStarburst(12 - playerX, playerY, OPPONENT_COLOR);
				colorCount();
				turnCount += 1;
				win2();
				opponentGo = 0;
				if (turnCount < 14) {
					playerGo = 1;
				}
			}
			else {
				nearestMove(12 - playerX, playerY);
				drawStarburst(shortX,shortY, OPPONENT_COLOR);
				PS.audioPlay("opponentClick", {
					loop:false,
					lock:true,
					path:"audio/",
					fileTypes:["ogg", "mp3", "wav"]
				} );
				colorCount();
				turnCount += 1;
				win2();
				opponentGo = 0;
				if (turnCount < 14) {
					playerGo = 1;
				}
				shortDistance = 500;
			}
		}
	};

	var opponentClick3 = function () {
		if(opponentTurn3){
			PS.timerStop(opponentTurn3);
			opponentTurn2 = null;
		}
		if (opponentGo === 1){
			opponentX = Math.floor(Math.random() * 13);
			opponentY = Math.floor(Math.random() * 13);
			if (PS.color(opponentX, opponentY) === OPPONENT_COLOR){
				PS.audioPlay("opponentClick", {
					loop:false,
					lock:true,
					path:"audio/",
					fileTypes:["ogg", "mp3", "wav"]
				} );
				drawStarburst(opponentX, opponentY, OPPONENT_COLOR);
				colorCount();
				turnCount += 1;
				win3();
				opponentGo = 0;
				if (turnCount < 14) {
					playerGo = 1;
				}
			}
			else {
				nearestMove(opponentX, opponentY);
				drawStarburst(shortX, shortY, OPPONENT_COLOR);
				PS.audioPlay("opponentClick", {
					loop:false,
					lock:true,
				//	onLoad: loader,
					path:"audio/",
					fileTypes:["ogg", "mp3", "wav"]
				} );
				colorCount();
				turnCount += 1;
				win3();
				opponentGo = 0;
				if (turnCount < 14){
					playerGo = 1;
				}
				shortDistance = 500;
			}
		}
	};

	// counts the number of beads associated with each color

	var colorCount = function () {
		var i, j, val;

		beadCount = 0;
		playerCount = 0;
		opponentCount = 0;
		grayCount = 0;
		for ( i = 0; i < WIDTH; i += 1 ) {
			for ( j = 0; j < PLAYABLE_HEIGHT; j += 1 ) {
				val = PS.color( i, j );
				if ( val === PLAYER_COLOR ) {
					playerCount += 1;
					beadCount += 1;
				}
				else if ( val === OPPONENT_COLOR ) {
					opponentCount += 1;
					beadCount += 1;
				}
			}
		}
	};

	// checks the bead count to see who wins

	var win = function(){
			if (turnCount === 14){
				 if (playerCount > opponentCount){
					 PS.fade(PS.ALL, PS.ALL, 200);
					 //PS.audioFade(click_id, PS.CURRENT, 0, 10);
					 winning = PS.timerStart(10, winPlayer);
				 }
				 else if (opponentCount > playerCount) {
					 PS.fade(PS.ALL, PS.ALL, 200);

					 PS.timerStart(10, winOpponent);
				 }
				 else {
					  PS.fade(PS.ALL, PS.ALL, 200);
					  PS.timerStart(10, winTie);
				 }
			}
	  };

	var win2 = function(){
		if (turnCount === 14){
			if (playerCount > opponentCount){
				PS.fade(PS.ALL, PS.ALL, 200);
				winning = PS.timerStart(10, winPlayer2);
			}
			else if (opponentCount > playerCount) {
				 PS.fade(PS.ALL, PS.ALL, 200);

				PS.timerStart(10, winOpponent2);
			}
			else {
				PS.fade(PS.ALL, PS.ALL, 200);
				PS.timerStart(10, winTie2);
			}
		}
	};

	var win3 = function(){
		if (turnCount === 14){
			if (playerCount > opponentCount){
				PS.fade(PS.ALL, PS.ALL, 200);
				winning = PS.timerStart(10, winPlayer3);
			}
			else if (opponentCount > playerCount) {
				PS.fade(PS.ALL, PS.ALL, 200);

				PS.timerStart(10, winOpponent3);
			}
			else {
				PS.fade(PS.ALL, PS.ALL, 200);
				PS.timerStart(10, winTie3);
			}
		}
	};

	var winPlayer = function() {
		if (rowCounterPlayer < WIDTH) {
				PS.color(rowCounterPlayer, PS.ALL, PLAYER_COLOR);
				PS.border(PS.ALL, PS.ALL, 0);
				rowCounterPlayer += 1;
				nextLevel = 1;
			}
	};

	var winOpponent = function() {
		PS.color(rowCounterOpponent, PS.ALL, OPPONENT_COLOR);
		PS.border(PS.ALL, PS.ALL, 0);
		if (rowCounterOpponent > 0) {

			rowCounterOpponent -= 1;
		}
		PS.statusText("Lost. Reload to try again.");
	};

	var winTie = function() {
		PS.color(tieRowRight, PS.ALL, 0x383838);
		PS.color(tieRowLeft, PS.ALL, 0x383838);
		PS.border(PS.ALL, PS.ALL, 0);
		if (tieRowLeft > 0){
			tieRowLeft -= 1;
		}
		if (tieRowRight < WIDTH - 1) {
			tieRowRight += 1;
		}
		PS.statusText("Perfectly balanced. Reload to try again.");
	};

	var winPlayer2 = function() {
		if (rowCounterPlayer < WIDTH) {
			PS.color(rowCounterPlayer, PS.ALL, PLAYER_COLOR);
			PS.border(PS.ALL, PS.ALL, 0);
			rowCounterPlayer += 1;
			nextLevel = 1;
		}
	};

	var winOpponent2 = function() {
		PS.color(rowCounterOpponent, PS.ALL, OPPONENT_COLOR);
		PS.border(PS.ALL, PS.ALL, 0);
		if (rowCounterOpponent > 0) {

			rowCounterOpponent -= 1;
		}
		PS.statusText("Lost. Reload to try again.");
	};

	var winTie2 = function() {
		PS.color(tieRowRight, PS.ALL, 0x383838);
		PS.color(tieRowLeft, PS.ALL, 0x383838);
		PS.border(PS.ALL, PS.ALL, 0);
		if (tieRowLeft > 0){
			tieRowLeft -= 1;
		}
		if (tieRowRight < WIDTH - 1) {
			tieRowRight += 1;
		}
		PS.statusText("Perfectly balanced. Reload to try again.");
	};


	var winPlayer3 = function() {
		if (rowCounterPlayer < WIDTH) {
			PS.color(rowCounterPlayer, PS.ALL, PLAYER_COLOR);
			PS.border(PS.ALL, PS.ALL, 0);
			rowCounterPlayer += 1;
			nextLevel = 1;
		}
		PS.statusText("Gracious victory. Reload to win again.");
	};

	var winOpponent3 = function() {
		PS.color(rowCounterOpponent, PS.ALL, OPPONENT_COLOR);
		PS.border(PS.ALL, PS.ALL, 0);
		if (rowCounterOpponent > 0) {

			rowCounterOpponent -= 1;
		}
		PS.statusText("Lost. Reload to try again.");
	};

	var winTie3 = function() {
		PS.color(tieRowRight, PS.ALL, 0x383838);
		PS.color(tieRowLeft, PS.ALL, 0x383838);
		PS.border(PS.ALL, PS.ALL, 0);
		if (tieRowLeft > 0){
			tieRowLeft -= 1;
		}
		if (tieRowRight < WIDTH - 1) {
			tieRowRight += 1;
		}PS.statusText("Perfectly balanced. Reload to try again.");
	};

	var transitionImitation = function(){
		if (nextLevel === 1){
			if (PS.color(PS.ALL, PS.ALL) === PLAYER_COLOR){
				if (PS.alpha(PS.ALL, PS.ALL) === 255){
					initImitation();
				}
			}
		}
	};

	var transitionExperience = function(){
		if (nextLevel === 1){
			if (PS.color(PS.ALL, PS.ALL) === PLAYER_COLOR){
				if (PS.alpha(PS.ALL, PS.ALL) === 255){
					initExperience();
				}
			}
		}
	};

	var percentWin = function() {
			for (var j = 1; j < playerPercent + 1; j += 1){
				PS.color(j, 14, PLAYER_COLOR);
			}
			for (var j = playerPercent + 1; j < 12; j += 1){
				PS.color(j, 14, OPPONENT_COLOR);
			}
	};

	var loader = function (data) {
		click_id = data.channel;
	};




	// The 'exports' object is used to define
	// variables and/or functions that need to be
	// accessible outside this function.
	// So far, it contains only one property,
	// an 'init' function with no parameters.


	var exports = {

		// GAME.init()
		// Initializes the game

		initReflection : function () {
			PS.gridSize( WIDTH, HEIGHT ); // init grid
			PS.border( PS.ALL, PS.ALL, 0 ); // no borders
			PS.border(PS.ALL, 13, 1);
			PS.borderColor(PS.ALL, 13, PS.COLOR_BLACK);
			PS.gridColor(0x383838 );
			PS.statusText( "Extrusion" );
			PS.statusColor( PS.COLOR_WHITE );
			PS.color(PS.ALL, PS.ALL, BACKGROUND_COLOR);
			PS.color(0, 14, 0x383838);
			PS.color(12, 14, 0x383838);
			PS.color(PS.ALL, 13, PLAYER_COLOR);
			playerGo = 1;
			colorCount();
			beadSpawn(PLAYER_COLOR, 8);
			beadSpawn(OPPONENT_COLOR, 9);
			transition1 = PS.timerStart(15, transitionImitation);
			percentWin();
			PS.audioLoad("background", {
				autoplay:true,
				loop:true,
				lock:true,
				onLoad:loader,
				path:"audio/",
				fileTypes:["ogg", "mp3", "wav"]
			} );
		},

		// controls the player's click

		playerClick : function ( x, y ) {
			if ( playerGo === 1 ) {
				if ( (PS.color( x, y ) === PLAYER_COLOR ) && (y < 14)) {
					PS.audioPlay("playerClick", {
						loop:false,
						lock:true,
						onLoad: loader,
						path:"audio/",
						fileTypes:["ogg", "mp3", "wav"]
					} );
					playerX = x;
					playerY = y;
					drawStarburst(playerX, playerY, PLAYER_COLOR);
					colorCount();
					playerPercent = Math.round((playerCount/beadCount) * 11);
					percentWin();
					playerGo = 0;
					opponentGo = 1;
					if (levelCount === 1) {
						opponentTurn = PS.timerStart(60, opponentClick1);
						win();
					}
					if (levelCount === 2) {
						opponentTurn2 = PS.timerStart(60, opponentClick2);
						win2();
					}
					if (levelCount === 3){
						opponentTurn3 = PS.timerStart(60, opponentClick3);
						win3();
					}
					PS.fade(PS.ALL, 13, 60);
					PS.color(turnsLeft, 13, 0x383838);
					PS.borderColor(turnsLeft, 13, 0x383838);
					turnsLeft -= 1;
				}
			}
		}
	};

	// Return the 'exports' object as the value
	// of this function, thereby assigning it
	// to the global GAME variable. This makes
	// its properties visible to Perlenspiel.

	return exports;
}() );


PS.init = GAME.initReflection;

PS.touch = GAME.playerClick;
