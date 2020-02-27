var game = new Phaser.Game(474, 843, Phaser.Auto, 'game', {preload: preload, create: create, update: update, render: render});

function preload(){
	// set background to white
	game.state.backgroundColor = '#FFFFFF';
	// load assets
    game.load.image('background', 'assets/background.jpeg');
   	game.load.image('basket', 'assets/basket.jpeg');
    game.load.audio('music', 'assets/background.mp3');
    var progMon = game.add.text(game.world.centerX, game.world.centerY, '0%',{
			fontSize: '60px',
			fill: '#FFD700'
		});
    progMon.anchor.setTo(0.5, 0.5);
    game.load.onFileComplete.add(function(prog){
    	progMon.text = prog + '%';
    });
}

function create(){
    game.add.sprite(0, 0, 'background');
}

function update(){

}

function render(){

}