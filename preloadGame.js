class preloadGame extends Phaser.Scene {
	constructor() {
		super("PreloadGame");
	}
	preload() {
		// BACKGROUND TEXTURES
		this.load.image("bg_1", "assets/1.png");
		this.load.image("bg_2", "assets/2.png");
		this.load.image("bg_3", "assets/3.png");
		this.load.image("bg_4", "assets/4.png");
		this.load.image("bg_5", "assets/5.png");
		this.load.image("ground", "assets/ground.png");
		this.load.image("ground2", "assets/ground2.png");
		this.load.image("platform", "assets/platform.png");
		// BACKGROUND ELEMENTS
		this.load.image("tree", "assets/tree.png");
		this.load.image("bush", "assets/bush.png");
		this.load.image("town", "assets/town.png");
		this.load.image("rocks", "assets/rocks.png");
		this.load.image("grass", "assets/grass.png");
		// OBSTACLES
		this.load.image("skull", "assets/skull.png");
		this.load.image("crack", "assets/crack.png");
		this.load.spritesheet("bird", "assets/bird.png", {
			frameWidth: 150,
			frameHeight: 153
		});
		// PLAYER
		this.load.spritesheet("woody", "assets/woody.png", {
			frameWidth: 273,
			frameHeight: 279
		});
		// FOREGROUND
		this.load.image("window", "assets/window.png");
		this.load.image("light", "assets/window_light.png");
		// MENU
		this.load.image("menubg", "assets/menubg.png");
		this.load.image("startbtn", "assets/startbtn.png");
		this.load.image("restartbtn", "assets/restartbtn.png");
		this.load.image("soundoff", "assets/soundoff.png");
		// AUDIO
		this.load.audio("jump_sound", ["assets/sounds/jump.wav", "assets/sounds/jump.mp3", "assets/sounds/jump.ogg"]);
		this.load.audio("slide_sound", "assets/sounds/slide.wav");
		this.load.audio("collision_sound", "assets/sounds/collision.wav");
		this.load.audio("music_sound", "assets/sounds/music.mp3");
	}
	create() {
		this.menubg = this.add.tileSprite(0, 0, 1200, 675, "menubg").setOrigin(0, 0);
		this.soundoff = this.add.image(587, 561, "soundoff").setOrigin(0, 0).setAlpha(0);

		let highscore = localStorage.getItem('highscore');
		let score = localStorage.getItem('score');

		if (score != null) {
			this.restartbtn = this.add.tileSprite(1200 / 2 - 121, 300, 243, 69, "restartbtn").setOrigin(0, 0);
			this.restartbtn.setInteractive({ useHandCursor: true });
		} else {
			this.startbtn = this.add.tileSprite(1200 / 2 - 121, 300, 243, 69, "startbtn").setOrigin(0, 0);
			this.startbtn.setInteractive({ useHandCursor: true });
		}

		this.input.on('gameobjectdown', () => this.scene.start("PlayGame"));

		if (localStorage.getItem('volume') == null) {
			localStorage.setItem('volume', '1');
			this.soundoff.setAlpha(0);
		} else {
			if (localStorage.getItem('volume') == '1') {
				this.soundoff.setAlpha(0);
			} else {
				this.soundoff.setAlpha(1);
			}
		}

		this.input.keyboard.on('keydown', (event) => {
			if (event.code == 'KeyR') {
				this.scene.start("PlayGame");
			}
			if (event.code == 'KeyS') {
				if (localStorage.getItem('volume') == '1') {
					localStorage.setItem('volume', '0');
				} else {
					localStorage.setItem('volume', '1');
				}

				if (localStorage.getItem('volume') == '1') {
					this.soundoff.setAlpha(0);
				} else {
					this.soundoff.setAlpha(1);
				}
			}
		});

		if (score) {
			let marginLeft = 0;
			if (score < 100) {
				marginLeft = 540;
			} else if (score >= 100 && score < 1000) {
				marginLeft = 520;
			} else if (score >= 1000) {
				marginLeft = 505;
			}
			this.scoreLabel = this.add.text(marginLeft, 40, score + ' M', {
				font: '68px ARCADECLASSIC',
				fill: '#c7523b',
				align: "center"
			});
			localStorage.removeItem('score');
		}

		if (highscore) {
			this.highscore = this.add.text(505, 110, 'HIGHSCORE', {
				font: '38px ARCADECLASSIC',
				fill: '#fec89d',
				align: "center"
			});

			let marginLeft = 0;
			if (highscore < 100) {
				marginLeft = 570;
			} else if (highscore >= 100 && highscore < 1000) {
				marginLeft = 555;
			} else if (highscore >= 1000) {
				marginLeft = 545;
			}
			this.highscoreLabel = this.add.text(marginLeft, 150, highscore + ' M', {
				font: '38px ARCADECLASSIC',
				fill: '#fec89d',
				align: "center"
			});
		}
	}
}