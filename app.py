from flask import Flask, render_template, request, jsonify


app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")


# Run the app
if __name__ == '__main__':
    app.run(debug=True)
