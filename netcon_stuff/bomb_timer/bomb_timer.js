const PORT = 2121;

const net = require("net");
const rl = require("readline");

const commands = {
  listSounds: "soundlist;\nclear;\n",
  clearSoundCache: "snd_surround_speakers 0;\nsnd_surround_speakers 1;\n;clear;\n",
};

/**
 * @returns {Promise<net.Socket>}
 */
const connect = () => {
  return new Promise((resolve) => {
    const socket = net.connect(PORT, "127.0.0.1", () => {
      resolve(socket);
    });
  });
};

const main = async () => {
  const socket = await connect();

  console.log("Connected to game");

  const untilExplosion = `Time until explosion: `;

  let explosionTime = 0;
  setInterval(() => {
    socket.write(commands.listSounds);
  }, 75);

  setInterval(() => {
    if (!explosionTime) return;

    const untilTime = explosionTime - Date.now();
    if (untilTime < 0) {
      explosionTime = 0;
      return;
    }

    socket.write(`say_team ${untilExplosion}${untilTime / 1e3} s;\n`);
  }, 1e3);

  const reader = rl.createInterface({
    input: socket,
    crlfDelay: Infinity,
  });

  for await (const line of reader) {
    if (line.includes("radio\\bombpl.wav")) {
      explosionTime = Date.now() + 4e4;
      socket.write(commands.clearSoundCache);
    }
  }
};

main();
