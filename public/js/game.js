
var init = function () {
	
    var sandboxLevel = {
            map: "LevelSandbox",
            music: "Ouroboros"
    };
    
    var levelOne = {
            map: "Level1",
            music: "DangerStorm"
    };
    
    var gameState = {
            levels: [],
            currentLevel: "sb",
            lives: 3
    };
    
    gameState.levels["sb"] = sandboxLevel;
    gameState.levels["one"] = levelOne;
    
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

