@echo off

set CSGO_BAK="C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\csgo_bak"

cd /D %CSGO_BAK%

copy pak01_008.vpk.org pak01_008.vpk /B /Y

echo Please close the window.
pause>nul
exit
