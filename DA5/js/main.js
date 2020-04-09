var game = new Phaser.Game(400, 700, Phaser.AUTO, '#game');

var states = {
    preload: function() {
        this.preload = function() {
            game.stage.backgroundColor = '#000000';
            
            game.load.crossOrigin = 'anonymous'; 
            game.load.image('bg', 'assets/Background/Background_Forest.jpg');
            game.load.image('basket', 'assets/People/People_Girl1.png');
            game.load.image('cat1', 'assets/Animals/Pets_Pokemon1.png');
            game.load.image('cat2', 'assets/Animals/Pets_Pokemon2.png');
            game.load.image('cat3', 'assets/Animals/Pets_Pokemon3.png');
            game.load.image('dog', 'assets/Bomb.png');
            game.load.image('pick', 'assets/Moods/Pets_Moods1.png');
            game.load.audio('bgMusic', 'assets/background.mp3');

            var progressText = game.add.text(game.world.centerX, game.world.centerY, '0%', {
                fontSize: '60px',
                fill: '#ffffff'
            });
            progressText.anchor.setTo(0.5, 0.5);

            game.load.onFileComplete.add(function(progress) {
                progressText.text = progress + '%';
            });

            game.state.start('created');
        }
    },

    created: function() {
        this.create = function() {

            var bg = game.add.image(0, 0, 'bg');
            bg.width = game.world.width;
            bg.height = game.world.height;

            var title = game.add.text(game.world.centerX, game.world.height * 0.25, 'Welcome~', {
                fontSize: '40px',
                fontWeight: 'bold',
                fill: '#000000'
            });
            title.anchor.setTo(0.5, 0.5);

            var remind = game.add.text(game.world.centerX, game.world.height * 0.75, 'Click anywhere', {
                fontSize: '20px',
                fill: '#000000'
            });
            remind.anchor.setTo(0.5, 0.5);

            // var basket = game.add.sprite(game.world.centerX, game.world.height * 0.75, 'basket');
            // var basketImage = game.cache.getImage('basket');
            // basket.width = game.world.width * 0.2;
            // basket.height = basket.width / basketImage.width * basketImage.height;
            // basket.anchor.setTo(0.5, 0.5);

            game.input.onTap.add(function() {
                game.state.start('play');
            });
        }
    },

    play: function() {
        var bas; 
        var animals;
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
      
            basket = game.add.sprite(game.world.centerX, game.world.height * 0.75, 'basket');
            var basketImage = game.cache.getImage('basket');
            basket.width = game.world.width * 0.2;
            basket.height = basket.width / basketImage.width * basketImage.height;
            basket.anchor.setTo(0.5, 0.5);
            game.physics.enable(basket); 
            basket.body.allowGravity = false;
       
            title = game.add.text(game.world.centerX, game.world.height * 0.25, '0', {
                fontSize: '40px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            title.anchor.setTo(0.5, 0.5);
 
            var touching = false;
  
            game.input.onDown.add(function(pointer) {
          
                if (Math.abs(pointer.x - basket.x) < basket.width / 2) touching = true;
            });
   
            game.input.onUp.add(function() {
                touching = false;
            });

            game.input.addMoveCallback(function(pointer, x, y, isTap) {
                if (!isTap && touching) basket.x = x;
            });
       
            animals = game.add.group();
    
            var animalTypes = ['cat1', 'cat2', 'cat3', 'dog'];
            var animalTimer = game.time.create(true);
            animalTimer.loop(1000, function() {
                var x = Math.random() * game.world.width;
                var index = Math.floor(Math.random() * animalTypes.length)
                var type = animalTypes[index];
                var animal = animals.create(x, 0, type);
                animal.type = type;
    
                game.physics.enable(animal);

                var animalImg = game.cache.getImage(type);
                animal.width = game.world.width / 8;
                animal.height = animal.width / animalImg.width * animalImg.height;
      
                animal.body.collideWorldBounds = true;
                animal.body.onWorldBounds = new Phaser.Signal();
                animal.body.onWorldBounds.add(function(animal, up, down, left, right) {
                    if (down) {
                        animal.kill();
                        if (animal.type !== 'dog') game.state.start('over', true, false, score);
                    }
                });
            });
            animalTimer.start();
        }
        this.update = function() {
       
            game.physics.arcade.overlap(basket, animals, pickAnimal, null, this);
        }
  
        function pickAnimal(basket, animal) {
            if (animal.type === 'dog') {
      
                game.state.start('over', true, false, score);
            } else {
                var point = 1;
                var img = 'pick';
                if (animal.type === 'cat2') {
                    point = 3;
                    img = 'pick';
                } else if (animal.type === 'cat3') {
                    point = 5;
                    img = 'pick';
                }
         
                var goal = game.add.image(animal.x, animal.y, img);
                var goalImg = game.cache.getImage(img);
                goal.width = animal.width;
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

                animal.kill();

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
            var scoreStr = 'Score:：'+score;
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
