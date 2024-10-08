# Generated by Django 4.2 on 2024-07-09 09:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0006_alter_chapter_description_alter_chapter_remarks_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student',
            name='interestedCategories',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='student',
            name='login_via_otp',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
        migrations.AlterField(
            model_name='student',
            name='otp_digits',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='student',
            name='profile_img',
            field=models.ImageField(blank=True, null=True, upload_to='student_profile_imgs/'),
        ),
        migrations.AlterField(
            model_name='student',
            name='verify_status',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
    ]
