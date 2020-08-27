'use strict';
const net = require('net');
const readline = require('readline');
const path = require('path');

const port = Number(process.argv[2] || 0);
if (process.argv.length !== 3 || !port) {
	console.error(`Usage: node ${path.basename(process.argv[1])} [port]`);
	return;
}

let ticksLeft = 0;
let timeout;

const sendOnConnect = `alias +hitmarker_attack "+attack; echo hitmarker_on";
alias -hitmarker_attack "-attack; echo hitmarker_off";
bind mouse1 +hitmarker_attack;
con_filter_enable 2;
con_filter_text Hit!
con_filter_text_out ""
cl_hud_color 0
`;

const resetCrosshair = `clear; cl_hud_color 0; cl_crosshaircolor 5; cl_crosshaircolor_r 0; cl_crosshaircolor_g 255; cl_crosshaircolor_b 0\n`;

const hits = [
	': ~)player\\headshot',
	': ~player\\kevlar',
	': ~)player\\bhit_helmet'
];

const socket = net.connect(port, '127.0.0.1', async () => {
	console.log('Connected! Press CTRL+C to abort.');

	socket.write(sendOnConnect);

	setInterval(() => {
		if (ticksLeft) {
			socket.write(`soundinfo\n`);
		
			ticksLeft--;
		}
	}, 75);

	const reader = readline.createInterface({
		input: socket,
		crlfDelay: Infinity
	});

	for await (let line of reader) {
		line = line.trim();
		if (line === 'hitmarker_on') {
			clearTimeout(timeout);
			ticksLeft = Infinity;

			socket.write(resetCrosshair);
		} else if (line === 'hitmarker_off') {
			ticksLeft = 5;
		} else if (hits.map(x => line.includes(x)).indexOf(true) !== -1) {
			clearTimeout(timeout);

			socket.write(`cl_hud_color 10; cl_crosshaircolor 5; cl_crosshaircolor_r 255; cl_crosshaircolor_g 0; cl_crosshaircolor_b 0; echo Hit!\n`);
			
			timeout = setTimeout(() => {
				socket.write(resetCrosshair);
			}, 400);
		}
	}
});

socket.setEncoding('utf8');
