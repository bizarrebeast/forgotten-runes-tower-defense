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
  private itemEffects: Map<string, number> = new Map()

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

    // Listen for item effect updates
    scene.events.on('itemEffectsUpdated', (effects: Map<string, number>) => {
      this.updateItemEffects(effects)
    })
  }

  public canFire(): boolean {
    const currentTime = this.scene.time.now
    const timeSinceLastFire = currentTime - this.lastFireTime
    const effectiveFireRate = this.getEffectiveFireRate()
    const fireInterval = 1000 / effectiveFireRate // Convert to milliseconds
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
    return this.getDistanceTo(target) <= this.getEffectiveRange()
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

  // Item effect methods
  public updateItemEffects(effects: Map<string, number>): void {
    this.itemEffects = new Map(effects)
    
    // Update range circle size based on new effective range
    const effectiveRange = this.getEffectiveRange()
    this.rangeCircle.setRadius(effectiveRange)
  }

  public getEffectiveDamage(): number {
    const damageMultiplier = 1 + ((this.itemEffects.get('damageMultiplier') || 0) / 100)
    return Math.floor(this.config.damage * damageMultiplier)
  }

  public getEffectiveRange(): number {
    const rangeMultiplier = 1 + ((this.itemEffects.get('rangeMultiplier') || 0) / 100)
    return Math.floor(this.config.range * rangeMultiplier)
  }

  public getEffectiveFireRate(): number {
    const fireRateMultiplier = 1 + ((this.itemEffects.get('fireRateMultiplier') || 0) / 100)
    return this.config.fireRate * fireRateMultiplier
  }
}