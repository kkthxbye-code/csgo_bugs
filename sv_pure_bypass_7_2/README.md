## sv\_pure bypass \#7.2 (Windows only)

Official Valve servers, and most community servers, run with `sv_pure 1`. This causes the client to send CRC32 & MD5 hashes of the files defined in `pure_server_whitelist.txt` to the server. The server then matches the hashes and kicks the player if there is a mismatch.

It seems that this is **still!** implemented poorly and for some `pak01_###.vpk` files it's possible to bypass this check.

### Prerequisites

1. [Dokany](https://github.com/dokan-dev/dokany) (necessary for mirroring the VPK files) | [Download from GitHub](https://github.com/dokan-dev/dokany/releases/download/v1.4.0.1000/Dokan_x64.msi)
2. Download this [`pak01_007.vpk.wh`](https://drive.google.com/file/d/1eC4PqfFpYByjFcGWS-Nm5L9PrcGb0DiJ/view?usp=sharing) or generate it using the instructions below.
3. Place inside the `csgo` folder.
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

* Danger Zone (all)
* Nuke: CTs & Ts

* Mirage: CTs & Ts
* Vertigo: CTs
* Inferno: CTs
* Office: CTs
* Agency: CTs
* Mutiny: CTs

* Overpass: Ts
* Cache: Ts

* Dust: Ts
* Train: none

#### Generating the `pak01_007.vpk.wh` with wallhacks

It's pretty simple. You just need [Node.js](https://nodejs.org/en/download/current/) to be able to run the script. It will generate `pak01_007.vpk.wh`. It replaces VMT keys like `$ambientreflectionboost` with `$ignorez 1` and keeps the file size the same.

1. Copy the [`generateWallhack.js`](https://github.com/Billar42/csgo_bugs/blob/master/sv_pure_bypass_7_2/generateWallhack.js) file to `~/.local/share/Steam/steamapps/common/Counter-Strike Global Offensive/csgo`.
2. Run `node generateWallhack.js`.

### SkinChanger
Buy the following skins on the marketplace:
* [AWP | Capillary](https://steamcommunity.com/market/listings/730/AWP%20%7C%20Capillary%20%28Battle-Scarred%29)
* [AK-47 | Uncharted](https://steamcommunity.com/market/listings/730/AK-47%20%7C%20Uncharted%20%28Battle-Scarred%29)
* [Glock-18 | Oxide Blaze](https://steamcommunity.com/market/listings/730/Glock-18%20%7C%20Oxide%20Blaze%20%28Battle-Scarred%29)
* [USP-S | Flashback](https://steamcommunity.com/market/listings/730/USP-S%20%7C%20Flashback%20%28Field-Tested%29)
* [Desert Eagle | Blue Ply](https://steamcommunity.com/market/listings/730/Desert%20Eagle%20%7C%20Blue%20Ply%20%28Battle-Scarred%29)

### How to install

1. Dowload [Dokany](https://github.com/dokan-dev/dokany) (necessary for mirroring the VPK files) | [Download from GitHub](https://github.com/dokan-dev/dokany/releases/download/v1.4.0.1000/Dokan_x64.msi)
2. Download this [`Skinchanger.zip`](https://drive.google.com/file/d/1mxM99vvZ4tCBLPa2BdztstQeIcS7ebRu/view?usp=sharing).
3. Unpack the archive using the following path ~/.local/share/Steam/steamapps/common/Counter-Strike Global Offensive.
4. Rename the `csgo` directory to `csgo_bak`
5. Go to the control folder at this path ~/.local/share/Steam/steamapps/common/Counter-Strike Global Offensive/control/.
6. Change the path to the `csgo` and `csgo_bak` folders in `mirror.cmd`
```
mirror.exe /r "C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\csgo_bak" /l "C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\csgo"
```
7. Change the path to  `csgo_bak` in `onskinchanger.cmd` and `offskinchanger.cmd`

### Launch
1. Open the control folder and run `mirror.cmd` as an administrator
2. Launch Cs:Go
3. Join any server.
4. Run `onskinchanger.cmd`.
5. Switch shader settings to high / low.
6. Open the console and write the command `mat_updateconvars`
7. For the next round, re-purchase this weapon
8. Profit! VAC-proof SkinChanger.

### New Skins
After a successful replacement, you should have the following skins :
* [AWP | Gungnir](https://steamcommunity.com/market/listings/730/AWP%20%7C%20Gungnir%20(Factory%20New))
* [AK-47 | Fire Serpent](https://steamcommunity.com/market/listings/730/AK-47%20%7C%20Fire%20Serpent%20%28Field-Tested%29)
* [Glock-18 | Bullet Queen](https://steamcommunity.com/market/listings/730/Glock-18%20%7C%20Bullet%20Queen%20(Field-Tested))
* [USP-S | Kill Confirmed](https://steamcommunity.com/market/listings/730/USP-S%20%7C%20Kill%20Confirmed%20%28Field-Tested%29)
* [Desert Eagle | Code Red](https://steamcommunity.com/market/listings/730/Desert%20Eagle%20%7C%20Code%20Red%20%28Minimal%20Wear%29)

### Credits

* [@szmarczak](https://github.com/szmarczak) for discovering the bug.
* [@Billar42](https://github.com/billar42) made a new exploit with textures.
