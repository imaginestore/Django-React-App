# Generated by Django 4.2 on 2024-02-02 17:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_rename_phoneno_teacher_mobileno_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='teacher',
            name='poBox',
        ),
        migrations.RemoveField(
            model_name='teacher',
            name='province',
        ),
    ]
