## Hitmarker

![](example.gif)

Changes the crosshair color when you hit an enemy, even through walls. It works by checking `soundinfo` for hit sounds.

When you run the script, the following is executed:

```
alias +hitmarker_attack "+attack; echo hitmarker_on";
alias -hitmarker_attack "-attack; echo hitmarker_off";
bind mouse1 +hitmarker_attack;
con_filter_enable 2;
con_filter_text Hit!
con_filter_text_out ""
cl_hud_color 0
```

The script will read the `echo` message, so it will have effect only when it's toggled on.

### Caveats

1. Works only **close-range**.
2. Detects only **headshots**, **helmet hits** and **kevlar hits**. Legs doesn't matter here.

### Requirements

* [Node.js 14+](https://nodejs.org/en/download/current/)

### Usage

Start CS:GO with `-netconport 2121` and then run `node hitmarker.js 2121`. Works offline and online.

### Credits

* [DepoSit](https://youtu.be/T7ShZxNGr5E?t=226) for discovering this exploit.
* [@szmarczak](https://github.com/szmarczak) for improving this exploit.
