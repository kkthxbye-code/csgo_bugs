@echo off

set CSGO="C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\csgo"

if exist pak01_008.vpk.wh (
	copy pak01_008.vpk.wh "%CSGO%\pak01_008.vpk.wh" /B /Y
)

cd /D %CSGO%

if not exist pak01_008.vpk.org (
	copy pak01_008.vpk pak01_008.vpk.org /B /Y
)

echo Please close the window.
pause>nul
exit
