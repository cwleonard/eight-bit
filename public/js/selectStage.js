function selectStage(gs) {

    var gameState = gs;
    var keys;
    var splash;
    
    var OFF_Y = 255;
    var ON_Y = 235;
    
    function preload() {

        this.load.pack("main", "assets/stageSelectPack.json");
        
    }
    
    function create() {
        
        this.stage.backgroundColor = "#006600";
        
        gameState.lives = 3;
        
        splash = this.add.image(0, 0, "splash");
        
        var ds = this.add.image(450, 200, "dip_switch");

        
        
        var switchBitmap = this.add.bitmapData(15, 20);
        switchBitmap.ctx.beginPath();
        switchBitmap.ctx.rect(0, 0, switchBitmap.width, switchBitmap.height);
        switchBitmap.ctx.fillStyle = '#FFFFFF';
        switchBitmap.ctx.fill();
    
        var ds1 = this.add.sprite(474, gameState.stagesComplete[0] ? ON_Y : OFF_Y, switchBitmap);
        var ds2 = this.add.sprite(508, gameState.stagesComplete[1] ? ON_Y : OFF_Y, switchBitmap);
        var ds3 = this.add.sprite(541, gameState.stagesComplete[2] ? ON_Y : OFF_Y, switchBitmap);
        var ds4 = this.add.sprite(575, gameState.stagesComplete[3] ? ON_Y : OFF_Y, switchBitmap);
        var ds5 = this.add.sprite(608, gameState.stagesComplete[4] ? ON_Y : OFF_Y, switchBitmap);
        var ds6 = this.add.sprite(641, gameState.stagesComplete[5] ? ON_Y : OFF_Y, switchBitmap);
        var ds7 = this.add.sprite(674, gameState.stagesComplete[6] ? ON_Y : OFF_Y, switchBitmap);
        var ds8 = this.add.sprite(708, gameState.stagesComplete[7] ? ON_Y : OFF_Y, switchBitmap);
        
        
        keys = this.input.keyboard.addKeys({
            'one'    : Phaser.KeyCode.ONE,
            'two'    : Phaser.KeyCode.TWO,
            'three'  : Phaser.KeyCode.THREE,
            'four'   : Phaser.KeyCode.FOUR,
            'five'   : Phaser.KeyCode.FIVE,
            'six'    : Phaser.KeyCode.SIX,
            'seven'  : Phaser.KeyCode.SEVEN,
            'eight'  : Phaser.KeyCode.EIGHT
        });
        
    }
    
    function update() {
        
        if (keys.one.isDown) {
            gameState.currentLevel = 0;
            this.state.start("level");
        } else if (keys.two.isDown) {
            gameState.currentLevel = 1;
        	this.state.start("level");
        }
        
    }

    
    return {
        preload: preload,
        create: create,
        update: update
    };
    
}