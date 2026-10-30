from flask import Flask, request, jsonify
import os

app = Flask(__name__)

# Simulated database of student face encodings
# In a real app, you would fetch these from a database
STORED_FACES_DIR = "stored_faces"

@app.route('/verify-face', methods=['POST'])
def verify_face():
    # 1. Check if the POST request has the file part
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    image_file = request.files['image']
    student_id = request.form.get('studentId')

    if image_file.filename == '':
        return jsonify({"error": "Empty file provided"}), 400
    
    if not student_id:
        return jsonify({"error": "studentId is required"}), 400

    try:
        # --- BOILERPLATE FOR FACE RECOGNITION (Requires 'face_recognition' library) ---
        # import face_recognition
        
        # 2. Load the uploaded image
        # unknown_image = face_recognition.load_image_file(image_file)
        # unknown_encoding = face_recognition.face_encodings(unknown_image)[0]
        
        # 3. Load the stored target student face
        # known_image = face_recognition.load_image_file(f"{STORED_FACES_DIR}/{student_id}.jpg")
        # known_encoding = face_recognition.face_encodings(known_image)[0]
        
        # 4. Compare the faces
        # results = face_recognition.compare_faces([known_encoding], unknown_encoding)
        # is_match = bool(results[0])
        
        # Simulated logic for boilerplate:
        is_match = True 

        return jsonify({
            "studentId": student_id,
            "verified": is_match,
            "message": "Face matched successfully" if is_match else "Face does not match"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
