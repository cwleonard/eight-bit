
var init = function () {
	
    var levelOne = {
            map: "LevelSandbox",
            music: "Ouroboros"
    };
    
    var levelTwo = {
            map: "Level1",
            music: "DangerStorm"
    };
    
    var gameState = {
            levels: [],
            currentLevel: "sb",
            lives: 3,
            stagesComplete: [ false, false, false, false, false, false, false, false ]
    };
    
    gameState.levels[0] = levelOne;
    gameState.levels[1] = levelTwo;
    
    var theStage = stage(gameState);
    var stageSelectState = selectStage(gameState);
    
    var game = new Phaser.Game(width, height, Phaser.CANVAS, "gameArea");
    
    game.state.add("stageSelect", stageSelectState, true);
    game.state.add("level", theStage);
	
};

var wfconfig = {

    active: function() { 
    	console.log("font loaded");
    	init();
    },
    
    inactive: function() {
        console.log("fonts could not be loaded!");
        init();
    },

    google: {
      families: ['Sniglet']
    }

};

window.onload = function() {
	//WebFont.load(wfconfig);
    init();
};

