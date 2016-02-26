
var init = function () {
	
    var levelOne = { // Vector Factory
            map: "Level1",
            music: "Ouroboros",
            background: "#141414",
            boss: beaver
    };
    
    var levelTwo = { // Binary Trees
            map: "Level2",
            music: "Club_Diver",
            background: "#000066",
            boss: beaver
    };

    var levelThree = { // Silicon Dioxide Valley
            map: "Level3",
            music: "Killing_Time",
            background: "#D3EEFF",
            boss: beaver
    };

    var levelFour = {
            map: "Level4", // Cloud Computing
            music: "Danger_Storm",
            background: "#D3EEFF",
            boss: beaver
    };

    var levelFive = {
            map: "Level5", // Containers
            music: "Latin_Industries",
            background: "#D3EEFF",
            boss: beaver
    };

    var levelSix = {
            map: "Level6", // Deployment Pipeline
            music: "Misuse",
            background: "#141414",
            boss: beaver
    };

    var levelSeven = {
            map: "Level7", // Liquid Cooled
            music: "Cut_and_Run",
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

    var boot = {
      
        preload: function() {
            this.game.load.image("title", "assets/images/title.png");
            this.game.load.image("title-loading", "assets/images/title-loading.png");
        },
        
        create: function() {
            this.state.start("preloader");
        }
            
    };
    
    var preloader = {
      
        preload: function() {
            
            this.add.image(0, 0, "title");
            this.loadingText = this.add.image(450, 200, "title-loading");
            
            this.load.pack("main", "assets/pack.json");

        },
        
        create: function() {
            this.state.start("stageSelect");
        }
            
    };
    
    var game = new Phaser.Game(width, height, Phaser.CANVAS, "gameArea");
    
    game.state.add("boot", boot);
    game.state.add("preloader", preloader);
    game.state.add("stageSelect", stageSelectState);
    game.state.add("level", theStage);
    
    game.state.start("boot");
	
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

