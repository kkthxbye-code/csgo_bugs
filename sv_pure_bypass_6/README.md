## sv\_pure bypass \#6

Official Valve servers, and most community servers, run with `sv_pure 1`. This causes the client to send CRC32 & MD5 hashes of the files defined in `pure_server_whitelist.txt` to the server. The server then matches the hashes and kicks the player if there is a mismatch.

However, the engine disables the hashing of opened files if the game thinks it's running in singleplayer mode, which equates to a new sv_pure bypass.

### Steps

1. Open the following file in an editor: 
`E:\Steam\steamapps\common\Counter-Strike Global Offensive\csgo\gameinfo.txt`
2. Change `type multiplayer_only` to `type singleplayer_only`

**NOTE**: The file is the one in the `csgo` folder, not in the `csgo/scripts` folder.

sv_pure is now bypassed for all files except for:
* `pak01_dir.vpk`
* `platform_pak01_dir.vpk`

The vpk dirs are loaded before file hashing is disabled. You can still change all other vpk files, as long as file offset and length are kept the same. All loosely loaded files can be changed as well, however, most files have been moved to the vpk files.

### Example wallhack exploit (by [@szmarczak](https://github.com/szmarczak))

This exploit provides a sv_pure and VAC-safe wallhack. Always assume that services with own client (Faceit, ESEA) detects exploits like these.

1. Download the required files: [mirror 1 (fromsmash.com)](https://fromsmash.com/g1d0XFebf6-dt) | [mirror 2 (gofile.io)](https://gofile.io/d/yc7Ctv).
2. Unzip all vpks in the csgo folder, replacing any existing files.
3. Change the `gameinfo.txt` file as specified in the previous section.
4. Start the game and play on any offical or third-party server.

To remove the exploit, verify game files.

### Credits

* [@kkthxbye-code](https://github.com/kkthxbye-code) for discovering the exploit.
* [@szmarczak](https://github.com/szmarczak) and [@mbhound](https://github.com/mbhound) for vpk creation and testing.
