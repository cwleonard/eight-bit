
var init = function () {
	
    var levelOne = { // Vector Factory
            map: "Level1",
            music: "assets/audio/Ouroboros.mp3",
            background: "#141414"
    };
    
    var levelTwo = { // Binomial Forest
            map: "Level2",
            music: "assets/audio/Club_Diver.mp3",
            background: "#000066"
    };

    var levelThree = { // Silicon Dioxide Valley
            map: "Level3",
            music: "assets/audio/Killing_Time.mp3",
            background: "#D3EEFF"
    };

    var levelFour = {
            map: "Level4", // Cloud computing
            music: "assets/audio/Danger_Storm.mp3",
            background: "#D3EEFF"
    };

    var levelFive = {
            map: "Level5", // Containers
            music: "assets/audio/Latin_Industries.mp3",
            background: "#D3EEFF"
    };

    var levelSix = {
            map: "Level6", // Deployment Pipeline
            music: "assets/audio/Latin_Industries.mp3",
            background: "#141414"
    };

    var gameState = {
            levels: [],
            currentLevel: "sb",
            lives: 3,
            stagesComplete: [ false, false, false, false, false, false, false, false ]
    };
    
    gameState.levels[0] = levelOne;
    gameState.levels[1] = levelTwo;
    gameState.levels[2] = levelThree;
    gameState.levels[3] = levelFour;
    gameState.levels[4] = levelFive;
    gameState.levels[5] = levelSix;
    
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

