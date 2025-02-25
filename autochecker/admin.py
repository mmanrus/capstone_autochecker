from django.contrib import admin
from .models import Classroom, Activity, Submission, CustomUser
# Register your models here.

admin.site.register(Activity)
admin.site.register(Submission)
admin.site.register(CustomUser)
admin.site.register(Classroom)
'''
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'role', 'is_staff', 'is_active']
    ordering = ['id']

    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('role',)}),  # Ensures 'role' appears in the admin panel
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Custom Fields', {'fields': ('role',)}),
    )
    '''