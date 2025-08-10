import GameSettings from "../config/GameSettings"
import { GridSystem } from "../systems/GridSystem"
import { GameState } from "../systems/GameState"
import { ItemManager } from "../systems/ItemManager"
import { WizardManager } from "../systems/WizardManager"
import { TabManager } from "../systems/TabManager"
import { Wizard } from "../objects/Wizard"
import { Enemy } from "../objects/Enemy"
import { Item } from "../objects/Item"

export class GameScene extends Phaser.Scene {
  private gridSystem: GridSystem
  private gameState: GameState
  private itemManager: ItemManager
  private wizardManager: WizardManager
  private tabManager: TabManager
  private wizards: Wizard[] = []
  private enemies: Enemy[] = []
  private droppedItems: Item[] = []
  private gridGraphics: Phaser.GameObjects.Graphics
  
  // UI Elements
  private goldText: Phaser.GameObjects.Text
  private livesText: Phaser.GameObjects.Text
  private waveText: Phaser.GameObjects.Text
  private startWaveButton: Phaser.GameObjects.Text
  
  // Wave management
  private waveSpawnTimer: number = 0
  private currentWaveEnemies: number = 0
  private totalWaveEnemies: number = 0

  constructor() {
    super({ key: "GameScene" })
  }

  preload(): void {}

  create(): void {
    // Initialize systems
    this.gridSystem = new GridSystem(this)
    this.gameState = new GameState(GameSettings.game.startingGold, GameSettings.game.startingLives)
    this.itemManager = new ItemManager(this)
    this.wizardManager = new WizardManager(this)
    this.tabManager = new TabManager(this)
    
    // Store wave in registry for enemy scaling
    this.registry.set('wave', this.gameState.wave)

    // Create layered background
    this.add.rectangle(GameSettings.canvas.width / 2, GameSettings.canvas.height / 2, GameSettings.canvas.width, GameSettings.canvas.height, 0x1a252f)
    
    // Add subtle game area background - positioned exactly around the game board
    const gameAreaY = GameSettings.grid.offsetY + (GameSettings.grid.rows * GameSettings.grid.tileSize) / 2
    const gameAreaHeight = GameSettings.grid.rows * GameSettings.grid.tileSize
    this.add.rectangle(GameSettings.canvas.width / 2, gameAreaY, GameSettings.canvas.width - 30, gameAreaHeight, 0x2c3e50, 0.3)
    
    // Create grid graphics
    this.gridGraphics = this.add.graphics()
    this.gridSystem.drawGrid(this.gridGraphics)

    // Set up UI
    this.createUI()
    
    // Set up tabs
    this.setupTabs()
    
    // Set up input handling
    this.setupInputHandlers()
    
    // Set up event listeners
    this.setupEventListeners()

    // Title removed to make more space for gameplay
  }

