# Generated by Django 5.0 on 2025-02-24 16:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('autochecker', '0008_remove_submission_code_submission_submitted_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='submission',
            name='submitted_file',
            field=models.FileField(default='media/submissions/default.txt', upload_to='submissions/'),
            preserve_default=False,
        ),
    ]
