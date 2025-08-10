import GameSettings from "../config/GameSettings"
import { GridPosition } from "../systems/GridSystem"

export interface EnemyConfig {
  health: number
  speed: number
  goldReward: number
  color: number
  name: string
}

export class Enemy {
  public sprite: Phaser.GameObjects.Arc
  public healthBar: Phaser.GameObjects.Graphics
  public maxHealth: number
  public currentHealth: number
  public config: EnemyConfig
  public isAlive: boolean = true
  
  private path: GridPosition[]
  private pathIndex: number = 0
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene, path: GridPosition[], config: EnemyConfig, waveNumber: number) {
    this.scene = scene
    this.path = path
    this.config = config

    // Scale health based on wave number
    this.maxHealth = Math.floor(config.health * Math.pow(GameSettings.waves.enemyHealthScale, waveNumber - 1))
    this.currentHealth = this.maxHealth

    // Create enemy sprite at start of path
    const startPos = path[0]
    this.sprite = scene.add.circle(startPos.x, startPos.y, 15, config.color)
    this.sprite.setStrokeStyle(2, 0x000000)

    // Create health bar
    this.healthBar = scene.add.graphics()
    this.updateHealthBar()
  }

  public update(deltaTime: number): void {
    if (!this.isAlive || this.pathIndex >= this.path.length) return

    // Move towards next path point
    const currentTarget = this.path[this.pathIndex]
    const distance = Phaser.Math.Distance.Between(
      this.sprite.x, this.sprite.y,
      currentTarget.x, currentTarget.y
    )

    if (distance < 5) {
      // Reached current target, move to next
      this.pathIndex++
      if (this.pathIndex >= this.path.length) {
        // Reached end of path
        this.reachedEnd()
        return
      }
    }

    // Move towards target
    const angle = Phaser.Math.Angle.Between(
      this.sprite.x, this.sprite.y,
      currentTarget.x, currentTarget.y
    )

    // Scale speed based on wave number  
    const scaledSpeed = this.config.speed * Math.min(
      GameSettings.waves.maxSpeedMultiplier, 
      Math.pow(GameSettings.waves.enemySpeedScale, Math.floor((this.scene.registry.get('wave') || 1) - 1))
    )

    const velocity = {
      x: Math.cos(angle) * scaledSpeed * (deltaTime / 1000),
      y: Math.sin(angle) * scaledSpeed * (deltaTime / 1000)
    }

    this.sprite.x += velocity.x
    this.sprite.y += velocity.y

    // Update health bar position
    this.updateHealthBar()
  }

  public takeDamage(damage: number): boolean {
    this.currentHealth -= damage
    this.updateHealthBar()

    if (this.currentHealth <= 0) {
      this.die()
      return true // Enemy died
    }
    return false // Enemy still alive
  }

  private updateHealthBar(): void {
    this.healthBar.clear()
    
    if (this.currentHealth < this.maxHealth) {
      const barWidth = 30
      const barHeight = 4
      const x = this.sprite.x - barWidth / 2
      const y = this.sprite.y - 25

      // Background
      this.healthBar.fillStyle(0x000000, 0.7)
      this.healthBar.fillRect(x, y, barWidth, barHeight)

      // Health
      const healthPercent = this.currentHealth / this.maxHealth
      const healthColor = healthPercent > 0.5 ? 0x00ff00 : healthPercent > 0.25 ? 0xffff00 : 0xff0000
      this.healthBar.fillStyle(healthColor)
      this.healthBar.fillRect(x, y, barWidth * healthPercent, barHeight)
    }
  }

  private die(): void {
    this.isAlive = false
    
    // Award gold (via event system)
    this.scene.events.emit('enemyDied', this.config.goldReward)

    // Death effect
    const deathEffect = this.scene.add.circle(this.sprite.x, this.sprite.y, 20, 0xff0000, 0.7)
    this.scene.tweens.add({
      targets: deathEffect,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 300,
      onComplete: () => deathEffect.destroy()
    })

    this.destroy()
  }

  private reachedEnd(): void {
    this.isAlive = false
    
    // Player loses a life
    this.scene.events.emit('enemyReachedEnd')
    
    this.destroy()
  }

  public destroy(): void {
    this.sprite.destroy()
    this.healthBar.destroy()
  }

  public getPosition(): { x: number, y: number } {
    return { x: this.sprite.x, y: this.sprite.y }
  }

  public static getGoblinConfig(): EnemyConfig {
    return {
      ...GameSettings.enemies.goblin,
      color: 0x8B4513, // Brown
      name: "Goblin Raider"
    }
  }

  public static getShadowDemonConfig(): EnemyConfig {
    return {
      ...GameSettings.enemies.shadowDemon,
      color: 0x4B0082, // Dark Purple
      name: "Shadow Demon"
    }
  }
}