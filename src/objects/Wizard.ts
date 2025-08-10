import GameSettings from "../config/GameSettings"

export interface WizardConfig {
  cost: number
  damage: number
  range: number
  fireRate: number
  color: number
  name: string
}

export class Wizard {
  public sprite: Phaser.GameObjects.Arc
  public rangeCircle: Phaser.GameObjects.Arc
  public config: WizardConfig
  public gridCol: number
  public gridRow: number
  private lastFireTime: number = 0
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene, x: number, y: number, col: number, row: number, config: WizardConfig) {
    this.scene = scene
    this.gridCol = col
    this.gridRow = row
    this.config = config

    // Create wizard sprite (temporary circle)
    this.sprite = scene.add.circle(x, y, 25, config.color)
    this.sprite.setStrokeStyle(3, 0xffffff)
    
    // Create range indicator (hidden by default)
    this.rangeCircle = scene.add.circle(x, y, config.range, 0x00ff00, 0)
    this.rangeCircle.setStrokeStyle(2, 0x00ff00, 0.5)
    this.rangeCircle.setVisible(false)

    // Make wizard interactive
    this.sprite.setInteractive()
    this.sprite.on('pointerdown', () => {
      this.showRange()
    })
  }

  public canFire(): boolean {
    const currentTime = this.scene.time.now
    const timeSinceLastFire = currentTime - this.lastFireTime
    const fireInterval = 1000 / this.config.fireRate // Convert to milliseconds
    return timeSinceLastFire >= fireInterval
  }

  public fire(target: { x: number, y: number }): void {
    if (!this.canFire()) return

    this.lastFireTime = this.scene.time.now

    // Create projectile
    const projectile = this.scene.add.circle(this.sprite.x, this.sprite.y, 5, 0xffff00)
    
    // Calculate angle to target
    const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, target.x, target.y)
    const projectileSpeed = 300

    // Animate projectile to target
    this.scene.tweens.add({
      targets: projectile,
      x: target.x,
      y: target.y,
      duration: Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, target.x, target.y) / projectileSpeed * 1000,
      onComplete: () => {
        projectile.destroy()
      }
    })
  }

  public getDistanceTo(target: { x: number, y: number }): number {
    return Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, target.x, target.y)
  }

  public canTarget(target: { x: number, y: number }): boolean {
    return this.getDistanceTo(target) <= this.config.range
  }

  public showRange(): void {
    this.rangeCircle.setVisible(true)
    
    // Hide range after 2 seconds
    this.scene.time.delayedCall(2000, () => {
      this.rangeCircle.setVisible(false)
    })
  }

  public destroy(): void {
    this.sprite.destroy()
    this.rangeCircle.destroy()
  }

  public static getBattleMageConfig(): WizardConfig {
    return {
      ...GameSettings.wizards.battleMage,
      color: 0x8B008B, // Purple
      name: "Battle Mage"
    }
  }

  public static getAlchemistConfig(): WizardConfig {
    return {
      ...GameSettings.wizards.alchemist,
      color: 0x00FF00, // Green  
      name: "Alchemist"
    }
  }
}