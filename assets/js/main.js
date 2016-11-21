// Create a new game instance 600px wide and 450px tall:
var game = new Phaser.Game(400, 450, Phaser.AUTO, '');
var laserTime = 0;
var Game = {
  preload: function(){
    game.load.image('player','/assets/images/player.png');
    game.load.image('laser','/assets/images/bullet.png');
  },
  create: function(){
    game.stage.backgroundColor = '#999999';
    game.physics.startSystem(Phaser.Physics.ARCADE);

    ship =  game.add.sprite(200,400,'player');
    ship.anchor.setTo(0.5,0.5);
    game.physics.arcade.enable(ship);
    ship.body.collideWorldBounds=true;

    lasers = game.add.group();
    lasers.enableBody = true;
    lasers.physicsBodyType = Phaser.Physics.ARCADE;
    lasers.createMultiple(5, 'laser');
    lasers.setAll('anchor.x', 0.5);
    lasers.setAll('anchor.y', 1);
    lasers.setAll('checkWorldBounds', true);
    lasers.setAll('outOfBoundsKill', true);



    this.UP = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
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

    if(this.UP.isDown) {
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
