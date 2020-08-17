'use strict';
const net = require('net');
const readline = require('readline');
const path = require('path');

const {now} = Date;
const whitespaceRegExp = /\s{2,}/g;

const config = {
	pingMultiplier: 1,

	// If you get 0.02 instead of 0.000, you can try setting this to -10.
	// If it doesn't help, change the `pingMultiplier` to 0.5 or lower.
	pingOffset: 0,

	ms: {
		tick: Math.ceil(1000 / 64),
		timeoutInaccuracy: 4,
		inputLag: 4,
		defuse: 10000,
		defuseKit: 5000,
		c4: 40000,
		ping: 0
	},

	username: '',
	defuseMode: 0
};

const previousNetStats = {};

const constants = {
	pingDelimiter: ' ms : ',
	net_dumpeventstats: {
		types: {
			Name: 'string',
			Out: 'number',
			In: 'number',
			OutBits: 'number',
			InBits: 'number',
			OutSize: 'number',
			InSize: 'number',
			Notes: 'string'
		}
	},
	name: {
		startsWith: '"name" = "',
		endsWith: '" ( def. "unnamed" ) archive server_can_execute user ss'
	},
	autodefuse: {
		timeUntilExplosion: 'Time until explosion',
		0: '[NO AUTODEFUSE]',
		5: '[AUTODEFUSE 5s]',
		10: '[AUTODEFUSE 10s]'
	}
};

constants.net_dumpeventstats.keys = Object.keys(constants.net_dumpeventstats.types);
constants.net_dumpeventstats.string = constants.net_dumpeventstats.keys.join(' ');

let timeout10s;
let timeout5s;

let explosionTime = 0;

const sendOnConnect = `developer 1;
con_filter_enable 2;
con_filter_text "Time until explosion: ";
bind 0 "echo defuse_0s_0";
bind - "echo defuse_0s_5";
bind = "echo defuse_0s_10";
name;
`;

const onChange = data => {
	const hasPrevious = data.Name in previousNetStats;

	if (!hasPrevious) {
		previousNetStats[data.Name] = data;
		return;
	}

	if (previousNetStats[data.Name].In === data.In) {
		return;
	}

	previousNetStats[data.Name] = data;

	if (data.Name === 'bomb_planted') {
		if (explosionTime !== 0) {
			return;
		}

		const explodesInMs = config.ms.c4 - config.ms.tick - config.pingMultiplier * config.ms.ping - config.pingOffset;

		explosionTime = now() + explodesInMs;

		const delay = explodesInMs - config.ms.defuse - config.ms.timeoutInaccuracy - config.ms.inputLag;

		timeout10s = setTimeout(() => {
			if (config.defuseMode === 10) {
				socket.write('+use\n');
			}
		}, delay);

		timeout5s = setTimeout(() => {
			if (config.defuseMode === 5) {
				socket.write('+use\n');
			}
		}, delay + config.ms.defuse - config.ms.defuseKit);
	} else if (data.Name === 'round_start') {
		config.defuseMode = 0;

		clearTimeout(timeout10s);
		clearTimeout(timeout5s);

		explosionTime = 0;

		socket.write('-use\n');
	}
};

const port = Number(process.argv[2] || 0);
if (process.argv.length !== 3 || !port) {
	console.error(`Usage: node ${path.basename(process.argv[1])} [port]`);
	return;
}

const socket = net.connect(port, '127.0.0.1', async () => {
	console.log('Connected! Press CTRL+C to abort.');

	// Initialize
	socket.write(sendOnConnect);
	
	// Get ping, display time
	{
		let lastPingTime = 0;

		setInterval(() => {
			const timeUntilExplosion = (Math.max(explosionTime - now(), 0) / 1000).toFixed(3);

			let pingCommand = '';
			const ms = Date.now();
			if ((ms - lastPingTime) > 100) {
				lastPingTime = ms;
				pingCommand = 'ping\n';
			}

			socket.write(`clear\n${pingCommand}net_dumpeventstats\necho "${constants.autodefuse.timeUntilExplosion}: ${timeUntilExplosion}s ${constants.autodefuse[config.defuseMode]}"\n`);
		}, config.ms.tick).unref();
	}

	// Read data
	const reader = readline.createInterface({
		input: socket,
		crlfDelay: Infinity
	});

	let reading = false;

	for await (const line of reader) {
		const processedLine = line.replace(whitespaceRegExp, ' ').trim();

		// Process username
		if (processedLine.startsWith(constants.name.startsWith)) {
			config.username = processedLine.slice(constants.name.startsWith.length, processedLine.indexOf(constants.name.endsWith));
			continue;
		}

		// Process ping
		if (processedLine.includes(constants.pingDelimiter)) {
			const data = processedLine.split(constants.pingDelimiter);

			if (data[1] === config.username) {
				config.ms.ping = Number(data[0]);
			}

			continue;
		}

		// Update defuse mode
		if (processedLine === 'defuse_0s_0') {
			config.defuseMode = 0;
			continue;
		} else if (processedLine === 'defuse_0s_5') {
			config.defuseMode = 5;
			continue;
		} else if (processedLine === 'defuse_0s_10') {
			config.defuseMode = 10;
			continue;
		}

		// Try to parse `net_dumpeventstats`
		if (reading) {
			const {string, types, keys} = constants.net_dumpeventstats;

			const parsedLine = processedLine.split(' ');
			if (parsedLine.length !== keys.length) {
				reading = false;
				continue;
			}

			const object = {};

			for (let index = 0; index < keys.length; index++) {
				const key = keys[index];
				const type = types[key];

				if (type === 'string') {
					object[key] = parsedLine[index];
				} else if (type === 'number') {
					object[key] = Number(parsedLine[index]);

					if (Number.isNaN(object[key])) {
						reading = false;
					}
				} else {
					throw new Error(`Unknown value type: ${type}`);
				}
			}

			if (reading) {
				onChange(object);
			}
		}

		// We are gonna parse `net_dumpeventstats`
		if (processedLine === constants.net_dumpeventstats.string) {
			reading = true;
		}
	}
});

socket.setEncoding('utf8');
