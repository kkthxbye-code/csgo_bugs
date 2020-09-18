#!/bin/bash

if [ -f pak01_008.vpk.wh ]; then
	mv pak01_008.vpk.wh ~/.local/share/Steam/steamapps/common/Counter-Strike\ Global\ Offensive/csgo/pak01_008.vpk.wh
fi

cd ~/.local/share/Steam/steamapps/common/Counter-Strike\ Global\ Offensive/csgo

if [ ! -f pak01_008.vpk.org ]; then
	mv pak01_008.vpk pak01_008.vpk.org
fi
