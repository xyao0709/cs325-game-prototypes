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
            game.load.image('house','assets/House_Big/Houses_Big_withHorse.png');
            game.load.image('icon1', 'assets/House_icon/Houses_Icon1.png');
            game.load.image('icon2', 'assets/House_icon/Houses_Icon2.png');
            game.load.image('icon3', 'assets/House_icon/Houses_Icon3.png');
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

            game.load.onLoadComplete.add(onLoad);
            var deadLine = false;
            setTimeout(function() {
                deadLine = true;
            }, 2000);
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

            var title = game.add.text(game.world.centerX, game.world.height * 0.25, 'Welcome~', {
                fontSize: '40px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            title.anchor.setTo(0.5, 0.5);

            var remind = game.add.text(game.world.centerX, game.world.height * 0.75, 'Click anywhere', {
                fontSize: '20px',
                fill: '#f2bb15'
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
//         var score = 0;
        var count1 = 0;
        var count2 = 0;
        var count3 = 0;
//         var title; 
        var bgMusic;
        this.create = function() {
//             score = 0;
            count1 = 0;
            count2 = 0;
            count3 = 0;
    
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
       
//             title = game.add.text(game.world.centerX, game.world.height * 0.25, '0', {
//                 fontSize: '40px',
//                 fontWeight: 'bold',
//                 fill: '#f2bb15'
//             });
//             title.anchor.setTo(0.5, 0.5);
            
            var ani1 = game.add.image(game.world.centerX / 6, game.world.height * 0.85, 'cat1');
            var title1 = game.add.text(game.world.centerX / 6, game.world.height * 0.95, '0', {
                fontSize: '20px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            title1.anchor.setTo(0.5, 0.5);
            
            var ani2 = game.add.image(game.world.centerX / 2, game.world.height * 0.85, 'cat2');
            var title2 = game.add.text(game.world.centerX / 2, game.world.height * 0.95, '0', {
                fontSize: '20px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            title2.anchor.setTo(0.5, 0.5);
            
            var ani3 = game.add.image(game.world.centerX * 5 / 6, game.world.height * 0.85, 'cat3');
            var title3 = game.add.text(game.world.centerX * 5 / 6, game.world.height * 0.95, '0', {
                fontSize: '20px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            title3.anchor.setTo(0.5, 0.5);
 
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
//                         if (animal.type !== 'dog') game.state.start('over', true, false, score);
                        if (animal.type !== 'dog') game.state.start('over', true, false);
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
      
//                 game.state.start('over', true, false, score);
                game.state.start('over', true, false);
            } else {
                if(animal.type === 'cat1'){
                    count1 += 1;
                    var img = 'pick';
                }
                if (animal.type === 'cat2') {
                    count2 += 1;
                    img = 'pick';
                } else if (animal.type === 'cat3') {
                    count3 += 1;
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
       
//                 score += point;
//                 title.text = score;
                
                title1.text = count1;
                title2.text = count2;
                title3.text = count3;

                animal.kill();

            }
        }
    },

    over: function() {
//         var score = 0;
//         this.init = function() {
//             score = arguments[0];
//         }
        this.create = function() {
   
            var bg = game.add.image(0, 0, 'bg');
            bg.width = game.world.width;
            bg.height = game.world.height;
    
            var title = game.add.text(game.world.centerX / 3, game.world.height * 0.25, 'Your House', {
                fontSize: '40px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            title.anchor.setTo(0.5, 0.5);
            
            var house = game.add.image(game.world.centerX / 2, game.world.height * 0.6, 'house');
            var ani1 = game.add.image(game.world.centerX / 6, game.world.height * 0.85, 'cat1');
            var ani2 = game.add.image(game.world.centerX / 2, game.world.height * 0.85, 'cat2');
            var ani3 = game.add.image(game.world.centerX * 5 / 6, game.world.height * 0.85, 'cat3');
            var man = game.add.image(game.world.width * 3 / 4, game.world.height * 0.85, 'basket');
            var playButton1 = game.add.button( game.world.width * 3 / 4, game.world.height * 0.25, null, 'icon1', 'icon3');
            var playButton2 = game.add.button( game.world.width * 3 / 4, game.world.height * 0.5, null, 'icon2', 'icon3');
            
//             var scoreStr = 'Score:：'+score;
//             var scoreText = game.add.text(game.world.centerX, game.world.height * 0.4, scoreStr, {
//                 fontSize: '30px',
//                 fontWeight: 'bold',
//                 fill: '#f2bb15'
//             });
//             scoreText.anchor.setTo(0.5, 0.5);
            
//             var remind = game.add.text(game.world.centerX, game.world.height * 0.6, 'Click anywhere', {
//                 fontSize: '20px',
//                 fontWeight: 'bold',
//                 fill: '#f2bb15'
//             });
//             remind.anchor.setTo(0.5, 0.5);
         
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
