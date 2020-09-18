## sv\_pure bypass \#7.2 (Windows only)

Official Valve servers, and most community servers, run with `sv_pure 1`. This causes the client to send CRC32 & MD5 hashes of the files defined in `pure_server_whitelist.txt` to the server. The server then matches the hashes and kicks the player if there is a mismatch.

It seems that this is **still!** implemented poorly and for some `pak01_###.vpk` files it's possible to bypass this check. For example, you can join any server with the `pak01_008.vpk` being empty. It contains some [VMT](https://developer.valvesoftware.com/wiki/Material) definitions, and when they are missing, the textures of agents will be black because of missing skins.

### Prerequisites

1. [Dokany](https://github.com/dokan-dev/dokany) (necessary for mirroring the VPK files) | [Download from GitHub](https://github.com/dokan-dev/dokany/releases/download/v1.4.0.1000/Dokan_x64.msi)
2. Download this [`pak01_008.vpk`](https://fromsmash.com/701vWE2-C5-dt) or generate it using the instructions below.
3. Rename it to `pak01_008.vpk.wh` and place inside the `csgo` folder.
4. Run `prepare.cmd`
5. Place [`video.txt`](video.txt) inside `C:\Program Files (x86)\Steam\Steam\userdata\[steam_id]\730\local\cfg`.

#### Compile mirror.exe (optional)

If you don't trust our modified `mirror.exe` (a Dokany example), you can compile one by yourself:

Replace

https://github.com/dokan-dev/dokany/blob/6ae6188e61df3f7a1448591a3675c130c4d22bc7/samples/dokan_mirror/mirror.c#L396

with

```c
        CreateFile(filePath, genericDesiredAccess, 3,
```

then recompile with Visual Studio.

### Before you launch CS:GO

1. Rename the `csgo` directory to `csgo_bak`.
2. Create an empty `csgo` directory.
3. Run this with with administrator privileges:

```
mirror.exe /r "C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\csgo_bak" /l "C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\csgo
```

Don't worry, this does NOT copy the files. This just mirrors the `csgo_bak` directory to `csgo`. The patch above is needed, so the `.vpk` files won't be locked when `csgo.exe` is running.

**Note:** If the mirror fails, make sure to close all Explorer windows!

### Steps (I method)

**Note**: You can get kicked while being in-game, although there is a chance that you can keep playing indefinitely.

1. Run `disable_wallhack.cmd`
2. Switch shader settings to high / low.
3. Join any server.
4. Run `enable_wallhack.cmd`.
5. Switch shader settings to high / low.
6. Profit! VAC-proof wallhack.

### Steps (II method)

**Note**: For this method to work you need to place [`video.txt`](video.txt) inside `~/.local/share/Steam/userdata/[steam_id]/730/local/cfg`.

**Note**: If you rejoin the server and aren't kicked immediately, you can keep playing indefinitely.

1. Run `disable_wallhack.cmd`
2. Switch shader settings to high / low.
3. Join any server.
4. Disconnect.
5. Run `enable_wallhack.cmd`.
6. Switch shader settings to high / low.
7. Reconnect.
8. Profit! VAC-proof wallhack.

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
