var mainState = {
	preload: function() {

		// This function will be executed at the beginning     
        // That's where we load the images and sounds 
        game.load.image('bird', 'assets/bird.png');
        game.load.image('pipe', 'assets/pipe.png');
        game.load.audio('jump', 'assets/jump.wav');

	},
	create: function() {

		this.jumpSound = game.add.audio('jump');

		//Score
		this.score = 0;
		this.labelScore = game.add.text(20, 20, "0", { font: '30px Arial', fill: '#ffffff'});

		//Pipes
		this.pipes = game.add.group();
		game.timer = game.time.events.loop(1500, this.addRowOfPipes, this); 

		// This function is called after the preload function     
        // Here we set up the game, display sprites, etc.
        console.log("Create");
        game.stage.backgroundColor = '#71c5cf';

        //Start physics engine
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //Display bird
        this.bird = game.add.sprite(100, 245, 'bird');

        //Enable bird's physics system
        game.physics.arcade.enable(this.bird);

        //Add gravity to the bird to make it fall
        this.bird.body.gravity.y = 1000;

        //Call jump function when spacekey is pressed
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        //move anchor to the left and downward
        this.bird.anchor.setTo(-0.2, 0.5);

	},
	update: function() {

		// This function is called 60 times per second    
        // It contains the game's logic 
        console.log("Updating game");

        //If bird is out of screen, call restartGame function
        if (this.bird.y < 0 || this.bird.y > 490) {
        	this.restartGame();
        }
        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);

        if (this.bird.angle < 20) {
        	this.bird.angle += 1;
        }

	},
	jump: function() {

		console.log(this);
		if (this.bird.alive == false) {
			return false;
		}
		this.bird.body.velocity.y = -350;
		var animation = game.add.tween(this.bird);
		animation.to({angle: -20}, 100);
		animation.start();
		this.jumpSound.play();

	},
	restartGame: function() {
		game.state.start('main');
	},
	hitPipe: function() {

		if (this.bird.alive == false) {
			return false;
		};

		//Set alive property of bird to false
		this.bird.alive = false;

		//prevent new pipes from appearing
		game.time.events.remove(game.timer);

		//go through all the pipes, and stop their movement
		this.pipes.forEach(function(p){
			p.body.velocity.x = 0;
		}, this);

	},
	addOnePipe: function(x, y) {
		
		console.log("Adding a pipe");
		//Create a pipe at the position x and y
		var pipe = game.add.sprite(x, y, 'pipe');

		//Add the pipe to our previously created group
		this.pipes.add(pipe);

		//Enable physics on the pipe
		game.physics.arcade.enable(pipe);

		//Add velocity to the pipe to make it move left
		pipe.body.velocity.x = -200;

		//Automatically kill the pipe when it's no longer visible
		pipe.checkWorldBounds = true;
		pipe.outOfBoundsKill = true;

	},
	addRowOfPipes: function() {

		//Randomly pick number between 1 and 5.
		//This will be the hole position
		var hole = Math.floor(Math.random() * 5) + 1;

		//Add the 6 pipes
		//With one big hole at position 'hole' and 'hole + 1'
		for (var i = 0; i < 8; i++) {
			if (i != hole && i != hole + 1) {
				this.addOnePipe(400, i * 60 + 10);
			}
		}

		this.score += 1;
		this.labelScore.text = this.score;

	}
}
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'zflappybird-game');
game.state.add('main', mainState);
game.state.start('main');