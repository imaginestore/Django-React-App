# Generated by Django 4.2 on 2024-02-22 16:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_remove_student_pobox'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='coursecategory',
            options={'verbose_name_plural': '2. Course categories'},
        ),
        migrations.AddField(
            model_name='course',
            name='featured_img',
            field=models.ImageField(null=True, upload_to='course_imgs/'),
        ),
        migrations.AddField(
            model_name='course',
            name='techs',
            field=models.TextField(null=True),
        ),
    ]
