# Forgotten Runes Tower Defense - Game Plan

## 🎮 Current Implementation Status
**Development Phase:** Phase 1 Complete - Moving to Phase 2  
**Playable Status:** ✅ Fully functional prototype  
**Test URL:** http://localhost:3000 (when dev server running)

**What Works Now:**
- Complete tower defense gameplay loop
- 2 wizard types with balanced costs and abilities
- 2 enemy types with wave-based scaling
- Intuitive UI with tabbed interface
- Mobile-responsive design
- Item system foundation ready for expansion

**Next Session Goals:**
- Add more wizard types with unique mechanics
- Implement wizard upgrade system
- Expand item drops and effects
- Add meta-progression system

---

## Game Overview
An endless tower defense game featuring actual Forgotten Runes Wizards defending against waves of enemies from the Runiverse. Players collect items, unlock new wizards, and progress through infinite waves with scaling difficulty.

## Core Game Identity
**Theme**: Forgotten Runes Wizard's Cult universe with authentic pixel art style
**Genre**: Endless Tower Defense with RPG progression elements
**Platform**: Web-based with full mobile/desktop/retina compatibility via Farcade
**Art Style**: Pixel art matching Forgotten Runes NFT aesthetic
**Audio**: Mystical, magical atmosphere

## Three Pillar System

### Pillar 1: Wizards (Towers)
**Core Types (Launch with 6 types):**

1. **Battle Mage** (Starter - Wave 1)
   - Balanced damage and speed, reliable foundation
   - Based on actual Forgotten Runes Battle Mage characters
   - Medium cost, medium range, consistent damage

2. **Alchemist** (Starter - Wave 1) 
   - Poison/damage over time specialist
   - Throws poison vials that create toxic clouds
   - Low initial damage, high sustained damage

3. **Enchanter** (Unlock Wave 10)
   - Buff/support magic, enhances nearby wizards
   - Provides damage/speed boosts to adjacent towers
   - Essential for late-game wizard synergy

4. **Necromancer** (Unlock Wave 25)
   - Summons fallen enemies as allies
   - Creates skeleton minions that block enemy paths
   - Unique mechanic: gets stronger with more enemy deaths

5. **Elementalist** (Unlock Wave 50)
   - Fire/ice/lightning rotation attacks
   - Area damage with elemental effects (burn, freeze, chain)
   - High cost, high impact wizard

6. **Diviner** (Unlock Wave 75)
   - Long-range piercing attacks, hits multiple enemies
   - Can see through stealth, bonus damage to bosses
   - Premium end-game wizard

**Wizard Mechanics:**
- 3 upgrade levels per wizard (+50% damage, +25% range per level)
- Visual changes with upgrades (glowing staffs, aura effects)
- Each wizard uses actual Forgotten Runes character names and backstories
- Range indicators when placing/upgrading
- Click existing wizard to upgrade (costs 50% of base price per level)

### Pillar 2: Enemies (From the Runiverse)
**Enemy Types:**

1. **Goblin Raiders** (Waves 1+)
   - Fast, low health swarm units
   - Based on Forgotten Runes goblin lore

2. **Shadow Demons** (Waves 5+)
   - Flying units that bypass some ground-based effects
   - Medium health, immune to certain wizard types

3. **Corrupted Knights** (Waves 10+)
   - Slow, heavily armored tanks
   - High health, resistant to magic damage

4. **Flame Sprites** (Waves 15+)
   - Fast, fire-resistant enemies
   - Immune to fire damage, weak to ice effects

5. **Lich Lords** (Boss every 10 waves)
   - Massive health, summons minions
   - Special abilities: shields, healing, teleportation

**Scaling System:**
- Health: base_health × (1.15 ^ wave_number)
- Speed: base_speed × min(2.0, 1.05 ^ wave_number) 
- Count: base_count + (wave_number ÷ 5)
- New enemy types introduced every 10-15 waves

