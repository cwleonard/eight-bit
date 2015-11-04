
var init = function () {
	
	var frog;
	var group;
	var layer;
	
	var cursors;
	var spacebar;
	
	var game = new Phaser.Game(width, height, Phaser.CANVAS, "gameArea", {
		preload: preload,
		create: create,
		update: update,
		render: render
	});

	function preload() {

		game.load.pack("main", "assets/pack.json");
		
	}
	
	function create() {

	    game.physics.startSystem(Phaser.Physics.ARCADE);
	    
	    game.physics.arcade.gravity.y = 1500;
	    
		game.stage.backgroundColor = "#D3EEFF";
		
		var map = game.add.tilemap("stage1");
		map.addTilesetImage("ground", "tiles");
		
		map.setCollisionBetween(0, 6569);
		
		layer = map.createLayer("layer1");
		layer.resizeWorld();
		
		group = game.add.group();
		
        frog = createFrog(group, 50, 50, "frog", 200, "left");
        
        game.camera.follow(frog);
        
		cursors = game.input.keyboard.createCursorKeys();
		spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		
	}

	function update() {

        game.physics.arcade.collide(frog, layer);

        frog.body.velocity.x = 0;

        if (spacebar.isDown) {
            if (frog.body.onFloor()) {
                frog.body.velocity.y = -600;
            }
        }

        if (cursors.left.isDown) {
            frog.body.velocity.x = -150;
        } else if (cursors.right.isDown) {
            frog.body.velocity.x = 150;
        }

        setAnimation(frog);

    }
	
	/**
	 * Creates a frog.
	 * 
	 * @param grp group to which this frog should be added
	 * @param x x-coordinate for this frog
	 * @param y y-coordinate for this frog
	 * @param ss sprite sheet
	 * @param mv max velocity
	 * @param ani initial animation ('left', 'right', 'front', or 'back)
	 * @returns the created frog
	 */
	function createFrog(grp, x, y, ss, mv, ani) {
		
		var f = grp.create(x, y, ss);
		game.physics.enable(f, Phaser.Physics.ARCADE);
		f.name = "frog";
		f.body.offset.x = 30;
        f.body.offset.y = 20;
        f.body.setSize(60, 25, 9, 35);
        f.body.linearDamping = 1;
        f.body.collideWorldBounds = true;
        
        f.animations.add("left", [0, 1, 2], 10, true);
        f.animations.add("right", [3, 4, 5], 10, true);
        f.animations.currentAnim = f.animations.getAnimation(ani);
		
        return f;
        
	}
	
	function setAnimation(f) {

	    if (f.body.velocity.x === 0) {
	        f.animations.stop(null, true);
	    } else {

	        if (f.body.velocity.x > 0) {
	            f.animations.play("right");
	        } else if (f.body.velocity.x < 0) {
	            f.animations.play("left");
	        }

	    }

	}
	
	function render() {
		
		// un-comment to see the boxes
		//game.debug.body(frog);
		
	}
	
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

