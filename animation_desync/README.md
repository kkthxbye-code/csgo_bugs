## Animation desync / fake angles bug

When Valve "patched" fake angles 2 years ago, they didn't do it properly. Instead of the server animating the last usercmd in a batch, the server animates all sent cmds in a batch, which therefore still desynchronizes the hitboxes between client and server because the client recieves wrong data.

#### How to do it

Inject any cheat with antiaims while in -insecure and test it out for yourself.

#### Demonstration and explanation

![](example.gif)

The normal model is where our actual hitboxes are in this case and the colored model is where our desynced hitboxes are.
This exploit, if done like in the gif, is invisible to Overwatch. (Basically Legit AA but with a smalller range.)

#### Suggsted fixes

1. https://github.com/click4dylan/CSGO_FakeAngleFix really simple fix, explained more in detail here: https://www.unknowncheats.me/forum/counterstrike-global-offensive/331325-tickbase-manipulation.html
2. https://i.imgur.com/ooBl57i.png

#### Reasoning for reposting the same information in this reposting

This exploit basically makes CS:GO unplayable in low to mid trust-factor and as it is invisible to Overwatch, you can't just report the enemy for using it because nothing will happen. It's one of the reasons CS:GO is the cheater hellhole it currently is. This is the only repo I've seen that actually gets Valve's attention, so I'm trying my luck at finally getting this fixed.
