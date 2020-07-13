class playGame extends Phaser.Scene {
	constructor() {
		super("PlayGame");
	}

	create() {
		// VARIABLES
		this.colided = true;
		this.speed = 10;
		this.isJumping = false;
		this.isSliding = false;
		this.playerDead = false;
		this.i = 0;
		this.meters = 0;
		this.waitForMenu = 3;
		this.GW = game.config.width;
		this.GH = game.config.height;
		this.moveTownBool = false;
		this.moveTreeBool = false;
		this.x = true;
		this.intensity = 0;
		this.blocked = false;
		this.currentObstacle = null;
		this.volume = 0;
		this.ground_alpha = 0;

		// BACKGROUND
		this.bg_1 = this.add.tileSprite(0, 0, this.GW, this.GH, "bg_1").setOrigin(0, 0);
		this.bg_2 = this.add.tileSprite(0, 228, this.GW, 132, "bg_2").setOrigin(0, 0);
		this.bg_3 = this.add.tileSprite(0, 228, this.GW, 132, "bg_3").setOrigin(0, 0);
		this.bg_4 = this.add.tileSprite(0, 351, this.GW, 153, "bg_4").setOrigin(0, 0);
		this.town = this.add.image(this.GW, this.rand(300, 310), "town").setOrigin(0, 0);
		this.ground = this.add.tileSprite(0, 504, this.GW, 228, "ground").setOrigin(0, 0);
		this.ground2 = this.add.tileSprite(0, 504, this.GW, 171, "ground2").setOrigin(0, 0).setAlpha(0);
		this.rocks = this.add.image(300, 465, "rocks").setOrigin(0, 0);
		this.grass = this.add.image(900, 450, "grass").setOrigin(0, 0);
		this.platform = this.physics.add.image(this.GW / 2, this.GH - 30, "platform");
		this.platform.displayWidth = this.GW;

		// BG VEGETATION
		this.tree = this.add.image(this.GW, 220, "tree").setOrigin(0, 0);

		// OBSTACLE: SKULL
		this.skull = this.physics.add.image(this.GW, 504, "skull").setOrigin(0, 0);
		// OBSTACLE: CRACK
		this.crack = this.physics.add.image(this.GW, 504, "crack").setOrigin(0, 0);

		// PLAYER
		this.cowboy = this.physics.add.sprite(-100, 450, "woody");
		this.cowboy.setGravityY(4000);

		// OBSTACLE: BUSH
		this.bush = this.physics.add.image(this.GW + 100, 560, "bush");

		// OBSTACLE: BIRD
		this.bird = this.physics.add.sprite(this.GW, 290, "bird").setOrigin(0, 0);

		// AUDIO
		this.jump_sound = this.sound.add("jump_sound");
		this.slide_sound = this.sound.add("slide_sound");
		this.collision_sound = this.sound.add("collision_sound");
		this.music_sound = this.sound.add("music_sound");

		this.input.keyboard.on('keydown', (event) => {
			if (event.code == 'KeyS') {
				if (localStorage.getItem('volume') == '1') {
					localStorage.setItem('volume', '0');
				} else {
					localStorage.setItem('volume', '1');
				}
			}
		});

		// PHYSICS: COLLISIONS
		this.physics.add.collider(this.cowboy, this.platform, this.walk, null, this);
		this.physics.add.overlap(this.cowboy, this.skull, function (cowboy, skull) {
			if (!this.blocked) {
				if (this.isSliding) {
					this.playerDead = true;
					this.blocked = true;
					this.collision_sound.play({ volume: localStorage.getItem('volume') });
				} else if (skull.x <= 250 && skull.x >= 110) {
					this.playerDead = true;
					this.blocked = true;
					this.collision_sound.play({ volume: localStorage.getItem('volume') });
				}
			}
		}, null, this);
		this.physics.add.overlap(this.cowboy, this.crack, function (cowboy, crack) {
			if (!this.blocked) {
				if (this.isSliding) {
					if (crack.x <= 240) {
						this.playerDead = true;
						this.blocked = true;
						this.collision_sound.play({ volume: localStorage.getItem('volume') });
					}
				} else if (crack.x <= 180 && crack.x >= 100) {
					this.playerDead = true;
					this.blocked = true;
					this.collision_sound.play({ volume: localStorage.getItem('volume') });
				}
			}
		}, null, this);
		this.physics.add.overlap(this.cowboy, this.bush, function (cowboy, bush) {
			if (!this.blocked) {
				if (this.isSliding) {
					this.playerDead = true;
					this.blocked = true;
					this.collision_sound.play({ volume: localStorage.getItem('volume') });
				} else if (bush.x <= 280 && bush.x >= 220) {
					this.playerDead = true;
					this.blocked = true;
					this.collision_sound.play({ volume: localStorage.getItem('volume') });
				}
			}
		}, null, this);
		this.physics.add.overlap(this.cowboy, this.bird, function (cowboy, bird) {
			if (!this.blocked) {
				if (!this.isSliding && (bird.x <= 380 && bird.x >= 80)) {
					this.playerDead = true;
					this.blocked = true;
					this.collision_sound.play({ volume: localStorage.getItem('volume') });
				}
			}
		}, null, this);
		this.platform.setImmovable();
		this.skull.setGravityY(0);
		this.crack.setGravityY(0);
		this.bush.setGravityY(0);
		this.bird.setGravityY(0);

		// CONTROLS
		this.cursorKeys = this.input.keyboard.createCursorKeys();

		// INITIALIZE ANIMATIONS
		this.initAnims();

		// INITIALIZE LABELS
		this.scoreLabel = this.add.text(560, 40, '0 m', {
			font: '42px ARCADECLASSIC',
			fill: '#FFFFFF',
			align: "center"
		})
		.setShadow(2, 2, "#000000", 0, false, true)

		// FOREGROUND
		this.window = this.add.image(this.GW, this.GH, "window").setOrigin(0, 0);
		this.window.x = 0;
		this.window.y = 0;
		this.light = this.add.image(324, 609, "light").setOrigin(0, 0);
		this.light.x = 760;
		this.light.y = 33;

		// TOUCH SCREEN CONTROLS
		let jumpArea = new Phaser.Geom.Ellipse(this.GW / 2, 0, this.GW / 2, this.GH);
		this.window.setInteractive(jumpArea, Phaser.Geom.Rectangle.Contains).on('pointerdown', function (pointer, localX, localY, event) {
			if (!pointer.camera.scene.isJumping && !pointer.camera.scene.isSliding) {
				pointer.camera.scene.isJumping = true;
				pointer.camera.scene.cowboy.play('jump');
				pointer.camera.scene.cowboy.setVelocityY(-1200);
				pointer.camera.scene.colided = true;
				pointer.camera.scene.jump_sound.play({ volume: localStorage.getItem('volume') });
			}
		});
		let slideArea = new Phaser.Geom.Ellipse(0, 0, this.GW / 2, this.GH);
		this.bg_1.setInteractive(slideArea, Phaser.Geom.Rectangle.Contains).on('pointerdown', function (pointer, localX, localY, event) {
			if (!pointer.camera.scene.isJumping && !pointer.camera.scene.isSliding && !pointer.camera.scene.colided) {
				pointer.camera.scene.isSliding = true;
				pointer.camera.scene.cowboy.play('slide');
				pointer.camera.scene.slide_sound.play({ volume: localStorage.getItem('volume') });
			}
		});
	}

	update() {
		// MOVE BACKGROUND
		this.bg_2.tilePositionX += 1;
		this.bg_3.tilePositionX += 1.5;
		this.bg_4.tilePositionX += 2;
		this.ground.tilePositionX += this.speed;
		this.ground2.tilePositionX += this.speed;
		this.moveVegetation(this.rocks, this.speed);
		this.moveVegetation(this.grass, this.speed);

		this.moveTown(200, 2);
		this.moveTree(150, 2);

		if (this.cowboy.x <= 200) {
			this.cowboy.x += 3;
		} else {
			this.cowboy.setAlpha(1);
		}

		this.moveLight();
		this.controlPlayer();

		if (this.playerDead) {
			this.waitForMenu -= 0.02;
			this.dead();
		} else {
			this.meters += this.speed / 100;
		}

		this.scoreLabel.setText(this.round(this.meters, 1) + ' m');

		this.moveObstacles();
		this.setSpeed();

		if (this.blocked) {
			this.cowboy.x -= this.speed;
			this.cowboy.y += 10;
			if (this.currentObstacle == this.bird) {
				this.cowboy.rotation -= 0.07;
			} else {
				this.cowboy.rotation += 0.07;
			}
		}

		if (this.meters >= 25) {
			this.move(this.currentObstacle, this.speed);
		}
		if (this.meters >= 100) {
			this.ground_alpha += 0.005;
		}
		if (this.meters >= 100 && this.ground_alpha <= 1) {
			this.ground2.setAlpha(this.ground_alpha)
		}

		this.checkSound();
	}

	move(obj, speed) {
		if (obj == this.bird || obj == this.bush) {
			speed = speed + 2;
		}
		obj.x -= speed;
		if (obj.x + obj.displayWidth < 0) {
			obj.x = this.GW + 100;
			this.currentObstacle = null;
		}
		this.bush.rotation -= 0.07;
	}

	moveVegetation(obj, speed) {
		if (this.meters < 300) {
			obj.x -= speed;
		} else {
			if (obj.x + obj.displayWidth > 0 && obj.x < 1200) {
				obj.x -= speed;
			}
		}
		if (obj.x + obj.displayWidth < 0) {
			obj.x = this.GW + 100;
		}
	}

	moveObstacles() {
		let obstacles = ['skull', 'crack', 'bird', 'bush'];
		let obstacle = obstacles[this.rand(0, 4)];
		let obj;
		if (obstacle == 'skull') {
			obj = this.skull;
		} else if (obstacle == 'crack') {
			obj = this.crack;
		} else if (obstacle == 'bird') {
			obj = this.bird;
		} else if (obstacle == 'bush') {
			obj = this.bush;
		}

		if (this.currentObstacle == null) {
			this.currentObstacle = obj;
		}
	}

	moveTown(metters, speed) {
		let thisRoundedMetters = this.round(this.meters, 1);
		if (((thisRoundedMetters % metters) == 0) && this.meters >= 1) {
			this.moveTownBool = true;
		}
		if (this.town.x + this.town.displayWidth < 0) {
			this.resetPos(this.town);
			this.moveTownBool = false;
		}
		if (this.moveTownBool) {
			this.town.x -= speed;
		}
	}

	moveTree(metters, speed) {
		let thisRoundedMetters = this.round(this.meters, 1);
		if (((thisRoundedMetters % metters) == 0) && this.meters >= 1) {
			this.moveTreeBool = true;
		}
		if (this.tree.x + this.tree.displayWidth < 0) {
			this.resetPos(this.tree);
			this.moveTreeBool = false;
		}
		if (this.moveTreeBool) {
			this.tree.x -= speed;
		}
	}

	moveLight() {
		this.light.x -= 0.4;
		if (this.light.x > 400 && this.intensity <= 0.4) {
			this.intensity += 0.001;
		} else if (this.light.x < 600 && this.intensity >= 0) {
			this.intensity -= 0.001;
		}
		this.light.setAlpha(this.intensity);
		if (this.light.x < 100) {
			this.light.x = 760;
		}
	}

	setSpeed() {
		let speedArray = [10, 12, 14, 16, 18, 20, 22];
		if (this.meters < 100) {
			this.speed = speedArray[0];
		} else if (this.meters >= 100 && this.meters < 200) {
			this.speed = speedArray[1];
		} else if (this.meters >= 200 && this.meters < 350) {
			this.speed = speedArray[2];
		} else if (this.meters >= 350 && this.meters < 500) {
			this.speed = speedArray[3];
		} else if (this.meters >= 500 && this.meters < 750) {
			this.speed = speedArray[4];
		} else if (this.meters >= 750 && this.meters < 1000) {
			this.speed = speedArray[5];
		} else if (this.meters >= 1000) {
			this.speed = speedArray[6];
		}
	}

	resetPos(obj) {
		var randNo = this.rand(250, 1000);
		obj.x = this.GW + randNo;
	}

	rand(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	}

	round(x, precision) {
		var y = +x + (precision === undefined ? 0.5 : precision / 2);
		return y - (y % (precision === undefined ? 1 : +precision));
	}

	shuffle(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	}

	initAnims() {
		// player
		this.anims.create({
			key: 'walk',
			frames: this.anims.generateFrameNumbers('woody', { frames: [0, 1, 2, 3, 10, 11, 12, 13] }),
			frameRate: this.speed,
			repeat: -1,
		});
		this.anims.create({
			key: 'jump',
			frames: this.anims.generateFrameNumbers('woody', { frames: [4, 14] }),
			frameRate: 3,
			repeat: 0,
		});
		this.anims.create({
			key: 'slide',
			frames: this.anims.generateFrameNumbers('woody', { frames: [5, 6, 7, 8, 9, 15, 16, 17, 18, 19] }),
			frameRate: 12,
			repeat: 0,
		});
		this.cowboy.play('walk');

		// obstacles
		this.anims.create({
			key: 'fly',
			frames: this.anims.generateFrameNumbers('bird', { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8] }),
			frameRate: 15,
			repeat: -1,
		});
		this.bird.play('fly');
	}

	controlPlayer() {
		if (this.isSliding) {
			this.i++;
			if (this.i > 45) {
				this.isSliding = false;
				this.colided = true;
				this.i = 0;
			}
		}
		if (this.cursorKeys.up.isDown || this.cursorKeys.space.isDown) {
			this.jump();
		}
		if (this.cursorKeys.down.isDown && !this.isSliding) {
			this.slide();
		}
	}

	walk() {
		this.isJumping = false;
		if (this.colided) {
			this.cowboy.play('walk');
			this.colided = false;
		}
	}

	jump() {
		if (!this.isJumping && !this.isSliding && !this.blocked) {
			this.isJumping = true;
			this.cowboy.play('jump');
			this.jump_sound.play({ volume: localStorage.getItem('volume') });
			this.cowboy.setVelocityY(-1200);
			this.colided = true;
		}
	}

	slide() {
		if (!this.isJumping && !this.isSliding && !this.colided && !this.blocked) {
			this.isSliding = true;
			this.cowboy.play('slide');
			this.slide_sound.play({ volume: localStorage.getItem('volume') });
		}
	}

	dead() {
		if (this.waitForMenu <= 0) {
			let highscore = localStorage.getItem('highscore');
			if (highscore < this.round(this.meters)) {
				localStorage.setItem('highscore', this.round(this.meters));
			}
			localStorage.setItem('score', this.round(this.meters));
			this.music_sound.stop();
			this.scene.start("PreloadGame");
		}
	}

	checkSound() {
		if (parseInt(this.volume) < parseInt(localStorage.getItem('volume'))) {
			this.music_sound.play({ volume: localStorage.getItem('volume') / 2, loop: true });
			this.volume = localStorage.getItem('volume');
		}
		if (parseInt(localStorage.getItem('volume')) == 0) {
			this.music_sound.stop();
			this.volume = localStorage.getItem('volume');
		}
	}
}