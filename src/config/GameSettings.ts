/**
 * Game Settings for Forgotten Runes Tower Defense
 * Centralized configuration for all tunable game parameters
 */

export const GameSettings = {
  debug: true,

  canvas: {
    width: 480,
    height: 800,
  },

  grid: {
    cols: 8,
    rows: 12,
    tileSize: 50,
    offsetX: 40,
    offsetY: 120, // Increased by 20px to add space above HUD
  },

  game: {
    startingGold: 100,
    startingLives: 3,
  },

  wizards: {
    battleMage: {
      cost: 50,
      damage: 20,
      range: 120,
      fireRate: 1.0, // attacks per second
    },
    alchemist: {
      cost: 75,
      damage: 15,
      range: 100,
      fireRate: 0.8,
    }
  },

  enemies: {
    goblin: {
      health: 50,
      speed: 60,
      goldReward: 8,
    },
    shadowDemon: {
      health: 80,
      speed: 80,
      goldReward: 12,
    }
  },

  waves: {
    enemyHealthScale: 1.15,
    enemySpeedScale: 1.05,
    maxSpeedMultiplier: 2.0,
  }
}

export default GameSettings
