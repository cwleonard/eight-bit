
var init = function () {
	
	var stageSelectState = selectStage();
	
	var sandboxStage = stage(0);
	var stageOne     = stage(1);
	
	var game = new Phaser.Game(width, height, Phaser.CANVAS, "gameArea",
			stageSelectState);
	
	game.state.add("sandbox", sandboxStage);
	game.state.add("one", stageOne);
	
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

