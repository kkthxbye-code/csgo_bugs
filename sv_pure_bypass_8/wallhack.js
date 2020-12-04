'use strict';
const {basename} = require('path');
const readline = require('readline');
const {promisify} = require('util');
const {constants: {O_RDWR}, promises: fs} = require('fs');
const net = require('net');
const {spawn, execFile: execFileLegacy} = require('child_process');

const execFile = promisify(execFileLegacy);
const isWindows = process.platform === 'win32';

fs.write = promisify(require('fs').write);

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

if (isWindows) {
	const input = readline.createInterface({
		input: process.stdin
	});

	input.on('SIGINT', () => {
		if (!process.emit('SIGINT')) {
			process.exit();
		}
	});

	process.stdin.unref();
}

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

const CSGO_EXE_DIR = '/home/szm/.local/share/Steam/steamapps/common/Counter-Strike Global Offensive';
const VIDEO_FILE = '/home/szm/.local/share/Steam/userdata/1105952182/730/local/cfg/video.txt';
const NETCON_PORT = 2121;

let wallhackProps = [];
let isPakOverwritten = false;

let PAK_FILE = isWindows ? `${CSGO_EXE_DIR}\\csgo\\pak01_008.vpk` : `${CSGO_EXE_DIR}/csgo/pak01_008.vpk`;
const MIRROR_EXE = `${__dirname}\\mirror.exe`;
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
	if (isPakOverwritten) {
		const fd = await fs.open(PAK_FILE, O_RDWR);

		for (const entry of entries) {
			await fs.write(fd.fd, entry.original, entry.index);
		}

		await fd.close();

		console.log(`Restored ${basename(PAK_FILE)} successfully.`);
	}

	if (!isWindows) {
		return;
	}

	const csgoBakExists = await existsAsync(`${CSGO_EXE_DIR}\\csgo_bak`);
	if (csgoBakExists) {
		console.log('Renaming csgo_bak back to csgo...');

		try {
			await fs.rmdir(`${CSGO_EXE_DIR}\\csgo`);
			await fs.rename(`${CSGO_EXE_DIR}\\csgo_bak`, `${CSGO_EXE_DIR}\\csgo`);
		} catch (error) {
			console.error(`Failed. Error code: ${error.code} - try closing CS:GO first.`);
		}

		PAK_FILE = `${CSGO_EXE_DIR}\\csgo\\pak01_008.vpk`;

		console.log('Done.');
	}
};

const onPureServer = async socket => {
	if (isPakOverwritten) {
		return;
	}

	isPakOverwritten = true;

	await wait(2000);
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

		if (line.startsWith('R_RedownloadAllLightmaps took')) {
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
		'teammatevar',
		// 'anisotropyamount',
		// 'envmaptint',
		// 'envmaplightscaleminmax',
		// 'envmapsaturation',
		// 'envmap',
		// 'basealphaenvmask',
		// 'phongboost',
		// 'rimlightexponent',
		// 'rimlightboost',
		// 'ambientreflectionbouncecenter',
		// 'ambientreflectionbouncecolor',
		// 'shadowsaturationbounds',
		// 'shadowtint',
		// 'shadowcontrast',
		// 'shadowsaturationbounds',
		// 'shadowsaturation',
		// 'shadowtint',
		// 'fakerimboost',
		// 'fakerimtint',
		// 'phongexponent',
		// 'rimlighttint',
		// 'warpindex',
		// 'fakerimlightscaleminmax',
		// 'econ_patches_enabled',
		// 'nodecal',
		// 'rimmask',
		// 'rimlight',
		// 'translucent',
		// 'fresnelranges',
		// 'alphatest',
		// 'phongfresnelranges',
		// 'phongdisablehalflambert',
		// 'phongexponenttexture',
		// 'bumpmap',
		// 'selfillum',
		// 'selfillumfresnel',
		// 'selfillumfresnelminmaxexp',
		// 'selfillummask',
		// 'envmapfresnel',
		// 'phongdisablehalflambert',
		// 'basemapalphaphongmask',
		// 'normalmapalphaenvmapmask',
		// 'phongalbedotint'
	];

	const search = keys.map(key => `${key}"`);

	const searchLetters = {};

	for (const key of search) {
		let current = searchLetters;

		for (const letter of key) {
			const charCode = letter.charCodeAt(0);

			if (!current[charCode]) {
				current[charCode] = {};
			}

			current = current[charCode];
		}
	}

	const getNext = (buffer, start) => {
		let index;
		let current;

		const bufferLength = buffer.length;

		while (start < bufferLength) {
			index = start;
			current = searchLetters;

			while (buffer[index] in current) {
				current = current[buffer[index++]];

				if (Object.keys(current).length === 0) {
					return {
						startIndex: start,
						endIndex: index
					};
				}
			}

			start++;
		}

		return {
			startIndex: -1,
			endIndex: -1
		};
	};

	const entries = [];
	let index = 0;

	while (true) {
		const {startIndex, endIndex} = getNext(buffer, index);

		if (startIndex === -1) {
			break;
		}

		index = endIndex;

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
		const insert = `${ignorez}${Buffer.alloc((index - startIndex) - ignorez.length + 1).fill(' ')}`;

		entries.push({
			index: startIndex,
			insert,
			original: buffer.slice(startIndex, startIndex + insert.length).toString()
		});
	}

	return entries;
};

