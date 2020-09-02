## sv\_pure bypass \#7 (Windows only)

Official Valve servers, and most community servers, run with `sv_pure 1`. This causes the client to send CRC32 & MD5 hashes of the files defined in `pure_server_whitelist.txt` to the server. The server then matches the hashes and kicks the player if there is a mismatch.

It seems that this is **still!** implemented poorly and for some `pak01_###.vpk` files it's possible to bypass this check. For example, you can join any server with the `pak01_008.vpk` being empty. It contains some [VMT](https://developer.valvesoftware.com/wiki/Material) definitions, and when they are missing, the textures of agents will be black because of missing skins.

### Prerequisites

#### Part 1

* [Dokany](https://github.com/dokan-dev/dokany) (necessary for mirroring the VPK files) | [Download from GitHub](https://github.com/dokan-dev/dokany/releases/download/v1.4.0.1000/Dokan_x64.msi)
* Modified `mirror.exe` Dokany example:

Replace

https://github.com/dokan-dev/dokany/blob/6ae6188e61df3f7a1448591a3675c130c4d22bc7/samples/dokan_mirror/mirror.c#L396

with

```c
        CreateFile(filePath, genericDesiredAccess, 3,
```

then recompile with Visual Studio, or use the one provided with this directory.

### Part 2

1. Rename `csgo` to `csgo_bak`.
2. Create an empty `csgo` directory.
3. Run `run_mirror` (with administrator privilege).

Don't worry, this does NOT copy the files. This just mirrors the `csgo_bak` directory to `csgo`. The patch above is needed, so the `.vpk` files won't be locked when `csgo.exe` is running.

**Note:** If the mirror fails, make sure to close all Explorer windows!

### Part 3

Place [`video.txt`](video.txt) inside `C:\Program Files (x86)\Steam\Steam\userdata\[steam_id]\730\local\cfg`.

### Steps (I method)

0. Make sure CS:GO is closed.
1. Download this [`pak01_008.vpk`](https://fromsmash.com/uDOWYW8HOL-dt) or generate it using the instructions below. Place it in the `csgo` folder.
2. Open it in `notepad++`.
3. `CTRL+A` + `BACKSPACE` + `CTRL+S`. DO NOT CLOSE `notepad++` YET.
4. Launch CS:GO.
5. Join any server.
6. Switch back to the `notepad++` window.
7. `CTRL+Z` + `CTRL+S`.
8. Switch shader settings to high / low.
9. Profit! VAC-proof wallhack.

To disable wallhacks simply verify game files.

### Steps (II method)

0. Make sure CS:GO is closed.
1. Download this [`pak01_008.vpk`](https://fromsmash.com/uDOWYW8HOL-dt) or generate it using the instructions below. Place it in the `csgo` folder.
2. Open it in `notepad++`.
3. `CTRL+A` + `BACKSPACE` + `CTRL+S`. DO NOT CLOSE `notepad++` YET.
4. Launch CS:GO.
5. Join any server.
6. Disconnect from the server.
7. Switch back to the `notepad++` window.
8. `CTRL+Z` + `CTRL+S`.
9. Switch shader settings to high / low.
10. Profit! VAC-proof wallhack.

To disable wallhacks simply verify game files.

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
