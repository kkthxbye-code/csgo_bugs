## sv\_pure bypass \#3

Official valve servers, and most community servers, run with `sv_pure 1`. This causes the client to send crc hashes of the files defined in `pure_server_whitelist.txt` to the server. The server then matches the hashes and kicks the player if there is a mismatch.

It seems that this is implemented poorly and for some `pak01_###.vpk` files it's possible to bypass this check.  As `sv_pure_allow_missing_files ` defaults to `0`, you can join the server without `pak01_008.vpk`. It contains some [VMT](https://developer.valvesoftware.com/wiki/Material) definitions, and when they are missing, agents will be pure black because of missing skins.

### Caveats

1. Some VPK files are required to be present at the game startup, e.g. `pak01_006.vpk`, otherwise the game will crash.
2. Sometimes you may end up getting a [file mismatch](https://support.steampowered.com/kb_article.php?ref=8285-YOAZ-6049) error. If you rejoin the server and aren't kicked immediately, you can keep playing indefinitely.

### Steps

1. Make sure CS:GO is closed.
2. Rename the original `pak01_008.vpk` to `pak01_008.vpk.bak`.
3. Copy `pak01_008.vpk_` into the `csgo` folder. Do not delete the trailing `_` yet!
4. Run CS:GO.
5. Connect to any `sv_pure 1` server and wait till you spawn.
6. Disconnect from the server.
7. Rename `pak01_008.vpk_` to `pak01_008.vpk`.
8. Change shader settings to high / low.
9. Reconnect.
10. Profit! VAC-proof wallhack.

If you run `sv_pure_listfiles`, you can see that all files are verified. Although, you may get:

```
File c:\program files (x86)\steam\steamapps\common\counter-strike global offensive\csgo\pak01_008.vpk offset 2500000 hash 5455e4ec6e85785e16057104a706b2b5 does not match ( should be bf8792d18d795a2cf3f8ec268be2eb2b )
```

It is unsure whether it will get you kicked or not. More feedback needed.

### Credits

* [DepoSit](https://www.youtube.com/watch?v=aL2rQzhFTn4) for discovering the bug on Danger Zone servers.
* [@mbhound](https://github.com/mbhound) for further testing on matchmaking servers.
* [@szmarczak](https://github.com/szmarczak) for preparing the `pak01_008.vpk_` file.