(async () => {
	console.log('Tip: to revert changes simply close CS:GO. If closed already, press CTRL+C here.');
	console.log('');

	if (isWindows) {
		console.log('Tip: in case of a mirror error:');
		console.log(' - close all Windows Explorer windows,');
		console.log(' - run this script as an administrator.');
		console.log('');
	}

	const BACKUP_FILE = `${PAK_FILE}.backup`;

	try {
		console.log(`Reading ${basename(PAK_FILE)}`);
		const buffer = await fs.readFile(PAK_FILE);

		const now = Date.now();

		console.log('Looking for possible wallhack props...');
		wallhackProps = findWallhackProps(buffer);

		console.log(`Searching took ${Date.now() - now} ms`);

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
			console.log(`Backup saved as ${basename(BACKUP_FILE)}`);
		}

		PAK_FILE = isWindows ? `${CSGO_EXE_DIR}\\csgo_bak\\pak01_008.vpk` : PAK_FILE;
		let socket;
		let mirror;

		process.once('SIGINT', async () => {
			if (socket && socket.destroyed) {
				return;
			}

			console.log('');
			console.log('Forcing exit.');

			const callback = async () => {
				console.log('Reverting changes.');

				try {
					await revert(wallhackProps, socket);
				} catch (error) {
					console.error(error);
				}
			};

			if (mirror) {
				try {
					console.log('Closing CS:GO.');
					await execFile('taskkill', ['/f', '/im', 'csgo.exe']);
				} catch {}

				mirror.once('close', callback);
				mirror.kill('SIGINT');
			} else {
				callback();
			}
		});

		if (isWindows) {
			console.log('Renaming csgo to csgo_bak...');
			await fs.rename(`${CSGO_EXE_DIR}\\csgo`, `${CSGO_EXE_DIR}\\csgo_bak`);
			await fs.mkdir(`${CSGO_EXE_DIR}\\csgo`);

			console.log('Bypassing write access lock via Dokany...');

			mirror = spawn(MIRROR_EXE, ['/r', `${CSGO_EXE_DIR}\\csgo_bak`, '/l', `${CSGO_EXE_DIR}\\csgo`]);

			mirror.stdout.resume();
			mirror.stderr.resume();
			// mirror.stderr.setEncoding('utf8');
			// mirror.stderr.on('data', chunk => {
			// 	console.log(`[mirror.exe stderr] ${chunk}`);
			// });

			mirror.once('close', code => {
				if (code === null) {
					console.error(`${basename(MIRROR_EXE)} exited via ${mirror.signalCode}.`);
				} else if (code !== 0) {
					console.error(`${basename(MIRROR_EXE)} exited with error code ${code}`);
				}
			});
		}

		console.log('You can now launch CS:GO.');
		console.log(`Connecting to port ${NETCON_PORT}...`);
		socket = await connect(NETCON_PORT);

		// See https://github.com/ValveSoftware/csgo-osx-linux/issues/2554
		await wait(2000);
		console.log('Connected! You can start playing now.');

		await toggleUpdate(socket);
		await runReader(socket);

		console.log('Netcon server closed.');

		if (mirror) {
			mirror.kill('SIGINT');

			await new Promise((resolve, reject) => {
				mirror.once('close', resolve);
				mirror.once('error', reject);
			});
		}

		console.log('Reverting changes.');
		await revert(wallhackProps, socket);
	} catch (error) {
		console.error(error);
	}
})();
