// Create a new game instance 600px wide and 450px tall:
var game = new Phaser.Game(400, 450, Phaser.AUTO, '');
var laserTime = 0;
var bombTime = 0;
var Game = {
  preload: function(){
    game.load.image('player','/assets/images/player.png');
    game.load.image('laser','/assets/images/bullet.png');
    game.load.image('alien','/assets/images/alien.png');
    game.load.image('bomb','/assets/images/bomb.png');
    game.load.spritesheet('explosion','/assets/images/explosion.png',80,80);
  },
  create: function(){
    game.stage.backgroundColor = '#999999';
    game.physics.startSystem(Phaser.Physics.ARCADE);

    ship =  game.add.sprite(200,430,'player');
    ship.anchor.setTo(0.5,0.5);
    game.physics.arcade.enable(ship);
    ship.body.collideWorldBounds=true;

    aliens = game.add.group();
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;

    for (var y = 0; y < 4; y++) {
      for (var x = 0; x < 5; x++) {
        var alien = aliens.create(x * 72, y * 48, 'alien');
        alien.anchor.setTo(0.5, 0.5);
        alien.body.moves = false;
      }
    }

    aliens.x = 56;
    aliens.y = 36;

    aliens.forEach(function (alien, i) {
      game.add.tween(alien).to( { y: alien.body.y + 5 }, 500, Phaser.Easing.Sinusoidal.InOut, true, game.rnd.integerInRange(0, 500), 1000, true);
    });

    lasers = game.add.group();
    lasers.enableBody = true;
    lasers.physicsBodyType = Phaser.Physics.ARCADE;
    lasers.createMultiple(5, 'laser');
    lasers.setAll('anchor.x', 0.5);
    lasers.setAll('anchor.y', 1);
    lasers.setAll('checkWorldBounds', true);
    lasers.setAll('outOfBoundsKill', true);

    bombs = game.add.group();
    bombs.enableBody = true;
    bombs.physicsBodyType = Phaser.Physics.ARCADE;
    bombs.createMultiple(10, 'bomb');
    bombs.setAll('anchor.x', 0.5);
    bombs.setAll('anchor.y', 1);
    bombs.setAll('checkWorldBounds', true);
    bombs.setAll('outOfBoundsKill', true);

    explosions = game.add.group();
    explosions.createMultiple(10, 'explosion');
    explosions.setAll('anchor.x', 0.5);
    explosions.setAll('anchor.y', 0.5);
    explosions.forEach(setUp, this);

    function setUp(explosion){
      explosion.animations.add('explode');
    }

    this.SPACEBAR = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.LEFT = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.RIGHT = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  },

  update: function(){

    function firelaser () {
      if (game.time.now > laserTime) {
            laser = lasers.getFirstExists(false);
            if (laser) {
              // And fire it
              laser.reset(ship.x, ship.y - 16);
              laser.body.velocity.y = -400;
              laser.body.velocity.x = ship.body.velocity.x / 4
              laserTime = game.time.now + 400;
            }
      }
    }


    function handleBombs () {
      aliens.forEachAlive(function (alien) {
        chanceOfDroppingBomb = game.rnd.integerInRange(0, 20 * aliens.countLiving());
        if (chanceOfDroppingBomb == 0) {
          dropBomb(alien);
        }
      }, this)
    }

    function dropBomb (alien) {
      bomb = bombs.getFirstExists(false);

      if (bomb && ship.alive) {
        // And drop it
        bomb.reset(alien.x + aliens.x, alien.y + aliens.y + 16);
        bomb.body.velocity.y = +100;
        bomb.body.gravity.y = 250
      }
    }

    function explode (entity) {
      entity.kill();
      var explosion = explosions.getFirstExists(false);
      explosion.reset(entity.body.x + (entity.width / 2), entity.body.y + (entity.height / 2));
      explosion.play('explode', 30, false, true);
    }

    function collisionHandler(damage,entity){
        explode(entity);
        damage.kill();
    }

    game.physics.arcade.overlap(lasers, aliens, collisionHandler, null, this);
    game.physics.arcade.overlap(bombs, ship, collisionHandler, null, this);
    handleBombs();

    if(this.SPACEBAR.isDown) {
      firelaser();
    }

    //Ship movement start
    if (this.LEFT.isDown) ship.body.velocity.x = -300;
    else if (this.RIGHT.isDown)ship.body.velocity.x = 300;
    else ship.body.velocity.x = 0;
    //Ship movement end
  }
}

game.state.add('Game',Game);

game.state.start('Game');
