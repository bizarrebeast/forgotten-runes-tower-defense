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
      unlockWave: 1,
    },
    alchemist: {
      cost: 75,
      damage: 15,
      range: 100,
      fireRate: 0.8,
      unlockWave: 1,
    },
    enchanter: {
      cost: 100,
      damage: 8, // Low direct damage
      range: 90,
      fireRate: 0.6,
      unlockWave: 10,
      buffRange: 150, // Range to buff other wizards
      buffMultiplier: 1.3, // 30% damage boost
    },
    necromancer: {
      cost: 125,
      damage: 12,
      range: 110,
      fireRate: 0.7,
      unlockWave: 25,
      summonCooldown: 8000, // 8 seconds between summons
      skeletonHealth: 80,
    },
    elementalist: {
      cost: 150,
      damage: 25, // High damage but cycles elements
      range: 130,
      fireRate: 0.9,
      unlockWave: 50,
      elementCycle: ['fire', 'ice', 'lightning'], // Rotates through elements
      aoeRange: 60, // Area of effect range
    },
    diviner: {
      cost: 200,
      damage: 35, // Highest single-target damage
      range: 200, // Longest range
      fireRate: 0.5, // Slowest but powerful
      unlockWave: 75,
      pierceCount: 3, // Hits up to 3 enemies in line
      bossBonus: 2.0, // Double damage vs bosses
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
