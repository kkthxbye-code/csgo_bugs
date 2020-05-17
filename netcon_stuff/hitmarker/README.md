## Hitmarker

![](example.gif)

Proof of Concept made by [@szmarczak](https://github.com/szmarczak).

Changes the crosshaircolor when you hit an enemy, even through walls. It works by using `net_dumpeventstats` as explained in [con_logfile_tricks](../../con_logfile_tricks), just made way easier by being able to use netcon.

Before you run the script, please add the following to your `autoconfig.cfg`:

```
alias +hitmarker_attack "net_dumpeventstats; +attack; echo hitmarker_on";
alias -hitmarker_attack "-attack; echo hitmarker_off";
bind mouse1 +hitmarker_attack;
```

The script will read the `echo` message, so it will have effect only when it's toggled on.\
The `net_dumpeventstats` command **must** be executed before the `+attack` command to reset the `player_hurt` counter internally.

Please note that it will turn red if **any** player gets hurt, no matter who.

### Requirements

* [Node.js 14+](https://nodejs.org/en/download/current/)

### Usage

Start CS:GO with `-netconport 2121` and then run `node hitmarker.js 2121`. Works offline and online.
