import { GameScene } from "./scenes/GameScene"
import { initializeFarcadeSDK } from "./utils/RemixUtils"
import GameSettings from "./config/GameSettings"

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement

// Game configuration
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL, // Using WebGL for shader support
  width: GameSettings.canvas.width,
  height: GameSettings.canvas.height,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "gameContainer",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GameSettings.canvas.width,
    height: GameSettings.canvas.height,
  },
  canvas: canvas,
  backgroundColor: "#111111",
  scene: [GameScene],
  physics: {
    default: "arcade",
  },
  // Target frame rate
  fps: {
    target: 60,
  },
  // Additional WebGL settings
  pixelArt: false,
  antialias: true,
}

// Create the game instance
const game = new Phaser.Game(config)

// Initialize Farcade SDK
game.events.once("ready", () => {
  initializeFarcadeSDK(game)
})
