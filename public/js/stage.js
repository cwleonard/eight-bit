
function stage(gs) {
    
    var gameState = gs;
    
	var mapKey;
	var musicKey;
	
    var frog;
    var group;
    var layer;
    var enemies;
    var platforms;
    var fallingPlatforms;
    var weapons;
    var weaponsGroup;
    var weaponIndex = 0;
    var meters;
    var health;
    var livesText;
    
    var bgmusic;
    var jumpSound;
    var thudSound;
    var dieSound;
    
    var cursors;
    var spacebar;
    var fire;
    var weaponSelect;
    
    var FIRE_RATE = 250;
    var nextFire;

    var jumpTimer = 0;
    
    
    
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
    
    
    function hurtFrog(f, e) {
        
        if (!f.immune) {
            f.animations.stop(null, true);
            f.frame = 3;
            f.immune = true;
            f.damage(10);
            if (f.body.position.x < e.body.position.x) {
                f.body.velocity.x = -200;
            } else {
                f.body.velocity.x = 200;
            }
            
//            f.injuryTween.to( { alpha: 0.5 }, 60, Phaser.Easing.Linear.None, true, 0, 2, true);
            
            var t = this.add.tween(f);
            t.onComplete.add(function() {
                f.immune = false;
            });
            t.to( { alpha: 0.5 }, 60, Phaser.Easing.Linear.None, true, 0, 2, true);
            
        }
        
    }

    function hurtEnemy(e, w) {
        
        if (!e.immune) {
            e.immune = true;
            e.damage(w.power);
            
            w.exists = false;

            var t = this.add.tween(e);
            t.onComplete.add(function() {
                e.immune = false;
            });
            t.to( { alpha: 0.5 }, 50, Phaser.Easing.Linear.None, true, 0, 2, true);

        }
        
    }

    function throwSomething(game) {
        
        // has it been long enough? can we throw something yet?
        if (game.time.now > nextFire) {
    
            nextFire = game.time.now + FIRE_RATE;
    
            // see if a weapon is available from the group
            var weapon = weapons[weaponIndex].sprites.getFirstExists(false);
            if (weapon) {
    
                weapon.exists = true;
                weapon.anchor.setTo(0.5, 0.5);
                weapon.reset(frog.body.position.x+20, frog.body.position.y-20);
                game.physics.arcade.enable(weapon);
    
                weapon.lifespan = weapons[weaponIndex].lifespan;
                weapon.body.angularVelocity = weapons[weaponIndex].spin;
                weapon.body.velocity.y = weapons[weaponIndex].velocity.y;
                weapon.power = weapons[weaponIndex].power;
                if (frog.scale.x == 1) {
                    weapon.body.velocity.x = weapons[weaponIndex].velocity.x;
                } else{
                    weapon.body.velocity.x = -weapons[weaponIndex].velocity.x;
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
    function createFrog(game, grp, x, y, ss, mv, ani) {
        
        var f = grp.create(x, y, ss);
        f.anchor.setTo(0.5, 0);
        game.physics.enable(f, Phaser.Physics.ARCADE);
        f.name = "frog";
        f.body.setSize(60, 25, 0, 38);
        f.body.collideWorldBounds = true;
        f.checkWorldBounds = true;
        f.outOfBoundsKill = true;
        f.falling = false;
        f.immune = false;
        f.health = 100;
        
//        f.injuryTween = game.add.tween(f);
//        f.injuryTween.onComplete.add(function() {
//            f.immune = false;
//        });
        
        f.lockTo = function(platform) {
            this.locked = true;
            this.lockedTo = platform;
            this.body.velocity.y = 0;
        };
        
        f.cancelLock = function() {
            this.locked = false;
            this.lockedTo = null;
        }
        
        f.animations.add("run", [0, 1, 2], 10, true);
        
        f.events.onKilled.add(function() {
            dieSound.play();
            gameState.lives--;
            bgmusic.stop();
            if (gameState.lives === 0) {
                console.log("game over!");
                game.state.start("stageSelect");
            } else {
                game.state.restart();
            }
        }, this);
        
        return f;
        
    }
    
    function createHealthBar(game) {
        
        // create a plain black rectangle to use as the background of a health meter
        var meterBackgroundBitmap = game.add.bitmapData(20, 100);
        meterBackgroundBitmap.ctx.beginPath();
        meterBackgroundBitmap.ctx.rect(0, 0, meterBackgroundBitmap.width, meterBackgroundBitmap.height);
        meterBackgroundBitmap.ctx.fillStyle = '#000000';
        meterBackgroundBitmap.ctx.fill();
    
        // create a Sprite using the background bitmap data
        var healthMeterBG = game.add.sprite(10, 10, meterBackgroundBitmap);
        healthMeterBG.fixedToCamera = true;
        meters.add(healthMeterBG);
    
        // create a red rectangle to use as the health meter itself
        var healthBitmap = game.add.bitmapData(12, 92);
        healthBitmap.ctx.beginPath();
        healthBitmap.ctx.rect(0, 0, healthBitmap.width, healthBitmap.height);
        healthBitmap.ctx.fillStyle = '#FF0000';
        healthBitmap.ctx.fill();
        
        // create the health Sprite using the red rectangle bitmap data
        health = game.add.sprite(14, 14, healthBitmap);
        meters.add(health);
        health.fixedToCamera = true;
        
    }

    function createLivesCounter(game) {
        
        var g = game.add.image(40, 15, "glasses", 0, meters);
        g.fixedToCamera = true;

        livesText = game.add.text(78, 5, "x " + gameState.lives, {
            fontSize: 20,
            fill: "#FFFFFF",
            stroke: "#000000",
            strokeThickness: 3
        }, meters);

        livesText.fixedToCamera = true;
        
    }
    
    function extraLife() {
        gameState.lives++;
        livesText.text = "x " + gameState.lives;
    }

    function updateHealthBar() {
        
        var m = (100 - frog.health) / 100;
        var bh = 92 - (92 * m);
        var offset = 92 - bh;
        
        health.key.context.clearRect(0, 0, health.width, health.height);
        health.key.context.fillRect(0, offset, 12, bh);
        health.key.dirty = true;
        
    }
    
    // any object that should be a toad
    function setupToad(game, obj) {
    
        game.physics.enable(obj, Phaser.Physics.ARCADE);
        obj.body.setSize(60, 25, 0, 38);
        obj.health = 40;
    
        obj.jumping = true;
    
        obj.jump = function() {
            this.frame = 1;
            this.body.velocity.y = -600;
            this.jumping = true;
        };
    
        obj.update = function() {
    
            if (this.body.onFloor() && this.jumping) {
                this.jumping = false;
                this.frame = 0;
                game.time.events.add(5000, function() {
                    this.jump();
                }, this);
            }
    
        };
    
    }

    // any object that should be a rabbit
    function setupRabbit(game, obj) {
    
        game.physics.enable(obj, Phaser.Physics.ARCADE);
        //obj.body.setSize(60, 25, 0, 38);
        obj.health = 60;
        obj.anchor.setTo(0.5, 0);
        obj.jumping = false;
        obj.activated = false;
    
        obj.jump = function() {
        	
        	var dir = (this.position.x < frog.position.x ? 1 : -1);
        	
        	this.scale.x = -dir;
            this.frame = 1;
            this.body.velocity.y = -650;
            this.body.velocity.x = 200 * dir;
            this.jumping = true;
        };
    
        obj.update = function() {
        	
            if (this.body.onFloor() && this.jumping) {
                this.jumping = false;
                this.body.velocity.x = 0;
                this.frame = 0;
                game.time.events.add(2500, function() {
                    this.jump();
                }, this);
            }

        	if (!this.activated && Math.abs(this.position.x - frog.position.x) < 200) {
        		this.activated = true;
        		game.time.events.add(100, function() {
                    this.jump();
                }, this);
        	}
    

        };
    
    }

    // any object that should be a dinosaur (boss)
    function setupDino(game, obj) {
    
        obj.roarSound = game.sound.add("roar");
        
        obj.tailTosser = game.add.emitter(0, 0, 5);
        obj.tailTosser.makeParticles('dino-plate', 0, 5, true);
        obj.tailTosser.gravity = 30;
        obj.tailTosser.maxParticleSpeed.x = -700;
        obj.tailTosser.minParticleSpeed.x = -400;
        obj.tailTosser.maxParticleSpeed.y = -500;
        obj.tailTosser.minParticleSpeed.y = -300;
        
        game.physics.enable(obj, Phaser.Physics.ARCADE);
        
        obj.anchor.setTo(0.5, 0);
        obj.body.collideWorldBounds = true;
        //obj.body.setSize(60, 25, 0, 38);
        obj.health = 150;
        obj.startingX = obj.position.x + 96;
        obj.walkDir = 1;
        obj.screaming = false;
        obj.attacking = false;
        obj.active = false;
        obj.immunue = true;
        
        obj.events.onKilled.add(function() {
            gameState.stagesComplete[gameState.currentLevel] = true;
            bgmusic.stop();
            game.state.start("stageSelect");            
        });
    
        obj.animations.add("walk", [2, 3], 3, true);
        //obj.animations.play("walk");

        obj.turnAround = function() {
            this.walkDir = -this.walkDir;
            this.scream();
        };
        
        obj.scream = function() {
            this.immune = false;
            this.roarSound.play();
            this.body.velocity.x = 0;
            this.screaming = true;
            this.animations.stop();
            this.frame = 1;
            game.time.events.add(1000, function() {
                this.screaming = false;
                this.attack();
            }, this);
        };

        obj.attack = function() {
            this.body.velocity.x = 0;
            this.attacking = true;
            this.animations.stop();
            this.frame = 4;
            this.tailTosser.x = this.position.x + 100;
            this.tailTosser.y = this.position.y;
            this.tailTosser.start(true, 2000, null, 5);
            game.time.events.add(1000, function() {
                this.attacking = false;
                obj.animations.play("walk");
            }, this);
        };

        obj.update = function() {
            
            if (!this.active && Math.abs(Math.abs(frog.position.x) - Math.abs(this.position.x)) < 600) {
                this.active = true;
                this.scream();
            }
            
            if (!this.active) return;
            
            if (!this.screaming) this.immune = true;
            
            game.physics.arcade.overlap(frog, this.tailTosser, hurtFrog, null, game);
            if (this.walkDir == 1 && this.position.x < (this.startingX - 500)) {
                this.turnAround();
            } else if (this.walkDir == -1 && this.position.x >= this.startingX) {
                this.turnAround();
            }
            if (!this.screaming && !this.attacking) {
                this.body.velocity.x = -100 * (this.walkDir);
            }
        };
        
    }

    function setAnimation(f) {
    
        if (f.body.velocity.y === 0 || f.locked) {
    
            if (f.body.velocity.x === 0) {
    
                // no animation, the frog is still
                f.animations.stop(null, true);
    
            } else if (!f.immune) {
    
                if (f.body.velocity.x > 0) {
                    f.scale.x = 1;
                } else if (f.body.velocity.x < 0) {
                    f.scale.x = -1;
                }
                f.animations.play("run");
    
            }
    
        } else if (!f.immune) {
    
            // no animation, use a fixed frame
            f.animations.stop(null, true);
            
            if (f.body.velocity.y < 0) {
                f.frame = 1;
            } else if (f.body.velocity.y > 0) {
                f.frame = 2;
            }
    
        }
    
    }

    function platformSep(s, platform) {
        
        if (!s.locked && s.body.touching.down) {
            s.lockTo(platform);
        }
        
    }

	function fallPlatformSep(s, platform) {
	
	    if (!s.locked && s.body.touching.down) {
	        s.lockTo(platform);
	    }
	
	    if (!platform.activated) {
	        platform.activated = true;
	        var origY = platform.position.y;
	        platform.game.time.events.add(1000, function() {
	            var t = platform.game.add.tween(platform.position);
	            var dist = ((platform.game.world.height + 100) - platform.y);
	            var frames = dist * 2.25;
	            t.to( { y: platform.position.y + dist }, frames, Phaser.Easing.Quadratic.In, false, 0, 0, false);
	            t.onComplete.add(function() {
	                platform.game.time.events.add(2000, function() {
	                	platform.activated = false;
	                	platform.position.y = origY;
	                	var t2 = platform.game.add.tween(platform);
	                	t2.to({ alpha: 0.5 }, 150, Phaser.Easing.Linear.None, true, 0, 3, true);
	                });
	            });
	            t.start();
	        }, this);
	        
	    }
	    
	}

    // --------------------------------------
    
    
    function preload() {
        
        this.load.pack("main", "assets/pack.json");
        
        this.load.audio("bgmusic", [gameState.levels[gameState.currentLevel].music]);
        
        //musicFile = gameState.levels[gameState.currentLevel].music;
        
    }
    
    function create() {
        
        mapKey = gameState.levels[gameState.currentLevel].map;
        musicKey = "bgmusic";
        
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.checkCollision.down = false;
        this.physics.arcade.TILE_BIAS = 32;
        this.physics.arcade.gravity.y = 1500;
        
        this.tweens.frameBased = true;
    
        this.stage.backgroundColor = gameState.levels[gameState.currentLevel].background;
    
        var map = this.add.tilemap(mapKey);
        map.addTilesetImage("ground", "tiles");
    
        var bglayer = map.createLayer("bg");
        bglayer.scrollFactorX = 0.5;

        var layer2 = map.createLayer("layer2");

        layer = map.createLayer("layer1");
        layer.resizeWorld();
    
        map.setLayer(layer);
        
        var CLOUD1_ID = 6571;
        var CLOAD2_ID = 6572;
        var FALLING_PLATFORM_ID = 6573;
        
        platforms = this.add.group();
        platforms.enableBody = true;
        map.createFromObjects('others', CLOUD1_ID, 'cloud-blue', 0, true, false, platforms);
        platforms.forEach(function(p) {
            
            this.physics.enable(p, Phaser.Physics.ARCADE);
            p.body.allowGravity = false;
            p.body.immovable = true;
            
            var t = this.add.tween(p.position);
            var dist = (p.distance ? Number(p.distance) : 128);
            if (p.direction == "left") {
                t.to( { x: p.position.x - dist }, 3000, Phaser.Easing.Linear.None, true, 0, -1, true);
            } else if (p.direction == "right") {
                t.to( { x: p.position.x + dist }, 3000, Phaser.Easing.Linear.None, true, 0, -1, true);
            } else if (p.direction == "up") {
                t.to( { y: p.position.y - dist }, 3000, Phaser.Easing.Linear.None, true, 0, -1, true);
            } else if (p.direction == "down") {
                t.to( { y: p.position.y + dist }, 3000, Phaser.Easing.Linear.None, true, 0, -1, true);
            }
            
        }, this);
        
        
        fallingPlatforms = this.add.group();
        fallingPlatforms.enableBody = true;
        map.createFromObjects('others', FALLING_PLATFORM_ID, 'falling-platform-red', 0, true, false, fallingPlatforms);
        fallingPlatforms.forEach(function(p) {
            
            this.physics.enable(p, Phaser.Physics.ARCADE);
            p.body.allowGravity = false;
            p.body.immovable = true;
            
            
        }, this);

        
        
        enemies = this.add.group();
        enemies.enableBody = true;
        
        var TOAD_ID = 6574;
        var RABBIT_ID = 6575;
        
        
        var toads = this.add.group();
        map.createFromObjects('others', TOAD_ID, 'toad', 0, true, false, toads);
        toads.forEach(function(t) {
            setupToad(this, t);
        }, this);
        
        var rabbits = this.add.group();
        map.createFromObjects('others', RABBIT_ID, 'rabbit', 0, true, false, rabbits);
        rabbits.forEach(function(r) {
            setupRabbit(this, r);
        }, this);
        
//        var dinos = this.add.group();
//        map.createFromObjects('others', 6574, 'dinosaur', 0, true, false, dinos);
//        dinos.forEach(function(d) {
//            setupDino(this, d);
//        }, this);
        
        enemies.addMultiple(toads);
        enemies.addMultiple(rabbits);
//        enemies.addMultiple(dinos);
        
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

        map.setCollisionBetween(65, 88);
        map.setCollisionBetween(155, 178);
        map.setCollisionBetween(245, 268);
        map.setCollisionBetween(335, 358);

        
        map.setCollisionBetween(1529, 1536);
        map.setCollisionBetween(1619, 1626);
        map.setCollisionBetween(1709, 1716);
        map.setCollisionBetween(1799, 1806);
        map.setCollisionBetween(1889, 1896);
        map.setCollisionBetween(1979, 1986);
        map.setCollisionBetween(2069, 2076);
        map.setCollisionBetween(2159, 2166);


        for (var u = 17; u < 6423; u += 90) {
            map.setCollisionBetween(u, (u+17));
        }

        for (var u = 34; u < 4564; u += 90) {
            map.setCollisionBetween(u, (u+29));
        }

        for (var u = 65; u < 4846; u += 90) {
            map.setCollisionBetween(u, (u+29));
        }

//        for (var u = 0; u < 36; u++) {
//            var temp = (u * 90) + 17;
//            map.setCollisionBetween(temp, (temp+71));
//        }

        for (var u = 2339; u < 5579; u += 90) {
            map.setCollisionBetween(u, (u+13));
        }

        
        // clouds/water
        map.setCollisionBetween(5669, 6483);
        
        
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
        
        group = this.add.group();
    
        frog = createFrog(this, group, 50, 50, "frog", 200, "left");
        
        weaponsGroup = this.add.group();
        weapons = [];
        weapons.push({
           name: 'pencil',
           lifespan: 1500,
           velocity: {
               x: 500,
               y: -400
           },
           spin: 50,
           power: 10
        });
        
        weapons.push({
            name: 'flask',
            lifespan: 1500,
            velocity: {
                x: 600,
                y: -600
            },
            spin: 50,
            power: 20
         });
        
        weapons.push({
            name: 'hammer',
            lifespan: 1500,
            velocity: {
                x: 600,
                y: -400
            },
            spin: 50,
            power: 30
         });
        
        weapons.push({
            name: 'brace',
            lifespan: 1500,
            velocity: {
                x: 800,
                y: -200
            },
            spin: 80,
            power: 40
         });
        
        for (var w = 0; w < weapons.length; w++) {
            var wg = this.add.group();
            wg.createMultiple(3, weapons[w].name, 0, false);
            weapons[w].sprites = wg;
            weaponsGroup.add(wg);
        }
        
        this.camera.follow(frog);
    
        cursors = this.input.keyboard.createCursorKeys();
        spacebar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        fire = this.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
        weaponSelect = this.input.keyboard.addKeys({
            'one'  : Phaser.KeyCode.ONE,
            'two'  : Phaser.KeyCode.TWO,
            'three': Phaser.KeyCode.THREE,
            'four' : Phaser.KeyCode.FOUR
        });
        
        
        bgmusic = this.sound.add(musicKey);
        bgmusic.volume = 0.3;
        bgmusic.loop = true;
        bgmusic.play();
        
        jumpSound = this.sound.add("jump");
        thudSound = this.sound.add("thud");
        dieSound = this.sound.add("die");
        
        nextFire = this.time.now + FIRE_RATE;
        
        meters = this.add.group();
        createHealthBar(this);
        createLivesCounter(this);
    
    }
    
    function update() {
        
        this.physics.arcade.collide(frog, layer);
        this.physics.arcade.collide(enemies, layer);
        this.physics.arcade.collide(frog, platforms, platformSep, null, this);
        this.physics.arcade.collide(frog, fallingPlatforms, fallPlatformSep, null, this);
        this.physics.arcade.overlap(frog, enemies, hurtFrog, null, this);
        this.physics.arcade.overlap(enemies, weaponsGroup.children, hurtEnemy, null, this);
        
        if ((frog.body.onFloor() || frog.locked) && frog.falling) {
            frog.falling = false;
            thudSound.play();
        }
        
        if (!frog.immune) {
            frog.body.velocity.x = 0;
        }
    
        if (spacebar.isDown) {
        
            if ((frog.body.onFloor() || frog.locked) && jumpTimer === 0) {
                // jump is allowed to start
                jumpTimer = 1;
                frog.body.velocity.y = -400;
                frog.cancelLock();
                jumpSound.play();
            } else if (jumpTimer > 0 && jumpTimer < 31 && !frog.body.blocked.up && !frog.body.touching.up) {
                // keep jumping higher
                jumpTimer++;
                frog.body.velocity.y = -400 + (jumpTimer * 7);
            } else if (frog.body.blocked.up || frog.body.touching.up) {
                // permanently end this jump
                jumpTimer = 999;
            }
            
        } else {
            // jump button not being pressed, reset jump timer
            jumpTimer = 0;
        }
        
        if (weaponSelect.one.isDown) {
            weaponIndex = 0;
        } else if (weaponSelect.two.isDown) {
            weaponIndex = 1;
        } else if (weaponSelect.three.isDown) {
            weaponIndex = 2;
        } else if (weaponSelect.four.isDown) {
            weaponIndex = 3;
        }
    
        if (fire.isDown) {
            throwSomething(this);
        }
        
        if (!frog.immune) {
            if (cursors.left.isDown) {
                frog.body.velocity.x = -150;
            } else if (cursors.right.isDown) {
                frog.body.velocity.x = 150;
            }
        }
    
        if (frog.body.velocity.y > 0 && !frog.locked) {
            frog.falling = true;
        }
        
        setAnimation(frog);
        
        enemies.forEach(function(t) {
            t.update();
        }, this);
        
        updateHealthBar();
    
    }
    
    function preRender() {
    	
        if (frog.locked) {
            if (frog.body.right < frog.lockedTo.body.x || frog.body.x > frog.lockedTo.body.right) {
                frog.cancelLock();
            } else {
                frog.x += frog.lockedTo.deltaX;
                frog.y += frog.lockedTo.deltaY;
            }
        }

    }
    
    function render() {
        
        // un-comment to see the boxes
        //this.debug.body(frog);
        
    }
    
    return {
        preload: preload,
        create: create,
        update: update,
        preRender: preRender,
        render: render
    };
    
}
	

