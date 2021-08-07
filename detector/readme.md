## Sound detector (Windows only)

### История создания

Я наткнулся на видео [Deposita](youtube.com/watch?v=k8D8jAklUus&t=310s) где он с помощью субтитров отслеживал все звуки которые воспроизводились на карте. Относительно недавно ее пофиксили и я решил сделать похожую версию этого детектора. В игре есть примерно 4 звука которые воспроизводят попадание в тело и 2 звука при попадании в голову:
```
flesh_impact_bullet1.wav
flesh_impact_bullet2.wav
flesh_impact_bullet3.wav
flesh_impact_bullet4.wav
headshot1.wav
headshot2.wav
```
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
  Осталось просто эти звуки отследить с помощью чтение консоли с этим мне помогли 2 моих друга:
  
  [@Dmax]()
  
  [@merely04](https://github.com/merely04)
  
  Теперь все попадания выводит в чат и есть 2 минуса:
  * На сообщения в чат csgo есть кд
  * На карте регистрирует все попадания и противников в том числе

### Инструкция по установке

1) Устанавливаем по ссылочке dokan library [dokan](github.com/dokan-dev/dokany/releases/tag/v1.5.0.3000)
2) Устанавливаем по ссылочке [node js](nodejs.org/en)
3) Устанавливаем по ссылочке мой архив 
4) Распоковываем мой архив ~steamapps\common\Counter-Strike Global Offensive по этому пути
5) Переименуйте папку csgo в csgo_bugs
6) Создайте новую папку csgo (обязательно пустую)
7) Откройте папку detector и измените файл mirror.cmd
8) По примеру 
 ``` 
c:
cd C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\detector
mirror.exe /r "C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\csgo_bugs" /l "C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\csgo"
```
9) 1 строка показывает это диск
10) 2 строка переходит папку detector
11) Запуск программы mirror.exe и создание зеркальной папки csgo_bugs в пустую папку csgo
12) Если все правильно записано и все папки соответствуют путям на диске, то запустите mirror.cmd от имени администратора, который расположен по этому пути ```~Steam\steamapps\common\Counter-Strike Global Offensive\detector```. 
13) Запускаем, который расположен по этому пути ~Steam\steamapps\common\Counter-Strike Global Offensive\detector hitdetector.js 
14) Запускаем steam
15) Заходим в свойства csgo и в параметры запуска пишем -netconport 2121
16) Запускаем csgo
17) Запускаем карту
18) Если зашли на карту запускаем onsound.cmd, который расположен по этому пути ```~Steam\steamapps\common\Counter-Strike Global Offensive\detector```
19) Заходим в настройки csgo /звуки,музыка/ и меняем свое звуковое устройство на другое Пример: с динамиков на наушники
20) Все теперь при попадании в enemy регистрирует попадание и выводит это в чат
