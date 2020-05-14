## Hitmarker

Proof of Concept made by [@szmarczak](https://github.com/szmarczak).

Changes the crosshaircolor when you hit an enemy, even through walls. It works by using `net_dumpeventstats` as explained in [con_logfile_tricks](../../con_logfile_tricks), just made way easier by being able to use netcon.

The script is configured to work only if you're the server. If that's not the case (for example if you're playing matchmaking), you need to change

```js
	if (!(data.Name in previous) || previous[data.Name].Out !== data.Out) {
````

to

```js
	if (!(data.Name in previous) || previous[data.Name].In !== data.In) {
````

Please note that it will turn red no matter if you or your teammate hits someone.

### Requirements

* [Node.js 14+](https://nodejs.org/en/download/current/)

### Usage

Start CS:GO with `-netconport 2121` and then run `node hitmarker.js 2121`.
