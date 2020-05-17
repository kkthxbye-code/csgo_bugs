'use strict';
const net = require('net');
const readline = require('readline');
const path = require('path');

/*
alias +hitmarker_attack "net_dumpeventstats; +attack; echo hitmarker_on";
alias -hitmarker_attack "-attack; echo hitmarker_off";
bind mouse1 +hitmarker_attack;
*/

// If your FPS drops, change this to 10.
const TICK_RATE = 64;

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

			socket.write(`cl_crosshaircolor 5; cl_crosshaircolor_r 0; cl_crosshaircolor_g 255; cl_crosshaircolor_b 0\n${COMMAND}\n`);
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
}, Math.floor(1000 / TICK_RATE)).unref();

socket.setEncoding('utf8');

// Other useful things:
// - bomb_planted (0s defuser)
// - weapon_reload, player_blind (useful on 1v1)
// - hegrenade_detonate and/or inferno_startburn combined with player_hurt (useful in all situations).

/*
                           Name  Out    In  OutBits InBits  OutSize InSize  Notes
                 player_connect     0    58       0   21232       0     366 reliable
              player_disconnect     0    72       0   33384       0     463 reliable
            player_connect_full     0    59       0    6760       0     114 reliable
            cs_round_start_beep     0   356       0    5696       0      16 reliable
            cs_round_final_beep     0   124       0    1984       0      16 reliable
             round_time_warning     0    16       0     256       0      16 reliable
                    player_team     0   205       0   72592       0     354 reliable
                   player_death     0  1733       0 2101016       0    1212 reliable
                    player_hurt     0  6551       0 2886800       0     440 reliable
                   player_spawn     0  2303       0  262888       0     114 reliable
                    round_start     0   121       0   30720       0     253 reliable
     round_announce_match_point     0     3       0      48       0      16 reliable
           round_announce_final     0     2       0      32       0      16 reliable
 round_announce_last_round_half     0     4       0      64       0      16 reliable
     round_announce_match_start     0     5       0      80       0      16 reliable
          round_announce_warmup     0     4       0      64       0      16 reliable
                      round_end     0   122       0   61176       0     501 reliable
         round_end_upload_stats     0    93       0    1488       0      16 reliable
         round_officially_ended     0   112       0    1792       0      16 reliable
                begin_new_match     0     5       0      80       0      16 reliable
                      vote_cast     0    17       0    2720       0     160 reliable
                    other_death     0   815       0  816608       0    1001 reliable
                   bomb_planted     0    51       0    6120       0     120 reliable
                   bomb_defused     0    11       0    1320       0     120 reliable
                  bomb_exploded     0     7       0     840       0     120 reliable
                   bomb_dropped     0   154       0   18480       0     120 reliable
                    bomb_pickup     0   209       0   13376       0      64 reliable
             announce_phase_end     0     9       0     144       0      16 reliable
                cs_intermission     0     5       0      80       0      16 reliable
                   hostage_hurt     0     2       0     240       0     120 reliable
                hostage_rescued     0     2       0     336       0     168 reliable
            hostage_rescued_all     0     2       0      32       0      16 reliable
                    weapon_fire     0 33244       0 9027296       0     271 reliable
                  weapon_reload     0   290       0   20880       0      72 reliable
                    weapon_zoom     0   423       0   30456       0      72 reliable
                    item_pickup     0  9975       0 2663720       0     267 reliable
              item_pickup_slerp     0  7635       0 1358304       0     177 reliable
                    item_remove     0  1376       0  301928       0     219 reliable
                    ammo_pickup     0   154       0   38168       0     247 reliable
                     item_equip     0  7597       0 3804040       0     500 reliable
                  buytime_ended     0     1       0      24       0      24 reliable
                 round_prestart     0    28       0     672       0      24 reliable
                round_poststart     0    28       0     672       0      24 reliable
             hegrenade_detonate     0   304       0  104384       0     343 reliable
             flashbang_detonate     0   327       0  112384       0     343 reliable
          smokegrenade_detonate     0   306       0  105104       0     343 reliable
           smokegrenade_expired     0   294       0  100984       0     343 reliable
                 decoy_detonate     0    25       0    8592       0     343 reliable
                  decoy_started     0    25       0    8592       0     343 reliable
              inferno_startburn     0   173       0   51072       0     295 reliable
                 inferno_expire     0   173       0   51072       0     295 reliable
                player_footstep     0 18746       0 1349712       0      72 reliable
                    player_jump     0  1323       0   95256       0      72 reliable
                   player_blind     0   141       0   34968       0     248 reliable
              player_falldamage     0    69       0    9936       0     144 reliable
               round_freeze_end     0   123       0    2952       0      24 reliable
             cs_win_panel_round     0   118       0   77896       0     660 reliable
             cs_win_panel_match     0     5       0     120       0      24 reliable
                 cs_pre_restart     0   119       0    2856       0      24 reliable
                      round_mvp     0   118       0   25512       0     216 reliable
                gg_killed_enemy     0   729       0  200952       0     275 reliable
                    switch_team     0    79       0   20856       0     264 reliable
                      gg_leader     0    89       0    6968       0      78 reliable
                player_given_c4     0    89       0    6408       0      72 reliable
                   bot_takeover     0    39       0    6552       0     168 reliable
                jointeam_failed     0    10       0    1280       0     128 reliable
                    hltv_status     0  1600       0  500256       0     312 reliable
                     hltv_chase     0   436       0  189368       0     434 reliable
*/
