'use strict';
const CSGO_EXE_DIR = 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Counter-Strike Global Offensive';
const VIDEO_FILE = 'C:\\Program Files (x86)\\Steam\\userdata\\885285072\\730\\local\\cfg\\video.txt';
const NETCON_PORT = 2121;

const PAK_FILES = [
	'pak01_007.vpk',
];

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

let wallhackProps = {};
let isPakOverwritten = false;

let PAK_PATH = isWindows ? `${CSGO_EXE_DIR}\\csgo\\` : `${CSGO_EXE_DIR}/csgo/`;
const MIRROR_EXE = `${__dirname}\\passthrough-x64.exe`;
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

		const cancel = () => {
			clearTimeout(timeout);
			resolve();
		};

		const timeout = setTimeout(() => {
			process.off('SIGINT', cancel);
			resolve(connect(port));
		}, 1000);

		process.on('SIGINT', cancel);
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

const write = async properties => {
	for (const name in properties) {
		while (true) {
			try {
				const entries = properties[name];
				const path = PAK_PATH + name;

				const fd = await fs.open(path, O_RDWR);

				for (const entry of entries) {
					await fs.write(fd.fd, entry.insert, entry.index);
				}

				await fd.close();
			} catch (error) {
				if (error.code === 'EBUSY') {
					console.log(`Error: EBUSY. Retrying in 1s...`);
					await wait(1000);
					continue;
				}

				throw error;
			} finally {
				break;
			}
		}
	}
};

const revert = async (properties, socket) => {
	if (isPakOverwritten) {
		for (const name in properties) {
			const entries = properties[name];
			const path = PAK_PATH + name;

			const fd = await fs.open(path, O_RDWR);

			for (const entry of entries) {
				await fs.write(fd.fd, entry.original, entry.index);
			}

			await fd.close();

			console.log(`Restored ${name} successfully.`);
		}
	}

	if (!isWindows) {
		return;
	}

	const csgoBakExists = await existsAsync(`${CSGO_EXE_DIR}\\csgo_bak`);
	if (csgoBakExists) {
		console.log('Renaming csgo_bak back to csgo...');

		try {
			await fs.rename(`${CSGO_EXE_DIR}\\csgo_bak`, `${CSGO_EXE_DIR}\\csgo`);
		} catch (error) {
			console.error(`Failed. Error code: ${error.code} - try closing CS:GO first.`);
		}

		PAK_PATH = `${CSGO_EXE_DIR}\\csgo\\`;

		console.log('Done.');
	}
};

const onPureServer = async socket => {
	if (isPakOverwritten) {
		return;
	}

	isPakOverwritten = true;

	console.log('Got pure server! Overwriting the PAK files...');

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

		// line.startsWith('Got pure server whitelist: sv_pure = ') || line.startsWith('No pure server whitelist. sv_pure = ')
		if (line === 'ChangeGameUIState: CSGO_GAME_UI_STATE_LOADINGSCREEN -> CSGO_GAME_UI_STATE_INGAME') {
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
	const end = Symbol('end');

	for (const key of search) {
		let current = searchLetters;

		for (const byte of Buffer.from(key)) {
			if (!current[byte]) {
				current[byte] = {};
			}

			current = current[byte];
		}

		current[end] = key.length;
	}

	const expected = [];

	const getNext = (buffer, start) => {
		expected.length = 0;

		const bufferLength = buffer.length;
		for (let index = start; index < bufferLength; index++) {
			const byte = buffer[index];

			let {length} = expected;
			for (let x = 0; x < length; x++) {
				const e = expected[0];

				if (byte in e) {
					if (end in e[byte]) {
						return {
							startIndex: index + 1 - e[byte][end],
							endIndex: index + 1
						};
					} else {
						expected.splice(0, 1);
						expected.push(e[byte]);
					}
				} else {
					expected.splice(0, 1);
				}
			}

			if (byte in searchLetters) {
				expected.push(searchLetters[byte]);
			}
		}

		return {startIndex: -1, endIndex: -1};
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

let socket;
let mirror;

process.stdin.resume();

(async () => {
	console.log('Tip: to revert changes simply close CS:GO. If closed already, press CTRL+C here.');
	console.log('');

	for (const name of PAK_FILES) {
		const buffer = await fs.readFile(PAK_PATH + name);
		wallhackProps[name] = findWallhackProps(buffer);

		console.log(`Found ${wallhackProps[name].length} properties in ${name}`);

		if (wallhackProps[name].length) {
			const BACKUP_FILE = `${PAK_PATH + name}.backup`;

			const backupExists = await existsAsync(BACKUP_FILE);
			if (backupExists) {
				console.log('Backup already exists. Skipping.');
			} else {
				console.log('Creating backup...');
				await fs.writeFile(BACKUP_FILE, buffer);
				console.log(`Backup saved as ${basename(BACKUP_FILE)}`);
			}
		}
	}

	console.log('');

	if (isWindows) {
		console.log('Renaming csgo to csgo_bak...');
		await fs.rename(`${CSGO_EXE_DIR}\\csgo`, `${CSGO_EXE_DIR}\\csgo_bak`);

		console.log('Bypassing write access lock via WinFSP...');

		mirror = spawn(MIRROR_EXE, ['-p', `${CSGO_EXE_DIR}\\csgo_bak`, '-m', `${CSGO_EXE_DIR}\\csgo`]);

		mirror.stdout.resume();
		mirror.stderr.resume();

		mirror.once('close', code => {
			if (code === null) {
				console.error(`${basename(MIRROR_EXE)} exited via ${mirror.signalCode}.`);
			} else if (code !== 0) {
				console.error(`${basename(MIRROR_EXE)} exited with error code ${code}`);
			}
		});

		PAK_PATH = `${CSGO_EXE_DIR}\\csgo_bak\\`;

		console.log('');
	}

	process.once('SIGINT', async () => {
		console.log('');

		if (mirror) {
			try {
				console.log('Closing CS:GO.');
				await execFile('taskkill', ['/f', '/im', 'csgo.exe']);
			} catch {}
		}

		process.stdin.pause();
	});

	console.log('You can now launch CS:GO.');
	console.log(`Connecting to port ${NETCON_PORT}...`);

	socket = await connect(NETCON_PORT);

	if (socket) {
		console.log('Connected! You can start playing now.');

		await toggleUpdate(socket);
		await runReader(socket);

		console.log('Netcon server closed.');
		console.log('');
	}

	if (mirror) {
		mirror.kill('SIGINT');

		await new Promise((resolve, reject) => {
			mirror.once('close', resolve);
			mirror.once('error', reject);
		});
	}

	console.log('Reverting changes.');
	await revert(wallhackProps, socket);

	process.stdin.pause();
})();
