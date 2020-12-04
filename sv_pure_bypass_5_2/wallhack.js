'use strict';
const {basename} = require('path');
const readline = require('readline');
const {promisify} = require('util');
const {constants: {O_RDWR}, promises: fs} = require('fs');
const net = require('net');

fs.write = promisify(require('fs').write);

const existsAsync = async path => {
	try {
		await fs.access(path);

		return true;
	} catch (error) {
		if (error.code === 'ENOENT') {
			return false;
		}

		throw error;
	}
};

const PAK_FILE = '/home/szm/.local/share/Steam/steamapps/common/Counter-Strike Global Offensive/csgo/pak01_008.vpk';
const VIDEO_FILE = '/home/szm/.local/share/Steam/userdata/1105952182/730/local/cfg/video.txt';
const NETCON_PORT = 2121;

let wallhackProps = [];
let isPakOverwritten = false;

const SHADER_REGEXP = /("setting.gpu_level"\s+")(\d)(")/;

const connect = port => new Promise((resolve, reject) => {
	const socket = net.connect(port, '127.0.0.1', () => {
		resolve(socket);
	});

	socket.once('error', error => {
		if (error.code !== 'ECONNREFUSED') {
			reject(error);
			return;
		}

		setTimeout(() => {
			resolve(connect(port));
		}, 1000);
	});
});

let toggleIndex = -1;
const toggleUpdate = async socket => {
	console.log('Reading video.txt');
	const video = await fs.readFile(VIDEO_FILE, 'utf8');
	const match = video.match(SHADER_REGEXP);

	if (!match) {
		console.log('Invalid video.txt. Exiting.');
		return;
	}

	toggleIndex *= -1;

	console.log('Updating shader settings...');
	await fs.writeFile(VIDEO_FILE, video.replace(SHADER_REGEXP, `$1${(Number(match[2]) + toggleIndex + 4) % 4}$3`));

	if (!socket.destroyed) {
		console.log('Reloading VPKs...');
		socket.write(`mat_updateconvars\n`);
	}
};

const write = async entries => {
	const fd = await fs.open(PAK_FILE, O_RDWR);

	for (const entry of entries) {
		await fs.write(fd.fd, entry.insert, entry.index);
	}

	await fd.close();
};

const revert = async (entries, socket) => {
	const fd = await fs.open(PAK_FILE, O_RDWR);

	for (const entry of entries) {
		await fs.write(fd.fd, entry.original, entry.index);
	}

	await fd.close();
};

const onPureServer = async socket => {
	if (isPakOverwritten) {
		return;
	}

	isPakOverwritten = true;

	await new Promise(resolve => setTimeout(resolve, 2000));
	console.log('Got pure server! Overwriting the PAK file...');

	await write(wallhackProps);
	console.log('Write successful.');

	await toggleUpdate(socket);
};

const runReader = async socket => {
	const reader = readline.createInterface({
		input: socket,
		crlfDelay: Infinity
	});

	socket.once('error', error => {
		// console.error(error);
		reader.close();
	});

	for await (let line of reader) {
		line = line.trim();

		if (line === 'Got pure server whitelist: sv_pure = 1.') {
			await onPureServer(socket);
		}
	}
};

const findWallhackProps = buffer => {
	const allowedValueCharacters = '0123456789.'.split('').map(string => string.charCodeAt(0));
	const whitespaceCharacters = ' \t'.split('').map(string => string.charCodeAt(0));
	const keys = [
		'rimlightalbedo',
		'phongalbedoboost',
		'ambientreflectionboost',
		'teammatevar'
	];

	const search = keys.map(key => `${key}"`);

	const getNext = (buffer, start) => {
		const occurrences = search.map(value => {
			return {
				value,
				index: buffer.indexOf(value, start)
			};
		}).filter(result => result.index !== -1).sort((a, b) => {
			if (a.index < b.index) {
				return -1;
			}

			if (a.index > b.index) {
				return 1;
			}

			return 0;
		});

		return occurrences[0] || {index: -1};
	};

	const entries = [];
	let index = 0;

	while (true) {
		const {value: search, index: indexOfValue} = getNext(buffer, index);

		if (indexOfValue === -1) {
			break;
		}

		index = indexOfValue + search.length;

		while (whitespaceCharacters.includes(buffer[index])) {
			index++;
		}

		const includesQuotationMark = index => buffer[index] === 34; // "
		if (includesQuotationMark(index)) {
			index++;
		} else {
			continue;
		}

		let numberBuffer = '';
		let iterated = 0;

		while (allowedValueCharacters.includes(buffer[index]) && iterated < 4) {
			numberBuffer += String.fromCharCode(buffer[index]);
			index++;
			iterated++;
		}

		if (Number.isNaN(Number(numberBuffer)) || !includesQuotationMark(index)) {
			continue;
		}

		const ignorez = 'ignorez" "1"';
		const insert = `${ignorez}${Buffer.alloc((index - indexOfValue) - ignorez.length + 1).fill(' ')}`;

		entries.push({
			index: indexOfValue,
			insert,
			original: buffer.slice(indexOfValue, indexOfValue + insert.length).toString()
		});
	}

	return entries;
};

(async () => {
	const BACKUP_FILE = `${PAK_FILE}.backup`;

	try {
		console.log(`Reading ${basename(PAK_FILE)}`);
		const buffer = await fs.readFile(PAK_FILE);

		console.log('Looking for possible wallhack props...');
		wallhackProps = findWallhackProps(buffer);

		if (wallhackProps.length === 0) {
			console.log('No entries were found. Exiting.');
			return;
		}

		console.log(`Found ${wallhackProps.length} entries.`);

		const backupExists = await existsAsync(BACKUP_FILE);
		if (backupExists) {
			console.log('Backup already exists. Skipping.');
		} else {
			console.log('Creating backup...');
			await fs.writeFile(BACKUP_FILE, buffer);
			console.log('Write successful.');
		}

		console.log(`Connecting to port ${NETCON_PORT}...`);
		const socket = await connect(NETCON_PORT);

		// See https://github.com/ValveSoftware/csgo-osx-linux/issues/2554
		await new Promise(resolve => setTimeout(resolve, 2000));
		console.log('Connected! You can start playing now.');

		await toggleUpdate(socket);

		process.once('SIGINT', async () => {
			if (!isPakOverwritten) {
				process.exit();
				return;
			}

			console.log('');
			console.log('Gotta go. Reverting changes.');

			try {
				await revert(wallhackProps, socket);

				console.log('Write successful. Exiting.');
			} catch (error) {
				console.error(error);
			}

			process.exit();
		});

		await runReader(socket);

		console.log('Netcon server closed.');

		if (isPakOverwritten) {
			console.log('Reverting changes.');
			await revert(wallhackProps, socket);
			console.log('Write successful.');
		}

		console.log('Exiting.');
	} catch (error) {
		console.error(error);
	}
})();
