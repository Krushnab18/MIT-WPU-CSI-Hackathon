from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# Dummy users for demonstration
users = {
    "manager@t2030.com": {
        "team_id": "teamAI12",
        "role": "manager",
        "password": "password1234"
    },
    "Arun@2030.com": {
        "team_id": "teamAI12",
        "role": "employee",
        "password": "password12"
    }
}

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        team_email = request.form['team_email']
        team_id = request.form['team_id']
        role = request.form['role']
        password = request.form['password']

        # Check if user exists
        user = users.get(team_email)
        
        if user and user['team_id'] == team_id and user['role'] == role and user['password'] == password:
            return redirect(url_for('dashboard', user=team_email))
        else:
            return render_template('login.html', error="Invalid credentials, please try again.")
    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    user = request.args.get('user')
    return render_template('dashboard.html')
@app.route('/team')
def team():
    return render_template("team.html")

@app.route('/data')
def data():
    return render_template("data.html")


# Run the app
if __name__ == '__main__':
    app.run(debug=True, port=3000)
