export enum ItemType {
  PASSIVE = 'passive',
  ACTIVE = 'active'
}

export enum ItemRarity {
  COMMON = 'common',
  RARE = 'rare', 
  EPIC = 'epic'
}

export interface ItemEffect {
  type: 'damage' | 'range' | 'fireRate' | 'goldBonus' | 'active'
  value: number
  duration?: number // for active items
}

export interface ItemConfig {
  id: string
  name: string
  description: string
  type: ItemType
  rarity: ItemRarity
  effect: ItemEffect
  color: number
  dropChance: number // 0-100
}

export class Item {
  public sprite: Phaser.GameObjects.Container
  public config: ItemConfig
  public isPickedUp: boolean = false
  public cooldown: number = 0
  
  private scene: Phaser.Scene
  private glowTween?: Phaser.Tweens.Tween

  constructor(scene: Phaser.Scene, x: number, y: number, config: ItemConfig) {
    this.scene = scene
    this.config = config

    // Create item container
    this.sprite = scene.add.container(x, y)

    // Create item background circle based on rarity
    const bgColor = this.getRarityColor()
    const background = scene.add.circle(0, 0, 15, bgColor, 0.8)
    background.setStrokeStyle(2, 0xffffff, 0.9)

    // Create item icon (simple shape for now)
    const icon = this.createItemIcon()
    
    this.sprite.add([background, icon])

    // Add glow effect
    this.addGlowEffect()

    // Make interactive
    this.sprite.setInteractive(new Phaser.Geom.Circle(0, 0, 15), Phaser.Geom.Circle.Contains)
    this.sprite.on('pointerdown', () => {
      this.pickup()
    })

    // Auto-pickup after 10 seconds
    scene.time.delayedCall(10000, () => {
      if (!this.isPickedUp) {
        this.pickup()
      }
    })
  }

  private getRarityColor(): number {
    switch (this.config.rarity) {
      case ItemRarity.COMMON: return 0x95a5a6
      case ItemRarity.RARE: return 0x3498db
      case ItemRarity.EPIC: return 0x9b59b6
      default: return 0x95a5a6
    }
  }

  private createItemIcon(): Phaser.GameObjects.Shape {
    // Create different icons based on item effect type
    switch (this.config.effect.type) {
      case 'damage':
        return this.scene.add.star(0, 0, 5, 6, 10, 0xf39c12)
      case 'range':
        return this.scene.add.circle(0, 0, 8, 0x2ecc71, 0)
          .setStrokeStyle(3, 0x2ecc71)
      case 'fireRate':
        return this.scene.add.triangle(0, 0, 0, -8, -6, 8, 6, 8, 0xe74c3c)
      case 'goldBonus':
        return this.scene.add.star(0, 0, 6, 4, 8, 0xf1c40f)
      case 'active':
        return this.scene.add.polygon(0, 0, [0, -8, 8, 0, 0, 8, -8, 0], 0xe67e22)
      default:
        return this.scene.add.circle(0, 0, 6, 0xffffff)
    }
  }

  private addGlowEffect(): void {
    this.glowTween = this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }

  private pickup(): void {
    if (this.isPickedUp) return
    
    this.isPickedUp = true
    
    // Stop glow effect
    if (this.glowTween) {
      this.glowTween.destroy()
    }

    // Pickup animation
    this.scene.tweens.add({
      targets: this.sprite,
      y: this.sprite.y - 30,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        // Emit pickup event
        this.scene.events.emit('itemPickedUp', this.config)
        this.destroy()
      }
    })
  }

  public destroy(): void {
    if (this.glowTween) {
      this.glowTween.destroy()
    }
    this.sprite.destroy()
  }

  // Static methods to create different item types
  public static createDamageBoost(): ItemConfig {
    return {
      id: 'damage_boost',
      name: 'Spell Power Crystal',
      description: '+25% damage to all wizards',
      type: ItemType.PASSIVE,
      rarity: ItemRarity.COMMON,
      effect: { type: 'damage', value: 25 },
      color: 0xf39c12,
      dropChance: 35
    }
  }

  public static createRangeBoost(): ItemConfig {
    return {
      id: 'range_boost', 
      name: 'Range Amplifier',
      description: '+30% range to all wizards',
      type: ItemType.PASSIVE,
      rarity: ItemRarity.COMMON,
      effect: { type: 'range', value: 30 },
      color: 0x2ecc71,
      dropChance: 30
    }
  }

  public static createFireRateBoost(): ItemConfig {
    return {
      id: 'fire_rate_boost',
      name: 'Mana Battery',
      description: '+40% attack speed to all wizards', 
      type: ItemType.PASSIVE,
      rarity: ItemRarity.RARE,
      effect: { type: 'fireRate', value: 40 },
      color: 0xe74c3c,
      dropChance: 20
    }
  }

  public static createGoldBonus(): ItemConfig {
    return {
      id: 'gold_bonus',
      name: 'Treasure Map',
      description: '+50% gold from next 5 enemies',
      type: ItemType.PASSIVE,
      rarity: ItemRarity.RARE,
      effect: { type: 'goldBonus', value: 50 },
      color: 0xf1c40f,
      dropChance: 15
    }
  }

  public static getAllItemTypes(): ItemConfig[] {
    return [
      Item.createDamageBoost(),
      Item.createRangeBoost(), 
      Item.createFireRateBoost(),
      Item.createGoldBonus()
    ]
  }
}