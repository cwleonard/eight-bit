function selectStage() {

    var keys;
    var splash;
    
    function preload() {

        this.load.pack("main", "assets/stageSelectPack.json");
        
    }
    
    function create() {
        
        splash = this.add.image(0, 0, "splash");
        
        keys = this.input.keyboard.addKeys({
            's'  : Phaser.KeyCode.S,
            'o'  : Phaser.KeyCode.O
        });

        
    }
    
    function update() {
        
        if (keys.s.isDown) {
            this.state.start("sandbox");
        } else if (keys.o.isDown) {
        	this.state.start("one");
        }
        
    }

    
    return {
        preload: preload,
        create: create,
        update: update
    };
    
}