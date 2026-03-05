# Shopsy UI Port Tracker (Level.scene)

Source: `/Users/venkat/Desktop/Projects/moneyplant/shopsy/internal-repos/shopsy-nazaria-game/src/scenes/Level.scene` + `Level.ts`  
Target: `/Users/venkat/Desktop/Projects/moneyplant/shopsy/internal-repos/shopsy-city-builder-game-editor/src/scenes/Level.scene` + `Level.ts`

## Checklist
- [x] 1. `exit_btn` + `exit_back_button`
- [x] 2. `game_start_panel_container`
- [x] 3. `pause_panel_container`
- [x] 4. `game_over_panel_container`
- [x] 5. `game_over_win_panel_container`
- [x] 6. `game_over_lose_panel_container`
- [x] 7. `share_panel_container`
- [x] 8. `error_panel_container`
- [x] 9. `top_ui_container`
- [x] 10. `game_elements_container`

## Execution Notes
- For each checklist item:
  - Port root game object from Nazaria `Level.scene` into City Builder `Level.scene`.
  - Preserve object properties and nested children.
  - Wire behavior in City Builder `Level.ts` to use imported object names and lifecycle panels.
- Behavior wiring complete for template-style panel routing:
  - `START_PANEL` -> `game_start_panel_container`
  - `PAUSE_PANEL` -> `pause_panel_container`
  - `GAME_OVER_WIN_PANEL` -> `game_over_panel_container + game_over_win_panel_container`
  - `GAME_OVER_LOSE_PANEL` -> `game_over_panel_container + game_over_lose_panel_container`
  - `SHARE_PANEL` -> `share_panel_container`
  - `ERROR_PANEL` -> `error_panel_container`
  - `GAMEPLAY_PANEL` -> `top_ui_container + game_elements_container` (plus existing City Builder HUD)
