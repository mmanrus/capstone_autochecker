import socket
import os
import logging
from django.contrib.auth.signals import user_logged_in, user_logged_out
import csv
from django.utils.timezone import now
from django.contrib.auth.views import LoginView
from django.contrib.auth import get_user_model, logout
import socket
from django.dispatch import receiver
from django.db.models import OuterRef, Subquery, Exists, Value, BooleanField
from datetime import datetime
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseRedirect, JsonResponse

logger = logging.getLogger(__name__)

def get_csv_filename():
    today = now().strftime("%Y-%m-%d")  # File named with the current date
    return os.path.join("logs", f"{today}.csv")

    # Ensure the logs directory exists
if not os.path.exists("logs"):
    os.makedirs("logs")

# Capture login event
@receiver(user_logged_in)
def log_user_login(sender, request, user, **kwargs):
    device_name = socket.gethostname()  # Get remote PC name
    timestamp = now().strftime("%Y-%m-%d %H:%M:%S")
    full_name = f"{user.last_name}, {user.first_name}"
    csv_file = get_csv_filename()
    is_new_file = not os.path.exists(csv_file)
    with open(csv_file, mode="a", newline="") as file:
        writer = csv.writer(file)
        
        # Write header if file is new
        if is_new_file:
            writer.writerow(["Username", "Device", "Login Time", "Logout Time"])
        
        # Write login data
        writer.writerow([full_name, device_name, timestamp, ""])
@csrf_exempt  # Allow CSRF bypass only for logout (since CSRF is sent in JS)
@require_POST  # Ensure logout is only done via POST request
def auto_logout(request):
    if request.user.is_authenticated:
        logout(request)
        return JsonResponse({"message": "User logged out successfully"}, status=200)
    return JsonResponse({"error": "User is not logged in"}, status=400)

@receiver(user_logged_out)
def log_user_logout(sender, request, user, **kwargs):
    if user is None:  # Fix: Ensure user is not None
        return  
    device_name = socket.gethostname()
    timestamp = now().strftime("%Y-%m-%d %H:%M:%S")
    full_name = f"{user.last_name}, {user.first_name}"
    csv_file = get_csv_filename()
    updated_rows = []


    # Update the last row where the logout time is empty
    if os.path.exists(csv_file):
        with open(csv_file, mode="r") as file:
            reader = csv.reader(file)
            rows = list(reader)

        for row in rows:
            if row and row[0] == full_name and row[1] == device_name and row[3] == "":
                row[3] = timestamp  # Update logout time
            updated_rows.append(row)

        # Rewrite updated CSV
        with open(csv_file, mode="w", newline="") as file:
            writer = csv.writer(file)
            writer.writerows(updated_rows)