### Pillar 3: Items (Loot System)
**Drop System:**
- 30% chance for item drop from regular enemies
- 100% drop chance from boss enemies
- Click dropped items to collect (auto-pickup after 10 seconds)

**Item Categories:**

**Passive Enhancement Items:**
- Spell Power Crystal: +25% damage to all wizards
- Mana Efficiency Gem: -20% wizard placement costs
- Range Amplifier: +30% range to all wizards
- Arcane Focus: +15% critical hit chance

**Active Use Items (Click to use):**
- Meteor Scroll: Target area for massive damage
- Time Crystal: Freeze all enemies for 8 seconds
- Lightning Storm: Chain lightning across all enemies
- Healing Potion: Restore wizard health/repair damage

**Wizard-Specific Items:**
- Alchemist's Tome: Poison effects spread to nearby enemies
- Battle Focus: Battle Mages attack 50% faster
- Necromancer's Staff: Summon permanent skeleton ally
- Elemental Orb: Elementalists cycle through all elements

**Item Tiers:**
- **Common** (White): Waves 1-25, +10-25% bonuses
- **Rare** (Blue): Waves 26-50, +25-50% bonuses  
- **Epic** (Purple): Waves 51+, +50-100% bonuses + special effects

## Endless Progression

### Wave Structure
**Casual Range (Waves 1-25):**
- Learn mechanics and build foundation
- All basic enemy types introduced
- Economic balance allows experimentation

**Intermediate Range (Waves 26-50):**
- Strategy optimization becomes crucial
- Item combinations matter significantly
- Multiple viable approaches

**Hardcore Range (Waves 51+):**
- Perfect execution required
- Advanced item synergies essential
- Leaderboard competition territory

### Meta-Progression System
**Arcane Points**: Earned based on wave reached
- Waves 1-25: 1 point per wave
- Waves 26-50: 2 points per wave
- Waves 51+: 3 points per wave

**Skill Tree (Simple but Impactful):**

**ECONOMIC BRANCH:**
- Starting Wealth: Begin with +50 gold (3 levels)
- Treasure Hunter: +25% item drop rate (3 levels)
- Efficiency Master: All wizards cost -15% (3 levels)

**POWER BRANCH:**
- Spell Mastery: All wizards +20% damage (5 levels)
- Arcane Knowledge: +1 max item slots (2 levels)
- Critical Focus: +10% critical hit chance (3 levels)

**SURVIVAL BRANCH:**
- Extra Lives: Start with +1 life (3 levels)
- Wizard Resilience: Wizards take -1 damage when attacked (2 levels)
- Emergency Reserves: +100 gold when life lost (3 levels)

### Death & Restart
- **Full Reset**: Death resets to wave 1, keeps meta-progression
- **Score Tracking**: High score display with wave reached + points earned
- **Statistics**: Track games played, total waves survived, favorite wizard types
- **Motivation**: Each death teaches strategy, meta-progression provides advancement

## Technical Implementation Plan

### ✅ Phase 1: Foundation - COMPLETED
**Core Systems:**
- ✅ Grid-based wizard placement (8×12 grid)
- ✅ Predefined enemy path through the battlefield  
- ✅ Basic wizard shooting mechanics (nearest enemy targeting)
- ✅ Wave spawning system with enemy health scaling
- ✅ Lives system (start with 3 lives, lose 1 per enemy through)
- ✅ Polished UI: gold counter, wave counter, lives display with proper spacing
- ✅ Tab-based interface for wizards and items with smooth animations
- ✅ Responsive mobile-friendly layout

**Minimum Viable Features:**
- ✅ 2 wizard types functional (Battle Mage + Alchemist) with selection UI
- ✅ 2 enemy types (Goblins + Shadow Demons) with proper scaling
- ✅ Item system foundation with inventory slots and visual feedback
- ✅ Wave progression with scaling difficulty and completion bonuses
- ✅ Game over screen with restart functionality
- ✅ Clean, organized code architecture with proper separation of concerns

**Current Status:** Fully playable prototype with polished UI/UX

