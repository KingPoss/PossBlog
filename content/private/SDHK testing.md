- [x] Hotstring Basics
    
    1. [x] Create a simple hotstring (]ty → Thank you!) — verify it fires and replaces cleanly
    2. [x] Create one with special keys (]sig → Best,[ENTER]IT Desk) — verify line break works
    3. [x] Create one with [CLIPBOARD] — copy some text first, trigger it, verify clipboard content appears
    4. [x] Create one with [CTRL+A][CTRL+C][DELAY:300][CTRL+V] — verify the delay prevents clipboard race
    5. [x] Test case sensitivity — create ]Hi and ]hi as separate triggers, verify only the correct case fires
    6. [x] Test with Caps Lock on and off for both
    7. [x] Type a trigger inside a longer word — make sure it still fires (buffer is suffix-based)
    8. [x] Type a trigger very fast — verify no dropped characters in the replacement
    9. [x] Type a trigger very slowly — verify it still matches
        
- [x] Hotstring Edge Cases  
    10. [x] Create a trigger that starts with a symbol (!, ], ;) — verify the symbol is consumed  
    11. [x] Try to add a 1-character trigger — verify the warning appears only on Add click  
    12. [x] Try to add a duplicate trigger — verify real-time conflict warning  
    13. [x] Try to add ]tye when ]ty exists — verify prefix conflict warning  
    14. [x] Try to add ]ty when ]tye exists — verify shadow conflict warning  
    15. [x] Delete the conflicting entry while warning is showing — verify warning clears  
    16. [x] Edit an existing hotstring's trigger and replacement — verify save works  
    17. [x] Edit a trigger to conflict with another — verify conflict detection works during edit
    
- [x] Hotkey Basics  
    18. [x] Record Ctrl+Shift+1 → Hello world — verify it fires on release  
    19. [x] Record a hotkey with [CTRL+C][DELAY:300][CTRL+V] — verify clipboard delay works  
    20. [x] Record a hotkey using symbol keys (Ctrl+Shift+Minus) — verify it matches  
    21. [x] Test that the hotkey doesn't interfere with normal Ctrl+C, Ctrl+V usage
    
- [x] Toggle/State Sync  
    22. [x] Click the ● Listening button — verify it switches to ● Inactive (red) and triggers stop firing  
    23. [x] Click it again — verify it goes back to green and triggers work  
    24. [x] Right-click tray → uncheck "SDHK Enabled" — verify the frontend status button updates to Inactive  
    25. [x] Right-click tray → uncheck just "Hotstrings Enabled" — verify hotstrings stop but hotkeys still work  
    26. [x] Right-click tray → uncheck just "Hotkeys Enabled" — verify hotkeys stop but hotstrings still work  
    27. [x] Verify tray icon changes between active (green dot) and inactive (red dot)  
    28. [x] Verify taskbar icon also changes  
    29. [x] Toggle individual hotstrings on/off with the switch — verify they stop/start firing
    
- [ ] Settings  
    30. [x] Change theme to Light — verify it applies immediately  
    31. [x] Change theme to Royal — verify it applies  
    32. [x] Switch back to Dark — verify persistence after closing and reopening window  
    33. [x] Adjust typing delay to 30ms — verify replacement typing is noticeably slower  
    34. [x] Adjust typing delay to 1ms — verify no dropped characters  
    35. [x] Adjust clipboard delay to 50ms — test if [CTRL+C][CTRL+V] still works (may fail on slow apps)  
    36. [x] Adjust clipboard delay to 500ms — verify it works reliably  
    37. [x] Adjust settle delay up to 100ms — verify triggers still work but with visible pause  
    38. [x] Reset each delay with the ↺ button — verify it reverts to default value  
    39. [x] Enable "Start minimized" — restart the app, verify window doesn't appear (tray only)  
    40. [ ] Enable "Open on startup" — log out and back in (or restart), verify SDHK launches
    
- [x] Import/Export  
    41. [x] Export config — verify JSON file is created at chosen location  
    42. [x] Open exported file — verify it contains your hotstrings and hotkeys  
    43. [x] Import with Merge — add a file with new entries, verify they appear without duplicating existing ones  
    44. [x] Import with Replace — verify all hotstrings/hotkeys are swapped but theme/settings stay the same  
    45. [x] Import a malformed JSON file — verify error toast appears
    
- [x] Window/Tray Behavior  
    46. [x] Close the window — verify it hides to tray, triggers keep working  
    47. [x] Double-click tray icon — verify window reopens  
    48. [x] Double-click again — verify it hides  
    49. [x] Right-click tray → Open SDHK — verify window appears  
    50. [x] Right-click tray → Exit — verify the app fully quits
    
- [x] Expand/Overflow  
    51. [x] Create a hotstring with a very long replacement — verify the ⤢ expand button appears  
    52. [x] Click expand — verify full text shows  
    53. [x] Click collapse — verify it truncates again  
    54. [x] Create a short replacement — verify no expand button
    
- [x] Help & UI  
    55. [x] Click "? Hotstring Help" — verify modal opens with full documentation  
    56. [x] Click "? Hotkey Help" — verify modal opens  
    57. [x] Press Escape — verify modal closes  
    58. [x] Click outside modal — verify it closes  
    59. [x] Click the config path in Settings → Data — verify Explorer opens to the config folder  
    60. [x] Use Ctrl+= to zoom in, Ctrl+- to zoom out — verify everything scales cleanly  
    61. [x] Verify the keystroke counter in Settings increments after firing triggers
    
- [ ] Stress Test  
    62. [ ] Create 20+ hotstrings — verify scrolling works, no performance issues  
    63. [ ] Rapidly fire the same hotstring 10 times in a row — verify no missed triggers or garbled output  
    64. [ ] Fire a hotstring while typing fast in a sentence — verify surrounding text isn't damaged  
    65. [ ] Alt+Tab while a multi-step hotkey is executing — see if it breaks or completes cleanly




# for claude
```
1. I added single instance support, i.e. tauri-plugin-single-instance = "2"

in cargo.toml

2. i added this to it too:[profile.release]

incremental = false

codegen-units = 1

lto = true

opt-level = "s"

panic = "abort"

strip = true

3. and added this to lib.rs
 pub fn run() {

    let config = Arc::new(RwLock::new(ConfigManager::load()));

    {

        let cfg = config.read().unwrap();

        let s = &cfg.get_config().settings;

        executor::set_typing_delay(s.typing_delay_ms);

        executor::set_clipboard_delay(s.clipboard_delay_ms);

        executor::set_settle_delay(s.settle_delay_ms);

        executor::set_backspace_delay(s.backspace_delay_ms);

        executor::set_time_format(&s.time_format);

    }

    hotstring::start(config.clone());

    let hs_enabled = config.read().unwrap().get_config().hotstrings_enabled;

    let hk_enabled = config.read().unwrap().get_config().hotkeys_enabled;

    let global_active = hs_enabled || hk_enabled;

    let start_minimized = config.read().unwrap().get_config().settings.start_minimized;

    tauri::Builder::default()

        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {

            if let Some(window) = app.get_webview_window("main") {

                let _ = window.unminimize();

                let _ = window.show();

                let _ = window.set_focus();

            }

        }))

        .plugin(tauri_plugin_shell::init())

        .plugin(tauri_plugin_dialog::init())

        .plugin(tauri_plugin_autostart::init(

            MacosLauncher::LaunchAgent,

            None,

        ))>)
4. I added this to tauri.conf.json:
       "bundle": {

    "publisher": "RPeters"

  }
```