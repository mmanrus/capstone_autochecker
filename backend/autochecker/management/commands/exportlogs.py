import csv
from django.utils.timezone import localdate
from django.core.management.base import BaseCommand
from autochecker.models import UserActivity

class Command(BaseCommand):
    help = "Export daily user login/logout logs to a CSV file"

    def handle(self, *args, **kwargs):
        today = localdate()
        filename = f"user_logs_{today}.csv"

        with open(filename, mode="w", newline="") as file:
            writer = csv.writer(file)
            writer.writerow(["User", "Login Time", "Logout Time", "Device Name"])
            
            logs = UserActivity.objects.filter(login_time__date=today)
            for log in logs:
                writer.writerow([log.user.get_full_name(), log.login_time, log.logout_time, log.device_name])

        self.stdout.write(self.style.SUCCESS(f"Exported logs to {filename}"))
