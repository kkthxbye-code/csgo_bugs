## sv\_pure bypass \#5 (Linux only)

Official Valve servers, and most community servers, run with `sv_pure 1`. This causes the client to send CRC32 & MD5 hashes of the files defined in `pure_server_whitelist.txt` to the server. The server then matches the hashes and kicks the player if there is a mismatch.

It seems that this is **still!** implemented poorly and for some `pak01_###.vpk` files it's possible to bypass this check. For example, you can join any server with the `pak01_008.vpk` being empty. It contains some [VMT](https://developer.valvesoftware.com/wiki/Material) definitions, and when they are missing, the textures of agents will be black because of missing skins.

### Steps (I method)

**Note**: You can get kicked while being in-game, although there is a chance that you can keep playing indefinitely.

0. Download this [`pak01_008.vpk`](https://fromsmash.com/uDOWYW8HOL-dt) or generate it using the instructions below.
1. Make sure CS:GO is closed.
2. Run `./prepare.sh`
3. Launch CS:GO.
4. Join any server.
5. Run `./enable_wallhack.sh`.
6. Switch shader settings to high / low.
7. Profit! VAC-proof wallhack.

To disable wallhacks simply close CS:GO and run `./disable_wallhack.sh`.

### Steps (II method)

**Note**: For this method to work you need to place [`video.txt`](video.txt) inside `~/.local/share/Steam/userdata/[steam_id]/730/local/cfg`.

**Note**: If you rejoin the server and aren't kicked immediately, you can keep playing indefinitely.

0. Download this [`pak01_008.vpk`](https://fromsmash.com/uDOWYW8HOL-dt) or generate it using the instructions below.
1. Make sure CS:GO is closed.
2. Run `./prepare.sh`
3. Launch CS:GO.
4. Join any server.
5. Disconnect from the server.
6. Run `./enable_wallhack.sh`.
7. Reconnect.
8. Switch shader settings to high / low.
9. Profit! VAC-proof wallhack.

To disable wallhacks simply close CS:GO and run `./disable_wallhack.sh`.

### Maps

* Nuke: CTs & Ts

* Mirage: CTs
* Vertigo: CTs
* Inferno: CTs
* Office: CTs
* Agency: CTs
* Mutiny: CTs

* Overpass: Ts
* Cache: Ts

* Dust: none
* Train: none
* Anubis: none

* Swamp: always crashes even with the original VPKs

#### Generating the `pak01_008.vpk` with wallhacks

It's pretty simple. You just need [Node.js](https://nodejs.org/en/download/current/) to be able to run the script. It will generate `pak01_008.vpk.wh`. It replaces VMT keys like `$ambientreflectionboost` with `$ignorez 1` and keeps the file size the same.

1. Copy the `generateWallhack.js` file to `~/.local/share/Steam/steamapps/common/Counter-Strike Global Offensive/csgo`.
2. Run `node generateWallhack.js`.

### Credits

* [@szmarczak](https://github.com/szmarczak) for discovering the bug.
