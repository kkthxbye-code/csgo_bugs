## sv\_pure bypass \#2

*Fixed 5/4/2020*

Official valve servers, and most community servers, run with `sv_pure 1`. This causes the client to send crc hashes of the files defined in `pure_server_whitelist.txt` to the server. The server then matches the hashes and kicks the player if there is a mismatch.

When loading some game files, the engine tries to load from the platform folder, before trying to load from the csgo folder. The platform folder is however not checked by sv_pure at all, thus giving us yet another sv_pure bypass.

### Caveats
I didn't do a lot of testing of this, so I pretty much just focused on the easiest file to exploit (soundmixers.txt). There are other files that are loaded on map load, like a bunch of shaders, and some other files in the script folder, but nothing really stood out as interesting or easy to test. It might be possible that the pak files can be modified after load, but it seemed like too much work to verify. Someone should check it out.

### soundmixers.txt example
The file soundmixers.txt contains an example of a modified soundmixers file. It mutes own footsteps, doubles the volume of enemy footsteps, lowers own gun sounds, raises other gun sounds.

To utilize this feature, download the soundmixers.txt file and put it in: [STEAM PATH]\steamapps\common\Counter-Strike Global Offensive\platform\scripts\

Other stuff you can change:

* Distant gunfire (both enemies and allies)
* First person gunfire (affects all players, including yourself)
* Own footsteps
* Distant footsteps (both enemies and allies)
* Explosions
* Decoy (you can completely mute decoy grenades)
* Ambient (Overpass is completely silent with this muted, but it might not mute all ambient on all maps)

This is pretty useful as the sound mixing is terrible in this game.
