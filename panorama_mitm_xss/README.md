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
The following payload will wait 45 seconds and then activate r_drawothermodels 2, giving wallhack. You can make much more complicated payloads, like making a custom UI or implementing a bomb timer.
```		
<link>https://blah.io/test"); $.Schedule( 45.0, _ => {GameInterfaceAPI.SetSettingString("r_drawothermodels", "2");} );//</link>
```

### Example webserver
Just run the main.py (depends on flask). Can be made in anything, just remember the content-type header.