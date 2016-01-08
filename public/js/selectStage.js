function selectStage(gs) {

    var gameState = gs;
    var keys;
    var splash;
    
    function preload() {

        this.load.pack("main", "assets/stageSelectPack.json");
        
    }
    
    function create() {
        
        gameState.lives = 3;
        
        splash = this.add.image(0, 0, "splash");
        
        keys = this.input.keyboard.addKeys({
            's'  : Phaser.KeyCode.S,
            'o'  : Phaser.KeyCode.O
        });
        
    }
    
    function update() {
        
        if (keys.s.isDown) {
            gameState.currentLevel = "sb";
            this.state.start("level");
        } else if (keys.o.isDown) {
            gameState.currentLevel = "one";
        	this.state.start("level");
        }
        
    }

    
    return {
        preload: preload,
        create: create,
        update: update
    };
    
}