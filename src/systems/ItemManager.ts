import { ItemConfig, ItemType } from "../objects/Item"

export class ItemManager {
  private scene: Phaser.Scene
  private inventory: ItemConfig[] = []
  private maxInventorySize: number = 5
  private activeEffects: Map<string, number> = new Map()
  
  // UI elements
  private inventoryContent: Phaser.GameObjects.Container
  private itemSlots: Phaser.GameObjects.Container[] = []

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    console.log('ItemManager: Creating inventory content...')
    this.createInventoryContent()
    console.log('ItemManager: Inventory content created')
  }

  private createInventoryContent(): void {
    // Create inventory content container (will be added to tab)
    this.inventoryContent = this.scene.add.container(0, -40)
    
    // Add title with proper padding from top
    const title = this.scene.add.text(240, -35, 'Item Inventory', {
      fontSize: '14px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    this.inventoryContent.add(title)

    // Create item slots horizontally centered
    for (let i = 0; i < this.maxInventorySize; i++) {
      const slotX = 80 + (i * 80)
      const slot = this.createItemSlot(slotX, 0)
      this.itemSlots.push(slot)
      this.inventoryContent.add(slot)
    }
    
    // Initially hidden - will be controlled by TabManager
    this.inventoryContent.setVisible(false)
  }

  private createItemSlot(x: number, y: number): Phaser.GameObjects.Container {
    const slot = this.scene.add.container(x, y)
    
    // Empty slot background
    const bg = this.scene.add.rectangle(0, 0, 50, 40, 0x2c3e50, 0.8)
    bg.setStrokeStyle(1, 0x7f8c8d, 0.5)
    slot.add(bg)
    
    return slot
  }

  public addItem(item: ItemConfig): boolean {
    console.log('ItemManager: Adding item:', item.name, 'Current inventory size:', this.inventory.length)
    
    if (this.inventory.length >= this.maxInventorySize) {
      console.log('ItemManager: Inventory full, cannot add item')
      return false
    }

    this.inventory.push(item)
    this.applyItemEffect(item)
    this.updateInventoryDisplay()
    console.log('ItemManager: Item added successfully, new inventory size:', this.inventory.length)
    return true
  }

  private applyItemEffect(item: ItemConfig): void {
    switch (item.effect.type) {
      case 'damage':
        this.activeEffects.set('damageMultiplier', 
          (this.activeEffects.get('damageMultiplier') || 0) + item.effect.value)
        break
      case 'range':
        this.activeEffects.set('rangeMultiplier', 
          (this.activeEffects.get('rangeMultiplier') || 0) + item.effect.value)
        break
      case 'fireRate':
        this.activeEffects.set('fireRateMultiplier', 
          (this.activeEffects.get('fireRateMultiplier') || 0) + item.effect.value)
        break
      case 'goldBonus':
        this.activeEffects.set('goldMultiplier', 
          (this.activeEffects.get('goldMultiplier') || 0) + item.effect.value)
        // Could add duration tracking for temporary bonuses
        break
    }

    // Emit event to update all wizards
    this.scene.events.emit('itemEffectsUpdated', this.activeEffects)
  }

  private updateInventoryDisplay(): void {
    // Clear all slots first
    this.itemSlots.forEach(slot => {
      // Remove old item displays but keep the background
      const children = [...slot.list]
      children.forEach(child => {
        if (child !== slot.list[0]) { // Keep the background (first child)
          child.destroy()
        }
      })
    })

    // Display current items
    this.inventory.forEach((item, index) => {
      if (index < this.itemSlots.length) {
        this.displayItemInSlot(item, this.itemSlots[index])
      }
    })
  }

  private displayItemInSlot(item: ItemConfig, slot: Phaser.GameObjects.Container): void {
    // Create item icon based on effect type
    let icon: Phaser.GameObjects.Shape
    
    switch (item.effect.type) {
      case 'damage':
        icon = this.scene.add.star(0, 0, 5, 4, 8, 0xf39c12)
        break
      case 'range':
        icon = this.scene.add.circle(0, 0, 6, 0x2ecc71, 0)
        icon.setStrokeStyle(2, 0x2ecc71)
        break
      case 'fireRate':
        icon = this.scene.add.triangle(0, 0, 0, -6, -4, 6, 4, 6, 0xe74c3c)
        break
      case 'goldBonus':
        icon = this.scene.add.star(0, 0, 4, 3, 6, 0xf1c40f)
        break
      default:
        icon = this.scene.add.circle(0, 0, 6, 0xffffff)
    }

    slot.add(icon)

    // Add item name text (small)
    const nameText = this.scene.add.text(0, 15, item.name, {
      fontSize: '8px',
      color: '#ffffff',
      fontFamily: 'Arial',
      wordWrap: { width: 45 }
    }).setOrigin(0.5)
    slot.add(nameText)
  }

  public getEffect(effectType: string): number {
    return this.activeEffects.get(effectType) || 0
  }

  public hasEffect(effectType: string): boolean {
    return this.activeEffects.has(effectType) && this.activeEffects.get(effectType)! > 0
  }

  public getDamageMultiplier(): number {
    return 1 + (this.getEffect('damageMultiplier') / 100)
  }

  public getRangeMultiplier(): number {
    return 1 + (this.getEffect('rangeMultiplier') / 100)
  }

  public getFireRateMultiplier(): number {
    return 1 + (this.getEffect('fireRateMultiplier') / 100)
  }

  public getGoldMultiplier(): number {
    return 1 + (this.getEffect('goldMultiplier') / 100)
  }

  public reset(): void {
    this.inventory = []
    this.activeEffects.clear()
    this.updateInventoryDisplay()
  }

  public getInventoryContent(): Phaser.GameObjects.Container {
    return this.inventoryContent
  }

  public destroy(): void {
    this.inventoryContent.destroy()
    this.inventory = []
    this.activeEffects.clear()
  }
}