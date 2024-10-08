# Generated by Django 4.2 on 2024-07-06 08:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_alter_teacher_detail_alter_teacher_facebookurl_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chapter',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='chapter',
            name='remarks',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='chapter',
            name='video',
            field=models.FileField(blank=True, null=True, upload_to='chapter_videos/'),
        ),
    ]
