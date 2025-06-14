import re
from django.core.exceptions import ValidationError

def validate_custom_slug(value):
    if not re.match(r'^[a-zA-Z0-9-_\/]+$', value):  # Allows letters, numbers, _, -, and /
        raise ValidationError('Only letters, numbers, underscores (_), hyphens (-), and slashes (/) are allowed.')