  private createUI(): void {
    // Center HUD between top of screen and game board
    const hudHeight = 60
    const gameStartY = GameSettings.grid.offsetY
    const hudY = (gameStartY - hudHeight) / 2 // Center between top and game board
    const topPanel = this.add.rectangle(GameSettings.canvas.width / 2, hudY + hudHeight / 2, GameSettings.canvas.width - 20, hudHeight, 0x2c2c2c, 0.9)
    topPanel.setStrokeStyle(2, 0x555555)
    
    // Left side - Resources with more spacing
    this.goldText = this.add.text(30, hudY + 15, `Gold: ${this.gameState.gold}`, {
      fontSize: '16px',
      color: '#ffd700',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    })
    
    this.livesText = this.add.text(30, hudY + 35, `Lives: ${this.gameState.lives}`, {
      fontSize: '16px', 
      color: '#ff6b6b',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    })

    // Center - Wave info with larger font
    this.waveText = this.add.text(GameSettings.canvas.width / 2, hudY + hudHeight / 2, `Wave: ${this.gameState.wave}`, {
      fontSize: '20px',
      color: '#4ecdc4',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    // Right side - Start Wave button with better positioning
    this.startWaveButton = this.add.text(GameSettings.canvas.width - 30, hudY + hudHeight / 2, 'Start\nWave', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#27ae60',
      padding: { x: 12, y: 8 },
      fontFamily: 'Arial',
      align: 'center',
      fontStyle: 'bold'
    }).setOrigin(1, 0.5).setInteractive()

    this.startWaveButton.on('pointerdown', () => {
      if (!this.gameState.waveInProgress) {
        this.startWave()
      }
    })
  }

  private setupTabs(): void {
    // Add Wizards tab
    this.tabManager.addTab({
      id: 'wizards',
      title: 'Wizards',
      color: 0x8e44ad,
      content: this.wizardManager.getWizardContent()
    })

    // Add Items tab
    this.tabManager.addTab({
      id: 'items', 
      title: 'Items',
      color: 0x34495e,
      content: this.itemManager.getInventoryContent()
    })
  }


  private setupInputHandlers(): void {
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const selectedType = this.wizardManager.getSelectedWizardType()
      if (selectedType && this.gameState.gold > 0) {
        this.tryPlaceWizard(pointer.x, pointer.y)
      }
    })
  }

  private tryPlaceWizard(x: number, y: number): void {
    const gridPos = this.gridSystem.worldToGrid(x, y)
    const selectedType = this.wizardManager.getSelectedWizardType()
    
    if (this.gridSystem.canPlaceWizard(gridPos.col, gridPos.row) && selectedType) {
      let config
      let cost = 0

      switch(selectedType) {
        case 'battleMage':
          config = Wizard.getBattleMageConfig()
          cost = config.cost
          break
        case 'alchemist':
          config = Wizard.getAlchemistConfig()
          cost = config.cost
          break
        default:
          return
      }

      if (this.gameState.spendGold(cost)) {
        const worldPos = this.gridSystem.gridToWorld(gridPos.col, gridPos.row)
        const wizard = new Wizard(this, worldPos.x, worldPos.y, gridPos.col, gridPos.row, config)
        this.wizards.push(wizard)
        this.gridSystem.placeWizard(gridPos.col, gridPos.row)
        
        // Clear selection
        this.wizardManager.clearSelection()
      }
    }
  }

  private setupEventListeners(): void {
    // Listen for enemy death
    this.events.on('enemyDied', (goldReward: number) => {
      // Apply gold bonus from items
      const effectiveGold = Math.floor(goldReward * this.itemManager.getGoldMultiplier())
      this.gameState.addGold(effectiveGold)
    })

    // Listen for enemy reaching end
    this.events.on('enemyReachedEnd', () => {
      this.gameState.loseLife()
      if (this.gameState.gameOver) {
        this.gameOver()
      }
    })

    // Listen for item drops
    this.events.on('itemDropped', (item: Item) => {
      this.droppedItems.push(item)
    })

    // Listen for item pickups
    this.events.on('itemPickedUp', (itemConfig: any) => {
      this.itemManager.addItem(itemConfig)
      // Remove from dropped items array
      this.droppedItems = this.droppedItems.filter(item => !item.isPickedUp)
    })

    // Listen for wizard type selection
    this.events.on('wizardTypeSelected', (type: string) => {
      console.log('Wizard type selected:', type)
    })

    // Listen for game state changes
    this.gameState.onGoldChange((gold) => {
      this.goldText.setText(`Gold: ${gold}`)
    })

    this.gameState.onLivesChange((lives) => {
      this.livesText.setText(`Lives: ${lives}`)
    })

    this.gameState.onWaveChange((wave) => {
      this.waveText.setText(`Wave: ${wave}`)
      this.registry.set('wave', wave)
    })
  }

  private startWave(): void {
    this.gameState.setWaveInProgress(true)
    this.startWaveButton.setText('Wave\nActive')
    this.startWaveButton.setBackgroundColor('#e67e22')
    
    // Calculate enemies for this wave
    this.totalWaveEnemies = 5 + Math.floor(this.gameState.wave / 2) // 5 base + more each wave
    this.currentWaveEnemies = 0
    this.waveSpawnTimer = 0
  }

  private spawnEnemy(): void {
    if (this.currentWaveEnemies >= this.totalWaveEnemies) return

    const path = this.gridSystem.getPath()
    let config
    
    // Alternate between enemy types
    if (this.currentWaveEnemies % 2 === 0) {
      config = Enemy.getGoblinConfig()
    } else {
      config = Enemy.getShadowDemonConfig()
    }

    const enemy = new Enemy(this, path, config, this.gameState.wave)
    this.enemies.push(enemy)
    this.currentWaveEnemies++
  }

  private checkWaveComplete(): void {
    if (this.gameState.waveInProgress && 
        this.currentWaveEnemies >= this.totalWaveEnemies && 
        this.enemies.filter(e => e.isAlive).length === 0) {
      
      // Wave complete
      this.gameState.setWaveInProgress(false)
      this.gameState.nextWave()
      this.gameState.addGold(20 + this.gameState.wave * 5) // Wave completion bonus
      
      this.startWaveButton.setText('Start\nWave')
      this.startWaveButton.setBackgroundColor('#27ae60')
    }
  }

  update(_time: number, deltaTime: number): void {
    if (this.gameState.gameOver) return

    // Spawn enemies during wave
    if (this.gameState.waveInProgress && this.currentWaveEnemies < this.totalWaveEnemies) {
      this.waveSpawnTimer += deltaTime
      if (this.waveSpawnTimer >= 1000) { // Spawn every 1 second
        this.spawnEnemy()
        this.waveSpawnTimer = 0
      }
    }

    // Update enemies
    this.enemies = this.enemies.filter(enemy => {
      if (enemy.isAlive) {
        enemy.update(deltaTime)
        return true
      } else {
        return false // Remove dead enemies
      }
    })

    // Wizard targeting and shooting
    this.wizards.forEach(wizard => {
      if (wizard.canFire()) {
        // Find closest enemy in range
        let closestEnemy: Enemy | null = null
        let closestDistance = Infinity

        this.enemies.forEach(enemy => {
          if (enemy.isAlive) {
            const distance = wizard.getDistanceTo(enemy.getPosition())
            if (distance < closestDistance && wizard.canTarget(enemy.getPosition())) {
              closestEnemy = enemy
              closestDistance = distance
            }
          }
        })

        if (closestEnemy) {
          wizard.fire(closestEnemy.getPosition())
          
          // Apply damage after a short delay (projectile travel time)
          this.time.delayedCall(200, () => {
            if (closestEnemy && closestEnemy.isAlive) {
              const effectiveDamage = wizard.getEffectiveDamage()
              closestEnemy.takeDamage(effectiveDamage)
            }
          })
        }
      }
    })

    // Check if wave is complete
    this.checkWaveComplete()
  }

  private gameOver(): void {
    const gameOverText = this.add.text(GameSettings.canvas.width / 2, GameSettings.canvas.height / 2, 
      `Game Over!\nWave Reached: ${this.gameState.wave}\nClick to Restart`, {
      fontSize: '32px',
      color: '#ff0000',
      fontFamily: 'Arial',
      align: 'center'
    }).setOrigin(0.5)

    gameOverText.setInteractive()
    gameOverText.on('pointerdown', () => {
      this.restartGame()
    })
  }

  private restartGame(): void {
    // Force cleanup before restart
    this.cleanupGame()
    
    // Restart the scene
    this.scene.restart()
  }

  private cleanupGame(): void {
    // Clean up all wizards
    this.wizards.forEach(wizard => {
      if (wizard && wizard.destroy) {
        wizard.destroy()
      }
    })
    this.wizards = []

    // Clean up all enemies  
    this.enemies.forEach(enemy => {
      if (enemy && enemy.destroy) {
        enemy.destroy()
      }
    })
    this.enemies = []

    // Clean up all dropped items
    this.droppedItems.forEach(item => {
      if (item && item.destroy) {
        item.destroy()
      }
    })
    this.droppedItems = []

    // Reset managers
    if (this.itemManager) {
      this.itemManager.reset()
    }
    if (this.wizardManager) {
      this.wizardManager.clearSelection()
    }

    // Reset grid system
    if (this.gridSystem) {
      this.gridSystem.reset()
      this.gridSystem.drawGrid(this.gridGraphics)
    }

    // Clear wizard selection state handled by wizardManager.clearSelection() above

    // Clear any pending timers/tweens
    this.time.removeAllEvents()
    this.tweens.killAll()
  }

  shutdown(): void {
    this.cleanupGame()
  }
}
