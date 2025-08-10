import GameSettings from "../config/GameSettings"

export interface GridPosition {
  col: number
  row: number
  x: number
  y: number
}

export class GridSystem {
  private scene: Phaser.Scene
  private grid: boolean[][] // true = occupied, false = available
  private pathTiles: Set<string> // "col,row" format for path tiles

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.grid = this.createEmptyGrid()
    this.pathTiles = new Set()
    this.createPath()
  }

  private createEmptyGrid(): boolean[][] {
    const grid: boolean[][] = []
    for (let row = 0; row < GameSettings.grid.rows; row++) {
      grid[row] = new Array(GameSettings.grid.cols).fill(false)
    }
    return grid
  }

  private createPath(): void {
    // Create a longer snake-like path for 8x12 grid
    const pathPositions = [
      // Start from top left
      { col: 0, row: 1 }, // entrance
      { col: 1, row: 1 },
      { col: 2, row: 1 },
      { col: 3, row: 1 },
      
      // Turn down
      { col: 3, row: 2 },
      { col: 3, row: 3 },
      { col: 3, row: 4 },
      
      // Turn right
      { col: 4, row: 4 },
      { col: 5, row: 4 },
      { col: 6, row: 4 },
      { col: 7, row: 4 },
      
      // Turn down
      { col: 7, row: 5 },
      { col: 7, row: 6 },
      { col: 7, row: 7 },
      
      // Turn left
      { col: 6, row: 7 },
      { col: 5, row: 7 },
      { col: 4, row: 7 },
      { col: 3, row: 7 },
      { col: 2, row: 7 },
      { col: 1, row: 7 },
      
      // Turn down to exit
      { col: 1, row: 8 },
      { col: 1, row: 9 },
      { col: 1, row: 10 },
      { col: 1, row: 11 }, // exit point
    ]

    pathPositions.forEach(pos => {
      this.pathTiles.add(`${pos.col},${pos.row}`)
      this.grid[pos.row][pos.col] = true // mark as occupied
    })
  }

  public getPath(): GridPosition[] {
    const path: GridPosition[] = []
    
    // Convert path tiles to ordered positions (8x12 grid)
    const orderedPath = [
      { col: 0, row: 1 }, { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 3, row: 1 },
      { col: 3, row: 2 }, { col: 3, row: 3 }, { col: 3, row: 4 },
      { col: 4, row: 4 }, { col: 5, row: 4 }, { col: 6, row: 4 }, { col: 7, row: 4 },
      { col: 7, row: 5 }, { col: 7, row: 6 }, { col: 7, row: 7 },
      { col: 6, row: 7 }, { col: 5, row: 7 }, { col: 4, row: 7 }, { col: 3, row: 7 }, { col: 2, row: 7 }, { col: 1, row: 7 },
      { col: 1, row: 8 }, { col: 1, row: 9 }, { col: 1, row: 10 }, { col: 1, row: 11 }
    ]

    orderedPath.forEach(pos => {
      const worldPos = this.gridToWorld(pos.col, pos.row)
      path.push({
        col: pos.col,
        row: pos.row,
        x: worldPos.x,
        y: worldPos.y
      })
    })

    return path
  }

  public gridToWorld(col: number, row: number): { x: number, y: number } {
    return {
      x: GameSettings.grid.offsetX + (col * GameSettings.grid.tileSize) + (GameSettings.grid.tileSize / 2),
      y: GameSettings.grid.offsetY + (row * GameSettings.grid.tileSize) + (GameSettings.grid.tileSize / 2)
    }
  }

  public worldToGrid(x: number, y: number): { col: number, row: number } {
    const col = Math.floor((x - GameSettings.grid.offsetX) / GameSettings.grid.tileSize)
    const row = Math.floor((y - GameSettings.grid.offsetY) / GameSettings.grid.tileSize)
    return { col, row }
  }

  public canPlaceWizard(col: number, row: number): boolean {
    if (col < 0 || col >= GameSettings.grid.cols || row < 0 || row >= GameSettings.grid.rows) {
      return false
    }
    return !this.grid[row][col] // can place if not occupied
  }

  public placeWizard(col: number, row: number): boolean {
    if (this.canPlaceWizard(col, row)) {
      this.grid[row][col] = true
      return true
    }
    return false
  }

  public isPath(col: number, row: number): boolean {
    return this.pathTiles.has(`${col},${row}`)
  }

  public reset(): void {
    this.grid = this.createEmptyGrid()
    this.pathTiles = new Set()
    this.createPath()
  }

  public drawGrid(graphics: Phaser.GameObjects.Graphics): void {
    graphics.clear()
    
    for (let row = 0; row < GameSettings.grid.rows; row++) {
      for (let col = 0; col < GameSettings.grid.cols; col++) {
        const worldPos = this.gridToWorld(col, row)
        const x = worldPos.x - GameSettings.grid.tileSize / 2
        const y = worldPos.y - GameSettings.grid.tileSize / 2
        
        if (this.isPath(col, row)) {
          // Draw path tiles with better styling
          graphics.fillStyle(0x8B4513, 0.8)
          graphics.fillRect(x + 2, y + 2, GameSettings.grid.tileSize - 4, GameSettings.grid.tileSize - 4)
          graphics.lineStyle(2, 0xA0522D, 0.9)
          graphics.strokeRect(x + 2, y + 2, GameSettings.grid.tileSize - 4, GameSettings.grid.tileSize - 4)
        } else if (this.canPlaceWizard(col, row)) {
          // Draw available tiles with subtle grid
          graphics.lineStyle(1, 0x34495e, 0.4)
          graphics.strokeRect(x, y, GameSettings.grid.tileSize, GameSettings.grid.tileSize)
        }
      }
    }
  }
}