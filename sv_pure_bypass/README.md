## sv\_pure bypass (for some files)
Official valve servers, and most community servers, run with `sv_pure 1`. This causes the client to send crc hashes of the files defined in `pure_server_whitelist.txt` to the server. The server then matches the hashes and kicks the player if there is a mismatch.

It seems that this is implemented poorly and for some files it's possible to bypass this check. If the file is loaded on game launch, and then again on map load, the CRC is generated on game launch, but not regenerated on map load. This makes it possible to load the game, then replace the file and not be kicked on sv_pure 1 servers.

### Caveats
I didn't do a lot of testing of this, so I pretty much just focused on the easiest file to exploit (soundmixers.txt). There are other files that are loaded on map load, like a bunch of shaders, and some other files in the script folder, but nothing really stood out as interesting or easy to test. It might be possible that the pak files can be modified after load, but it seemed like too much work to verify. Someone should check it out.

### soundmixers.txt example
In the soundmixer folder is a fully automated script, for using a custom soundmixers.txt file on sv_pure 1 servers.

The manual process is very easy though:

* Launch CS:GO
* Edit the soundmixers.txt file in `D:\Steam\steamapps\common\Counter-Strike Global Offensive\csgo\scripts\soundmixers.txt` (or equivalent)
* Join a sv_pure 1 server
* Restore original file on exit (or verify game files)

In the soundmixer.txt file you can adjust the different mixer groups. This allows to, among others, change the volume of:

* Distant gunfire (enemy/ally)
* First person gunfire
* Own footsteps
* Distant footsteps (enemy/ally)
* Explosions
* Decoy (you can completely mute decoy grenades)
* Ambient (Overpass is completely silent with this muted, but it might not mute all ambient on all maps)

This is pretty useful as the sound mixing is terrible in this game.

If you want to use the script, install python 3, run pip install -r requirements.txt and then just run the script. You need to change the path to the soundmixers.txt file. Your custom sound config can be added to soundmixers_custom.txt. You might need to adjust the start_delay variable to match how long it takes for you to launch CS:GO.

The script just waits for csgo.exe to have been running for 15 seconds, and then it replaces the file. When CS:GO closes, it restores the original.