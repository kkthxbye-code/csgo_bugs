## MITM and XSS exploit in Counter-Strike: Global Offensive

### Fixed on 07-05-2019
*https://github.com/SteamDatabase/GameTracking-CSGO/commit/2174089a01d9289fa62e098d142ac77f49667408*

*They fixed it by changing the URL to https and not eval'ing unsafe input. Still plenty of entrypoints.*

---

CS:GO uses the source 2 component Panorama for its UI. It's very much like Electron, in that it is a HTML renderer with a JS API. 

Valve made some mistakes while implementing this, allowing MITM that leads to XSS. This allows you to run JS code in the game, without hooking the process (the code.pbin file is verified, so modification is not possible). This can be used to make custom UI's, set cheat protected CVARS or just play with the internal API.

The UI source code for CS:GO can be found in ```/steamapps/common/Counter-Strike Global Offensive/csgo/panorama/code.pbin```. Can be unzipped with 7zip.

### MITM
Panorama loads http://blog.counter-strike.net/index.php/feed/ for the news on the front page of the CSGO UI. Notice the lack of https. Add ```127.0.0.1 blog.counter-strike.net``` to your hosts file and run a local webserver (check out main.py).

### XSS
In panorama/scripts/mainmenu_news.js (shortened):
```javascript
var NewsPanel = (function () {

	var _GetRssFeed = function()
	{
		BlogAPI.RequestRSSFeed();
	}

	var _OnRssFeedReceived = function( feed )
	{
		feed[ 'items' ].forEach( function( item, i )
		{
			var elEntry = $.CreatePanel( 'Panel', elLister, 'NewEntry' + i, {
				acceptsinput: true,
				onactivate: 'SteamOverlayAPI.OpenURL( "' + item.link + '" );'
			} );
		} );
	};
```

We control the entire feed object, so we can inject anything in item.link. An XML sample of the RSS feed is in templates/index.html. To toggle the payload, you just click the top link in the news feed on the front page.

### Example payload
The following payload will wait 45 seconds and then activate r_drawothermodels 2, giving wallhack. Activate the payload, join a server, and then after 45 seconds r_drawothermodels 2 should be active. 

```		
<link>https://blah.io/test"); $.Schedule( 45.0, _ => {GameInterfaceAPI.SetSettingString("r_drawothermodels", "2");} );//</link>
```
As was found by some other people, GameInterfaceAPI.SetSettingString does not respect the sv_cheats check on cheat flagged cvars.

You should be able to make much more complicated payloads, like making a custom UI or implementing a bomb timer.

### Example webserver
Just run the main.py (depends on flask). Can be made in anything, just remember the content-type header.

![](a.gif)
