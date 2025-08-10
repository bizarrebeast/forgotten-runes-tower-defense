import { Wizard } from "../objects/Wizard"

interface WizardTypeInfo {
  id: string
  config: any
  unlockWave: number
  displayName: string
}

interface WizardCard {
  container: Phaser.GameObjects.Container
  background: Phaser.GameObjects.Rectangle
  sprite: Phaser.GameObjects.Arc
  nameText: Phaser.GameObjects.Text
  costText: Phaser.GameObjects.Text
  lockIcon?: Phaser.GameObjects.Text
}

export class WizardManager {
  private scene: Phaser.Scene
  private wizardContent: Phaser.GameObjects.Container
  private scrollContainer: Phaser.GameObjects.Container
  private wizardCards: Map<string, WizardCard> = new Map()
  private selectedWizardType: string | null = null
  private currentWave: number = 1

  // Layout constants
  private readonly CARD_WIDTH = 80
  private readonly CARD_HEIGHT = 70
  private readonly CARD_SPACING = 10
  private readonly SCROLL_AREA_WIDTH = 460 // Leave margins
  private readonly MENU_HEIGHT = 140 // Increased height for better spacing
  private readonly TAB_HEIGHT = 30 // Match TabManager's TAB_HEIGHT

  // Define all wizard types
  private wizardTypes: WizardTypeInfo[] = [
    {
      id: 'battleMage',
      config: Wizard.getBattleMageConfig(),
      unlockWave: 1,
      displayName: 'Battle Mage'
    },
    {
      id: 'alchemist', 
      config: Wizard.getAlchemistConfig(),
      unlockWave: 1,
      displayName: 'Alchemist'
    },
    {
      id: 'enchanter',
      config: Wizard.getEnchanterConfig(),
      unlockWave: 10,
      displayName: 'Enchanter'
    },
    {
      id: 'necromancer',
      config: Wizard.getNecromancerConfig(),
      unlockWave: 25,
      displayName: 'Necromancer'
    },
    {
      id: 'elementalist',
      config: Wizard.getElementalistConfig(),
      unlockWave: 50,
      displayName: 'Elementalist'
    },
    {
      id: 'diviner',
      config: Wizard.getDivinerConfig(),
      unlockWave: 75,
      displayName: 'Diviner'
    }
  ]

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.createWizardContent()
    
