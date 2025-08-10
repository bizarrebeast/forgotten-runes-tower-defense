export class WizardManager {
  private scene: Phaser.Scene
  private wizardContent: Phaser.GameObjects.Container
  private battleMageBtn: Phaser.GameObjects.Text
  private alchemistBtn: Phaser.GameObjects.Text
  private selectedWizardType: string | null = null

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.createWizardContent()
  }

  private createWizardContent(): void {
    // Create wizard selection content container
    this.wizardContent = this.scene.add.container(0, -40)
    
    // Add title with proper padding from top
    const title = this.scene.add.text(240, -35, 'Select Wizard', {
      fontSize: '14px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    this.wizardContent.add(title)

    // Battle Mage button
    this.battleMageBtn = this.scene.add.text(120, 0, 'Battle Mage\n50 Gold', {
      fontSize: '13px',
      color: '#ffffff',
      backgroundColor: '#8e44ad',
      padding: { x: 16, y: 10 },
      fontFamily: 'Arial',
      align: 'center',
      fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive()

    this.battleMageBtn.on('pointerdown', () => {
      this.selectWizardType('battleMage')
    })

    // Alchemist button  
    this.alchemistBtn = this.scene.add.text(360, 0, 'Alchemist\n75 Gold', {
      fontSize: '13px',
      color: '#ffffff',
      backgroundColor: '#27ae60',
      padding: { x: 16, y: 10 },
      fontFamily: 'Arial',
      align: 'center',
      fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive()

    this.alchemistBtn.on('pointerdown', () => {
      this.selectWizardType('alchemist')
    })
    
    this.wizardContent.add([this.battleMageBtn, this.alchemistBtn])
    
    // Initially hidden - will be controlled by TabManager
    this.wizardContent.setVisible(false)
  }

  private selectWizardType(type: string): void {
    this.selectedWizardType = type
    
    // Update button appearance for selected state
    if (type === 'battleMage') {
      this.battleMageBtn.setBackgroundColor('#e74c3c') // Bright red when selected
      this.alchemistBtn.setBackgroundColor('#27ae60')   // Normal green
    } else if (type === 'alchemist') {
      this.battleMageBtn.setBackgroundColor('#8e44ad')   // Normal purple
      this.alchemistBtn.setBackgroundColor('#e74c3c')    // Bright red when selected  
    }
    
    // Emit event for GameScene to handle
    this.scene.events.emit('wizardTypeSelected', type)
  }

  public getSelectedWizardType(): string | null {
    return this.selectedWizardType
  }

  public clearSelection(): void {
    this.selectedWizardType = null
    this.battleMageBtn.setBackgroundColor('#8e44ad')
    this.alchemistBtn.setBackgroundColor('#27ae60')
  }

  public getWizardContent(): Phaser.GameObjects.Container {
    return this.wizardContent
  }

  public destroy(): void {
    this.wizardContent.destroy()
  }
}