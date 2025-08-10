export interface TabConfig {
  id: string
  title: string
  icon?: string
  color: number
  content: Phaser.GameObjects.Container
}

export class TabManager {
  private scene: Phaser.Scene
  private tabs: Map<string, TabConfig> = new Map()
  private activeTabId: string | null = null
  private tabContainer: Phaser.GameObjects.Container
  private contentContainer: Phaser.GameObjects.Container
  private tabButtons: Map<string, Phaser.GameObjects.Container> = new Map()
  private isExpanded: boolean = false

  // Layout constants
  private readonly TAB_HEIGHT = 30
  private readonly CONTENT_HEIGHT = 100
  private readonly TAB_WIDTH = 120
  private readonly ANIMATION_DURATION = 200

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.createTabSystem()
  }

  private createTabSystem(): void {
    const canvasHeight = this.scene.scale.height
    
    // Create main containers
    this.tabContainer = this.scene.add.container(0, canvasHeight - this.TAB_HEIGHT)
    this.tabContainer.setDepth(200)
    
    // Content container starts BELOW screen (hidden)
    this.contentContainer = this.scene.add.container(0, canvasHeight + this.CONTENT_HEIGHT)
    this.contentContainer.setDepth(199)
    
    // Create tab bar background
    const tabBarBg = this.scene.add.rectangle(
      this.scene.scale.width / 2, 
      this.TAB_HEIGHT / 2, 
      this.scene.scale.width, 
      this.TAB_HEIGHT, 
      0x2c3e50, 
      0.95
    )
    tabBarBg.setStrokeStyle(2, 0x34495e)
    this.tabContainer.add(tabBarBg)
  }

  public addTab(config: TabConfig): void {
    this.tabs.set(config.id, config)
    this.createTabButton(config)
    
    // Hide the content initially
    config.content.setVisible(false)
    
    // If this is the first tab, make it active but don't expand
    if (this.tabs.size === 1) {
      this.setActiveTab(config.id)
    }
  }

  private createTabButton(config: TabConfig): void {
    const tabIndex = this.tabs.size - 1
    const tabX = 60 + (tabIndex * (this.TAB_WIDTH + 10))
    
    // Create tab button container
    const tabBtn = this.scene.add.container(tabX, this.TAB_HEIGHT / 2)
    
    // Tab background
    const tabBg = this.scene.add.rectangle(0, 0, this.TAB_WIDTH, this.TAB_HEIGHT - 4, config.color, 0.8)
    tabBg.setStrokeStyle(2, 0x7f8c8d, 0.6)
    
    // Tab text
    const tabText = this.scene.add.text(0, 0, config.title, {
      fontSize: '14px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    tabBtn.add([tabBg, tabText])
    this.tabContainer.add(tabBtn)
    this.tabButtons.set(config.id, tabBtn)
    
    // Make interactive
    tabBtn.setSize(this.TAB_WIDTH, this.TAB_HEIGHT)
    tabBtn.setInteractive()
    
    tabBtn.on('pointerdown', () => {
      if (this.activeTabId === config.id && this.isExpanded) {
        // Clicking active tab collapses it
        this.collapse()
      } else {
        // Switch to this tab and expand
        this.setActiveTab(config.id)
        this.expand()
      }
    })
    
    // Hover effects
    tabBtn.on('pointerover', () => {
      tabBg.setAlpha(1.0)
    })
    
    tabBtn.on('pointerout', () => {
      if (this.activeTabId !== config.id) {
        tabBg.setAlpha(0.8)
      }
    })
  }

  private setActiveTab(tabId: string): void {
    if (!this.tabs.has(tabId)) return
    
    // Update visual states
    this.tabButtons.forEach((button, id) => {
      const bg = button.list[0] as Phaser.GameObjects.Rectangle
      if (id === tabId) {
        bg.setAlpha(1.0)
        bg.setStrokeStyle(2, 0xffffff, 0.8)
      } else {
        bg.setAlpha(0.8)
        bg.setStrokeStyle(2, 0x7f8c8d, 0.6)
      }
    })
    
    // Update active tab ID
    this.activeTabId = tabId
    
    // Only update content if expanded
    if (this.isExpanded) {
      this.updateContentDisplay()
    }
  }

  private updateContentDisplay(): void {
    if (!this.activeTabId || !this.tabs.has(this.activeTabId)) return
    
    const activeTab = this.tabs.get(this.activeTabId)!
    
    // Clear content container and add active content
    this.contentContainer.removeAll()
    
    // Create content background - positioned to connect with tabs
    const contentBg = this.scene.add.rectangle(
      this.scene.scale.width / 2, 
      -this.CONTENT_HEIGHT / 2, 
      this.scene.scale.width - 20, 
      this.CONTENT_HEIGHT, 
      0x34495e, 
      0.95
    )
    contentBg.setStrokeStyle(2, 0x7f8c8d)
    this.contentContainer.add(contentBg)
    
    // Add the tab's content
    activeTab.content.setVisible(true)
    this.contentContainer.add(activeTab.content)
  }

  public expand(): void {
    if (this.isExpanded) return
    
    this.isExpanded = true
    
    // Update content display before animating
    this.updateContentDisplay()
    
    // Position content to connect directly to tabs (no gap)
    const targetY = this.scene.scale.height - this.TAB_HEIGHT - this.CONTENT_HEIGHT
    
    this.scene.tweens.add({
      targets: this.contentContainer,
      y: targetY,
      duration: this.ANIMATION_DURATION,
      ease: 'Power2'
    })
  }

  public collapse(): void {
    if (!this.isExpanded) return
    
    this.isExpanded = false
    const targetY = this.scene.scale.height + this.CONTENT_HEIGHT
    
    this.scene.tweens.add({
      targets: this.contentContainer,
      y: targetY,
      duration: this.ANIMATION_DURATION,
      ease: 'Power2',
      onComplete: () => {
        // Hide content after animation completes
        this.contentContainer.removeAll()
      }
    })
  }

  public isTabExpanded(): boolean {
    return this.isExpanded
  }

  public getActiveTabId(): string | null {
    return this.activeTabId
  }

  public removeTab(tabId: string): void {
    if (!this.tabs.has(tabId)) return
    
    // Remove from maps
    this.tabs.delete(tabId)
    const button = this.tabButtons.get(tabId)
    if (button) {
      button.destroy()
      this.tabButtons.delete(tabId)
    }
    
    // If this was the active tab, switch to another
    if (this.activeTabId === tabId && this.tabs.size > 0) {
      const firstTabId = this.tabs.keys().next().value
      this.setActiveTab(firstTabId)
    } else if (this.tabs.size === 0) {
      this.activeTabId = null
      this.collapse()
    }
  }

  public destroy(): void {
    this.tabContainer.destroy()
    this.contentContainer.destroy()
    this.tabs.clear()
    this.tabButtons.clear()
  }
}