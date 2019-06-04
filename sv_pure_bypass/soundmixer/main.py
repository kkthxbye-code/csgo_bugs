import psutil
import time

with open("soundmixers.txt", "rb") as f:
	original_soundmixer = f.read()

soundmixer_path = r"D:\Steam\steamapps\common\Counter-Strike Global Offensive\csgo\scripts\soundmixers.txt"

start_delay = 20 #csgo startup time in seconds

def get_csgo_runtime():
	for process in psutil.process_iter():
		if process.name() == "csgo.exe":
			uptime = process.create_time()
			
			runtime = time.time()-uptime
			
			return runtime

	return False

def wait_for_csgo_close():
	print("Waiting for CSGO to close.")

	while True:
		found = False

		for process in psutil.process_iter():
			if process.name() == "csgo.exe":
				found = True

		if not found:
			return True

		time.sleep(5)

while True:
	runtime = get_csgo_runtime()

	# CSGO not running, make sure we have original soundmixer.txt
	if not runtime:
		print("CSGO not running, replace with original.")
		with open(soundmixer_path, "wb") as f:
			f.write(original_soundmixer)

	# Replace soundmixers.txt with custom one
	if runtime > start_delay:
		print("CSGO Running, replacing soundmixers.txt")

		with open("soundmixers_custom.txt", "rb") as f:
			custom_soundmixer = f.read()

		with open(soundmixer_path, "wb") as f:
			f.write(custom_soundmixer)

		wait_for_csgo_close()
	elif runtime and runtime <= start_delay:
		print("Waiting for csgo.exe to reach runtime of {}".format(start_delay))

	print("Sleeping...")
	time.sleep(2)
	
