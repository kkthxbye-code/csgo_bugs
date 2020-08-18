## sv\_pure bypass \#4

*Fixed [17-08-2020](https://blog.counter-strike.net/index.php/2020/08/31374/)*

This exploit allows you to modify *whatever* the `.vpk` file (including the `pak01_dir.vpk`) and even `items_game.txt` (basically free skin changer).

```
bind mwheelup sv_pure_listfiles;
bind mwheeldown sv_pure_listfiles;
```

After you execute the commands above, you're pretty much done. All you need is to spam the mouse scroll wheel while connecting.

### Before you connect

You need to launch CS:GO with the modified `.vpk` files already. Normally you'd get kicked by `sv_pure` when connecting but this exploit bypasses that.

<details>
<summary>Preview</summary>

![image](https://user-images.githubusercontent.com/36894700/90197454-fb756e00-ddce-11ea-8428-539f1c6e58b4.png)

</details>

Get the `.vpk` files here: https://drive.google.com/file/d/1-Y9B-2iGCX_6zsM1UQmcO6jdz9sD6Ig1/view?usp=sharing

<details>
<summary>Preview</summary>

![image](https://user-images.githubusercontent.com/36894700/90197446-f3b5c980-ddce-11ea-99d2-c38b56948940.png)

</details>

Here's a custom AK model: https://drive.google.com/file/d/1DsBvN8eE3XZmdqcnAheAYpq9O62PwnPL/view?usp=sharing


<details>
<summary>Preview</summary>

![image](https://user-images.githubusercontent.com/36894700/90197599-61fa8c00-ddcf-11ea-9997-34d49afa836b.png)

</details>

miRage wallhack: https://drive.google.com/file/d/1OoWV3Q4cSqaDvMBzs5gIvMtiISxMLeND/view?usp=sharing

<!-- https://fromsmash.com/4fSt2~vu1T-dt -->

Alternatively, you can generate them by yourself. Just extract the files using [GCFScape](https://developer.valvesoftware.com/wiki/GCFScape). Then, modify them as you wish. The end step is:

```
C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\csgo>..\bin\vpk.exe -M a pak01_dir.vpk scripts\file1.txt scripts\file2.txt
```

**Note:** I think it modifies the last `pak01_###.vpk` file AND the `pak01_dir.vpk` one. Better to compare with the orignal files to figure out what files have been modified.

### Credits

* [@szmarczak](https://github.com/szmarczak) for discovering the bug.
* [@mbhound](https://github.com/mbhound) for making the VPK file for the custom AK model and for the help with creating the `miRage wallhack`.
