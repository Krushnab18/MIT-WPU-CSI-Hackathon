from flask import Flask, render_template, request, redirect, url_for, jsonify
import os
from werkzeug.utils import secure_filename
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



# pdf Upload 
UPLOAD_FOLDER = 'uploads'  # Folder where uploaded files will be stored
ALLOWED_EXTENSIONS = {'pdf'}  # Only allow PDF files

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Configure app
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Max file size is 16 MB

# Helper function to check file extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload-pdf', methods=['POST'])
def upload_pdf():
    if 'pdfFile' not in request.files:
        return jsonify({'message': 'No file part'}), 400

    file = request.files['pdfFile']

    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        # Secure the filename and save the file
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        return jsonify({'message': 'PDF uploaded successfully!', 'file': filename}), 200
    else:
        return jsonify({'message': 'Invalid file type. Only PDF files are allowed.'}), 400




# Run the app
if __name__ == '__main__':
    app.run(debug=True, port=3000)
