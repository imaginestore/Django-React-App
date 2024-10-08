# Generated by Django 4.2 on 2024-03-25 04:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0023_alter_student_password'),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('notifText', models.TextField()),
                ('notifFor', models.CharField(max_length=200)),
                ('notifCreatedTime', models.DateTimeField(auto_now_add=True)),
                ('notifReadStatus', models.BooleanField(default=False)),
            ],
        ),
    ]
