/*
 * Boss setup functions.
 * 
 * The general contract is that a boss function takes the game object,
 * the enemies group, and the frog object.
 * 
 * It creates the boss and returns a reference to the Sprite.
 * 
 */

function beaver(game, grp, frog) {


    var obj = game.add.sprite(game.world.width - 150, 100, "beaver", 0, grp);

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
    obj.health = 150;
    obj.startingX = obj.position.x;
    obj.walkDir = 1;
    obj.attacking = false;
    obj.active = false;
    obj.immunue = false;

    obj.animations.add("walk", [0, 1], 3, true);
    obj.animations.play("walk");

    obj.turnAround = function() {
        this.walkDir = -this.walkDir;
    };

    obj.attack = function() {
        this.body.velocity.x = 0;
        this.attacking = true;
        this.animations.stop();
        this.frame = 2;
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
        }

        if (!this.active) return;

        game.physics.arcade.overlap(frog, this.tailTosser, function(a, b) {
            a.hurt(b);
        }, null, game);
        if (this.walkDir == 1 && this.position.x < (this.startingX - 300)) {
            this.turnAround();
        } else if (this.walkDir == -1 && this.position.x >= this.startingX) {
            this.turnAround();
        }
        if (!this.screaming && !this.attacking) {
            this.body.velocity.x = -100 * (this.walkDir);
        }
    };

    return obj;

}

// ---------------------------------------------------


function dinosaur(game, grp, frog) {

    var obj = game.add.sprite(game.world.width - 150, 100, "dinosaur", 0, grp);

    
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
        
        game.physics.arcade.overlap(frog, this.tailTosser, function(a, b) {
            a.hurt(b);
        }, null, game);
        
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

