# Generated by Django 5.0 on 2025-02-24 16:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('autochecker', '0007_alter_activity_instructions'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='submission',
            name='code',
        ),
        migrations.AddField(
            model_name='submission',
            name='submitted_file',
            field=models.FileField(blank=True, null=True, upload_to='submissions/'),
        ),
    ]
