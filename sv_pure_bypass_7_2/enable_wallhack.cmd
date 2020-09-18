@echo off

set CSGO_BAK="C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\csgo_bak"

cd %CSGO_BAK%

copy pak01_008.vpk.wh pak01_008.vpk /y

echo Please close the window.
pause>nul
exit
