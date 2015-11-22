
var init = function () {
	
	var frog;
	var group;
	var layer;
	var enemies;
	var weapons;
	
	var bgmusic;
	var jumpSound;
	var thudSound;
	
	var cursors;
	var spacebar;
	var fire;
	
	var FIRE_RATE = 250;
	var nextFire;
	
	var game = new Phaser.Game(width, height, Phaser.CANVAS, "gameArea", {
		preload: preload,
		create: create,
		update: update,
		render: render
	});

	function preload() {

		game.load.pack("main", "assets/pack.json");
		
	}
	

    function setTileCollision(mapLayer, idxOrArray, dirs) {
    
        var mFunc; // tile index matching function
        if (idxOrArray.length) {
            // if idxOrArray is an array, use a function with a loop
            mFunc = function(inp) {
                for (var i = 0; i < idxOrArray.length; i++) {
                    if (idxOrArray[i] === inp) {
                        return true;
                    }
                }
                return false;
            };
        } else {
            // if idxOrArray is a single number, use a simple function
            mFunc = function(inp) {
                return inp === idxOrArray;
            };
        }
    
        // get the 2-dimensional tiles array for this layer
        var d = mapLayer.map.layers[mapLayer.index].data;
        
        for (var i = 0; i < d.length; i++) {
            for (var j = 0; j < d[i].length; j++) {
                var t = d[i][j];
                if (mFunc(t.index)) {
                    
                    t.collideUp = dirs.top;
                    t.collideDown = dirs.bottom;
                    t.collideLeft = dirs.left;
                    t.collideRight = dirs.right;
                    
                    t.faceTop = dirs.top;
                    t.faceBottom = dirs.bottom;
                    t.faceLeft = dirs.left;
                    t.faceRight = dirs.right;
                    
                }
            }
        }
    
    }
	
    function create() {
    
        game.physics.startSystem(Phaser.Physics.ARCADE);
    
        game.physics.arcade.gravity.y = 1500;
    
        game.stage.backgroundColor = "#D3EEFF";
    
        var map = game.add.tilemap("stage1");
        map.addTilesetImage("ground", "tiles");
    
        var bglayer = map.createLayer("bg");
        bglayer.scrollFactorX = 0.5;
    
        layer = map.createLayer("layer1");
        layer.resizeWorld();
    
        map.setLayer(layer);
        
        
        enemies = game.add.group();
        enemies.enableBody = true;
        
        map.createFromObjects('others', 6571, 'toad', 0, true, false, enemies);
        
        
        //enemies.add(new Phaser.Sprite(this.game, 200, 200, 'toad', 0));
        
        map.setCollisionBetween(1, 5);
        map.setCollisionBetween(91, 95);
        map.setCollisionBetween(181, 185);
        map.setCollisionBetween(271, 275);
        
        map.setCollisionBetween(2306, 2310);
        
        map.setCollisionBetween(3421, 3429);
        map.setCollisionBetween(3511, 3521);
        map.setCollisionBetween(3601, 3611);
        map.setCollisionBetween(3690, 3701);
        map.setCollisionBetween(3781, 3791);

        map.setCollisionBetween(2815, 2817);
        map.setCollisionBetween(6055, 6057);

        
        //map.setCollisionBetween(3354, 3356);
        //map.setCollisionBetween(2900, 2903);
        //map.setCollisionBetween(3714, 3716);
    
        setTileCollision(layer, [3354, 3355, 3356, 2900, 2901, 2902, 2903, 3714, 3715, 3716], {
            top: true,
            bottom: false,
            left: false,
            right: false
        });
        
        group = game.add.group();
    
        frog = createFrog(group, 50, 50, "frog", 200, "left");
        
        weapons = game.add.group();
        weapons.createMultiple(3, 'pencil', 0, false);
        
        game.camera.follow(frog);
    
        cursors = game.input.keyboard.createCursorKeys();
        spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        fire = game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
        
        bgmusic = game.sound.add("bgmusic1");
        bgmusic.volume = 0.3;
        bgmusic.loop = true;
        bgmusic.play();
        
        jumpSound = game.sound.add("jump");
        thudSound = game.sound.add("thud");
        
    	nextFire = game.time.now + FIRE_RATE;
    
    }

    var jumpTimer = 0;
    
	function update() {
	
	    game.physics.arcade.collide(frog, layer);
	    game.physics.arcade.collide(enemies, layer);
	    game.physics.arcade.overlap(frog, enemies, hurtFrog, null, this);
	    game.physics.arcade.overlap(enemies, weapons, hurtEnemy, null, this);
	    
	    if (frog.body.onFloor() && frog.falling) {
	        frog.falling = false;
	        thudSound.play();
	    }
	    
	    if (!frog.immune) {
	        frog.body.velocity.x = 0;
	    }
	
	    if (spacebar.isDown) {
	        if (frog.body.onFloor() && jumpTimer === 0) {
	            // jump is allowed to start
	            jumpTimer = 1;
	            frog.body.velocity.y = -400;
	            jumpSound.play();
	        } else if (jumpTimer > 0 && jumpTimer < 31) {
	            // keep jumping higher
	            jumpTimer++;
	            frog.body.velocity.y = -400 + (jumpTimer * 7);
	        }
	    } else {
	        // jump button not being pressed, reset jump timer
	        jumpTimer = 0;
	    }
	
	    if (fire.isDown) {
	    	throwSomething();
	    }
	    
	    if (!frog.immune) {
	        if (cursors.left.isDown) {
	            frog.body.velocity.x = -150;
	        } else if (cursors.right.isDown) {
	            frog.body.velocity.x = 150;
	        }
	    }
	
	    if (frog.body.velocity.y > 0) {
	        frog.falling = true;
	    }
	    
	    setAnimation(frog);
	
	}
	
    function hurtFrog(f, e) {
        
        if (!f.immune) {
            f.immune = true;
            f.alpha = 0.5;
            f.damage(0.1);
            if (f.body.position.x < e.body.position.x) {
                f.body.velocity.x = -300;
            } else {
                f.body.velocity.x = 300;
            }
            game.time.events.add(500, function() {
                f.immune = false;
                f.alpha = 1;
            }, this);
        }
        
    }

	function hurtEnemy(e, w) {
	    
	    if (!e.immune) {
	        e.immune = true;
	        e.alpha = 0.5;
	        e.damage(0.1);
	        
	        w.exists = false;
	        
	        game.time.events.add(200, function() {
	            e.immune = false;
	            e.alpha = 1;
	        }, this);
	    }
	    
	}

	function throwSomething() {
	
		if (game.time.now > nextFire) {
	
			nextFire = game.time.now + FIRE_RATE;
	
			var weapon = weapons.getFirstExists(false);
	        if (weapon){
	            weapon.exists = true;
	            weapon.anchor.setTo(0.5, 0.5);
	            weapon.lifespan = 1500;
	            weapon.reset(frog.body.position.x+20, frog.body.position.y-20);
	            game.physics.arcade.enable(weapon);
	            weapon.body.velocity.y = -400;
	            weapon.body.angularVelocity = 50;
	            if(frog.direction == 1){
	                weapon.body.velocity.x = 500;
	            }else{
	                weapon.body.velocity.x = -500;
	            }
	            
	        }
	
		}
	
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
        f.falling = false;
        f.immune = false;
        f.health = 3;
        
        f.animations.add("left", [0, 1, 2], 10, true);
        f.animations.add("right", [3, 4, 5], 10, true);
        f.animations.currentAnim = f.animations.getAnimation(ani);
    	
        f.events.onKilled.add(function() {
            console.log("game over!");
        }, this);
        
        return f;
        
    }
	
	function setAnimation(f) {

	    if (f.body.velocity.x === 0) {
	        f.animations.stop(null, true);
	    } else {

	        if (f.body.velocity.x > 0) {
	            f.animations.play("right");
	            f.direction = 1;
	        } else if (f.body.velocity.x < 0) {
	            f.animations.play("left");
	            f.direction = -1;
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

