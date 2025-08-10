export class GameState {
  public gold: number
  public lives: number
  public wave: number
  public waveInProgress: boolean
  public gameOver: boolean
  
  private goldChangeCallbacks: ((gold: number) => void)[] = []
  private livesChangeCallbacks: ((lives: number) => void)[] = []
  private waveChangeCallbacks: ((wave: number) => void)[] = []

  constructor(startingGold: number, startingLives: number) {
    this.gold = startingGold
    this.lives = startingLives
    this.wave = 1
    this.waveInProgress = false
    this.gameOver = false
  }

  public addGold(amount: number): void {
    this.gold += amount
    this.notifyGoldChange()
  }

  public spendGold(amount: number): boolean {
    if (this.gold >= amount) {
      this.gold -= amount
      this.notifyGoldChange()
      return true
    }
    return false
  }

  public loseLife(): void {
    this.lives--
    this.notifyLivesChange()
    if (this.lives <= 0) {
      this.gameOver = true
    }
  }

  public nextWave(): void {
    this.wave++
    this.notifyWaveChange()
  }

  public setWaveInProgress(inProgress: boolean): void {
    this.waveInProgress = inProgress
  }

  // Callback registration
  public onGoldChange(callback: (gold: number) => void): void {
    this.goldChangeCallbacks.push(callback)
  }

  public onLivesChange(callback: (lives: number) => void): void {
    this.livesChangeCallbacks.push(callback)
  }

  public onWaveChange(callback: (wave: number) => void): void {
    this.waveChangeCallbacks.push(callback)
  }

  // Notify callbacks
  private notifyGoldChange(): void {
    this.goldChangeCallbacks.forEach(callback => callback(this.gold))
  }

  private notifyLivesChange(): void {
    this.livesChangeCallbacks.forEach(callback => callback(this.lives))
  }

  private notifyWaveChange(): void {
    this.waveChangeCallbacks.forEach(callback => callback(this.wave))
  }
}