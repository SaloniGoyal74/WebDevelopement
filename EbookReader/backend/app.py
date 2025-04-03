from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Database Connection
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",   # Change if your MySQL server is on a different host
        user="root",        # Your MySQL username
        password="Mani@123",  # Your MySQL password
        database="student_db"  # Your database name
    )

# Initialize Database (Run this once)
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("CREATE DATABASE IF NOT EXISTS student_db")
    cursor.execute("USE student_db")
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            roll VARCHAR(50) UNIQUE NOT NULL,
            address VARCHAR(255),
            class VARCHAR(50),
            student_id VARCHAR(50) UNIQUE NOT NULL
        )
    """)
    conn.commit()
    conn.close()

init_db()

@app.route('/add_student', methods=['POST'])
def add_student():
    data = request.json
    name = data.get("name")
    roll = data.get("roll")
    address = data.get("address")
    class_name = data.get("class")
    student_id = data.get("student_id")
    
    # Validate that all fields are provided
    if not name or not roll or not address or not class_name or not student_id:
        return jsonify({"message": "All fields are required!"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO students (name, roll, address, class, student_id)
            VALUES (%s, %s, %s, %s, %s)
        """, (name, roll, address, class_name, student_id))
        conn.commit()
        return jsonify({"message": "Student added successfully!"}), 201
    except mysql.connector.IntegrityError:
        return jsonify({"message": "Student with this roll number or student ID already exists!"}), 400
    finally:
        conn.close()

@app.route('/get_students', methods=['GET'])
def get_students():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT name, roll, address, class, student_id FROM students")
    students = cursor.fetchall()
    conn.close()
    return jsonify(students)

@app.route('/get_student/<roll>', methods=['GET'])
def get_student(roll):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM students WHERE roll = %s", (roll,))
    student = cursor.fetchone()
    conn.close()
    if student:
        return jsonify({
            "id": student[0],
            "name": student[1],
            "roll": student[2],
            "address": student[3],
            "class": student[4],
            "student_id": student[5]
        })
    return jsonify({"message": "Student not found!"}), 404

if __name__ == '__main__':
    app.run(debug=True)
