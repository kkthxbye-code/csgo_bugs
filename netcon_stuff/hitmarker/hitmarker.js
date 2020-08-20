'use strict';
const net = require('net');
const readline = require('readline');
const path = require('path');

/*
alias +hitmarker_attack "net_dumpeventstats; +attack; echo hitmarker_on";
alias -hitmarker_attack "-attack; echo hitmarker_off";
bind mouse1 +hitmarker_attack;
*/

let ticksLeft = 0;
let previous = {};
let timeout;

const onChange = data => {
	if (data.Name !== 'player_hurt') {
		return;
	}

	if (!(data.Name in previous) || previous[data.Name].In !== data.In) {
		previous[data.Name] = data;

		if (ticksLeft > 0) {
			clearTimeout(timeout);

			socket.write(`cl_crosshaircolor 5; cl_crosshaircolor_r 255; cl_crosshaircolor_g 0; cl_crosshaircolor_b 0\n`);
			
			timeout = setTimeout(() => {
				socket.write(`cl_crosshaircolor 5; cl_crosshaircolor_r 0; cl_crosshaircolor_g 255; cl_crosshaircolor_b 0\n`);
			}, 400);
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

	const reader = readline.createInterface({
		input: socket,
		crlfDelay: Infinity
	});

	let reading = false;
	let interval;

	for await (const line of reader) {
		const processedLine = line.replace(whitespaceRegExp, ' ').trim();

		if (processedLine === 'hitmarker_on') {
			clearTimeout(timeout);
			ticksLeft = Infinity;

			socket.write(`cl_crosshaircolor 5; cl_crosshaircolor_r 0; cl_crosshaircolor_g 255; cl_crosshaircolor_b 0\n`);
		} else if (processedLine === 'hitmarker_off') {
			ticksLeft = 1;
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
				reading = true;
			}
		}
	}
});

setInterval(() => {
	if (ticksLeft) {
		socket.write(`${COMMAND}\n`);
	
		ticksLeft--;
	}
}, 75).unref();

socket.setEncoding('utf8');
