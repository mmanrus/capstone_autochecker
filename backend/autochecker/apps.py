from django.apps import AppConfig



class AutocheckerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'autochecker'

    def ready(self):
        import autochecker.signals
