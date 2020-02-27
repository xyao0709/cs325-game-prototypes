var game = new Phaser.Game(400, 700, Phaser.AUTO, '#game');

var states = {
	preload: function() {
    	this.preload = function() {
            game.stage.backgroundColor = '#000000';
            
            game.load.crossOrigin = 'anonymous'; 
            game.load.image('bg', 'assets/background.jpeg');
            game.load.image('dude', 'assets/girl.png');
            game.load.image('green', 'assets/Cats/1.png');
            game.load.image('red', 'assets/Cats/2.png');
            game.load.image('yellow', 'assets/Cats/3.png');
            game.load.image('bomb', 'assets/Cats/bomb.png');
            game.load.image('five', 'assets/Cats/4.png');
            game.load.image('three', 'assets/Cats/4.png');
            game.load.image('one', 'assets/Cats/4.png');
            game.load.audio('bgMusic', 'assets/background.mp3');

            var progressText = game.add.text(game.world.centerX, game.world.centerY, '0%', {
                fontSize: '60px',
                fill: '#ffffff'
            });
            progressText.anchor.setTo(0.5, 0.5);

            game.load.onFileComplete.add(function(progress) {
                progressText.text = progress + '%';
            });

            game.load.onLoadComplete.add(onLoad);

            var deadLine = false;
            setTimeout(function() {
                deadLine = true;
            }, 3000);

            function onLoad() {
                if (deadLine) {

                    game.state.start('created');
                } else {
 
                    setTimeout(onLoad, 1000);
                }
            }
        }
    },

    created: function() {
    	this.create = function() {

            var bg = game.add.image(0, 0, 'bg');
            bg.width = game.world.width;
            bg.height = game.world.height;

            var title = game.add.text(game.world.centerX, game.world.height * 0.25, 'Catch Cats Mew~', {
                fontSize: '40px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            title.anchor.setTo(0.5, 0.5);

            var remind = game.add.text(game.world.centerX, game.world.centerY, 'Click anywhere', {
                fontSize: '20px',
                fill: '#f2bb15'
            });
            remind.anchor.setTo(0.5, 0.5);

            var man = game.add.sprite(game.world.centerX, game.world.height * 0.75, 'dude');
            var manImage = game.cache.getImage('dude');
            man.width = game.world.width * 0.2;
            man.height = man.width / manImage.width * manImage.height;
            man.anchor.setTo(0.5, 0.5);

            game.input.onTap.add(function() {
                game.state.start('play');
            });
        }
    },

    play: function() {
        var man; 
        var apples;
        var score = 0;
        var title; 
        var bgMusic;
        this.create = function() {
            score = 0;
    
            game.physics.startSystem(Phaser.Physics.Arcade);
            game.physics.arcade.gravity.y = 300;
           
            if (!bgMusic) {
                bgMusic = game.add.audio('bgMusic');
                bgMusic.loopFull();
            }
        
   
            var bg = game.add.image(0, 0, 'bg');
            bg.width = game.world.width;
            bg.height = game.world.height;
      
            man = game.add.sprite(game.world.centerX, game.world.height * 0.75, 'dude');
            var manImage = game.cache.getImage('dude');
            man.width = game.world.width * 0.2;
            man.height = man.width / manImage.width * manImage.height;
            man.anchor.setTo(0.5, 0.5);
            game.physics.enable(man); 
            man.body.allowGravity = false;
       
            title = game.add.text(game.world.centerX, game.world.height * 0.25, '0', {
                fontSize: '40px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            title.anchor.setTo(0.5, 0.5);
 
            var touching = false;
  
            game.input.onDown.add(function(pointer) {
          
                if (Math.abs(pointer.x - man.x) < man.width / 2) touching = true;
            });
   
            game.input.onUp.add(function() {
                touching = false;
            });

            game.input.addMoveCallback(function(pointer, x, y, isTap) {
                if (!isTap && touching) man.x = x;
            });
       
            apples = game.add.group();
    
            var appleTypes = ['green', 'red', 'yellow', 'bomb'];
            var appleTimer = game.time.create(true);
            appleTimer.loop(1000, function() {
                var x = Math.random() * game.world.width;
                var index = Math.floor(Math.random() * appleTypes.length)
                var type = appleTypes[index];
                var apple = apples.create(x, 0, type);
                apple.type = type;
    
                game.physics.enable(apple);

                var appleImg = game.cache.getImage(type);
                apple.width = game.world.width / 8;
                apple.height = apple.width / appleImg.width * appleImg.height;
      
                apple.body.collideWorldBounds = true;
                apple.body.onWorldBounds = new Phaser.Signal();
                apple.body.onWorldBounds.add(function(apple, up, down, left, right) {
                    if (down) {
                        apple.kill();
                        if (apple.type !== 'bomb') game.state.start('over', true, false, score);
                    }
                });
            });
            appleTimer.start();
        }
        this.update = function() {
       
            game.physics.arcade.overlap(man, apples, pickApple, null, this);
        }
  
        function pickApple(man, apple) {
            if (apple.type === 'bomb') {
      
                game.state.start('over', true, false, score);
            } else {
                var point = 1;
                var img = 'one';
                if (apple.type === 'red') {
                    point = 3;
                    img = 'three';
                } else if (apple.type === 'yellow') {
                    point = 5;
                    img = 'five';
                }
         
                var goal = game.add.image(apple.x, apple.y, img);
                var goalImg = game.cache.getImage(img);
                goal.width = apple.width;
                goal.height = goal.width / (goalImg.width / goalImg.height);
                goal.alpha = 0;
      
                var showTween = game.add.tween(goal).to({
                    alpha: 1,
                    y: goal.y - 20
                }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
                showTween.onComplete.add(function() {
                    var hideTween = game.add.tween(goal).to({
                        alpha: 0,
                        y: goal.y - 20
                    }, 100, Phaser.Easing.Linear.None, true, 200, 0, false);
                    hideTween.onComplete.add(function() {
                        goal.kill();
                    });
                });
       
                score += point;
                title.text = score;

                apple.kill();

            }
        }
    },

    over: function() {
        var score = 0;
        this.init = function() {
            score = arguments[0];
        }
        this.create = function() {
   
            var bg = game.add.image(0, 0, 'bg');
            bg.width = game.world.width;
            bg.height = game.world.height;
    
            var title = game.add.text(game.world.centerX, game.world.height * 0.25, 'Game over', {
                fontSize: '40px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            title.anchor.setTo(0.5, 0.5);
            var scoreStr = 'Score:：'+score+'分';
            var scoreText = game.add.text(game.world.centerX, game.world.height * 0.4, scoreStr, {
                fontSize: '30px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            scoreText.anchor.setTo(0.5, 0.5);
            var remind = game.add.text(game.world.centerX, game.world.height * 0.6, 'Click anywhere', {
                fontSize: '20px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            remind.anchor.setTo(0.5, 0.5);
         
            game.input.onTap.add(function() {
                game.state.start('play');
            });
        }
    }
};


Object.keys(states).map(function(key) {
	game.state.add(key, states[key]);
});


game.state.start('preload');