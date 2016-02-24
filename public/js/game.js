
var init = function () {
	
    var levelOne = { // Vector Factory
            map: "Level1",
            music: "assets/audio/Ouroboros.mp3",
            background: "#141414",
            boss: beaver
    };
    
    var levelTwo = { // Binary Trees
            map: "Level2",
            music: "assets/audio/Club_Diver.mp3",
            background: "#000066",
            boss: beaver
    };

    var levelThree = { // Silicon Dioxide Valley
            map: "Level3",
            music: "assets/audio/Killing_Time.mp3",
            background: "#D3EEFF",
            boss: beaver
    };

    var levelFour = {
            map: "Level4", // Cloud Computing
            music: "assets/audio/Danger_Storm.mp3",
            background: "#D3EEFF",
            boss: beaver
    };

    var levelFive = {
            map: "Level5", // Containers
            music: "assets/audio/Latin_Industries.mp3",
            background: "#D3EEFF",
            boss: beaver
    };

    var levelSix = {
            map: "Level6", // Deployment Pipeline
            music: "assets/audio/Misuse.mp3",
            background: "#141414",
            boss: beaver
    };

    var levelSeven = {
            map: "Level7", // Liquid Cooled
            music: "assets/audio/Cut_and_Run.mp3",
            background: "#D3EEFF",
            boss: beaver,
            water: true
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
    gameState.levels[6] = levelSeven;
    
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

