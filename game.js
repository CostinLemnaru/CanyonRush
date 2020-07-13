var game;
var audioContext = new ((window).AudioContext || (window).webkitAudioContext)();
window.onload = function(){
  // game config
  let gameConfig = {
    type: Phaser.CANVAS,
    width: 1200,
    height: 675,
    roundPixels: false,
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: {
          gravity: {
            y: 0
          },
          debug: false
      }
    },
    scene: [preloadGame, playGame]
  }
  game = new Phaser.Game(gameConfig);
  centerCanvas();
}
