Original Issue: https://github.com/ValveSoftware/csgo-osx-linux/issues/1888

First reported in october 2018, reported multiple times since. Never received any response.

## Original issue text below
The engine seems to cache loaded props (between map change) for maps with packed textures, which allows you to bug the loading of models and allow the player to see through props on the map, granting an undetectable wallhack.

I will be using the official map de_cache as an example in this issue.


### Video Example:

https://streamable.com/gob4m

### Your system information

OS agnostic

### Please describe your issue in as much detail as possible:

By creating a custom map, with props used on the official de_cache (or any map with custom props), while corrupting the checkSum field of the FileHeader_t of a .vtx file, you can cause the engine to fail loading specific custom props, giving the player the ability to see through props (wallhack basically).

### Steps for reproducing this issue:

Decompile de_cache (with the packed props).

Choose a prop model you want to "unload", edit checkSum of FileHeader_t for the corrosponding .vtx file (https://developer.valvesoftware.com/wiki/VTX). Just increment or decrement it, doesn't matter, it just has to be different than the corrosponding checksum in the model file.

Create a prop static with the chosen mdl, vtx (Modified), phy, vdl, etc.

Compile the map.

Pack the model etc. with pakrat.

Host the map (doesn't work on a listen server).

Join the server, leave the server.

Join a de_cache server (still doesn't work on listen server).

The chosen prop should now be unloaded with the following error in console: Error Vertex File for 'de_cache/rolling_door01.mdl' checksum 951189271 should be 256062753

### Video example:

https://streamable.com/gob4m

### Disclosure

I have been trying to report this to the csgo devs since the end of October, but have received no response on the two mails I tried, nor on twitter. As the csgo devs doesn't seem to have a proper channel to report exploits like this, I'll give it a last try here (sadly in public).
