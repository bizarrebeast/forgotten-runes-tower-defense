# Next Session Prompt for Forgotten Runes Tower Defense

## Current Status
✅ **Phase 1 Complete**: Core gameplay with 2 wizard types
✅ **Phase 2 Complete**: Wizard Expansion with 6 total wizard types

### Completed Features:
- Grid-based tower placement system
- Wave spawning with 2 enemy types (Goblin, Shadow Demon)
- Currency and lives system
- Basic projectile combat
- Enemy pathfinding along defined routes
- Item drop and inventory system
- Tab-based UI for Wizards and Items
- **6 wizard types with wave-based unlocking:**
  - Battle Mage (Wave 1)
  - Alchemist (Wave 1)
  - Enchanter (Wave 10) - Buffs nearby wizards
  - Necromancer (Wave 25) - Summons skeleton warriors
  - Elementalist (Wave 50) - Cycles damage types
  - Diviner (Wave 75) - Sees invisible, bonus vs bosses
- Horizontal scrollable wizard selection menu
- Persistent wizard selection
- Fixed event propagation for proper UI interaction
- Unlock notifications for new wizards

## Next Goal: Phase 3 - Enemy Variety & Boss Battles

### New Enemies to Add:
1. **Orc Warrior** (Starts Wave 5)
   - High HP, medium speed
   - Takes reduced damage from physical attacks
   
2. **Dark Elf Assassin** (Starts Wave 15)
   - Low HP, very fast
   - Periodically goes invisible for 2 seconds
   
3. **Stone Golem** (Starts Wave 30)
   - Very high HP, very slow
   - Immune to slow effects
   
4. **Wraith** (Starts Wave 40)
   - Medium HP, floats over path
   - Takes reduced damage from non-magical attacks

### Boss Enemies (Every 10 waves):
1. **Wave 10: Goblin King**
   - Spawns goblin minions when damaged
   
2. **Wave 20: Shadow Lord**
   - Creates shadow clones at 50% health
   
3. **Wave 30: Ancient Golem**
   - Gains armor stacks, requires multiple hits to damage
   
4. **Wave 40: Lich King**
   - Resurrects fallen enemies as skeletons

### Implementation Steps:
1. Create new enemy configurations in `GameSettings.ts`
2. Add enemy type methods in `Enemy.ts`
3. Implement special enemy abilities (invisibility, armor, etc.)
4. Create boss spawn system in `GameScene.ts`
5. Add visual effects for special abilities
6. Balance health/speed/rewards for each enemy type

## Project Structure
```
src/
├── config/
│   └── GameSettings.ts      # Game configuration and balance
├── objects/
│   ├── Wizard.ts            # Wizard tower class (6 types)
│   ├── Enemy.ts             # Enemy class with types
│   └── Item.ts              # Item drops and effects
├── scenes/
│   ├── GameScene.ts         # Main game scene
│   └── MainMenu.ts          # Menu scene
├── systems/
│   ├── GridSystem.ts        # Grid placement logic
│   ├── GameState.ts         # Game state management
│   ├── WizardManager.ts     # Wizard selection UI (horizontal cards)
│   ├── ItemManager.ts       # Inventory system
│   └── TabManager.ts        # Tab UI system
└── main.ts                  # Phaser game initialization
```

## Tech Stack
- **Phaser 3.86.0** - Game framework
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server

## Recent Improvements (Phase 2)
- Added 4 new wizard types with unique abilities
- Implemented wave-based unlock system
- Redesigned wizard menu with horizontal card layout
- Fixed event propagation for proper card selection
- Added persistent wizard selection
- Positioned wizard menu above tabs
- Added scroll arrows for wizard card navigation
- Show unlock notifications for new wizards

## Development Commands
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

## GitHub Repository
https://github.com/bizarrebeast/forgotten-runes-tower-defense

## Current Game Balance
- 6 wizard types with progressive costs/power
- Wave difficulty scales appropriately
- Economy balanced for wizard progression
- UI/UX polished with smooth interactions
- Performance optimized for many units