# Capstone AutoChecker Backend

A Django-based backend for auto-checking assignments.

---

## 🚀 Getting Started

This guide is for developers who want to run or contribute to the backend.  
Follow the steps below — even if you've never used Django before.

---

### 1. 📦 Install Python

Make sure Python 3.8 or higher is installed:

     python --version

     If not, download and install it from:
          👉 https://www.python.org/downloads/

### 2. 📁 Clone the Repository

     In your terminal or Git Bash:

     git clone https://github.com/mmanrus/capstone_autochecker.git
     cd capstone_autochecker

### 3. 🧪 Set Up a Virtual Environment (Recommended)

     For macOS/Linux:

          python3 -m venv venv
          source venv/bin/activate

     For Windows:
          python -m venv venv
          venv\Scripts\activate

### 4. 📥 Install Dependencies

     Make sure you\'re in the backend/ directory:
          cd backend
          pip install -r requirements.txt

### 5. ⚙️ Run Database Migrations

     python manage.py migrate

### 6. 🖥️ Start the Development Server

     python manage.py runserver
