from flask import Flask, render_template, make_response, request
app = Flask(__name__)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
	resp = make_response(render_template("index.html"))

	resp.headers["content-type"] = "application/rss+xml; charset=UTF-8"
	resp.headers["status"] = "200"

	return resp

app.run(port=80, debug=True)