import getpass
import os
import requests


URL = 'http://127.0.0.1:800/autocheck'

def if_logged_in():
     username = os.getenv('AUTOCHECK_USER')
     token = os.getenv('AUTOCHECK_TOKEN')
     
     return username, token if username and token else None

def send_code(file_path):
     
     username, token = if_logged_in()
     
     if not username:
          print("❌ Error 403: You are not logged in. Please log in first.")
          return
     if not os.path.exists(file_path):
          print('❌ Error 404: File not found.')
          return
     
     with open(file_path, 'r') as f:
          code_content = f.read()
          
     data = {
          "username": username,
          "assignment": file_path
     }
     
     files = {'code_file': (os.path.basename(file_path), code_content)}
     
     response = requests.post(URL, data=data, files=files)
     
     if response.status_code == 200:
          print(response.json()["message"])
     else:
          print(f"❌ Server Error: {response.text}")
          
if __name__ == '__main__':
     import sys
     if len(sys.args) > 2:
          print("Usage: autocheck10 <assignmentpath>")
     else:
          send_code(sys.args[1])