    // Listen for wave changes
    this.scene.events.on('waveChanged', (wave: number) => {
      this.updateWaveProgress(wave)
    })
  }

  private createWizardContent(): void {
    const canvasHeight = this.scene.scale.height
    
    // Position menu ABOVE the tabs - bottom of menu touches top of tabs
    const menuY = canvasHeight - this.TAB_HEIGHT - this.MENU_HEIGHT
    this.wizardContent = this.scene.add.container(0, menuY)
    this.wizardContent.setDepth(201) // Above tabs (which are at depth 200)
    
    // Create menu background
    const menuBackground = this.scene.add.rectangle(
      this.scene.scale.width / 2,
      this.MENU_HEIGHT / 2,
      this.scene.scale.width - 20,
      this.MENU_HEIGHT,
      0x34495e,
      0.95
    )
    menuBackground.setStrokeStyle(2, 0x7f8c8d)
    this.wizardContent.add(menuBackground)
    
    // Add title at the VERY TOP of the menu panel
    const title = this.scene.add.text(this.scene.scale.width / 2, 15, 'Select Wizard', {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    this.wizardContent.add(title)

    // Create scrollable container for wizard cards - positioned below title with proper spacing
    this.scrollContainer = this.scene.add.container(50, 55) // Left-aligned, closer to title
    this.wizardContent.add(this.scrollContainer)

    // Create wizard cards horizontally
    this.createWizardCards()
    
    // Initially hidden - will be shown when Wizards tab is selected
    this.wizardContent.setVisible(false)
  }

  private createWizardCards(): void {
    let totalWidth = 0
    
    this.wizardTypes.forEach((wizardType, index) => {
      const cardX = index * (this.CARD_WIDTH + this.CARD_SPACING)
      const card = this.createWizardCard(wizardType, cardX, 0)
      
      this.wizardCards.set(wizardType.id, card)
      this.scrollContainer.add(card.container)
      
      totalWidth = cardX + this.CARD_WIDTH
    })

    // Add scroll functionality if content overflows
    if (totalWidth > this.SCROLL_AREA_WIDTH) {
      this.addScrollFunctionality(totalWidth)
    }
  }

  private createWizardCard(wizardType: WizardTypeInfo, x: number, y: number): WizardCard {
    const isUnlocked = this.currentWave >= wizardType.unlockWave

    // Create card container
    const container = this.scene.add.container(x, y)
    container.setDepth(10) // Ensure cards are above other elements

    // Card background
    const background = this.scene.add.rectangle(0, 0, this.CARD_WIDTH, this.CARD_HEIGHT, 
      isUnlocked ? 0x2c3e50 : 0x444444, 0.9)
    background.setStrokeStyle(2, isUnlocked ? parseInt(this.getWizardColor(wizardType.id).replace('#', '0x')) : 0x666666)
    container.add(background)

    // Wizard sprite (circular representation for now)
    const spriteColor = isUnlocked ? parseInt(this.getWizardColor(wizardType.id).replace('#', '0x')) : 0x666666
    const sprite = this.scene.add.circle(0, -15, 15, spriteColor)
    sprite.setStrokeStyle(2, 0xffffff, isUnlocked ? 1 : 0.5)
    container.add(sprite)

    // Wizard name
    const nameText = this.scene.add.text(0, 8, wizardType.displayName, {
      fontSize: '9px',
      color: isUnlocked ? '#ffffff' : '#888888',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: this.CARD_WIDTH - 8 }
    }).setOrigin(0.5)
    container.add(nameText)

    // Cost/unlock text
    const costText = this.scene.add.text(0, 22, 
      isUnlocked ? `${wizardType.config.cost}g` : `Wave ${wizardType.unlockWave}`, {
      fontSize: '8px',
      color: isUnlocked ? '#ffd700' : '#888888',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    container.add(costText)

    // Lock icon for locked wizards
    let lockIcon: Phaser.GameObjects.Text | undefined
    if (!isUnlocked) {
      lockIcon = this.scene.add.text(25, -25, '🔒', {
        fontSize: '12px'
      }).setOrigin(0.5)
      container.add(lockIcon)
    }

    // Make card interactive if unlocked
    if (isUnlocked) {
      container.setSize(this.CARD_WIDTH, this.CARD_HEIGHT)
      container.setInteractive()
      
      container.on('pointerdown', (pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData) => {
        console.log('Wizard card clicked:', wizardType.id)
        event.stopPropagation() // Prevent click from reaching grid
        this.selectWizardType(wizardType.id)
      })

      container.on('pointerover', () => {
        background.setAlpha(1)
        background.setStrokeStyle(3, parseInt(this.getWizardColor(wizardType.id).replace('#', '0x')))
      })

      container.on('pointerout', () => {
        if (this.selectedWizardType !== wizardType.id) {
          background.setAlpha(0.9)
          background.setStrokeStyle(2, parseInt(this.getWizardColor(wizardType.id).replace('#', '0x')))
        }
      })
    }

    return {
      container,
      background,
      sprite,
      nameText,
      costText,
      lockIcon
    }
  }

  private addScrollFunctionality(totalWidth: number): void {
    const maxScroll = Math.max(0, totalWidth - this.SCROLL_AREA_WIDTH + this.CARD_WIDTH + 50) // Account for left margin
    let currentScroll = 0

    // Add functional scroll arrows
    if (maxScroll > 0) {
      this.addScrollIndicators(maxScroll, currentScroll)
    }

    // For now, just rely on arrow buttons for scrolling
    // Cards should be clickable without interference
  }

  private addScrollIndicators(maxScroll: number, currentScroll: number): void {
    const scrollStep = 120 // Scroll by width of 1-2 cards
    
    // Left scroll arrow - positioned in card area
    const leftArrow = this.scene.add.text(20, 65, '◀', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial',
      backgroundColor: '#444444',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setInteractive()
    
    leftArrow.on('pointerdown', (pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData) => {
      event.stopPropagation() // Prevent click from reaching grid
      const newScrollX = Math.max(0, this.scrollContainer.x - 50 + scrollStep)
      this.scrollContainer.x = Math.min(50, 50 + newScrollX)
    })
    
    leftArrow.on('pointerover', () => {
      leftArrow.setBackgroundColor('#666666')
    })
    
    leftArrow.on('pointerout', () => {
      leftArrow.setBackgroundColor('#444444')
    })
    
    this.wizardContent.add(leftArrow)

    // Right scroll arrow - positioned in card area
    const rightArrow = this.scene.add.text(460, 65, '▶', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial',
      backgroundColor: '#444444',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setInteractive()
    
    rightArrow.on('pointerdown', (pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData) => {
      event.stopPropagation() // Prevent click from reaching grid
      const newScrollX = Math.min(-maxScroll, this.scrollContainer.x - 50 - scrollStep)
      this.scrollContainer.x = 50 + newScrollX
    })
    
    rightArrow.on('pointerover', () => {
      rightArrow.setBackgroundColor('#666666')
    })
    
    rightArrow.on('pointerout', () => {
      rightArrow.setBackgroundColor('#444444')
    })
    
    this.wizardContent.add(rightArrow)
  }

  private getWizardColor(wizardId: string): string {
    const colors = {
      battleMage: '#8e44ad',
      alchemist: '#27ae60', 
      enchanter: '#9932CC',
      necromancer: '#2F4F4F',
      elementalist: '#FF4500',
      diviner: '#4169E1'
    }
    return colors[wizardId] || '#666666'
  }

  private selectWizardType(type: string): void {
    console.log('selectWizardType called:', type)
    this.selectedWizardType = type
    
    // Update all card appearances
    this.wizardCards.forEach((card, wizardId) => {
      const wizardType = this.wizardTypes.find(w => w.id === wizardId)
      const isUnlocked = this.currentWave >= wizardType!.unlockWave
      
      if (isUnlocked) {
        if (wizardId === type) {
          // Selected state
          card.background.setFillStyle(0xe74c3c, 1)
          card.background.setStrokeStyle(3, 0xffffff)
        } else {
          // Normal state
          card.background.setFillStyle(0x2c3e50, 0.9)
          card.background.setStrokeStyle(2, parseInt(this.getWizardColor(wizardId).replace('#', '0x')))
        }
      }
    })
    
    // Emit event for GameScene to handle
    this.scene.events.emit('wizardTypeSelected', type)
  }

  public updateWaveProgress(wave: number): void {
    this.currentWave = wave
    
    // Check for newly unlocked wizards
    this.wizardTypes.forEach(wizardType => {
      if (wave >= wizardType.unlockWave) {
        const card = this.wizardCards.get(wizardType.id)
        if (card && card.lockIcon) {
          // Update card to unlocked state
          card.background.setFillStyle(0x2c3e50, 0.9)
          card.background.setStrokeStyle(2, parseInt(this.getWizardColor(wizardType.id).replace('#', '0x')))
          
          const spriteColor = parseInt(this.getWizardColor(wizardType.id).replace('#', '0x'))
          card.sprite.setFillStyle(spriteColor)
          card.sprite.setStrokeStyle(2, 0xffffff, 1)
          
          card.nameText.setColor('#ffffff')
          card.costText.setText(`${wizardType.config.cost}g`)
          card.costText.setColor('#ffd700')
          
          // Remove lock icon
          if (card.lockIcon) {
            card.lockIcon.destroy()
            card.lockIcon = undefined
          }
          
          // Make interactive
          if (!card.container.input) {
            card.container.setSize(this.CARD_WIDTH, this.CARD_HEIGHT)
            card.container.setInteractive()
            
            card.container.on('pointerdown', (pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData) => {
              event.stopPropagation() // Prevent click from reaching grid
              this.selectWizardType(wizardType.id)
            })

            card.container.on('pointerover', () => {
              card.background.setAlpha(1)
              card.background.setStrokeStyle(3, parseInt(this.getWizardColor(wizardType.id).replace('#', '0x')))
            })

            card.container.on('pointerout', () => {
              if (this.selectedWizardType !== wizardType.id) {
                card.background.setAlpha(0.9)
                card.background.setStrokeStyle(2, parseInt(this.getWizardColor(wizardType.id).replace('#', '0x')))
              }
            })
            
            // Show unlock notification
            this.showUnlockNotification(wizardType.displayName)
          }
        }
      }
    })
  }

  private showUnlockNotification(wizardName: string): void {
    const notification = this.scene.add.text(240, 35, `${wizardName} Unlocked!`, {
      fontSize: '12px',
      color: '#00ff00',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5)
    
    this.wizardContent.add(notification)
    
    // Fade out notification after 3 seconds
    this.scene.tweens.add({
      targets: notification,
      alpha: 0,
      duration: 3000,
      onComplete: () => {
        notification.destroy()
      }
    })
  }

  public getSelectedWizardType(): string | null {
    return this.selectedWizardType
  }

  public getWizardConfig(type: string): any {
    switch(type) {
      case 'battleMage': return Wizard.getBattleMageConfig()
      case 'alchemist': return Wizard.getAlchemistConfig()
      case 'enchanter': return Wizard.getEnchanterConfig()
      case 'necromancer': return Wizard.getNecromancerConfig()
      case 'elementalist': return Wizard.getElementalistConfig()
      case 'diviner': return Wizard.getDivinerConfig()
      default: return null
    }
  }

  public isWizardUnlocked(type: string): boolean {
    const wizardType = this.wizardTypes.find(w => w.id === type)
    return wizardType ? this.currentWave >= wizardType.unlockWave : false
  }

  public clearSelection(): void {
    this.selectedWizardType = null
    
    // Reset all card colors to normal
    this.wizardCards.forEach((card, wizardId) => {
      const wizardType = this.wizardTypes.find(w => w.id === wizardId)
      const isUnlocked = this.currentWave >= wizardType!.unlockWave
      
      if (isUnlocked) {
        card.background.setFillStyle(0x2c3e50, 0.9)
        card.background.setStrokeStyle(2, parseInt(this.getWizardColor(wizardId).replace('#', '0x')))
      }
    })
  }

  public showMenu(): void {
    this.wizardContent.setVisible(true)
  }

  public hideMenu(): void {
    this.wizardContent.setVisible(false)
  }

  public getWizardContent(): Phaser.GameObjects.Container {
    return this.wizardContent
  }

  public destroy(): void {
    this.wizardContent.destroy()
    this.wizardCards.clear()
  }
}