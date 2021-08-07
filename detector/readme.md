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
