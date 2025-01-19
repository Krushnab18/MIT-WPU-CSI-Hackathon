from flask import Flask, render_template, request, redirect, url_for, jsonify

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
        if user and user['team_id'] == team_id and user['password'] == password:
            if user['role'] == "manager":
                return render_template('manage.html')
            elif user['role'] == "employee":
                return render_template('dashboard.html')

        else:
            return render_template('login.html', error="Invalid credentials, please try again.")
    return render_template('login.html')


@app.route('/dashboard')
def dashboard():
    user = request.args.get('user')
    return render_template('dashboard.html')

@app.route('/manage')
def manage():
    return render_template('manage.html')
@app.route('/team')
def team():
    return render_template("team.html")

@app.route('/data')
def data():
    return render_template("data.html")




# File to store tasks
TASK_FILE = 'tasks.txt'

@app.route('/save-task', methods=['POST'])
def save_task():
    data = request.get_json()
    employee_name = data.get('employeeName')
    task_description = data.get('taskDescription')

    if not employee_name or not task_description:
        return jsonify({'error': 'Invalid data'}), 400

    # Append the task to the file
    with open(TASK_FILE, 'a') as f:
        f.write(f'{employee_name}: {task_description}\n')

    return jsonify({'message': 'Task saved successfully'}), 200


@app.route('/tasks', methods=['GET'])
def tasks_page():
    return render_template('task.html')


@app.route('/get-tasks', methods=['GET'])
def get_tasks():
    try:
        with open(TASK_FILE, 'r') as f:
            tasks = f.readlines()
        return jsonify({'tasks': tasks}), 200
    except FileNotFoundError:
        return jsonify({'tasks': []}), 200






# Run the app
if __name__ == '__main__':
    app.run(debug=True, port=3000)
