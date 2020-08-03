const fs = require('fs');

const addMissingZeros = i => {
	if (i < 10) {
		return `00${i}`;
	}
	
	if (i < 100) {
		return `0${i}`;
	}
	
	return i;
};

const keys = [
	'rimlightalbedo',
	'phongalbedoboost',
	'ambientreflectionboost'
];

const allowedCharacters = '0123456789.'.split('').map(x => x.charCodeAt(0));

let entry = 1;

const next = (vpk = 0) => {
	if (vpk > 130) {
		console.log('Done!');
		return;
	}
	
	const filename = `pak01_${addMissingZeros(vpk)}.vpk`;

	const buffer = fs.readFileSync(filename);

	const prevEntry = entry;

	for (const key of keys) {
		const search = `${key}" `;
		
		let start = 0;
		let indexOf;	

		while (true) {
			indexOf = buffer.indexOf(search, start);

			if (indexOf === -1) {
				break;
			}

			let i = indexOf + search.length;
			while (buffer[i] === 32) { // space
				i++;
			}

			let numberBuffer = '';
			if (buffer[i] === 34) { // "
				i++;
				
				let iterated = 0;
				while (true) {
					if (allowedCharacters.includes(buffer[i]) && iterated < 4) {
						numberBuffer += String.fromCharCode(buffer[i]);
						i++;
						iterated++;
					} else {
						break;
					}
				}

				if (Number.isNaN(Number(numberBuffer)) || buffer[i] !== 34) { // "
					start = i;
					continue;
				}
				
				console.log(`Found ${entry++}!`, buffer.slice(indexOf, i + 1).toString());

				const str = 'ignorez" "1"';
				const wanted = `${str}${Buffer.alloc((i - indexOf) - str.length + 1).fill(' ')}`;
				buffer.write(wanted, indexOf);
				// console.log('Written!', buffer.slice(indexOf, i + 1).toString());

				start = i;
			} else {
				break;
			}
		}
	}

	if (entry === prevEntry) {
		console.log(`[${filename}] No matches.`);
		// next(vpk + 1);
	} else {
		fs.createWriteStream(`${filename}wh`).end(buffer, error => {
			console.log(`[${filename}] Write successful: `, !error, error);
			
			// next(vpk + 1);
		});	
	}
};

next(8);
