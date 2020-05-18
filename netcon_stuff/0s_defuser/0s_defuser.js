'use strict';
const net = require('net');
const readline = require('readline');
const path = require('path');

const TICK_RATE = 64;

let previous = {};
let timeout10s;
let timeout5s;
let counter = 0;

let defuseMode = 0;
let explosionTime = 0;

const sendOnConnect = `developer 1;
con_filter_enable 2;
con_filter_text "Time until explosion: ";
bind 0 "echo defuse_0s_0";
bind - "echo defuse_0s_1";
bind = "echo defuse_0s_2";`;

const onChange = data => {
	const hasPrevious = data.Name in previous;
	const isDifferent = !hasPrevious || previous[data.Name].In !== data.In;

	if (!isDifferent) {
		return;
	}

	if (data.Name === 'bomb_planted') {
		previous[data.Name] = data;

		if (counter === 2) {
			explosionTime = Date.now() + 40000;
			clearTimeout(timeout10s);
			clearTimeout(timeout5s);

			// This should be set between 29970 - 29980
			
			timeout10s = setTimeout(() => {
				if (defuseMode === 1) {
					socket.write(`+use\n`);
				}
			}, 29970);
			
			timeout5s = setTimeout(() => {
				if (defuseMode === 2) {
					socket.write(`+use\n`);
				}
			}, 29970 + 5000);
		}
	} else if (data.Name === 'round_start') {
		previous[data.Name] = data;

		if (counter === 2) {
			clearTimeout(timeout10s);
			clearTimeout(timeout5s);
			explosionTime = 0;
			defuseMode = 0;
			socket.write(`-use\n`);
		}
	}
};

const COMMAND = 'net_dumpeventstats';
const WANTED = {
	Name: 'string',
	Out: 'number',
	In: 'number',
	OutBits: 'number',
	InBits: 'number',
	OutSize: 'number',
	InSize: 'number',
	Notes: 'string'
};

const WANTED_KEYS = Object.keys(WANTED);
const WANTED_STRING = WANTED_KEYS.join(' ');
const WANTED_LENGTH = WANTED_KEYS.length;
const whitespaceRegExp = /\s{2,}/g;

const port = Number(process.argv[2] || 0);
if (process.argv.length !== 3 || !port) {
	console.error(`Usage: node ${path.basename(process.argv[1])} [port]`);
	return;
}

const socket = net.connect(port, '127.0.0.1', async () => {
	console.log('Connected! Press CTRL+C to abort.');

	socket.write(`${sendOnConnect}\n`);

	const reader = readline.createInterface({
		input: socket,
		crlfDelay: Infinity
	});

	let reading = false;

	for await (const line of reader) {
		const processedLine = line.replace(whitespaceRegExp, ' ').trim();
		
		if (processedLine === 'defuse_0s_0') {
			defuseMode = 0;
		} else if (processedLine === 'defuse_0s_1') {
			defuseMode = 1;
		} else if (processedLine === 'defuse_0s_2') {
			defuseMode = 2;
		} else {
			if (reading) {
				const parsedLine = processedLine.split(' ');

				if (parsedLine.length !== WANTED_LENGTH) {
					reading = false;
					continue;
				}

				const object = {};

				for (let index = 0; index < WANTED_KEYS.length; index++) {
					const key = WANTED_KEYS[index];
					const type = WANTED[key];

					if (type === 'string') {
						object[key] = parsedLine[index];
					} else if (type === 'number') {
						object[key] = Number(parsedLine[index]);

						if (Number.isNaN(object[key])) {
							reading = false;
						}
					}
				}

				if (reading) {
					onChange(object);
				}
			}

			if (processedLine === WANTED_STRING) {
				if (counter < 2) {
					counter++;
				}

				reading = true;
			}
		}
	}
});

setInterval(() => {
	socket.write(`clear\n${COMMAND}\n`);
	
	const diff = Math.max(explosionTime - Date.now(), 0);
	
	let mode;
	if (defuseMode === 0) {
		mode = '[NO AUTODEFUSE]';
	} else if (defuseMode === 1) {
		mode = '[AUTODEFUSE 10s]';
	} else if (defuseMode === 2) {
		mode = '[AUTODEFUSE 5s]';
	}
	
	socket.write(`echo "Time until explosion: ${(diff / 1000).toFixed(3)}s ${mode}"\n`);
}, Math.floor(1000 / TICK_RATE)).unref();

socket.setEncoding('utf8');
