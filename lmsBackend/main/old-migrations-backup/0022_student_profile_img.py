# Generated by Django 4.2 on 2024-03-24 07:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0021_studentassignment_assignmentstatus'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='profile_img',
            field=models.ImageField(null=True, upload_to='student_profile_imgs/'),
        ),
    ]