### 🔄 Phase 2: Content & Progression - NEXT PRIORITY
**Wizard Expansion:**
- 🔲 Add remaining 4 wizard types (Enchanter, Necromancer, Elementalist, Diviner)
- 🔲 3-level upgrade system for each wizard with visual changes
- 🔲 Wizard unlocking at milestone waves (10, 25, 50, 75)
- 🔲 Click existing wizards to upgrade functionality

**Item System Enhancement:**
- 🔲 Implement item drops from enemies (30% regular, 100% boss)
- 🔲 8-10 different item types with passive/active effects
- 🔲 Item rarity system (Common, Rare, Epic)
- 🔲 Click-to-use active items with targeting

**Meta-Progression:**
- 🔲 Arcane Points earning based on wave reached
- 🔲 Skill tree with 3 branches (Economic, Power, Survival)
- 🔲 Persistent save system for meta-progression
- 🔲 Statistics tracking (games played, total waves, etc.)

### Phase 3: Polish & Mobile (Day 3 - 8 hours)
**Visual Polish:**
- Particle effects for spells and explosions
- Damage numbers and visual feedback
- Screen shake and impact effects
- Smooth animations for wizard placement/upgrades
- Background art and environmental details

**Mobile Optimization:**
- Touch-friendly UI design from day one
- Responsive layout for all screen sizes
- Optimized controls for placement and targeting
- Performance optimization for mobile devices

**Audio Integration:**
- Mystical background music loop
- Spell casting sound effects for each wizard type
- Enemy death and item pickup sounds
- UI interaction feedback sounds

## Farcade Integration

**Platform Features:**
- Web-based deployment through Farcade
- Mobile-responsive design
- Social features (leaderboards, score sharing)
- Performance optimization for web delivery

## Art Asset Requirements

### Wizards (Pixel Art Style)
- 6 unique wizard sprites based on actual Forgotten Runes characters
- 3 visual upgrade states per wizard (staff glows, robe colors, auras)
- Casting animations and idle animations
- Projectile sprites for each wizard type

### Enemies (Runiverse Lore)
- 5+ enemy types with walk animations
- Death animations and particle effects  
- Boss variants with special visual effects
- Flying enemy sprites with wing animations

### Items
- 10+ item sprites with mystical/magical themes
- Sparkle/glow effects for item drops
- UI icons for inventory display
- Rarity indicators (color borders/glows)

### Environment
- Battlefield background matching Forgotten Runes aesthetic
- Path tiles and placement grid
- UI panels and buttons in pixel art style
- Particle effects for spells and impacts

## Success Metrics

### Launch Targets
**Playability**: Core tower defense loop functional and engaging
**Progression**: Meta-progression provides meaningful advancement  
**Polish**: Smooth performance across all target devices
**Theme**: Authentic Forgotten Runes aesthetic and lore integration

### Engagement Goals
**Session Length**: 10-20 minutes average (25-50 waves)
**Retention**: Meta-progression encourages return sessions
**Replayability**: Multiple strategies and item combinations
**Community**: Leaderboard competition and score sharing

## Risk Mitigation

**Scope Management:**
- Start with 2 wizards, expand to 6
- Begin with 3 items, grow to 10+
- Implement core loop before polish

**Technical Risks:**
- Mobile performance testing throughout development
- Farcade integration tested early
- Asset loading optimization for web deployment

**Art Assets:**
- Backup simple geometric shapes if sprite integration fails
- Prioritize gameplay over perfect art initially
- User-provided sprites integrated as available

## Future Expansion Possibilities

**Additional Content:**
- More wizard types from Forgotten Runes universe
- Special event waves with unique rewards
- Seasonal content and limited-time modifiers
- Advanced item combination system

**Social Features:**
- Guild/clan competition
- Weekly challenges with special rewards
- Player-created custom waves
- Tournament modes

This game plan balances ambitious scope with realistic implementation timeline, focusing on the addictive core loop of tower defense + loot collection while staying true to the Forgotten Runes universe and aesthetic.