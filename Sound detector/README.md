## Sound detector (Windows only)

### История создания

Я наткнулся на видео [Deposita](youtube.com/watch?v=k8D8jAklUus&t=310s) где он с помощью субтитров отслеживал все звуки которые воспроизводились на карте. Относительно недавно ее пофиксили и я решил сделать похожую версию этого детектора. В игре есть примерно 4 звука которые воспроизводят попадание в тело и 2 звука при попадании в голову:

[flesh_impact_bullet1.wav](https://drive.google.com/file/d/12Y5X0ZR6GF5uz4d--aYQguCAH-NrS0ZJ/view?usp=sharing)

[flesh_impact_bullet2.wav](https://drive.google.com/file/d/1bc7g1q9YfYtxK4lW1zb4gH_CHJy3cXnv/view?usp=sharing)

[flesh_impact_bullet3.wav](https://drive.google.com/file/d/1MJty-W2LITEGFayW_BVWjUbSybPDQfaB/view?usp=sharing)

[flesh_impact_bullet4.wav](https://drive.google.com/file/d/1HOdiBMSz--VDlGj6vvtsa_xoBjgMZNfN/view?usp=sharing)

[headshot1.wav](https://drive.google.com/file/d/1L7-eAzeeF_OVk1TKi0xlq2UQVfkCFMkw/view?usp=sharing)

[headshot2.wav](https://drive.google.com/file/d/1V3-yVTHoDKA1Piq4Zzt1bCyecygZzLla/view?usp=sharing)

И чтобы узнать появлялся этот звук или нет я просто удалил их из файлов игры, чтобы консоль писала мне об ошибке, что такого файла нет:
 ```
  "[Sound] S_StartSound(): Failed to load sound '~physics\\flesh\\flesh_impact_bullet1.wav'. File is missing from disk or is invalid.",
  "[Sound] S_StartSound(): Failed to load sound '~physics\\flesh\\flesh_impact_bullet2.wav'. File is missing from disk or is invalid.",
  "[Sound] S_StartSound(): Failed to load sound '~physics\\flesh\\flesh_impact_bullet3.wav'. File is missing from disk or is invalid.",
  "[Sound] S_StartSound(): Failed to load sound '~physics\\flesh\\flesh_impact_bullet4.wav'. File is missing from disk or is invalid.",
  "[Sound] S_StartSound(): Failed to load sound '~)player\\headshot2.wav'. File is missing from disk or is invalid.",
  "[Sound] S_StartSound(): Failed to load sound '~)player\\headshot1.wav'. File is missing from disk or is invalid.",
  "S_StartSound: Invalid sample rate (48000) for sound '~physics\\metal\\flesh_impact_bullet1.wav'.",
  "S_StartSound: Invalid sample rate (48000) for sound '~physics\\metal\\flesh_impact_bullet2.wav'.",
  "S_StartSound: Invalid sample rate (48000) for sound '~physics\\metal\\flesh_impact_bullet3.wav'.",
  "S_StartSound: Invalid sample rate (48000) for sound '~physics\\metal\\flesh_impact_bullet4.wav'.",
  "S_StartSound: Invalid sample rate (48000) for sound '~physics\\metal\\flesh_impact_bullet5.wav'.",
  "S_StartSound: Invalid sample rate (12000) for sound '~physics\\flesh\\flesh_impact_bullet1.wav'.",
  "S_StartSound: Invalid sample rate (12000) for sound '~physics\\flesh\\flesh_impact_bullet2.wav'.",
  "S_StartSound: Invalid sample rate (12000) for sound '~physics\\flesh\\flesh_impact_bullet3.wav'.",
  "S_StartSound: Invalid sample rate (12000) for sound '~physics\\flesh\\flesh_impact_bullet4.wav'.",
  "S_StartSound: Invalid sample rate (12000) for sound '~physics\\flesh\\flesh_impact_bullet5.wav'.",
  ```
  Осталось просто эти звуки отследить с помощью чтение консоли с этим мне помогли 2 моих друга:[@Dmax](),[@merely04](https://github.com/merely04)
  
  Теперь все попадания выводит в чат и есть 2 минуса:
  * На сообщения в чат ```csgo``` есть кд
  * На карте регистрирует все попадания и противников в том числе

### Инструкция по установке

1) Устанавливаем по ссылочке [dokan library](github.com/dokan-dev/dokany/releases/tag/v1.5.0.3000)
2) Устанавливаем по ссылочке [node js](https://nodejs.org/en) (по выбору)
3) Устанавливаем по ссылочке [мой архив](https://drive.google.com/file/d/1ELmuu1K0CAKvuN5gQQJZaFLKyq38Rg1W/view?usp=sharing)
4) Распоковываем мой архив ```~steamapps\common\Counter-Strike Global Offensive по этому пути```
5) Переименуйте папку ```csgo``` в ```csgo_bugs```
6) Создайте новую папку ```csgo``` (обязательно пустую)
7) Откройте папку detector и измените файл ```mirror.cmd```
8) По примеру 
``` 
c:
cd C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\detector
mirror.exe /r "C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\csgo_bugs" /l "C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\csgo"
```
9) 1 строка показывает это диск
   2 строка переходит папку detector
   Запуск программы ```mirror.exe``` и создание зеркальной папки ```csgo_bugs``` в пустую папку ```csgo```
10) Если все правильно записано и все папки соответствуют путям на диске, то запустите mirror.cmd от имени администратора, который расположен по этому пути ```~Steam\steamapps\common\Counter-Strike Global Offensive\detector```. 
11) Запускаем, который расположен по этому пути ```~Steam\steamapps\common\Counter-Strike Global Offensive\detector``` ```hitdetector.js ```
11.2) Если не установили node js, то просто запускаем ```~Steam\steamapps\common\Counter-Strike Global Offensive\detector``` ```hitdetector.exe```
12) Запускаем ```steam```
13) Заходим в свойства csgo и в параметры запуска пишем ```-netconport 2121```
14) Запускаем ```csgo```
15) Запускаем карту
16) Если зашли на карту запускаем ```onsound.cmd```, который расположен по этому пути ```~Steam\steamapps\common\Counter-Strike Global Offensive\detector```
17) Заходим в настройки ```csgo``` /звуки,музыка/ и меняем свое звуковое устройство на другое Пример: с динамиков на наушники
18) Все теперь при попадании в enemy регистрирует попадание и выводит это в чат

###  Авторы
[@Billar42](https://github.com/Billar42) За создания vpk, которые игнорируют звуки

[@Deposit](https://www.youtube.com/c/DepoSitorium/) За идею создания sound detector

[@Dmax]() Написал node js скрипт которые отслеживает переменные в консоли

[@Merely04](https://github.com/merely04) Написал c# код который отслеживает переменные в консоли
