## sv\_pure bypass \#8 (Windows, Linux, macOS)

It took Valve 3 months to fix the recent (`sv_pure_bypass_5_2` and `sv_pure_bypass_7_2`) exploits.

While they mostly fixed it, they have left something behind... Danger Zone.

#### Compile mirror.exe (optional)

**Note:** This note is only for Windows users.

**Note:** This is optional. You can use the precompiled `mirror.exe` instead.

If you don't trust our modified `mirror.exe` (a Dokany example), you can compile one by yourself:

Replace

https://github.com/dokan-dev/dokany/blob/6ae6188e61df3f7a1448591a3675c130c4d22bc7/samples/dokan_mirror/mirror.c#L396

with

```c
        CreateFile(filePath, genericDesiredAccess, 3,
```

then recompile with Visual Studio.

### Steps

0. Install [`Node.js`](https://nodejs.org/en/download/current/).
1. If you're not running Windows, skip this step.
    1. Install [Dokany](https://github.com/dokan-dev/dokany) (necessary for mirroring the VPK files) - [Download from GitHub](https://github.com/dokan-dev/dokany/releases/download/v1.4.0.1000/Dokan_x64.msi)
    2. Reboot the computer.
    3. Download [`mirror.exe`](mirror.exe) or compile it using the instructions above.
2. Add `-netcon 2121` to launch options.
3. Update `CSGO_EXE_DIR` and `VIDEO_FILE` constants in the `wallhack.js` file.
   Note that on Windows you need to use `\\` to add a backslash.
4. Run `node wallhack.js`
5. Wait till you see `Connecting to port 2121...`
6. Run CS:GO and connect to any Danger Zone server.
7. Profit!
8. To revert changes either close CS:GO or press CTRL+C in the terminal (this will close CS:GO on Windows).

Please note that it does **not** work on Competitive and Wingman. It rarely works on Deathmatch and Casual. Always works on Danger Zone.

### Credits

* [@szmarczak](https://github.com/szmarczak) for discovering the bug.
