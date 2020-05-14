## Hitmarker
Proof of concept made by [szmarczak](https://github.com/szmarczak). Changes the crosshaircolor when you hit an enemy, even through walls. It works by using net_dumpstats as explained in con_logfile_tricks, just made way easier by being able to use netcon.

### Requirements

* node 14+

### Usage

Start csgo with `-netconport 2121` and then run `node wallhack.js 2121`.